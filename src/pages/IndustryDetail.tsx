import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Layers3,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { allProjects, type ProjectItem } from '../data/projectsData';
import { allSolutionsAndServices } from '../data/servicesData';
import { fetchServerCmsProjects, getCmsProjects } from '../lib/cmsStore';
import { industryBySlug, projectSlug } from '../lib/publicContent';
import { industryCatalog, industryCatalogBySlug, industryCatalogMatches, type IndustryCatalogItem } from '../data/industryCatalog';
import { useLanguage } from '../lib/LanguageContext';
import { cn } from '../lib/utils';
import PublicPageHero from '../components/ui/PublicPageHero';

const deliverySteps = [
  {
    step: '01',
    title: 'Discovery & Planning',
    description: 'Understand the business context, users, workflows, constraints, and the work that needs to move forward.',
  },
  {
    step: '02',
    title: 'Experience Direction',
    description: 'Turn the findings into information architecture, user flows, visual direction, and a clear delivery scope.',
  },
  {
    step: '03',
    title: 'Design & Build',
    description: 'Execute the agreed design or engineering scope with review points that keep business and technical decisions aligned.',
  },
  {
    step: '04',
    title: 'Launch & Support',
    description: 'Prepare handoff, launch, improvements, maintenance, or technical support based on the engagement.',
  },
];

const getResolvedIndustry = (source: ProjectItem[], slug: string): { catalog?: IndustryCatalogItem; legacyIndustry?: string } => {
  const catalog = industryCatalogBySlug(slug);
  if (catalog) return { catalog };
  return { legacyIndustry: industryBySlug(source, slug) };
};

