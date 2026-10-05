export type InsightLanguage = 'id' | 'en';

export type InsightBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'quote'; text: string; attribution?: string }
  | { type: 'image'; url: string; alt: string; caption?: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'callout'; text: string; tone?: 'info' | 'warning' | 'success' | 'neutral'; title?: string }
  | { type: 'code'; code: string; language?: string }
  | { type: 'link'; url: string; label: string }
  | { type: 'divider' }
  | { type: 'checklist'; title?: string; items: string[] };

export interface InsightCategory {
  id: string;
  slug: string;
  name: Record<string, string>;
  displayName?: string;
  description?: Record<string, string>;
  seoTitle?: Record<string, string>;
  seoDescription?: Record<string, string>;
}

export interface InsightAuthor {
  id: string;
  slug: string;
  name: string;
  role?: string;
  bio?: string;
  avatar?: string;
}

export interface InsightItem {
  id: string;
  contentGroupId: string;
  language: InsightLanguage;
  title: string;
  slug: string;
  excerpt?: string;
  content?: InsightBlock[];
  coverImage?: string;
  categoryId?: string | null;
  category?: InsightCategory | null;
  authorId?: string | null;
  author?: InsightAuthor | null;
  tags?: Array<{ id?: string; slug: string; name: string }>;
  status: 'draft' | 'published' | 'archived';
  isFeatured?: boolean;
  readingTime?: number;
  publishedAt?: string | null;
  updatedAt?: string | null;
  keyTakeaways?: string[];
  faq?: Array<{ question: string; answer: string }>;
  relatedInsightIds?: string[];
  relatedInsights?: InsightItem[];
  editorialMeta?: {
    reviewedBy?: string;
    factCheckedBy?: string;
    editorialType?: string;
  };
  alternateLanguages?: Array<{ language: InsightLanguage; slug: string }>;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
}
