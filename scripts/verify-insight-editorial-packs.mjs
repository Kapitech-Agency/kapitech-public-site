import { access, readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateInsightContent } from '../src/lib/insightContentValidationCore.mjs';
import { buildInsightHeadingIdList, buildInsightTocList } from '../src/lib/insightHeadingIdsCore.mjs';
import { splitInsightBlocks } from '../src/lib/insightArticlePresentation.mjs';
import { resolveInsightVisualUrl } from '../src/lib/insightVisuals.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const packDir = join(root, 'src', 'data', 'insight-editorial-packs');
const publicDir = join(root, 'public');
const siteOrigin = 'https://kapitech.id';
const files = (await readdir(packDir))
  .filter((file) => /\.(?:id|en)\.json$/i.test(file))
  .sort();

const errors = [];
const slugs = new Map();
const languagePairs = new Map();
let imageCount = 0;

function issue(file, message) {
  errors.push(file + ': ' + message);
}

async function verifyLocalAsset(rawUrl, file, context) {
  if (typeof rawUrl !== 'string' || !rawUrl.trim()) {
    issue(file, context + ' is missing an asset URL.');
    return;
  }

  let parsed;
  try {
    parsed = new URL(rawUrl, siteOrigin);
  } catch {
    issue(file, context + ' has an invalid asset URL: ' + rawUrl);
    return;
  }

  // External assets are allowed by the editorial schema; this build check
  // verifies local assets that must ship with the public site.
  if (parsed.origin !== siteOrigin) return;
  if (!parsed.pathname.startsWith('/insights/')) {
    issue(file, context + ' must reference a local /insights/ asset: ' + rawUrl);
    return;
  }

  const assetPath = join(publicDir, decodeURIComponent(parsed.pathname.slice(1)));
  try {
    await access(assetPath);
  } catch {
    issue(file, context + ' points to a missing public asset: ' + parsed.pathname);
  }
}

if (files.length === 0) {
  throw new Error('No bilingual Insight editorial packs were found.');
}

for (const file of files) {
  const languageMatch = file.match(/\.(id|en)\.json$/i);
  const language = languageMatch?.[1]?.toLowerCase();
  const stem = file.replace(/\.(?:id|en)\.json$/i, '');
  const filePath = join(packDir, file);

  let pack;
  try {
    pack = JSON.parse(await readFile(filePath, 'utf8'));
  } catch (error) {
    issue(file, 'JSON could not be parsed: ' + String(error));
    continue;
  }

  const seo = pack?.seo || {};
  const editorial = pack?.editorial || {};
  const content = Array.isArray(editorial.content) ? editorial.content : [];
  const slug = typeof seo.slug === 'string' ? seo.slug.trim() : '';

  if (!slug) issue(file, 'seo.slug is required.');
  if (!['id', 'en'].includes(language)) issue(file, 'filename must declare an id or en language.');
  if (editorial.language !== language) {
    issue(file, 'editorial.language does not match the filename language.');
  }
  if (!seo.title?.trim()) issue(file, 'seo.title is required.');
  if (!seo.description?.trim()) issue(file, 'seo.description is required.');
  if (!editorial.title?.trim()) issue(file, 'editorial.title is required.');
  if (!editorial.excerpt?.trim()) issue(file, 'editorial.excerpt is required.');

  if (slug) {
    const previous = slugs.get(slug);
    if (previous) issue(file, 'slug duplicates ' + previous + ': ' + slug);
    else slugs.set(slug, file);
  }

  if (!languagePairs.has(stem)) languagePairs.set(stem, new Set());
  languagePairs.get(stem).add(language);

  if (seo.canonicalUrl && slug) {
    try {
      const canonical = new URL(seo.canonicalUrl);
      if (canonical.origin !== siteOrigin || canonical.pathname !== '/insights/' + slug) {
        issue(file, 'canonicalUrl must match its published article slug.');
      }
    } catch {
      issue(file, 'canonicalUrl is invalid.');
    }
  } else {
    issue(file, 'seo.canonicalUrl is required.');
  }

  const validation = validateInsightContent(content);
  validation.errors.forEach((message) => issue(file, message));
  validation.warnings.forEach((message) => issue(file, 'content warning: ' + message));

  if (!Array.isArray(editorial.keyTakeaways) || editorial.keyTakeaways.length === 0
    || editorial.keyTakeaways.some((item) => typeof item !== 'string' || !item.trim())) {
    issue(file, 'at least one non-empty key takeaway is required.');
  }

  if (!Array.isArray(editorial.faq) || editorial.faq.length === 0
    || editorial.faq.some((item) => !Array.isArray(item) || item.length < 2
      || typeof item[0] !== 'string' || !item[0].trim()
      || typeof item[1] !== 'string' || !item[1].trim())) {
    issue(file, 'at least one complete FAQ pair is required.');
  }

  const presentation = splitInsightBlocks(content);
  const headingIds = buildInsightHeadingIdList(presentation.bodyBlocks);
  const nonEmptyHeadingIds = headingIds.filter(Boolean);
  const toc = buildInsightTocList(presentation.bodyBlocks, headingIds);

  if (toc.length === 0) issue(file, 'the article body must produce at least one H2 table-of-contents item.');
  if (new Set(nonEmptyHeadingIds).size !== nonEmptyHeadingIds.length) {
    issue(file, 'heading IDs are not unique.');
  }
  if (toc.length !== presentation.bodyBlocks.filter((block) => block?.type === 'heading' && block.level === 2).length) {
    issue(file, 'table of contents does not include every H2 heading.');
  }

  for (const [index, block] of content.entries()) {
    if (block?.type !== 'image') continue;
    imageCount += 1;
    if (!block.alt?.trim()) issue(file, 'image block ' + (index + 1) + ' has no alt text.');
    const resolved = resolveInsightVisualUrl(block.url, language);
    await verifyLocalAsset(resolved, file, 'image block ' + (index + 1));
  }

  if (seo.ogImage) await verifyLocalAsset(seo.ogImage, file, 'seo.ogImage');
  if (editorial.coverImage) await verifyLocalAsset(editorial.coverImage, file, 'editorial.coverImage');
}

for (const [stem, languages] of languagePairs) {
  if (!languages.has('id') || !languages.has('en') || languages.size !== 2) {
    issue(stem, 'each topic must have exactly one Indonesian and one English pack.');
  }
}

if (errors.length > 0) {
  console.error('[insights] editorial pack verification failed with ' + errors.length + ' issue(s):');
  for (const message of errors) console.error(' - ' + message);
  process.exitCode = 1;
} else {
  console.log('[insights] verified ' + files.length + ' bilingual article packs, ' + slugs.size
    + ' unique article slugs, ' + imageCount + ' body visual references, and their local assets/TOCs.');
}
