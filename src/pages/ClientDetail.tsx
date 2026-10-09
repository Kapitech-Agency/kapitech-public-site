import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { allProjects, type ProjectItem } from '../data/projectsData';
import { fetchServerCmsProjects, getCmsProjects } from '../lib/cmsStore';
import { clientSlug, projectSlug } from '../lib/publicContent';
import { useLanguage } from '../lib/LanguageContext';
import PublicPageHero from '../components/ui/PublicPageHero';

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
  return (
    <main className="kapi-page-bg min-h-screen bg-[#0B0C0E] text-white">
      <PublicPageHero
        eyebrow={`Client / ${client}`}
        title={client}
        description={language === 'id' ? 'Ringkasan pekerjaan publik Kapitech untuk client ini, termasuk layanan dan konteks industri terkait.' : 'A public-work view of Kapitech projects represented for this client, including relevant services and industries.'}
        backLink={{ href: '/clients', label: language === 'id' ? 'Semua client' : 'All clients' }}
      >
        <div className="flex flex-wrap gap-2">
          {industries.map((item) => <span key={item} className="rounded-full border border-white/[0.08] bg-white/[0.018] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.1em] text-[#737C88]">{item}</span>)}
          {services.map((item) => <span key={item} className="rounded-full border border-brand-red/20 bg-brand-red/[0.05] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.1em] text-brand-red">{item}</span>)}
        </div>
      </PublicPageHero>
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 md:px-12">
        <section className="grid gap-5 lg:grid-cols-2" aria-labelledby="client-projects-title">
          <h2 id="client-projects-title" className="sr-only">{language === 'id' ? 'Project client' : 'Client projects'}</h2>
          {projects.map((project) => (
            <Link key={project.id} to={'/work/' + projectSlug(project)} className="group kapi-surface overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70">
              <img src={project.image} alt={project.title} className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" decoding="async"/>
              <div className="p-6">
                <div className="flex items-center justify-between gap-4"><span className="text-[9px] font-mono uppercase tracking-[0.12em] text-brand-red">{project.service}</span><ArrowUpRight size={14}/></div>
                <h2 className="mt-3 text-2xl font-display font-semibold">{project.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#828B97]">{language === 'id' ? project.descId : project.desc}</p>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
};
