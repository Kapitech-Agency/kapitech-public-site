import type { ProjectItem } from '../data/projectsData';
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
export const defaultTestimonials: TestimonialItem[] = [];

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
        const services = res.data.services;
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
  return cmsProjectsCache || (cmsProjectsCache = []);
}

export function fetchServerCmsProjects(): Promise<ProjectItem[]> {
  if (cmsProjectsRequest) return cmsProjectsRequest;
  cmsProjectsRequest = (async () => {
    try {
      const res = await api.cms.getProjects();
      if (res.success && Array.isArray(res.data?.projects)) {
        const projects = res.data.projects;
        setCmsCache('projects', projects);
        return projects;
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
      if (res.success && Array.isArray(res.data?.testimonials)) {
        const testimonials = res.data.testimonials;
        cmsTestimonialsCache = testimonials;
        markCmsHydrationSuccess('testimonials');
        notifyCmsUpdate('testimonials');
        return testimonials;
      }
    } catch {
      // Keep the empty CMS state visible until the server recovers.
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
