import React from 'react';
import { motion } from 'motion/react';
import { AtmosphericBackground } from './AtmosphericBackground';

export type PolicySection = {
  title: string;
  body?: string;
  bullets?: string[];
};

type PolicyPageShellProps = {
  eyebrow: string;
  title: string;
  updated: string;
  summary: string;
  sections: PolicySection[];
  manageAction?: { label: string; onClick: () => void };
};

export const PolicyPageShell = ({
  eyebrow,
  title,
  updated,
  summary,
  sections,
  manageAction
}: PolicyPageShellProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="kapi-policy-page min-h-screen pt-28 sm:pt-36 md:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 md:px-12 bg-[#0B0C0E] text-[#8A909D] font-light relative selection:bg-brand-red selection:text-white"
    >
      <AtmosphericBackground imageUrl="/hero_background_3d.png" opacity={0.05} disableGrayscale={true} />
      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-12">
          <span className="kapi-section-label mb-5">{eyebrow}</span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white mb-4 tracking-tighter">{title}</h1>
          <p className="text-xs sm:text-sm uppercase tracking-widest text-brand-red font-mono font-semibold mb-6">{updated}</p>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6 text-sm md:text-[15px] leading-7 text-[#9AA1AD]">
            {summary}
          </div>
          {manageAction && (
            <button
              type="button"
              onClick={manageAction.onClick}
              className="mt-6 inline-flex min-h-[42px] items-center justify-center rounded-full bg-brand-red px-5 text-[10px] font-semibold uppercase tracking-[0.09em] text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#FF1E27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
            >
              {manageAction.label}
            </button>
          )}
        </header>

        <nav aria-label="Contents" className="mb-14 rounded-2xl border border-white/[0.08] bg-white/[0.018] p-5 sm:p-6">
          <p className="mb-4 text-[10px] font-mono font-semibold uppercase tracking-[0.14em] text-[#707680]">Contents</p>
          <ol className="grid gap-x-8 gap-y-2 sm:grid-cols-2 list-decimal list-inside text-sm leading-6 text-[#9AA1AD]">
            {sections.map((section, index) => (
              <li key={section.title}>
                <a
                  href={`#policy-section-${index + 1}`}
                  className="transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
                >
                  {section.title.replace(/^\d+\.\s*/, '')}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <main className="space-y-12 text-[15px] md:text-base leading-[1.82] text-[#8A909D]">
          {sections.map((section, index) => (
            <section key={section.title} id={`policy-section-${index + 1}`} className="scroll-mt-32">
              <h2 className="text-[clamp(21px,2.2vw,27px)] leading-[1.18] font-sans font-bold text-white mb-4 tracking-[-0.025em]">
                {section.title}
              </h2>
              {section.body && section.body.split('\n\n').map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex} className={paragraphIndex > 0 ? 'mt-4' : ''}>
                  {paragraph}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-4 list-disc pl-6 space-y-2">
                  {section.bullets.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
            </section>
          ))}
        </main>
      </div>
    </motion.div>
  );
};