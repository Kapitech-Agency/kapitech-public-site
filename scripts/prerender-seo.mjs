import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  absoluteInsightUrl,
  buildInsightStructuredData,
  normalizeInsightSeo
} from '../src/lib/insightSeo.mjs';
import {
  buildInsightHeadingIdList,
  buildInsightTocList
} from '../src/lib/insightHeadingIdsCore.mjs';
import { fetchPublishedInsights } from './insightApi.mjs';
import { deriveInsightFaq } from '../src/lib/insightFaq.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(root, 'dist');
const template = await readFile(join(distDir, 'index.html'), 'utf8');
const manifest = JSON.parse(await readFile(join(root, 'src/data/seoRoutes.json'), 'utf8'));

const escapeHtml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const safeText = (value) => typeof value === 'string' ? value.trim() : '';
const absoluteUrl = (value) => absoluteInsightUrl(value, manifest.siteUrl);

const inlineMarkdownToHtml = (value) => {
  const safe = escapeHtml(value);
  return safe
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, rawUrl) => {
      try {
        const parsed = new URL(rawUrl, manifest.siteUrl);
        if (!['http:', 'https:'].includes(parsed.protocol)) return label;
        const external = parsed.origin !== new URL(manifest.siteUrl).origin;
        const rel = external ? ' target="_blank" rel="noopener noreferrer"' : '';
        return '<a href="' + escapeHtml(parsed.toString()) + '"' + rel + '>' + label + '</a>';
      } catch {
        return label;
      }
    });
};

const blocksBeforeHeadingFallback = (currentBlock, allBlocks) => {
  const index = allBlocks.indexOf(currentBlock);
  if (index < 0) return 0;

  return allBlocks
    .slice(0, index + 1)
    .filter((item) => item?.type === 'heading' && item.level === 2)
    .length - 1;
};

