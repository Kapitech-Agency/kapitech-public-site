import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  Check,
  Compass,
  Layers3,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
  X,
} from 'lucide-react';
import { allProjects, type ProjectItem } from '../data/projectsData';
import { fetchServerCmsProjects, getCmsProjects } from '../lib/cmsStore';
import { industrySlug, projectSlug, uniqueIndustries } from '../lib/publicContent';
import { useLanguage } from '../lib/LanguageContext';
import PublicPageHero from '../components/ui/PublicPageHero';

type FocusGroup = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  keywords: string[];
};

const focusGroups: FocusGroup[] = [
  {
    id: 'financial-services',
    eyebrow: 'Financial services',
    title: 'Financial Services',
    description: 'Digital experiences, financial platforms, dashboards, and enterprise workflows where clarity and trust matter.',
    keywords: ['fintech', 'finansial', 'payment', 'bank', 'capital', 'wealth', 'venture', 'sekuritas', 'pasar modal', 'financial advisory'],
  },
  {
    id: 'healthcare',
    eyebrow: 'Healthcare',
    title: 'Healthcare & HealthTech',
    description: 'Patient-facing products, healthcare systems, and operational tools designed around clarity, access, and workflow.',
    keywords: ['healthcare', 'healthtech', 'rumah sakit', 'medtech', 'medis', 'farmasi', 'medical'],
  },
  {
    id: 'ai-saas',
    eyebrow: 'Digital products',
    title: 'AI, SaaS & Digital Products',
    description: 'Software products, internal platforms, AI workflows, and complex interfaces that need scalable product thinking.',
    keywords: ['ai', 'saas', 'productivity', 'hrtech', 'agritech', 'edtech', 'creative saas', 'digital product'],
  },
  {
    id: 'commerce-consumer',
    eyebrow: 'Commerce',
    title: 'Commerce & Consumer',
    description: 'E-commerce, retail, beauty, fashion, food, and consumer brands that need strong digital experiences.',
    keywords: ['e-commerce', 'ecommerce', 'retail', 'beauty', 'skincare', 'f&b', 'coffee', 'fashion', 'luxury goods', 'haute joaillerie'],
  },
  {
    id: 'industrial-infrastructure',
    eyebrow: 'Industrial',
    title: 'Industrial & Infrastructure',
    description: 'Industrial, engineering, energy, manufacturing, cloud, and infrastructure work where systems and reliability are central.',
    keywords: ['manufaktur', 'konstruksi', 'infrastruktur', 'energi', 'solar', 'otomasi', 'robotika', 'cloud infrastructure', 'devops', 'telekomunikasi', 'erp'],
  },
  {
    id: 'mobility-logistics',
    eyebrow: 'Mobility',
    title: 'Mobility & Logistics',
    description: 'Transportation, logistics, fleet, shipping, and mobility experiences built around operational efficiency.',
    keywords: ['logistics', 'logistik', 'transportasi', 'pelayaran', 'ekspedisi', 'otomotif', 'fleet', 'smart city'],
  },
  {
    id: 'hospitality-property',
    eyebrow: 'Lifestyle',
    title: 'Hospitality, Property & Lifestyle',
    description: 'Hospitality, property, architecture, wellness, and premium experiences where brand and experience meet.',
    keywords: ['hospitality', 'luxury wedding', 'wellness', 'real estate', 'properti', 'arsitektur', 'villa'],
  },
  {
    id: 'media-culture',
    eyebrow: 'Culture & media',
    title: 'Media, Gaming & Culture',
    description: 'Gaming, live content, motion, tourism, creative campaigns, and cultural experiences that rely on visual impact.',
    keywords: ['gaming', 'live streaming', 'tvc', 'tourism', 'pariwisata', 'kebudayaan', 'advertising', 'motion'],
  },
];

const groupMatchesIndustry = (group: FocusGroup, industry: string) => {
  const value = industry.toLowerCase();
  return group.keywords.some((keyword) => value.includes(keyword));
};

