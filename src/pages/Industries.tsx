import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Building2 } from 'lucide-react';
import { allProjects, type ProjectItem } from '../data/projectsData';
import { fetchServerCmsProjects, getCmsProjects } from '../lib/cmsStore';
import { industrySlug, uniqueIndustries } from '../lib/publicContent';
import { useLanguage } from '../lib/LanguageContext';

export const Industries = () => {
  const { language } = useLanguage();
  const [projects, setProjects] = useState<ProjectItem[]>(() => getCmsProjects());
  useEffect(() => { void fetchServerCmsProjects().then(() => setProjects(getCmsProjects())); }, []);
  const source = projects.length ? projects : allProjects;
  const industries = useMemo(() => uniqueIndustries(source), [source]);
  return (
    <main className="min-h-screen bg-[#0B0C0E] px-5 pb-24 pt-32 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">Industries</p>
        <h1 className="mt-4 max-w-5xl text-4xl font-display font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[5.5rem]">{language === 'id' ? 'Pengalaman yang bisa dilihat berdasarkan konteks industri.' : 'Explore Kapitech work by industry context.'}</h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-[#8E96A2] sm:text-lg">{language === 'id' ? 'Gunakan konteks industri untuk menemukan proyek, kapabilitas, dan pola masalah yang lebih dekat dengan bisnis Anda.' : 'Use industry context to find projects, capabilities, and delivery patterns that are closer to your business.'}</p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => {
            const industryProjects = source.filter((item) => item.industry === industry);
            const services = Array.from(new Set(industryProjects.map((item) => item.service)));
            return <Link key={industry} to={'/industries/' + industrySlug(industry)} className="group rounded-3xl border border-white/[0.08] bg-white/[0.018] p-6 transition-[transform,border-color,background-color] duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.028]"><div className="flex items-center justify-between gap-4"><div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.025] text-white"><Building2 size={18} /></div><ArrowUpRight size={16} className="text-[#59616D] group-hover:text-white" /></div><h2 className="mt-7 text-2xl font-display font-semibold leading-tight tracking-[-0.035em]">{industry}</h2><p className="mt-3 text-sm leading-6 text-[#7F8793]">{industryProjects.length} public case studies · {services.length} capabilities</p><div className="mt-5 flex flex-wrap gap-2">{services.slice(0, 3).map((service) => <span key={service} className="rounded-full border border-white/[0.07] px-2.5 py-1 text-[9px] font-mono uppercase tracking-[0.1em] text-[#717986]">{service}</span>)}</div></Link>;
          })}
        </div>
      </div>
    </main>
  );
};
