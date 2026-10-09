import mvpEnPack from './insight-editorial-packs/mvp-vs-prototype-vs-proof-of-concept.en.json';
import mvpIdPack from './insight-editorial-packs/mvp-vs-prototype-vs-proof-of-concept.id.json';
import websiteCostPack from './insight-editorial-packs/website-cost-indonesia-guide.en.json';
import wordpressVsCustomPack from './insight-editorial-packs/wordpress-vs-custom-website.en.json';
import corporateWebsitePack from './insight-editorial-packs/corporate-website-vs-landing-page.en.json';
import chooseAgencyPack from './insight-editorial-packs/choose-web-development-agency-indonesia.en.json';
import technicalSeoPack from './insight-editorial-packs/technical-seo-audit-guide.en.json';
import coreWebVitalsPack from './insight-editorial-packs/core-web-vitals-explained.en.json';
import structuredDataPack from './insight-editorial-packs/structured-data-for-seo-guide.en.json';
import helpfulSeoPack from './insight-editorial-packs/helpful-seo-content-framework.en.json';
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

const MVP_EN_SLUG = String((mvpEnPack as EditorialPack).seo?.slug || '').trim();
const MVP_ID_SLUG = String((mvpIdPack as EditorialPack).seo?.slug || '').trim();

function toInsightItem(pack: EditorialPack, language: 'id' | 'en'): InsightItem | null {
  const seo = pack.seo || {};
  const editorial = pack.editorial || {};
  const slug = String(seo.slug || '').trim();
  const content = Array.isArray(editorial.content) ? editorial.content : [];
  const hasMvpTranslationPair = slug === MVP_EN_SLUG || slug === MVP_ID_SLUG;
  const alternateLanguages: NonNullable<InsightItem['alternateLanguages']> =
    hasMvpTranslationPair && MVP_EN_SLUG && MVP_ID_SLUG
      ? [{ language: 'en', slug: MVP_EN_SLUG }, { language: 'id', slug: MVP_ID_SLUG }]
      : [{ language, slug }];

  if (!slug || content.length === 0) return null;

  const faq = Array.isArray(editorial.faq)
    ? editorial.faq
        .filter((item): item is [string, string] => Array.isArray(item) && item.length >= 2)
        .map(([question, answer]) => ({ question: String(question), answer: String(answer) }))
    : [];

  return {
    id: 'local-fallback:' + language + ':' + slug,
    contentGroupId: 'local-fallback-group:' + slug,
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
  toInsightItem(mvpEnPack as EditorialPack, 'en'),
  toInsightItem(mvpIdPack as EditorialPack, 'id'),
  toInsightItem(websiteCostPack as EditorialPack, 'en'),
  toInsightItem(wordpressVsCustomPack as EditorialPack, 'en'),
  toInsightItem(corporateWebsitePack as EditorialPack, 'en'),
  toInsightItem(chooseAgencyPack as EditorialPack, 'en'),
  toInsightItem(technicalSeoPack as EditorialPack, 'en'),
  toInsightItem(coreWebVitalsPack as EditorialPack, 'en'),
  toInsightItem(structuredDataPack as EditorialPack, 'en'),
  toInsightItem(helpfulSeoPack as EditorialPack, 'en')
].filter((item): item is InsightItem => Boolean(item));

export function getInsightFallback(slug: string): InsightItem | null {
  return fallbackInsights.find((item) => item.slug === slug) || null;
}

export function getAllInsightFallbacks(): InsightItem[] {
  return fallbackInsights;
}
