const SITE_ORIGIN = 'https://kapitech.id';
const VISUAL_ASSET_VERSION = '4a2c6c27';

const LOCALIZED_VISUALS_BY_ARTICLE = new Map([
  [
    'mvp-vs-prototype-vs-proof-of-concept',
    new Set(['validate', 'learning-loop', 'comparison', 'decision-tree', 'framework'])
  ]
]);

const VERSIONED_VISUAL_NAMES = new Set([
  'validate',
  'learning-loop',
  'comparison',
  'decision-tree',
  'framework'
]);

function toLocalInsightUrl(rawUrl) {
  const value = typeof rawUrl === 'string' ? rawUrl.trim() : '';
  if (!value) return null;

  try {
    const parsed = new URL(value, SITE_ORIGIN);
    if (parsed.origin !== SITE_ORIGIN || !parsed.pathname.startsWith('/insights/')) {
      return null;
    }

    return {
      parsed,
      wasRootRelative: value.startsWith('/'),
      articleSlug: parsed.pathname.split('/').filter(Boolean)[1] || ''
    };
  } catch {
    return null;
  }
}

/**
 * Resolve an article illustration for the selected language.
 *
 * Only folders with real language-specific assets are translated. Other
 * articles retain their existing illustration instead of requesting a
 * non-existent "-id.svg" file and falling back to the generic hero.
 */
export function resolveInsightVisualUrl(rawUrl, language = 'en') {
  const local = toLocalInsightUrl(rawUrl);
  if (!local) return rawUrl;

  const { parsed, wasRootRelative, articleSlug } = local;
  const filenameMatch = parsed.pathname.match(/\/([^/]+)\.svg$/i);
  if (!filenameMatch) return rawUrl;

  const filename = filenameMatch[1];
  const isLocalizedFilename = filename.endsWith('-id');
  const basename = (isLocalizedFilename ? filename.slice(0, -3) : filename).toLowerCase();

  if (!VERSIONED_VISUAL_NAMES.has(basename)) return rawUrl;

  const hasLocalizedVariant = LOCALIZED_VISUALS_BY_ARTICLE
    .get(articleSlug)
    ?.has(basename) === true;

  const nextFilename = hasLocalizedVariant && language === 'id'
    ? basename + '-id.svg'
    : basename + '.svg';

  parsed.pathname = parsed.pathname.slice(0, parsed.pathname.lastIndexOf('/') + 1) + nextFilename;
  parsed.searchParams.set('v', VISUAL_ASSET_VERSION);

  return wasRootRelative
    ? parsed.pathname + parsed.search + parsed.hash
    : parsed.toString();
}

/**
 * Keep the failed-image fallback aligned between client rendering and the
 * HTML prerender. Prefer the English MVP hero on English MVP articles.
 */
export function resolveInsightVisualFallback(rawUrl, language = 'en') {
  const fallbackImage = '/insights/article-hero-background.jpg';
  const local = toLocalInsightUrl(rawUrl);
  if (!local) return fallbackImage;

  const { parsed, articleSlug } = local;
  const segments = parsed.pathname.split('/').filter(Boolean);
  if (segments.length < 3) return fallbackImage;

  const filename = (segments[segments.length - 1] || '').toLowerCase();
  if (filename === 'hero.svg' || filename === 'hero-en.svg') {
    return fallbackImage;
  }

  const heroFilename = articleSlug === 'mvp-vs-prototype-vs-proof-of-concept' && language === 'en'
    ? 'hero-en.svg'
    : 'hero.svg';

  return '/insights/' + articleSlug + '/' + heroFilename;
}
