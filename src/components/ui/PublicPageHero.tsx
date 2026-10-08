import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PatternWaves from './PatternWaves/PatternWavesTyped';

type PublicPageHeroProps = {
  eyebrow: string;
  title: string;
  titleNode?: React.ReactNode;
  description?: string;
  backLink?: { href: string; label: string };
  children?: React.ReactNode;
  aside?: React.ReactNode;
  preset?: string;
};

export const PublicPageHero = ({
  eyebrow,
  title,
  titleNode,
  description,
  backLink,
  children,
  aside,
  preset = 'lines'
}: PublicPageHeroProps) => (
  <section className="kapi-page-hero relative overflow-hidden border-b border-white/[0.07] px-4 pb-16 pt-32 sm:px-6 sm:pb-20 sm:pt-36 md:px-12 md:pb-24 md:pt-40">
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <PatternWaves
        preset={preset}
        color="#E50914"
        backgroundColor="#0B0C0E"
        opacity={0.32}
        fade="edges"
        fadeSize={0.72}
        interactive
        cursorSize={52}
        cursorStrength={0.38}
        speed={0.2}
        scale={1.06}
        depth={0.62}
        shine={0.5}
        contrast={1.04}
        intro
      />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/55 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(229,9,20,0.08),transparent_42%)]" />
    </div>
    <div className="relative z-10 mx-auto max-w-7xl">
      <div className={aside ? 'grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end lg:gap-16' : undefined}>
        <div className="min-w-0">
          {backLink ? (
            <Link
              to={backLink.href}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.018] px-3.5 text-[10px] font-mono uppercase tracking-[0.14em] text-[#77808C] backdrop-blur-md transition-[background-color,border-color,color] duration-200 hover:border-white/[0.14] hover:bg-white/[0.035] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
            >
              <ArrowLeft size={13} aria-hidden="true" />
              {backLink.label}
            </Link>
          ) : null}
          <div className={backLink ? 'mt-8' : ''}>
            <span className="kapi-section-label">{eyebrow}</span>
            <h1 className="mt-5 max-w-5xl text-4xl font-display font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-[5.25rem]">
              {titleNode ?? title}
            </h1>
            {description ? (
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#9097A4] sm:text-lg">
                {description}
              </p>
            ) : null}
            {children ? <div className="mt-8">{children}</div> : null}
          </div>
        </div>
        {aside ? <div className="min-w-0">{aside}</div> : null}
      </div>
    </div>
  </section>
);

export default PublicPageHero;
