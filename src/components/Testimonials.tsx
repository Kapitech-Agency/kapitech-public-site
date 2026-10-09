import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { fetchServerCmsTestimonials, getCmsTestimonials } from '../lib/cmsStore';

export const Testimonials = () => {
  const { language } = useLanguage();
  const [cmsTestimonials, setCmsTestimonials] = useState(() => getCmsTestimonials());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInteractionPaused, setIsInteractionPaused] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setCmsTestimonials(getCmsTestimonials());
    };

    window.addEventListener('kapitech_cms_updated', handleUpdate);
    void fetchServerCmsTestimonials().then(() => {
      setCmsTestimonials(getCmsTestimonials());
    });

    return () => window.removeEventListener('kapitech_cms_updated', handleUpdate);
  }, []);

  const testimonials = useMemo(
    () =>
      cmsTestimonials
        .filter((item) => item.isPublished !== false)
        .map((item) => ({
          id: item.id,
          quote: language === 'id' ? (item.quoteId || item.quote) : (item.quote || item.quoteId),
          author: item.author,
          role: item.role,
          company: item.company,
          location: item.location,
          rating: Math.max(0, Math.min(5, item.rating ?? 5))
        })),
    [cmsTestimonials, language]
  );

  useEffect(() => {
    if (currentIndex >= testimonials.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, testimonials.length]);

  useEffect(() => {
    if (testimonials.length < 2 || isInteractionPaused) return;
    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);

    return () => window.clearInterval(timer);
  }, [testimonials.length, isInteractionPaused]);

  const current = testimonials[currentIndex] ?? null;

  const goPrevious = () => {
    if (testimonials.length < 2) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goNext = () => {
    if (testimonials.length < 2) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  if (!current) {
    return (
      <section
        className="border-b border-[#262930] bg-[#0B0C0E] px-4 py-16 sm:px-6 sm:py-20 md:px-12 md:py-28"
        id="testimonials"
        aria-labelledby="testimonials-heading"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-6 sm:mb-12 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="kapi-section-label mb-5">
                {language === 'id' ? 'Testimoni Klien' : 'Client Testimonials'}
              </span>
              <h2
                id="testimonials-heading"
                className="mt-4 text-3xl font-display font-semibold leading-[1.02] tracking-[-0.055em] text-white sm:text-4xl md:text-5xl lg:text-[4rem]"
              >
                {language === 'id'
                  ? 'Pengalaman nyata dari orang yang bekerja bersama kami.'
                  : 'Real experiences from people who work with us.'}
              </h2>
            </div>
          </div>

          <div className="flex flex-col gap-5 rounded-3xl border border-white/[0.075] bg-[#0F1013] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <p className="max-w-2xl text-sm font-light leading-[1.8] text-[#8A909D]">
              {language === 'id'
                ? 'Testimoni yang telah dipublikasikan akan tampil di sini. Untuk mengetahui lebih lanjut tentang cara kami bekerja, mari diskusikan kebutuhan proyek Anda.'
                : 'Published client testimonials will appear here. To learn more about how we work, let us discuss your project needs.'}
            </p>
            <Link
              to="/book-a-call"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.025] px-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand-red/35 hover:bg-brand-red/[0.08]"
            >
              <span>{language === 'id' ? 'Diskusikan Proyek' : 'Discuss Your Project'}</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const visibleStart = Math.min(Math.max(0, currentIndex - 3), Math.max(0, testimonials.length - 4));
  const visibleTestimonials = testimonials.slice(visibleStart, visibleStart + 4);

  return (
    <section
      className="border-b border-[#262930] bg-[#0B0C0E] px-4 py-16 sm:px-6 sm:py-20 md:px-12 md:py-28"
      id="testimonials"
      onMouseEnter={() => setIsInteractionPaused(true)}
      onMouseLeave={() => setIsInteractionPaused(false)}
      onFocusCapture={() => setIsInteractionPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsInteractionPaused(false);
        }
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-6 sm:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="kapi-section-label mb-5">
              {language === 'id' ? 'Testimoni Klien' : 'Client Testimonials'}
            </span>
            <h2 className="mt-4 text-3xl font-display font-semibold leading-[1.02] tracking-[-0.055em] text-white sm:text-4xl md:text-5xl lg:text-[4rem]">
              {language === 'id'
                ? 'Pengalaman nyata dari orang yang bekerja bersama kami.'
                : 'Real experiences from people who work with us.'}
            </h2>
          </div>

          <div className="flex items-center gap-4 lg:pb-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#8A909D]">
              {String(currentIndex + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
            </span>
            <div className="h-px w-8 bg-[#262930]" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrevious}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02] text-[#8A909D] transition-[border-color,background-color,color,transform] duration-300 hover:border-brand-red/35 hover:bg-brand-red/[0.06] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={language === 'id' ? 'Testimoni sebelumnya' : 'Previous testimonial'}
                disabled={testimonials.length < 2}
              >
                <ChevronLeft size={17} />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02] text-[#8A909D] transition-[border-color,background-color,color,transform] duration-300 hover:border-brand-red/35 hover:bg-brand-red/[0.06] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={language === 'id' ? 'Testimoni berikutnya' : 'Next testimonial'}
                disabled={testimonials.length < 2}
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/[0.075] bg-[#0F1013]">
          <div className="grid lg:grid-cols-[1.42fr_0.78fr]">
            <div className="relative flex min-h-[430px] flex-col justify-between overflow-hidden border-b border-white/[0.07] p-6 sm:p-8 lg:min-h-[500px] lg:border-b-0 lg:border-r lg:p-10 xl:p-12">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-brand-red/[0.05]" aria-hidden="true" />
              <div className="pointer-events-none absolute -right-6 top-10 h-40 w-40 rounded-full border border-white/[0.025]" aria-hidden="true" />

              <div className="relative flex items-center justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.16] bg-white/[0.05] text-white">
                  <Quote size={18} />
                </div>
                <div className="flex items-center gap-1" aria-label={`${current.rating} out of 5 stars`}>
                  {[0, 1, 2, 3, 4].map((starIndex) => (
                    <Star
                      key={starIndex}
                      size={13}
                      className={starIndex < current.rating ? 'fill-white text-white' : 'text-white/15'}
                    />
                  ))}
                </div>
              </div>

              <div className="relative mt-12 flex-1">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={current.id + language}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    className="flex h-full flex-col"
                  >
                    <blockquote className="max-w-4xl text-2xl font-display font-medium leading-[1.28] tracking-[-0.04em] text-white sm:text-3xl lg:text-[2.65rem]">
                      “{current.quote}”
                    </blockquote>

                    <div className="mt-auto pt-10">
                      <div className="h-px w-10 bg-white/70" aria-hidden="true" />
                      <div className="mt-5 flex flex-col gap-1">
                        <span className="text-sm font-semibold text-white">{current.author}</span>
                        <span className="text-xs text-brand-red">
                          {current.role} · {current.company}
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#737984]">
                          {current.location}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="relative mt-8 flex items-center gap-2">
                {testimonials.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    data-analytics-event="testimonial_select"
                    data-testimonial-index={index + 1}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentIndex === index ? 'w-10 bg-white' : 'w-3 bg-white/[0.14] hover:bg-white/[0.28]'
                    }`}
                    aria-label={`${language === 'id' ? 'Pilih testimoni' : 'Select testimonial'} ${index + 1}`}
                    aria-pressed={currentIndex === index}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white/[0.012] p-4 sm:p-5 lg:p-6">
              <div className="mb-4 px-2 py-1 text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-[#737984]">
                {language === 'id' ? 'Klien yang berbicara' : 'Clients speaking'}
              </div>

              <div className="space-y-1">
                {visibleTestimonials.map((item, index) => {
                  const testimonialIndex = visibleStart + index;
                  return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCurrentIndex(testimonialIndex)}
                    data-analytics-event="testimonial_select"
                    data-testimonial-index={testimonialIndex + 1}
                    className={`group w-full rounded-2xl p-4 text-left transition-[background-color,border-color] duration-300 ${
                      currentIndex === testimonialIndex
                        ? 'bg-white/[0.05] border border-white/[0.16]'
                        : 'border border-transparent hover:bg-white/[0.025]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <span
                          className={`block text-sm font-semibold transition-colors duration-300 ${
                            currentIndex === testimonialIndex ? 'text-white' : 'text-[#D7DAE0] group-hover:text-white'
                          }`}
                        >
                          {item.author}
                        </span>
                        <span className="mt-1 block truncate text-[10px] font-mono uppercase tracking-[0.1em] text-[#737984]">
                          {item.role} · {item.company}
                        </span>
                      </div>
                      <ArrowUpRight
                        size={15}
                        className={`mt-0.5 shrink-0 transition-all duration-300 ${
                          currentIndex === testimonialIndex
                            ? 'text-white -translate-y-0.5 translate-x-0.5'
                            : 'text-[#555B65] group-hover:text-white'
                        }`}
                      />
                    </div>

                    <span
                      className={`mt-4 block h-px transition-all duration-300 ${
                        currentIndex === testimonialIndex ? 'w-10 bg-white' : 'w-5 bg-white/[0.12] group-hover:w-8'
                      }`}
                    />
                  </button>
                  );
                })}
              </div>

              {testimonials.length > visibleTestimonials.length && (
                <div className="mt-4 border-t border-white/[0.06] pt-5">
                  <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#737984]">
                    {testimonials.length - visibleTestimonials.length} {language === 'id' ? 'testimoni lainnya' : 'more testimonials'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
