import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
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
import { cn } from '../lib/utils';
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

const sectionLinks = [
  ['industry-approach', 'Approach'],
  ['industry-work', 'Work'],
  ['industry-solutions', 'Solutions'],
  ['industry-process', 'Process'],
  ['industry-faq', 'FAQ'],
] as const;

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
  const [activeSection, setActiveSection] = useState('industry-approach');
  const [navbarHeight, setNavbarHeight] = useState(80);
  const [sectionNavHeight, setSectionNavHeight] = useState(54);
  const sectionNavRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    void fetchServerCmsProjects().then(() => setCmsProjects(getCmsProjects()));
  }, []);

  useEffect(() => {
    const navbar = document.querySelector<HTMLElement>('.kapi-public-navbar');
    const sectionNav = sectionNavRef.current;

    if (!navbar || !sectionNav) return;

    const measure = () => {
      setNavbarHeight(Math.ceil(navbar.getBoundingClientRect().height));
      setSectionNavHeight(Math.ceil(sectionNav.getBoundingClientRect().height));
    };

    measure();

    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    observer?.observe(navbar);
    observer?.observe(sectionNav);

    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  useEffect(() => {
    const sectionIds = sectionLinks.map(([id]) => id);
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!sections.length) return;

    const markerOffset = navbarHeight + sectionNavHeight + 18;
    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ''));

    if (sectionIds.includes(hash)) {
      setActiveSection(hash);
    }

    let frame = 0;

    const syncActiveSection = () => {
      frame = 0;
      const marker = window.scrollY + markerOffset;
      let nextActive = sections[0]?.id ?? sectionIds[0];

      for (const section of sections) {
        if (section.offsetTop <= marker) {
          nextActive = section.id;
        } else {
          break;
        }
      }

      setActiveSection((current) => (current === nextActive ? current : nextActive));
    };

    const requestSync = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(syncActiveSection);
    };

    syncActiveSection();
    window.addEventListener('scroll', requestSync, { passive: true });
    window.addEventListener('resize', requestSync);

    return () => {
      window.removeEventListener('scroll', requestSync);
      window.removeEventListener('resize', requestSync);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [navbarHeight, sectionNavHeight]);

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
  const industryIndex = catalog ? Math.max(0, industryCatalog.findIndex((item) => item.slug === catalog.slug)) : 0;
  const industryNumber = String(industryIndex + 1).padStart(2, '0');
  const industryTotal = String(industryCatalog.length).padStart(2, '0');
  const consultationHref = '/book-a-call?industry=' + encodeURIComponent(currentLabel);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;

    setActiveSection(id);
    const offset = navbarHeight + sectionNavHeight + 12;
    const top = Math.max(0, section.getBoundingClientRect().top + window.scrollY - offset);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.history.replaceState(null, '', '#' + id);
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

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
        aside={
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.1] bg-[#0F1013]/92 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] backdrop-blur-xl sm:p-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_0%,rgba(229,9,20,0.15),transparent_34%)]" aria-hidden="true" />
            <div className="relative">
              <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] pb-4">
                <span className="text-[8px] font-mono uppercase tracking-[0.16em] text-[#626A76]">
                  {language === 'id' ? 'Industry signal' : 'Industry signal'}
                </span>
                <span className="tabular-nums text-[8px] font-mono uppercase tracking-[0.14em] text-[#626A76]">
                  {industryNumber} / {industryTotal}
                </span>
              </div>

              <div className="mt-6 flex items-end justify-between gap-5">
                <div className="min-w-0">
                  <span className="block max-w-[18rem] truncate text-2xl font-display font-semibold leading-none tracking-[-0.045em] text-white sm:text-3xl">
                    {catalog?.shortLabel ?? currentLabel}
                  </span>
                  <span className="mt-2 block text-[9px] font-mono uppercase tracking-[0.13em] text-brand-red">
                    {catalog?.eyebrow ?? currentLabel}
                  </span>
                </div>
                <span className="shrink-0 rounded-full border border-white/[0.08] bg-white/[0.025] px-2.5 py-1.5 text-[8px] font-mono uppercase tracking-[0.11em] text-white">
                  {language === 'id' ? 'Fokus aktif' : 'Active focus'}
                </span>
              </div>

              <div className="mt-7">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[8px] font-mono uppercase tracking-[0.14em] text-[#626A76]">
                    {language === 'id' ? 'Lensa pengambilan keputusan' : 'Decision lens'}
                  </span>
                  <span className="text-[8px] font-mono tabular-nums text-[#4F5762]">
                    {String(Math.min(4, principles.length)).padStart(2, '0')}
                  </span>
                </div>
                <div className="overflow-hidden rounded-2xl border border-white/[0.07]">
                  {principles.slice(0, 4).map((principle, index) => (
                    <div
                      key={principle.title}
                      className="group flex items-center gap-3 border-b border-white/[0.06] px-3.5 py-3 last:border-b-0 transition-colors duration-200 hover:bg-white/[0.025]"
                    >
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-white/[0.07] bg-white/[0.018] text-[7px] font-mono tabular-nums text-[#626A76] transition-colors duration-200 group-hover:border-brand-red/25 group-hover:text-brand-red">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="min-w-0 text-[10px] font-medium leading-5 text-[#B7BDC7]">
                        {principle.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 border-t border-white/[0.07] pt-4">
                {[
                  [activeProjects.length, language === 'id' ? 'Work' : 'Work'],
                  [solutionTypes.length, language === 'id' ? 'Solusi' : 'Solutions'],
                  [capabilities.length, language === 'id' ? 'Kapabilitas' : 'Capabilities'],
                ].map(([value, label]) => (
                  <div key={String(label)} className="border-r border-white/[0.06] px-3.5 first:pl-0 last:border-r-0">
                    <span className="block text-lg font-display font-semibold tracking-[-0.04em] text-white">{value}</span>
                    <span className="mt-1 block text-[8px] font-mono uppercase tracking-[0.12em] text-[#626A76]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
      >
        <div>
          <p className="mb-2 text-[8px] font-mono uppercase tracking-[0.14em] text-[#59616D]">
            {language === 'id' ? 'Kebutuhan project umum' : 'Typical project needs'}
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
            onClick={(event) => {
              event.preventDefault();
              scrollToSection('industry-work');
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.035] px-5 py-3 text-xs font-semibold text-white transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/[0.18] hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
          >
            {language === 'id' ? 'Lihat work relevan' : 'Explore relevant work'}
            <ArrowDown size={14} aria-hidden="true" />
          </a>
        </div>
      </PublicPageHero>

      <nav
        ref={sectionNavRef}
        style={{ top: navbarHeight }}
        aria-label={language === 'id' ? 'Navigasi halaman industri' : 'Industry page navigation'}
        data-industry-section-nav="true"
        className="sticky z-30 border-y border-white/[0.07] bg-[#0B0C0E]/90 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0B0C0E]/78"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] sm:px-6 md:px-10 lg:px-12 [&::-webkit-scrollbar]:hidden">
          <div className="mr-1 hidden shrink-0 items-center gap-2 pr-2 md:flex">
            <span className="text-[8px] font-mono uppercase tracking-[0.14em] text-[#59616D]">
              {language === 'id' ? 'Di halaman ini' : 'On this page'}
            </span>
            <span className="tabular-nums text-[8px] font-mono tracking-[0.12em] text-[#4F5762]">
              {String(sectionLinks.findIndex(([id]) => id === activeSection) + 1).padStart(2, '0')} / {String(sectionLinks.length).padStart(2, '0')}
            </span>
          </div>
          {sectionLinks.map(([id, label]) => (
            <a
              key={id}
              href={'#' + id}
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(id);
              }}
              aria-current={activeSection === id ? 'location' : undefined}
              className={cn(
                'shrink-0 rounded-full border px-3.5 py-2 text-[9px] font-mono uppercase tracking-[0.1em] text-white transition-[background-color,border-color,transform] duration-200 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70',
                activeSection === id
                  ? 'border-white/[0.13] bg-white/[0.07] shadow-[inset_0_0_0_1px_rgba(229,9,20,0.18),0_8px_22px_-18px_rgba(229,9,20,0.75)]'
                  : 'border-white/[0.08] bg-white/[0.025] hover:border-white/[0.16] hover:bg-white/[0.055]',
              )}
            >
              {language === 'id'
                ? ({ Approach: 'Pendekatan', Work: 'Work', Solutions: 'Solusi', Process: 'Proses', FAQ: 'FAQ' } as const)[label]
                : label}
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10 lg:px-12">
        <section
          id="industry-approach"
          style={{ scrollMarginTop: navbarHeight + sectionNavHeight + 16 }}
          className="border-b border-white/[0.07] py-16 sm:py-20 lg:py-24"
          aria-labelledby="industry-approach-title"
        >
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <span className="kapi-section-label">
                {language === 'id' ? 'Sudut industri' : 'Industry lens'}
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

            <div className="grid gap-px overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-white/[0.07] sm:grid-cols-2">
              {principles.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  transition={{ duration: 0.45, delay: index * 0.04 }}
                  className={cn(
                    'group relative overflow-hidden bg-[#101216] p-6 transition-[background-color,transform] duration-300 hover:bg-[#13161B] sm:p-7',
                    index === 0 ? 'sm:col-span-2 lg:min-h-[250px]' : 'min-h-[205px]',
                  )}
                >
                  <div
                    className={cn(
                      'absolute right-0 top-0 rounded-full bg-brand-red/[0.06] blur-3xl transition-opacity duration-500',
                      index === 0 ? 'h-40 w-40 opacity-100' : 'h-24 w-24 opacity-0 group-hover:opacity-100',
                    )}
                    aria-hidden="true"
                  />
                  <div className="relative grid gap-8 sm:grid-cols-[92px_minmax(0,1fr)]">
                    <div className="flex items-start justify-between sm:flex-col sm:justify-between">
                      <span className="font-mono text-[9px] tabular-nums tracking-[0.15em] text-brand-red">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[8px] font-mono uppercase tracking-[0.13em] text-[#4F5762]">
                        {catalog?.shortLabel ?? currentLabel}
                      </span>
                    </div>
                    <div className="max-w-2xl">
                      <h3 className={cn(
                        'font-display font-semibold leading-[1.02] tracking-[-0.035em] text-white',
                        index === 0 ? 'text-2xl sm:text-3xl' : 'text-xl',
                      )}>
                        {item.title}
                      </h3>
                      <p className={cn(
                        'mt-3 text-sm leading-7 text-[#78818D]',
                        index === 0 ? 'max-w-2xl' : 'max-w-xl',
                      )}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="industry-work"
          style={{ scrollMarginTop: navbarHeight + sectionNavHeight + 16 }}
          className="border-b border-white/[0.07] py-16 sm:py-20 lg:py-24"
          aria-labelledby="industry-work-title"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="kapi-section-label">{language === 'id' ? 'Bukti pekerjaan' : 'Proof of work'}</span>
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
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#78818D]">
                {language === 'id'
                  ? 'Tetap lanjutkan eksplorasi untuk melihat pekerjaan lain, atau langsung hubungi Kapitech bila Anda ingin membahas kebutuhan yang spesifik.'
                  : 'You can still explore the full work library, or contact Kapitech directly when you already have a specific need in mind.'}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                <Link
                  to="/work"
                  className="inline-flex min-h-10 items-center gap-2 rounded-full bg-brand-red px-4 py-2.5 text-xs font-semibold text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-brand-red-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
                >
                  {language === 'id' ? 'Lihat semua work' : 'View all work'}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-white transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/[0.18] hover:bg-white/[0.055] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
                >
                  {language === 'id' ? 'Hubungi Kapitech' : 'Contact Kapitech'}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>
          )}
        </section>

        <section
          id="industry-solutions"
          style={{ scrollMarginTop: navbarHeight + sectionNavHeight + 16 }}
          className="scroll-mt-28 border-b border-white/[0.07] py-16 sm:py-20 lg:py-24"
          aria-labelledby="industry-solutions-title"
        >
          <div className="grid gap-10 lg:grid-cols-[0.76fr_1.24fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <span className="kapi-section-label">
                {language === 'id' ? 'Bentuk bantuan' : 'Ways we can help'}
              </span>
              <h2
                id="industry-solutions-title"
                className="mt-3 max-w-xl text-3xl font-display font-semibold leading-[1.01] tracking-[-0.05em] sm:text-4xl lg:text-[3.2rem]"
              >
                {language === 'id'
                  ? 'Bentuk engagement yang paling masuk akal untuk konteks ini.'
                  : 'The engagement shapes that make sense for this context.'}
              </h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-[#7E8793]">
                {language === 'id'
                  ? 'Tidak ada paket industri yang kaku. Scope dipilih berdasarkan problem, user, dan tingkat kompleksitasnya.'
                  : 'There is no rigid industry package. Scope is shaped around the problem, the users, and the level of complexity.'}
              </p>

              <div className="mt-8 rounded-[1.5rem] border border-white/[0.08] bg-[#101216] p-5">
                <span className="text-[8px] font-mono uppercase tracking-[0.15em] text-[#626B76]">
                  {language === 'id' ? 'Core capabilities' : 'Core capabilities'}
                </span>
                <div className="mt-4 flex flex-wrap gap-2">
                  {capabilities.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.09em] text-white"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="divide-y divide-white/[0.07] overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[#101216]">

                {solutionTypes.map((item, index) => {
                  const Icon = solutionIcons[index % solutionIcons.length];
                  return (
                    <motion.article
                      key={item.title}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-8% 0px' }}
                      transition={{ duration: 0.42, delay: index * 0.035 }}
                      className="group grid gap-5 px-5 py-6 transition-[background-color] duration-300 hover:bg-white/[0.018] sm:grid-cols-[74px_minmax(0,1fr)_auto] sm:items-center sm:px-6 sm:py-7 lg:px-7"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#0B0C0E] text-[#8B94A0] transition-[border-color,background-color,color] duration-300 group-hover:border-brand-red/25 group-hover:bg-brand-red/[0.07] group-hover:text-white">
                        <Icon size={16} strokeWidth={1.8} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-mono tabular-nums tracking-[0.14em] text-brand-red">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <h3 className="text-lg font-display font-semibold leading-tight tracking-[-0.025em]">
                            {item.title}
                          </h3>
                        </div>
                        <p className="mt-2 max-w-2xl text-sm leading-7 text-[#78818D]">{item.description}</p>
                      </div>
                      <span
                        className="hidden shrink-0 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-[8px] font-mono uppercase tracking-[0.1em] text-[#7C8490] sm:inline-flex"
                        aria-hidden="true"
                      >
                        <Check size={11} />
                        {language === 'id' ? 'Relevan' : 'Relevant'}
                      </span>
                    </motion.article>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {serviceLinks.slice(0, 6).map(({ service, href }) => (
                  <Link
                    key={service}
                    to={href}
                    className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.025] px-3.5 py-2 text-[9px] font-mono uppercase tracking-[0.09em] text-white transition-[background-color,border-color,transform] duration-200 hover:-translate-y-px hover:border-white/[0.17] hover:bg-white/[0.055] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
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

        <section
          id="industry-process"
          style={{ scrollMarginTop: navbarHeight + sectionNavHeight + 16 }}
          className="scroll-mt-28 border-b border-white/[0.07] py-16 sm:py-20 lg:py-24"
          aria-labelledby="industry-process-title"
        >
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <span className="kapi-section-label">{language === 'id' ? 'Alur delivery' : 'Delivery path'}</span>
              <h2
                id="industry-process-title"
                className="mt-3 max-w-xl text-3xl font-display font-semibold leading-[1.01] tracking-[-0.05em] sm:text-4xl lg:text-[3.2rem]"
              >
                {language === 'id'
                  ? 'Jelas dari langkah pertama sampai handoff.'
                  : 'Clear from the first step to the handoff.'}
              </h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-[#7E8793]">
                {language === 'id'
                  ? 'Industry context mengubah fokus discovery. Struktur delivery tetap transparan supaya semua pihak tahu apa yang sedang dikerjakan.'
                  : 'Industry context changes the discovery focus. The delivery structure stays transparent so everyone knows what is being worked on.'}
              </p>

              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-brand-red/20 bg-brand-red/[0.05] px-3.5 py-2 text-[9px] font-mono uppercase tracking-[0.11em] text-white">
                <Check size={12} aria-hidden="true" />
                {language === 'id' ? 'Scope disesuaikan project' : 'Scope adapted to the project'}
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-4 top-6 hidden h-[calc(100%-48px)] w-px bg-white/[0.08] sm:block lg:left-6" />
              <div className="overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[#101216]">
                {resolvedDeliverySteps.map((item, index) => (
                  <motion.article
                    key={item.step}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-8% 0px' }}
                    transition={{ duration: 0.42, delay: index * 0.04 }}
                    className="group relative grid gap-5 border-b border-white/[0.07] px-5 py-6 last:border-b-0 sm:grid-cols-[76px_minmax(0,1fr)_auto] sm:items-start sm:px-6 lg:px-7"
                  >
                    <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-1">
                      <span className="text-[9px] font-mono tabular-nums tracking-[0.15em] text-brand-red">{item.step}</span>
                      <span className="text-[8px] font-mono uppercase tracking-[0.12em] text-[#4F5762]">
                        {language === 'id' ? 'Tahap' : 'Phase'} {index + 1}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-display font-semibold leading-[1.05] tracking-[-0.03em] text-white">{item.title}</h3>
                      <p className="mt-2 max-w-2xl text-sm leading-7 text-[#78818D]">{item.description}</p>
                    </div>
                    <div className="hidden self-stretch items-end justify-end sm:flex">
                      <span className="h-7 w-7 rounded-full border border-white/[0.08] bg-[#0B0C0E] transition-[border-color,background-color] duration-300 group-hover:border-brand-red/35 group-hover:bg-brand-red/[0.07]" aria-hidden="true" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-brand-red/60 transition-transform duration-500 group-hover:scale-x-100" aria-hidden="true" />
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="border-b border-white/[0.07] py-12 sm:py-16 lg:py-20"
          aria-labelledby="industry-decision-title"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#111318] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_16%,rgba(229,9,20,0.12),transparent_36%)]" aria-hidden="true" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-3xl">
                <span className="text-[9px] font-mono uppercase tracking-[0.14em] text-brand-red">
                  {language === 'id' ? 'Butuh titik awal?' : 'Need a starting point?'}
                </span>
                <h2
                  id="industry-decision-title"
                  className="mt-3 text-2xl font-display font-semibold leading-[1.02] tracking-[-0.04em] sm:text-3xl lg:text-4xl"
                >
                  {language === 'id'
                    ? 'Bawa problemnya. Kami bantu menentukan scope yang masuk akal.'
                    : 'Bring the problem. We will help shape the right scope.'}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[#8A929F]">
                  {language === 'id'
                    ? 'Anda tidak perlu datang dengan brief yang sempurna. Konteks awal, target, atau bottleneck sudah cukup untuk memulai pembicaraan.'
                    : 'You do not need a perfect brief. The initial context, target, or bottleneck is enough to start the conversation.'}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2.5">
                <Link
                  to={consultationHref}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-red px-5 py-3 text-xs font-semibold text-white shadow-[0_12px_28px_-18px_rgba(229,9,20,0.8)] transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-brand-red-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
                >
                  {language === 'id' ? 'Jadwalkan konsultasi' : 'Book a call'}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.035] px-5 py-3 text-xs font-semibold text-white transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/[0.18] hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
                >
                  {language === 'id' ? 'Hubungi Kapitech' : 'Contact Kapitech'}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          id="industry-faq"
          style={{ scrollMarginTop: navbarHeight + sectionNavHeight + 16 }}
          className="scroll-mt-28 border-b border-white/[0.07] py-16 sm:py-20 lg:py-24"
          aria-labelledby="industry-faq-title"
        >
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <span className="kapi-section-label">FAQ</span>
              <h2
                id="industry-faq-title"
                className="mt-3 max-w-xl text-3xl font-display font-semibold leading-[1.01] tracking-[-0.05em] sm:text-4xl"
              >
                {language === 'id'
                  ? 'Pertanyaan yang biasanya muncul sebelum mulai.'
                  : 'Questions that usually come before the project starts.'}
              </h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-[#7E8793]">
                {language === 'id'
                  ? 'Jawaban singkat untuk membantu Anda menilai apakah Kapitech cocok untuk kebutuhan ini.'
                  : 'Straightforward answers to help you decide whether Kapitech is a fit for the work.'}
              </p>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[#101216]">
              {faq.map((item, index) => (
                <details
                  key={item.question}
                  className="group border-b border-white/[0.07] last:border-b-0 open:bg-white/[0.018]"
                >
                  <summary className="flex min-h-[76px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 transition-[background-color] duration-200 hover:bg-white/[0.02] sm:px-6 sm:py-6">
                    <span className="flex min-w-0 items-start gap-4">
                      <span className="pt-0.5 text-[9px] font-mono tabular-nums text-[#4F5762]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm font-semibold leading-6 text-white sm:text-base">{item.question}</span>
                    </span>
                    <ChevronDown
                      size={17}
                      className="shrink-0 text-white transition-transform duration-200 group-open:rotate-180"
                    />
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

        <section className="scroll-mt-28 py-16 sm:py-20 lg:py-24" aria-labelledby="other-industries-title">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="kapi-section-label">
                {language === 'id' ? 'Konteks terkait' : 'Related contexts'}
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
              {visibleCatalog.length} {language === 'id' ? 'konteks terkait' : 'related contexts'}
            </span>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {visibleCatalog.map((item, index) => (
              <Link
                key={item.slug}
                to={'/industries/' + item.slug}
                className="group relative overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[#101216] p-5 transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-white/[0.15] hover:bg-[#121419] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
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
