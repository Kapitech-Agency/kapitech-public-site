import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(root, 'dist');
const template = await readFile(join(distDir, 'index.html'), 'utf8');
const manifest = JSON.parse(await readFile(join(root, 'src/data/seoRoutes.json'), 'utf8'));

const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

const absoluteUrl = (value) => {
  if (!value) return manifest.siteUrl + '/';
  try {
    return new URL(value, manifest.siteUrl + '/').toString();
  } catch {
    return manifest.siteUrl + '/';
  }
};

const slugifyHeading = (value) =>
  String(value ?? '')
    .normalize('NFKD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\\s-]/g, '')
    .trim()
    .replace(/\\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'section';

const buildHeadingIds = (blocks) => {
  const counts = new Map();
  return blocks.map((block) => {
    if (block?.type !== 'heading') return '';
    const base = slugifyHeading(block.text);
    const count = (counts.get(base) || 0) + 1;
    counts.set(base, count);
    return 'insight-' + base + (count === 1 ? '' : '-' + count);
  });
};

const inlineMarkdownToHtml = (value) => {
  const safe = escapeHtml(value);
  return safe
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
      try {
        const parsed = new URL(url, manifest.siteUrl);
        if (!['http:', 'https:'].includes(parsed.protocol)) return label;
        const external = parsed.origin !== new URL(manifest.siteUrl).origin;
        return '<a href="' + escapeHtml(parsed.toString()) + '"' + (external ? ' target="_blank" rel="noreferrer"' : '') + '>' + label + '</a>';
      } catch {
        return label;
      }
    });
};

