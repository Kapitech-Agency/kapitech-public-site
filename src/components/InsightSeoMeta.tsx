import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../lib/apiClient';
import { useLanguage } from '../lib/LanguageContext';
import seoRoutes from '../data/seoRoutes.json';
import type { InsightItem } from '../data/insightTypes';

const SITE = seoRoutes.siteUrl;
const IMAGE = seoRoutes.defaultImage;
const ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

const setMeta = (name: string, content: string) => {
  let node = document.head.querySelector<HTMLMetaElement>('meta[name="' + name + '"]');
  if (!node) { node = document.createElement('meta'); node.name = name; document.head.appendChild(node); }
  node.content = content;
};

const setProp = (name: string, content: string) => {
  let node = document.head.querySelector<HTMLMetaElement>('meta[property="' + name + '"]');
  if (!node) { node = document.createElement('meta'); node.setAttribute('property', name); document.head.appendChild(node); }
  node.content = content;
};

const setCanonical = (url: string) => {
  let node = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!node) { node = document.createElement('link'); node.rel = 'canonical'; document.head.appendChild(node); }
  node.href = url;
};

const setJsonLd = (data: Record<string, unknown>) => {
  const id = 'kapitech-insight-jsonld';
  let node = document.head.querySelector<HTMLScriptElement>('#' + id);
  if (!node) { node = document.createElement('script'); node.id = id; node.type = 'application/ld+json'; document.head.appendChild(node); }
  node.textContent = JSON.stringify(data);
};

const setHreflang = (items: Array<{ language: 'id' | 'en'; slug: string }>) => {
  document.head.querySelectorAll<HTMLLinkElement>('link[data-kapi-insight-hreflang]').forEach(node => node.remove());
  items.forEach(item => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = item.language;
    link.href = SITE + '/insights/' + item.slug;
    link.dataset.kapiInsightHreflang = 'true';
    document.head.appendChild(link);
  });
};

function breadcrumb(article: InsightItem, url: string) {
  const language = article.language;
  const category = article.category?.displayName
    || article.category?.name?.[language]
    || article.category?.name?.en
    || article.category?.name?.id
    || article.category?.slug;

  const items: Array<Record<string, unknown>> = [
    { '@type': 'ListItem', position: 1, name: language === 'id' ? 'Beranda' : 'Home', item: SITE + '/' },
    { '@type': 'ListItem', position: 2, name: language === 'id' ? 'Insight' : 'Insights', item: SITE + '/insights' }
  ];
  if (category) items.push({ '@type': 'ListItem', position: items.length + 1, name: category, item: SITE + '/insights' });
  items.push({ '@type': 'ListItem', position: items.length + 1, name: article.title, item: url });

  return { '@type': 'BreadcrumbList', '@id': url + '#breadcrumb', itemListElement: items };
}

function articleStructuredData(article: InsightItem, url: string) {
  const image = article.ogImage || article.coverImage || IMAGE;
  const graph: Array<Record<string, unknown>> = [
    {
      '@type': 'BlogPosting',
      '@id': url + '#article',
      headline: article.title,
      description: article.seoDescription || article.excerpt || article.title,
      image: [image],
      datePublished: article.publishedAt || undefined,
      dateModified: article.updatedAt || article.publishedAt || undefined,
      author: article.author
        ? { '@type': 'Person', '@id': SITE + '/insights#author-' + article.author.id, name: article.author.name, jobTitle: article.author.role || undefined }
        : { '@type': 'Organization', name: seoRoutes.siteName },
      publisher: { '@id': SITE + '/#organization' },
      inLanguage: article.language,
      mainEntityOfPage: { '@id': url + '#webpage' },
      url
    },
    {
      '@type': 'WebPage',
      '@id': url + '#webpage',
      name: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt || article.title,
      url,
      inLanguage: article.language,
      isPartOf: { '@id': SITE + '/#website' },
      about: { '@id': SITE + '/#organization' },
      breadcrumb: { '@id': url + '#breadcrumb' }
    },
    breadcrumb(article, url)
  ];

  if (article.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': url + '#faq',
      mainEntity: article.faq.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer }
      }))
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

