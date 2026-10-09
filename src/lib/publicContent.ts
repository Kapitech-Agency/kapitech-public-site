import type { ProjectItem } from '../data/projectsData';

export const slugify = (value: string): string =>
  String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Use one canonical slug rule for static records, CMS records, sitemap URLs,
// prerendered routes, related-work links, and per-page SEO metadata.
export const projectSlug = (project: ProjectItem): string =>
  slugify(project.slug || project.id || project.title);

export const projectBySlug = (projects: ProjectItem[], slug: string): ProjectItem | undefined => {
  const normalizedSlug = slugify(slug);
  return projects.find((project) =>
    projectSlug(project) === normalizedSlug ||
    slugify(project.id) === normalizedSlug ||
    slugify(project.title) === normalizedSlug
  );
};

export const uniqueIndustries = (projects: ProjectItem[]): string[] =>
  Array.from(new Set(projects.map((project) => project.industry).filter(Boolean))).sort((a, b) => a.localeCompare(b));

export const industrySlug = (industry: string): string => slugify(industry);

export const industryBySlug = (projects: ProjectItem[], slug: string): string | undefined =>
  uniqueIndustries(projects).find((industry) => industrySlug(industry) === slug);

export const uniqueClients = (projects: ProjectItem[]): string[] =>
  Array.from(new Set(projects.map((project) => project.client).filter(Boolean))).sort((a, b) => a.localeCompare(b));

export const clientSlug = (client: string): string => slugify(client);
