import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type PublicPageCtaProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export const PublicPageCta = ({
  eyebrow = 'Next step',
  title,
  description,
  primaryHref = '/book-a-call',
  primaryLabel = 'Schedule a Consultation',
  secondaryHref = '/contact',
  secondaryLabel = 'Contact Kapitech'
}: PublicPageCtaProps) => (
  <section className="kapi-page-cta relative overflow-hidden border-t border-white/[0.08] bg-[#0B0C0E] px-4 py-16 sm:px-6 sm:py-20 md:px-12 md:py-24">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(229,9,20,0.09),transparent_34%),radial-gradient(circle_at_84%_78%,rgba(255,255,255,0.03),transparent_30%)]" aria-hidden="true" />
    <div className="relative mx-auto flex max-w-7xl flex-col gap-7 rounded-3xl border border-white/[0.08] bg-white/[0.018] p-6 backdrop-blur-xl sm:p-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:p-10">
      <div className="max-w-3xl">
        <span className="kapi-section-label">{eyebrow}</span>
        <h2 className="mt-4 text-3xl font-display font-semibold leading-[1.04] tracking-[-0.045em] text-white sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        {description ? <p className="mt-4 max-w-2xl text-sm leading-7 text-[#8F97A4] sm:text-base">{description}</p> : null}
      </div>
      <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
        <Link to={primaryHref} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-red px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white shadow-[0_12px_28px_-18px_rgba(229,9,20,0.8)] transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-brand-red-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70">
          {primaryLabel}
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
        <Link to={secondaryHref} className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/[0.09] bg-white/[0.02] px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#C5CAD2] transition-[background-color,border-color,color] duration-200 hover:border-white/[0.16] hover:bg-white/[0.045] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70">
          {secondaryLabel}
        </Link>
      </div>
    </div>
  </section>
);

export default PublicPageCta;
