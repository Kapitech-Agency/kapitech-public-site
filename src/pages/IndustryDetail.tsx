import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { allProjects, type ProjectItem } from '../data/projectsData';
import { allSolutionsAndServices } from '../data/servicesData';
import { fetchServerCmsProjects, getCmsProjects } from '../lib/cmsStore';
import { industryBySlug, projectSlug } from '../lib/publicContent';
import { useLanguage } from '../lib/LanguageContext';
import PublicPageHero from '../components/ui/PublicPageHero';

export const IndustryDetail = () => {
  const { slug = '' } = useParams();
  const { language } = useLanguage();
  const [cmsProjects, setCmsProjects] = useState<ProjectItem[]>(() => getCmsProjects());
  useEffect(() => { void fetchServerCmsProjects().then(() => setCmsProjects(getCmsProjects())); }, []);
  const source = cmsProjects.length ? cmsProjects : allProjects;
  const industry = industryBySlug(source, slug);
  const projects = useMemo(() => industry ? source.filter((item) => item.industry === industry) : [], [industry, source]);
  const services = useMemo(() => Array.from(new Set(projects.map((item) => item.service))), [projects]);

  if (!industry) return <main className="kapi-utility-page min-h-screen bg-[#0B0C0E] px-5 pt-32 text-white"><div className="mx-auto max-w-4xl"><h1 className="text-4xl font-display font-semibold">Industry not found.</h1><Link to="/industries" className="mt-6 inline-flex items-center gap-2 text-sm text-[#A0A7B3]"><ArrowLeft size={14}/> Back to industries</Link></div></main>;

  return (
    <main className="kapi-page-bg min-h-screen bg-[#0B0C0E] text-white">
      <PublicPageHero
        eyebrow={`Industry / ${industry}`}
        title={industry}
        description={language === 'id' ? 'Halaman ini mengelompokkan pekerjaan publik Kapitech yang tercatat dalam konteks ' + industry + '.' : 'This page groups public Kapitech work currently represented under ' + industry + '.'}
        backLink={{ href: '/industries', label: language === 'id' ? 'Semua industri' : 'All industries' }}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Projects', String(projects.length)],
            ['Services', String(services.length)],
            ['Published work', String(projects.filter((p) => p.isPublished !== false).length)],
            ['Latest year', projects.map((p) => p.year).sort().at(-1) || '—']
          ].map(([label, value]) => (
            <div key={label} className="kapi-surface p-5">
              <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#68717D]">{label}</span>
              <span className="mt-2 block text-3xl font-display font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </PublicPageHero>
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 md:px-12">
        <section className="mt-14 border-t border-white/[0.08] pt-12"><div className="flex flex-wrap gap-2">{services.map((service) => {
          const matchedService = allSolutionsAndServices.find((item) => item.title.toLowerCase() === service.toLowerCase() || item.slug.toLowerCase() === service.toLowerCase());
          return <Link key={service} to={matchedService ? '/services/' + matchedService.slug : '/work'} className="rounded-full border border-white/[0.08] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.1em] text-[#7B838F] hover:border-brand-red/30 hover:text-brand-red transition-colors">{service}</Link>;
        })}</div><div className="mt-7 grid gap-5 lg:grid-cols-2">{projects.map((project) => <Link key={project.id} to={'/work/' + projectSlug(project)} className="group overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.018] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E]"><img src={project.image} alt={project.title} className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy"/><div className="p-6"><div className="flex items-center justify-between"><span className="text-[9px] font-mono uppercase tracking-[0.12em] text-brand-red">{project.service}</span><ArrowUpRight size={14} className="text-[#626A75]"/></div><h2 className="mt-3 text-2xl font-display font-semibold tracking-[-0.03em]">{project.title}</h2><p className="mt-3 text-sm leading-6 text-[#818995]">{language === 'id' ? project.descId : project.desc}</p></div></Link>)}</div></section>
      </div>
    </main>
  );
};