export const InsightSeoMeta: React.FC<{ article?: InsightItem | null }> = ({ article }) => {
  const { pathname } = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    let cancelled = false;

    const apply = (
      title: string,
      description: string,
      url: string,
      resolvedLanguage: 'id' | 'en',
      image: string,
      robots: string,
      alternates: Array<{ language: 'id' | 'en'; slug: string }>,
      schema: Record<string, unknown>
    ) => {
      if (cancelled) return;
      document.documentElement.lang = resolvedLanguage;
      document.title = title;
      setMeta('description', description);
      setMeta('robots', robots);
      setProp('og:type', pathname.startsWith('/insights/') ? 'article' : 'website');
      setProp('og:url', url);
      setProp('og:title', title);
      setProp('og:description', description);
      setProp('og:image', image);
      setProp('og:site_name', seoRoutes.siteName);
      setProp('og:locale', resolvedLanguage === 'id' ? 'id_ID' : 'en_US');
      setProp('og:locale:alternate', resolvedLanguage === 'id' ? 'en_US' : 'id_ID');
      setMeta('twitter:card', 'summary_large_image');
      setMeta('twitter:url', url);
      setMeta('twitter:title', title);
      setMeta('twitter:description', description);
      setMeta('twitter:image', image);
      setCanonical(url);
      setHreflang(alternates);
      setJsonLd(schema);
    };

    const load = async () => {
      if (pathname === '/insights') {
        const title = language === 'id' ? 'Insight | Kapitech Agency' : 'Insights | Kapitech Agency';
        const description = language === 'id'
          ? 'Wawasan praktis tentang desain, teknologi, produk digital, dan pengembangan website untuk bisnis.'
          : 'Practical perspectives on design, technology, digital products, and building better digital experiences.';
        const url = SITE + '/insights';
        apply(
          title,
          description,
          url,
          language,
          IMAGE,
          ROBOTS,
          [],
          {
            '@context': 'https://schema.org',
            '@graph': [
              { '@type': 'CollectionPage', '@id': url + '#webpage', name: title, description, url, inLanguage: language, isPartOf: { '@id': SITE + '/#website' }, about: { '@id': SITE + '/#organization' } },
              { '@type': 'BreadcrumbList', '@id': url + '#breadcrumb', itemListElement: [
                { '@type': 'ListItem', position: 1, name: language === 'id' ? 'Beranda' : 'Home', item: SITE + '/' },
                { '@type': 'ListItem', position: 2, name: language === 'id' ? 'Insight' : 'Insights', item: url }
              ] }
            ]
          }
        );
        return;
      }

      if (!pathname.startsWith('/insights/')) return;

      let current = article || null;
      if (!current) {
        const slug = pathname.split('/').filter(Boolean)[1] || '';
        try {
          const response = await api.cms.getInsightBySlug(slug);
          if (response.success) current = response.data?.insight || null;
        } catch {}
      }

      if (!current) {
        const url = SITE + pathname;
        apply('Insight Not Found | Kapitech Agency', 'The requested Kapitech Insight could not be found.', url, language, IMAGE, 'noindex, follow', [], {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Insight Not Found | Kapitech Agency',
          description: 'The requested Kapitech Insight could not be found.',
          url,
          inLanguage: language
        });
        return;
      }

      const url = current.canonicalUrl || (SITE + '/insights/' + current.slug);
      apply(
        current.seoTitle || current.title + ' | Kapitech Agency',
        current.seoDescription || current.excerpt || current.title,
        url,
        current.language,
        current.ogImage || current.coverImage || IMAGE,
        ROBOTS,
        current.alternateLanguages || [],
        articleStructuredData(current, url)
      );
    };

    void load();
    return () => { cancelled = true; };
  }, [article, language, pathname]);

  return null;
};
