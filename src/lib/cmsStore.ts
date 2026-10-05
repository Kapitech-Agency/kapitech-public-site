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

let cmsServicesCache: ServiceItemData[] | null = null;
let cmsProjectsCache: ProjectItem[] | null = null;
let cmsTestimonialsCache: TestimonialItem[] | null = null;
let cmsServicesRequest: Promise<ServiceItemData[]> | null = null;
let cmsProjectsRequest: Promise<ProjectItem[]> | null = null;
let cmsTestimonialsRequest: Promise<TestimonialItem[]> | null = null;

// Client testimonials are served from AMS CMS. Keep the static fallback empty so the
// public site never invents client identities, quotes, ratings, or business outcomes.
export const defaultTestimonials: TestimonialItem[] = [];

function getStaticServiceFallback(): ServiceItemData[] {
  return allSolutionsAndServices.map((service) => ({
    ...service,
    metrics: [],
    testimonial: undefined,
    caseStudySlugs: [],
  }));
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
        cmsServicesCache = res.data.services;
        return cmsServicesCache;
      }
    } catch {
      // Keep the local curated dataset when the public CMS is unavailable.
    }
    return getCmsServices();
  })().finally(() => {
    cmsServicesRequest = null;
  });
  return cmsServicesRequest;
}

// Client case studies are served from AMS CMS. Do not fall back to an
// unverified static portfolio dataset when the API is unavailable.
export function getCmsProjects(): ProjectItem[] {
  return cmsProjectsCache || (cmsProjectsCache = []);
}

export function fetchServerCmsProjects(): Promise<ProjectItem[]> {
  if (cmsProjectsRequest) return cmsProjectsRequest;
  cmsProjectsRequest = (async () => {
    try {
      const res = await api.cms.getProjects();
      if (res.success && Array.isArray(res.data?.projects) && res.data.projects.length > 0) {
        cmsProjectsCache = res.data.projects;
        return cmsProjectsCache;
      }
    } catch {
      // Keep the local curated dataset when the public CMS is unavailable.
    }
    return getCmsProjects();
  })().finally(() => {
    cmsProjectsRequest = null;
  });
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
      if (res.success && Array.isArray(res.data?.testimonials) && res.data.testimonials.length > 0) {
        cmsTestimonialsCache = res.data.testimonials;
        return cmsTestimonialsCache;
      }
    } catch {
      // Keep the local curated dataset when the public CMS is unavailable.
    }
    return getCmsTestimonials();
  })().finally(() => {
    cmsTestimonialsRequest = null;
  });
  return cmsTestimonialsRequest;
}
