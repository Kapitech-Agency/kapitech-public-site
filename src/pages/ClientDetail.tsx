import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { allProjects, type ProjectItem } from '../data/projectsData';
import { fetchServerCmsProjects, getCmsProjects } from '../lib/cmsStore';
import { clientSlug, projectSlug } from '../lib/publicContent';
import { useLanguage } from '../lib/LanguageContext';

export const ClientDetail = () => {
  const { slug = '' } = useParams();
  const { language } = useLanguage();
  const [cmsProjects, setCmsProjects] = useState<ProjectItem[]>(() => getCmsProjects());
  useEffect(() => { void fetchServerCmsProjects().then(() => setCmsProjects(getCmsProjects())); }, []);
  const source = cmsProjects.length ? cmsProjects : allProjects;
  const client = useMemo(() => Array.from(new Set(source.map((p) => p.client))).find((name) => clientSlug(name) === slug), [source, slug]);
  const projects = useMemo(() => client ? source.filter((p) => p.client === client) : [], [client, source]);
  if (!client) return <main className="kapi-utility-page min-h-screen bg-[#0B0C0E] px-5 pt-32 text-white"><div className="mx-auto max-w-4xl"><h1 className="text-4xl font-display font-semibold">Client not found.</h1><Link to="/clients" className="mt-6 inline-flex items-center gap-2 text-sm text-[#A0A7B3]"><ArrowLeft size={14}/> Back to clients</Link></div></main>;
  const services = Array.from(new Set(projects.map((p) => p.service)));
  const industries = Array.from(new Set(projects.map((p) => p.industry)));
  return <main className="kapi-utility-page min-h-screen bg-[#0B0C0E] pb-24 pt-28 text-white sm:pt-32"><div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12"><Link to="/clients" className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.14em] text-[#77808C] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E] rounded-md"><ArrowLeft size={13}/> All clients</Link><p className="mt-9 text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">Client / {client}</p><h1 className="mt-4 max-w-5xl text-4xl font-display font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[5rem]">{client}</h1><div className="mt-6 flex flex-wrap gap-2">{industries.map((item) => <span key={item} className="rounded-full border border-white/[0.08] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.1em] text-[#737C88]">{item}</span>)}{services.map((item) => <span key={item} className="rounded-full border border-brand-red/15 bg-brand-red/[0.05] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.1em] text-brand-red">{item}</span>)}</div><section className="mt-12 grid gap-5 lg:grid-cols-2">{projects.map((project) => <Link key={project.id} to={'/work/' + projectSlug(project)} className="group overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.018] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E]"><img src={project.image} alt={project.title} className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy"/><div className="p-6"><div className="flex items-center justify-between"><span className="text-[9px] font-mono uppercase tracking-[0.12em] text-brand-red">{project.service}</span><ArrowUpRight size={14}/></div><h2 className="mt-3 text-2xl font-display font-semibold">{project.title}</h2><p className="mt-3 text-sm leading-6 text-[#828B97]">{language === 'id' ? project.descId : project.desc}</p></div></Link>)}</section></div></main>;
};
