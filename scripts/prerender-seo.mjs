import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(root, 'dist');
const template = await readFile(join(distDir, 'index.html'), 'utf8');
const manifest = JSON.parse(await readFile(join(root, 'src/data/seoRoutes.json'), 'utf8'));

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

const setMeta = (html, attribute, key, content) => {
  const pattern = new RegExp('<meta\\b(?=[^>]*\\b' + attribute + '="' + key + '")[^>]*>', 'i');
  const tag = '<meta ' + attribute + '="' + escapeHtml(key) + '" content="' + escapeHtml(content) + '" />';
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', '    ' + tag + '\n  </head>');
};

const setTitle = (html, title) =>
  html.replace(/<title>.*?<\/title>/is, '<title>' + escapeHtml(title) + '</title>');

const setCanonical = (html, url) => {
  const pattern = /<link\b[^>]*rel="canonical"[^>]*>/i;
  const tag = '<link rel="canonical" href="' + escapeHtml(url) + '" />';
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', '    ' + tag + '\n  </head>');
};

const setPageJsonLd = (html, data) => {
  const json = JSON.stringify(data).replaceAll('<', '\\u003c');
  const pattern = /<script\b[^>]*id="kapitech-page-jsonld"[^>]*>[\s\S]*?<\/script>/i;
  const tag = '<script id="kapitech-page-jsonld" type="application/ld+json">' + json + '</script>';
  return pattern.test(html)
    ? html.replace(pattern, tag)
    : html.replace('</head>', '    ' + tag + '\n  </head>');
};

const buildBreadcrumbs = (route) => {
  if (route.path === '/') return null;
  const segments = route.path.split('/').filter(Boolean);
  const items = [
    { '@type': 'ListItem', position: 1, name: manifest.siteName, item: manifest.siteUrl + '/' }
  ];
  if (segments.length === 1) {
    items.push({ '@type': 'ListItem', position: 2, name: route.title, item: manifest.siteUrl + route.path });
  } else {
    const section = segments[0] === 'solutions' ? 'Solutions' : 'Services';
    items.push({ '@type': 'ListItem', position: 2, name: section, item: manifest.siteUrl + '/' + segments[0] });
    items.push({ '@type': 'ListItem', position: 3, name: route.title, item: manifest.siteUrl + route.path });
  }
  return {
    '@type': 'BreadcrumbList',
    '@id': manifest.siteUrl + route.path + '#breadcrumb',
    itemListElement: items
  };
};

const apiBase = (process.env.VITE_AMS_API_BASE_URL || 'https://ams.kapitech.id/api').replace(/\/$/, '');

const setHtmlLang = (html, language) =>
  html.replace(/<html([^>]*)\slang="[^"]*"/i, '<html$1 lang="' + escapeHtml(language) + '"');

const setOpenGraphType = (html, type) =>
  setMeta(html, 'property', 'og:type', type);

const setInsightHreflang = (html, variants) => {
  const tags = variants.map(({ language, slug }) =>
    '<link rel="alternate" hreflang="' + escapeHtml(language) + '" href="' +
    escapeHtml(manifest.siteUrl + '/insights/' + slug) + '" />'
  ).join('\n    ');
  if (!tags) return html;
  return html.replace('</head>', '    ' + tags + '\n  </head>');
};

const buildInsightBreadcrumbs = (insight, canonicalUrl) => {
  const category = insight.category?.displayName
    || insight.category?.name?.[insight.language]
    || insight.category?.name?.en
    || insight.category?.name?.id
    || insight.category?.slug;

  const itemListElement = [
    {
      '@type': 'ListItem',
      position: 1,
      name: insight.language === 'id' ? 'Beranda' : 'Home',
      item: manifest.siteUrl + '/'
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: insight.language === 'id' ? 'Insight' : 'Insights',
      item: manifest.siteUrl + '/insights'
    }
  ];

  if (category) {
    itemListElement.push({
      '@type': 'ListItem',
      position: 3,
      name: category,
      item: manifest.siteUrl + '/insights'
    });
  }

  itemListElement.push({
    '@type': 'ListItem',
    position: itemListElement.length + 1,
    name: insight.title,
    item: canonicalUrl
  });

  return {
    '@type': 'BreadcrumbList',
    '@id': canonicalUrl + '#breadcrumb',
    itemListElement
  };
};

