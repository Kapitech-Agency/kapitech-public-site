import React from 'react';
import { Link } from 'react-router-dom';
import PublicPageHero from './PublicPageHero';

export type PolicyTable = { caption?: string; headers: string[]; rows: string[][]; };
export type PolicySection = { title: string; body?: string; paragraphs?: string[]; table?: PolicyTable; };
export type PolicyRelatedLink = { label: string; href: string; description: string; };

type PolicyPageShellProps = {
  eyebrow: string;
  title: string;
  updated: string;
  summary: string;
  sections: PolicySection[];
  manageAction?: { label: string; onClick: () => void };
  relatedLinks?: PolicyRelatedLink[];
  showContact?: boolean;
};

const DEFAULT_RELATED_LINKS: PolicyRelatedLink[] = [
  { label: 'Privacy Policy', href: '/privacy', description: 'How Kapitech handles Personal Data across the public website and its interactions.' },
  { label: 'Terms of Service', href: '/terms', description: 'Rules for using kapitech.id and the relationship between website information and project agreements.' },
  { label: 'Cookie Policy', href: '/cookie-policy', description: 'Cookies, browser storage, consent, attribution, and optional analytics behaviour.' },
  { label: 'AI Instructions', href: '/ai-instructions', description: 'Official guidance for accurate machine-readable representation of Kapitech.' },
  { label: 'Editorial Policy', href: '/editorial-policy', description: 'How Kapitech researches, reviews, publishes, updates, and corrects editorial content.' }
];

const DEFAULT_CONTACT = {
  email: 'hello@kapitech.id',
  phone: '+62 877-6995-7062',
  address: 'Linea Residence, Block G No. 5, Jl. Melati Loka, Paku Jaya, Serpong Utara, Kota Tangerang Selatan, Banten 15220, Indonesia'
};

const getSectionId = (index: number) => 'policy-section-' + String(index + 1);

export const PolicyPageShell = ({
  eyebrow,
  title,
  updated,
  summary,
  sections,
  manageAction,
  relatedLinks = DEFAULT_RELATED_LINKS,
  showContact = false
}: PolicyPageShellProps) => {
  return (
    <div className="kapi-policy-page min-h-screen overflow-x-clip bg-[#0B0C0E] text-[#8A909D]">
      <PublicPageHero
        eyebrow={eyebrow}
        title={title}
        description={summary}
      >
        <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.14em] text-brand-red">{updated}</p>
        {manageAction ? (
          <button type="button" onClick={manageAction.onClick} className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-brand-red px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.09em] text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-brand-red-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60">
            {manageAction.label}
          </button>
        ) : null}
      </PublicPageHero>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:px-12">
        <main className="mt-14 min-w-0 max-w-4xl space-y-12 sm:space-y-14">
          {sections.map((section, index) => {
            const id = getSectionId(index);
            return (
              <section key={id} id={id} className="scroll-mt-28">
                <h2 className="max-w-4xl text-[clamp(1.35rem,2.2vw,1.8rem)] font-semibold leading-[1.2] tracking-[-0.03em] text-white">{section.title.replace(/^\d+[.)]\s*/, '').trim()}</h2>
                {section.body && (
                  <div className="mt-4 space-y-4 text-sm leading-[1.95] text-[#9097A4] sm:text-[15px]">
                    {section.body.split('\n\n').map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
                  </div>
                )}
                {section.paragraphs?.length ? (
                  <div className="mt-5 space-y-4 text-sm leading-[1.95] text-[#9097A4] sm:text-[15px]">
                    {section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
                  </div>
                ) : null}
                {section.table && (
                  <div className="mt-6 max-w-full overflow-x-auto rounded-2xl border border-white/[0.08] bg-white/[0.018]">
                    <table className="w-full min-w-[760px] border-collapse text-left text-xs sm:text-sm">
                      {section.table.caption && <caption className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-[0.12em] text-[#6F757F]">{section.table.caption}</caption>}
                      <thead><tr className="border-b border-white/[0.08]">{section.table.headers.map((header) => <th key={header} scope="col" className="px-4 py-3 font-semibold text-white">{header}</th>)}</tr></thead>
                      <tbody>{section.table.rows.map((row, rowIndex) => <tr key={rowIndex} className="border-b border-white/[0.06] last:border-b-0">{row.map((cell, cellIndex) => <td key={cellIndex} className="align-top px-4 py-3.5 leading-[1.7] text-[#8F96A2]">{cell}</td>)}</tr>)}</tbody>
                    </table>
                  </div>
                )}
              </section>
            );
          })}
        </main>

        {showContact && (
          <section className="mt-16 border-t border-white/[0.08] pt-10 sm:mt-20 sm:pt-12" aria-labelledby="policy-contact-title">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:items-start">
              <div>
                <span className="kapi-section-label mb-4">Questions</span>
                <h2 id="policy-contact-title" className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">Contact Kapitech</h2>
                <p className="mt-3 max-w-2xl text-sm leading-[1.85] text-[#9097A4] sm:text-[15px]">For questions about this document or the website practices it describes, contact Kapitech directly. For a request involving a specific project, contract, or confidential matter, include enough context for the team to identify the relevant record.</p>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.018] p-5 sm:p-6">
                <a href={'mailto:' + DEFAULT_CONTACT.email} className="block text-sm font-medium text-white transition-colors hover:text-brand-red">{DEFAULT_CONTACT.email}</a>
                <a href={'tel:' + DEFAULT_CONTACT.phone.replace(/[^0-9+]/g, '')} className="mt-2 block text-sm text-[#9AA1AD] transition-colors hover:text-brand-red">{DEFAULT_CONTACT.phone}</a>
                <p className="mt-4 text-xs leading-[1.75] text-[#747B87]">{DEFAULT_CONTACT.address}</p>
              </div>
            </div>
          </section>
        )}

        <section className="mt-12 border-t border-white/[0.08] pt-10" aria-labelledby="policy-related-title">
          <h2 id="policy-related-title" className="text-xl font-semibold tracking-[-0.025em] text-white sm:text-2xl">Related policy documents</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {relatedLinks.map((item) => (
              <Link key={item.href} to={item.href} className="group rounded-2xl border border-white/[0.08] bg-white/[0.018] p-4 transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/50">
                <span className="block text-sm font-semibold text-white transition-colors group-hover:text-brand-red">{item.label}</span>
                <span className="mt-2 block text-xs leading-[1.7] text-[#747B87]">{item.description}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
