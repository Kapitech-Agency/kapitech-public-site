import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getServiceBySlug, allSolutionsAndServices, type ServiceItemData } from '../data/servicesData';
import { allProjects, type ProjectItem } from '../data/projectsData';
import { industryBySlug, industrySlug, projectBySlug, projectSlug, slugify } from '../lib/publicContent';
import { faqItems } from '../data/faqData';
import { useLanguage } from '../lib/LanguageContext';
import seoRoutes from '../data/seoRoutes.json';
import { CMS_EVENT_KEY, fetchServerCmsProjects, fetchServerCmsServices, getCmsProjects, getCmsServices } from '../lib/cmsStore';

type SeoDefinition = {
  title: string;
  description: string;
  robots?: string;
};

const SITE_NAME = seoRoutes.siteName;
const SITE_URL = seoRoutes.siteUrl;
const DEFAULT_IMAGE = seoRoutes.defaultImage;
const DEFAULT_IMAGE_ALT = 'Kapitech Agency — Creative & IT Development Agency in Indonesia';
const DEFAULT_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

function setMeta(name: string, content: string): void {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.name = name;
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function setProperty(property: string, content: string): void {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function setCanonical(url: string): void {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = url;
}

function setJsonLd(data: Record<string, unknown>): void {
  const id = 'kapitech-page-jsonld';
  let script = document.head.querySelector<HTMLScriptElement>(`#${id}`);
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

function buildBreadcrumbs(pathname: string, currentName: string) {
  if (pathname === '/') return undefined;

  const segments = pathname.split('/').filter(Boolean);
  const itemListElement: Array<Record<string, unknown>> = [
    { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL + '/' },
  ];

  if (segments.length === 1) {
    itemListElement.push({
      '@type': 'ListItem',
      position: 2,
      name: currentName,
      item: SITE_URL + pathname,
    });
  } else if (segments[0] === 'services' || segments[0] === 'solutions') {
    const sectionName = segments[0] === 'solutions' ? 'Solutions' : 'Services';
    itemListElement.push({
      '@type': 'ListItem',
      position: 2,
      name: sectionName,
      item: SITE_URL + '/' + segments[0],
    });
    itemListElement.push({
      '@type': 'ListItem',
      position: 3,
      name: currentName,
      item: SITE_URL + pathname,
    });
  }

  return {
    '@type': 'BreadcrumbList',
    '@id': SITE_URL + pathname + '#breadcrumb',
    itemListElement,
  };
}

function getRouteSeo(
  pathname: string,
  language: 'en' | 'id',
  projects: ProjectItem[] = allProjects,
  services: ServiceItemData[] = allSolutionsAndServices,
) {
  if (pathname === '/faq') {
    const canonicalUrl = SITE_URL + '/faq';
    return {
      seo: { title: 'FAQ | Kapitech Agency', description: 'Answers about working with Kapitech, process, services, security, careers, and project inquiries.', robots: DEFAULT_ROBOTS } satisfies SeoDefinition,
      canonicalPath: '/faq',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': canonicalUrl + '#faq',
        mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } }))
      }
    };
  }

  const base = seoRoutes.routes.find((route) => route.path === pathname);
  if (base && base.kind !== 'service') {
    const canonicalPath = pathname || '/';
    const canonicalUrl = SITE_URL + (canonicalPath === '/' ? '/' : canonicalPath);
    const breadcrumb = buildBreadcrumbs(canonicalPath, base.title);

    return {
      seo: {
        title: base.title,
        description: base.description,
        robots: base.robots,
      } satisfies SeoDefinition,
      canonicalPath,
      structuredData: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebPage',
            '@id': canonicalUrl + '#webpage',
            name: base.title,
            description: base.description,
            url: canonicalUrl,
            isPartOf: { '@id': SITE_URL + '/#website' },
            about: { '@id': SITE_URL + '/#organization' },
            ...(breadcrumb ? { breadcrumb: { '@id': canonicalUrl + '#breadcrumb' } } : {}),
          },
          ...(breadcrumb ? [breadcrumb] : []),
        ],
      },
    };
  }

  const caseStudyMatch = pathname.match(/^\/work\/([^/]+)$/);
  if (caseStudyMatch) {
    const project = projectBySlug(projects, caseStudyMatch[1]) || projectBySlug(allProjects, caseStudyMatch[1]);
    if (project) {
      const canonicalSlug = projectSlug(project);
      const canonicalUrl = SITE_URL + '/work/' + canonicalSlug;
      return {
        seo: { title: project.title + ' | Kapitech Agency', description: language === 'id' ? project.descId : project.desc, robots: DEFAULT_ROBOTS } satisfies SeoDefinition,
        canonicalPath: '/work/' + canonicalSlug,
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          '@id': canonicalUrl + '#case-study',
          name: project.title,
          description: language === 'id' ? project.descId : project.desc,
          url: canonicalUrl,
          creator: { '@id': SITE_URL + '/#organization' },
          about: project.industry,
          image: project.image || DEFAULT_IMAGE,
          keywords: [project.service, project.industry, project.client].join(', ')
        }
      };
    }
  }

  const industryMatch = pathname.match(/^\/industries\/([^/]+)$/);
  if (industryMatch) {
    const industry = industryBySlug(projects, industryMatch[1]) || industryBySlug(allProjects, industryMatch[1]);
    if (industry) {
      const canonicalUrl = SITE_URL + '/industries/' + industrySlug(industry);
      return {
        seo: { title: industry + ' Digital Work | Kapitech Agency', description: 'Explore Kapitech public work and capabilities represented in ' + industry + '.', robots: DEFAULT_ROBOTS } satisfies SeoDefinition,
        canonicalPath: '/industries/' + industrySlug(industry),
        structuredData: { '@context': 'https://schema.org', '@type': 'CollectionPage', '@id': canonicalUrl + '#collection', name: industry, description: 'Kapitech public work represented in ' + industry + '.', url: canonicalUrl }
      };
    }
  }

  const match = pathname.match(/^\/(services|solutions)\/([^/]+)$/);
  if (match) {
    const service = services.find((item) => slugify(item.slug) === slugify(match[2])) || getServiceBySlug(match[2]);
    if (service) {
      const title = service.title.replace(/\s+/g, ' ').trim() + ' | Kapitech Agency';
      const description = language === 'id' ? service.heroSubtitleId : service.heroSubtitle;
      const canonicalSlug = slugify(service.slug);
      const canonicalPath = service.type === 'solution' ? '/solutions/' + canonicalSlug : '/services/' + canonicalSlug;
      const canonicalUrl = SITE_URL + canonicalPath;
      const breadcrumb = buildBreadcrumbs(canonicalPath, service.title);

      return {
        seo: { title, description, robots: DEFAULT_ROBOTS } satisfies SeoDefinition,
        canonicalPath,
        structuredData: {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebPage',
              '@id': canonicalUrl + '#webpage',
              name: title,
              description,
              url: canonicalUrl,
              isPartOf: { '@id': SITE_URL + '/#website' },
              about: { '@id': SITE_URL + '/#organization' },
              ...(breadcrumb ? { breadcrumb: { '@id': canonicalUrl + '#breadcrumb' } } : {}),
            },
            {
              '@type': 'Service',
              '@id': canonicalUrl + '#service',
              name: service.title,
              description,
              url: canonicalUrl,
              provider: { '@id': SITE_URL + '/#organization' },
              serviceType: service.category,
              mainEntityOfPage: { '@id': canonicalUrl + '#webpage' },
            },
            ...(breadcrumb ? [breadcrumb] : []),
          ],
        },
      };
    }
  }

  return {
    seo: {
      title: 'Page Not Found | Kapitech Agency',
      description: 'The requested Kapitech Agency page could not be found.',
      robots: 'noindex, follow',
    } satisfies SeoDefinition,
    canonicalPath: pathname || '/',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Page Not Found | Kapitech Agency',
      description: 'The requested Kapitech Agency page could not be found.',
      url: SITE_URL + (pathname || '/'),
    },
  };
}

