import { allProjects, type ProjectItem } from '../data/projectsData';
import { allSolutionsAndServices } from '../data/servicesData';
import type { ServiceItemData } from '../data/servicesData';
import { api } from './apiClient';

export interface TestimonialItem {
  id: string;
  quote: string;
  quoteId: string;
  author: string;
  role: string;
  company: string;
  location: string;
  rating?: number;
  avatar?: string;
  isPublished?: boolean;
}

type CmsResource = 'services' | 'projects' | 'testimonials';
type RetryState = { count: number; timer: number | null };

let cmsServicesCache: ServiceItemData[] | null = null;
let cmsProjectsCache: ProjectItem[] | null = null;
let cmsTestimonialsCache: TestimonialItem[] | null = null;
let cmsServicesRequest: Promise<ServiceItemData[]> | null = null;
let cmsProjectsRequest: Promise<ProjectItem[]> | null = null;
let cmsTestimonialsRequest: Promise<TestimonialItem[]> | null = null;

const cmsRetryState: Record<CmsResource, RetryState> = {
  services: { count: 0, timer: null },
  projects: { count: 0, timer: null },
  testimonials: { count: 0, timer: null }
};

const cmsHydrated: Record<CmsResource, boolean> = {
  services: false,
  projects: false,
  testimonials: false
};

export const CMS_EVENT_KEY = 'kapitech_cms_updated';

/**
 * Local homepage fallback matching the testimonials already seeded by AMS
 * (db/postgres/037_cms_seed_testimonials.sql). This keeps social proof visible
 * when the live CMS endpoint returns an empty collection or is temporarily unavailable.
 * Non-empty published CMS content always takes precedence.
 */
export const defaultTestimonials: TestimonialItem[] = [
  {
    id: 't_01',
    quote: 'Kapitech built our real estate portal from scratch using Next.js. The page load speed is blazing fast and our inbound lead conversions increased by 45% within the first month.',
    quoteId: 'Kapitech membangun portal real estate kami dari nol menggunakan Next.js. Kecepatan loading halamannya luar biasa cepat dan konversi prospek kami meningkat 45% dalam bulan pertama.',
    author: 'Marcus Thorne',
    role: 'Managing Director',
    company: 'Lumina Real Estate',
    location: 'Jakarta, Indonesia',
    rating: 5,
    isPublished: true,
  },
  {
    id: 't_02',
    quote: 'Their design team has an exceptional eye for modern typography and layout. They delivered a cohesive brand identity and a stunning web experience that elevated our firm completely.',
    quoteId: 'Tim desain mereka memiliki keahlian luar biasa dalam tipografi dan tata letak modern. Mereka menghadirkan identitas brand yang sangat kohesif dan pengalaman web yang memukau.',
    author: 'Sarah Chen',
    role: 'Creative Director',
    company: 'Aura Creative Studio',
    location: 'Singapore',
    rating: 5,
    isPublished: true,
  },
  {
    id: 't_03',
    quote: 'Working with Kapitech on our mobile banking interface was seamless. They simplified complex account journeys and delivered pixel-perfect Figma specs ready for our dev squad.',
    quoteId: 'Bekerja dengan Kapitech untuk antarmuka mobile banking sangat lancar. Mereka menyederhanakan alur pengguna yang kompleks dan menyerahkan spesifikasi Figma yang presisi untuk tim developer kami.',
    author: 'David Miller',
    role: 'Head of Product',
    company: 'Nexus Fintech',
    location: 'Hong Kong',
    rating: 5,
    isPublished: true,
  },
  {
    id: 't_04',
    quote: 'The solar energy monitoring dashboard Kapitech engineered gave our operations team instant visibility across 40+ solar farms with zero lag. Highly dependable engineering.',
    quoteId: 'Dashboard monitoring energi surya yang dikembangkan Kapitech memberi tim operasi kami visibilitas langsung di lebih dari 40 ladang surya tanpa lag. Rekayasa yang sangat andal.',
    author: 'Elena Rodriguez',
    role: 'Operations VP',
    company: 'Solaris CleanTech',
    location: 'Melbourne, Australia',
    rating: 5,
    isPublished: true,
  },
  {
    id: 't_05',
    quote: 'Our headless Shopify migration handled our flash sale traffic peaks without a hitch. Checkout conversion increased by 38%. Kapitech delivers genuine business results.',
    quoteId: 'Migrasi Shopify headless kami menangani lonjakan traffic flash sale tanpa hambatan. Konversi checkout meningkat 38%. Kapitech memberikan hasil bisnis nyata.',
    author: 'Julian Vane',
    role: 'Founder & CEO',
    company: 'Vivid Commerce',
    location: 'Jakarta, Indonesia',
    rating: 5,
    isPublished: true,
  },
  {
    id: 't_06',
    quote: 'Clear milestones, proactive communication, and zero technical fluff. Kapitech is our go-to partner whenever we need to launch a new digital product on a tight timeline.',
    quoteId: 'Milestone yang jelas, komunikasi proaktif, dan tanpa basa-basi teknis. Kapitech adalah mitra andalan kami setiap kali kami perlu meluncurkan produk digital dalam jadwal ketat.',
    author: 'Michael Kross',
    role: 'Chief Technology Officer',
    company: 'Kross Cloud Systems',
    location: 'Kuala Lumpur, Malaysia',
    rating: 5,
    isPublished: true,
  },
];

