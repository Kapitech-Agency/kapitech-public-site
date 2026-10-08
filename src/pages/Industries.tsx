import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Building2, Layers3 } from 'lucide-react';
import { allProjects, type ProjectItem } from '../data/projectsData';
import { fetchServerCmsProjects, getCmsProjects } from '../lib/cmsStore';
import { industrySlug, uniqueIndustries } from '../lib/publicContent';
import { useLanguage } from '../lib/LanguageContext';

export const Industries = () => {
  const { language } = useLanguage();
  const [projects, setProjects] = useState<ProjectItem[]>(() => getCmsProjects());

  useEffect(() => {
    const handleUpdate = () => setProjects(getCmsProjects());
    window.addEventListener('kapitech_cms_updated', handleUpdate);

    void fetchServerCmsProjects().then(() => setProjects(getCmsProjects()));

    return () => window.removeEventListener('kapitech_cms_updated', handleUpdate);
  }, []);

  const source = projects.length ? projects : allProjects;
  const publicSource = useMemo(
    () => source.filter((project) => project.isPublished !== false),
    [source],
  );

  const industryEntries = useMemo(() => {
    return uniqueIndustries(publicSource)
      .map((industry) => {
        const industryProjects = publicSource.filter((item) => item.industry === industry);
        const services = Array.from(new Set(industryProjects.map((item) => item.service).filter(Boolean)));

        return {
          industry,
          projects: industryProjects,
          services,
        };
      })
      .sort((a, b) => {
        if (b.projects.length !== a.projects.length) return b.projects.length - a.projects.length;
        return a.industry.localeCompare(b.industry);
      });
  }, [publicSource]);

  const totalProjects = useMemo(
    () => source.filter((project) => project.isPublished !== false).length,
    [source],
  );

  const totalCapabilities = useMemo(
    () => new Set(publicSource.map((project) => project.service).filter(Boolean)).size,
    [publicSource],
  );

  return (
    <main className="kapi-utility-page min-h-screen bg-[#0B0C0E] px-5 pb-24 pt-32 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="max-w-6xl">
          <p className="kapi-section-label">{language === 'id' ? 'Konteks Industri' : 'Industry context'}</p>
          <h1 className="mt-5 max-w-5xl text-4xl font-display font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[5.5rem]">
            {language === 'id'
              ? 'Temukan pekerjaan Kapitech berdasarkan konteks industri.'
              : 'Explore Kapitech work through industry context.'}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-[#8E96A2] sm:text-lg">
            {language === 'id'
              ? 'Lihat portfolio berdasarkan konteks bisnis, layanan yang digunakan, dan pola kebutuhan yang relevan dengan industri Anda.'
              : 'Browse the public portfolio through business context, relevant services, and delivery patterns across industries.'}
          </p>

          <div className="mt-10 grid gap-2 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.018] px-4 py-4">
              <span className="block text-[9px] font-mono uppercase tracking-[0.14em] text-[#69717D]">
                {language === 'id' ? 'Industri' : 'Industries'}
              </span>
              <span className="mt-1.5 block text-2xl font-display font-semibold tracking-[-0.035em]">{industryEntries.length}</span>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.018] px-4 py-4">
              <span className="block text-[9px] font-mono uppercase tracking-[0.14em] text-[#69717D]">
                {language === 'id' ? 'Studi kasus publik' : 'Public case studies'}
              </span>
              <span className="mt-1.5 block text-2xl font-display font-semibold tracking-[-0.035em]">{totalProjects}</span>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.018] px-4 py-4">
              <span className="block text-[9px] font-mono uppercase tracking-[0.14em] text-[#69717D]">
                {language === 'id' ? 'Kapabilitas' : 'Capabilities'}
              </span>
              <span className="mt-1.5 block text-2xl font-display font-semibold tracking-[-0.035em]">{totalCapabilities}</span>
            </div>
          </div>
        </header>

        <section className="mt-14" aria-labelledby="industry-directory-title">
          <div className="flex items-end justify-between gap-5 border-b border-white/[0.08] pb-5">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">
                {language === 'id' ? 'Direktori' : 'Directory'}
              </p>
              <h2 id="industry-directory-title" className="mt-2 text-2xl font-display font-semibold tracking-[-0.035em] sm:text-3xl">
                {language === 'id' ? 'Pilih konteks yang paling dekat dengan bisnis Anda.' : 'Choose the context closest to your business.'}
              </h2>
            </div>
            <Layers3 size={18} className="hidden text-[#59616D] sm:block" aria-hidden="true" />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {industryEntries.map(({ industry, projects: industryProjects, services }, index) => (
              <Link
                key={industry}
                to={'/industries/' + industrySlug(industry)}
                className="group relative flex min-h-[270px] flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.018] p-6 transition-[transform,border-color,background-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.03] hover:shadow-[0_22px_48px_-36px_rgba(0,0,0,0.95)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.025] text-[#D7DAE0] transition-colors duration-300 group-hover:border-brand-red/25 group-hover:bg-brand-red/[0.06] group-hover:text-brand-red">
                    <Building2 size={18} aria-hidden="true" />
                  </div>
                  <span className="text-[9px] font-mono tracking-[0.16em] text-[#626A75]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="mt-7">
                  <h3 className="text-2xl font-display font-semibold leading-tight tracking-[-0.035em] group-hover:text-white">
                    {industry}
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-[#747C88]">
                    {industryProjects.length}{' '}
                    {language === 'id'
                      ? industryProjects.length === 1 ? 'studi kasus publik' : 'studi kasus publik'}
                      : industryProjects.length === 1 ? 'public case study' : 'public case studies'}
                    {' · '}
                    {services.length} {language === 'id' ? 'kapabilitas' : 'capabilities'}
                  </p>
                </div>

                <div className="mt-auto flex items-end justify-between gap-4 pt-6">
                  <div className="flex min-w-0 flex-wrap gap-2">
                    {services.slice(0, 3).map((service) => (
                      <span
                        key={service}
                        className="rounded-full border border-white/[0.07] px-2.5 py-1 text-[9px] font-mono uppercase tracking-[0.1em] text-[#717986]"
                      >
                        {service}
                      </span>
                    ))}
                    {services.length > 3 ? (
                      <span className="rounded-full border border-white/[0.07] px-2.5 py-1 text-[9px] font-mono tracking-[0.1em] text-[#5F6773]">
                        +{services.length - 3}
                      </span>
                    ) : null}
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02] text-[#66707B] transition-[border-color,background-color,color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:border-brand-red/30 group-hover:bg-brand-red/[0.08] group-hover:text-brand-red">
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-white/[0.08] bg-white/[0.018] p-6 sm:p-8" aria-labelledby="industry-cta-title">
          <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-red">
            {language === 'id' ? 'Tidak melihat konteks Anda?' : 'Do not see your context?'}
          </p>
          <h2 id="industry-cta-title" className="mt-2 max-w-3xl text-2xl font-display font-semibold tracking-[-0.035em] sm:text-3xl">
            {language === 'id'
              ? 'Bagikan kebutuhan bisnis Anda dan kita bisa membahas engagement yang paling relevan.'
              : 'Share your business context and we can discuss the most relevant engagement.'}
          </h2>
          <Link
            to="/book-a-call"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-brand-red px-5 py-3 text-xs font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E]"
          >
            {language === 'id' ? 'Ajukan konsultasi' : 'Request consultation'}
          </Link>
        </section>
      </div>
    </main>
  );
};