export const IndustryDetail = () => {
  const { slug = '' } = useParams();
  const { language } = useLanguage();
  const [cmsProjects, setCmsProjects] = useState<ProjectItem[]>(() => getCmsProjects());
  const [activeSection, setActiveSection] = useState('industry-approach');

  useEffect(() => {
    void fetchServerCmsProjects().then(() => setCmsProjects(getCmsProjects()));
  }, []);

  useEffect(() => {
    const sectionIds = ['industry-approach', 'industry-work', 'industry-solutions', 'industry-process', 'industry-faq'];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target instanceof HTMLElement) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-18% 0px -62% 0px', threshold: [0.05, 0.2, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const source = useMemo(
    () => (cmsProjects.length ? cmsProjects : allProjects).filter((project) => project.isPublished !== false),
    [cmsProjects],
  );

  const resolved = useMemo(() => getResolvedIndustry(source, slug), [source, slug]);
  const catalog = resolved.catalog;
  const legacyIndustry = resolved.legacyIndustry;

  const activeProjects = useMemo(() => {
    if (catalog) return source.filter((project) => industryCatalogMatches(catalog, project.industry));
    if (legacyIndustry) return source.filter((project) => project.industry === legacyIndustry);
    return [];
  }, [catalog, legacyIndustry, source]);

  const industryNames = useMemo(
    () => Array.from(new Set(activeProjects.map((project) => project.industry))).sort((a, b) => a.localeCompare(b)),
    [activeProjects],
  );

  const services = useMemo(
    () => Array.from(new Set(activeProjects.map((project) => project.service).filter(Boolean))),
    [activeProjects],
  );

  const featuredProject = activeProjects.find((project) => project.featured) ?? activeProjects[0];
  const supportingProjects = activeProjects.filter((project) => project.id !== featuredProject?.id).slice(0, 4);

  const currentLabel = catalog?.label ?? legacyIndustry ?? 'Industry';
  const visibleCatalog = catalog
    ? catalog.relatedSlugs
        .map((relatedSlug) => industryCatalogBySlug(relatedSlug))
        .filter((item): item is IndustryCatalogItem => Boolean(item))
    : industryCatalog.slice(0, 4);

  if (!catalog && !legacyIndustry) {
    return (
      <main className="kapi-utility-page min-h-screen bg-[#0B0C0E] px-5 pt-32 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">Industry</p>
          <h1 className="mt-3 text-4xl font-display font-semibold tracking-[-0.04em] sm:text-5xl">Industry not found.</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#7E8793]">
            {language === 'id'
              ? 'Pilih konteks industri lain dari menu Industries di navigasi.'
              : 'Choose another industry context from the Industries menu in the navigation.'}
          </p>
        </div>
      </main>
    );
  }

  const heroTitle = catalog
    ? catalog.title
    : language === 'id'
      ? 'Kapitech untuk ' + currentLabel
      : 'Kapitech for ' + currentLabel;

  const heroDescription = catalog?.description ??
    (language === 'id'
      ? 'Kami menyatukan design, development, dan technical delivery untuk kebutuhan digital di ' + currentLabel + '.'
      : 'We combine design, development, and technical delivery around digital needs in ' + currentLabel + '.');

  const capabilities = catalog?.capabilities ?? services.slice(0, 5);
  const solutionTypes = catalog?.solutionTypes ?? [
    { title: 'Industry-focused websites', description: 'Web experiences shaped around the business context, audience, and intended action.' },
    { title: 'Product and application interfaces', description: 'Usable product flows with clear states, roles, and responsive behaviour.' },
    { title: 'Operational and business systems', description: 'Structured workflows for teams that need reliable information and repeatable actions.' },
    { title: 'Digital improvement and redesign', description: 'Targeted improvements for existing digital products, websites, and customer journeys.' },
  ];

  const resolvedDeliverySteps = deliverySteps.map((step, index) => ({
    ...step,
    description: catalog?.deliveryFocus?.[index] ?? step.description,
  }));

  const principles = catalog?.principles ?? [
    { title: 'Context before output', description: 'We start from the business problem and user workflow before defining the deliverables.' },
    { title: 'Design connected to delivery', description: 'Experience decisions stay connected to implementation, integration, and operational realities.' },
    { title: 'Built for real use', description: 'Usability, maintainability, responsive behaviour, and handoff are considered from the start.' },
    { title: 'Structured for growth', description: 'Reusable patterns make the experience easier to extend as requirements change.' },
  ];

  const faq = catalog?.faq ?? [
    { question: 'What can Kapitech do for this industry?', answer: 'Kapitech can support design, website, application, and technical delivery depending on the needs of the project.' },
    { question: 'Can Kapitech work with an existing product?', answer: 'Yes. We can start from an audit, redesign, improvement, or defined feature scope rather than requiring a new build.' },
    { question: 'Can design and development be handled together?', answer: 'Yes. The engagement can combine product design, web development, applications, integrations, and technical delivery where appropriate.' },
    { question: 'How is the right scope defined?', answer: 'We use the initial business context, users, workflows, constraints, and desired outcome to determine the most sensible engagement.' },
  ];

  const serviceLinks = services.flatMap((service) => {
    const normalized = service.toLowerCase();
    const matched = allSolutionsAndServices.find((item) => {
      const title = item.title.toLowerCase();
      const slugValue = item.slug.toLowerCase();
      return title === normalized || slugValue === normalized || title.includes(normalized) || normalized.includes(title);
    });
    return matched ? [{ service: matched.title, href: '/services/' + matched.slug }] : [];
  });

  return (
    <main className="kapi-page-bg min-h-screen bg-[#0B0C0E] text-white">
      <PublicPageHero
        eyebrow={currentLabel}
        title={heroTitle}
        description={heroDescription}
      >
        <div className="flex flex-wrap gap-2">
          {catalog?.needs.slice(0, 4).map((item) => (
            <span key={item} className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.09em] text-[#9DA4AF]">
              {item}
            </span>
          ))}
        </div>

        <div className="mt-5 grid gap-px overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-white/[0.08] sm:grid-cols-3">
          {[
            [language === 'id' ? 'Project relevan' : 'Relevant projects', String(activeProjects.length)],
            [language === 'id' ? 'Kapabilitas inti' : 'Core capabilities', String(capabilities.length)],
            [language === 'id' ? 'Tipe engagement' : 'Engagement types', String(solutionTypes.length)],
          ].map(([label, value]) => (
            <div key={label} className="bg-[#0B0C0E]/90 px-4 py-4 sm:px-5">
              <span className="block text-2xl font-display font-semibold tracking-[-0.04em]">{value}</span>
              <span className="mt-1 block text-[8px] font-mono uppercase tracking-[0.1em] text-[#69717D]">{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <Link
            to="/book-a-call"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-red px-5 py-3 text-xs font-semibold text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-brand-red-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
          >
            {language === 'id' ? 'Diskusikan project Anda' : 'Discuss your project'}
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
          <a
            href="#industry-work-title"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.035] px-5 py-3 text-xs font-semibold text-white transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/[0.18] hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
          >
            {language === 'id' ? 'Lihat work relevan' : 'Explore relevant work'}
            <ArrowDown size={14} aria-hidden="true" />
          </a>
        </div>
      </PublicPageHero>

      <nav
        aria-label={language === 'id' ? 'Navigasi halaman industri' : 'Industry page navigation'}
        className="sticky top-[72px] z-30 border-y border-white/[0.07] bg-[#0B0C0E]/88 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0B0C0E]/76 sm:block"
      >
        <div className="mx-auto flex max-w-[1440px] items-center gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] sm:px-6 md:px-10 lg:px-12 [&::-webkit-scrollbar]:hidden">
          <span className="shrink-0 pr-2 text-[8px] font-mono uppercase tracking-[0.14em] text-[#59616D]">
            {language === 'id' ? 'Di halaman ini' : 'On this page'}
          </span>
          {[
            ['industry-approach', language === 'id' ? 'Approach' : 'Approach'],
            ['industry-work', language === 'id' ? 'Work' : 'Work'],
            ['industry-solutions', language === 'id' ? 'Solutions' : 'Solutions'],
            ['industry-process', language === 'id' ? 'Process' : 'Process'],
            ['industry-faq', 'FAQ'],
          ].map(([id, label]) => (
            <a
              key={id}
              href={'#' + id}
              onClick={() => setActiveSection(id)}
              aria-current={activeSection === id ? 'location' : undefined}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-2 text-[9px] font-mono uppercase tracking-[0.1em] text-white transition-[background-color,border-color] duration-200 hover:border-white/[0.16] hover:bg-white/[0.055] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70",
                activeSection === id
                  ? "border-brand-red/35 bg-brand-red/[0.09]"
                  : "border-white/[0.08] bg-white/[0.025]",
              )}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-6 md:px-10 lg:px-12">
        <section id="industry-approach" className="scroll-mt-28 border-b border-white/[0.07] py-14 sm:py-18 lg:py-24" aria-labelledby="industry-approach-title">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <span className="kapi-section-label">{language === 'id' ? 'What Kapitech brings' : 'What Kapitech brings'}</span>
              <h2 id="industry-approach-title" className="mt-3 max-w-xl text-3xl font-display font-semibold leading-[1.02] tracking-[-0.05em] sm:text-4xl lg:text-[3.2rem]">
                {language === 'id'
                  ? 'Bukan sekadar mengenal konteks industrinya. Kami menerjemahkannya menjadi keputusan digital.'
                  : 'We do more than know the industry context. We turn it into better digital decisions.'}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-[#7E8793]">
                {language === 'id'
                  ? 'Dari experience sampai technical delivery, scope disusun berdasarkan problem yang harus diselesaikan.'
                  : 'From experience to technical delivery, the scope is shaped around the problem that needs to be solved.'}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {principles.map((item, index) => (
                <article key={item.title} className="rounded-[1.5rem] border border-white/[0.08] bg-[#101216] p-6 sm:p-7">
                  <span className="font-mono text-[9px] tabular-nums tracking-[0.15em] text-brand-red">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="mt-6 text-xl font-display font-semibold leading-tight tracking-[-0.03em]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#78818D]">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.07] py-14 sm:py-18 lg:py-24" aria-labelledby="industry-work-title">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="kapi-section-label">{language === 'id' ? 'Relevant work' : 'Relevant work'}</span>
              <h2 id="industry-work-title" className="mt-3 text-3xl font-display font-semibold leading-[1.02] tracking-[-0.05em] sm:text-4xl lg:text-[3.2rem]">
                {language === 'id' ? 'Lihat bukti pekerjaan yang paling dekat dengan konteks ini.' : 'See the work closest to this context.'}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#7E8793]">
                {language === 'id'
                  ? 'Kami menampilkan project publik yang membentuk konteks halaman ini, tanpa menambahkan angka hasil yang tidak terverifikasi.'
                  : 'We show the public projects that inform this page without adding unverified performance claims.'}
              </p>
            </div>
            <Link
              to="/work"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-white transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/[0.17] hover:bg-white/[0.055] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
            >
              {language === 'id' ? 'Lihat seluruh work' : 'View all work'}
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>

          {featuredProject ? (
            <div className="mt-9 grid gap-4 lg:grid-cols-[1.18fr_0.82fr]">
              <Link
                to={'/work/' + projectSlug(featuredProject)}
                className="group relative min-h-[430px] overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#14161A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 sm:min-h-[560px]"
              >
                <img
                  src={featuredProject.image}
                  alt={featuredProject.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090A0C] via-[#090A0C]/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-2 text-[8px] font-mono uppercase tracking-[0.12em] text-white/70">
                    <span>{featuredProject.client}</span>
                    <span className="text-white/25">/</span>
                    <span>{featuredProject.service}</span>
                    <span className="text-white/25">/</span>
                    <span>{featuredProject.year}</span>
                  </div>
                  <h3 className="mt-2 max-w-3xl text-2xl font-display font-semibold tracking-[-0.04em] sm:text-4xl">{featuredProject.title}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/72">{language === 'id' ? featuredProject.descId : featuredProject.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-black/20 px-3.5 py-2 text-[9px] font-mono uppercase tracking-[0.11em] text-white backdrop-blur-sm">
                    {language === 'id' ? 'Buka case study' : 'Open case study'}
                    <ArrowUpRight size={12} aria-hidden="true" />
                  </span>
                </div>
              </Link>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {supportingProjects.map((project) => (
                  <Link
                    key={project.id}
                    to={'/work/' + projectSlug(project)}
                    className="group grid min-h-[164px] grid-cols-[120px_minmax(0,1fr)] overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[#101216] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
                  >
                    <div className="relative overflow-hidden bg-[#15171B]">
                      <img src={project.image} alt={project.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" loading="lazy" decoding="async" />
                    </div>
                    <div className="flex min-w-0 flex-col justify-between p-4 sm:p-5">
                      <div>
                        <span className="text-[8px] font-mono uppercase tracking-[0.11em] text-brand-red">{project.service}</span>
                        <h3 className="mt-2 line-clamp-2 text-base font-display font-semibold tracking-[-0.025em]">{project.title}</h3>
                        <p className="mt-1 text-xs text-[#65707C]">{project.client}</p>
                      </div>
                      <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.1em] text-white group-hover:bg-white/[0.055]">
                        {language === 'id' ? 'Buka case' : 'Open case'} <ArrowUpRight size={12} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-9 rounded-[2rem] border border-dashed border-white/[0.1] bg-white/[0.018] px-6 py-12 text-center">
              <p className="text-xl font-display font-semibold">{language === 'id' ? 'Belum ada public work yang dipetakan di konteks ini.' : 'No public work is currently mapped to this context.'}</p>
            </div>
          )}
        </section>

        <section className="border-b border-white/[0.07] py-14 sm:py-18 lg:py-24" aria-labelledby="industry-solutions-title">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <span className="kapi-section-label">{language === 'id' ? 'What we can build' : 'What we can build'}</span>
              <h2 id="industry-solutions-title" className="mt-3 text-3xl font-display font-semibold leading-[1.02] tracking-[-0.05em] sm:text-4xl lg:text-[3rem]">
                {language === 'id' ? 'Bentuk pekerjaan yang paling relevan.' : 'The work we can shape around this context.'}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-[#7E8793]">
                {language === 'id'
                  ? 'Kami tidak menjual paket industri. Beberapa bentuk engagement yang paling masuk akal untuk konteks ini antara lain:'
                  : 'We do not sell industry packages. Some of the most relevant engagement types for this context include:'}
              </p>
            </div>

            <div>
              <p className="mb-3 text-[9px] font-mono uppercase tracking-[0.14em] text-[#59616D]">
                {language === 'id' ? 'Kapabilitas yang bisa dibawa' : 'Capabilities we can bring'}
              </p>
              <div className="mb-7 flex flex-wrap gap-2">
                {capabilities.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/[0.08] bg-white/[0.018] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.09em] text-[#737D89]"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
              {solutionTypes.map((item, index) => (
                <article key={item.title} className="group rounded-[1.5rem] border border-white/[0.08] bg-white/[0.018] p-6 transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/[0.15] hover:bg-white/[0.03] sm:p-7">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-[#8D96A2] transition-colors duration-200 group-hover:border-white/[0.14] group-hover:text-white">
                    {index === 0 ? <Sparkles size={15} /> : index === 1 ? <Workflow size={15} /> : index === 2 ? <Layers3 size={15} /> : <ShieldCheck size={15} />}
                  </span>
                  <h3 className="mt-5 text-xl font-display font-semibold tracking-[-0.03em]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#78818D]">{item.description}</p>
                </article>
              ))}
            </div>

            <div className="lg:col-start-2 mt-7 flex flex-wrap items-center gap-2">
              {serviceLinks.slice(0, 6).map(({ service, href }) => (
                <Link
                  key={service}
                  to={href}
                  className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.025] px-3.5 py-2 text-[9px] font-mono uppercase tracking-[0.09em] text-white transition-[background-color,border-color] duration-200 hover:border-white/[0.17] hover:bg-white/[0.055] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
                >
                  {service}
                  <ArrowUpRight size={11} aria-hidden="true" />
                </Link>
              ))}
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full border border-brand-red/25 bg-brand-red/[0.06] px-3.5 py-2 text-[9px] font-semibold font-mono uppercase tracking-[0.09em] text-white transition-[background-color,border-color] duration-200 hover:border-brand-red/45 hover:bg-brand-red/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
              >
                {language === 'id' ? 'Lihat semua layanan' : 'Explore all services'}
                <ArrowRight size={11} aria-hidden="true" />
              </Link>
            </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.07] py-14 sm:py-18 lg:py-24" aria-labelledby="industry-process-title">
          <div className="max-w-3xl">
            <span className="kapi-section-label">{language === 'id' ? 'How we work' : 'How we work'}</span>
            <h2 id="industry-process-title" className="mt-3 text-3xl font-display font-semibold leading-[1.02] tracking-[-0.05em] sm:text-4xl lg:text-[3rem]">
              {language === 'id' ? 'Prosesnya jelas. Scope-nya disesuaikan.' : 'A clear process, adapted to the scope.'}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#7E8793]">
              {language === 'id'
                ? 'Industry context mengubah pertanyaan yang kami ajukan, tetapi flow delivery tetap transparan.'
                : 'The industry context changes the questions we ask, while the delivery flow stays transparent.'}
            </p>
          </div>

          <div className="mt-9 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {resolvedDeliverySteps.map((item) => (
              <article key={item.step} className="rounded-[1.5rem] border border-white/[0.08] bg-[#101216] p-6 sm:p-7">
                <span className="font-mono text-[9px] tabular-nums tracking-[0.15em] text-brand-red">{item.step}</span>
                <h3 className="mt-6 text-xl font-display font-semibold tracking-[-0.03em]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#78818D]">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-b border-white/[0.07] py-14 sm:py-18 lg:py-24" aria-labelledby="industry-faq-title">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <span className="kapi-section-label">FAQ</span>
              <h2 id="industry-faq-title" className="mt-3 text-3xl font-display font-semibold leading-[1.02] tracking-[-0.05em] sm:text-4xl">
                {language === 'id' ? 'Pertanyaan yang biasanya muncul sebelum mulai.' : 'Questions that usually come before the project starts.'}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-[#7E8793]">
                {language === 'id'
                  ? 'Jawaban singkat untuk membantu Anda menilai apakah Kapitech cocok untuk kebutuhan ini.'
                  : 'Straightforward answers to help you decide whether Kapitech is a fit for the work.'}
              </p>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[#101216]">
              {faq.map((item, index) => (
                <details key={item.question} className="group border-b border-white/[0.07] last:border-b-0 open:bg-white/[0.018]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 transition-[background-color] duration-200 hover:bg-white/[0.02] sm:px-6 sm:py-6">
                    <span className="flex min-w-0 items-start gap-4">
                      <span className="pt-0.5 text-[9px] font-mono tabular-nums text-[#4F5762]">{String(index + 1).padStart(2, '0')}</span>
                      <span className="text-sm font-semibold leading-6 text-white sm:text-base">{item.question}</span>
                    </span>
                    <ChevronDown size={17} className="shrink-0 text-white transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <div className="grid grid-cols-[28px_minmax(0,1fr)] gap-4 px-5 pb-6 sm:px-6">
                    <span />
                    <p className="text-sm leading-7 text-[#858E9A]">{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="scroll-mt-28 py-14 sm:py-18 lg:py-24" aria-labelledby="other-industries-title">
          <div className="max-w-3xl">
            <span className="kapi-section-label">{language === 'id' ? 'Other industries' : 'Other industries'}</span>
            <h2 id="other-industries-title" className="mt-3 text-3xl font-display font-semibold tracking-[-0.04em] sm:text-4xl">
              {language === 'id' ? 'Pilih konteks berikutnya berdasarkan kebutuhan Anda.' : 'Choose the next context based on what you need.'}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#7E8793]">
              {language === 'id'
                ? 'Pilih konteks lain di bawah, atau gunakan menu Industries di navigasi untuk berpindah langsung ke halaman yang Anda cari.'
                : 'Choose another context below, or use the Industries menu in the navigation to jump directly to the page you need.'}
            </p>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {visibleCatalog.map((item) => (
              <Link
                key={item.slug}
                to={'/industries/' + item.slug}
                className="group rounded-[1.5rem] border border-white/[0.08] bg-white/[0.018] p-5 transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/[0.15] hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
              >
                <span className="text-[9px] font-mono uppercase tracking-[0.13em] text-[#626B76]">{item.eyebrow}</span>
                <h3 className="mt-3 text-lg font-display font-semibold tracking-[-0.025em]">{item.shortLabel}</h3>
                <p className="mt-2 line-clamp-3 text-xs leading-6 text-[#717B87]">{item.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.11em] text-white transition-colors group-hover:border-white/[0.15] group-hover:bg-white/[0.055]">
                  {language === 'id' ? 'Lihat industri' : 'View industry'} <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};