export const SeoMeta = () => {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  const [cmsProjects, setCmsProjects] = useState<ProjectItem[]>(() => getCmsProjects());
  const [cmsServices, setCmsServices] = useState<ServiceItemData[]>(() => getCmsServices());

  useEffect(() => {
    const handleCmsUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ type?: string }>).detail;
      if (!detail?.type || detail.type === 'projects') setCmsProjects(getCmsProjects());
      if (!detail?.type || detail.type === 'services') setCmsServices(getCmsServices());
    };

    window.addEventListener(CMS_EVENT_KEY, handleCmsUpdate);
    return () => window.removeEventListener(CMS_EVENT_KEY, handleCmsUpdate);
  }, []);

  const needsCmsProjects = /^\/work\/[^/]+$/.test(pathname) || /^\/industries\/[^/]+$/.test(pathname);
  const needsCmsServices = /^\/(services|solutions)\/[^/]+$/.test(pathname);

  useEffect(() => {
    if (needsCmsProjects) {
      void fetchServerCmsProjects().then(() => setCmsProjects(getCmsProjects()));
    }
    if (needsCmsServices) {
      void fetchServerCmsServices().then(() => setCmsServices(getCmsServices()));
    }
  }, [needsCmsProjects, needsCmsServices, pathname]);

  useEffect(() => {
    if (pathname === '/insights' || pathname.startsWith('/insights/')) return;

    const { seo, canonicalPath, structuredData } = getRouteSeo(pathname, language, cmsProjects, cmsServices);
    const canonicalUrl = SITE_URL + (canonicalPath === '/' ? '/' : canonicalPath);

    document.documentElement.lang = language;
    document.title = seo.title;
    setMeta('description', seo.description);
    setMeta('robots', seo.robots || DEFAULT_ROBOTS);
    setProperty('og:type', 'website');
    setProperty('og:url', canonicalUrl);
    setProperty('og:title', seo.title);
    setProperty('og:description', seo.description);
    setProperty('og:image', DEFAULT_IMAGE);
    setProperty('og:image:alt', DEFAULT_IMAGE_ALT);
    setProperty('og:site_name', SITE_NAME);
    setProperty('og:locale', language === 'id' ? 'id_ID' : 'en_US');
    setProperty('og:locale:alternate', language === 'id' ? 'en_US' : 'id_ID');
    setMeta('twitter:url', canonicalUrl);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', seo.title);
    setMeta('twitter:description', seo.description);
    setMeta('twitter:image', DEFAULT_IMAGE);
    setMeta('twitter:site', '@kapitechagency');
    setMeta('twitter:creator', '@kapitechagency');
    setCanonical(canonicalUrl);
    setJsonLd(structuredData);
  }, [cmsProjects, cmsServices, language, pathname]);

  return null;
};
