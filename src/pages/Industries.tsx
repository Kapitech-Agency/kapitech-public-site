import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
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
  shortTitle: string;
  description: string;
  keywords: string[];
  needs: string[];
};

const focusGroups: FocusGroup[] = [
  {
    id: 'ai-saas',
    eyebrow: 'AI, SaaS & digital products',
    title: 'AI, SaaS & Digital Products',
    shortTitle: 'AI & SaaS',
    description: 'Complex products become easier to understand when product logic, interface design, and delivery stay connected.',
    keywords: ['ai', 'saas', 'productivity', 'hrtech', 'agritech', 'edtech', 'creative saas', 'digital product'],
    needs: ['Product UX & UI', 'Web applications', 'MVP development', 'Workflow systems'],
  },
  {
    id: 'financial-services',
    eyebrow: 'Financial services',
    title: 'Financial Services',
    shortTitle: 'Fintech',
    description: 'Financial products need clarity, confidence, and interfaces that make dense information easier to act on.',
    keywords: ['fintech', 'finansial', 'payment', 'bank', 'capital', 'wealth', 'venture', 'sekuritas', 'pasar modal', 'financial advisory'],
    needs: ['Dashboards & portals', 'UI/UX design', 'Digital platforms', 'Enterprise systems'],
  },
  {
    id: 'healthcare',
    eyebrow: 'Healthcare & healthtech',
    title: 'Healthcare & HealthTech',
    shortTitle: 'Healthcare',
    description: 'Healthcare experiences have to balance accessibility, trust, operational workflow, and information density.',
    keywords: ['healthcare', 'healthtech', 'rumah sakit', 'medtech', 'medis', 'farmasi', 'medical'],
    needs: ['Patient experiences', 'Clinical workflows', 'Healthcare systems', 'Digital platforms'],
  },
  {
    id: 'commerce-consumer',
    eyebrow: 'Commerce & consumer',
    title: 'Commerce & Consumer',
    shortTitle: 'Commerce',
    description: 'Consumer work needs a strong connection between brand expression, discovery, conversion, and the buying journey.',
    keywords: ['e-commerce', 'ecommerce', 'retail', 'beauty', 'skincare', 'f&b', 'coffee', 'fashion', 'luxury goods', 'haute joaillerie'],
    needs: ['E-commerce', 'Brand systems', 'Campaign design', 'Conversion-focused websites'],
  },
  {
    id: 'industrial-infrastructure',
    eyebrow: 'Industrial & infrastructure',
    title: 'Industrial & Infrastructure',
    shortTitle: 'Industrial',
    description: 'Operationally complex organisations need digital systems that are clear for users and practical for the teams running them.',
    keywords: ['manufaktur', 'konstruksi', 'infrastruktur', 'energi', 'solar', 'otomasi', 'robotika', 'cloud infrastructure', 'devops', 'telekomunikasi', 'erp'],
    needs: ['ERP & CRM', 'Operational portals', 'Cloud infrastructure', 'Enterprise workflows'],
  },
  {
    id: 'mobility-logistics',
    eyebrow: 'Mobility & logistics',
    title: 'Mobility & Logistics',
    shortTitle: 'Mobility',
    description: 'Fleet, logistics, transport, and mobility products depend on efficient workflows, reliable information, and fast decisions.',
    keywords: ['logistics', 'logistik', 'transportasi', 'pelayaran', 'ekspedisi', 'otomotif', 'fleet', 'smart city'],
    needs: ['Fleet experiences', 'Operational portals', 'Web applications', 'System workflows'],
  },
  {
    id: 'hospitality-property',
    eyebrow: 'Hospitality, property & lifestyle',
    title: 'Hospitality, Property & Lifestyle',
    shortTitle: 'Lifestyle',
    description: 'Premium experiences depend on brand, presentation, and digital journeys that make high-value decisions feel easier.',
    keywords: ['hospitality', 'luxury wedding', 'wellness', 'real estate', 'properti', 'arsitektur', 'villa'],
    needs: ['Digital presence', '3D visualisation', 'Brand identity', 'Experience design'],
  },
  {
    id: 'media-culture',
    eyebrow: 'Media, gaming & culture',
    title: 'Media, Gaming & Culture',
    shortTitle: 'Media',
    description: 'Visual-first industries need strong creative direction without losing clarity, consistency, or product thinking.',
    keywords: ['gaming', 'live streaming', 'tvc', 'tourism', 'pariwisata', 'kebudayaan', 'advertising', 'motion'],
    needs: ['Motion & campaigns', 'Interactive experiences', '3D visualisation', 'Creative systems'],
  },
];

