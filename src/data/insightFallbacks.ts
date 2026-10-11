import mvpEnPack from './insight-editorial-packs/mvp-vs-prototype-vs-proof-of-concept.en.json';
import mvpIdPack from './insight-editorial-packs/mvp-vs-prototype-vs-proof-of-concept.id.json';
import websiteCostEnPack from './insight-editorial-packs/website-cost-indonesia-guide.en.json';
import websiteCostIdPack from './insight-editorial-packs/website-cost-indonesia-guide.id.json';
import wordpressVsCustomEnPack from './insight-editorial-packs/wordpress-vs-custom-website.en.json';
import wordpressVsCustomIdPack from './insight-editorial-packs/wordpress-vs-custom-website.id.json';
import corporateWebsiteEnPack from './insight-editorial-packs/corporate-website-vs-landing-page.en.json';
import corporateWebsiteIdPack from './insight-editorial-packs/corporate-website-vs-landing-page.id.json';
import chooseAgencyEnPack from './insight-editorial-packs/choose-web-development-agency-indonesia.en.json';
import chooseAgencyIdPack from './insight-editorial-packs/choose-web-development-agency-indonesia.id.json';
import technicalSeoEnPack from './insight-editorial-packs/technical-seo-audit-guide.en.json';
import technicalSeoIdPack from './insight-editorial-packs/technical-seo-audit-guide.id.json';
import coreWebVitalsEnPack from './insight-editorial-packs/core-web-vitals-explained.en.json';
import coreWebVitalsIdPack from './insight-editorial-packs/core-web-vitals-explained.id.json';
import structuredDataEnPack from './insight-editorial-packs/structured-data-for-seo-guide.en.json';
import structuredDataIdPack from './insight-editorial-packs/structured-data-for-seo-guide.id.json';
import helpfulSeoEnPack from './insight-editorial-packs/helpful-seo-content-framework.en.json';
import helpfulSeoIdPack from './insight-editorial-packs/helpful-seo-content-framework.id.json';
import type { InsightItem } from './insightTypes';

type EditorialPack = {
  seo?: {
    title?: string;
    description?: string;
    slug?: string;
    canonicalUrl?: string;
    ogImage?: string;
  };
  editorial?: {
    language?: 'id' | 'en';
    categorySlug?: string;
    authorSlug?: string;
    status?: 'draft' | 'published' | 'archived';
    isFeatured?: boolean;
    readingTime?: number;
    editorialMeta?: { editorialType?: string };
    tags?: Array<{ slug: string; name: string }>;
    coverImage?: string;
    title?: string;
    excerpt?: string;
    keyTakeaways?: string[];
    content?: InsightItem['content'];
    faq?: Array<[string, string]>;
    seoTitle?: string;
    seoDescription?: string;
  };
};

const INSIGHT_LANGUAGE_PAIRS = [
  { group: 'mvp-vs-prototype-vs-proof-of-concept', en: 'mvp-vs-prototype-vs-proof-of-concept-guide', id: 'mvp-vs-prototype-vs-proof-of-concept' },
  { group: 'website-cost-indonesia-guide', en: 'website-cost-indonesia-guide', id: 'biaya-pembuatan-website-indonesia' },
  { group: 'wordpress-vs-custom-website', en: 'wordpress-vs-custom-website', id: 'wordpress-vs-website-custom' },
  { group: 'corporate-website-vs-landing-page', en: 'corporate-website-vs-landing-page', id: 'website-korporat-vs-landing-page' },
  { group: 'choose-web-development-agency-indonesia', en: 'choose-web-development-agency-indonesia', id: 'memilih-agency-web-development-indonesia' },
  { group: 'technical-seo-audit-guide', en: 'technical-seo-audit-guide', id: 'audit-seo-teknis' },
  { group: 'core-web-vitals-explained', en: 'core-web-vitals-explained', id: 'core-web-vitals' },
  { group: 'structured-data-for-seo-guide', en: 'structured-data-for-seo-guide', id: 'structured-data-untuk-seo' },
  { group: 'helpful-seo-content-framework', en: 'helpful-seo-content-framework', id: 'konten-seo-bermanfaat' }
] as const;