const renderBlock = (block, headingId, insight) => {
  if (!block || typeof block !== 'object') return '';

  if (block.type === 'paragraph') {
    return '<p class="mb-6 max-w-[72ch] text-[15px] font-light leading-[1.82] text-[#C3C7D0] sm:text-[15.5px] sm:leading-[1.84]">' +
      inlineMarkdownToHtml(block.text) + '</p>';
  }

  if (block.type === 'heading') {
    const tag = block.level === 3 ? 'h3' : 'h2';
    if (block.level === 3) {
      return '<h3 id="' + escapeHtml(headingId) + '" class="group scroll-mt-28 mb-4 mt-10 border-l border-white/[0.08] pl-4 font-display text-xl font-semibold leading-[1.16] tracking-[-0.03em] text-white sm:text-[1.35rem]">' +
        escapeHtml(block.text) + '</h3>';
    }

    const sectionNumber = String(
      blocksBeforeHeadingFallback(block, insight.content) + 1
    ).padStart(2, '0');

    return '<h2 id="' + escapeHtml(headingId) + '" class="scroll-mt-28 mb-6 mt-16 first:mt-2">' +
      '<span class="mb-3 flex items-center gap-3 border-t border-white/[0.07] pt-5">' +
      '<span class="font-mono text-[9px] font-semibold tabular-nums tracking-[0.14em] text-[#E50914]">' + sectionNumber + '</span>' +
      '<span class="h-px w-8 bg-[#E50914]/45" aria-hidden="true"></span>' +
      '<span class="text-[9px] font-mono uppercase tracking-[0.16em] text-[#69717D]">' +
      escapeHtml(insight.language === 'id' ? 'Bagian' : 'Section') + '</span></span>' +
      '<span class="block font-display text-[1.95rem] font-semibold leading-[1.08] tracking-[-0.045em] text-white sm:text-[2.1rem] lg:text-[2.3rem]">' +
      escapeHtml(block.text) + '</span></h2>';
  }

  if (block.type === 'list') {
    const tag = block.ordered ? 'ol' : 'ul';
    const cls = block.ordered ? 'list-decimal' : 'list-disc';
    const items = (Array.isArray(block.items) ? block.items : [])
      .map((item) => '<li class="pl-1">' + inlineMarkdownToHtml(item) + '</li>')
      .join('');
    return '<' + tag + ' class="' + cls + ' mb-8 space-y-3 pl-6 text-[15px] font-light leading-7 text-[#C3C7D0]">' +
      items + '</' + tag + '>';
  }

  if (block.type === 'quote') {
    const attribution = safeText(block.attribution)
      ? '<figcaption class="mt-5 text-[9px] font-mono uppercase tracking-[0.13em] text-[#7D8492]">' + escapeHtml(block.attribution) + '</figcaption>'
      : '';
    return '<figure class="my-11 border-y border-white/[0.08] py-7 sm:py-8">' +
      '<p class="mb-3 text-[9px] font-mono uppercase tracking-[0.16em] text-[#69717D]">' +
      escapeHtml(insight.language === 'id' ? 'Catatan' : 'Editorial note') + '</p>' +
      '<blockquote class="max-w-3xl font-display text-[1.22rem] leading-[1.45] tracking-[-0.02em] text-white sm:text-[1.45rem]">' +
      inlineMarkdownToHtml(block.text) + '</blockquote>' + attribution + '</figure>';
  }

  if (block.type === 'image') {
    const width = Number.isFinite(block.width) && Number(block.width) > 0 ? ' width="' + String(block.width) + '"' : '';
    const height = Number.isFinite(block.height) && Number(block.height) > 0 ? ' height="' + String(block.height) + '"' : '';
    const caption = safeText(block.caption)
      ? '<figcaption class="mt-3 text-xs leading-5 text-[#707684]">' + inlineMarkdownToHtml(block.caption) + '</figcaption>'
      : '';
    const visualFallback = absoluteUrl('/insights/mvp-vs-prototype-vs-proof-of-concept/visual-fallback.svg');
    return '<figure class="my-12"><div class="overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#0B0C0E]">' +
      '<img src="' + escapeHtml(absoluteUrl(block.url)) + '" alt="' + escapeHtml(block.alt || insight.title) +
      '"' + width + height + ' loading="lazy" decoding="async" class="block h-auto w-full object-contain" onerror="this.onerror=null;this.src=\'' + escapeHtml(visualFallback) + '\';" /></div>' +
      caption + '</figure>';
  }

  if (block.type === 'table') {
    const headers = Array.isArray(block.headers) ? block.headers : [];
    const rows = Array.isArray(block.rows) ? block.rows : [];
    const caption = safeText(block.caption)
      ? '<caption class="caption-top px-4 py-3 text-left text-xs leading-5 text-[#7A8290]">' + escapeHtml(block.caption) + '</caption>'
      : '';
    const headerHtml = headers.map((header) =>
      '<th scope="col" class="border-b border-white/[0.08] px-4 py-3.5 text-[10px] font-mono uppercase tracking-[0.1em] text-[#8E96A4]">' +
      inlineMarkdownToHtml(header) + '</th>'
    ).join('');
    const rowHtml = rows.map((row) =>
      '<tr class="border-b border-white/[0.06]">' +
      headers.map((_, index) =>
        '<td class="px-4 py-3.5 align-top leading-6 text-[#B6BBC5]">' +
        inlineMarkdownToHtml(Array.isArray(row) ? row[index] || '' : '') + '</td>'
      ).join('') +
      '</tr>'
    ).join('');
    return '<div class="my-12 overflow-x-auto rounded-[18px] border border-white/[0.08]">' +
      '<table class="w-full min-w-[560px] border-collapse text-left text-sm">' + caption +
      '<thead><tr class="bg-white/[0.035]">' + headerHtml +
      '</tr></thead><tbody>' + rowHtml + '</tbody></table></div>';
  }

  if (block.type === 'callout') {
    const calloutLabel = block.tone === 'warning'
      ? (insight.language === 'id' ? 'Perhatian' : 'Watch')
      : block.tone === 'success'
        ? (insight.language === 'id' ? 'Prinsip' : 'Principle')
        : block.tone === 'info'
          ? (insight.language === 'id' ? 'Catatan' : 'Note')
          : (insight.language === 'id' ? 'Insight' : 'Insight');
    return '<aside class="my-9 rounded-[18px] border border-white/[0.08] bg-white/[0.018] p-5 sm:p-6">' +
      '<p class="mb-2 text-[9px] font-mono font-semibold uppercase tracking-[0.16em] text-[#E50914]">' +
      calloutLabel + '</p>' +
      (safeText(block.title) ? '<p class="mb-2 text-sm font-semibold text-white">' + escapeHtml(block.title) + '</p>' : '') +
      '<p class="text-sm leading-7 text-[#B9BEC8]">' + inlineMarkdownToHtml(block.text) + '</p></aside>';
  }

  if (block.type === 'code') {
    return '<pre class="my-9 overflow-x-auto rounded-[22px] border border-white/[0.08] bg-[#08090B] p-5 text-xs leading-6 text-[#D7DAE0] sm:p-6"><code>' +
      escapeHtml(block.code) + '</code></pre>';
  }

  if (block.type === 'link') {
    try {
      const parsed = new URL(block.url, manifest.siteUrl);
      if (!['http:', 'https:'].includes(parsed.protocol)) return '';
      const external = parsed.origin !== new URL(manifest.siteUrl).origin;
      const rel = external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return '<p class="my-8"><a href="' + escapeHtml(parsed.toString()) + '"' + rel +
        ' class="inline-flex min-h-[42px] items-center rounded-full border border-white/[0.12] bg-white/[0.035] px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white">' +
        escapeHtml(block.label) + '</a></p>';
    } catch {
      return '';
    }
  }

  if (block.type === 'promo') {
    const promoLabel = insight.language === 'id' ? 'Rekomendasi Kapitech' : 'Kapitech recommendation';
    const promoBadge = insight.language === 'id'
      ? (block.serviceReference ? 'Layanan terkait' : 'Promosi')
      : (block.serviceReference ? 'Relevant service' : 'Sponsored');
    return '<aside data-kapi-ad="true" class="relative my-12 overflow-hidden rounded-[22px] border border-[#E50914]/25 bg-[#111318] p-5 sm:my-14 sm:p-6">' +
      '<div class="absolute inset-x-0 top-0 h-[2px] bg-[#E50914]"></div>' +
      '<div class="mb-5 flex items-center justify-between gap-4 border-b border-[#E50914]/10 pb-3.5"><span class="text-[9px] font-mono font-semibold uppercase tracking-[0.17em] text-[#E50914]">' +
      escapeHtml(promoLabel) + '</span><span class="rounded-full border border-[#E50914]/20 bg-[#E50914]/[0.07] px-2.5 py-1 text-[8px] font-mono font-semibold uppercase tracking-[0.13em] text-[#E50914]">' +
      escapeHtml(promoBadge) + '</span></div>' +
      '<p class="text-[9px] font-mono uppercase tracking-[0.17em] text-[#E50914]">' + escapeHtml(block.eyebrow) + '</p>' +
      '<h3 class="mt-2.5 text-[20px] font-display font-semibold leading-[1.18] tracking-[-0.03em] text-white sm:text-[22px]">' + escapeHtml(block.title) + '</h3>' +
      '<p class="mt-2.5 max-w-xl text-[13px] leading-6 text-[#9299A6]">' + escapeHtml(block.description) + '</p>' +
      (block.serviceReference ? '<p class="mt-3 text-[9px] font-mono uppercase tracking-[0.12em] text-[#646C78]">' + escapeHtml(block.serviceReference) + '</p>' : '') +
      '<a href="' + escapeHtml(absoluteUrl(block.ctaUrl)) + '" class="mt-5 inline-flex min-h-[42px] items-center rounded-full border border-white/[0.12] bg-white/[0.035] px-5 py-2.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white">' +
      escapeHtml(block.ctaLabel) + '</a></aside>';
  }

  if (block.type === 'checklist') {
    const items = (Array.isArray(block.items) ? block.items : [])
      .map((item) =>
        '<li class="flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.018] px-4 py-3.5 text-sm leading-6 text-[#C3C7D0]"><span aria-hidden="true">✓</span><span>' +
        inlineMarkdownToHtml(item) + '</span></li>'
      ).join('');
    return '<section class="my-12 border-y border-white/[0.08] py-8 sm:py-9">' +
      (safeText(block.title) ? '<h3 class="mb-5 text-xl font-display font-semibold text-white">' + escapeHtml(block.title) + '</h3>' : '') +
      '<ul class="grid gap-3 sm:grid-cols-2">' + items + '</ul></section>';
  }

  if (block.type === 'divider') {
    return '<div class="my-14 flex items-center gap-4" aria-hidden="true"><span class="h-px flex-1 bg-white/[0.07]"></span><span class="h-1 w-1 rounded-full bg-[#E50914]/70"></span><span class="h-px flex-[0.18] bg-white/[0.07]"></span></div>';
  }

  return '';
};

