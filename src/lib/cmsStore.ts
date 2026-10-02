import { allProjects, ProjectItem } from '../data/projectsData';
import { allSolutionsAndServices, ServiceItemData } from '../data/servicesData';
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

let cmsServicesCache: ServiceItemData[] | null = null;
let cmsProjectsCache: ProjectItem[] | null = null;
let cmsTestimonialsCache: TestimonialItem[] | null = null;

export const defaultTestimonials: TestimonialItem[] = [
  {
    id: 't_01',
    quote: "Kapitech built our real estate portal from scratch using Next.js. The page load speed is blazing fast and our inbound lead conversions increased by 45% within the first month.",
    quoteId: "Kapitech membangun portal real estate kami dari nol menggunakan Next.js. Kecepatan loading halamannya luar biasa cepat dan konversi prospek kami meningkat 45% dalam bulan pertama.",
    author: "Marcus Thorne",
    role: "Managing Director",
    company: "Lumina Real Estate",
    location: "Jakarta, Indonesia",
    rating: 5,
    isPublished: true
  },
  {
    id: 't_02',
    quote: "Their design team has an exceptional eye for modern typography and layout. They delivered a cohesive brand identity and a stunning web experience that elevated our firm completely.",
    quoteId: "Tim desain mereka memiliki keahlian luar biasa dalam tipografi dan tata letak modern. Mereka menghadirkan identitas brand yang sangat kohesif dan pengalaman web yang memukau.",
    author: "Sarah Chen",
    role: "Creative Director",
    company: "Aura Creative Studio",
    location: "Singapore",
    rating: 5,
    isPublished: true
  },
  {
    id: 't_03',
    quote: "Working with Kapitech on our mobile banking interface was seamless. They simplified complex account journeys and delivered pixel-perfect Figma specs ready for our dev squad.",
    quoteId: "Bekerja dengan Kapitech untuk antarmuka mobile banking sangat lancar. Mereka menyederhanakan alur pengguna yang kompleks dan menyerahkan spesifikasi Figma yang presisi untuk tim developer kami.",
    author: "David Miller",
    role: "Head of Product",
    company: "Nexus Fintech",
    location: "Hong Kong",
    rating: 5,
    isPublished: true
  },
  {
    id: 't_04',
    quote: "The solar energy monitoring dashboard Kapitech engineered gave our operations team instant visibility across 40+ solar farms with zero lag. Highly dependable engineering.",
    quoteId: "Dashboard monitoring energi surya yang dikembangkan Kapitech memberi tim operasi kami visibilitas langsung di lebih dari 40 ladang surya tanpa lag. Rekayasa yang sangat andal.",
    author: "Elena Rodriguez",
    role: "Operations VP",
    company: "Solaris CleanTech",
    location: "Melbourne, Australia",
    rating: 5,
    isPublished: true
  },
  {
    id: 't_05',
    quote: "Our headless Shopify migration handled our flash sale traffic peaks without a hitch. Checkout conversion increased by 38%. Kapitech delivers genuine business results.",
    quoteId: "Migrasi Shopify headless kami menangani lonjakan traffic flash sale tanpa hambatan. Konversi checkout meningkat sebesar 38%. Kapitech memberikan hasil bisnis nyata.",
    author: "Julian Vane",
    role: "Founder & CEO",
    company: "Vivid Commerce",
    location: "Jakarta, Indonesia",
    rating: 5,
    isPublished: true
  },
  {
    id: 't_06',
    quote: "Clear milestones, proactive communication, and zero technical fluff. Kapitech is our go-to partner whenever we need to launch a new digital product on a tight timeline.",
    quoteId: "Milestone yang jelas, komunikasi proaktif, dan tanpa basa-basi teknis. Kapitech adalah mitra andalan kami setiap kali kami perlu meluncurkan produk digital baru dalam jadwal ketat.",
    author: "Michael Kross",
    role: "Chief Technology Officer",
    company: "Kross Cloud Systems",
    location: "Kuala Lumpur, Malaysia",
    rating: 5,
    isPublished: true
  }
];


export function getCmsServices(): ServiceItemData[] {
  return cmsServicesCache || (cmsServicesCache = allSolutionsAndServices);
}

export async function fetchServerCmsServices(): Promise<ServiceItemData[]> {
  try {
    const res = await api.cms.getServices();
    if (res.success && Array.isArray(res.data?.services)) {
      cmsServicesCache = res.data.services;
      return cmsServicesCache;
    }
  } catch {
    // Keep the local curated dataset when the public CMS is unavailable.
  }
  return getCmsServices();
}

export function getCmsProjects(): ProjectItem[] {
  return cmsProjectsCache || (cmsProjectsCache = allProjects);
}

export async function fetchServerCmsProjects(): Promise<ProjectItem[]> {
  try {
    const res = await api.cms.getProjects();
    if (res.success && Array.isArray(res.data?.projects)) {
      cmsProjectsCache = res.data.projects;
      return cmsProjectsCache;
    }
  } catch {
    // Keep the local curated dataset when the public CMS is unavailable.
  }
  return getCmsProjects();
}

export function getCmsTestimonials(): TestimonialItem[] {
  return cmsTestimonialsCache || (cmsTestimonialsCache = defaultTestimonials);
}

export async function fetchServerCmsTestimonials(): Promise<TestimonialItem[]> {
  try {
    const res = await api.cms.getTestimonials();
    if (res.success && Array.isArray(res.data?.testimonials) && res.data.testimonials.length > 0) {
      cmsTestimonialsCache = res.data.testimonials;
      return cmsTestimonialsCache;
    }
  } catch {
    // Keep the local curated dataset when the public CMS is unavailable.
  }
  return getCmsTestimonials();
}
