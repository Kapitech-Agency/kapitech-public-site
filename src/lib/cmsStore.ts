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
let cmsProjectsHasExplicitUnpublishedRecords = false;
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
// Testimonials require explicit CMS publication. Do not fall back to unverified sample quotes.
export const defaultTestimonials: TestimonialItem[] = [];

const PUBLIC_PROJECT_SERVICES = new Set<ProjectItem['service']>([
  'UI/UX Design',
  'Video Production',
  '2D Animation',
  'Branding & Identity',
  'Motion & Graphic Design',
  'Creative Design',
  '3D Visualization',
  'Company Profile Website',
  'E-Commerce Website',
  'Web Application',
  'ERP / CRM System',
  'IT Support & Infrastructure',
]);

const PUBLIC_PROJECT_PILLARS = new Set<ProjectItem['pillar']>([
  'Visual Experience',
  'Innovation Development',
]);

const cmsText = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

const cmsStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.map(cmsText).filter(Boolean)
    : [];

function normalizeCmsProject(value: unknown): ProjectItem | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;

  const raw = value as Partial<ProjectItem> & Record<string, unknown>;
  const id = cmsText(raw.id);
  const title = cmsText(raw.title) || cmsText(raw.name);
  if (!id || !title) return null;

  const rawService = cmsText(raw.service) as ProjectItem['service'];
  const service = PUBLIC_PROJECT_SERVICES.has(rawService)
    ? rawService
    : 'Web Application';
  const rawPillar = cmsText(raw.pillar) as ProjectItem['pillar'];
  const pillar = PUBLIC_PROJECT_PILLARS.has(rawPillar)
    ? rawPillar
    : ([
        'UI/UX Design',
        'Video Production',
        '2D Animation',
        'Branding & Identity',
        'Motion & Graphic Design',
        'Creative Design',
        '3D Visualization',
      ] as ProjectItem['service'][]).includes(service)
      ? 'Visual Experience'
      : 'Innovation Development';

  const impact = Array.isArray(raw.impact)
    ? raw.impact
        .filter((metric): metric is Record<string, unknown> => Boolean(metric) && typeof metric === 'object' && !Array.isArray(metric))
        .map((metric) => ({ label: cmsText(metric.label), value: cmsText(metric.value) }))
        .filter((metric) => metric.label && metric.value)
    : [];

  return {
    ...raw,
    id,
    slug: cmsText(raw.slug) || id,
    isPublished: raw.isPublished !== false,
    title,
    client: cmsText(raw.client) || cmsText(raw.company),
    industry: cmsText(raw.industry) || 'Unspecified',
    pillar,
    service,
    featured: raw.featured === true,
    image: cmsText(raw.image) || cmsText(raw.coverImage),
    gallery: cmsStringArray(raw.gallery),
    desc: cmsText(raw.desc) || cmsText(raw.description),
    descId: cmsText(raw.descId),
    challenge: cmsText(raw.challenge),
    challengeId: cmsText(raw.challengeId),
    solution: cmsText(raw.solution),
    solutionId: cmsText(raw.solutionId),
    execution: cmsText(raw.execution),
    executionId: cmsText(raw.executionId),
    outcome: cmsText(raw.outcome),
    outcomeId: cmsText(raw.outcomeId),
    deliverables: cmsStringArray(raw.deliverables),
    technologies: cmsStringArray(raw.technologies),
    impact,
    year: cmsText(raw.year),
  } as ProjectItem;
}

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

const EXCLUDED_PUBLIC_SERVICE_SLUGS = new Set(['mobile-app-design']);

function isExcludedPublicService(service: Partial<ServiceItemData> & Record<string, unknown>): boolean {
  const rawSlug = String(service.slug || service.id || service.title || '')
    .trim()
    .toLowerCase()
    .replace(/^seed[-_]srv[-_]/, '')
    .replace(/[\s_]+/g, '-');
  return EXCLUDED_PUBLIC_SERVICE_SLUGS.has(rawSlug);
}

function getStaticServiceFallback(): ServiceItemData[] {
  return allSolutionsAndServices.filter((service) => !isExcludedPublicService(service as ServiceItemData & Record<string, unknown>)).map((service) => ({
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
      if (res.success && Array.isArray(res.data?.services)) {
        // A successful CMS response is authoritative, including an empty collection.
        // Never expose an excluded service or a stale static service when CMS is empty.
        const services = res.data.services.filter((service) =>
          service?.isPublished !== false && !isExcludedPublicService(service as ServiceItemData & Record<string, unknown>),
        );
        setCmsCache('services', services);
        return services;
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
  // Treat a successful empty CMS response as authoritative. In production, never
  // expose bundled sample projects while CMS data is unavailable or empty.
  if (cmsProjectsCache !== null) return cmsProjectsCache;
  if (import.meta.env.PROD) return [];
  if (cmsHydrated.projects && cmsProjectsHasExplicitUnpublishedRecords) return [];
  return allProjects;
}

export function fetchServerCmsProjects(): Promise<ProjectItem[]> {
  if (cmsProjectsRequest) return cmsProjectsRequest;
  cmsProjectsRequest = (async () => {
    try {
      const res = await api.cms.getProjects();
      const projects = res.success
        ? extractCmsCollection<unknown>(res.data, 'projects')
        : null;
      if (projects) {
        cmsProjectsHasExplicitUnpublishedRecords = projects.some((project) =>
          Boolean(project && typeof project === 'object' && !Array.isArray(project) &&
            (project as Record<string, unknown>).isPublished === false),
        );
        // Normalize JSON at the runtime boundary; TypeScript casts alone cannot
        // guarantee the optional CMS fields are valid arrays/strings.
        const publishedProjects = projects
          .map(normalizeCmsProject)
          .filter((project): project is ProjectItem => Boolean(project) && project.isPublished !== false);
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
        // Only explicitly published CMS testimonials may appear publicly.
        // Empty or draft-only collections remain empty rather than being replaced by sample quotes.
        const publishedTestimonials = testimonials.filter((item) => item?.isPublished === true);
        cmsTestimonialsCache = publishedTestimonials;
        markCmsHydrationSuccess('testimonials');
        notifyCmsUpdate('testimonials');
        return publishedTestimonials;
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