const renderAuthor = (insight) => {
  if (!insight.author?.name) return '';

  const avatar = insight.author.avatar
    ? '<img src="' + escapeHtml(absoluteUrl(insight.author.avatar)) + '" alt="" width="48" height="48" loading="lazy" decoding="async" class="h-12 w-12 shrink-0 rounded-full border border-white/[0.08] object-cover" />'
    : '<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-sm font-semibold text-white" aria-hidden="true">' +
      escapeHtml(insight.author.name.slice(0, 1).toUpperCase()) + '</div>';

  return '<section class="mt-12 border-t border-white/[0.07] pt-8" aria-labelledby="prerender-author-title">' +
    '<p id="prerender-author-title" class="text-[9px] font-mono uppercase tracking-[0.16em] text-[#747B88]">' +
    escapeHtml(insight.language === 'id' ? 'Tentang penulis' : 'About the author') + '</p>' +
    '<div class="mt-5 flex items-start gap-4">' + avatar + '<div>' +
    '<p class="text-sm font-semibold text-white">' + escapeHtml(insight.author.name) + '</p>' +
    (insight.author.role ? '<p class="mt-1 text-xs text-[#747B88]">' + escapeHtml(insight.author.role) + '</p>' : '') +
    (insight.author.bio ? '<p class="mt-3 max-w-xl text-sm leading-6 text-[#9BA2AF]">' + escapeHtml(insight.author.bio) + '</p>' : '') +
    '</div></div></section>';
};

