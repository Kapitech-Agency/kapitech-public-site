import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Layers3,
  Search,
  Sparkles,
  Workflow,
  X,
} from 'lucide-react';
import { allProjects, type ProjectItem } from '../data/projectsData';
import { fetchServerCmsProjects, getCmsProjects } from '../lib/cmsStore';
import { industrySlug, uniqueIndustries } from '../lib/publicContent';
import { useLanguage } from '../lib/LanguageContext';
import PublicPageHero from '../components/ui/PublicPageHero';

export const Industries = () => {
  const { language } = useLanguage();
  const [projects, setProjects] = useState<ProjectItem[]>(() => getCmsProjects());
  const [query, setQuery] = useState('');
  const [pillarFilter, setPillarFilter] = useState<'all' | ProjectItem['pillar']>('all');

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

  const industryEntries = useMemo(
    () =>
      uniqueIndustries(publicSource)
        .map((industry) => {
          const industryProjects = publicSource.filter((project) => project.industry === industry);
          const services = Array.from(
            new Set(industryProjects.map((project) => project.service).filter(Boolean)),
          );
          const pillars = Array.from(
            new Set(industryProjects.map((project) => project.pillar).filter(Boolean)),
          );

          return {
            industry,
            projects: industryProjects,
            services,
            pillars,
          };
        })
        .sort((a, b) => {
          if (b.projects.length !== a.projects.length) {
            return b.projects.length - a.projects.length;
          }

          return a.industry.localeCompare(b.industry);
        }),
    [publicSource],
  );

  const featuredProject =
    publicSource.find((project) => project.featured) ?? publicSource[0];
  const featuredIndustry = industryEntries.find(
    (entry) => entry.industry === featuredProject?.industry,
  );

  const normalizedQuery = query.trim().toLowerCase();

  const visibleIndustryEntries = useMemo(
    () =>
      industryEntries.filter((entry) => {
        const matchesPillar =
          pillarFilter === 'all' || entry.pillars.includes(pillarFilter);

        const searchable = [
          entry.industry,
          ...entry.services,
          ...entry.pillars,
          ...entry.projects.map((project) => project.title),
          ...entry.projects.map((project) => project.client),
        ]
          .join(' ')
          .toLowerCase();

        return matchesPillar && (!normalizedQuery || searchable.includes(normalizedQuery));
      }),
    [industryEntries, normalizedQuery, pillarFilter],
  );

  const totalProjects = publicSource.length;
  const totalCapabilities = useMemo(
    () => new Set(publicSource.map((project) => project.service).filter(Boolean)).size,
    [publicSource],
  );

  const deliveryPillars = [
    {
      label: language === 'id' ? 'Experience' : 'Experience',
      title: language === 'id' ? 'UX yang jelas, visual yang punya arah.' : 'Clear UX, visual with direction.',
      description:
        language === 'id'
          ? 'Kami menerjemahkan kebutuhan pengguna dan brand menjadi pengalaman yang lebih mudah dipahami, digunakan, dan dikembangkan.'
          : 'We translate user and brand needs into experiences that are easier to understand, use, and extend.',
    },
    {
      label: language === 'id' ? 'Systems' : 'Systems',
      title: language === 'id' ? 'Produk digital yang siap dipakai.' : 'Digital products built to work.',
      description:
        language === 'id'
          ? 'Dari aplikasi internal sampai platform publik, kami merancang struktur produk dengan fokus pada workflow, reliability, dan maintainability.'
          : 'From internal applications to public platforms, we shape product structures around workflow, reliability, and maintainability.',
    },
    {
      label: language === 'id' ? 'Infrastructure' : 'Infrastructure',
      title: language === 'id' ? 'Operasional yang tetap bergerak.' : 'Operations that keep moving.',
      description:
        language === 'id'
          ? 'Ketika kebutuhan menyentuh deployment, cloud, monitoring, atau support, kami membawa konteks teknis sampai ke operational layer.'
          : 'When the work reaches deployment, cloud, monitoring, or support, we carry the context into the operational layer.',
    },
  ];

  return (
    <main className="kapi-page-bg min-h-screen bg-[#0B0C0E] text-white">
      <PublicPageHero
        eyebrow={language === 'id' ? 'Konteks Industri' : 'Industry context'}
        title={
          language === 'id'
            ? 'Kami memahami konteks bisnis sebelum memilih solusinya.'
            : 'We understand the business context before choosing the solution.'
        }
        description={
          language === 'id'
            ? 'Lihat pekerjaan Kapitech berdasarkan industri, kebutuhan yang muncul di dalamnya, dan kapabilitas yang kami gunakan untuk menghasilkan output yang nyata.'
            : 'Explore Kapitech work through the industries, needs, and capabilities that shape the engagement behind each piece of work.'
        }
      >
        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-3">
          <div className="bg-[#0B0C0E]/88 px-4 py-4 backdrop-blur-sm sm:px-5">
            <span className="block text-[9px] font-mono uppercase tracking-[0.14em] text-[#69717D]">
              {language === 'id' ? 'Industri' : 'Industries'}
            </span>
            <span className="mt-1.5 block text-2xl font-display font-semibold tracking-[-0.04em]">
              {industryEntries.length}
            </span>
          </div>
          <div className="bg-[#0B0C0E]/88 px-4 py-4 backdrop-blur-sm sm:px-5">
            <span className="block text-[9px] font-mono uppercase tracking-[0.14em] text-[#69717D]">
              {language === 'id' ? 'Pekerjaan publik' : 'Public work'}
            </span>
            <span className="mt-1.5 block text-2xl font-display font-semibold tracking-[-0.04em]">
              {totalProjects}
            </span>
          </div>
          <div className="bg-[#0B0C0E]/88 px-4 py-4 backdrop-blur-sm sm:px-5">
            <span className="block text-[9px] font-mono uppercase tracking-[0.14em] text-[#69717D]">
              {language === 'id' ? 'Kapabilitas' : 'Capabilities'}
            </span>
            <span className="mt-1.5 block text-2xl font-display font-semibold tracking-[-0.04em]">
              {totalCapabilities}
            </span>
          </div>
        </div>
      </PublicPageHero>

      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 md:px-12">
        <section className="border-b border-white/[0.07] py-10 sm:py-12" aria-labelledby="industry-explorer-title">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="kapi-section-label">
                {language === 'id' ? 'Jelajahi industri' : 'Explore industries'}
              </span>
              <h2
                id="industry-explorer-title"
                className="mt-3 text-3xl font-display font-semibold leading-[1.04] tracking-[-0.05em] sm:text-4xl"
              >
                {language === 'id'
                  ? 'Mulai dari konteks yang paling relevan dengan kebutuhan Anda.'
                  : 'Start with the context closest to your needs.'}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#7E8793]">
                {language === 'id'
                  ? 'Cari industri, client, atau layanan. Anda tidak perlu memahami struktur portfolio Kapitech terlebih dahulu.'
                  : 'Search by industry, client, or service. You do not need to understand Kapitech’s portfolio structure first.'}
              </p>
            </div>

            <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.025] px-4 py-2.5 focus-within:border-white/[0.16] focus-within:bg-white/[0.035]">
              <Search size={16} className="shrink-0 text-[#69717D]" aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                placeholder={language === 'id' ? 'Cari industri, client, layanan...' : 'Search industry, client, service...'}
                aria-label={language === 'id' ? 'Cari industri' : 'Search industries'}
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#5F6773]"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label={language === 'id' ? 'Hapus pencarian' : 'Clear search'}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#69717D] transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2" role="group" aria-label={language === 'id' ? 'Filter kapabilitas' : 'Capability filters'}>
            <button
              type="button"
              onClick={() => setPillarFilter('all')}
              aria-pressed={pillarFilter === 'all'}
              className={[
                'min-h-10 rounded-full border px-4 text-[10px] font-mono uppercase tracking-[0.1em] transition-[background-color,border-color,color]',
                pillarFilter === 'all'
                  ? 'border-brand-red/35 bg-brand-red/[0.08] text-brand-red'
                  : 'border-white/[0.08] bg-white/[0.018] text-[#7E8793] hover:border-white/[0.14] hover:text-white'
              ].join(' ')}
            >
              {language === 'id' ? 'Semua' : 'All'}
            </button>
            {(['Visual Experience', 'Innovation Development'] as ProjectItem['pillar'][]).map((pillar) => (
              <button
                key={pillar}
                type="button"
                onClick={() => setPillarFilter(pillar)}
                aria-pressed={pillarFilter === pillar}
                className={[
                  'min-h-10 rounded-full border px-4 text-[10px] font-mono uppercase tracking-[0.1em] transition-[background-color,border-color,color]',
                  pillarFilter === pillar
                    ? 'border-brand-red/35 bg-brand-red/[0.08] text-brand-red'
                    : 'border-white/[0.08] bg-white/[0.018] text-[#7E8793] hover:border-white/[0.14] hover:text-white'
                ].join(' ')}
              >
                {pillar}
              </button>
            ))}
            <span className="ml-auto text-[10px] font-mono tabular-nums text-[#59616D]" aria-live="polite">
              {visibleIndustryEntries.length} / {industryEntries.length} {language === 'id' ? 'industri' : 'industries'}
            </span>
          </div>
        </section>

        <section className="border-b border-white/[0.07] py-12 sm:py-16" aria-labelledby="industry-index-title">
            <div className="flex flex-col gap-4 border-b border-white/[0.07] pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="kapi-section-label">
                  {language === 'id' ? 'Bukti pilihan' : 'Selected proof'}
                </span>
                <h2
                  id="industry-proof-title"
                  className="mt-3 max-w-3xl text-3xl font-display font-semibold leading-[1.02] tracking-[-0.05em] sm:text-4xl lg:text-[3.25rem]"
                >
                  {featuredIndustry.industry}
                </h2>
              </div>

              <Link
                to={'/industries/' + industrySlug(featuredIndustry.industry)}
                className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-[#A5ACB6] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
              >
                {language === 'id' ? 'Buka konteks industri' : 'Open industry context'}
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-8 grid overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.018] lg:grid-cols-[1.2fr_0.8fr]">
              <Link
                to={'/work/' + (featuredProject.slug || featuredProject.id)}
                className="group relative min-h-[360px] overflow-hidden bg-[#111317] sm:min-h-[480px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-red/70"
              >
                <img
                  src={featuredProject.image}
                  alt={featuredProject.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  loading="eager"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090A0C] via-[#090A0C]/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-2 text-[9px] font-mono uppercase tracking-[0.12em] text-white/75">
                    <span>{featuredProject.client}</span>
                    <span className="text-white/25">/</span>
                    <span>{featuredProject.year}</span>
                  </div>
                  <h3 className="mt-2 max-w-2xl text-2xl font-display font-semibold tracking-[-0.035em] text-white sm:text-3xl">
                    {featuredProject.title}
                  </h3>
                </div>
              </Link>

              <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-brand-red/20 bg-brand-red/[0.05] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.1em] text-brand-red">
                      {featuredProject.service}
                    </span>
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

                  <div className="mt-8 grid gap-3 border-t border-white/[0.07] pt-6 sm:grid-cols-2">
                    <div>
                      <span className="block text-[9px] font-mono uppercase tracking-[0.12em] text-[#626B77]">
                        {language === 'id' ? 'Pekerjaan di industri' : 'Work in industry'}
                      </span>
                      <span className="mt-1 block text-xl font-display font-semibold">
                        {featuredIndustry.projects.length}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-mono uppercase tracking-[0.12em] text-[#626B77]">
                        {language === 'id' ? 'Kapabilitas' : 'Capabilities'}
                      </span>
                      <span className="mt-1 block text-xl font-display font-semibold">
                        {featuredIndustry.services.length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to={'/work/' + (featuredProject.slug || featuredProject.id)}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-red px-5 py-3 text-xs font-semibold text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-brand-red-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
                  >
                    {language === 'id' ? 'Lihat pekerjaan' : 'View work'}
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                  <Link
                    to={'/industries/' + industrySlug(featuredIndustry.industry)}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.02] px-5 py-3 text-xs font-semibold text-[#C5CAD2] transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
                  >
                    {language === 'id' ? 'Lihat semua' : 'Explore all'}
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="border-t border-white/[0.07] py-12 sm:py-16" aria-labelledby="industry-index-title">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <span className="kapi-section-label">
                {language === 'id' ? 'Industry index' : 'Industry index'}
              </span>
              <h2
                id="industry-index-title"
                className="mt-3 max-w-xl text-3xl font-display font-semibold leading-[1.04] tracking-[-0.05em] sm:text-4xl"
              >
                {language === 'id'
                  ? 'Pilih konteksnya. Lihat pekerjaan yang relevan.'
                  : 'Choose the context. See the relevant work.'}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-[#7E8793]">
                {language === 'id'
                  ? 'Setiap halaman industri menyatukan studi kasus, layanan, dan pola delivery yang tercatat di portfolio publik.'
                  : 'Each industry page brings together the case studies, services, and delivery patterns represented in the public portfolio.'}
              </p>

              <div className="mt-8 hidden border-t border-white/[0.07] pt-6 lg:block">
                <div className="flex items-center gap-3 text-[#69717D]">
                  <Layers3 size={16} aria-hidden="true" />
                  <span className="text-[9px] font-mono uppercase tracking-[0.14em]">
                    {language === 'id' ? 'Dibangun dari pekerjaan aktual' : 'Built from actual work'}
                  </span>
                </div>
                <p className="mt-3 max-w-sm text-xs leading-6 text-[#5F6773]">
                  {language === 'id'
                    ? 'Tidak ada kategori industri yang dibuat untuk sekadar memenuhi template. Index ini mengikuti data pekerjaan yang dipublikasikan.'
                    : 'No industry category is added just to fill a template. The index follows the work currently represented in the public portfolio.'}
                </p>
              </div>
            </div>

            <div className="divide-y divide-white/[0.08] border-y border-white/[0.07]">
              {visibleIndustryEntries.length > 0 ? visibleIndustryEntries.map((entry, index) => (
                <Link
                  key={entry.industry}
                  to={'/industries/' + industrySlug(entry.industry)}
                  className="group block py-6 sm:py-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-inset"
                >
                  <div className="grid gap-5 sm:grid-cols-[58px_minmax(0,1fr)_auto] sm:items-start">
                    <span className="pt-1 text-[10px] font-mono tabular-nums tracking-[0.16em] text-[#505965]">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.018] text-[#8F97A3] transition-[border-color,color,background-color] duration-200 group-hover:border-brand-red/25 group-hover:bg-brand-red/[0.04] group-hover:text-brand-red">
                            <Building2 size={16} aria-hidden="true" />
                          </span>
                          <h3 className="text-xl font-display font-semibold tracking-[-0.03em] transition-colors duration-200 group-hover:text-white sm:text-2xl">
                            {entry.industry}
                          </h3>
                        </div>

                        <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#5E6672]">
                          {entry.projects.length}{' '}
                          {language === 'id'
                            ? entry.projects.length === 1
                              ? 'case'
                              : 'cases'
                            : entry.projects.length === 1
                              ? 'case'
                              : 'cases'}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2 pl-12">
                        {entry.services.slice(0, 3).map((service) => (
                          <span
                            key={service}
                            className="rounded-full border border-white/[0.07] px-2.5 py-1 text-[9px] font-mono uppercase tracking-[0.08em] text-[#69727E]"
                          >
                            {service}
                          </span>
                        ))}
                        {entry.services.length > 3 ? (
                          <span className="rounded-full border border-white/[0.07] px-2.5 py-1 text-[9px] font-mono tracking-[0.08em] text-[#59616D]">
                            +{entry.services.length - 3}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.018] text-[#65707C] transition-[transform,border-color,background-color,color] duration-200 group-hover:-translate-y-0.5 group-hover:border-brand-red/30 group-hover:bg-brand-red/[0.08] group-hover:text-brand-red">
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              )) : (
                <div className="px-6 py-12 sm:px-8">
                  <p className="text-lg font-display font-semibold tracking-[-0.025em] text-white">
                    {language === 'id' ? 'Tidak ada industri yang cocok.' : 'No industries match this search.'}
                  </p>
                  <p className="mt-2 max-w-lg text-sm leading-7 text-[#737C88]">
                    {language === 'id'
                      ? 'Coba kata kunci lain atau hapus filter untuk melihat seluruh index.'
                      : 'Try another keyword or clear the filters to see the full industry index.'}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {query ? (
                      <button
                        type="button"
                        onClick={() => setQuery('')}
                        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.02] px-4 text-xs font-semibold text-[#C5CAD2] transition-colors hover:border-white/[0.16] hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
                      >
                        {language === 'id' ? 'Hapus pencarian' : 'Clear search'}
                      </button>
                    ) : null}
                    {pillarFilter !== 'all' ? (
                      <button
                        type="button"
                        onClick={() => setPillarFilter('all')}
                        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.02] px-4 text-xs font-semibold text-[#C5CAD2] transition-colors hover:border-white/[0.16] hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
                      >
                        {language === 'id' ? 'Reset filter' : 'Reset filter'}
                      </button>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {featuredIndustry && featuredProject ? (
          <section className="py-12 sm:py-16 lg:py-20" aria-labelledby="industry-proof-title">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="kapi-section-label">
                {language === 'id' ? 'Cara kami bekerja lintas konteks' : 'How we work across contexts'}
              </span>
              <h2
                id="delivery-across-industries-title"
                className="mt-3 text-3xl font-display font-semibold leading-[1.04] tracking-[-0.05em] sm:text-4xl"
              >
                {language === 'id'
                  ? 'Industri memberi konteks. Problem menentukan pekerjaan.'
                  : 'Industry gives context. The problem shapes the work.'}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#7E8793] lg:text-right">
              {language === 'id'
                ? 'Kami tidak menjual paket industri. Kami menyusun engagement berdasarkan tujuan, constraint, dan level kedalaman yang dibutuhkan.'
                : 'We do not sell industry packages. We shape the engagement around goals, constraints, and the depth of work required.'}
            </p>
          </div>

          <div className="mt-10 grid gap-8 border-y border-white/[0.07] md:grid-cols-3 md:divide-x md:divide-white/[0.07]">
            {deliveryPillars.map((pillar) => (
              <article key={pillar.label} className="py-7 md:px-7 md:first:pl-0 md:last:pr-0">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.018] text-[#8F97A3]">
                  {pillar.label === 'Experience' ? (
                    <Sparkles size={16} aria-hidden="true" />
                  ) : pillar.label === 'Systems' ? (
                    <Workflow size={16} aria-hidden="true" />
                  ) : (
                    <Layers3 size={16} aria-hidden="true" />
                  )}
                </span>
                <p className="mt-5 text-[9px] font-mono uppercase tracking-[0.14em] text-[#69717D]">
                  {pillar.label}
                </p>
                <h3 className="mt-2 text-xl font-display font-semibold leading-tight tracking-[-0.03em]">
                  {pillar.title}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-7 text-[#7E8793]">
                  {pillar.description}
                </p>
              </article>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
};