function extractCmsCollection<T>(payload: unknown, collectionKey: string): T[] | null {
  let current: unknown = payload;

  for (let depth = 0; depth < 4; depth += 1) {
    if (Array.isArray(current)) return current as T[];
    if (!current || typeof current !== 'object') return null;

    const record = current as Record<string, unknown>;
    const collection = record[collectionKey] ?? record.items ?? record.records;
    if (Array.isArray(collection)) return collection as T[];

    const nested = record.data ?? record.result ?? record.payload;
    if (!nested || nested === current) return null;
    current = nested;
  }

  return null;
}

function getStaticServiceFallback(): ServiceItemData[] {
  return allSolutionsAndServices.map((service) => ({
    ...service,
    metrics: [],
    testimonial: undefined,
    caseStudySlugs: [],
  }));
}

function notifyCmsUpdate(type: CmsResource): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CMS_EVENT_KEY, { detail: { type } }));
  }
}

function clearCmsRetry(type: CmsResource): void {
  const state = cmsRetryState[type];
  state.count = 0;
  if (state.timer !== null && typeof window !== 'undefined') {
    window.clearTimeout(state.timer);
  }
  state.timer = null;
}

function scheduleCmsHydrationRetry(type: CmsResource, retry: () => void): void {
  if (typeof window === 'undefined') return;
  const state = cmsRetryState[type];
  if (state.timer !== null || state.count >= 6) return;
  const delay = Math.min(30000, 2500 * 2 ** state.count);
  state.count += 1;
  state.timer = window.setTimeout(() => {
    state.timer = null;
    retry();
  }, delay);
}

function markCmsHydrationSuccess(type: CmsResource): void {
  cmsHydrated[type] = true;
  clearCmsRetry(type);
}

function setCmsCache(
  type: CmsResource,
  value: ServiceItemData[] | ProjectItem[] | TestimonialItem[],
): void {
  if (type === 'services') cmsServicesCache = value as ServiceItemData[];
  if (type === 'projects') cmsProjectsCache = value as ProjectItem[];
  if (type === 'testimonials') cmsTestimonialsCache = value as TestimonialItem[];
  markCmsHydrationSuccess(type);
  notifyCmsUpdate(type);
}

export function getCmsServices(): ServiceItemData[] {
  return cmsServicesCache || (cmsServicesCache = getStaticServiceFallback());
}

