import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { fetchServerCmsTestimonials, getCmsTestimonials, TestimonialItem } from '../lib/cmsStore';
import { GlassPanel, SectionHeader } from './ui/PublicUI';
import { useMotion } from './motion/MotionSystem';

export const Testimonials = () => {
  const { language } = useLanguage();
  const { reducedMotion } = useMotion();
  const [items, setItems] = useState<TestimonialItem[]>(() => getCmsTestimonials());
  const [index, setIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1100);

  useEffect(() => {
    const update = () => setItems(getCmsTestimonials());
    window.addEventListener('kapitech_cms_updated', update);
    void fetchServerCmsTestimonials().then(() => setItems(getCmsTestimonials()));
    return () => window.removeEventListener('kapitech_cms_updated', update);
  }, []);

  useEffect(() => {
    const update = () => setViewportWidth(window.innerWidth);
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    setIndex((current) => Math.min(current, Math.max(items.length - 1, 0)));
  }, [items.length]);

  const active = items[index];
  const cardWidth = Math.min(viewportWidth * 0.78, 760);
  const gap = 16;
  const trackX = -(index * (cardWidth + gap));

  const controls = useMemo(() => ({
    previous: () => setIndex((current) => Math.max(current - 1, 0)),
    next: () => setIndex((current) => Math.min(current + 1, Math.max(items.length - 1, 0))),
  }), [items.length]);

  if (!active) return null;

  return (
    <section className="kapi-section kapi-testimonials" data-motion-section>
      <div className="kapi-container">
        <SectionHeader
          eyebrow={language === 'id' ? 'Client testimonials' : 'Client testimonials'}
          title={language === 'id' ? 'Dipercaya oleh founder dan product leaders.' : 'Trusted by founders and product leaders.'}
          description={language === 'id'
            ? 'Tarik, geser, atau gunakan keyboard controls untuk berpindah antar pengalaman klien.'
            : 'Drag, swipe, or use the keyboard controls to move through client experiences.'}
        />

        <div className="kapi-testimonials-shell">
          <div className="kapi-testimonials-viewport" data-cursor="drag" data-cursor-text="Drag">
            <motion.div
              className="kapi-testimonials-track"
              drag={reducedMotion ? false : 'x'}
              dragConstraints={{ left: -Math.max((items.length - 1) * (cardWidth + gap), 0), right: 0 }}
              dragElastic={0.08}
              dragMomentum={!reducedMotion}
              animate={{ x: trackX }}
              transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 210, damping: 27, mass: 0.72 }}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) < 40 && Math.abs(info.velocity.x) < 180) return;
                if (info.offset.x < -72 || info.velocity.x < -450) controls.next();
                else if (info.offset.x > 72 || info.velocity.x > 450) controls.previous();
              }}
              style={{ gap }}
            >
              {items.map((item, itemIndex) => (
                <motion.article
                  key={item.id}
                  className={`kapi-testimonial-card ${itemIndex === index ? 'is-active' : ''}`}
                  animate={{
                    scale: itemIndex === index ? 1 : 0.965,
                    opacity: itemIndex === index ? 1 : 0.55,
                  }}
                  transition={{ duration: 0.45, ease: [0.22,1,0.36,1] }}
                  style={{ width: cardWidth, minWidth: cardWidth }}
                  tabIndex={itemIndex === index ? 0 : -1}
                >
                  <GlassPanel className="kapi-testimonial-card__surface">
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-11 h-11 rounded-[14px] border border-brand-red/20 bg-brand-red/10 text-brand-red grid place-items-center">
                        <Quote size={18} />
                      </div>
                      <span className="kapi-surface-number">Kapitech / {String(itemIndex + 1).padStart(2, '0')}</span>
                    </div>

                    <blockquote className="mt-8 font-display text-2xl sm:text-4xl leading-[1.08] tracking-[-.045em] max-w-4xl">
                      “{language === 'id' ? item.quoteId : item.quote}”
                    </blockquote>

                    <div className="mt-10 pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                      <div>
                        <div className="font-semibold">{item.author}</div>
                        <div className="mt-1 text-xs text-brand-red">{item.role}, {item.company}</div>
                      </div>
                      <div className="text-[10px] font-mono uppercase tracking-[.14em] text-white/32">{item.location}</div>
                    </div>
                  </GlassPanel>
                </motion.article>
              ))}
            </motion.div>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2" role="group" aria-label="Testimonial navigation">
              <button
                className="kapi-close"
                type="button"
                onClick={controls.previous}
                disabled={index === 0}
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                className="kapi-close"
                type="button"
                onClick={controls.next}
                disabled={index === items.length - 1}
                aria-label="Next testimonial"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2" aria-live="polite">
              {items.map((item, itemIndex) => (
                <button
                  key={item.id}
                  type="button"
                  className={`kapi-testimonial-dot ${itemIndex === index ? 'is-active' : ''}`}
                  onClick={() => setIndex(itemIndex)}
                  aria-label={`Go to testimonial ${itemIndex + 1}`}
                  aria-current={itemIndex === index}
                />
              ))}
              <span className="ml-2 font-mono text-[10px] text-white/30">{index + 1} / {items.length}</span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            className="sr-only"
            aria-live="polite"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {language === 'id' ? active.quoteId : active.quote}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
