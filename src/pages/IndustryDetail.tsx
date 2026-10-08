import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { allProjects, type ProjectItem } from '../data/projectsData';
import { allSolutionsAndServices } from '../data/servicesData';
import { fetchServerCmsProjects, getCmsProjects } from '../lib/cmsStore';
import { industryBySlug, projectSlug } from '../lib/publicContent';
import { useLanguage } from '../lib/LanguageContext';

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
    <main className="kapi-utility-page min-h-screen bg-[#0B0C0E] pb-24 pt-28 text-white sm:pt-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <Link to="/industries" className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.14em] text-[#77808C] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E] rounded-md"><ArrowLeft size={13}/> All industries</Link>
        <p className="mt-9 text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">Industry / {industry}</p>
        <h1 className="mt-4 max-w-5xl text-4xl font-display font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[5rem]">{industry}</h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-[#9097A4] sm:text-lg">{language === 'id' ? 'Halaman ini mengelompokkan pekerjaan publik Kapitech yang tercatat dalam konteks ' + industry + '.' : 'This page groups public Kapitech work currently represented under ' + industry + '.'}</p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[['Projects', String(projects.length)], ['Services', String(services.length)], ['Published work', String(projects.filter((p) => p.isPublished !== false).length)], ['Latest year', projects.map((p) => p.year).sort().at(-1) || '—']].map(([label,value]) => <div key={label} className="rounded-2xl border border-white/[0.08] bg-white/[0.018] p-5"><span className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#68717D]">{label}</span><span className="mt-2 block text-3xl font-display font-semibold">{value}</span></div>)}</div>
        <section className="mt-14 border-t border-white/[0.08] pt-12"><div className="flex flex-wrap gap-2">{services.map((service) => {
          const matchedService = allSolutionsAndServices.find((item) => item.title.toLowerCase() === service.toLowerCase() || item.slug.toLowerCase() === service.toLowerCase());
          return <Link key={service} to={matchedService ? '/services/' + matchedService.slug : '/work'} className="rounded-full border border-white/[0.08] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.1em] text-[#7B838F] hover:border-brand-red/30 hover:text-brand-red transition-colors">{service}</Link>;
        })}</div><div className="mt-7 grid gap-5 lg:grid-cols-2">{projects.map((project) => <Link key={project.id} to={'/work/' + projectSlug(project)} className="group overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.018] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E]"><img src={project.image} alt={project.title} className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy"/><div className="p-6"><div className="flex items-center justify-between"><span className="text-[9px] font-mono uppercase tracking-[0.12em] text-brand-red">{project.service}</span><ArrowUpRight size={14} className="text-[#626A75]"/></div><h2 className="mt-3 text-2xl font-display font-semibold tracking-[-0.03em]">{project.title}</h2><p className="mt-3 text-sm leading-6 text-[#818995]">{language === 'id' ? project.descId : project.desc}</p></div></Link>)}</div></section>
        <div className="mt-14 rounded-3xl border border-white/[0.08] bg-brand-red p-7 sm:p-9"><p className="text-[10px] font-mono uppercase tracking-[0.14em] text-white/65">Need an industry-relevant engagement?</p><h2 className="mt-2 max-w-3xl text-3xl font-display font-semibold tracking-[-0.04em] sm:text-4xl">Share the business context and we can help shape the right engagement.</h2><Link to={'/book-a-call?industry=' + encodeURIComponent(industry)} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-xs font-semibold text-[#0B0C0E]">Book a call <ArrowUpRight size={14}/></Link></div>
      </div>
    </main>
  );
};