export const Industries = () => {
  const { language } = useLanguage();
  const [projects, setProjects] = useState<ProjectItem[]>(() => getCmsProjects());
  const [activeGroupId, setActiveGroupId] = useState('financial-services');
  const [query, setQuery] = useState('');

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
          const services = Array.from(new Set(industryProjects.map((project) => project.service).filter(Boolean)));

          return {
            industry,
            projects: industryProjects,
            services,
          };
        })
        .sort((a, b) => {
          if (b.projects.length !== a.projects.length) return b.projects.length - a.projects.length;
          return a.industry.localeCompare(b.industry);
        }),
    [publicSource],
  );

  const focusGroupsWithData = useMemo(
    () =>
      focusGroups.map((group) => {
        const matchedProjects = publicSource.filter((project) => groupMatchesIndustry(group, project.industry));
        const matchedIndustries = industryEntries.filter((entry) => groupMatchesIndustry(group, entry.industry));

        return {
          ...group,
          projects: matchedProjects,
          industries: matchedIndustries,
        };
      }),
    [publicSource, industryEntries],
  );

  const activeGroup = focusGroupsWithData.find((group) => group.id === activeGroupId) ?? focusGroupsWithData[0];
  const activeProjects = activeGroup?.projects ?? [];
  const activeIndustries = activeGroup?.industries ?? [];
  const activeFeatured = activeProjects.find((project) => project.featured) ?? activeProjects[0];
  const activeServices = Array.from(new Set(activeProjects.map((project) => project.service).filter(Boolean)));

  const normalizedQuery = query.trim().toLowerCase();

  const filteredIndustryEntries = useMemo(
    () =>
      industryEntries.filter((entry) => {
        if (!normalizedQuery) return true;

        const searchable = [
          entry.industry,
          ...entry.services,
          ...entry.projects.map((project) => project.title),
          ...entry.projects.map((project) => project.client),
        ]
          .join(' ')
          .toLowerCase();

        return searchable.includes(normalizedQuery);
      }),
    [industryEntries, normalizedQuery],
  );

  const groupSummaries = useMemo(
    () =>
      focusGroupsWithData.map((group) => ({
        ...group,
        projectCount: group.projects.length,
        industryCount: group.industries.length,
        services: Array.from(new Set(group.projects.map((project) => project.service).filter(Boolean))).slice(0, 4),
      })),
    [focusGroupsWithData],
  );

  const adaptationPrinciples = [
    {
      icon: Compass,
      title: language === 'id' ? 'Mulai dari problem, bukan paket industri' : 'Start with the problem, not a package',
      description:
        language === 'id'
          ? 'Konteks industri membantu kami memahami constraint, tetapi scope tetap ditentukan oleh tujuan bisnis dan kebutuhan pengguna.'
          : 'Industry context helps us understand constraints, while the engagement is still shaped by business goals and user needs.',
    },
    {
      icon: ShieldCheck,
      title: language === 'id' ? 'Pertimbangkan trust dan operational risk' : 'Account for trust and operational risk',
      description:
        language === 'id'
          ? 'Untuk produk yang sensitif atau kompleks, kami memasukkan clarity, permissions, reliability, dan recovery ke dalam pengalaman.'
          : 'For sensitive or complex products, we account for clarity, permissions, reliability, and recovery as part of the experience.',
    },
    {
      icon: Workflow,
      title: language === 'id' ? 'Hubungkan experience dengan system' : 'Connect experience to the system',
      description:
        language === 'id'
          ? 'Design, application flow, integration, dan infrastructure dipandang sebagai satu delivery path ketika problem memang membutuhkannya.'
          : 'Design, application flow, integrations, and infrastructure are treated as one delivery path when the problem requires it.',
    },
    {
      icon: BarChart3,
      title: language === 'id' ? 'Ukur hasil yang relevan' : 'Measure what matters to the work',
      description:
        language === 'id'
          ? 'Kami lebih mengutamakan metric yang berhubungan dengan outcome project daripada sekadar menambah output di portfolio.'
          : 'We focus on metrics connected to the project outcome rather than adding outputs for the sake of the portfolio.',
    },
  ];

  return (
    <main className="kapi-page-bg min-h-screen bg-[#0B0C0E] text-white">
      <PublicPageHero
        eyebrow={language === 'id' ? 'Industry expertise' : 'Industry expertise'}
        title={
          language === 'id'
            ? 'Solusi digital yang memahami konteks industrinya.'
            : 'Digital work that understands the industry context.'
        }
        description={
          language === 'id'
            ? 'Kapitech menggabungkan design, development, dan technical delivery berdasarkan karakter problem yang kami hadapi di tiap industri.'
            : 'Kapitech brings design, development, and technical delivery together around the kind of problem each industry presents.'
        }
      >
        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-3">
          {[
            { label: language === 'id' ? 'Focus areas' : 'Focus areas', value: focusGroups.length },
            { label: language === 'id' ? 'Industry contexts' : 'Industry contexts', value: industryEntries.length },
            { label: language === 'id' ? 'Public work' : 'Public work', value: publicSource.length },
          ].map((metric) => (
            <div key={metric.label} className="bg-[#0B0C0E]/92 px-4 py-4 backdrop-blur-sm sm:px-5">
              <span className="block text-[9px] font-mono uppercase tracking-[0.14em] text-[#69717D]">{metric.label}</span>
              <span className="mt-1.5 block text-2xl font-display font-semibold tracking-[-0.04em]">{metric.value}</span>
            </div>
          ))}
        </div>
      </PublicPageHero>

      <div className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-6 md:px-10 lg:px-12">
        <section className="border-b border-white/[0.07] py-12 sm:py-16 lg:py-20" aria-labelledby="industry-focus-title">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="kapi-section-label">{language === 'id' ? 'Explore by industry' : 'Explore by industry'}</span>
              <h2 id="industry-focus-title" className="mt-3 text-3xl font-display font-semibold leading-[1.02] tracking-[-0.05em] sm:text-4xl lg:text-[3.5rem]">
                {language === 'id' ? 'Pilih konteks yang paling dekat dengan bisnis Anda.' : 'Start with the context closest to your business.'}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#7E8793]">
                {language === 'id'
                  ? 'Bukan sekadar daftar kategori. Setiap focus area menghubungkan konteks industri dengan pekerjaan dan kapabilitas yang benar-benar ada di portfolio publik.'
                  : 'Not just a category list. Each focus area connects the industry context to work and capabilities represented in the public portfolio.'}
              </p>
            </div>
            <Link to="/work" className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-[#A5ACB6] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70">
              {language === 'id' ? 'Lihat seluruh work' : 'View all work'}
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {groupSummaries.map((group, index) => {
              const active = group.id === activeGroupId;

              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setActiveGroupId(group.id)}
                  aria-pressed={active}
                  className={[
                    'group relative min-h-[190px] overflow-hidden rounded-[1.5rem] border p-5 text-left transition-[border-color,background-color,transform] duration-300',
                    active
                      ? 'border-brand-red/35 bg-brand-red/[0.06] -translate-y-0.5'
                      : 'border-white/[0.08] bg-white/[0.018] hover:-translate-y-0.5 hover:border-white/[0.15] hover:bg-white/[0.03]',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-mono text-[10px] tabular-nums tracking-[0.16em] text-[#59616D]">{String(index + 1).padStart(2, '0')}</span>
                    <span className={[
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors',
                      active ? 'border-brand-red/30 bg-brand-red/[0.1] text-brand-red' : 'border-white/[0.08] text-[#68717D] group-hover:text-white',
                    ].join(' ')}>
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </span>
                  </div>

                  <p className="mt-8 text-[9px] font-mono uppercase tracking-[0.14em] text-[#68717D]">{group.eyebrow}</p>
                  <h3 className="mt-2 text-xl font-display font-semibold tracking-[-0.035em]">{group.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#7E8793]">{group.description}</p>

                  <div className="mt-5 flex items-center gap-3 text-[9px] font-mono uppercase tracking-[0.1em]">
                    <span className="text-[#C3C8D0]">{group.projectCount} {language === 'id' ? 'projects' : 'projects'}</span>
                    <span className="text-[#3E454F]">/</span>
                    <span className="text-[#69727E]">{group.industryCount} {language === 'id' ? 'contexts' : 'contexts'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {activeGroup ? (
          <section className="border-b border-white/[0.07] py-12 sm:py-16 lg:py-20" aria-labelledby="industry-proof-title">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="kapi-section-label">{activeGroup.eyebrow}</span>
                <h2 id="industry-proof-title" className="mt-3 text-3xl font-display font-semibold leading-[1.02] tracking-[-0.05em] sm:text-4xl lg:text-[3.3rem]">
                  {language === 'id' ? 'Work yang membuktikan fit-nya.' : 'Work that proves the fit.'}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeIndustries.slice(0, 3).map((entry) => (
                  <Link
                    key={entry.industry}
                    to={'/industries/' + industrySlug(entry.industry)}
                    className="rounded-full border border-white/[0.08] bg-white/[0.018] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.1em] text-[#7D8793] transition-colors hover:border-brand-red/25 hover:text-brand-red"
                  >
                    {entry.industry}
                  </Link>
                ))}
              </div>
            </div>

            {activeProjects.length > 0 ? (
              <div className="mt-9 grid gap-4 lg:grid-cols-[1.28fr_0.72fr]">
                <Link
                  to={'/work/' + projectSlug(activeFeatured)}
                  className="group relative min-h-[440px] overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#111317] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 sm:min-h-[540px]"
                >
                  <img
                    src={activeFeatured.image}
                    alt={activeFeatured.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090A0C] via-[#090A0C]/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-2 text-[9px] font-mono uppercase tracking-[0.12em] text-white/72">
                      <span>{activeFeatured.client}</span>
                      <span className="text-white/25">/</span>
                      <span>{activeFeatured.year}</span>
                      <span className="text-white/25">/</span>
                      <span>{activeFeatured.service}</span>
                    </div>
                    <h3 className="mt-2 max-w-3xl text-2xl font-display font-semibold tracking-[-0.04em] sm:text-4xl">{activeFeatured.title}</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-white/72">
                      {language === 'id' ? activeFeatured.descId : activeFeatured.desc}
                    </p>
                  </div>
                </Link>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {activeProjects.slice(1, 4).map((project) => (
                    <Link
                      key={project.id}
                      to={'/work/' + projectSlug(project)}
                      className="group grid min-h-[170px] grid-cols-[120px_minmax(0,1fr)] overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-white/[0.018] transition-colors hover:border-white/[0.15] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
                    >
                      <div className="relative overflow-hidden bg-[#111317]">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="flex min-w-0 flex-col justify-between p-4 sm:p-5">
                        <div>
                          <span className="text-[8px] font-mono uppercase tracking-[0.12em] text-brand-red">{project.service}</span>
                          <h3 className="mt-2 line-clamp-2 text-base font-display font-semibold tracking-[-0.025em]">{project.title}</h3>
                        </div>
                        <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold text-[#7A838F] group-hover:text-white">
                          {language === 'id' ? 'Buka case' : 'Open case'} <ArrowUpRight size={13} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-9 rounded-[2rem] border border-white/[0.08] bg-white/[0.018] px-6 py-10">
                <p className="text-lg font-display font-semibold">{language === 'id' ? 'Belum ada work yang dipetakan ke focus area ini.' : 'No public work is mapped to this focus area yet.'}</p>
                <p className="mt-2 text-sm leading-7 text-[#727B87]">
                  {language === 'id' ? 'Gunakan directory di bawah untuk menjelajahi konteks industri yang tersedia.' : 'Use the directory below to explore the available industry contexts.'}
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] pt-6">
              <div className="flex flex-wrap gap-2">
                {activeServices.map((service) => (
                  <span key={service} className="rounded-full border border-brand-red/15 bg-brand-red/[0.04] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.1em] text-brand-red">
                    {service}
                  </span>
                ))}
              </div>
              {activeIndustries[0] ? (
                <Link
                  to={'/industries/' + industrySlug(activeIndustries[0].industry)}
                  className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-[#B3BAC4] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
                >
                  {language === 'id' ? 'Explore context' : 'Explore context'}
                  <ArrowRight size={14} />
                </Link>
              ) : null}
            </div>
          </section>
        ) : null}

        <section className="border-b border-white/[0.07] py-12 sm:py-16 lg:py-20" aria-labelledby="industry-capabilities-title">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <span className="kapi-section-label">{language === 'id' ? 'Capabilities' : 'Capabilities'}</span>
              <h2 id="industry-capabilities-title" className="mt-3 max-w-xl text-3xl font-display font-semibold leading-[1.03] tracking-[-0.05em] sm:text-4xl">
                {language === 'id' ? 'Apa yang biasanya kami bangun.' : 'What we build in these contexts.'}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-[#7E8793]">
                {language === 'id'
                  ? 'Industri menentukan konteks. Kapabilitas menentukan bentuk pekerjaan yang benar-benar dikirim.'
                  : 'Industry defines the context. Capabilities define the work that gets delivered.'}
              </p>
            </div>

            <div className="grid gap-px overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.07] sm:grid-cols-2">
              {[
                {
                  icon: Sparkles,
                  title: language === 'id' ? 'Visual experience' : 'Visual experience',
                  description: language === 'id' ? 'Branding, UI/UX, motion, 3D, creative systems, and content experiences.' : 'Branding, UI/UX, motion, 3D, creative systems, and content experiences.',
                },
                {
                  icon: Workflow,
                  title: language === 'id' ? 'Digital products' : 'Digital products',
                  description: language === 'id' ? 'Corporate websites, web applications, e-commerce, MVPs, and custom product interfaces.' : 'Corporate websites, web applications, e-commerce, MVPs, and custom product interfaces.',
                },
                {
                  icon: Layers3,
                  title: language === 'id' ? 'Business systems' : 'Business systems',
                  description: language === 'id' ? 'ERP, CRM, internal tools, workflow systems, and operational dashboards.' : 'ERP, CRM, internal tools, workflow systems, and operational dashboards.',
                },
                {
                  icon: ShieldCheck,
                  title: language === 'id' ? 'Infrastructure' : 'Infrastructure',
                  description: language === 'id' ? 'Cloud architecture, DevOps, managed environments, monitoring, and technical operations.' : 'Cloud architecture, DevOps, managed environments, monitoring, and technical operations.',
                },
              ].map((item) => (
                <article key={item.title} className="bg-[#0E1013] p-6 sm:p-7">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.018] text-[#9098A5]">
                    <item.icon size={16} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-xl font-display font-semibold tracking-[-0.03em]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#777F8B]">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.07] py-12 sm:py-16 lg:py-20" aria-labelledby="all-industries-title">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="kapi-section-label">{language === 'id' ? 'All industry contexts' : 'All industry contexts'}</span>
              <h2 id="all-industries-title" className="mt-3 text-3xl font-display font-semibold leading-[1.03] tracking-[-0.05em] sm:text-4xl">
                {language === 'id' ? 'Cari konteks yang paling spesifik.' : 'Find the most specific context.'}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#7E8793]">
                {language === 'id'
                  ? 'Focus area memberi gambaran besar. Directory ini memberi jalan langsung ke konteks industri yang tercatat di portfolio.'
                  : 'The focus areas give you the bigger picture. This directory takes you directly to the industry contexts represented in the portfolio.'}
              </p>
            </div>

            <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.025] px-4 py-2.5 focus-within:border-white/[0.16] focus-within:bg-white/[0.035]">
              <Search size={16} className="shrink-0 text-[#69717D]" aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                placeholder={language === 'id' ? 'Cari industry, client, service...' : 'Search industry, client, service...'}
                aria-label={language === 'id' ? 'Cari konteks industri' : 'Search industry context'}
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

          <div className="mt-9 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {filteredIndustryEntries.map((entry) => (
              <Link
                key={entry.industry}
                to={'/industries/' + industrySlug(entry.industry)}
                className="group flex min-h-[132px] flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.018] p-5 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-white/[0.15] hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.018] text-[#7E8793] group-hover:text-brand-red">
                    <Building2 size={14} aria-hidden="true" />
                  </span>
                  <ArrowUpRight size={15} className="text-[#505965] transition-colors group-hover:text-white" />
                </div>
                <div className="mt-6">
                  <h3 className="text-base font-display font-semibold tracking-[-0.025em]">{entry.industry}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-[9px] font-mono uppercase tracking-[0.1em] text-[#65707C]">
                      {entry.projects.length} {entry.projects.length === 1 ? 'case' : 'cases'}
                    </span>
                    {entry.services[0] ? <span className="text-[9px] font-mono uppercase tracking-[0.1em] text-brand-red">{entry.services[0]}</span> : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredIndustryEntries.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.018] px-6 py-10">
              <p className="text-lg font-display font-semibold">{language === 'id' ? 'Tidak ada hasil.' : 'No industry context found.'}</p>
              <p className="mt-2 text-sm leading-7 text-[#737C88]">
                {language === 'id' ? 'Coba kata kunci yang lebih umum.' : 'Try a broader keyword.'}
              </p>
            </div>
          ) : null}
        </section>

        <section className="py-12 sm:py-16 lg:py-20" aria-labelledby="industry-adaptation-title">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="kapi-section-label">{language === 'id' ? 'How we adapt' : 'How we adapt'}</span>
              <h2 id="industry-adaptation-title" className="mt-3 text-3xl font-display font-semibold leading-[1.03] tracking-[-0.05em] sm:text-4xl">
                {language === 'id' ? 'Industri berbeda. Cara menyelesaikan problem juga berbeda.' : 'Different industries need different ways of solving the problem.'}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#7E8793] lg:text-right">
              {language === 'id'
                ? 'Kami membawa context ke delivery tanpa mengunci pekerjaan pada template industri.'
                : 'We bring context into delivery without forcing the work into an industry template.'}
            </p>
          </div>

          <div className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {adaptationPrinciples.map((item) => (
              <article key={item.title} className="rounded-[1.5rem] border border-white/[0.08] bg-white/[0.018] p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.018] text-[#8F97A3]">
                  <item.icon size={16} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-display font-semibold leading-tight tracking-[-0.025em]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#777F8B]">{item.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.12em] text-[#5E6672]">
                  <Check size={12} aria-hidden="true" />
                  Kapitech approach
                </span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};
