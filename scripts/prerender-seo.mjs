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
import { splitInsightBlocks } from '../src/lib/insightArticlePresentation.mjs';

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

const resolveInsightVisualUrl = (rawUrl, language) => {
  const value = safeText(rawUrl);
  if (!value) return value;

  const match = value.match(/^(.*\/(validate|learning-loop|comparison|decision-tree|framework))(?:-id)?(\.svg)$/i);
  if (!match) return value;

  const [, base, basename, extension] = match;
  return base + (language === 'id' ? '-id' : '') + extension;
};

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

const renderCanonicalInsightBlock = (block, headingId, insight, sectionNumber = 0) => {
  if (!block || typeof block !== 'object') return '';

  const label = (idText, enText) => insight.language === 'id' ? idText : enText;

  if (block.type === 'paragraph') {
    return '<p class="mb-5 max-w-[72ch] text-[15px] font-light leading-[1.82] text-[#C3C7D0] sm:text-[15.5px] sm:leading-[1.84]">' +
      inlineMarkdownToHtml(block.text) + '</p>';
  }

  if (block.type === 'heading') {
    if (block.level === 3) {
      return '<h3 id="' + escapeHtml(headingId) + '" class="scroll-mt-28 mb-3 mt-8 border-l border-white/[0.12] pl-4 font-display text-xl font-semibold leading-[1.2] tracking-[-0.025em] text-white sm:text-[1.3rem]">' +
        escapeHtml(block.text) + '</h3>';
    }

    return '<h2 id="' + escapeHtml(headingId) + '" class="scroll-mt-28 mb-4 mt-12 first:mt-2 font-display text-[1.85rem] font-semibold leading-[1.12] tracking-[-0.04em] text-white sm:text-[2rem]">' +
      escapeHtml(block.text) + '</h2>';
  }

  if (block.type === 'list') {
    const tag = block.ordered ? 'ol' : 'ul';
    const cls = block.ordered ? 'list-decimal' : 'list-disc';
    const items = (Array.isArray(block.items) ? block.items : [])
      .map((item) => '<li class="pl-1 marker:text-brand-red">' + inlineMarkdownToHtml(item) + '</li>')
      .join('');
    return '<' + tag + ' class="' + cls + ' mb-6 space-y-2.5 pl-6 text-[15px] font-light leading-7 text-[#C3C7D0] sm:text-base">' +
      items + '</' + tag + '>';
  }

  if (block.type === 'quote') {
    return '<figure class="my-8 overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#111216] shadow-[inset_0_1px_0_rgba(255,255,255,0.018)] sm:my-9">' +
      '<div class="flex items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-3.5 sm:px-6"><span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.045] text-[#8E96A4]">“</span><span class="text-[8px] font-mono font-semibold uppercase tracking-[0.16em] text-[#626A76]">' +
      escapeHtml(label('Catatan', 'Field note')) + '</span></div>' +
      '<div class="px-5 py-6 sm:px-6 sm:py-7"><blockquote class="max-w-3xl font-display text-[1.18rem] font-medium leading-[1.55] tracking-[-0.018em] text-white sm:text-[1.35rem]">' +
      inlineMarkdownToHtml(block.text) + '</blockquote>' +
      (safeText(block.attribution) ? '<figcaption class="mt-4 flex items-center gap-2 text-xs text-[#7A8290]"><span class="h-px w-5 bg-white/[0.12]" aria-hidden="true"></span>' + escapeHtml(block.attribution) + '</figcaption>' : '') +
      '</div></figure>';
  }

  if (block.type === 'image') {
    const fallback = absoluteUrl('/insights/mvp-vs-prototype-vs-proof-of-concept/visual-fallback.svg');
    const visualUrl = resolveInsightVisualUrl(block.url, insight.language);
    const widthValue = Number.isFinite(block.width) && Number(block.width) > 0 ? Number(block.width) : null;
    const heightValue = Number.isFinite(block.height) && Number(block.height) > 0 ? Number(block.height) : null;
    const width = widthValue ? ' width="' + String(widthValue) + '"' : '';
    const height = heightValue ? ' height="' + String(heightValue) + '"' : '';
    const aspectRatio = widthValue && heightValue
      ? ' style="aspect-ratio:' + String(widthValue) + ' / ' + String(heightValue) + ';"'
      : '';

    return '<figure class="my-8 sm:my-10" data-kapi-article-visual="true"><div class="overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#0F1013] shadow-[inset_0_1px_0_rgba(255,255,255,0.018)]">' +
      '<div class="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3"><span class="text-[8px] font-mono font-semibold uppercase tracking-[0.16em] text-[#6D7582]">' +
      escapeHtml(label('Visual artikel', 'Article visual')) + '</span><span class="text-[8px] font-mono tabular-nums text-[#4F5763]">' +
      (widthValue && heightValue ? String(widthValue) + ' × ' + String(heightValue) : 'Visual') + '</span></div>' +
      '<div class="relative overflow-hidden bg-[#0B0C0E]"' + aspectRatio + '><div class="flex h-full w-full items-center justify-center p-1 sm:p-1.5">' +
      '<img src="' + escapeHtml(absoluteUrl(visualUrl)) + '" alt="' + escapeHtml(block.alt || insight.title) + '"' + width + height +
      ' loading="lazy" decoding="async" class="' + (widthValue && heightValue ? 'block h-full w-full object-contain' : 'block h-auto w-full object-contain') +
      '" sizes="(min-width: 1280px) 820px, calc(100vw - 2rem)" onerror="this.onerror=null;this.src=\'' + escapeHtml(fallback) + '\';" /></div></div></div>' +
      (safeText(block.caption) ? '<figcaption class="mt-3 max-w-[70ch] text-xs leading-5 text-[#737B88]">' + inlineMarkdownToHtml(block.caption) + '</figcaption>' : '') +
      '</figure>';
  }

  if (block.type === 'table') {
    const headers = Array.isArray(block.headers) ? block.headers : [];
    const rows = Array.isArray(block.rows) ? block.rows : [];
    if (!headers.length) return '';

    const headerHtml = headers.map((header, index) =>
      '<th scope="col" class="' +
      'border-b border-white/[0.08] px-4 py-4 text-left text-[10px] font-mono font-semibold uppercase leading-4 tracking-[0.1em] text-[#A2A9B6]' +
      (index === 0 ? ' sticky left-0 z-10 bg-[#141519] shadow-[1px_0_0_rgba(255,255,255,0.07)]' : '') +
      '">' +
      inlineMarkdownToHtml(header) + '</th>'
    ).join('');
    const rowHtml = rows.map((row) =>
      '<tr class="border-b border-white/[0.055] transition-colors duration-150 last:border-b-0 hover:bg-white/[0.018]">' +
      headers.map((_, index) =>
        '<td class="' +
        'px-4 py-4 align-top text-[13px] leading-[1.65] text-[#B9BEC8] sm:text-[13.5px]' +
        (index === 0 ? ' sticky left-0 z-[5] bg-[#0F1013] font-medium text-white shadow-[1px_0_0_rgba(255,255,255,0.055)]' : '') +
        '">' +
        inlineMarkdownToHtml(Array.isArray(row) ? row[index] || '' : '') + '</td>'
      ).join('') + '</tr>'
    ).join('');
    const columnBadge = headers.length > 1
      ? '<span class="shrink-0 rounded-full bg-white/[0.035] px-2 py-1 font-mono text-[8px] font-semibold tabular-nums text-[#626A76]">' +
        String(headers.length) + ' ' + escapeHtml(label('kolom', 'columns')) + '</span>'
      : '';

    return '<div class="my-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0F1013]">' +
      '<div class="border-b border-white/[0.06] px-4 py-2.5 sm:hidden"><div class="flex items-center justify-between gap-3"><p class="text-[9px] font-mono uppercase tracking-[0.12em] text-[#737B88]">' +
      escapeHtml(label('Geser untuk membandingkan', 'Swipe to compare')) + '</p>' + columnBadge + '</div></div>' +
      '<div class="overflow-x-auto overscroll-x-contain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-inset" tabindex="0" role="region" aria-label="' +
      escapeHtml(block.caption || label('Tabel artikel', 'Article table')) + '">' +
      '<table class="w-full min-w-[760px] border-collapse text-left text-sm">' +
      (safeText(block.caption) ? '<caption class="caption-top border-b border-white/[0.06] px-4 py-3.5 text-left text-xs leading-5 text-[#7A8290]">' + inlineMarkdownToHtml(block.caption) + '</caption>' : '') +
      '<thead><tr class="bg-[#141519]">' + headerHtml + '</tr></thead><tbody>' + rowHtml + '</tbody></table></div></div>';
  }

  if (block.type === 'callout') {
    const tone = block.tone || 'neutral';
    const toneClass = tone === 'warning'
      ? 'bg-amber-400/[0.1] text-amber-300'
      : tone === 'success'
        ? 'bg-emerald-400/[0.1] text-emerald-300'
        : 'bg-white/[0.05] text-[#A2A9B6]';
    const toneLabel = tone === 'warning'
      ? label('Perhatian', 'Attention')
      : tone === 'success'
        ? label('Tervalidasi', 'Validated')
        : label('Catatan', 'Note');
    return '<aside class="my-8 rounded-[20px] border border-white/[0.08] bg-[#111216] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.018)] sm:p-6">' +
      '<div class="flex items-start gap-3.5"><span class="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ' + toneClass + '">' +
      (tone === 'warning' ? '!' : tone === 'success' ? '✓' : 'i') +
      '</span><div class="min-w-0 flex-1"><div class="flex flex-wrap items-center gap-x-2.5 gap-y-1"><span class="text-[8px] font-mono font-semibold uppercase tracking-[0.16em] text-[#626A76]">' +
      escapeHtml(toneLabel) + '</span>' +
      (safeText(block.title) ? '<span class="text-sm font-semibold text-white">' + escapeHtml(block.title) + '</span>' : '') +
      '</div><p class="mt-2.5 text-[13px] leading-7 text-[#B9BEC8] sm:text-[14px]">' + inlineMarkdownToHtml(block.text) + '</p></div></div></aside>';
  }

  if (block.type === 'code') {
    return '<div class="my-7 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#08090B]"><div class="flex items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3"><span class="text-[9px] font-mono uppercase tracking-[0.13em] text-[#69717D]">' +
      escapeHtml(block.language || label('Kode', 'Code')) + '</span></div><pre class="overflow-x-auto p-5 text-xs leading-6 text-[#D7DAE0] sm:p-6"><code>' +
      escapeHtml(block.code) + '</code></pre></div>';
  }

  if (block.type === 'link') {
    try {
      const parsed = new URL(block.url, manifest.siteUrl);
      if (!['http:', 'https:'].includes(parsed.protocol)) return '';
      const external = parsed.origin !== new URL(manifest.siteUrl).origin;
      const rel = external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return '<p class="my-5"><a href="' + escapeHtml(parsed.toString()) + '"' + rel +
        ' class="inline-flex items-center gap-2 text-sm font-semibold text-white underline decoration-white/25 underline-offset-4">' +
        escapeHtml(block.label) + (external ? ' ↗' : '') + '</a></p>';
    } catch {
      return '';
    }
  }

  if (block.type === 'promo') {
    return '<aside data-kapi-ad="true" class="relative my-9 overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#111216] shadow-[inset_0_1px_0_rgba(255,255,255,0.018)] sm:my-10">' +
      '<div class="absolute right-[-5rem] top-[-5rem] h-40 w-40 rounded-full bg-brand-red/[0.08] blur-3xl" aria-hidden="true"></div>' +
      '<div class="relative p-5 sm:p-6"><div class="flex items-start justify-between gap-4"><div class="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5"><p class="text-[9px] font-mono font-semibold uppercase tracking-[0.17em] text-[#E50914]">' +
      escapeHtml(block.eyebrow) + '</p><span class="text-[8px] font-mono uppercase tracking-[0.12em] text-[#626A76]">' +
      escapeHtml(block.serviceReference || label('Layanan terkait', 'Related service')) + '</span></div><span class="hidden shrink-0 rounded-full bg-white/[0.035] px-2.5 py-1 text-[8px] font-mono font-semibold uppercase tracking-[0.12em] text-[#646C78] sm:inline-flex">Kapitech</span></div>' +
      '<div class="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8"><div class="min-w-0 max-w-[620px]"><h3 class="font-display text-[1.4rem] font-semibold leading-[1.12] tracking-[-0.03em] text-white sm:text-[1.55rem]">' +
      escapeHtml(block.title) + '</h3><p class="mt-2.5 text-[13px] leading-6 text-[#8A909D]">' + escapeHtml(block.description) +
      '</p></div><a href="' + escapeHtml(absoluteUrl(block.ctaUrl)) + '" class="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-brand-red px-5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white sm:w-auto">' +
      escapeHtml(block.ctaLabel) + ' ↗</a></div></div></aside>';
  }

  if (block.type === 'checklist') {
    const items = (Array.isArray(block.items) ? block.items : [])
      .map((item, index) => '<li class="flex gap-3 rounded-xl bg-white/[0.022] px-3.5 py-3 text-sm leading-6 text-[#C3C7D0]"><span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-red/[0.12] font-mono text-[9px] font-semibold text-brand-red" aria-hidden="true">✓</span><span>' +
        inlineMarkdownToHtml(item) + '</span></li>').join('');
    return '<section class="my-8 rounded-[20px] border border-white/[0.08] bg-[#111216] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.018)] sm:p-6" aria-label="' + escapeHtml(block.title || label('Daftar periksa', 'Checklist')) + '">' +
      '<div class="flex items-end justify-between gap-4"><div class="min-w-0"><span class="text-[8px] font-mono font-semibold uppercase tracking-[0.16em] text-[#626A76]">Checklist</span>' +
      (safeText(block.title) ? '<h3 class="mt-1.5 font-display text-xl font-semibold leading-[1.2] text-white sm:text-[1.35rem]">' + escapeHtml(block.title) + '</h3>' : '') +
      '</div><span class="shrink-0 rounded-full bg-white/[0.035] px-2.5 py-1 font-mono text-[8px] font-semibold tabular-nums text-[#626A76]">' +
      String(items ? (Array.isArray(block.items) ? block.items.length : 0) : 0) + '</span></div><ul class="mt-5 space-y-2.5">' + items + '</ul></section>';
  }

  if (block.type === 'divider') {
    return '<div class="my-8 h-px bg-white/[0.07]" aria-hidden="true"></div>';
  }

  return '';
};

