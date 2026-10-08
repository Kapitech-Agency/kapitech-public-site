import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqItems } from '../data/faqData';
import { useLanguage } from '../lib/LanguageContext';
import PublicPageHero from '../components/ui/PublicPageHero';

export const Faq = () => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(0);
  const categories = Array.from(new Set(faqItems.map((item) => item.category)));

  return (
    <main className="kapi-page-bg min-h-screen bg-[#0B0C0E] text-white">
      <PublicPageHero
        eyebrow="FAQ"
        title={language === 'id' ? 'Jawaban sebelum Anda memulai proyek.' : 'Answers before you start a project.'}
        description={
          language === 'id'
            ? 'Pahami cara kerja, proses, ekspektasi komersial, keamanan, careers, dan jalur untuk memulai percakapan dengan Kapitech.'
            : 'Understand working models, process, commercial expectations, security, careers, and the path to start a conversation with Kapitech.'
        }
      />

      <div className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-12">
        <div className="mt-12 space-y-10">
          {categories.map((category) => {
            const categoryItems = faqItems.filter((item) => item.category === category);

            return (
              <section key={category}>
                <h2 className="text-2xl font-display font-semibold tracking-[-0.035em] sm:text-3xl">
                  {language === 'id'
                    ? faqItems.find((item) => item.category === category)?.categoryId || category
                    : category}
                </h2>

                <div className="mt-4 overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.018]">
                  {categoryItems.map((item) => {
                    const index = faqItems.indexOf(item);
                    const isOpen = open === index;

                    return (
                      <div key={item.question} className="border-b border-white/[0.07] last:border-b-0">
                        <button
                          id={`faq-question-${index}`}
                          type="button"
                          onClick={() => setOpen(isOpen ? -1 : index)}
                          aria-expanded={isOpen}
                          aria-controls={`faq-answer-${index}`}
                          className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60 focus-visible:ring-inset"
                        >
                          <span className="text-sm font-semibold leading-6 text-white sm:text-base">
                            {language === 'id' ? item.questionId : item.question}
                          </span>
                          <ChevronDown
                            aria-hidden="true"
                            size={17}
                            className={`shrink-0 text-[#707986] transition-transform ${isOpen ? 'rotate-180 text-brand-red' : ''}`}
                          />
                        </button>

                        {isOpen ? (
                          <div
                            id={`faq-answer-${index}`}
                            role="region"
                            aria-labelledby={`faq-question-${index}`}
                            className="px-5 pb-5 text-sm leading-7 text-[#8E96A2]"
                          >
                            {language === 'id' ? item.answerId : item.answer}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
};
