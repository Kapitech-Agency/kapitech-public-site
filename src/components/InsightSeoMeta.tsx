import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import seoRoutes from '../data/seoRoutes.json';
import type { InsightItem } from '../data/insightTypes';
import { useLanguage } from '../lib/LanguageContext';
import {
  buildInsightStructuredData,
  normalizeInsightSeo
} from '../lib/insightSeo.mjs';

const SITE = seoRoutes.siteUrl;
const IMAGE = seoRoutes.defaultImage;
const SITE_NAME = seoRoutes.siteName;
const ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

function setMeta(name: string, content: string): void {
  let node = document.head.querySelector<HTMLMetaElement>('meta[name="' + name + '"]');
  if (!node) {
    node = document.createElement('meta');
    node.name = name;
    document.head.appendChild(node);
  }
  node.content = content;
}

function setProp(name: string, content: string): void {
  let node = document.head.querySelector<HTMLMetaElement>('meta[property="' + name + '"]');
  if (!node) {
    node = document.createElement('meta');
    node.setAttribute('property', name);
    document.head.appendChild(node);
  }
  node.content = content;
}

function setCanonical(url: string): void {
  let node = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!node) {
    node = document.createElement('link');
    node.rel = 'canonical';
    document.head.appendChild(node);
  }
  node.href = url;
}

function setJsonLd(data: Record<string, unknown>): void {
  const id = 'kapitech-insight-jsonld';
  let node = document.head.querySelector<HTMLScriptElement>('#' + id);
  if (!node) {
    node = document.createElement('script');
    node.id = id;
    node.type = 'application/ld+json';
    document.head.appendChild(node);
  }
  node.textContent = JSON.stringify(data);
}

function setHreflang(items: Array<{ language: 'id' | 'en'; slug: string }>, xDefaultSlug?: string | null): void {
  document.head
    .querySelectorAll<HTMLLinkElement>('link[data-kapi-insight-hreflang]')
    .forEach((node) => node.remove());

  items.forEach((item) => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = item.language;
    link.href = SITE + '/insights/' + encodeURIComponent(item.slug);
    link.dataset.kapiInsightHreflang = 'true';
    document.head.appendChild(link);
  });

  if (xDefaultSlug) {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = 'x-default';
    link.href = SITE + '/insights/' + encodeURIComponent(xDefaultSlug);
    link.dataset.kapiInsightHreflang = 'true';
    document.head.appendChild(link);
  }
}

function applyArticleSeo(article: InsightItem): void {
  const seo = normalizeInsightSeo(article, {
    siteUrl: SITE,
    siteName: SITE_NAME,
    defaultImage: IMAGE
  });

  document.documentElement.lang = seo.language;
  document.title = seo.title;
  setMeta('title', seo.title);
  setMeta('description', seo.description);
  setMeta('robots', seo.robots);
  setProp('og:type', 'article');
  setProp('og:url', seo.canonicalUrl);
  setProp('og:title', seo.title);
  setProp('og:description', seo.description);
  setProp('og:image', seo.image);
  setProp('og:image:alt', seo.title);
  setProp('og:site_name', SITE_NAME);
  setProp('og:locale', seo.locale);
  setProp('og:locale:alternate', seo.alternateLocale);
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:url', seo.canonicalUrl);
  setMeta('twitter:title', seo.title);
  setMeta('twitter:description', seo.description);
  setMeta('twitter:image', seo.image);
  setMeta('twitter:site', '@kapitechagency');
  setMeta('twitter:creator', '@kapitechagency');
  setCanonical(seo.canonicalUrl);
  setHreflang(seo.alternates, seo.xDefault?.slug || null);
  setJsonLd(buildInsightStructuredData(article, seo, {
    siteUrl: SITE,
    siteName: SITE_NAME
  }));
}

export const InsightSeoMeta: React.FC<{ article?: InsightItem | null }> = ({ article }) => {
  const { pathname } = useLocation();
  const normalizedPathname = pathname.replace(/\/+$/, '') || '/';
  const { language } = useLanguage();

  useEffect(() => {
    if (normalizedPathname === '/insights') {
      const title = language === 'id' ? 'Insight | Kapitech Agency' : 'Insights | Kapitech Agency';
      const description = language === 'id'
        ? 'Wawasan praktis tentang desain, teknologi, produk digital, dan pengembangan website untuk bisnis.'
        : 'Practical perspectives on design, technology, digital products, and building better digital experiences.';

      document.documentElement.lang = language;
      document.title = title;
      setMeta('title', title);
      setMeta('description', description);
      setMeta('robots', ROBOTS);
      setProp('og:type', 'website');
      setProp('og:url', SITE + '/insights');
      setProp('og:title', title);
      setProp('og:description', description);
      setProp('og:image', IMAGE);
      setProp('og:image:alt', SITE_NAME + ' Insights');
      setProp('og:site_name', SITE_NAME);
      setProp('og:locale', language === 'id' ? 'id_ID' : 'en_US');
      setProp('og:locale:alternate', language === 'id' ? 'en_US' : 'id_ID');
      setMeta('twitter:card', 'summary_large_image');
      setMeta('twitter:url', SITE + '/insights');
      setMeta('twitter:title', title);
      setMeta('twitter:description', description);
      setMeta('twitter:image', IMAGE);
      setMeta('twitter:site', '@kapitechagency');
      setMeta('twitter:creator', '@kapitechagency');
      setCanonical(SITE + '/insights');
      setHreflang([], null);
      setJsonLd({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'CollectionPage',
            '@id': SITE + '/insights#webpage',
            name: title,
            description,
            url: SITE + '/insights',
            inLanguage: language,
            isPartOf: { '@id': SITE + '/#website' },
            about: { '@id': SITE + '/#organization' }
          },
          {
            '@type': 'BreadcrumbList',
            '@id': SITE + '/insights#breadcrumb',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: language === 'id' ? 'Beranda' : 'Home',
                item: SITE + '/'
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: language === 'id' ? 'Insight' : 'Insights',
                item: SITE + '/insights'
              }
            ]
          }
        ]
      });
      return;
    }

    if (!normalizedPathname.startsWith('/insights/')) return;

    if (article) {
      applyArticleSeo(article);
      return;
    }

    document.title = 'Insight Not Found | ' + SITE_NAME;
    setMeta('title', document.title);
    setMeta('description', 'The requested Kapitech Insight could not be found.');
    setMeta('robots', 'noindex, follow');
    setProp('og:type', 'website');
    setProp('og:url', SITE + normalizedPathname);
    setCanonical(SITE + normalizedPathname);
    setHreflang([], null);
    setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: document.title,
      description: 'The requested Kapitech Insight could not be found.',
      url: SITE + normalizedPathname,
      inLanguage: language
    });
  }, [article, language, pathname]);

  return null;
};
