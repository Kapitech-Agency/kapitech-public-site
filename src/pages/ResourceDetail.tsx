import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Download, ArrowUpRight } from 'lucide-react';
import { resources } from '../data/resourcesData';
import { useLanguage } from '../lib/LanguageContext';
import PublicPageHero from '../components/ui/PublicPageHero';

export const ResourceDetail = () => {
  const { slug = '' } = useParams();
  const { language } = useLanguage();
  const resource = resources.find((item) => item.slug === slug);
  if (!resource) return <main className="kapi-utility-page min-h-screen bg-[#0B0C0E] px-5 pt-32 text-white"><div className="mx-auto max-w-4xl"><h1 className="text-4xl font-display font-semibold">Resource not found.</h1><Link to="/resources" className="mt-6 inline-flex items-center gap-2 text-sm text-[#A0A7B3]"><ArrowLeft size={14}/>{language === 'id' ? 'Kembali ke resource' : 'Back to resources'}</Link></div></main>;

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

  return (
    <main className="kapi-page-bg min-h-screen bg-[#0B0C0E] text-white">
      <PublicPageHero
        eyebrow={language === 'id' ? resource.typeId : resource.type}
        title={language === 'id' ? resource.titleId : resource.title}
        description={language === 'id' ? resource.introId : resource.intro}
        backLink={{ href: '/resources', label: language === 'id' ? 'Semua resource' : 'All resources' }}
      >
        <button type="button" onClick={download} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-red px-5 py-3 text-xs font-semibold text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-brand-red-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70">
          <Download size={14}/> Download Markdown <ArrowUpRight size={13}/>
        </button>
      </PublicPageHero>
      <div className="mx-auto max-w-4xl px-4 pb-24 sm:px-6 lg:px-12">
        <div className="space-y-10 border-t border-white/[0.08] pt-12">
          {resource.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-display font-semibold tracking-[-0.035em] sm:text-3xl">{language === 'id' ? section.titleId : section.title}</h2>
              <div className="mt-4 space-y-4 text-sm leading-8 text-[#8F97A4] sm:text-base">
                {(language === 'id' ? section.paragraphsId : section.paragraphs).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
};
