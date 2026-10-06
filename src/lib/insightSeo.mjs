import { deriveInsightFaq, normalizeInsightFaq } from './insightFaq.mjs';

function nonEmpty(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : '';
}

function sameOriginUrl(value, fallback, siteUrl) {
  const candidate = nonEmpty(value);
  if (!candidate) return fallback;

  try {
    const parsed = new URL(candidate, siteUrl);
    const site = new URL(siteUrl);
    if (parsed.origin !== site.origin || !['http:', 'https:'].includes(parsed.protocol)) {
      return fallback;
    }
    return parsed.toString().replace(/\/$/, '');
  } catch {
    return fallback;
  }
}

export function absoluteInsightUrl(value, siteUrl) {
  try {
    const parsed = new URL(value, siteUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) return siteUrl + '/';
    return parsed.toString();
  } catch {
    return siteUrl + '/';
  }
}

export function normalizeInsightSeo(article, options) {
  const siteUrl = String(options.siteUrl || '').replace(/\/$/, '');
  const siteName = nonEmpty(options.siteName) || 'Kapitech Agency';
  const defaultImage = absoluteInsightUrl(options.defaultImage || siteUrl + '/', siteUrl);
  const slug = nonEmpty(article?.slug);
  const fallbackCanonical = slug
    ? siteUrl + '/insights/' + encodeURIComponent(slug)
    : siteUrl + '/insights';
  const canonicalUrl = sameOriginUrl(article?.canonicalUrl, fallbackCanonical, siteUrl);
  const language = article?.language === 'id' ? 'id' : 'en';
  const title = nonEmpty(article?.seoTitle)
    || (nonEmpty(article?.title) ? article.title + ' | ' + siteName : 'Insights | ' + siteName);
  const description = nonEmpty(article?.seoDescription)
    || nonEmpty(article?.excerpt)
    || title;
  const image = absoluteInsightUrl(article?.ogImage || article?.coverImage || defaultImage, siteUrl);

  const alternateCandidates = [
    { language, slug },
    ...(Array.isArray(article?.alternateLanguages) ? article.alternateLanguages : [])
  ];

  const alternates = [];
  const seen = new Set();

  for (const item of alternateCandidates) {
    if (!item || (item.language !== 'id' && item.language !== 'en') || !nonEmpty(item.slug)) continue;
    const key = item.language + ':' + item.slug;
    if (seen.has(key)) continue;
    seen.add(key);
    alternates.push({ language: item.language, slug: item.slug });
  }

  return {
    title,
    description,
    canonicalUrl,
    image,
    language,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    alternates,
    xDefault: alternates.find((item) => item.language === 'en') || null,
    locale: language === 'id' ? 'id_ID' : 'en_US',
    alternateLocale: language === 'id' ? 'en_US' : 'id_ID'
  };
}

function authorNode(article, siteUrl) {
  if (!article?.author?.name) {
    return {
      '@type': 'Organization',
      '@id': siteUrl + '/#organization',
      name: 'Kapitech Agency'
    };
  }

  if (article.author.slug === 'kapitech-editorial-team') {
    return {
      '@type': 'Organization',
      '@id': siteUrl + '/#organization',
      name: article.author.name
    };
  }

  const node = {
    '@type': 'Person',
    '@id': siteUrl + '/insights#author-' + article.author.id,
    name: article.author.name
  };

  if (article.author.role) node.jobTitle = article.author.role;
  if (article.author.avatar) node.image = absoluteInsightUrl(article.author.avatar, siteUrl);

  return node;
}

export function buildInsightBreadcrumbSchema(article, seo, options) {
  const siteUrl = String(options.siteUrl || '').replace(/\/$/, '');

  return {
    '@type': 'BreadcrumbList',
    '@id': seo.canonicalUrl + '#breadcrumb',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: seo.language === 'id' ? 'Beranda' : 'Home',
        item: siteUrl + '/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: seo.language === 'id' ? 'Insight' : 'Insights',
        item: siteUrl + '/insights'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: seo.canonicalUrl
      }
    ]
  };
}

export function buildInsightStructuredData(article, seo, options) {
  const siteUrl = String(options.siteUrl || '').replace(/\/$/, '');
  const siteName = nonEmpty(options.siteName) || 'Kapitech Agency';
  const category = article?.category?.displayName
    || article?.category?.name?.[seo.language]
    || article?.category?.name?.en
    || article?.category?.name?.id
    || article?.category?.slug
    || undefined;

  const graph = [
    {
      '@type': 'BlogPosting',
      '@id': seo.canonicalUrl + '#article',
      headline: article.title,
      description: seo.description,
      image: [seo.image],
      datePublished: article.publishedAt || undefined,
      dateModified: article.updatedAt || article.publishedAt || undefined,
      author: authorNode(article, siteUrl),
      publisher: { '@id': siteUrl + '/#organization', name: siteName },
      inLanguage: seo.language,
      articleSection: category,
      keywords: Array.isArray(article.tags) && article.tags.length
        ? article.tags.map((tag) => tag.name).filter(Boolean).join(', ')
        : undefined,
      mainEntityOfPage: { '@id': seo.canonicalUrl + '#webpage' },
      url: seo.canonicalUrl
    },
    {
      '@type': 'WebPage',
      '@id': seo.canonicalUrl + '#webpage',
      name: seo.title,
      description: seo.description,
      url: seo.canonicalUrl,
      inLanguage: seo.language,
      isPartOf: { '@id': siteUrl + '/#website' },
      about: { '@id': siteUrl + '/#organization' },
      breadcrumb: { '@id': seo.canonicalUrl + '#breadcrumb' }
    },
    buildInsightBreadcrumbSchema(article, seo, { siteUrl })
  ];

  const explicitFaq = normalizeInsightFaq(article.faq);
  const faq = explicitFaq.length > 0
    ? explicitFaq
    : deriveInsightFaq(article.content, seo.language);

  if (faq.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': seo.canonicalUrl + '#faq',
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      }))
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph
  };
}