const relatedItems = (insight) => {
  const seen = new Set();
  return (Array.isArray(insight.relatedInsights) ? insight.relatedInsights : [])
    .filter((item) => {
      if (!item || item.slug === insight.slug || item.id === insight.id) return false;
      if (item.status !== 'published' || item.language !== insight.language) return false;
      if (seen.has(item.slug)) return false;
      seen.add(item.slug);
      return true;
    })
    .slice(0, 3);
};

const renderInsightBody = (insight) => {
  const rawBlocks = Array.isArray(insight.content) ? insight.content : [];
  const language = insight.language;
  const isMvpValidationInsight = insight.slug?.startsWith('mvp-vs-prototype-vs-proof-of-concept');
  let promoSeen = 0;
  const blocks = isMvpValidationInsight
    ? rawBlocks.filter((block) => {
        if (block?.type !== 'promo') return true;
        promoSeen += 1;
        return promoSeen === 1;
      })
    : rawBlocks;
  const headingIds = buildInsightHeadingIdList(blocks);
  const toc = buildInsightTocList(blocks, headingIds);
  const explicitFaq = Array.isArray(insight.faq)
    ? insight.faq.filter((item) => safeText(item?.question) && safeText(item?.answer))
    : [];
  const faq = explicitFaq.length > 0
    ? explicitFaq
    : deriveInsightFaq(blocks, language);
  const label = (idText, enText) => language === 'id' ? idText : enText;
  const category = insight.category?.displayName
    || insight.category?.name?.[language]
    || insight.category?.name?.en
    || insight.category?.name?.id
    || insight.category?.slug;

  const coverAlt = safeText(insight.coverImageAlt) || insight.title;
  const coverWidth = Number.isFinite(insight.coverImageWidth) && Number(insight.coverImageWidth) > 0 ? String(insight.coverImageWidth) : '';
  const coverHeight = Number.isFinite(insight.coverImageHeight) && Number(insight.coverImageHeight) > 0 ? String(insight.coverImageHeight) : '';
  const dimensions = coverWidth && coverHeight ? ' width="' + escapeHtml(coverWidth) + '" height="' + escapeHtml(coverHeight) + '"' : '';

  let html = '';
  html += '<div class="pointer-events-none fixed inset-0 z-0 overflow-y-auto bg-[#0B0C0E] pt-24" id="kapi-prerendered-insight">';
  html += '<main class="mx-auto w-full max-w-[1240px] px-5 pb-16 sm:px-8 lg:px-10">';
  const heroAsset = language === 'id'
    ? '/insights/mvp-vs-prototype-vs-proof-of-concept/hero.svg'
    : '/insights/mvp-vs-prototype-vs-proof-of-concept/hero-en.svg';
  const heroAlt = language === 'id' ? 'Peta validasi Prototype, MVP, dan PoC' : 'Validation map for Prototype, MVP, and PoC';

  html += '<header class="relative overflow-hidden border-b border-white/[0.07]">';
  html += '<div class="absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,rgba(229,9,20,0.10),transparent_34%),radial-gradient(circle_at_20%_8%,rgba(255,255,255,0.04),transparent_28%)]" aria-hidden="true"></div>';
  html += '<div class="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 pt-28 sm:px-6 sm:pb-16 sm:pt-32 md:px-12 lg:pb-20 lg:pt-36">';
  html += '<div class="grid items-center gap-10 lg:grid-cols-[minmax(0,1.04fr)_minmax(320px,0.76fr)] lg:gap-14">';
  html += '<div class="min-w-0">';
  html += '<nav class="mb-7 flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.13em] text-[#69717D]" aria-label="Breadcrumb">';
  html += '<a href="/" class="shrink-0">' + escapeHtml(label('Beranda', 'Home')) + '</a><span aria-hidden="true">›</span>';
  html += '<a href="/insights" class="shrink-0">' + escapeHtml(label('Insight', 'Insights')) + '</a><span aria-hidden="true">›</span>';
  html += '<span class="truncate text-[#A2A8B4]">' + escapeHtml(category || 'Insight') + '</span></nav>';
  html += '<div class="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-white/[0.09] bg-[#0B0C0E]/45 px-3.5 py-2 text-[9px] font-mono uppercase tracking-[0.16em] text-[#A2A8B4]">';
  html += '<span class="h-1.5 w-1.5 rounded-full bg-[#E50914]" aria-hidden="true"></span>';
  html += '<span class="text-[#E50914]">' + escapeHtml(category || 'Insight') + '</span><span class="text-[#5E6672]">/</span><span>' +
    escapeHtml(insight.editorialMeta?.editorialType || label('Panduan', 'Guide')) + '</span></div>';
  html += '<h1 class="mt-7 max-w-[880px] font-display text-[2.8rem] font-semibold leading-[0.96] tracking-[-0.058em] text-white sm:text-6xl lg:text-[5.3rem]">' +
    escapeHtml(insight.title) + '</h1>';
  if (insight.excerpt) html += '<p class="mt-6 max-w-2xl text-[15px] leading-7 text-[#A2A8B4] sm:text-base sm:leading-8">' +
    inlineMarkdownToHtml(insight.excerpt) + '</p>';
  html += '<div class="mt-8 grid max-w-2xl gap-4 border-t border-white/[0.07] pt-5 sm:grid-cols-[minmax(0,1.35fr)_auto_auto] sm:items-end">';
  if (insight.author?.name) html += '<div><p class="text-[9px] font-mono uppercase tracking-[0.15em] text-[#626A76]">' +
    escapeHtml(label('Ditulis oleh', 'Written by')) + '</p><p class="mt-1 text-sm font-medium text-white">' +
    escapeHtml(insight.author.name) + '</p></div>';
  html += '<div class="sm:border-l sm:border-white/[0.07] sm:pl-5"><p class="text-[9px] font-mono uppercase tracking-[0.15em] text-[#626A76]">' +
    escapeHtml(label('Waktu baca', 'Reading time')) + '</p><p class="mt-1 text-sm font-semibold text-white">' +
    escapeHtml(insight.readingTime ? String(insight.readingTime) + ' ' + label('menit', 'min') : '—') + '</p></div>';
  html += '<div class="sm:border-l sm:border-white/[0.07] sm:pl-5"><p class="text-[9px] font-mono uppercase tracking-[0.15em] text-[#626A76]">' +
    escapeHtml(label('Diterbitkan', 'Published')) + '</p><time class="mt-1 block text-sm font-semibold text-white">' +
    (insight.publishedAt ? escapeHtml(new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(insight.publishedAt))) : '—') + '</time></div>';
  html += '</div></div>';

  html += '<figure class="overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#0B0C0E]">';
  html += '<div class="border-b border-white/[0.07] px-5 py-3.5 sm:px-6"><div class="flex items-center justify-between gap-4"><div>' +
    '<p class="text-[9px] font-mono uppercase tracking-[0.16em] text-[#E50914]">' + escapeHtml(label('Peta validasi', 'Validation map')) + '</p>' +
    '<p class="mt-1 text-[10px] text-[#68707C]">' + escapeHtml(label('Pengalaman / Nilai / Kelayakan', 'Experience / Value / Feasibility')) + '</p></div>' +
    '<span class="rounded-full border border-white/[0.08] px-2.5 py-1 font-mono text-[8px] font-semibold tracking-[0.12em] text-[#7A8290]">01 / 03</span></div></div>';
  html += '<div class="aspect-[4/3] bg-[#090A0C]"><img src="' + escapeHtml(absoluteUrl(heroAsset)) + '" alt="' + escapeHtml(heroAlt) +
    '" loading="eager" decoding="async" class="block h-full w-full object-cover" /></div>';
  html += '<figcaption class="border-t border-white/[0.07] px-5 py-3.5 sm:px-6"><span class="text-[9px] font-mono uppercase tracking-[0.14em] text-[#69717D]">' +
    escapeHtml(label('Satu pertanyaan utama, satu alat validasi.', 'One key question, one validation instrument.')) + '</span></figcaption>';
  html += '</figure></div></div>';
  html += '</header>';

  html += '<div class="mt-10 grid gap-7 xl:grid-cols-[56px_minmax(0,1fr)_304px]">';
  html += '<aside class="hidden xl:block" aria-label="Article utilities">Share</aside>';
  html += '<article class="min-w-0 w-full max-w-[820px] justify-self-center text-[#C3C7D0]">';

  if (Array.isArray(insight.keyTakeaways) && insight.keyTakeaways.length) {
    html += '<section class="mb-12 border-y border-white/[0.08] py-8" aria-labelledby="prerender-key-takeaways"><p id="prerender-key-takeaways" class="text-[9px] font-mono uppercase tracking-[0.18em] text-[#E50914]">' +
      escapeHtml(label('Poin utama', 'Article key takeaways')) + '</p><ul class="mt-4 space-y-2">';
    for (const item of insight.keyTakeaways) {
      html += '<li class="flex gap-3 text-[15px] leading-7 text-[#C3C7D0]"><span aria-hidden="true">•</span><span>' +
        inlineMarkdownToHtml(item) + '</span></li>';
    }
    html += '</ul></section>';
  }

  for (const [index, block] of blocks.entries()) {
    html += renderBlock(block, headingIds[index], insight);
  }

  html += '<div data-insight-article-end aria-hidden="true"></div>';
  html += renderAuthor(insight);

  const related = relatedItems(insight);
  if (related.length) {
    html += '<section class="mt-14 border-t border-white/[0.07] pt-10" aria-labelledby="prerender-related-title"><p class="text-[9px] font-mono uppercase tracking-[0.18em] text-[#69717D]">Library</p><h2 id="prerender-related-title" class="mt-2 text-3xl font-display font-semibold tracking-[-0.04em] text-white">' +
      escapeHtml(label('Insight terkait', 'Top stories & related insights')) + '</h2><ul class="mt-6 grid gap-4 sm:grid-cols-3">';
    for (const item of related) {
      html += '<li class="border border-white/[0.08] p-4"><a href="/insights/' + escapeHtml(encodeURIComponent(item.slug)) + '" class="text-sm font-semibold text-white">' + escapeHtml(item.title) + '</a></li>';
    }
    html += '</ul></section>';
  }

  if (faq.length) {
    html += '<section class="mt-14 border-t border-white/[0.08] pt-10" aria-labelledby="faq-title"><h2 id="faq-title" class="text-2xl font-display font-semibold text-white sm:text-3xl">' +
      escapeHtml(label('Pertanyaan yang sering diajukan', 'Frequently asked questions')) + '</h2><div class="mt-5 space-y-3">';
    for (const item of faq) {
      html += '<details class="rounded-2xl border border-white/[0.08] bg-white/[0.018] px-5 py-4"><summary class="cursor-pointer list-none text-sm font-semibold leading-6 text-white">' +
        escapeHtml(item.question) + '</summary><p class="pt-3 text-sm leading-7 text-[#9BA2AF]">' + inlineMarkdownToHtml(item.answer) + '</p></details>';
    }
    html += '</div></section>';
  }

  html += '</article>';
  html += '<aside class="hidden xl:block" aria-label="Article navigation"><p class="text-[10px] font-mono uppercase tracking-[0.17em] text-[#8E96A3]">' +
    escapeHtml(label('Di artikel ini', 'In this article')) + '</p><nav class="mt-4" aria-label="Table of contents"><ol>';
  for (const item of toc) {
    html += '<li class="' + (item.level === 3 ? 'ml-4' : '') + '"><a href="#' + escapeHtml(item.id) + '">' + escapeHtml(item.text) + '</a></li>';
  }
  html += '</ol></nav><a href="/contact">Book a Call</a></aside></div>';

  html += '</main></div>';
  return html;
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
  const pattern = /<script\b[^>]*id="kapitech-insight-jsonld"[^>]*>[\s\S]*?<\/script>/i;
  const tag = '<script id="kapitech-insight-jsonld" type="application/ld+json">' + json + '</script>';
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', '    ' + tag + '\n  </head>');
};

