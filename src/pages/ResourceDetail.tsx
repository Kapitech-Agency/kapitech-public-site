import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Download, ArrowUpRight } from 'lucide-react';
import { resources } from '../data/resourcesData';
import { useLanguage } from '../lib/LanguageContext';

export const ResourceDetail = () => {
  const { slug = '' } = useParams();
  const { language } = useLanguage();
  const resource = resources.find((item) => item.slug === slug);
  if (!resource) return <main className="min-h-screen bg-[#0B0C0E] px-5 pt-32 text-white"><div className="mx-auto max-w-4xl"><h1 className="text-4xl font-display font-semibold">Resource not found.</h1><Link to="/resources" className="mt-6 inline-flex items-center gap-2 text-sm text-[#A0A7B3]"><ArrowLeft size={14}/>{language === 'id' ? 'Kembali ke resource' : 'Back to resources'}</Link></div></main>;

  const download = () => {
    const title = language === 'id' ? resource.titleId : resource.title;
    const summary = language === 'id' ? resource.summaryId : resource.summary;
    const sections = resource.sections.map((section) => ({
      title: language === 'id' ? section.titleId : section.title,
      paragraphs: language === 'id' ? section.paragraphsId : section.paragraphs
    }));
    const lines = ['# ' + title, '', summary, ''];
    sections.forEach((section) => {
      lines.push('## ' + section.title, '');
      section.paragraphs.forEach((paragraph) => lines.push('- ' + paragraph));
      lines.push('');
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = resource.slug + '.md';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return <main className="min-h-screen bg-[#0B0C0E] pb-24 pt-28 text-white sm:pt-32"><div className="mx-auto max-w-4xl px-5 sm:px-8"><Link to="/resources" className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.14em] text-[#77808C] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E] rounded-md"><ArrowLeft size={13}/>{language === 'id' ? 'Semua resource' : 'All resources'}</Link><span className="mt-9 inline-flex rounded-full border border-white/[0.08] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.12em] text-brand-red">{language === 'id' ? resource.typeId : resource.type}</span><h1 className="mt-5 text-4xl font-display font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl">{language === 'id' ? resource.titleId : resource.title}</h1><p className="mt-6 text-base leading-8 text-[#9AA1AD] sm:text-lg">{language === 'id' ? resource.introId : resource.intro}</p><button type="button" onClick={download} className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-red px-5 text-xs font-semibold text-white"><Download size={14}/> {language === 'id' ? 'Download Markdown' : 'Download Markdown'} <ArrowUpRight size={13}/></button><div className="mt-12 space-y-10 border-t border-white/[0.08] pt-10">{resource.sections.map((section) => <section key={section.title}><h2 className="text-2xl font-display font-semibold tracking-[-0.035em] sm:text-3xl">{language === 'id' ? section.titleId : section.title}</h2><div className="mt-4 space-y-4 text-sm leading-8 text-[#8F97A4] sm:text-base">{(language === 'id' ? section.paragraphsId : section.paragraphs).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>)}</div><div className="mt-14 rounded-3xl border border-white/[0.08] bg-white/[0.018] p-7"><p className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-red">{language === 'id' ? 'Butuh bantuan menerapkannya?' : 'Need help applying it?'}</p><h2 className="mt-2 text-2xl font-display font-semibold tracking-[-0.035em]">{language === 'id' ? 'Bawa konteks Anda ke Kapitech.' : 'Bring your context to Kapitech.'}</h2><Link to="/book-a-call" className="mt-5 inline-flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E] border border-white/[0.1] bg-white/[0.03] px-5 py-3 text-xs font-semibold">{language === 'id' ? 'Ajukan konsultasi' : 'Book a call'} <ArrowUpRight size={14}/></Link></div></div></main>;
};
