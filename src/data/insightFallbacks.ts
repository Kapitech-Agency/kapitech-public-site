import enPack from './insight-editorial-packs/mvp-vs-prototype-vs-proof-of-concept.en.json';
import idPack from './insight-editorial-packs/mvp-vs-prototype-vs-proof-of-concept.id.json';
import helpful_seo_contentPack from './insight-editorial-packs/helpful-seo-content-framework.en.json';
import structured_data_seoPack from './insight-editorial-packs/structured-data-for-seo-guide.en.json';
import core_web_vitalsPack from './insight-editorial-packs/core-web-vitals-explained.en.json';
import technical_seo_auditPack from './insight-editorial-packs/technical-seo-audit-guide.en.json';
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

const MVP_EN_SLUG = String((enPack as EditorialPack).seo?.slug || '').trim();
const MVP_ID_SLUG = String((idPack as EditorialPack).seo?.slug || '').trim();

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
  toInsightItem(enPack as EditorialPack, 'en'),
  toInsightItem(idPack as EditorialPack, 'id'),
  toInsightItem(technical_seo_auditPack as EditorialPack, 'en'),
  toInsightItem(core_web_vitalsPack as EditorialPack, 'en'),
  toInsightItem(structured_data_seoPack as EditorialPack, 'en'),
  toInsightItem(helpful_seo_contentPack as EditorialPack, 'en')
].filter((item): item is InsightItem => Boolean(item));

export function getInsightFallback(slug: string): InsightItem | null {
  return fallbackInsights.find((item) => item.slug === slug) || null;
}

export function getAllInsightFallbacks(): InsightItem[] {
  return fallbackInsights;
}