const setHtmlLang = (html, language) =>
  html.replace(/<html([^>]*)\slang="[^"]*"/i, '<html$1 lang="' + escapeHtml(language) + '"');

const setInsightHreflang = (html, variants, xDefault) => {
  let result = html.replace(/<link\\b[^>]*data-kapi-insight-hreflang[^>]*>/gi, '');
  const tags = variants.map(({ language, slug }) =>
    '<link rel="alternate" data-kapi-insight-hreflang="true" hreflang="' + escapeHtml(language) +
    '" href="' + escapeHtml(manifest.siteUrl + '/insights/' + encodeURIComponent(slug)) + '" />'
  );

  if (xDefault) {
    tags.push('<link rel="alternate" data-kapi-insight-hreflang="true" hreflang="x-default" href="' +
      escapeHtml(manifest.siteUrl + '/insights/' + encodeURIComponent(xDefault)) + '" />');
  }

  if (tags.length) result = result.replace('</head>', '    ' + tags.join('\n    ') + '\n  </head>');
  return result;
};

const renderInsight = (sourceHtml, insight, variants) => {
  const seo = normalizeInsightSeo(insight, {
    siteUrl: manifest.siteUrl,
    siteName: manifest.siteName,
    defaultImage: manifest.defaultImage
  });

  let html = sourceHtml;
  html = setHtmlLang(html, seo.language);
  html = setTitle(html, seo.title);
  html = setMeta(html, 'name', 'title', seo.title);
  html = setMeta(html, 'name', 'description', seo.description);
  html = setMeta(html, 'name', 'robots', seo.robots);
  html = setMeta(html, 'property', 'og:type', 'article');
  html = setMeta(html, 'property', 'og:url', seo.canonicalUrl);
  html = setMeta(html, 'property', 'og:title', seo.title);
  html = setMeta(html, 'property', 'og:description', seo.description);
  html = setMeta(html, 'property', 'og:image', seo.image);
  html = setMeta(html, 'property', 'og:image:alt', seo.title);
  html = setMeta(html, 'property', 'og:site_name', manifest.siteName);
  html = setMeta(html, 'property', 'og:locale', seo.locale);
  html = setMeta(html, 'property', 'og:locale:alternate', seo.alternateLocale);
  html = setMeta(html, 'name', 'twitter:card', 'summary_large_image');
  html = setMeta(html, 'name', 'twitter:url', seo.canonicalUrl);
  html = setMeta(html, 'name', 'twitter:title', seo.title);
  html = setMeta(html, 'name', 'twitter:description', seo.description);
  html = setMeta(html, 'name', 'twitter:image', seo.image);
  html = setMeta(html, 'name', 'twitter:site', '@kapitechagency');
  html = setMeta(html, 'name', 'twitter:creator', '@kapitechagency');
  html = setCanonical(html, seo.canonicalUrl);
  html = setInsightHreflang(html, variants, seo.xDefault?.slug || null);
  html = setPageJsonLd(html, buildInsightStructuredData(insight, seo, {
    siteUrl: manifest.siteUrl,
    siteName: manifest.siteName
  }));

  return html.replace('</body>', renderInsightBody(insight) + '\n</body>');
};