const renderInsightBody = (insight) => {
  const presentation = splitInsightBlocks(Array.isArray(insight.content) ? insight.content : []);
  const bodyBlocks = presentation.bodyBlocks;
  const introductionBlocks = presentation.introductionBlocks;
  const headingIds = buildInsightHeadingIdList(bodyBlocks);
  const toc = buildInsightTocList(bodyBlocks, headingIds);
  const explicitFaq = Array.isArray(insight.faq)
    ? insight.faq.filter((item) => safeText(item?.question) && safeText(item?.answer))
    : [];
  const faq = explicitFaq.length ? explicitFaq : deriveInsightFaq(insight.content, insight.language);
  const label = (idText, enText) => insight.language === 'id' ? idText : enText;
  const category = insight.category?.displayName || insight.category?.name?.[insight.language] || insight.category?.name?.en || insight.category?.name?.id || insight.category?.slug;

  const renderBody = (items) => items.map((block) => {
    const index = bodyBlocks.indexOf(block);
    return renderCanonicalInsightBlock(block, index >= 0 ? headingIds[index] : '', insight);
  }).join('');

  let html = '<div class="pointer-events-none fixed inset-0 z-0 overflow-y-auto bg-[#0B0C0E] opacity-0" id="kapi-prerendered-insight" aria-hidden="true">' +
    '<main class="mx-auto w-full max-w-[1440px] px-5 pb-16 sm:px-8 lg:px-10">';

  html += '<header class="relative overflow-hidden border-b border-white/[0.07] bg-[#0B0C0E]"><div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image:url(\'/insights/article-hero-background.jpg\')" aria-hidden="true"></div><div class="absolute inset-0 bg-[#0B0C0E]/48" aria-hidden="true"></div><div class="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-[#0B0C0E]/40 to-[#0B0C0E]" aria-hidden="true"></div><div class="relative mx-auto w-full max-w-[1240px] px-5 pb-12 pt-28 sm:px-8 sm:pb-14 sm:pt-36 lg:px-10 lg:pb-16 lg:pt-40">
  html += '<nav class="mb-9 flex items-center gap-2 overflow-x-auto text-[9px] font-mono uppercase tracking-[0.13em] text-[#646C78]" aria-label="Breadcrumb">' +
    '<a href="/" class="shrink-0">' + escapeHtml(label('Beranda', 'Home')) + '</a><span aria-hidden="true">›</span>' +
    '<a href="/insights" class="shrink-0">' + escapeHtml(label('Insight', 'Insights')) + '</a>';
  if (category) html += '<span aria-hidden="true">›</span><span class="truncate text-[#A2A8B4]">' + escapeHtml(category) + '</span>';
  html += '</nav>';

  html += '<div class="max-w-[980px]"><div class="flex flex-wrap items-center gap-2.5">';
  if (category) html += '<span class="inline-flex items-center rounded-full border border-white/[0.1] bg-[#0B0C0E] px-3.5 py-1.5 text-[9px] font-mono font-semibold uppercase tracking-[0.16em] text-[#E50914]">' + escapeHtml(category) + '</span>';
  if (insight.editorialMeta?.editorialType) html += '<span class="rounded-full border border-white/[0.08] bg-white/[0.018] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.14em] text-[#8A909D]">' + escapeHtml(insight.editorialMeta.editorialType) + '</span>';
  html += '</div><h1 class="mt-6 max-w-5xl font-display text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-[4.5rem]">' +
    escapeHtml(insight.title) + '</h1>';
  if (insight.excerpt) html += '<p class="mt-6 max-w-3xl text-base leading-8 text-[#A3A9B5] sm:text-lg">' + inlineMarkdownToHtml(insight.excerpt) + '</p>';
  html += '<div class="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/[0.07] pt-5 text-xs text-[#737A87]">';
  if (insight.author?.name) html += '<span class="font-medium text-white">' + escapeHtml(label('Ditulis oleh ', 'Written by ')) + escapeHtml(insight.author.name) + '</span>';
  if (insight.readingTime) html += '<span>' + escapeHtml(String(insight.readingTime)) + ' ' + escapeHtml(label('menit baca', 'min read')) + '</span>';
  if (insight.publishedAt) html += '<time datetime="' + escapeHtml(insight.publishedAt) + '">' + escapeHtml(new Intl.DateTimeFormat(insight.language === 'id' ? 'id-ID' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(insight.publishedAt))) + '</time>';
  html += '</div></div></div></header>';

  html += '<div class="mx-auto w-full max-w-[1240px] scroll-mt-28 px-5 pb-16 pt-8 sm:px-8 sm:pt-10 lg:px-10 lg:pb-20 lg:pt-12">';
  html += '<div class="mb-5 xl:hidden" aria-hidden="true">' +
    '<div class="mb-4 flex items-center gap-2 overflow-x-auto rounded-2xl border border-white/[0.07] bg-white/[0.014] p-2.5">' +
    '<span class="shrink-0 px-1.5 text-[9px] font-mono font-semibold uppercase tracking-[0.11em] text-[#E50914]">' +
    escapeHtml(label('Bagikan', 'Share')) + '</span>' +
    '<a href="https://instagram.com/kapitech.agency" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.018] text-[#9DA4B0]">IG</a>' +
    '<a href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(manifest.siteUrl + '/insights/' + encodeURIComponent(insight.slug)) + '" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.018] text-[#9DA4B0]">f</a>' +
    '<a href="https://x.com/intent/post?url=' + encodeURIComponent(manifest.siteUrl + '/insights/' + encodeURIComponent(insight.slug)) + '" target="_blank" rel="noopener noreferrer" aria-label="X" class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.018] text-[#9DA4B0]">X</a>' +
    '<a href="https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(manifest.siteUrl + '/insights/' + encodeURIComponent(insight.slug)) + '" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.018] text-[#9DA4B0]">in</a>' +
    '<button type="button" aria-label="' + escapeHtml(label('Salin tautan', 'Copy link')) + '" onclick="navigator.clipboard&&navigator.clipboard.writeText(location.href)" class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.018] text-[#9DA4B0]" title="' + escapeHtml(label('Salin tautan', 'Copy link')) + '">↗</button>' +
    '<span class="ml-auto shrink-0 font-mono text-[9px] tabular-nums text-[#68707C]">0%</span></div>' +
    '<nav class="max-h-[14.75rem] overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#101114] p-2.5"><ol class="space-y-1">' +
    toc.map((item, index) => '<li><a href="#' + escapeHtml(item.id) + '" class="flex min-h-11 items-center gap-3 rounded-[11px] border border-transparent px-2.5 py-2.5 ' +
      'text-[11px] font-medium text-[#C8CDD5]">' +
      '<span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] bg-white/[0.025] font-mono text-[8px] font-semibold text-[#69717D]">' + String(index + 1).padStart(2, '0') + '</span>' +
      '<span>' + escapeHtml(item.text) + '</span></a></li>').join('') +
    '</ol></nav><a href="/contact" class="mt-3 flex min-h-12 items-center justify-between rounded-2xl border border-white/[0.1] bg-brand-red px-4 py-3.5 text-white">' +
    '<span><span class="block text-[8px] font-mono uppercase tracking-[0.16em] text-white/70">' + escapeHtml(label('Siap berdiskusi?', 'Ready to discuss?')) + '</span><span class="mt-0.5 block text-[12px] font-semibold">Book a call</span></span><span aria-hidden="true">↗</span></a></div>';

  html += '<div class="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1040px)_minmax(0,1fr)]">';
  html += '<aside class="hidden xl:flex xl:flex-col xl:items-center xl:justify-self-end" aria-hidden="true"><span class="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] text-[#707885]">↗</span><span class="mt-8 font-mono text-[9px] tabular-nums text-[#707885]">0%</span></aside>';
  html += '<article class="min-w-0 w-full justify-self-center text-[#C3C7D0]">';

  if (introductionBlocks.length) {
    html += '<section class="mb-12 sm:mb-14" aria-label="' + escapeHtml(label('Pendahuluan', 'Introduction')) + '">' +
      introductionBlocks.map((block) => renderCanonicalInsightBlock(block, '', insight, 0)).join('') + '</section>';
  }

  if (Array.isArray(insight.keyTakeaways) && insight.keyTakeaways.length) {
    html += '<section class="mb-11 overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#111216] shadow-[inset_0_1px_0_rgba(255,255,255,0.018)] sm:mb-12" aria-labelledby="key-takeaways-title">' +
      '<div class="flex items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-4 sm:px-6"><div class="min-w-0"><p id="key-takeaways-title" class="text-[9px] font-mono font-semibold uppercase tracking-[0.18em] text-[#E50914]">' +
      escapeHtml(label('Poin utama', 'Article key takeaways')) + '</p><p class="mt-1.5 text-xs leading-5 text-[#7D8592]">' +
      escapeHtml(label('Gagasan yang paling penting untuk dibawa setelah membaca.', 'The ideas worth carrying forward.')) + '</p></div><span class="shrink-0 rounded-full bg-white/[0.035] px-2.5 py-1 font-mono text-[8px] font-semibold tabular-nums text-[#626A76]">' +
      String(insight.keyTakeaways.length) + '</span></div><ul class="grid gap-px bg-white/[0.045] sm:grid-cols-2">' +
      insight.keyTakeaways.map((item, index) => '<li class="flex gap-3 bg-[#111216] px-5 py-4 text-sm leading-7 text-[#CBD0D8] sm:px-6"><span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E50914]/[0.11] font-mono text-[9px] font-semibold tabular-nums text-[#E50914]" aria-hidden="true">' +
      String(index + 1).padStart(2, '0') + '</span><span>' + inlineMarkdownToHtml(item) + '</span></li>').join('') +
      '</ul></section>';
  }

  html += renderBody(bodyBlocks);



  html += '<div class="mt-12 h-px w-full bg-white/[0.07]" aria-hidden="true"></div><div class="pt-7"><a href="/insights" class="inline-flex items-center gap-2 text-xs font-semibold text-[#8C94A1] underline decoration-white/15 underline-offset-4">' +
    escapeHtml(label('Kembali ke Insight', 'Back to Insights')) + '</a></div></article>';

  html += '<aside class="hidden w-[304px] py-12 xl:block xl:justify-self-start" aria-label="' + escapeHtml(label('Navigasi artikel', 'Article navigation')) + '"><div class="sticky top-24 flex h-[calc(100dvh-7rem)] min-h-0 flex-col gap-3"><div class="min-h-0 flex-1 rounded-2xl border border-white/[0.08] bg-[#101114] p-4"><div><span class="inline-flex items-center rounded-full border border-white/[0.1] bg-[#0B0C0E] px-3 py-1.5 text-[8px] font-mono uppercase tracking-[0.17em] text-[#E50914]">' +
    escapeHtml(label('Di artikel ini', 'In this article')) + '</span><p class="mt-1 text-[10px] text-[#5E6672]">' +
    String(toc.filter((item) => item.level === 2).length) + ' ' + escapeHtml(label('bagian', 'sections')) + '</p></div><nav class="mt-4 max-h-[14.75rem] min-h-0 overflow-y-auto pr-1" aria-label="' +
    escapeHtml(label('Navigasi artikel', 'Article navigation')) + '"><ol class="space-y-1">';
  for (const item of toc) {
    html += '<li><a href="#' + escapeHtml(item.id) + '" class="block rounded-[10px] px-2.5 py-2 ' +
      'text-[12.5px] font-medium text-[#C8CDD5]' +
      '">' + escapeHtml(item.text) + '</a></li>';
  }

  html += '</ol></nav></div><a href="/contact" class="group flex min-h-12 shrink-0 items-center justify-between gap-4 rounded-2xl border border-white/[0.1] bg-brand-red px-4 py-3.5 text-white"><span><span class="block text-[8px] font-mono uppercase tracking-[0.16em] text-white/70">' +
    escapeHtml(label('Siap berdiskusi?', 'Ready to discuss?')) + '</span><span class="mt-0.5 block text-[12px] font-semibold">Book a call</span></span><span aria-hidden="true">↗</span></a></div></aside>';

  if (faq.length) {
    html += '<section class="mx-auto mt-16 w-full max-w-[820px] border-t border-white/[0.07] pt-10 sm:mt-20 sm:pt-12" aria-labelledby="faq-title"><div class="max-w-2xl"><span class="inline-flex items-center rounded-full border border-white/[0.1] bg-[#0B0C0E] px-3.5 py-1.5 text-[9px] font-mono font-semibold uppercase tracking-[0.16em] text-[#E50914]">FAQ</span><h2 id="faq-title" class="mt-3 font-display text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">' +
      escapeHtml(label('Pertanyaan yang sering diajukan', 'Frequently asked questions')) + '</h2><p class="mt-3 text-sm leading-7 text-[#8A909D]">' +
      escapeHtml(label('Jawaban singkat untuk pertanyaan yang paling sering muncul setelah membaca artikel ini.', 'Short answers to the questions readers are most likely to have after this article.')) +
      '</p></div><div class="mt-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.012]">';
    faq.forEach((item, index) => {
      html += '<details class="group border-b border-white/[0.07] last:border-b-0"><summary class="cursor-pointer list-none px-4 py-4 transition-colors duration-200 sm:px-5 sm:py-5"><span class="grid grid-cols-[28px_minmax(0,1fr)_20px] items-start gap-3"><span class="pt-0.5 font-mono text-[9px] font-semibold tabular-nums text-[#5E6672]">' +
        String(index + 1).padStart(2, '0') + '</span><span class="text-sm font-semibold leading-6 text-white">' + escapeHtml(item.question) +
        '</span><span class="pt-1 text-[#666E7B]" aria-hidden="true">›</span></span></summary><div class="grid grid-cols-[28px_minmax(0,1fr)_20px] gap-3 pb-5"><span></span><p class="text-sm leading-7 text-[#9BA2AF]">' +
        inlineMarkdownToHtml(item.answer) + '</p><span></span></div></details>';
    });
    html += '</div></section>';
  }

  html += '</div></div></main></div>';
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