const renderInsightBody = (insight, variants) => {
  const blocks = Array.isArray(insight.content) ? insight.content : [];
  const headingIds = buildHeadingIds(blocks);
  const toc = blocks.flatMap((block, index) => {
    if (block?.type !== 'heading' || block.level !== 2 || !headingIds[index]) return [];
    return [{ id: headingIds[index], text: block.text || '' }];
  });
  const faq = Array.isArray(insight.faq) ? insight.faq : [];
  const language = insight.language;
  const label = (idText, enText) => language === 'id' ? idText : enText;
  const image = absoluteUrl(insight.coverImage || insight.ogImage || manifest.defaultImage);

  let body = '';
  body += '<div class="mx-auto w-full max-w-[900px] px-5 py-12 sm:px-8 sm:py-16">';
  body += '<article class="kapi-insight-prerender" data-language="' + escapeHtml(language) + '" itemscope itemtype="https://schema.org/Article">';
  body += '<header class="max-w-[900px]">';
  body += '<p class="text-[9px] font-mono uppercase tracking-[0.17em] text-[#E50914]">' + escapeHtml(label('Insight · Panduan','Insight · Guide')) + '</p>';
  body += '<h1 itemprop="headline" class="mt-4 max-w-[860px] font-display text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-6xl">' + escapeHtml(insight.title) + '</h1>';
  if (insight.excerpt) body += '<p itemprop="description" class="mt-5 max-w-3xl text-base leading-8 text-[#A3A9B5] sm:text-lg">' + inlineMarkdownToHtml(insight.excerpt) + '</p>';
  if (insight.author?.name || insight.publishedAt || insight.readingTime) {
    body += '<p class="mt-5 text-xs leading-6 text-[#737A87]">';
    if (insight.author?.name) body += escapeHtml(label('Ditulis oleh ','Written by ')) + escapeHtml(insight.author.name);
    if (insight.publishedAt) body += (insight.author?.name ? ' · ' : '') + escapeHtml(new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', {day:'numeric',month:'long',year:'numeric'}).format(new Date(insight.publishedAt)));
    if (insight.readingTime) body += ' · ' + escapeHtml(String(insight.readingTime)) + ' ' + escapeHtml(label('menit baca','min read'));
    body += '</p>';
  }
  if (insight.coverImage) {
    body += '<figure class="relative mt-8 overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#0B0C0E]">';
    body += '<img itemprop="image" src="' + escapeHtml(insight.coverImage) + '" alt="' + escapeHtml(insight.title) + '" width="1600" height="900" loading="eager" decoding="async" class="block w-full" />';
    body += '</figure>';
  }
  body += '</header>';

  if (Array.isArray(insight.keyTakeaways) && insight.keyTakeaways.length) {
    body += '<section class="mt-10 border-y border-white/[0.08] py-8" aria-labelledby="kapi-prerender-key-takeaways">';
    body += '<p id="kapi-prerender-key-takeaways" class="text-[9px] font-mono uppercase tracking-[0.18em] text-[#E50914]">' + escapeHtml(label('Poin utama','Key takeaways')) + '</p>';
    body += '<ul class="mt-4 space-y-2">';
    for (const item of insight.keyTakeaways) body += '<li class="flex gap-3 text-[15px] leading-7 text-[#C3C7D0]"><span class="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E50914]"></span><span>' + inlineMarkdownToHtml(item) + '</span></li>';
    body += '</ul></section>';
  }

  if (toc.length) {
    body += '<nav class="mt-8 border-y border-white/[0.08] py-5" aria-label="' + escapeHtml(label('Daftar isi artikel','Article table of contents')) + '"><p class="text-[9px] font-mono uppercase tracking-[0.17em] text-[#747B88]">' + escapeHtml(label('Di artikel ini','In this article')) + '</p><ol class="mt-3 grid gap-x-8 gap-y-1 sm:grid-cols-2">';
    toc.forEach((item, index) => {
      body += '<li><a href="#' + escapeHtml(item.id) + '" class="flex gap-3 py-1.5 text-[12px] leading-5 text-[#8C93A0]"><span class="font-mono text-[9px] text-[#5F6672]">' + String(index + 1).padStart(2,'0') + '</span><span>' + inlineMarkdownToHtml(item.text) + '</span></a></li>';
    });
    if (faq.length) body += '<li><a href="#faq-title" class="flex gap-3 py-1.5 text-[12px] leading-5 text-[#8C93A0]"><span class="font-mono text-[9px] text-[#5F6672]">' + String(toc.length + 1).padStart(2,'0') + '</span><span>' + escapeHtml(label('Pertanyaan yang sering diajukan','Frequently asked questions')) + '</span></a></li>';
    body += '</ol></nav>';
  }

  for (const [index, block] of blocks.entries()) {
    if (!block || typeof block !== 'object') continue;
    if (block.type === 'paragraph') body += '<p class="mb-7 text-[15px] font-light leading-[1.9] text-[#C3C7D0] sm:text-[16px]">' + inlineMarkdownToHtml(block.text) + '</p>';
    else if (block.type === 'heading') {
      const tag = block.level === 3 ? 'h3' : 'h2';
      body += '<' + tag + ' id="' + escapeHtml(headingIds[index]) + '" class="' + (block.level === 3 ? 'mb-4 mt-10 text-xl font-semibold leading-[1.12] tracking-[-0.03em] text-white' : 'mb-5 mt-14 text-2xl font-display font-semibold leading-[1.08] tracking-[-0.045em] text-white sm:text-[2rem]') + '">' + escapeHtml(block.text) + '</' + tag + '>';
    } else if (block.type === 'list') {
      const tag = block.ordered ? 'ol' : 'ul';
      body += '<' + tag + ' class="' + (block.ordered ? 'list-decimal ' : 'list-disc ') + 'mb-8 space-y-3 pl-6 text-[15px] font-light leading-7 text-[#C3C7D0]">';
      for (const item of block.items || []) body += '<li class="pl-1">' + inlineMarkdownToHtml(item) + '</li>';
      body += '</' + tag + '>';
    } else if (block.type === 'quote') {
      body += '<blockquote class="my-10 border-l-2 border-[#E50914]/70 bg-white/[0.018] px-6 py-6 font-display text-xl leading-[1.45] text-white/92">' + inlineMarkdownToHtml(block.text) + '</blockquote>';
    } else if (block.type === 'image') {
      body += '<figure class="my-12"><img src="' + escapeHtml(block.url) + '" alt="' + escapeHtml(block.alt) + '" loading="lazy" decoding="async" class="block w-full rounded-[22px] border border-white/[0.08]" />';
      if (block.caption) body += '<figcaption class="mt-3 text-xs leading-5 text-[#707684]">' + inlineMarkdownToHtml(block.caption) + '</figcaption>';
      body += '</figure>';
    } else if (block.type === 'table') {
      body += '<div class="my-12 overflow-x-auto rounded-[18px] border border-white/[0.08]"><table class="w-full min-w-[560px] border-collapse text-left text-sm"><thead><tr class="bg-white/[0.035]">';
      for (const header of block.headers || []) body += '<th scope="col" class="border-b border-white/[0.08] px-4 py-3.5 text-[10px] font-mono uppercase tracking-[0.1em] text-[#8E96A4]">' + inlineMarkdownToHtml(header) + '</th>';
      body += '</tr></thead><tbody>';
      for (const row of block.rows || []) {
        body += '<tr class="border-b border-white/[0.06]">';
        for (const cell of row) body += '<td class="px-4 py-3.5 align-top leading-6 text-[#B6BBC5]">' + inlineMarkdownToHtml(cell) + '</td>';
        body += '</tr>';
      }
      body += '</tbody></table></div>';
    } else if (block.type === 'callout') {
      body += '<aside class="my-9 border border-white/[0.09] bg-white/[0.025] p-5 sm:p-6"><p class="mb-2 text-sm font-semibold text-white">' + (block.title ? escapeHtml(block.title) : '') + '</p><p class="text-sm leading-7 text-[#B9BEC8]">' + inlineMarkdownToHtml(block.text) + '</p></aside>';
    } else if (block.type === 'link') {
      body += '<p class="my-8"><a href="' + escapeHtml(absoluteUrl(block.url)) + '" class="inline-flex items-center rounded-full border border-white/[0.09] bg-white/[0.025] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.11em] text-white">' + escapeHtml(block.label) + '</a></p>';
    } else if (block.type === 'checklist') {
      body += '<section class="my-12 border-y border-white/[0.08] py-8">';
      if (block.title) body += '<h3 class="mb-5 text-xl font-semibold text-white">' + escapeHtml(block.title) + '</h3>';
      body += '<ul class="grid gap-3 sm:grid-cols-2">';
      for (const item of block.items || []) body += '<li class="flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.018] px-4 py-3.5 text-sm leading-6 text-[#C3C7D0]"><span>✓</span><span>' + inlineMarkdownToHtml(item) + '</span></li>';
      body += '</ul></section>';
    } else if (block.type === 'divider') body += '<hr class="my-12 border-0 border-t border-white/[0.07]" />';
  }

  if (faq.length) {
    body += '<section class="mt-16 border-t border-white/[0.08] pt-10" aria-labelledby="faq-title"><h2 id="faq-title" class="text-2xl font-display font-semibold text-white sm:text-3xl">' + escapeHtml(label('Pertanyaan yang sering diajukan','Frequently asked questions')) + '</h2>';
    body += '<div class="mt-5 space-y-3">';
    faq.forEach((item) => {
      body += '<details class="rounded-2xl border border-white/[0.08] bg-white/[0.018] px-5 py-4"><summary class="cursor-pointer list-none text-sm font-semibold leading-6 text-white">' + escapeHtml(item.question) + '</summary><p class="pt-3 text-sm leading-7 text-[#9BA2AF]">' + inlineMarkdownToHtml(item.answer) + '</p></details>';
    });
    body += '</div></section>';
  }

  body += '</article></div>';
  return body;
};

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
  const globalVariant = variants.find((item) => item.language === 'en');
  const xDefault = globalVariant
    ? '\n    <link rel="alternate" hreflang="x-default" href="' +
      escapeHtml(manifest.siteUrl + '/insights/' + globalVariant.slug) + '" />'
    : '';
  if (!tags && !xDefault) return html;
  return html.replace('</head>', '    ' + tags + xDefault + '\n  </head>');
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

  itemListElement.push({
    '@type': 'ListItem',
    position: 3,
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
  const image = absoluteUrl(insight.ogImage || insight.coverImage || manifest.defaultImage);
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
        ? (insight.author.slug === 'kapitech-editorial-team'
          ? {
              '@type': 'Organization',
              '@id': manifest.siteUrl + '/#organization',
              name: insight.author.name
            }
          : {
              '@type': 'Person',
              '@id': manifest.siteUrl + '/insights#author-' + insight.author.id,
              name: insight.author.name,
              jobTitle: insight.author.role || undefined
            })
        : { '@type': 'Organization', name: manifest.siteName },
      publisher: { '@id': manifest.siteUrl + '/#organization' },
      inLanguage: language,
      articleSection: insight.category?.displayName || insight.category?.name?.[language] || insight.category?.name?.en || insight.category?.name?.id || undefined,
      keywords: Array.isArray(insight.tags) && insight.tags.length ? insight.tags.map((tag) => tag.name).join(', ') : undefined,
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
  html = setMeta(html, 'name', 'title', title);
  html = setMeta(html, 'name', 'description', description);
  html = setMeta(html, 'name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  html = setOpenGraphType(html, 'article');
  html = setMeta(html, 'property', 'og:url', canonicalUrl);
  html = setMeta(html, 'property', 'og:title', title);
  html = setMeta(html, 'property', 'og:description', description);
  html = setMeta(html, 'property', 'og:image', image);
  html = setMeta(html, 'property', 'og:image:alt', title);
  html = setMeta(html, 'property', 'og:site_name', manifest.siteName);
  html = setMeta(html, 'property', 'og:locale', language === 'id' ? 'id_ID' : 'en_US');
  html = setMeta(html, 'property', 'og:locale:alternate', language === 'id' ? 'en_US' : 'id_ID');
  html = setCanonical(html, canonicalUrl);
  html = setInsightHreflang(html, variants);
  html = setPageJsonLd(html, { '@context': 'https://schema.org', '@graph': graph });
  const staticBody = renderInsightBody(insight, variants);
  html = html.replace('<body', '<body').replace('<body class="bg-black text-white selection:bg-brand-red selection:text-white">', '<body class="bg-black text-white selection:bg-brand-red selection:text-white">' + '<div id="kapi-prerendered-insight">' + staticBody + '</div>');
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

try {
  const { variants, byGroup } = await fetchPublishedInsights();

  const requiredSlugs = new Set([
    'mvp-vs-prototype-vs-proof-of-concept-guide',
    'mvp-vs-prototype-vs-proof-of-concept'
  ]);
  const generatedSlugs = new Set(variants.map((item) => item.slug));
  for (const slug of requiredSlugs) {
    if (!generatedSlugs.has(slug)) {
      throw new Error('[seo] required published Insight is missing from CMS response: ' + slug);
    }
  }

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
  throw new Error('[seo] unable to prerender published Insights: ' + (error instanceof Error ? error.message : String(error)));
}

for (const route of manifest.routes) {
  const html = renderRoute(template, route);
  const outputPath = route.path === '/'
    ? join(distDir, 'index.html')
    : join(distDir, route.path.replace(/^\/+/, ''), 'index.html');

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html, 'utf8');
  console.log('[seo] generated ' + posix.normalize(route.path + '/index.html'));
}
