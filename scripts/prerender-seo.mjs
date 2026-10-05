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
  const pattern = /<script\b[^>]*application\/ld\+json[^>]*>[\s\S]*?<\/script>/gi;
  const matches = [...html.matchAll(pattern)];
  const tag = '<script id="kapitech-page-jsonld" type="application/ld+json">' + json + '</script>';
  if (matches.length >= 2) return html.replace(matches[1][0], tag);
  return html.replace('</head>', '    ' + tag + '\n  </head>');
};

const setPageJsonLd = (html, data) => {
  const json = JSON.stringify(data).replaceAll('<', '\\u003c');
  const pattern = /<script\\b[^>]*id="kapitech-page-jsonld"[^>]*>[\\s\\S]*?<\\/script>/i;
  const tag = '<script id="kapitech-page-jsonld" type="application/ld+json">' + json + '</script>';
  return pattern.test(html)
    ? html.replace(pattern, tag)
    : html.replace('</head>', '    ' + tag + '\\n  </head>');
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
    : join(distDir, route.path.replace(/^\/+/, ''), 'index.html');

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html, 'utf8');
  console.log('[seo] generated ' + posix.normalize(route.path + '/index.html'));
}
