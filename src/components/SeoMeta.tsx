import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getServiceBySlug } from '../data/servicesData';
import { useLanguage } from '../lib/LanguageContext';

type SeoDefinition = {
  title: string;
  description: string;
  robots?: string;
  type?: 'website' | 'article';
};

const SITE_NAME = 'Kapitech Agency';
const SITE_URL = 'https://kapitech.id';
const DEFAULT_IMAGE = 'https://raw.githubusercontent.com/Kapitech-Agency/Kapitech-Agency.github.io/main/public/hero_background_3d.png';

const STATIC_SEO: Record<string, SeoDefinition> = {
  '/': {
    title: 'Kapitech Agency | Digital Product Design & Engineering',
    description: 'Kapitech is a digital product design and engineering agency helping startups, scaleups, B2B companies, and enterprises design, build, and scale digital products.',
  },
  '/services': {
    title: 'Digital Product Design & Engineering Services | Kapitech Agency',
    description: 'Explore Kapitech services across product design, UI/UX, web development, mobile apps, MVPs, branding, and digital product engineering.',
  },
  '/work': {
    title: 'Digital Product Design & Engineering Portfolio | Kapitech Agency',
    description: 'Explore Kapitech case studies and delivered work across product design, web engineering, branding, and digital experiences.',
  },
  '/about': {
    title: 'About Kapitech Agency | Digital Product Design & Engineering',
    description: 'Learn about Kapitech Agency, our capabilities, working model, leadership, and approach to digital product design and engineering.',
  },
  '/careers': {
    title: 'Careers at Kapitech Agency | Design & Engineering',
    description: 'Explore career opportunities at Kapitech for designers, engineers, project leaders, and digital product specialists.',
  },
  '/contact': {
    title: 'Start a Project with Kapitech Agency',
    description: 'Tell Kapitech about your digital product, design, engineering, branding, or website project and start a conversation with our team.',
  },
  '/privacy': {
    title: 'Privacy Policy | Kapitech Agency',
    description: 'Read the Kapitech Agency privacy policy and understand how website and inquiry data is handled.',
    robots: 'noindex, follow',
  },
  '/terms': {
    title: 'Terms of Service | Kapitech Agency',
    description: 'Read the Kapitech Agency terms of service governing use of this website and related services.',
    robots: 'noindex, follow',
  },
  '/cookie-policy': {
    title: 'Cookie Policy | Kapitech Agency',
    description: 'Read the Kapitech Agency cookie policy and understand how cookies and optional tracking are used.',
    robots: 'noindex, follow',
  },
  '/ai-instructions': {
    title: 'AI Instructions | Kapitech Agency',
    description: 'Kapitech Agency machine-readable guidance and publishing instructions.',
    robots: 'noindex, follow',
  },
  '/editorial-policy': {
    title: 'Editorial Policy | Kapitech Agency',
    description: 'Read the editorial and content governance policy for Kapitech Agency.',
    robots: 'noindex, follow',
  },
};

function setMeta(name: string, content: string): void {
  let tag = document.head.querySelector<HTMLMetaElement>('meta[name="' + name + '"]');
  if (!tag) {
    tag = document.createElement('meta');
    tag.name = name;
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function setProperty(property: string, content: string): void {
  let tag = document.head.querySelector<HTMLMetaElement>('meta[property="' + property + '"]');
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
  let script = document.head.querySelector<HTMLScriptElement>('#' + id);
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

function getRouteSeo(pathname: string, language: 'en' | 'id'): { seo: SeoDefinition; canonicalPath: string; structuredData: Record<string, unknown> } {
  const base = STATIC_SEO[pathname];
  if (base) {
    return {
      seo: base,
      canonicalPath: pathname || '/',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': pathname === '/' ? 'WebSite' : 'WebPage',
        name: base.title,
        description: base.description,
        url: SITE_URL + (pathname === '/' ? '' : pathname),
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
      },
    };
  }

  const match = pathname.match(/^\/(services|solutions)\/([^/]+)$/);
  if (match) {
    const service = getServiceBySlug(match[2]);
    if (service) {
      const title = service.title.replace(/\s+/g, ' ').trim() + ' | Kapitech Agency';
      const description = language === 'id' ? service.heroSubtitleId : service.heroSubtitle;
      const canonicalPath = service.type === 'solution' ? '/solutions/' + service.slug : '/services/' + service.slug;
      return {
        seo: { title, description },
        canonicalPath,
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.title,
          description,
          url: SITE_URL + canonicalPath,
          provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
          serviceType: service.category,
        },
      };
    }
  }

  return {
    seo: { title: 'Page Not Found | Kapitech Agency', description: 'The requested Kapitech Agency page could not be found.', robots: 'noindex, follow' },
    canonicalPath: pathname || '/',
    structuredData: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Page Not Found | Kapitech Agency', description: 'The requested Kapitech Agency page could not be found.' },
  };
}

export const SeoMeta = () => {
  const { pathname } = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    const { seo, canonicalPath, structuredData } = getRouteSeo(pathname, language);
    const canonicalUrl = SITE_URL + (canonicalPath === '/' ? '/' : canonicalPath);

    document.documentElement.lang = language;
    document.title = seo.title;
    setMeta('description', seo.description);
    setMeta('robots', seo.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setProperty('og:type', seo.type || 'website');
    setProperty('og:url', canonicalUrl);
    setProperty('og:title', seo.title);
    setProperty('og:description', seo.description);
    setProperty('og:image', DEFAULT_IMAGE);
    setProperty('og:site_name', SITE_NAME);
    setProperty('og:locale', language === 'id' ? 'id_ID' : 'en_US');
    setProperty('og:locale:alternate', language === 'id' ? 'en_US' : 'id_ID');
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', seo.title);
    setMeta('twitter:description', seo.description);
    setMeta('twitter:image', DEFAULT_IMAGE);
    setCanonical(canonicalUrl);
    setJsonLd(structuredData);
  }, [language, pathname]);

  return null;
}