export function fetchServerCmsServices(): Promise<ServiceItemData[]> {
  if (cmsServicesRequest) return cmsServicesRequest;
  cmsServicesRequest = (async () => {
    try {
      const res = await api.cms.getServices();
      if (res.success && Array.isArray(res.data?.services) && res.data.services.length > 0) {
        // Prevent draft CMS services from becoming publicly routable/SEO-indexed
        // if the upstream endpoint accidentally includes unpublished records.
        const services = res.data.services.filter((service) => service?.isPublished !== false);
        if (services.length > 0) {
          setCmsCache('services', services);
          return services;
        }
      }
    } catch {
      // Keep the local curated dataset while the server recovers.
    }
    scheduleCmsHydrationRetry('services', () => { void fetchServerCmsServices(); });
    return getCmsServices();
  })().finally(() => { cmsServicesRequest = null; });
  return cmsServicesRequest;
}

export function getCmsProjects(): ProjectItem[] {
  // Keep the public portfolio usable during CMS outages or when the CMS collection is empty.
  return cmsProjectsCache && cmsProjectsCache.length > 0 ? cmsProjectsCache : allProjects;
}

export function fetchServerCmsProjects(): Promise<ProjectItem[]> {
  if (cmsProjectsRequest) return cmsProjectsRequest;
  cmsProjectsRequest = (async () => {
    try {
      const res = await api.cms.getProjects();
      const projects = res.success
        ? extractCmsCollection<ProjectItem>(res.data, 'projects')
        : null;
      if (projects) {
        // The public API should normally return published records only, but
        // never expose a draft/unpublished project if an upstream response
        // accidentally includes one. Keep the static fallback if all are drafts.
        const publishedProjects = projects.filter((project) => project?.isPublished !== false);
        setCmsCache('projects', publishedProjects);
        return publishedProjects;
      }
    } catch {
      // Keep the empty CMS state visible until the server recovers.
    }
    scheduleCmsHydrationRetry('projects', () => { void fetchServerCmsProjects(); });
    return getCmsProjects();
  })().finally(() => { cmsProjectsRequest = null; });
  return cmsProjectsRequest;
}

export function getCmsTestimonials(): TestimonialItem[] {
  return cmsTestimonialsCache || (cmsTestimonialsCache = defaultTestimonials);
}

export function fetchServerCmsTestimonials(): Promise<TestimonialItem[]> {
  if (cmsTestimonialsRequest) return cmsTestimonialsRequest;
  cmsTestimonialsRequest = (async () => {
    try {
      const res = await api.cms.getTestimonials();
      const testimonials = res.success
        ? extractCmsCollection<TestimonialItem>(res.data, 'testimonials')
        : null;
      if (testimonials) {
        // Keep draft records out of the public cache. An empty/draft-only result
        // falls back to the seeded testimonials instead of rendering an empty state.
        const publishedTestimonials = testimonials.filter((item) => item?.isPublished !== false);
        const resolvedTestimonials = publishedTestimonials.length > 0
          ? publishedTestimonials
          : defaultTestimonials;
        cmsTestimonialsCache = resolvedTestimonials;
        markCmsHydrationSuccess('testimonials');
        notifyCmsUpdate('testimonials');
        return resolvedTestimonials;
      }
    } catch {
      // Keep local seeded testimonials available while the server recovers.
    }
    scheduleCmsHydrationRetry('testimonials', () => { void fetchServerCmsTestimonials(); });
    return getCmsTestimonials();
  })().finally(() => { cmsTestimonialsRequest = null; });
  return cmsTestimonialsRequest;
}

function retryUnhydratedCms(): void {
  if (typeof window === 'undefined') return;
  if (!cmsHydrated.services && cmsServicesRequest === null) void fetchServerCmsServices();
  if (!cmsHydrated.projects && cmsProjectsRequest === null) void fetchServerCmsProjects();
  if (!cmsHydrated.testimonials && cmsTestimonialsRequest === null) void fetchServerCmsTestimonials();
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', retryUnhydratedCms);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') retryUnhydratedCms();
  });
}
