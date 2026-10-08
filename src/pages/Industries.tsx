import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Layers3,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { allProjects, type ProjectItem } from '../data/projectsData';
import { fetchServerCmsProjects, getCmsProjects } from '../lib/cmsStore';
import { industrySlug, uniqueIndustries } from '../lib/publicContent';
import { useLanguage } from '../lib/LanguageContext';
import PublicPageHero from '../components/ui/PublicPageHero';

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
        const services = Array.from(
          new Set(industryProjects.map((item) => item.service).filter(Boolean)),
        );
        const pillars = Array.from(
          new Set(industryProjects.map((item) => item.pillar).filter(Boolean)),
        );

        return {
          industry,
          projects: industryProjects,
          services,
          pillars,
        };
      })
      .sort((a, b) => {
        if (b.projects.length !== a.projects.length) return b.projects.length - a.projects.length;
        return a.industry.localeCompare(b.industry);
      });
  }, [publicSource]);

  const totalProjects = publicSource.length;
  const totalCapabilities = useMemo(
    () => new Set(publicSource.map((project) => project.service).filter(Boolean)).size,
    [publicSource],
  );

  const featuredIndustry = industryEntries[0];
  const featuredProject = featuredIndustry?.projects[0];

  const secondaryIndustries = industryEntries.slice(1);

  return (
    <main className="kapi-page-bg min-h-screen bg-[#0B0C0E] text-white">
      <PublicPageHero
        eyebrow={language === 'id' ? 'Konteks Industri' : 'Industry context'}
        title={
          language === 'id'
            ? 'Pengalaman digital yang dibentuk oleh konteks bisnis.'
            : 'Digital experiences shaped by business context.'
        }
        description={
          language === 'id'
            ? 'Jelajahi pekerjaan Kapitech berdasarkan industri, kebutuhan yang kami bantu selesaikan, dan kapabilitas yang digunakan di setiap engagement.'
            : 'Explore Kapitech work by industry, the business needs we help address, and the capabilities applied across each engagement.'
        }
        aside={
          <div className="rounded-3xl border border-white/[0.09] bg-black/25 p-5 backdrop-blur-md sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <span className="kapi-section-label">
                {language === 'id' ? 'Industry lens' : 'Industry lens'}
              </span>
              <Layers3 size={17} className="text-[#68717D]" aria-hidden="true" />
            </div>
            <p className="mt-5 text-sm leading-7 text-[#8F97A3]">
              {language === 'id'
                ? 'Kami tidak memulai dari template industri. Kami memulai dari masalah, pengguna, dan konteks operasional.'
                : 'We do not start from an industry template. We start from the problem, the users, and the operating context.'}
            </p>
            <div className="mt-6 grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3">
                <span className="block text-xl font-display font-semibold">{industryEntries.length}</span>
                <span className="mt-1 block text-[8px] font-mono uppercase tracking-[0.12em] text-[#69717D]">
                  {language === 'id' ? 'Industri' : 'Industries'}
                </span>
              </div>
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3">
                <span className="block text-xl font-display font-semibold">{totalProjects}</span>
                <span className="mt-1 block text-[8px] font-mono uppercase tracking-[0.12em] text-[#69717D]">
                  {language === 'id' ? 'Kasus' : 'Cases'}
                </span>
              </div>
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3">
                <span className="block text-xl font-display font-semibold">{totalCapabilities}</span>
                <span className="mt-1 block text-[8px] font-mono uppercase tracking-[0.12em] text-[#69717D]">
                  {language === 'id' ? 'Layanan' : 'Services'}
                </span>
              </div>
            </div>
          </div>
        }
      />

      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 md:px-12">
        {featuredIndustry && featuredProject ? (
          <section className="py-12 sm:py-16 lg:py-20" aria-labelledby="featured-industry-title">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="kapi-section-label">
                  {language === 'id' ? 'Sorotan industri' : 'Industry spotlight'}
                </span>
                <h2
                  id="featured-industry-title"
                  className="mt-3 max-w-3xl text-3xl font-display font-semibold leading-[1.02] tracking-[-0.05em] sm:text-4xl lg:text-[3.25rem]"
                >
                  {featuredIndustry.industry}
                </h2>
              </div>
              <Link
                to={'/industries/' + industrySlug(featuredIndustry.industry)}
                className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-[#A3AAB5] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
              >
                {language === 'id' ? 'Lihat industri' : 'View industry'}
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-7 grid overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.018] lg:grid-cols-[1.15fr_0.85fr]">
              <div className="relative min-h-[300px] overflow-hidden bg-[#111317] sm:min-h-[390px]">
                <img
                  src={featuredProject.image}
                  alt={featuredProject.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-700 hover:scale-[1.025]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <span className="inline-flex rounded-full border border-white/[0.12] bg-black/30 px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.12em] text-white/70 backdrop-blur-md">
                    {featuredProject.service}
                  </span>
                  <p className="mt-3 max-w-2xl text-xl font-display font-semibold tracking-[-0.035em] sm:text-2xl">
                    {featuredProject.title}
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between p-6 sm:p-8">
                <div>
                  <div className="flex flex-wrap gap-2">
                    {featuredIndustry.pillars.map((pillar) => (
                      <span
                        key={pillar}
                        className="rounded-full border border-white/[0.07] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.1em] text-[#737C88]"
                      >
                        {pillar}
                      </span>
                    ))}
                  </div>
                  <p className="mt-7 text-sm leading-7 text-[#8E96A2]">
                    {language === 'id' ? featuredProject.descId : featuredProject.desc}
                  </p>
                </div>

                <div className="mt-8 border-t border-white/[0.07] pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[9px] font-mono uppercase tracking-[0.12em] text-[#626B77]">
                        {language === 'id' ? 'Studi kasus' : 'Case studies'}
                      </span>
                      <span className="mt-1 block text-xl font-display font-semibold">{featuredIndustry.projects.length}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-mono uppercase tracking-[0.12em] text-[#626B77]">
                        {language === 'id' ? 'Kapabilitas' : 'Capabilities'}
                      </span>
                      <span className="mt-1 block text-xl font-display font-semibold">{featuredIndustry.services.length}</span>
                    </div>
                  </div>
                  <Link
                    to={'/industries/' + industrySlug(featuredIndustry.industry)}
                    className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-red px-5 py-3 text-xs font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E]"
                  >
                    {language === 'id' ? 'Jelajahi industri' : 'Explore industry'}
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="border-t border-white/[0.07] py-12 sm:py-16" aria-labelledby="industry-directory-title">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <span className="kapi-section-label">
                {language === 'id' ? 'Peta industri' : 'Industry map'}
              </span>
              <h2
                id="industry-directory-title"
                className="mt-3 text-3xl font-display font-semibold leading-[1.04] tracking-[-0.05em] sm:text-4xl"
              >
                {language === 'id'
                  ? 'Temukan pola yang paling dekat dengan bisnis Anda.'
                  : 'Find the context closest to your business.'}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-[#7E8793]">
                {language === 'id'
                  ? 'Setiap konteks mengarah ke kumpulan pekerjaan, layanan, dan pola delivery yang berbeda.'
                  : 'Each context leads to a different mix of work, services, and delivery patterns.'}
              </p>
            </div>

            <div className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {secondaryIndustries.map(({ industry, projects: industryProjects, services, pillars }, index) => (
                <Link
                  key={industry}
                  to={'/industries/' + industrySlug(industry)}
                  className="group grid gap-5 py-7 sm:grid-cols-[56px_minmax(0,1fr)_auto] sm:items-start sm:gap-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-inset"
                >
                  <span className="text-[10px] font-mono tracking-[0.16em] text-[#59616D]">
                    {String(index + 2).padStart(2, '0')}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02] text-[#A5ACB6] transition-colors group-hover:border-brand-red/25 group-hover:text-brand-red">
                        <Building2 size={17} aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl font-display font-semibold tracking-[-0.03em] transition-colors group-hover:text-white sm:text-2xl">
                          {industry}
                        </h3>
                        <p className="mt-2 max-w-2xl text-xs leading-6 text-[#747D89]">
                          {industryProjects.length}{' '}
                          {language === 'id'
                            ? industryProjects.length === 1 ? 'studi kasus publik' : 'studi kasus publik'
                            : industryProjects.length === 1 ? 'public case study' : 'public case studies'}
                          {' · '}
                          {services.length} {language === 'id' ? 'kapabilitas' : 'capabilities'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 pl-14">
                      {services.slice(0, 4).map((service) => (
                        <span
                          key={service}
                          className="rounded-full border border-white/[0.07] px-2.5 py-1 text-[9px] font-mono uppercase tracking-[0.09em] text-[#6F7884]"
                        >
                          {service}
                        </span>
                      ))}
                      {services.length > 4 ? (
                        <span className="rounded-full border border-white/[0.07] px-2.5 py-1 text-[9px] font-mono tracking-[0.09em] text-[#59616D]">
                          +{services.length - 4}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 pl-14">
                      {pillars.map((pillar) => (
                        <span key={pillar} className="text-[9px] font-mono uppercase tracking-[0.1em] text-[#505965]">
                          {pillar}
                        </span>
                      ))}
                    </div>
                  </div>

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.018] text-[#68717D] transition-[transform,border-color,background-color,color] duration-300 group-hover:-translate-y-0.5 group-hover:border-brand-red/30 group-hover:bg-brand-red/[0.08] group-hover:text-brand-red sm:mt-0">
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 border-t border-white/[0.07] pt-12 sm:grid-cols-2 sm:pt-16">
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.018] p-6 sm:p-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.025] text-[#A5ACB6]">
              <Workflow size={17} aria-hidden="true" />
            </div>
            <h2 className="mt-6 text-2xl font-display font-semibold tracking-[-0.035em]">
              {language === 'id' ? 'Bukan sekadar kategori.' : 'More than a category.'}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#7E8793]">
              {language === 'id'
                ? 'Industry membantu memberi konteks. Tantangan bisnis, pengguna, dan target delivery tetap menjadi dasar cara kami bekerja.'
                : 'Industry provides context. Business challenges, users, and delivery goals still shape how we work.'}
            </p>
          </div>
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.018] p-6 sm:p-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.025] text-[#A5ACB6]">
              <Sparkles size={17} aria-hidden="true" />
            </div>
            <h2 className="mt-6 text-2xl font-display font-semibold tracking-[-0.035em]">
              {language === 'id' ? 'Punya konteks yang berbeda?' : 'Working in a different context?'}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#7E8793]">
              {language === 'id'
                ? 'Ceritakan kebutuhan Anda. Kami bisa mulai dari problem dan tujuan, bukan dari label industrinya.'
                : 'Tell us what you need. We can start from the problem and outcome, not from the industry label.'}
            </p>
            <Link
              to="/book-a-call"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-red px-5 py-3 text-xs font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E]"
            >
              {language === 'id' ? 'Ajukan konsultasi' : 'Request consultation'}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};
