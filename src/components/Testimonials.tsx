import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { fetchServerCmsTestimonials, getCmsTestimonials, TestimonialItem } from '../lib/cmsStore';
import { EASE, GlassPanel, SectionHeader } from './ui/PublicUI';

export const Testimonials = () => {
  const { language } = useLanguage();
  const [items, setItems] = useState<TestimonialItem[]>(() => getCmsTestimonials());
  const [index, setIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const update = () => setItems(getCmsTestimonials());
    window.addEventListener('kapitech_cms_updated', update);
    void fetchServerCmsTestimonials().then(() => setItems(getCmsTestimonials()));
    return () => window.removeEventListener('kapitech_cms_updated', update);
  }, []);

  const visible = useMemo(() => items.slice(index, index + 1), [items, index]);

  useEffect(() => {
    if (isInteracting || items.length <= 1) return;
    const timer = window.setInterval(() => setIndex(prev => (prev + 1) % items.length), 8200);
    return () => window.clearInterval(timer);
  }, [items.length, isInteracting]);

  const current = visible[0] || items[0];
  if (!current) return null;

  return (
    <section className="kapi-section" onPointerEnter={() => setIsInteracting(true)} onPointerLeave={() => setIsInteracting(false)}>
      <div className="kapi-container">
        <SectionHeader
          eyebrow={language === 'id' ? 'Client testimonials' : 'Client testimonials'}
          title={language === 'id' ? 'Dipercaya oleh founder dan product leaders.' : 'Trusted by founders and product leaders.'}
        />

        <div className="grid lg:grid-cols-[1.3fr_.7fr] gap-4">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.42, ease: EASE }}
            >
              <GlassPanel className="p-7 sm:p-10 min-h-[320px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="w-11 h-11 rounded-[14px] border border-brand-red/20 bg-brand-red/10 text-brand-red grid place-items-center">
                      <Quote size={18} />
                    </div>
                    <span className="kapi-surface-number">Kapitech / {String(index + 1).padStart(2,'0')}</span>
                  </div>
                  <blockquote className="mt-8 font-display text-2xl sm:text-4xl leading-[1.08] tracking-[-.045em] max-w-4xl">
                    “{language === 'id' ? current.quoteId : current.quote}”
                  </blockquote>
                </div>

                <div className="mt-10 pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                  <div>
                    <div className="font-semibold">{current.author}</div>
                    <div className="mt-1 text-xs text-brand-red">{current.role}, {current.company}</div>
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-[.14em] text-white/32">{current.location}</div>
                </div>
              </GlassPanel>
            </motion.div>
          </AnimatePresence>

          <GlassPanel className="p-5 flex flex-col justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[.16em] font-mono text-white/34">Navigate</div>
              <p className="mt-3 text-sm leading-7 text-white/45">
                {language === 'id' ? 'Geser antar testimoni tanpa mengganggu pembacaan kutipan.' : 'Move between testimonials without interrupting the reading flow.'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="kapi-close" type="button" onClick={() => setIndex(prev => (prev - 1 + items.length) % items.length)} aria-label="Previous testimonial">
                <ChevronLeft size={18} />
              </button>
              <button className="kapi-close" type="button" onClick={() => setIndex(prev => (prev + 1) % items.length)} aria-label="Next testimonial">
                <ChevronRight size={18} />
              </button>
              <div className="ml-auto font-mono text-[10px] text-white/30">{index + 1} / {items.length}</div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </section>
  );
};
