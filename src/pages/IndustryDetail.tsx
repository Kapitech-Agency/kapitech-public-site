import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
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
import {
  industryCatalog,
  industryCatalogBySlug,
  industryCatalogMatches,
  type IndustryCatalogItem,
} from '../data/industryCatalog';
import { useLanguage } from '../lib/LanguageContext';
import PublicPageHero from '../components/ui/PublicPageHero';

const deliverySteps = [
  {
    step: '01',
    title: 'Discovery & Planning',
    description:
      'Understand the business context, users, workflows, constraints, and the work that needs to move forward.',
  },
  {
    step: '02',
    title: 'Experience Direction',
    description:
      'Turn the findings into information architecture, user flows, visual direction, and a clear delivery scope.',
  },
  {
    step: '03',
    title: 'Design & Build',
    description:
      'Execute the agreed design or engineering scope with review points that keep business and technical decisions aligned.',
  },
  {
    step: '04',
    title: 'Launch & Support',
    description:
      'Prepare handoff, launch, improvements, maintenance, or technical support based on the engagement.',
  },
];

const getResolvedIndustry = (
  source: ProjectItem[],
  slug: string,
): { catalog?: IndustryCatalogItem; legacyIndustry?: string } => {
  const catalog = industryCatalogBySlug(slug);
  if (catalog) return { catalog };
  return { legacyIndustry: industryBySlug(source, slug) };
};

const solutionIcons = [Sparkles, Workflow, Layers3, ShieldCheck];

