import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type PublicPageCtaProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actionEyebrow?: string;
  actionDescription?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export const PublicPageCta = ({
  eyebrow = 'Next step',
  title,
  description,
  actionEyebrow = 'Choose how to start',
  actionDescription = 'Start with a project brief or contact our team directly.',
  primaryHref = '/contact#project-inquiry-form',
  primaryLabel = 'Start a Project',
  secondaryHref = '/contact#contact-details',
  secondaryLabel = 'Contact Kapitech'
}: PublicPageCtaProps) => (
  <section
    aria-labelledby="global-project-cta-title"
    className="kapi-page-cta relative isolate overflow-hidden border-t border-white/[0.07] bg-[#090A0C] px-4 py-14 sm:px-6 sm:py-16 md:px-12 lg:py-20"
  >
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-28 -top-36 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(220, 20, 60,0.10)_0%,rgba(220, 20, 60,0)_72%)]" />
      <div className="absolute -right-28 bottom-[-13rem] h-[32rem] w-[32rem] rounded-full border border-white/[0.035]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
    </div>

    <div className="relative mx-auto max-w-7xl">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-[#101115]/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_90%_10%,rgba(255,255,255,0.035),transparent_40%)]"
          aria-hidden="true"
        />

        <div className="relative grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.43fr)]">
          <div className="min-w-0 p-6 sm:p-8 lg:p-10 xl:p-12">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <span className="kapi-section-label">{eyebrow}</span>
              <span className="inline-flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.13em] text-[#6F7783]">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-red/85" aria-hidden="true" />
                Brand · Product · Engineering
              </span>
            </div>

            <h2
              id="global-project-cta-title"
              className="mt-5 max-w-3xl text-[clamp(2rem,4.1vw,3.75rem)] font-display font-semibold leading-[1.02] tracking-[-0.055em] text-white"
            >
              {title}
            </h2>

            {description ? (
              <p className="mt-4 max-w-2xl text-sm font-light leading-[1.85] text-[#9299A5] sm:mt-5 sm:text-base sm:leading-[1.9]">
                {description}
              </p>
            ) : null}
          </div>

          <div className="relative flex min-w-0 flex-col justify-center border-t border-white/[0.075] p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-9">
            <span className="text-[9px] font-mono font-semibold uppercase tracking-[0.16em] text-brand-red">
              {actionEyebrow}
            </span>
            <p className="mt-3 max-w-sm text-sm font-light leading-[1.8] text-[#858D99]">
              {actionDescription}
            </p>

            <div className="mt-5 grid gap-2.5">
              <Link
                to={primaryHref}
                className="group inline-flex min-h-12 w-full items-center justify-between gap-3 rounded-full bg-brand-red px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.07em] text-white shadow-[0_12px_28px_-18px_rgba(220, 20, 60,0.8)] transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-brand-red-bright hover:shadow-[0_16px_32px_-18px_rgba(220, 20, 60,0.75)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101115]"
              >
                <span className="min-w-0">{primaryLabel}</span>
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.14] transition-transform duration-200 group-hover:translate-x-0.5">
                  <ArrowUpRight size={15} aria-hidden="true" />
                </span>
              </Link>

              <Link
                to={secondaryHref}
                className="group inline-flex min-h-12 w-full items-center justify-between gap-3 rounded-full border border-white/[0.09] bg-white/[0.02] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.07em] text-[#C5CAD2] transition-[background-color,border-color,color] duration-200 hover:border-white/[0.16] hover:bg-white/[0.055] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101115]"
              >
                <span className="min-w-0">{secondaryLabel}</span>
                <ArrowUpRight
                  size={14}
                  className="shrink-0 text-[#858D99] transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default PublicPageCta;