function toInsightItem(pack: EditorialPack, language: 'id' | 'en'): InsightItem | null {
  const seo = pack.seo || {};
  const editorial = pack.editorial || {};
  const slug = String(seo.slug || '').trim();
  const content = Array.isArray(editorial.content) ? editorial.content : [];
  const translationPair = INSIGHT_LANGUAGE_PAIRS.find((pair) => pair.en === slug || pair.id === slug);
  const alternateLanguages: NonNullable<InsightItem['alternateLanguages']> = translationPair
    ? [{ language: 'en', slug: translationPair.en }, { language: 'id', slug: translationPair.id }]
    : [{ language, slug }];

  if (!slug || content.length === 0) return null;

  const faq = Array.isArray(editorial.faq)
    ? editorial.faq
        .filter((item): item is [string, string] => Array.isArray(item) && item.length >= 2)
        .map(([question, answer]) => ({ question: String(question), answer: String(answer) }))
    : [];

  return {
    id: 'local-fallback:' + language + ':' + slug,
    contentGroupId: translationPair?.group || 'local-fallback-group:' + slug,
    language,
    title: String(editorial.title || seo.title || slug),
    slug,
    excerpt: editorial.excerpt,
    content,
    coverImage: editorial.coverImage || seo.ogImage,
    coverImageAlt: String(editorial.title || seo.title || slug),
    categoryId: 'product-technology',
    category: {
      id: 'product-technology',
      slug: String(editorial.categorySlug || 'product-technology'),
      name: { en: 'Product & Technology', id: 'Produk & Teknologi' },
      displayName: language === 'id' ? 'Produk & Teknologi' : 'Product & Technology'
    },
    authorId: 'kapitech-editorial-team',
    author: {
      id: 'kapitech-editorial-team',
      slug: String(editorial.authorSlug || 'kapitech-editorial-team'),
      name: 'Kapitech Editorial Team',
      role: 'Editorial'
    },
    tags: editorial.tags || [],
    status: editorial.status === 'draft' || editorial.status === 'archived' ? editorial.status : 'published',
    isFeatured: Boolean(editorial.isFeatured),
    readingTime: editorial.readingTime,
    keyTakeaways: Array.isArray(editorial.keyTakeaways) ? editorial.keyTakeaways : [],
    faq,
    relatedInsightIds: [],
    relatedInsights: [],
    editorialMeta: { editorialType: editorial.editorialMeta?.editorialType },
    alternateLanguages,
    seoTitle: editorial.seoTitle || seo.title,
    seoDescription: editorial.seoDescription || seo.description,
    ogImage: seo.ogImage,
    canonicalUrl: seo.canonicalUrl
  };
}

const fallbackInsights = [
  toInsightItem(mvpEnPack as unknown as EditorialPack, 'en'),
  toInsightItem(mvpIdPack as unknown as EditorialPack, 'id'),
  toInsightItem(websiteCostEnPack as EditorialPack, 'en'),
  toInsightItem(websiteCostIdPack as EditorialPack, 'id'),
  toInsightItem(wordpressVsCustomEnPack as EditorialPack, 'en'),
  toInsightItem(wordpressVsCustomIdPack as EditorialPack, 'id'),
  toInsightItem(corporateWebsiteEnPack as EditorialPack, 'en'),
  toInsightItem(corporateWebsiteIdPack as EditorialPack, 'id'),
  toInsightItem(chooseAgencyEnPack as EditorialPack, 'en'),
  toInsightItem(chooseAgencyIdPack as EditorialPack, 'id'),
  toInsightItem(technicalSeoEnPack as EditorialPack, 'en'),
  toInsightItem(technicalSeoIdPack as EditorialPack, 'id'),
  toInsightItem(coreWebVitalsEnPack as EditorialPack, 'en'),
  toInsightItem(coreWebVitalsIdPack as EditorialPack, 'id'),
  toInsightItem(structuredDataEnPack as EditorialPack, 'en'),
  toInsightItem(structuredDataIdPack as EditorialPack, 'id'),
  toInsightItem(helpfulSeoEnPack as EditorialPack, 'en'),
  toInsightItem(helpfulSeoIdPack as EditorialPack, 'id')
].filter((item): item is InsightItem => Boolean(item));

export function getInsightFallback(slug: string): InsightItem | null {
  return fallbackInsights.find((item) => item.slug === slug) || null;
}

export function getAllInsightFallbacks(): InsightItem[] {
  return fallbackInsights;
}
