import type { InsightBlock, InsightLanguage, InsightPromoBlock } from '../data/insightTypes';

type PromotionAnchor = {
  beforeHeading: {
    id: string;
    en: string;
  };
  promo: {
    id: string;
    idContent: InsightPromoBlock;
    enContent: InsightPromoBlock;
  };
};

const TARGET_SLUG = 'mvp-vs-prototype-vs-proof-of-concept-guide';

const promotions: PromotionAnchor[] = [
  {
    beforeHeading: {
      id: 'Perbedaan Sebenarnya antara Prototype, MVP, dan PoC',
      en: 'The Real Difference Between Prototype, MVP and PoC'
    },
    promo: {
      id: 'mvp-validation-start',
      idContent: {
        type: 'promo',
        eyebrow: 'Langkah validasi',
        title: 'Mulai dari hal yang benar-benar perlu dibuktikan',
        description: 'Sudah tahu risikonya, tetapi belum yakin bentuk eksperimennya? Kapitech membantu memetakan alur, prototype, dan prioritas validasi sebelum development dimulai.',
        ctaLabel: 'Eksplor UI/UX Design',
        ctaUrl: '/services/ui-ux-design',
        serviceReference: 'UI/UX Design'
      },
      enContent: {
        type: 'promo',
        eyebrow: 'Validation next step',
        title: 'Start with what actually needs to be proven',
        description: 'Know the risk, but not the right experiment yet? Kapitech helps map the experience, prototype, and validation priorities before development starts.',
        ctaLabel: 'Explore UI/UX Design',
        ctaUrl: '/services/ui-ux-design',
        serviceReference: 'UI/UX Design'
      }
    }
  },
  {
    beforeHeading: {
      id: 'Contoh Nyata: Platform Operasional B2B',
      en: 'A Real Business Scenario: B2B Operations Platform'
    },
    promo: {
      id: 'mvp-validation-decision',
      idContent: {
        type: 'promo',
        eyebrow: 'Product validation',
        title: 'Pilih pendekatan berdasarkan risiko, bukan ukuran deliverable',
        description: 'Kami membantu menerjemahkan uncertainty menjadi validation plan, product design, dan scope MVP yang realistis untuk keputusan berikutnya.',
        ctaLabel: 'Lihat MVP Design',
        ctaUrl: '/solutions/mvp-design',
        serviceReference: 'MVP Design'
      },
      enContent: {
        type: 'promo',
        eyebrow: 'Product validation',
        title: 'Choose the approach by risk, not deliverable size',
        description: 'We help turn uncertainty into a validation plan, product design, and realistic MVP scope for the next decision.',
        ctaLabel: 'Explore MVP Design',
        ctaUrl: '/solutions/mvp-design',
        serviceReference: 'MVP Design'
      }
    }
  },
  {
    beforeHeading: {
      id: 'Cara Kapitech Memahami Validasi Produk',
      en: 'How Kapitech Thinks About Validation'
    },
    promo: {
      id: 'validation-to-delivery',
      idContent: {
        type: 'promo',
        eyebrow: 'From validation to delivery',
        title: 'Pastikan hasil eksperimen mengarah ke produk yang tepat',
        description: 'Setelah pertanyaan utama terjawab, Kapitech dapat membantu membawa hasil validasi ke product design dan engineering yang siap dibangun.',
        ctaLabel: 'Eksplor Web Development',
        ctaUrl: '/services/web-development',
        serviceReference: 'Web Development'
      },
      enContent: {
        type: 'promo',
        eyebrow: 'From validation to delivery',
        title: 'Turn validation evidence into the right product',
        description: 'Once the key question is answered, Kapitech can help carry the learning into product design and production-ready engineering.',
        ctaLabel: 'Explore Web Development',
        ctaUrl: '/services/web-development',
        serviceReference: 'Web Development'
      }
    }
  }
];

export function injectInsightPromotions(
  blocks: InsightBlock[],
  slug: string,
  language: InsightLanguage
): InsightBlock[] {
  if (slug !== TARGET_SLUG) return blocks;

  const output: InsightBlock[] = [];
  const inserted = new Set<string>();

  for (const block of blocks) {
    if (block.type === 'heading') {
      const anchor = promotions.find(item =>
        !inserted.has(item.promo.id)
        && (language === 'id' ? item.beforeHeading.id : item.beforeHeading.en) === block.text
      );

      if (anchor) {
        output.push(language === 'id' ? anchor.promo.idContent : anchor.promo.enContent);
        inserted.add(anchor.promo.id);
      }
    }

    output.push(block);
  }

  return output;
}
