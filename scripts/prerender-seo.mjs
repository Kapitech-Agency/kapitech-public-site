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
      return '<h3 id="' + escapeHtml(headingId) + '" class="scroll-mt-28 mb-3 mt-8 border-l border-brand-red/35 pl-4 font-display text-xl font-semibold leading-[1.2] tracking-[-0.025em] text-white sm:text-[1.3rem]">' +
        escapeHtml(block.text) + '</h3>';
    }

    return '<h2 id="' + escapeHtml(headingId) + '" class="scroll-mt-28 mb-4 mt-12 first:mt-2 font-display text-[1.85rem] font-semibold leading-[1.12] tracking-[-0.04em] text-white sm:text-[2rem]">' +
      '<span class="mb-3 flex items-center gap-3 border-t border-white/[0.07] pt-5">' +
      '<span class="font-mono text-[9px] font-semibold tabular-nums tracking-[0.14em] text-[#E50914]">' +
      String(sectionNumber).padStart(2, '0') + '</span>' +
      '<span class="h-px w-8 bg-[#E50914]/45" aria-hidden="true"></span>' +
      '<span class="text-[9px] font-mono uppercase tracking-[0.16em] text-[#69717D]">' +
      escapeHtml(label('Bagian', 'Section')) + '</span></span>' +
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
    return '<figure class="my-8 border-l-2 border-brand-red/45 pl-5 sm:my-10 sm:pl-6">' +
      '<blockquote class="max-w-3xl font-display text-[1.18rem] leading-[1.55] tracking-[-0.015em] text-white sm:text-[1.35rem]">' +
      inlineMarkdownToHtml(block.text) + '</blockquote>' +
      (safeText(block.attribution) ? '<figcaption class="mt-3 text-xs text-[#747C88]">' + escapeHtml(block.attribution) + '</figcaption>' : '') +
      '</figure>';
  }

  if (block.type === 'image') {
    const fallback = absoluteUrl('/insights/mvp-vs-prototype-vs-proof-of-concept/visual-fallback.svg');
    const width = Number.isFinite(block.width) && Number(block.width) > 0 ? ' width="' + String(block.width) + '"' : '';
    const height = Number.isFinite(block.height) && Number(block.height) > 0 ? ' height="' + String(block.height) + '"' : '';
    return '<figure class="my-9 sm:my-10"><div class="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0F1013]">' +
      '<img src="' + escapeHtml(absoluteUrl(block.url)) + '" alt="' + escapeHtml(block.alt || insight.title) + '"' + width + height +
      ' loading="lazy" decoding="async" class="block h-auto w-full object-contain" onerror="this.onerror=null;this.src=\'' + escapeHtml(fallback) + '\';" />' +
      '</div>' +
      (safeText(block.caption) ? '<figcaption class="mt-3 max-w-[70ch] text-xs leading-5 text-[#737B88]">' + inlineMarkdownToHtml(block.caption) + '</figcaption>' : '') +
      '</figure>';
  }

  if (block.type === 'table') {
    const headers = Array.isArray(block.headers) ? block.headers : [];
    const rows = Array.isArray(block.rows) ? block.rows : [];
    const headerHtml = headers.map((header) =>
      '<th scope="col" class="border-b border-white/[0.08] px-4 py-3.5 text-[10px] font-mono uppercase tracking-[0.1em] text-[#8E96A4] first:sticky first:left-0 first:z-10 first:bg-[#0F1013]">' +
      inlineMarkdownToHtml(header) + '</th>'
    ).join('');
    const rowHtml = rows.map((row) =>
      '<tr class="border-b border-white/[0.06] last:border-b-0">' +
      headers.map((_, index) =>
        '<td class="px-4 py-3.5 align-top leading-6 text-[#B6BBC5] first:sticky first:left-0 first:z-[5] first:bg-[#0F1013]">' +
        inlineMarkdownToHtml(Array.isArray(row) ? row[index] || '' : '') + '</td>'
      ).join('') + '</tr>'
    ).join('');
    return '<div class="my-8 overflow-hidden border-y border-white/[0.08]">' +
      '<div class="border-b border-white/[0.06] px-0 py-2.5 sm:hidden"><p class="text-[9px] font-mono uppercase tracking-[0.12em] text-[#666E7B]">' +
      escapeHtml(label('Geser untuk melihat perbandingan', 'Swipe to compare')) + '</p></div>' +
      '<div class="overflow-x-auto rounded-[16px]" tabindex="0" role="region" aria-label="' +
      escapeHtml(block.caption || label('Tabel artikel', 'Article table')) + '">' +
      '<table class="w-full min-w-[560px] border-collapse text-left text-sm">' +
      (safeText(block.caption) ? '<caption class="caption-top px-4 py-3 text-left text-xs leading-5 text-[#7A8290]">' + inlineMarkdownToHtml(block.caption) + '</caption>' : '') +
      '<thead><tr class="bg-white/[0.035]">' + headerHtml + '</tr></thead><tbody>' + rowHtml + '</tbody></table></div></div>';
  }

  if (block.type === 'callout') {
    const border = block.tone === 'warning'
      ? 'border-amber-400/45'
      : block.tone === 'success'
        ? 'border-emerald-400/45'
        : 'border-brand-red/40';
    return '<aside class="my-7 border-l-2 pl-5 ' + border + '">' +
      (safeText(block.title) ? '<p class="mb-1 text-sm font-semibold text-white">' + escapeHtml(block.title) + '</p>' : '') +
      '<p class="text-sm font-light leading-7 text-[#B9BEC8]">' + inlineMarkdownToHtml(block.text) + '</p></aside>';
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
    return '<aside data-kapi-ad="true" class="my-10 border-y border-white/[0.08] border-l-2 border-l-brand-red/55 py-6 pl-5 sm:my-12 sm:pl-6">' +
      '<div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8"><div class="min-w-0 max-w-[620px]">' +
      '<div class="flex flex-wrap items-center gap-x-3 gap-y-1.5"><p class="text-[9px] font-mono font-semibold uppercase tracking-[0.17em] text-[#E50914]">' +
      escapeHtml(block.eyebrow) + '</p><span class="text-[8px] font-mono uppercase tracking-[0.12em] text-[#626A76]">' +
      escapeHtml(block.serviceReference || label('Layanan terkait', 'Related service')) + '</span></div>' +
      '<h3 class="mt-2.5 font-display text-[1.35rem] font-semibold leading-[1.14] tracking-[-0.03em] text-white sm:text-[1.5rem]">' +
      escapeHtml(block.title) + '</h3><p class="mt-2.5 text-[13px] leading-6 text-[#8A909D]">' +
      escapeHtml(block.description) + '</p></div><a href="' + escapeHtml(absoluteUrl(block.ctaUrl)) +
      '" class="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-brand-red px-5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white sm:w-auto">' +
      escapeHtml(block.ctaLabel) + ' ↗</a></div></aside>';
  }

  if (block.type === 'checklist') {
    const items = (Array.isArray(block.items) ? block.items : [])
      .map((item) => '<li class="flex gap-3 text-sm leading-6 text-[#C3C7D0]"><span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" aria-hidden="true"></span><span>' +
        inlineMarkdownToHtml(item) + '</span></li>').join('');
    return '<section class="my-8" aria-label="' + escapeHtml(block.title || label('Daftar periksa', 'Checklist')) + '">' +
      (safeText(block.title) ? '<h3 class="mb-4 font-display text-xl font-semibold leading-[1.2] text-white sm:text-[1.3rem]">' + escapeHtml(block.title) + '</h3>' : '') +
      '<ul class="space-y-3 border-l border-white/[0.12] pl-5">' + items + '</ul></section>';
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

  let sectionNumber = 0;
  const renderBody = (items) => items.map((block) => {
    const index = bodyBlocks.indexOf(block);
    if (block?.type === 'heading' && block.level === 2) sectionNumber += 1;
    return renderCanonicalInsightBlock(block, index >= 0 ? headingIds[index] : '', insight, sectionNumber);
  }).join('');

  let html = '<div class="pointer-events-none fixed inset-0 z-0 overflow-y-auto bg-[#0B0C0E] opacity-0" id="kapi-prerendered-insight" aria-hidden="true">' +
    '<main class="mx-auto w-full max-w-[1240px] px-5 pb-16 sm:px-8 lg:px-10">';

  html += '<header class="border-b border-white/[0.07] bg-[#0B0C0E]"><div class="mx-auto w-full max-w-[1240px] px-5 pb-12 pt-28 sm:px-8 sm:pb-14 sm:pt-36 lg:px-10 lg:pb-16 lg:pt-40">';
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
    '<div class="mb-5 flex items-center gap-4 border-y border-white/[0.08] py-3"><span class="text-[9px] font-mono font-semibold uppercase tracking-[0.11em] text-[#737A87]">' +
    escapeHtml(label('Bagikan', 'Share')) + '</span><span class="h-px flex-1 bg-white/[0.08]"></span><span class="font-mono text-[9px] tabular-nums text-[#68707C]">0%</span></div>' +
    '<nav class="rounded-2xl border border-white/[0.07] bg-white/[0.014] p-3"><ol class="space-y-1">' +
    toc.map((item) => '<li><a href="#' + escapeHtml(item.id) + '" class="block rounded-[10px] px-2.5 py-2 ' +
      (item.level === 3 ? 'pl-5 text-[11px] text-[#737C89]' : 'text-[11px] font-medium text-[#C1C6CF]') +
      '">' + escapeHtml(item.text) + '</a></li>').join('') +
    (faq.length ? '<li><a href="#faq-title" class="block rounded-[10px] px-2.5 py-2 text-[11px] font-medium text-[#C1C6CF]">' +
      escapeHtml(label('Pertanyaan yang sering diajukan', 'Frequently asked questions')) + '</a></li>' : '') +
    '</ol></nav></div>';

  html += '<div class="grid items-start gap-7 xl:grid-cols-[56px_minmax(0,820px)_304px] xl:justify-center">';
  html += '<aside class="hidden xl:flex xl:flex-col xl:items-center" aria-hidden="true"><span class="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] text-[#707885]">↗</span><span class="mt-8 font-mono text-[9px] tabular-nums text-[#707885]">0%</span></aside>';
  html += '<article class="min-w-0 w-full justify-self-center text-[#C3C7D0]">';

  if (introductionBlocks.length) {
    html += '<section class="mb-12 sm:mb-14" aria-label="' + escapeHtml(label('Pendahuluan', 'Introduction')) + '">' +
      introductionBlocks.map((block) => renderCanonicalInsightBlock(block, '', insight, 0)).join('') + '</section>';
  }

  if (Array.isArray(insight.keyTakeaways) && insight.keyTakeaways.length) {
    html += '<section class="mb-12 border-y border-white/[0.08] py-7 sm:mb-14 sm:py-8" aria-labelledby="key-takeaways-title"><div class="grid gap-5 sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-9"><div><p id="key-takeaways-title" class="text-[9px] font-mono uppercase tracking-[0.18em] text-[#E50914]">' +
      escapeHtml(label('Poin utama', 'Article key takeaways')) + '</p><p class="mt-2 max-w-[155px] text-xs leading-5 text-[#7D8592]">' +
      escapeHtml(label('Gagasan yang paling penting untuk dibawa setelah membaca.', 'The ideas worth carrying forward.')) + '</p></div><ul class="space-y-2.5">' +
      insight.keyTakeaways.map((item) => '<li class="flex gap-3 text-sm leading-7 text-[#CBD0D8] sm:text-[15px]"><span class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E50914]/75" aria-hidden="true"></span><span>' + inlineMarkdownToHtml(item) + '</span></li>').join('') +
      '</ul></div></section>';
  }

  html += renderBody(bodyBlocks);

  if (faq.length) {
    html += '<section class="mt-14 border-t border-white/[0.08] pt-10 sm:mt-16 sm:pt-12" aria-labelledby="faq-title"><div class="max-w-2xl"><span class="inline-flex items-center rounded-full border border-white/[0.1] bg-[#0B0C0E] px-3.5 py-1.5 text-[9px] font-mono font-semibold uppercase tracking-[0.16em] text-[#E50914]">FAQ</span><h2 id="faq-title" class="mt-3 font-display text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">' +
      escapeHtml(label('Pertanyaan yang sering diajukan', 'Frequently asked questions')) + '</h2><p class="mt-3 text-sm leading-7 text-[#8A909D]">' +
      escapeHtml(label('Jawaban singkat untuk pertanyaan yang paling sering muncul setelah membaca artikel ini.', 'Short answers to the questions readers are most likely to have after this article.')) +
      '</p></div><div class="mt-7 border-y border-white/[0.08]">';
    faq.forEach((item, index) => {
      html += '<details class="group border-b border-white/[0.07] last:border-b-0"><summary class="cursor-pointer list-none py-5 transition-colors duration-200"><span class="grid grid-cols-[28px_minmax(0,1fr)_20px] items-start gap-3"><span class="pt-0.5 font-mono text-[9px] font-semibold tabular-nums text-[#5E6672]">' +
        String(index + 1).padStart(2, '0') + '</span><span class="text-sm font-semibold leading-6 text-white">' + escapeHtml(item.question) +
        '</span><span class="pt-1 text-[#666E7B]" aria-hidden="true">›</span></span></summary><div class="grid grid-cols-[28px_minmax(0,1fr)_20px] gap-3 pb-5"><span></span><p class="text-sm leading-7 text-[#9BA2AF]">' +
        inlineMarkdownToHtml(item.answer) + '</p><span></span></div></details>';
    });
    html += '</div></section>';
  }

  html += '<div class="mt-12 h-px w-full bg-white/[0.07]" aria-hidden="true"></div><div class="pt-7"><a href="/insights" class="inline-flex items-center gap-2 text-xs font-semibold text-[#8C94A1] underline decoration-white/15 underline-offset-4">' +
    escapeHtml(label('Kembali ke Insight', 'Back to Insights')) + '</a></div></article>';

  html += '<aside class="hidden py-12 xl:block" aria-label="' + escapeHtml(label('Navigasi artikel', 'Article navigation')) + '"><div class="sticky top-24 h-[calc(100dvh-7rem)] min-h-0 rounded-2xl border border-white/[0.07] bg-white/[0.014] p-4"><div><span class="inline-flex items-center rounded-full border border-white/[0.1] bg-[#0B0C0E] px-3 py-1.5 text-[8px] font-mono uppercase tracking-[0.17em] text-[#E50914]">' +
    escapeHtml(label('Di artikel ini', 'In this article')) + '</span><p class="mt-1 text-[10px] text-[#5E6672]">' +
    String(toc.filter((item) => item.level === 2).length) + ' ' + escapeHtml(label('bagian', 'sections')) + '</p></div><nav class="mt-4 min-h-0 overflow-y-auto pr-1" aria-label="' +
    escapeHtml(label('Navigasi artikel', 'Article navigation')) + '"><ol class="space-y-1">';
  for (const item of toc) {
    html += '<li><a href="#' + escapeHtml(item.id) + '" class="block rounded-[10px] px-2.5 py-2 ' +
      (item.level === 3 ? 'pl-7 text-[11px] text-[#737C89]' : 'text-[12.5px] font-medium text-[#C1C6CF]') +
      '">' + escapeHtml(item.text) + '</a></li>';
  }
  if (faq.length) {
    html += '<li><a href="#faq-title" class="block rounded-[10px] px-2.5 py-2 text-[12.5px] font-medium text-[#C1C6CF]">' +
      escapeHtml(label('Pertanyaan yang sering diajukan', 'Frequently asked questions')) + '</a></li>';
  }
  html += '</ol></nav></div></aside>';

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