const renderInsight = (sourceHtml, insight, variants) => {
  const canonicalUrl = insight.canonicalUrl || manifest.siteUrl + '/insights/' + insight.slug;
  const title = insight.seoTitle || insight.title + ' | Kapitech Agency';
  const description = insight.seoDescription || insight.excerpt || insight.title;
  const image = insight.ogImage || insight.coverImage || manifest.defaultImage;
  const language = insight.language;
  const breadcrumb = buildInsightBreadcrumbs(insight, canonicalUrl);
  const graph = [
    {
      '@type': 'BlogPosting',
      '@id': canonicalUrl + '#article',
      headline: insight.title,
      description,
      image: [image],
      datePublished: insight.publishedAt || undefined,
      dateModified: insight.updatedAt || insight.publishedAt || undefined,
      author: insight.author
        ? {
            '@type': 'Person',
            '@id': manifest.siteUrl + '/insights#author-' + insight.author.id,
            name: insight.author.name,
            jobTitle: insight.author.role || undefined
          }
        : { '@type': 'Organization', name: manifest.siteName },
      publisher: { '@id': manifest.siteUrl + '/#organization' },
      inLanguage: language,
      mainEntityOfPage: { '@id': canonicalUrl + '#webpage' },
      url: canonicalUrl
    },
    {
      '@type': 'WebPage',
      '@id': canonicalUrl + '#webpage',
      name: title,
      description,
      url: canonicalUrl,
      inLanguage: language,
      isPartOf: { '@id': manifest.siteUrl + '/#website' },
      about: { '@id': manifest.siteUrl + '/#organization' },
      breadcrumb: { '@id': canonicalUrl + '#breadcrumb' }
    },
    breadcrumb
  ];

  if (Array.isArray(insight.faq) && insight.faq.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': canonicalUrl + '#faq',
      mainEntity: insight.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      }))
    });
  }

  let html = sourceHtml;
  html = setHtmlLang(html, language);
  html = setTitle(html, title);
  html = setMeta(html, 'name', 'description', description);
  html = setMeta(html, 'name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  html = setOpenGraphType(html, 'article');
  html = setMeta(html, 'property', 'og:url', canonicalUrl);
  html = setMeta(html, 'property', 'og:title', title);
  html = setMeta(html, 'property', 'og:description', description);
  html = setMeta(html, 'property', 'og:image', image);
  html = setMeta(html, 'property', 'og:site_name', manifest.siteName);
  html = setMeta(html, 'property', 'og:locale', language === 'id' ? 'id_ID' : 'en_US');
  html = setMeta(html, 'property', 'og:locale:alternate', language === 'id' ? 'en_US' : 'id_ID');
  html = setCanonical(html, canonicalUrl);
  html = setInsightHreflang(html, variants);
  html = setPageJsonLd(html, { '@context': 'https://schema.org', '@graph': graph });
  return html;
};

async function fetchPublishedInsights() {
  const variants = [];
  for (const language of ['id', 'en']) {
    let page = 1;
    let totalPages = 1;
    while (page <= totalPages) {
      const response = await fetch(
        apiBase + '/cms/insights?language=' + language + '&page=' + page + '&pageSize=100'
      );
      if (!response.ok) throw new Error('Insight API returned ' + response.status);
      const payload = await response.json();
      const insights = Array.isArray(payload.insights)
        ? payload.insights.filter((item) => item?.status === 'published' && item?.slug)
        : [];
      variants.push(...insights);
      totalPages = Number(payload.meta?.totalPages || 1);
      page += 1;
    }
  }

  const byGroup = new Map();
  for (const item of variants) {
    const key = item.contentGroupId || item.id;
    if (!byGroup.has(key)) byGroup.set(key, []);
    byGroup.get(key).push(item);
  }

  return { variants, byGroup };
};