const { variants } = await fetchPublishedInsights();

for (const insight of variants) {
  const groupKey = insight.contentGroupId || insight.id;
  const alternateVariants = variants
    .filter((variant) => (variant.contentGroupId || variant.id) === groupKey)
    .map((variant) => ({ language: variant.language, slug: variant.slug }));

  const outputPath = join(distDir, 'insights', insight.slug, 'index.html');
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, renderInsight(template, insight, alternateVariants), 'utf8');
  console.log('[seo] generated /insights/' + insight.slug + '/index.html');
}

for (const route of manifest.routes) {
  if (route.path.startsWith('/insights/')) continue;

  const canonicalUrl = manifest.siteUrl + (route.path === '/' ? '/' : route.path);
  let html = template;
  html = setTitle(html, route.title);
  html = setMeta(html, 'name', 'title', route.title);
  html = setMeta(html, 'name', 'description', route.description);
  html = setMeta(html, 'name', 'robots', route.robots);
  html = setMeta(html, 'property', 'og:url', canonicalUrl);
  html = setMeta(html, 'property', 'og:title', route.title);
  html = setMeta(html, 'property', 'og:description', route.description);
  html = setCanonical(html, canonicalUrl);

  const outputPath = route.path === '/'
    ? join(distDir, 'index.html')
    : join(distDir, route.path.replace(/^\/+/, ''), 'index.html');

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html, 'utf8');
  console.log('[seo] generated ' + posix.normalize(route.path + '/index.html'));
}
