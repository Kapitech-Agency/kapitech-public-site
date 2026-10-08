import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Users } from 'lucide-react';
import { allProjects, type ProjectItem } from '../data/projectsData';
import { fetchServerCmsProjects, getCmsProjects } from '../lib/cmsStore';
import { clientSlug } from '../lib/publicContent';
import { useLanguage } from '../lib/LanguageContext';
import PublicPageHero from '../components/ui/PublicPageHero';

export const Clients = () => {
  const { language } = useLanguage();
  const [projects, setProjects] = useState<ProjectItem[]>(() => getCmsProjects());
  useEffect(() => { void fetchServerCmsProjects().then(() => setProjects(getCmsProjects())); }, []);
  const source = projects.length ? projects : allProjects;
  const clients = useMemo(() => Array.from(new Set(source.map((project) => project.client).filter(Boolean))).sort((a, b) => a.localeCompare(b)), [source]);
  return (
    <main className="kapi-page-bg min-h-screen bg-[#0B0C0E] text-white">
      <PublicPageHero
        eyebrow="Clients & Proof"
        title={language === 'id' ? 'Siapa yang pernah bekerja bersama Kapitech.' : 'Explore the clients represented across our public work.'}
        description={language === 'id' ? 'Daftar ini hanya mengambil nama yang tercatat dalam dataset portfolio publik saat ini.' : 'This directory is built from client names currently represented in the public portfolio dataset.'}
      />
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 md:px-12">
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{clients.map((client) => { const clientProjects = source.filter((project) => project.client === client); return <Link key={client} to={'/clients/' + clientSlug(client)} className="group rounded-3xl border border-white/[0.08] bg-white/[0.018] p-6 transition-[transform,border-color,background-color] duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.028] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E]"><div className="flex items-center justify-between gap-4"><div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.025]"><Users size={18}/></div><ArrowUpRight size={16} className="text-[#59616D] group-hover:text-white" /></div><h2 className="mt-7 text-xl font-display font-semibold tracking-[-0.03em]">{client}</h2><p className="mt-2 text-sm text-[#77808C]">{clientProjects.length} {language === 'id' ? 'project publik' : 'public project(s)'}</p></Link>; })}</div>
      </div>
    </main>
  );
};