const groupMatchesIndustry = (group: FocusGroup, industry: string) => {
  const value = industry.toLowerCase();
  return group.keywords.some((keyword) => value.includes(keyword));
};

export const Industries = () => {
  const { language } = useLanguage();
  const [projects, setProjects] = useState<ProjectItem[]>(() => getCmsProjects());
  const [activeGroupId, setActiveGroupId] = useState('ai-saas');
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
          services: Array.from(new Set(matchedProjects.map((project) => project.service).filter(Boolean))),
        };
      }),
    [publicSource, industryEntries],
  );

  const activeGroup = focusGroupsWithData.find((group) => group.id === activeGroupId) ?? focusGroupsWithData[0];
  const activeProjects = activeGroup?.projects ?? [];
  const activeIndustries = activeGroup?.industries ?? [];
  const activeFeatured = activeProjects.find((project) => project.featured) ?? activeProjects[0];

  const totalCapabilities = useMemo(
    () => new Set(publicSource.map((project) => project.service).filter(Boolean)).size,
    [publicSource],
  );

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

  const principles = [
    {
      icon: Compass,
      title: language === 'id' ? 'Context sebelum output' : 'Context before output',
      description:
        language === 'id'
          ? 'Kami mulai dari tujuan, pengguna, constraint, dan tingkat kompleksitas. Bukan dari daftar deliverable.'
          : 'We start with goals, users, constraints, and complexity. Not with a list of deliverables.',
    },
    {
      icon: Sparkles,
      title: language === 'id' ? 'Creative + technical' : 'Creative + technical',
      description:
        language === 'id'
          ? 'Design, development, dan technical delivery bisa berjalan dalam satu jalur saat problem memang membutuhkannya.'
          : 'Design, development, and technical delivery can stay on one path when the problem calls for it.',
    },
    {
      icon: ShieldCheck,
      title: language === 'id' ? 'Dibuat untuk penggunaan nyata' : 'Built for real use',
      description:
        language === 'id'
          ? 'Kami mempertimbangkan usability, maintainability, reliability, dan handoff sejak awal, bukan setelah semuanya selesai.'
          : 'Usability, maintainability, reliability, and handoff are considered from the start, not after everything is finished.',
    },
  ];

  const deliverySteps = [
    {
      step: '01',
      title: language === 'id' ? 'Discovery' : 'Discovery',
      description: language === 'id' ? 'Pahami business context, audience, workflow, dan masalah utama.' : 'Understand the business context, audience, workflow, and core problem.',
    },
    {
      step: '02',
      title: language === 'id' ? 'Direction' : 'Direction',
      description: language === 'id' ? 'Tentukan prioritas, struktur pengalaman, scope, dan jalur delivery yang paling masuk akal.' : 'Define priorities, experience structure, scope, and the most sensible delivery path.',
    },
    {
      step: '03',
      title: language === 'id' ? 'Design & Build' : 'Design & Build',
      description: language === 'id' ? 'Eksekusi design atau engineering sesuai scope, dengan review dan validasi di titik penting.' : 'Execute design or engineering against the agreed scope, with review and validation at key checkpoints.',
    },
    {
      step: '04',
      title: language === 'id' ? 'Launch & Support' : 'Launch & Support',
      description: language === 'id' ? 'Siapkan handoff, launch, improvement, atau technical support sesuai kebutuhan engagement.' : 'Prepare handoff, launch, improvements, or technical support based on the engagement.',
    },
  ];

  return (
    <main className="kapi-page-bg min-h-screen bg-[#0B0C0E] text-white">
      <PublicPageHero
        eyebrow={language === 'id' ? 'Industry expertise' : 'Industry expertise'}
        title={
          language === 'id'
            ? 'Kami memahami industrinya. Kami mengerjakan masalah digitalnya.'
            : 'We understand the industry. We solve the digital problem.'
        }
        description={
          language === 'id'
            ? 'Kapitech menggabungkan creative, product design, development, dan technical delivery berdasarkan konteks bisnis yang dihadapi tiap industri.'
            : 'Kapitech combines creative, product design, development, and technical delivery around the business context each industry brings.'
        }
      >
        <div className="grid gap-3 sm:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[1.5rem] border border-white/[0.08] bg-[#0B0C0E]/86 p-5 backdrop-blur-sm sm:p-6">
            <p className="text-[9px] font-mono uppercase tracking-[0.16em] text-brand-red">
              {language === 'id' ? 'Yang kami bawa' : 'What we bring'}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Brand & Experience', 'Product & UI/UX', 'Web & Applications', 'Systems & Infrastructure'].map((item) => (
                <span key={item} className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-[9px] font-mono uppercase tracking-[0.09em] text-[#ABB1BA]">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-white/[0.08]">
            {[
              { value: industryEntries.length, label: language === 'id' ? 'industry contexts' : 'industry contexts' },
              { value: publicSource.length, label: language === 'id' ? 'public projects' : 'public projects' },
              { value: totalCapabilities, label: language === 'id' ? 'capabilities' : 'capabilities' },
            ].map((item) => (
              <div key={item.label} className="bg-[#0B0C0E]/92 px-3 py-4 sm:px-4">
                <span className="block text-xl font-display font-semibold tracking-[-0.04em] sm:text-2xl">{item.value}</span>
                <span className="mt-1 block text-[8px] font-mono uppercase leading-4 tracking-[0.09em] text-[#69717D]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </PublicPageHero>

      <div className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-6 md:px-10 lg:px-12">
        <section className="border-b border-white/[0.07] py-12 sm:py-16 lg:py-20" aria-labelledby="experience-title">
          <div className="max-w-3xl">
            <span className="kapi-section-label">{language === 'id' ? 'Our experience matches your market' : 'Our experience matches your market'}</span>
            <h2 id="experience-title" className="mt-3 text-3xl font-display font-semibold leading-[1.02] tracking-[-0.05em] sm:text-4xl lg:text-[3.6rem]">
              {language === 'id' ? 'Pilih industri. Lalu lihat bukti pekerjaannya.' : 'Pick the industry. Then see the work.'}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#7E8793]">
              {language === 'id'
                ? 'Kami tidak ingin Anda menebak dari daftar layanan. Pilih konteks yang paling dekat dengan bisnis Anda, lalu lihat jenis pekerjaan yang memang kami representasikan.'
                : 'We do not want you to guess from a service list. Choose the context closest to your business, then see the work we actually represent.'}
            </p>
          </div>

          <div className="mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {focusGroupsWithData.map((group) => {
              const active = group.id === activeGroupId;

              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setActiveGroupId(group.id)}
                  aria-pressed={active}
                  className={[
                    'shrink-0 rounded-full border px-4 py-2.5 text-[10px] font-mono uppercase tracking-[0.1em] transition-[background-color,border-color,color,transform] duration-200',
                    active
                      ? 'border-brand-red/35 bg-brand-red/[0.1] text-brand-red'
                      : 'border-white/[0.08] bg-white/[0.018] text-[#7A838F] hover:border-white/[0.15] hover:text-white',
                  ].join(' ')}
                >
                  {group.shortTitle}
                  <span className="ml-2 text-[#515A66]">{group.projects.length}</span>
                </button>
              );
            })}
          </div>

          {activeGroup ? (
            <div className="mt-5 overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#101216]">
              <div className="grid lg:grid-cols-[0.86fr_1.14fr]">
                <div className="border-b border-white/[0.07] p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
                  <p className="text-[9px] font-mono uppercase tracking-[0.15em] text-brand-red">{activeGroup.eyebrow}</p>
                  <h3 className="mt-3 text-3xl font-display font-semibold leading-[1.02] tracking-[-0.05em] sm:text-4xl">{activeGroup.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#8A929E]">{activeGroup.description}</p>

                  <div className="mt-7">
                    <p className="text-[9px] font-mono uppercase tracking-[0.14em] text-[#59616D]">
                      {language === 'id' ? 'Typical needs' : 'Typical needs'}
                    </p>
                    <div className="mt-3 grid gap-2">
                      {activeGroup.needs.map((need) => (
                        <div key={need} className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.018] px-3.5 py-3">
                          <CheckCircle2 size={14} className="text-brand-red" aria-hidden="true" />
                          <span className="text-xs text-[#C4C9D1]">{need}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-7 flex flex-wrap gap-2">
                    {activeGroup.services.slice(0, 5).map((service) => (
                      <span key={service} className="rounded-full border border-white/[0.07] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.09em] text-[#747E8A]">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 sm:p-5 lg:p-6">
                  {activeFeatured ? (
                    <div className="grid gap-3 sm:grid-cols-[1.3fr_0.7fr]">
                      <Link
                        to={'/work/' + projectSlug(activeFeatured)}
                        className="group relative min-h-[360px] overflow-hidden rounded-[1.5rem] bg-[#15171B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
                      >
                        <img
                          src={activeFeatured.image}
                          alt={activeFeatured.title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#090A0C] via-[#090A0C]/15 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                          <div className="flex flex-wrap items-center gap-2 text-[8px] font-mono uppercase tracking-[0.12em] text-white/70">
                            <span>{activeFeatured.client}</span>
                            <span className="text-white/25">/</span>
                            <span>{activeFeatured.service}</span>
                          </div>
                          <h4 className="mt-2 text-xl font-display font-semibold tracking-[-0.035em] sm:text-2xl">{activeFeatured.title}</h4>
                        </div>
                      </Link>

                      <div className="grid gap-3">
                        {activeProjects.slice(1, 3).map((project) => (
                          <Link
                            key={project.id}
                            to={'/work/' + projectSlug(project)}
                            className="group overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-white/[0.018] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
                          >
                            <div className="relative aspect-[16/8] overflow-hidden bg-[#15171B]">
                              <img
                                src={project.image}
                                alt={project.title}
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                loading="lazy"
                                decoding="async"
                              />
                            </div>
                            <div className="p-4">
                              <span className="text-[8px] font-mono uppercase tracking-[0.1em] text-brand-red">{project.service}</span>
                              <h4 className="mt-2 line-clamp-2 text-sm font-display font-semibold tracking-[-0.02em]">{project.title}</h4>
                            </div>
                          </Link>
                        ))}
                        {activeProjects.length === 1 ? (
                          <Link
                            to="/work"
                            className="flex min-h-[100px] items-center justify-between rounded-[1.5rem] border border-dashed border-white/[0.1] bg-white/[0.012] px-5 text-sm text-[#7E8793] transition-colors hover:border-white/[0.18] hover:text-white"
                          >
                            <span>{language === 'id' ? 'Lihat seluruh pekerjaan' : 'See all work'}</span>
                            <ArrowUpRight size={15} />
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <div className="flex min-h-[360px] items-center justify-center rounded-[1.5rem] border border-dashed border-white/[0.1] p-8 text-center">
                      <div>
                        <p className="font-display text-xl font-semibold">{language === 'id' ? 'Belum ada public work di area ini.' : 'No public work is mapped to this area yet.'}</p>
                        <Link to="/work" className="mt-4 inline-flex items-center gap-2 text-sm text-[#AAB0BA] hover:text-white">{language === 'id' ? 'Lihat semua work' : 'View all work'} <ArrowRight size={14} /></Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <section className="border-b border-white/[0.07] py-12 sm:py-16 lg:py-20" aria-labelledby="different-title">
          <div className="grid gap-10 lg:grid-cols-[0.62fr_1.38fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <span className="kapi-section-label">{language === 'id' ? 'Why it matters' : 'Why it matters'}</span>
              <h2 id="different-title" className="mt-3 text-3xl font-display font-semibold leading-[1.03] tracking-[-0.05em] sm:text-4xl">
                {language === 'id' ? 'Bukan sekadar tahu industrinya.' : 'Knowing the industry is only the start.'}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-[#7E8793]">
                {language === 'id'
                  ? 'Yang penting adalah bagaimana context tersebut memengaruhi keputusan design, product, engineering, dan delivery.'
                  : 'What matters is how that context changes design, product, engineering, and delivery decisions.'}
              </p>
            </div>

            <div className="grid gap-px overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.07] md:grid-cols-3">
              {principles.map((item) => (
                <article key={item.title} className="bg-[#0E1013] p-6 sm:p-7">
                  <item.icon size={18} className="text-brand-red" aria-hidden="true" />
                  <h3 className="mt-5 text-xl font-display font-semibold leading-tight tracking-[-0.03em]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#78818D]">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.07] py-12 sm:py-16 lg:py-20" aria-labelledby="delivery-title">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="kapi-section-label">{language === 'id' ? 'Delivery approach' : 'Delivery approach'}</span>
              <h2 id="delivery-title" className="mt-3 text-3xl font-display font-semibold leading-[1.03] tracking-[-0.05em] sm:text-4xl">
                {language === 'id' ? 'Konteksnya berbeda. Flow delivery tetap jelas.' : 'Different context. Clear delivery flow.'}
              </h2>
            </div>
            <Link to="/services" className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-[#A8AEB7] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70">
              {language === 'id' ? 'Lihat semua services' : 'Explore services'}
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {deliverySteps.map((item) => (
              <article key={item.step} className="rounded-[1.5rem] border border-white/[0.08] bg-white/[0.018] p-5 sm:p-6">
                <span className="font-mono text-[9px] tabular-nums tracking-[0.15em] text-brand-red">{item.step}</span>
                <h3 className="mt-6 text-xl font-display font-semibold tracking-[-0.03em]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#78818D]">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-14 sm:py-18 lg:py-24" aria-labelledby="directory-title">
          <div className="grid gap-10 lg:grid-cols-[0.68fr_1.32fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <span className="kapi-section-label">{language === 'id' ? 'Industry directory' : 'Industry directory'}</span>
              <h2
                id="directory-title"
                className="mt-3 max-w-xl text-3xl font-display font-semibold leading-[1.02] tracking-[-0.05em] sm:text-4xl lg:text-[3.25rem]"
              >
                {language === 'id' ? 'Semua konteks industri, dalam satu tempat.' : 'Every industry context, in one place.'}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-[#7E8793]">
                {language === 'id'
                  ? 'Gunakan directory ini ketika Anda sudah tahu industrinya dan ingin langsung melihat pekerjaan yang paling relevan.'
                  : 'Use this directory when you already know your industry and want to get straight to the most relevant work.'}
              </p>

              <div className="mt-7 rounded-2xl border border-white/[0.08] bg-white/[0.018] p-4 sm:p-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <span className="block text-[9px] font-mono uppercase tracking-[0.14em] text-[#5E6672]">
                      {language === 'id' ? 'Results' : 'Results'}
                    </span>
                    <span className="mt-1 block text-2xl font-display font-semibold tracking-[-0.04em]">{filteredIndustryEntries.length}</span>
                  </div>
                  <span className="text-right text-[9px] font-mono uppercase leading-4 tracking-[0.1em] text-[#5E6672]">
                    {language === 'id' ? 'industry contexts' : 'industry contexts'}
                  </span>
                </div>

                <div className="mt-4 flex h-px bg-white/[0.07]" aria-hidden="true" />
                <p className="mt-4 text-xs leading-6 text-[#646D79]">
                  {normalizedQuery
                    ? language === 'id'
                      ? 'Hasil disaring berdasarkan industry, client, service, dan project.'
                      : 'Results are matched across industry, client, service, and project.'
                    : language === 'id'
                      ? 'Setiap item membawa Anda langsung ke halaman industry dan project yang relevan.'
                      : 'Each item takes you directly to the relevant industry and project context.'}
                </p>
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex flex-col gap-4 border-b border-white/[0.08] pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-h-12 w-full max-w-xl items-center gap-3 rounded-2xl border border-white/[0.09] bg-[#101216] px-4 transition-[border-color,background-color,box-shadow] duration-200 focus-within:border-white/[0.18] focus-within:bg-[#121419] focus-within:shadow-[0_12px_36px_rgba(0,0,0,0.16)]">
                  <Search size={16} className="shrink-0 text-[#69717D]" aria-hidden="true" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    type="search"
                    placeholder={language === 'id' ? 'Cari industry, client, service...' : 'Search industry, client, service...'}
                    aria-label={language === 'id' ? 'Cari industry' : 'Search industry'}
                    className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#5F6773]"
                  />
                  {query ? (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      aria-label={language === 'id' ? 'Hapus pencarian' : 'Clear search'}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#69717D] transition-colors hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
                    >
                      <X size={14} aria-hidden="true" />
                    </button>
                  ) : null}
                </div>

                <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#535C68]">
                  {filteredIndustryEntries.length} / {industryEntries.length}
                </span>
              </div>

              <div className="divide-y divide-white/[0.08] border-b border-white/[0.08]">
                {filteredIndustryEntries.map((entry, index) => {
                  const representativeProject = entry.projects[0];

                  return (
                    <Link
                      key={entry.industry}
                      to={'/industries/' + industrySlug(entry.industry)}
                      className="group block py-5 sm:py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-inset"
                    >
                      <div className="grid items-center gap-5 md:grid-cols-[34px_minmax(180px,0.95fr)_minmax(220px,1.15fr)_auto]">
                        <span className="self-start pt-1 text-[9px] font-mono tabular-nums tracking-[0.14em] text-[#4F5762]">
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <div className="min-w-0">
                          <div className="flex items-start gap-3">
                            <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.018] text-[10px] font-mono text-[#737C87] transition-[border-color,background-color,color] duration-200 group-hover:border-brand-red/25 group-hover:bg-brand-red/[0.06] group-hover:text-brand-red">
                              {entry.projects.length}
                            </span>
                            <div className="min-w-0">
                              <h3 className="text-[17px] font-display font-semibold leading-tight tracking-[-0.025em] text-white transition-colors duration-200 group-hover:text-white sm:text-[19px]">
                                {entry.industry}
                              </h3>
                              <p className="mt-1 text-[9px] font-mono uppercase tracking-[0.1em] text-[#59616D]">
                                {entry.projects.length === 1 ? '1 case' : entry.projects.length + ' cases'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex min-w-0 items-center gap-3">
                          <div className="relative hidden h-12 w-[72px] shrink-0 overflow-hidden rounded-xl border border-white/[0.08] bg-[#14161A] sm:block">
                            {representativeProject?.image ? (
                              <>
                                <img
                                  src={representativeProject.image}
                                  alt=""
                                  className="absolute inset-0 h-full w-full object-cover opacity-65 transition-[opacity,transform] duration-500 group-hover:scale-[1.04] group-hover:opacity-85"
                                  loading="lazy"
                                  decoding="async"
                                />
                                <span className="absolute inset-0 bg-[#0B0C0E]/25" aria-hidden="true" />
                              </>
                            ) : null}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-[#B7BDC6]">
                              {representativeProject?.title ?? (language === 'id' ? 'Lihat pekerjaan' : 'View work')}
                            </p>
                            <p className="mt-1 truncate text-[9px] font-mono uppercase tracking-[0.09em] text-[#5E6672]">
                              {entry.services.slice(0, 2).join(' · ')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                          <span className="hidden text-[9px] font-mono uppercase tracking-[0.11em] text-[#5E6672] transition-colors duration-200 group-hover:text-brand-red lg:inline">
                            {language === 'id' ? 'Explore' : 'Explore'}
                          </span>
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.018] text-[#65707C] transition-[transform,border-color,background-color,color] duration-200 group-hover:-translate-y-0.5 group-hover:border-brand-red/30 group-hover:bg-brand-red/[0.08] group-hover:text-brand-red">
                            <ArrowUpRight size={15} aria-hidden="true" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {filteredIndustryEntries.length === 0 ? (
                <div className="rounded-b-2xl border-x border-b border-white/[0.08] bg-white/[0.018] px-6 py-12 text-center">
                  <p className="font-display text-xl font-semibold">
                    {language === 'id' ? 'Tidak ada konteks yang cocok.' : 'No matching industry context.'}
                  </p>
                  <p className="mt-2 text-sm text-[#747D88]">
                    {language === 'id'
                      ? 'Coba nama industry, client, service, atau project yang berbeda.'
                      : 'Try a different industry, client, service, or project name.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-full border border-white/[0.09] px-4 text-xs font-semibold text-[#C7CCD4] transition-colors hover:border-white/[0.16] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
                  >
                    {language === 'id' ? 'Reset pencarian' : 'Reset search'}
                    <X size={13} aria-hidden="true" />
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