export const IndustryDetail = () => {
  const { slug = '' } = useParams();
  const { language } = useLanguage();
  const [cmsProjects, setCmsProjects] = useState<ProjectItem[]>(() => getCmsProjects());

  useEffect(() => {
    void fetchServerCmsProjects().then(() => setCmsProjects(getCmsProjects()));
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

  const services = useMemo(
    () => Array.from(new Set(activeProjects.map((project) => project.service).filter(Boolean))),
    [activeProjects],
  );

  const featuredProject = activeProjects.find((project) => project.featured) ?? activeProjects[0];
  const supportingProjects = activeProjects.filter((project) => project.id !== featuredProject?.id).slice(0, 4);

  const currentLabel = catalog?.label ?? legacyIndustry ?? 'Industry';
  const consultationHref = '/book-a-call?industry=' + encodeURIComponent(currentLabel);

  const visibleCatalog = catalog
    ? catalog.relatedSlugs
        .map((relatedSlug) => industryCatalogBySlug(relatedSlug))
        .filter((item): item is IndustryCatalogItem => Boolean(item))
    : industryCatalog.slice(0, 4);

  const capabilities = catalog?.capabilities ?? services.slice(0, 5);

  const solutionTypes = catalog?.solutionTypes ?? [
    {
      title: 'Industry-focused websites',
      description: 'Web experiences shaped around the business context, audience, and intended action.',
    },
    {
      title: 'Product and application interfaces',
      description: 'Usable product flows with clear states, roles, and responsive behaviour.',
    },
    {
      title: 'Operational and business systems',
      description: 'Structured workflows for teams that need reliable information and repeatable actions.',
    },
    {
      title: 'Digital improvement and redesign',
      description: 'Targeted improvements for existing digital products, websites, and customer journeys.',
    },
  ];

  const resolvedDeliverySteps = deliverySteps.map((step, index) => ({
    ...step,
    description: catalog?.deliveryFocus?.[index] ?? step.description,
  }));

  const principles = catalog?.principles ?? [
    {
      title: 'Context before output',
      description: 'We start from the business problem and user workflow before defining the deliverables.',
    },
    {
      title: 'Design connected to delivery',
      description: 'Experience decisions stay connected to implementation, integration, and operational realities.',
    },
    {
      title: 'Built for real use',
      description: 'Usability, maintainability, responsive behaviour, and handoff are considered from the start.',
    },
    {
      title: 'Structured for growth',
      description: 'Reusable patterns make the experience easier to extend as requirements change.',
    },
  ];

  const faq = catalog?.faq ?? [
    {
      question: 'What can Kapitech do for this industry?',
      answer:
        'Kapitech can support design, website, application, and technical delivery depending on the needs of the project.',
    },
    {
      question: 'Can Kapitech work with an existing product?',
      answer:
        'Yes. We can start from an audit, redesign, improvement, or defined feature scope rather than requiring a new build.',
    },
    {
      question: 'Can design and development be handled together?',
      answer:
        'Yes. The engagement can combine product design, website development, applications, integrations, and technical delivery where appropriate.',
    },
    {
      question: 'How is the right scope defined?',
      answer:
        'We use the initial business context, users, workflows, constraints, and desired outcome to determine the most sensible engagement.',
    },
  ];

  const serviceLinks = services.flatMap((service) => {
    const normalized = service.toLowerCase();
    const matched = allSolutionsAndServices.find((item) => {
      const title = item.title.toLowerCase();
      const slugValue = item.slug.toLowerCase();
      return (
        title === normalized ||
        slugValue === normalized ||
        title.includes(normalized) ||
        normalized.includes(title)
      );
    });

    return matched ? [{ service: matched.title, href: '/services/' + matched.slug }] : [];
  });

  if (!catalog && !legacyIndustry) {
    return (
      <main className="min-h-screen bg-[#0B0C0E] px-5 pt-32 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">Industry</p>
          <h1 className="mt-3 text-4xl font-display font-semibold tracking-[-0.04em] sm:text-5xl">
            Industry not found.
          </h1>
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

  const heroDescription =
    catalog?.description ??
    (language === 'id'
      ? 'Kami menyatukan design, development, dan technical delivery untuk kebutuhan digital di ' +
        currentLabel +
        '.'
      : 'We combine design, development, and technical delivery around digital needs in ' + currentLabel + '.');

  return (
    <main className="kapi-page-bg min-h-screen bg-[#0B0C0E] text-white selection:bg-brand-red selection:text-white">
      <PublicPageHero
        eyebrow={currentLabel}
        title={heroTitle}
        description={heroDescription}
      >
        <div>
          <p className="mb-2 text-[8px] font-mono uppercase tracking-[0.14em] text-[#59616D]">
            {language === 'id' ? 'Typical project needs' : 'Typical project needs'}
          </p>
          <div className="flex flex-wrap gap-2">
            {catalog?.needs.slice(0, 4).map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.09em] text-white"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <Link
            to={consultationHref}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-red px-5 py-3 text-xs font-semibold text-white shadow-[0_12px_28px_-18px_rgba(229,9,20,0.8)] transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-brand-red-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
          >
            {language === 'id' ? 'Diskusikan project Anda' : 'Discuss your project'}
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
          <a
            href="#industry-work"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.035] px-5 py-3 text-xs font-semibold text-white transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/[0.18] hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
          >
            {language === 'id' ? 'Lihat work relevan' : 'Explore relevant work'}
            <ArrowDown size={14} aria-hidden="true" />
          </a>
        </div>
        <div className="mt-6 grid max-w-4xl gap-2.5 sm:grid-cols-3">
          {[
            [language === 'id' ? 'Work relevan' : 'Relevant work', String(activeProjects.length)],
            [language === 'id' ? 'Kapabilitas inti' : 'Core capabilities', String(capabilities.length)],
            [language === 'id' ? 'Solusi' : 'Solutions', String(solutionTypes.length)],
          ].map(([label, value]) => (
            <div key={label} className="kapi-surface min-w-0 px-4 py-3.5">
              <span className="block text-[9px] font-mono uppercase tracking-[0.15em] text-[#6F757F]">{label}</span>
              <span className="mt-1.5 block text-lg font-display font-semibold leading-none tracking-[-0.04em] text-white">{value}</span>
            </div>
          ))}
        </div>
      </PublicPageHero>



      <div className="mx-auto w-full max-w-7xl px-4 pb-28 sm:px-6 md:px-12 lg:px-12">
        <section
          id="industry-approach"
          className="scroll-mt-28 border-b border-white/[0.07] py-16 sm:py-20 lg:py-24"
          aria-labelledby="industry-approach-title"
        >
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <span className="kapi-section-label">
                {language === 'id' ? 'Industry lens' : 'Industry lens'}
              </span>
              <h2
                id="industry-approach-title"
                className="mt-3 max-w-xl text-3xl font-display font-semibold leading-[1.01] tracking-[-0.05em] sm:text-4xl lg:text-[3.25rem]"
              >
                {language === 'id'
                  ? 'Kami mulai dari cara bisnis dan penggunanya benar-benar bekerja.'
                  : 'We start from how the business and its users actually work.'}
              </h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-[#7E8793]">
                {language === 'id'
                  ? 'Setiap industri datang dengan pola kerja, ekspektasi, dan tingkat kompleksitas yang berbeda. Itu yang membentuk keputusan digital kami.'
                  : 'Every industry comes with different workflows, expectations, and levels of complexity. That context shapes our digital decisions.'}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {principles.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  transition={{ duration: 0.45, delay: index * 0.04 }}
                  className="group relative overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[#101216] p-6 transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-[#121419] sm:p-7"
                >
                  <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-brand-red/[0.05] blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] tabular-nums tracking-[0.15em] text-brand-red">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-white/15 transition-colors group-hover:bg-brand-red" />
                    </div>
                    <h3 className="mt-9 text-xl font-display font-semibold leading-tight tracking-[-0.03em] text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#78818D]">{item.description}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="industry-work"
          className="scroll-mt-28 border-b border-white/[0.07] py-16 sm:py-20 lg:py-24"
          aria-labelledby="industry-work-title"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="kapi-section-label">{language === 'id' ? 'Proof of work' : 'Proof of work'}</span>
              <h2
                id="industry-work-title"
                className="mt-3 text-3xl font-display font-semibold leading-[1.01] tracking-[-0.05em] sm:text-4xl lg:text-[3.25rem]"
              >
                {language === 'id'
                  ? 'Pekerjaan yang paling dekat dengan konteks ini.'
                  : 'The work closest to this context.'}
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#7E8793]">
                {language === 'id'
                  ? 'Kami menunjukkan project publik yang relevan tanpa mengarang angka hasil atau klaim yang tidak tersedia.'
                  : 'We show public projects that are relevant without inventing performance numbers or unverified claims.'}
              </p>
            </div>

            <Link
              to="/work"
              className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-white transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/[0.17] hover:bg-white/[0.055] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
            >
              {language === 'id' ? 'Lihat semua work' : 'View all work'}
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>

          {featuredProject ? (
            <div className="mt-9 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <Link
                to={'/work/' + projectSlug(featuredProject)}
                className="group relative isolate min-h-[480px] overflow-hidden rounded-[2rem] border border-white/[0.1] bg-[#121419] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 sm:min-h-[580px]"
              >
                <img
                  src={featuredProject.image}
                  alt={featuredProject.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08090B] via-[#08090B]/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-9">
                  <div className="flex flex-wrap items-center gap-2 text-[8px] font-mono uppercase tracking-[0.12em] text-white/72">
                    <span>{featuredProject.client}</span>
                    <span className="text-white/25">/</span>
                    <span>{featuredProject.service}</span>
                    <span className="text-white/25">/</span>
                    <span>{featuredProject.year}</span>
                  </div>
                  <h3 className="mt-2 max-w-3xl text-3xl font-display font-semibold tracking-[-0.045em] sm:text-4xl">
                    {featuredProject.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75">
                    {language === 'id' ? featuredProject.descId : featuredProject.desc}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-black/20 px-3.5 py-2 text-[9px] font-mono uppercase tracking-[0.11em] text-white backdrop-blur-md">
                    {language === 'id' ? 'Buka case study' : 'Open case study'}
                    <ArrowUpRight size={12} aria-hidden="true" />
                  </span>
                </div>
              </Link>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {supportingProjects.map((project) => (
                  <Link
                    key={project.id}
                    to={'/work/' + projectSlug(project)}
                    className="group grid min-h-[170px] grid-cols-[112px_minmax(0,1fr)] overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[#101216] transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-[#121419] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
                  >
                    <div className="relative overflow-hidden bg-[#15171B]">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.045]"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="flex min-w-0 flex-col justify-between p-4 sm:p-5">
                      <div>
                        <span className="text-[8px] font-mono uppercase tracking-[0.11em] text-brand-red">
                          {project.service}
                        </span>
                        <h3 className="mt-2 line-clamp-2 text-base font-display font-semibold leading-5 tracking-[-0.025em]">
                          {project.title}
                        </h3>
                        <p className="mt-1 text-xs text-[#66707C]">{project.client}</p>
                      </div>
                      <span className="mt-3 inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.1em] text-white transition-colors group-hover:bg-white/[0.055]">
                        {language === 'id' ? 'Buka case' : 'Open case'}
                        <ArrowUpRight size={12} aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-9 rounded-[2rem] border border-dashed border-white/[0.1] bg-white/[0.018] px-6 py-14 text-center">
              <p className="text-xl font-display font-semibold">
                {language === 'id'
                  ? 'Belum ada public work yang dipetakan di konteks ini.'
                  : 'No public work is currently mapped to this context.'}
              </p>
            </div>
          )}
        </section>

        <section
          id="industry-solutions"
          className="border-b border-white/[0.07] py-16 sm:py-20 lg:py-24"
          aria-labelledby="industry-solutions-title"
        >
          <div className="mb-9 max-w-3xl">
            <span className="kapi-section-label">
              {language === 'id' ? 'Bentuk bantuan' : 'Ways we can help'}
            </span>
            <h2
              id="industry-solutions-title"
              className="mt-4 text-2xl font-display font-semibold leading-[1.03] tracking-[-0.045em] text-white sm:text-3xl lg:text-[2.8rem]"
            >
              {language === 'id'
                ? 'Pilih bentuk engagement yang paling dekat dengan kebutuhan Anda.'
                : 'Choose the engagement shape that best matches your next move.'}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#8A909D] sm:text-[15px]">
              {language === 'id'
                ? 'Scope tetap fleksibel. Yang kami tunjukkan di sini adalah bentuk pekerjaan yang paling relevan dengan konteks industri ini.'
                : 'Scope stays flexible. These are the work shapes most relevant to this industry context.'}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {solutionTypes.map((item, index) => {
              const Icon = solutionIcons[index % solutionIcons.length];
              return (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className="kapi-surface kapi-surface-interactive group relative overflow-hidden p-6 sm:p-7"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.018] text-[#A7ACB5] transition-[background-color,border-color,color] duration-300 group-hover:border-brand-red/25 group-hover:bg-brand-red/[0.07] group-hover:text-white">
                      <Icon size={17} strokeWidth={1.8} />
                    </div>
                    <span className="font-mono text-[9px] tabular-nums tracking-[0.16em] text-[#555A63]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-display font-semibold tracking-[-0.03em] text-white sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-[#8A909D]">
                    {item.description}
                  </p>
                </motion.article>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            {capabilities.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/[0.08] bg-white/[0.018] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.09em] text-[#A7ACB5]"
              >
                {item}
              </span>
            ))}
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.02] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-white transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-white/[0.045]"
            >
              {language === 'id' ? 'Lihat semua layanan' : 'Explore all services'}
              <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section
          id="industry-process"
          className="border-b border-white/[0.07] py-16 sm:py-20 lg:py-24"
          aria-labelledby="industry-process-title"
        >
          <div className="mb-9 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <div className="max-w-3xl">
              <span className="kapi-section-label">
                {language === 'id' ? 'Cara kerja' : 'How we work'}
              </span>
              <h2
                id="industry-process-title"
                className="mt-4 text-2xl font-display font-semibold leading-[1.03] tracking-[-0.045em] text-white sm:text-3xl lg:text-[2.8rem]"
              >
                {language === 'id'
                  ? 'Alurnya jelas. Fokus delivery menyesuaikan konteks.'
                  : 'A clear delivery path, adapted to the context.'}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#8A909D] lg:pb-1">
              {language === 'id'
                ? 'Setiap fase punya tujuan yang jelas agar keputusan, review, dan handoff tetap mudah diikuti.'
                : 'Each phase has a clear purpose so decisions, reviews, and handoff stay easy to follow.'}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {resolvedDeliverySteps.map((item) => (
              <motion.article
                key={item.step}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.45 }}
                className="kapi-surface kapi-surface-interactive flex min-h-[260px] flex-col justify-between p-6 sm:p-7"
              >
                <div>
                  <span className="text-3xl font-display font-light tracking-[-0.05em] text-brand-red/75">
                    {item.step}
                  </span>
                  <h3 className="mt-5 text-base font-display font-semibold tracking-[-0.025em] text-white sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#8A909D]">{item.description}</p>
                </div>
                <div className="mt-6 border-t border-white/[0.07] pt-4 text-[9px] font-mono uppercase tracking-[0.14em] text-[#555A63]">
                  {language === 'id' ? 'Tahap delivery' : 'Delivery phase'}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section
          id="industry-faq"
          className="border-b border-white/[0.07] py-16 sm:py-20 lg:py-24"
          aria-labelledby="industry-faq-title"
        >
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <span className="kapi-section-label">
                {language === 'id' ? 'Pertanyaan umum' : 'Frequently asked'}
              </span>
              <h2
                id="industry-faq-title"
                className="mt-4 text-2xl font-display font-semibold leading-[1.03] tracking-[-0.045em] text-white sm:text-3xl lg:text-4xl"
              >
                {language === 'id'
                  ? 'Hal yang biasanya perlu dijawab sebelum mulai.'
                  : 'The questions that usually come before the work starts.'}
              </h2>
            </div>

            <div className="space-y-3">
              {faq.map((item, index) => (
                <details
                  key={item.question}
                  className="kapi-surface overflow-hidden group open:border-white/[0.14]"
                >
                  <summary className="flex min-h-[68px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-left sm:px-6">
                    <span className="flex min-w-0 items-start gap-4">
                      <span className="pt-0.5 text-[9px] font-mono tabular-nums tracking-[0.13em] text-[#555A63]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm font-semibold leading-6 text-white sm:text-base">
                        {item.question}
                      </span>
                    </span>
                    <ChevronDown size={17} className="shrink-0 text-[#8A909D] transition-transform duration-200 group-open:rotate-180 group-open:text-white" />
                  </summary>
                  <div className="border-t border-white/[0.07] px-5 pb-6 pt-4 sm:px-6">
                    <p className="pl-0 text-sm leading-7 text-[#8A909D] sm:pl-10">{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24" aria-labelledby="other-industries-title">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="kapi-section-label">
                {language === 'id' ? 'Related contexts' : 'Related contexts'}
              </span>
              <h2
                id="other-industries-title"
                className="mt-3 text-3xl font-display font-semibold tracking-[-0.045em] sm:text-4xl lg:text-[3rem]"
              >
                {language === 'id'
                  ? 'Pilih konteks berikutnya berdasarkan kebutuhan Anda.'
                  : 'Choose the next context based on what you need.'}
              </h2>
            </div>
            <span className="text-[9px] font-mono uppercase tracking-[0.14em] text-[#59616D]">
              {visibleCatalog.length} {language === 'id' ? 'related contexts' : 'related contexts'}
            </span>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {visibleCatalog.map((item, index) => (
              <Link
                key={item.slug}
                to={'/industries/' + item.slug}
                className="kapi-surface kapi-surface-interactive group relative overflow-hidden p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-mono uppercase tracking-[0.13em] text-[#626B76]">
                    {item.eyebrow}
                  </span>
                  <span className="text-[8px] font-mono tabular-nums text-[#59616D]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-display font-semibold tracking-[-0.025em]">{item.shortLabel}</h3>
                <p className="mt-2 line-clamp-3 text-xs leading-6 text-[#717B87]">{item.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.11em] text-white transition-[background-color,border-color] group-hover:border-white/[0.15] group-hover:bg-white/[0.055]">
                  {language === 'id' ? 'Lihat industri' : 'View industry'}
                  <ArrowRight size={12} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default IndustryDetail;