const renderRoute = (sourceHtml, route) => {
  const canonicalUrl = manifest.siteUrl + (route.path === '/' ? '/' : route.path);
  let html = sourceHtml;

  html = setTitle(html, route.title);
  html = setMeta(html, 'name', 'title', route.title);
  html = setMeta(html, 'name', 'description', route.description);
  html = setMeta(html, 'name', 'robots', route.robots);
  html = setMeta(html, 'property', 'og:url', canonicalUrl);
  html = setMeta(html, 'property', 'og:title', route.title);
  html = setMeta(html, 'property', 'og:description', route.description);
  html = setMeta(html, 'property', 'og:image', manifest.defaultImage);
  html = setMeta(html, 'property', 'og:image:alt', 'Kapitech Agency - Creative & IT Development Agency in Indonesia');
  html = setMeta(html, 'name', 'twitter:url', canonicalUrl);
  html = setMeta(html, 'name', 'twitter:title', route.title);
  html = setMeta(html, 'name', 'twitter:description', route.description);
  html = setMeta(html, 'name', 'twitter:image', manifest.defaultImage);
  html = setMeta(html, 'name', 'twitter:site', '@kapitechagency');
  html = setMeta(html, 'name', 'twitter:creator', '@kapitechagency');
  html = setCanonical(html, canonicalUrl);

  const breadcrumb = buildBreadcrumbs(route);
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': canonicalUrl + '#webpage',
        name: route.title,
        description: route.description,
        url: canonicalUrl,
        isPartOf: { '@id': manifest.siteUrl + '/#website' },
        about: { '@id': manifest.siteUrl + '/#organization' },
        ...(breadcrumb ? { breadcrumb: { '@id': canonicalUrl + '#breadcrumb' } } : {})
      },
      ...(route.kind === 'service'
        ? [{
            '@type': 'Service',
            '@id': canonicalUrl + '#service',
            name: route.serviceName,
            description: route.description,
            url: canonicalUrl,
            provider: { '@id': manifest.siteUrl + '/#organization' },
            serviceType: route.serviceType,
            mainEntityOfPage: { '@id': canonicalUrl + '#webpage' }
          }]
        : []),
      ...(breadcrumb ? [breadcrumb] : [])
    ]
  };

  return setPageJsonLd(html, structuredData);
};

for (const route of manifest.routes) {
  const html = renderRoute(template, route);
  const outputPath = route.path === '/'
    ? join(distDir, 'index.html')
    : join(distDir, route.path.replace(/^\\/+/, ''), 'index.html');

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html, 'utf8');
  console.log('[seo] generated ' + posix.normalize(route.path + '/index.html'));
}

try {
  const { variants, byGroup } = await fetchPublishedInsights();

  for (const insight of variants) {
    const key = insight.contentGroupId || insight.id;
    const group = byGroup.get(key) || [insight];
    const alternateVariants = group.map((variant) => ({
      language: variant.language,
      slug: variant.slug
    }));

    const html = renderInsight(template, insight, alternateVariants);
    const outputPath = join(distDir, 'insights', insight.slug, 'index.html');
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, html, 'utf8');
    console.log('[seo] generated /insights/' + insight.slug + '/index.html');
  }
} catch (error) {
  console.warn('[seo] unable to prerender published Insights:', error instanceof Error ? error.message : error);
}

  const html = renderRoute(template, route);
  const outputPath = route.path === '/'
    ? join(distDir, 'index.html')
    : join(distDir, route.path.replace(/^\/+/, ''), 'index.html');

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html, 'utf8');
  console.log('[seo] generated ' + posix.normalize(route.path + '/index.html'));
}
