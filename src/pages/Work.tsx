import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import PublicPageHero from '../components/ui/PublicPageHero';
import { 
  ArrowUpRight, 
  X, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Globe, 
  Layers, 
  Cpu, 
  Code2, 
  Palette, 
  Box, 
  Building2, 
  ExternalLink,
  Sparkles,
  Briefcase
} from 'lucide-react';
import Fuse from 'fuse.js';
import { useLanguage } from '../lib/LanguageContext';
import { ProjectItem } from '../data/projectsData';
import { projectSlug } from '../lib/publicContent';
import { buildCaseStudyNarrative } from '../lib/caseStudyNarrative';

const WorkModalPortal = ({ children }: { children: React.ReactNode }) => {
  if (typeof document === 'undefined') return null;
  return createPortal(children, document.body);
};

const CASE_STUDY_IMAGE_FALLBACK = '/case-study-fallback.svg';

const handleCaseStudyImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied === 'true') return;
  image.dataset.fallbackApplied = 'true';
  image.src = CASE_STUDY_IMAGE_FALLBACK;
};
import { fetchServerCmsProjects, getCmsProjects } from '../lib/cmsStore';

export const Work = () => {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(() => getCmsProjects());
  const [activePillar, setActivePillar] = useState<string>(() => searchParams.get('pillar') || 'All');
  const [activeService, setActiveService] = useState<string>(() => searchParams.get('service') || 'All');
  const [activeIndustry, setActiveIndustry] = useState<string>(() => searchParams.get('industry') || 'All');
  const [searchQuery, setSearchQuery] = useState<string>(() => searchParams.get('q') || '');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [featuredIndex, setFeaturedIndex] = useState<number>(0);
  const [isSpotlightPaused, setIsSpotlightPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const spotlightRef = React.useRef<HTMLElement>(null);
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const caseStudyModalRef = React.useRef<HTMLDivElement>(null);
  const modalTriggerRef = React.useRef<HTMLElement | null>(null);

  // Sync with CMS updates
  useEffect(() => {
    const handleUpdate = () => {
      setProjectsList(getCmsProjects());
    };

    window.addEventListener('kapitech_cms_updated', handleUpdate);
    void fetchServerCmsProjects().then(() => {
      setProjectsList(getCmsProjects());
    });

    return () => window.removeEventListener('kapitech_cms_updated', handleUpdate);
  }, []);

  const selectedProjectGallery = useMemo(() => {
    if (!selectedProject) return [];
    const candidates = [
      selectedProject.image,
      ...(Array.isArray(selectedProject.gallery) ? selectedProject.gallery : [])
    ];
    return Array.from(new Set(candidates.filter((item): item is string => Boolean(item && item.trim()))));
  }, [selectedProject]);

  // Reuse the detailed narrative on /work/:slug so the quick view is not limited
  // to four short text fields stored in the CMS record.
  const selectedCaseStudyNarrative = useMemo(
    () => selectedProject ? buildCaseStudyNarrative(selectedProject, language) : null,
    [selectedProject, language],
  );

  const openCaseStudy = (project: ProjectItem) => {
    modalTriggerRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    setSelectedProject(project);
  };

  const closeCaseStudy = () => {
    setSelectedProject(null);
    if (searchParams.get('project')) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('project');
      setSearchParams(nextParams, { replace: true });
    }
  };

  useEffect(() => {
    setSelectedMediaIndex(0);
  }, [selectedProject?.id]);

  useEffect(() => {
    if (!selectedProject) return;

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeCaseStudy();
        return;
      }

      if (selectedProjectGallery.length > 1 && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        event.preventDefault();
        setSelectedMediaIndex((current) =>
          event.key === 'ArrowLeft'
            ? (current === 0 ? selectedProjectGallery.length - 1 : current - 1)
            : (current + 1) % selectedProjectGallery.length,
        );
        return;
      }

      if (event.key !== 'Tab') return;

      const dialog = caseStudyModalRef.current;
      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.getClientRects().length > 0);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);

      if (modalTriggerRef.current && document.contains(modalTriggerRef.current)) {
        modalTriggerRef.current.focus();
      }
      modalTriggerRef.current = null;
    };
  }, [selectedProject, selectedProjectGallery.length]);

  // Open a specific case study when linked from another page (e.g. Homepage Featured Work).
  useEffect(() => {
    const requestedProject = searchParams.get('project');
    if (!requestedProject || selectedProject || projectsList.length === 0) return;

    const project = projectsList.find(
      (item) => item.id === requestedProject || item.slug === requestedProject || projectSlug(item) === requestedProject,
    );

    if (project) {
      openCaseStudy(project);
    }
  }, [projectsList, searchParams, selectedProject]);

  // Drag-to-scroll refs & state for horizontal filter bars
  const serviceScrollRef = React.useRef<HTMLDivElement>(null);
  const serviceDragRef = React.useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });
  const suppressServiceClickRef = React.useRef(false);
  const [isDraggingService, setIsDraggingService] = useState(false);
  const [isServiceScrolled, setIsServiceScrolled] = useState(false);

  const handleServiceScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setIsServiceScrolled(e.currentTarget.scrollLeft > 2);
  };

  const handleServicePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!serviceScrollRef.current || (e.pointerType === 'mouse' && e.button !== 0)) return;

    serviceDragRef.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startScrollLeft: serviceScrollRef.current.scrollLeft,
      moved: false,
    };

    suppressServiceClickRef.current = false;
    setIsDraggingService(true);
    serviceScrollRef.current.setPointerCapture(e.pointerId);
  };

  const handleServicePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = serviceDragRef.current;
    if (!drag.active || drag.pointerId !== e.pointerId || !serviceScrollRef.current) return;

    const deltaX = e.clientX - drag.startX;
    if (Math.abs(deltaX) > 4) {
      drag.moved = true;
    }

    if (drag.moved) {
      e.preventDefault();
      serviceScrollRef.current.scrollLeft = drag.startScrollLeft - deltaX * 1.35;
    }
  };

  const handleServicePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = serviceDragRef.current;
    if (drag.pointerId !== e.pointerId) return;

    if (serviceScrollRef.current?.hasPointerCapture(e.pointerId)) {
      serviceScrollRef.current.releasePointerCapture(e.pointerId);
    }

    suppressServiceClickRef.current = drag.moved;
    serviceDragRef.current.active = false;
    serviceDragRef.current.pointerId = -1;
    setIsDraggingService(false);

    if (drag.moved) {
      window.setTimeout(() => {
        suppressServiceClickRef.current = false;
      }, 0);
    }
  };

  const handleServicePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = serviceDragRef.current;
    if (drag.pointerId !== e.pointerId) return;

    if (serviceScrollRef.current?.hasPointerCapture(e.pointerId)) {
      serviceScrollRef.current.releasePointerCapture(e.pointerId);
    }

    suppressServiceClickRef.current = false;
    serviceDragRef.current.active = false;
    serviceDragRef.current.pointerId = -1;
    setIsDraggingService(false);
  };

  const featuredProjects = useMemo(() => {
    return projectsList.filter((project) => project.featured && project.isPublished !== false);
  }, [projectsList]);
  const hasFeaturedProjects = featuredProjects.length > 0;
  // Keep the spotlight functional if CMS records are available but none is flagged featured.
  const spotlightProjects = hasFeaturedProjects ? featuredProjects : projectsList.slice(0, 3);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncReducedMotion = () => setReducedMotion(media.matches);

    syncReducedMotion();
    media.addEventListener('change', syncReducedMotion);

    return () => media.removeEventListener('change', syncReducedMotion);
  }, []);

  useEffect(() => {
    setFeaturedIndex((current) =>
      Math.min(current, Math.max(0, spotlightProjects.length - 1)),
    );
  }, [spotlightProjects.length]);

  useEffect(() => {
    if (reducedMotion || isSpotlightPaused || spotlightProjects.length <= 1) return;

    const interval = setInterval(() => {
      setFeaturedIndex(prev => (prev + 1) % spotlightProjects.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [spotlightProjects.length, isSpotlightPaused, reducedMotion]);

  const normalizeFilterValue = (value: string | null | undefined) =>
    String(value ?? '').trim().toLocaleLowerCase();

  const industryOptions = useMemo(() => {
    return ['All', ...Array.from(new Set(projectsList.map((project) => project.industry?.trim()).filter((industry): industry is string => Boolean(industry)))).sort((a, b) => a.localeCompare(b))];
  }, [projectsList]);

  const serviceOptions = useMemo(() => {
    const activePillarKey = normalizeFilterValue(activePillar);
    const services = projectsList
      .filter(
        (project) =>
          activePillar === 'All' ||
          normalizeFilterValue(project.pillar) === activePillarKey,
      )
      .map((project) => project.service?.trim())
      .filter((service): service is string => Boolean(service));

    return ['All', ...Array.from(new Set(services)).sort((a, b) => a.localeCompare(b))];
  }, [projectsList, activePillar]);

  useEffect(() => {
    if (activePillar !== 'All') {
      const activePillarKey = normalizeFilterValue(activePillar);
      const pillarExists = projectsList.some(
        (project) => normalizeFilterValue(project.pillar) === activePillarKey,
      );
      if (!pillarExists) setActivePillar('All');
    }

    if (activeService !== 'All' && !serviceOptions.includes(activeService)) {
      setActiveService('All');
    }
    if (activeIndustry !== 'All' && !industryOptions.includes(activeIndustry)) {
      setActiveIndustry('All');
    }
  }, [activePillar, activeService, activeIndustry, projectsList, serviceOptions, industryOptions]);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams);
    if (activePillar === 'All') nextParams.delete('pillar');
    else nextParams.set('pillar', activePillar);
    if (activeService === 'All') nextParams.delete('service');
    else nextParams.set('service', activeService);
    if (activeIndustry === 'All') nextParams.delete('industry');
    else nextParams.set('industry', activeIndustry);
    if (searchQuery.trim()) nextParams.set('q', searchQuery.trim());
    else nextParams.delete('q');

    const next = nextParams.toString();
    if (next !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [activePillar, activeService, activeIndustry, searchQuery, searchParams, setSearchParams]);

  useEffect(() => {
    const scroller = serviceScrollRef.current;
    if (!scroller) return;

    scroller.scrollTo({ left: 0, behavior: 'auto' });
    setIsServiceScrolled(false);
  }, [activePillar, serviceOptions.length]);

  // Reset granular filter if pillar changes
  const handlePillarChange = (pillar: string) => {
    setActivePillar(pillar);
    setActiveService('All');
    setVisibleCount(12);
  };

  const filteredProjects = useMemo(() => {
    let list = projectsList;

    const activePillarKey = normalizeFilterValue(activePillar);
    const activeServiceKey = normalizeFilterValue(activeService);

    if (activePillar !== 'All') {
      list = list.filter(
        (project) => normalizeFilterValue(project.pillar) === activePillarKey,
      );
    }

    if (activeService !== 'All') {
      list = list.filter(
        (project) => normalizeFilterValue(project.service) === activeServiceKey,
      );
    }

    if (activeIndustry !== 'All') {
      list = list.filter(
        (project) => normalizeFilterValue(project.industry) === normalizeFilterValue(activeIndustry),
      );
    }

    if (searchQuery.trim()) {
      const fuse = new Fuse(list, {
        keys: ['title', 'client', 'industry', 'service', 'pillar', 'desc', 'descId', 'technologies', 'deliverables'],
        threshold: 0.35,
      });
      list = fuse.search(searchQuery).map(res => res.item);
    }

    return list;
  }, [projectsList, activePillar, activeService, activeIndustry, searchQuery]);

  const currentFeatured = spotlightProjects[featuredIndex] || projectsList[0];

  const featuredPositionLabel =
    language === 'id'
      ? `${featuredIndex + 1} dari ${spotlightProjects.length}: ${currentFeatured?.title ?? ''}`
      : `${featuredIndex + 1} of ${spotlightProjects.length}: ${currentFeatured?.title ?? ''}`;
  const featuredProgress = `${((featuredIndex + 1) / Math.max(spotlightProjects.length, 1)) * 100}%`;

  return (
    <div className="bg-[#0B0C0E] text-white min-h-screen selection:bg-brand-red selection:text-white relative">
      {/* Hero Section */}
      <PublicPageHero
        eyebrow={language === 'id' ? 'Koleksi Portofolio & Studi Kasus' : 'Portfolio & Case Studies'}
        title={language === 'id' ? 'Karya Nyata. Dampak Nyata.' : 'Crafted for Real Impact.'}
        description={
          language === 'id'
            ? `Jelajahi ${projectsList.length} studi kasus dan portofolio komprehensif kami yang mencakup pilar Visual Experience dan Innovation Development untuk para pemimpin industri global.`
            : `Explore our portfolio of ${projectsList.length} comprehensive case studies spanning Visual Experience and Innovation Development across global industry leaders.`
        }
      >
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-mono text-[#8A909D]">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-brand-red" aria-hidden="true" />
            <span>{projectsList.length} {language === 'id' ? 'Studi Kasus Lengkap' : 'Case Studies'}</span>
          </span>
          <span className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 backdrop-blur-xl">
            {serviceOptions.filter((item) => item !== 'All').length} {language === 'id' ? 'Layanan Spesialisasi' : 'Core Disciplines'}
          </span>
          <span className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 backdrop-blur-xl">
            {language === 'id' ? 'Klien Global & Indonesia' : 'Global & Local Enterprise'}
          </span>
          <Link
            to="/services"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 py-1.5 text-brand-red transition-colors hover:bg-white/[0.035] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
          >
            <span>{language === 'id' ? 'Lihat layanan' : 'Explore services'}</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </PublicPageHero>

      {/* Featured Spotlight Carousel */}
      {currentFeatured && (
        <section
          ref={spotlightRef}
          className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-12 bg-[#0B0C0E]"
          role="region"
          aria-roledescription="carousel"
          aria-label={language === 'id' ? 'Sorotan studi kasus terpilih' : 'Selected case study spotlight'}
          onMouseEnter={() => setIsSpotlightPaused(true)}
          onMouseLeave={() => setIsSpotlightPaused(false)}
          onFocusCapture={() => setIsSpotlightPaused(true)}
          onBlurCapture={(event) => {
            if (!spotlightRef.current?.contains(event.relatedTarget as Node | null)) {
              setIsSpotlightPaused(false);
            }
          }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8 mb-7 sm:mb-9">
              <div className="min-w-0">
                <span className="kapi-section-label mb-4">
                  {hasFeaturedProjects
                    ? (language === 'id' ? 'Sorotan Studi Kasus Unggulan' : 'Featured Case Study Spotlight')
                    : (language === 'id' ? 'Sorotan Studi Kasus Terpilih' : 'Selected Case Study Spotlight')}
                </span>
                <h2 className="mt-3 max-w-3xl text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-display font-semibold tracking-[-0.055em] leading-[1.02] text-white">
                  {language === 'id'
                    ? 'Satu pekerjaan, dilihat lebih dekat.'
                    : 'One project, brought into closer focus.'}
                </h2>
                <p className="mt-3 max-w-2xl text-xs sm:text-sm leading-[1.75] text-[#8A909D] font-light">
                  {language === 'id'
                    ? 'Pilih salah satu pekerjaan unggulan untuk melihat konteks, hasil, dan cara kami mengeksekusinya.'
                    : 'Explore selected work with the context, outcomes, and execution behind the final result.'}
                </p>
              </div>

              <div className="shrink-0 flex items-center justify-between sm:justify-end gap-3">
                <div className="text-[10px] sm:text-xs font-mono tabular-nums text-[#8A909D]/75 min-w-[4.5rem] text-center">
                  {String(featuredIndex + 1).padStart(2, '0')} / {String(spotlightProjects.length).padStart(2, '0')}
                </div>
                <button
                  type="button"
                  disabled={spotlightProjects.length <= 1}
                  onClick={() => setFeaturedIndex(prev => spotlightProjects.length > 1 ? (prev - 1 + spotlightProjects.length) % spotlightProjects.length : 0)}
                  className="w-10 h-10 min-w-10 min-h-10 rounded-full border border-white/[0.08] bg-white/[0.018] hover:bg-white/[0.06] hover:border-white/[0.14] flex items-center justify-center text-[#8A909D] hover:text-white transition-[background-color,border-color,color] duration-300"                  aria-label={language === 'id' ? 'Studi kasus unggulan sebelumnya' : 'Previous featured case study'}
                  data-cursor-label="Previous"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  disabled={spotlightProjects.length <= 1}
                  onClick={() => setFeaturedIndex(prev => spotlightProjects.length > 1 ? (prev + 1) % spotlightProjects.length : 0)}
                  className="w-10 h-10 min-w-10 min-h-10 rounded-full border border-white/[0.08] bg-white/[0.018] hover:bg-white/[0.06] hover:border-white/[0.14] flex items-center justify-center text-[#8A909D] hover:text-white transition-[background-color,border-color,color] duration-300"
                  aria-label={language === 'id' ? 'Studi kasus unggulan berikutnya' : 'Next featured case study'}
                  data-cursor-label="Next"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="relative rounded-[28px] border border-white/[0.08] bg-white/[0.018] p-1.5 sm:p-2 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.025),0_30px_90px_-60px_rgba(0,0,0,0.85)]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.article
                  key={currentFeatured.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.32,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onClick={() => openCaseStudy(currentFeatured)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      openCaseStudy(currentFeatured);
                      return;
                    }

                    if (event.key === 'ArrowLeft' && spotlightProjects.length > 1) {
                      event.preventDefault();
                      setFeaturedIndex(prev => (prev - 1 + spotlightProjects.length) % spotlightProjects.length);
                      return;
                    }

                    if (event.key === 'ArrowRight' && spotlightProjects.length > 1) {
                      event.preventDefault();
                      setFeaturedIndex(prev => (prev + 1) % spotlightProjects.length);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-roledescription="slide"
                  aria-label={featuredPositionLabel}
                  data-cursor-label="Open"
                  className="cursor-pointer group relative overflow-hidden rounded-[22px] border border-white/[0.07] bg-[#0F1116]/82 hover:border-brand-red/28 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/40 transition-[background-color,border-color,box-shadow] duration-300 grid grid-cols-1 lg:grid-cols-12"                >
                  <div className="lg:col-span-7 relative min-h-[260px] sm:min-h-[360px] lg:min-h-[480px] overflow-hidden bg-[#0B0C0E]">
                    <img
                      src={currentFeatured.image}
                      alt={currentFeatured.title}
                      onError={handleCaseStudyImageError}
                      className="block w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.035] lg:scale-[1.025] lg:group-hover:scale-[1.055]"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E]/92 via-[#0B0C0E]/20 to-transparent" />
                    <div className="absolute top-4 left-4 sm:top-5 sm:left-5 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-[#0B0C0E]/72 backdrop-blur-md border border-white/[0.1] text-[10px] font-mono font-semibold uppercase tracking-[0.12em] text-white">
                        {hasFeaturedProjects
                          ? (language === 'id' ? 'Unggulan' : 'Featured')
                          : (language === 'id' ? 'Pilihan' : 'Selected')}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-[#0B0C0E]/58 backdrop-blur-md border border-brand-red/25 text-[10px] font-mono text-brand-red">
                        {currentFeatured.year}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 lg:hidden">
                      <span className="text-[10px] sm:text-xs font-mono text-white/72">
                        {currentFeatured.client} • {currentFeatured.industry}
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-5 sm:p-7 lg:p-9 xl:p-10 flex flex-col justify-between min-h-[420px] sm:min-h-[440px] lg:min-h-[480px]">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-5">
                        <span className="px-2.5 py-1 rounded-full bg-brand-red/[0.07] border border-brand-red/25 text-brand-red text-[10px] sm:text-[11px] font-mono font-medium">
                          {currentFeatured.pillar}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-white/[0.025] border border-white/[0.08] text-[#8A909D] text-[10px] sm:text-[11px] font-mono backdrop-blur-md">
                          {currentFeatured.service}
                        </span>
                        <span className="ml-auto shrink-0 text-[#8A909D]/70 text-[10px] sm:text-xs font-mono tabular-nums">
                          {currentFeatured.year}
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl lg:text-[2.45rem] font-display font-bold leading-[1.04] tracking-[-0.045em] text-white group-hover:text-brand-red transition-colors mb-3">
                        {currentFeatured.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs font-mono text-[#8A909D] leading-relaxed mb-5">
                        {currentFeatured.client} <span className="text-white/20">•</span> {currentFeatured.industry}
                      </p>
                      <p className="text-sm sm:text-[0.95rem] text-[#8A909D] leading-[1.78] line-clamp-4 font-light max-w-xl">
                        {language === 'id' ? currentFeatured.descId : currentFeatured.desc}
                      </p>
                    </div>

                    <div className="mt-8 lg:mt-10">
                      <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-5 border-t border-white/[0.07]">
                        {currentFeatured.impact.slice(0, 3).map((metric, i) => (
                          <div key={i} className="min-w-0">
                            <span className="text-base sm:text-xl font-display font-bold leading-none text-white block truncate">
                              {metric.value}
                            </span>
                            <span className="text-[9px] sm:text-[10px] font-mono text-[#8A909D] leading-[1.45] block mt-1.5 line-clamp-2">
                              {metric.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/[0.07] flex flex-col gap-4">
                        <div className="flex flex-wrap gap-1.5">
                          {currentFeatured.technologies.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 rounded-full bg-white/[0.018] border border-white/[0.08] text-[9px] sm:text-[10px] font-mono text-[#8A909D]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-xs font-mono font-semibold text-brand-red inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                            <span>{language === 'id' ? 'Buka Detail Studi Kasus' : 'Inspect Full Case Study'}</span>
                            <ArrowUpRight size={14} />
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.12em] text-[#8A909D]/60">
                            {reducedMotion || isSpotlightPaused
                              ? (language === 'id' ? 'Mode interaksi' : 'Interaction mode')
                              : (language === 'id' ? 'Putar otomatis' : 'Auto showcase')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="h-px flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                <div
                  className="h-full rounded-full bg-brand-red transition-[width] duration-500"
                  style={{ width: featuredProgress }}
                />
              </div>
              <span className="shrink-0 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.12em] text-[#8A909D]/60">
                {spotlightProjects.length} {hasFeaturedProjects
                  ? (language === 'id' ? 'studi kasus unggulan' : 'featured case studies')
                  : (language === 'id' ? 'studi kasus pilihan' : 'selected case studies')}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Filter & Search Bar Section */}
      <section
        className="sticky top-20 md:top-[72px] z-30 px-4 sm:px-6 md:px-12 py-2 sm:py-2.5 bg-transparent"
        aria-label={language === 'id' ? 'Filter dan pencarian studi kasus' : 'Case study filters and search'}
      >
        <div className="max-w-7xl mx-auto rounded-2xl border border-white/[0.085] bg-[#111318]/94 px-3 py-2.5 sm:px-3.5 sm:py-3 shadow-[0_18px_44px_-34px_rgba(0,0,0,0.92),inset_0_1px_0_rgba(255,255,255,0.035)] backdrop-blur-xl backdrop-saturate-110">
          <div className="flex flex-col gap-2.5 sm:gap-3">
            <div className="flex items-center justify-between gap-3 px-0.5">
              <div className="min-w-0">
                <span className="kapi-section-label mb-0 shrink-0">
                  {language === 'id' ? 'Jelajahi Portofolio' : 'Browse the Work'}
                </span>
                <span className="hidden sm:block mt-1 text-[10px] font-mono text-[#8A909D]/60">
                  {language === 'id'
                    ? 'Filter berdasarkan bidang, layanan, atau kata kunci.'
                    : 'Filter by discipline, service, or keyword.'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#8A909D]/70"
                  aria-live="polite"
                >
                  {filteredProjects.length} {language === 'id' ? 'proyek' : 'projects'}
                </span>
                {(activePillar !== 'All' || activeService !== 'All' || activeIndustry !== 'All' || searchQuery) && (
                  <button
                    onClick={() => {
                      setActivePillar('All');
                      setActiveService('All');
                      setActiveIndustry('All');
                      setSearchQuery('');
                      setVisibleCount(12);
                    }}
                    className="shrink-0 text-[10px] font-mono uppercase tracking-[0.1em] text-brand-red hover:text-white transition-colors flex items-center gap-1 min-h-[40px]"
                    data-cursor-label="Reset"
                  >
                    <X size={10} />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:gap-2.5 lg:flex-row lg:items-center lg:gap-3">
              <div
                className="min-w-0 w-fit max-w-full flex-none overflow-x-auto rounded-full border border-white/[0.08] bg-[#17191F]/92 p-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                role="group"
                aria-label={language === 'id' ? 'Filter bidang' : 'Discipline filters'}
              >
                <div className="flex w-max items-center gap-1">
                  {[
                    { key: 'All', labelEn: 'All Disciplines', labelId: 'Semua Bidang' },
                    { key: 'Visual Experience', labelEn: 'Visual Experience', labelId: 'Visual Experience' },
                    { key: 'Innovation Development', labelEn: 'Innovation Development', labelId: 'Innovation Development' }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      type="button"
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={() => {
                        handlePillarChange(tab.key);
                      }}
                      data-cursor-label="Filter"
                      aria-pressed={activePillar === tab.key}
                      className={`px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] font-mono font-medium transition-[background-color,color,box-shadow] duration-200 min-h-[40px] sm:min-h-[34px] flex items-center justify-center whitespace-nowrap ${
                        activePillar === tab.key
                          ? 'bg-brand-red text-white shadow-[0_8px_24px_-12px_rgba(229,9,20,0.72)]'
                          : 'text-[#8A909D] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {language === 'id' ? tab.labelId : tab.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative w-full md:flex-1 md:min-w-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8A909D]" aria-hidden="true" />
                <label htmlFor="work-case-study-search" className="sr-only">
                  {language === 'id' ? 'Cari studi kasus' : 'Search case studies'}
                </label>
                <input
                  id="work-case-study-search"
                  type="search"
                  inputMode="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleCount(12);
                  }}
                  placeholder={language === 'id' ? 'Cari studi kasus, klien...' : 'Search case study, client...'}
                  className="w-full [appearance:textfield] [&::-webkit-search-cancel-button]:appearance-none bg-[#17191F]/92 border border-white/[0.08] rounded-full pl-10 pr-10 py-1.5 text-base sm:text-xs text-white placeholder:text-[#8A909D] focus:outline-none focus:border-brand-red transition-[border-color,background-color,box-shadow] duration-200 font-mono min-h-[44px] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setVisibleCount(12);
                    }}
                    type="button"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#8A909D] hover:text-white min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-white/[0.05] transition-colors"
                    aria-label={language === 'id' ? 'Hapus pencarian' : 'Clear search'}
                    data-cursor-label="Clear"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto py-0.5" aria-label={language === 'id' ? 'Filter industri' : 'Industry filters'} role="group">
              {industryOptions.map((industry) => (
                <button
                  key={industry}
                  type="button"
                  onClick={() => { setActiveIndustry(industry); setVisibleCount(12); }}
                  aria-pressed={activeIndustry === industry}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-mono transition-[background-color,border-color,color] duration-200 ${activeIndustry === industry ? 'border-brand-red bg-brand-red text-white' : 'border-white/[0.08] bg-white/[0.018] text-[#818995] hover:border-white/[0.16] hover:text-white'}`}
                >
                  {industry === 'All' ? (language === 'id' ? 'Semua Industri' : 'All Industries') : industry}
                </button>
              ))}
            </div>

            <div
              className="relative group/filter"
              aria-label={language === 'id' ? 'Filter layanan' : 'Service filters'}
              role="group"
            >
              <div
                ref={serviceScrollRef}
                onScroll={handleServiceScroll}
                onPointerDown={handleServicePointerDown}
                onPointerMove={handleServicePointerMove}
                onPointerUp={handleServicePointerUp}
                onPointerCancel={handleServicePointerCancel}
                style={{
                  maskImage: isServiceScrolled
                    ? 'linear-gradient(to right, transparent 0, black 18px, black calc(100% - 52px), transparent 100%)'
                    : 'linear-gradient(to right, black 0, black calc(100% - 52px), transparent 100%)',
                  WebkitMaskImage: isServiceScrolled
                    ? 'linear-gradient(to right, transparent 0, black 18px, black calc(100% - 52px), transparent 100%)'
                    : 'linear-gradient(to right, black 0, black calc(100% - 52px), transparent 100%)',
                }}
                className={`flex items-center gap-1.5 overflow-x-auto overflow-y-hidden py-0.5 pr-12 sm:pr-20 select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
                  isDraggingService ? 'cursor-grabbing' : 'cursor-grab'
                }`}
              >

                {serviceOptions.map((srv) => (
                  <button
                    key={srv}
                    type="button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={() => {
                      setActiveService(srv);
                      setVisibleCount(12);
                    }}
                    aria-pressed={activeService === srv}
                    data-cursor-label="Filter"
                    className={`pointer-events-auto px-2.5 py-1 rounded-full text-[10px] font-mono whitespace-nowrap transition-[background-color,border-color,color,box-shadow] duration-200 shrink-0 border min-h-[44px] sm:min-h-[40px] flex items-center ${
                      activeService === srv
                        ? 'bg-brand-red text-white border-brand-red font-semibold shadow-[0_8px_22px_-14px_rgba(229,9,20,0.55)]'
                        : 'bg-white/[0.018] text-[#8A909D] border-white/[0.08] hover:border-brand-red/30 hover:text-white hover:shadow-[0_6px_18px_-14px_rgba(229,9,20,0.28)]'
                    }`}
                  >
                    {srv === 'All' ? (language === 'id' ? 'Semua Layanan' : 'All Services') : srv}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-12 bg-[#0B0C0E]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8 mb-8 sm:mb-10">
            <div className="min-w-0">
              <span className="kapi-section-label mb-5">
                {language === 'id' ? 'Studi Kasus' : 'Case Studies'}
              </span>
              <h2 className="mt-1 max-w-3xl text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-display font-semibold tracking-[-0.05em] leading-[1.04] text-white">
                {language === 'id' ? 'Pekerjaan yang kami banggakan.' : 'Selected work, built for impact.'}
              </h2>
              <p className="mt-3 max-w-2xl text-xs sm:text-sm leading-[1.75] text-[#8A909D] font-light">
                {language === 'id'
                  ? 'Setiap studi kasus memperlihatkan konteks proyek, hasil utama, dan cara kami mengeksekusinya.'
                  : 'Each case study brings the project context, key outcome, and execution into focus.'}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3 self-start sm:self-auto">
              <span className="px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.018] text-[10px] font-mono uppercase tracking-[0.12em] text-[#8A909D]">
                {language === 'id'
                  ? 'Menampilkan ' + Math.min(visibleCount, filteredProjects.length) + ' dari ' + filteredProjects.length
                  : 'Showing ' + Math.min(visibleCount, filteredProjects.length) + ' of ' + filteredProjects.length}
              </span>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="min-h-[340px] flex flex-col items-center justify-center text-center border border-dashed border-white/[0.09] rounded-3xl p-8 sm:p-10 bg-white/[0.012]">
              <div className="w-12 h-12 rounded-2xl border border-white/[0.08] bg-white/[0.018] flex items-center justify-center text-[#8A909D] mb-5">
                <Search className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-2">
                {language === 'id' ? 'Studi Kasus Tidak Ditemukan' : 'No Case Studies Found'}
              </h3>
              <p className="text-sm text-[#8A909D] max-w-md mb-6 font-light leading-relaxed">
                {language === 'id'
                  ? 'Coba ubah kata kunci atau filter Anda untuk melihat studi kasus lain.'
                  : 'Try adjusting your search or filters to explore other case studies.'}
              </p>
              <button
                onClick={() => {
                  setActivePillar('All');
                  setActiveService('All');
                  setActiveIndustry('All');
                  setSearchQuery('');
                  setVisibleCount(12);
                }}
                className="px-6 py-3 rounded-full bg-brand-red text-white text-xs font-mono font-semibold hover:bg-[#FF1E27] transition-colors min-h-[44px]"
                data-cursor-label="Reset"
              >
                {language === 'id' ? 'Reset Filter' : 'Reset Filters'}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {filteredProjects.slice(0, visibleCount).map((project) => (
                  <article
                    key={project.id}
                    onClick={() => openCaseStudy(project)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        openCaseStudy(project);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={
                      language === 'id'
                        ? 'Buka studi kasus ' + project.title
                        : 'Open case study ' + project.title
                    }
                    data-cursor-label="Open"
                    className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[22px] border border-white/[0.08] bg-white/[0.018] shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] backdrop-blur-xl transition-[background-color,border-color,box-shadow,transform] duration-300 hover:border-brand-red/28 hover:bg-white/[0.024] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/40"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#0B0C0E]">
                      <img
                        src={project.image}
                        alt={project.title}
                        onError={handleCaseStudyImageError}
                        className="block h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.035]"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E]/76 via-transparent to-transparent" aria-hidden="true" />

                      <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-3 sm:inset-x-4 sm:top-4">
                        <span className="max-w-[72%] truncate rounded-full border border-white/[0.1] bg-[#0B0C0E]/72 px-2.5 py-1 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.08em] text-white backdrop-blur-md">
                          {project.service}
                        </span>
                        <span className="shrink-0 rounded-full border border-white/[0.1] bg-[#0B0C0E]/72 px-2.5 py-1 text-[9px] sm:text-[10px] font-mono tabular-nums text-[#D8DCE5] backdrop-blur-md">
                          {project.year}
                        </span>
                      </div>

                      <span className="absolute bottom-3 left-3 rounded-full border border-brand-red/25 bg-[#0B0C0E]/72 px-2.5 py-1 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.08em] text-brand-red backdrop-blur-md sm:bottom-4 sm:left-4">
                        {project.pillar}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <div className="min-w-0">
                        <div className="mb-2 flex min-w-0 items-center gap-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.08em] text-[#8A909D]">
                          <span className="min-w-0 truncate text-brand-red">{project.client}</span>
                          <span className="text-white/20" aria-hidden="true">•</span>
                          <span className="min-w-0 truncate">{project.industry}</span>
                        </div>

                        <h3 className="min-h-[3.2rem] text-lg sm:text-xl font-display font-bold leading-[1.15] tracking-[-0.02em] text-white transition-colors duration-300 group-hover:text-brand-red">
                          {project.title}
                        </h3>

                        <p className="mt-3 min-h-[3rem] text-xs sm:text-sm font-light leading-[1.7] text-[#8A909D] line-clamp-2">
                          {language === 'id' ? project.descId : project.desc}
                        </p>
                      </div>

                      <div className="mt-6 border-t border-white/[0.07] pt-4">
                        <div className="flex min-w-0 items-center justify-between gap-4">                          <div className="min-w-0">
                            {project.impact[0] ? (
                              <>
                                <span className="block truncate text-[10px] font-mono uppercase tracking-[0.08em] text-[#8A909D]/70">
                                  {project.impact[0].label}
                                </span>
                                <span className="mt-1 block truncate text-sm sm:text-base font-display font-semibold leading-none text-white">
                                  {project.impact[0].value}
                                </span>
                              </>
                            ) : (
                              <span className="text-[10px] font-mono uppercase tracking-[0.08em] text-[#8A909D]/70">
                                {language === 'id' ? 'Hasil proyek' : 'Project outcome'}
                              </span>
                            )}
                          </div>

                          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.018] px-3 py-2 text-[10px] font-mono font-semibold uppercase tracking-[0.08em] text-[#8A909D] transition-[background-color,border-color,color,transform] duration-300 group-hover:translate-x-0.5 group-hover:border-brand-red/30 group-hover:bg-brand-red/[0.08] group-hover:text-white">
                            <span>{language === 'id' ? 'Buka' : 'Open'}</span>
                            <ArrowUpRight size={13} aria-hidden="true" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {visibleCount < filteredProjects.length && (
                <div className="flex justify-center pt-10 sm:pt-12">
                  <button
                    type="button"
                    onClick={() => setVisibleCount(prev => Math.min(prev + 12, filteredProjects.length))}
                    className="inline-flex min-h-[46px] items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.018] px-6 sm:px-7 text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-[0.08em] text-white transition-[background-color,border-color,box-shadow,transform] duration-300 hover:border-brand-red/40 hover:bg-brand-red/[0.08] hover:shadow-[0_14px_34px_-24px_rgba(229,9,20,0.7)] active:scale-[0.985]"
                    data-cursor-label="Load more"
                  >
                    <span>{language === 'id' ? 'Muat Lebih Banyak' : 'Load More'}</span>
                    <span className="text-[#8A909D]">+{Math.min(12, filteredProjects.length - visibleCount)}</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Case Study Detail Modal */}
      <WorkModalPortal>
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center kapi-modal-overlay p-2 sm:p-4 lg:p-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="case-study-modal-title"
              aria-describedby="case-study-modal-summary"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) closeCaseStudy();
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.965, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.965, y: 16 }}
                transition={{ duration: 0.26 }}
                ref={caseStudyModalRef}
                className="kapi-modal-surface relative flex h-[calc(100dvh-1rem)] w-full max-w-[1400px] flex-col overflow-hidden sm:h-[calc(100dvh-2rem)] lg:max-h-[94vh]"
              >
                <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.08] bg-[#0F1116] px-4 py-4 sm:px-6 sm:py-5 lg:px-7">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-brand-red/30 bg-brand-red/10 px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-[0.1em] text-brand-red">{selectedProject.pillar}</span>
                      <span className="truncate text-[10px] sm:text-[11px] font-mono text-[#8A909D]">{selectedProject.service}</span>
                      <span className="text-white/15" aria-hidden="true">•</span>
                      <span className="tabular-nums text-[10px] sm:text-[11px] font-mono text-[#8A909D]">{selectedProject.year}</span>
                    </div>
                    <h3 id="case-study-modal-title" className="truncate text-sm sm:text-base lg:text-lg font-display font-semibold text-white">{selectedProject.title}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => closeCaseStudy()}
                    className="kapi-modal-close"
                    aria-label={language === 'id' ? 'Tutup studi kasus' : 'Close case study modal'}
                    data-cursor-label="Close"
                    autoFocus
                  >
                    <X size={18} />
                  </button>
                </header>

                <div className="grid min-h-0 flex-1 overflow-y-auto lg:overflow-hidden lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                  <aside className="min-h-0 border-b border-white/[0.08] bg-[#0B0C0E] lg:overflow-y-auto lg:border-b-0 lg:border-r">
                    <div className="p-4 sm:p-5 lg:p-6">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-brand-red">Visual Proof</span>
                          <p className="mt-1 text-xs text-[#8A909D]">
                            {selectedProjectGallery.length > 1
                              ? String(selectedProjectGallery.length) + ' ' + (language === 'id' ? 'foto dokumentasi proyek' : 'project proof images')
                              : language === 'id'
                                ? 'Dokumentasi proyek'
                                : 'Project documentation'}
                          </p>
                        </div>
                        <span className="tabular-nums text-[10px] font-mono text-[#6F7480]">
                          {String(selectedMediaIndex + 1).padStart(2, '0')} / {String(Math.max(selectedProjectGallery.length, 1)).padStart(2, '0')}
                        </span>
                      </div>

                      <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#111318]">
                        {selectedProjectGallery[selectedMediaIndex] ? (
                          <img
                            src={selectedProjectGallery[selectedMediaIndex]}
                            alt={selectedProject.title + ' ' + (language === 'id' ? 'dokumentasi' : 'proof') + ' ' + (selectedMediaIndex + 1)}
                            onError={handleCaseStudyImageError}
                            className="aspect-[4/3] w-full object-cover lg:aspect-[5/4]"
                            fetchPriority={selectedMediaIndex === 0 ? 'high' : undefined}
                          />
                        ) : (
                          <div className="flex aspect-[4/3] items-center justify-center text-[#6F7480]"><Layers size={28} aria-hidden="true" /></div>
                        )}

                        {selectedProjectGallery.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() => setSelectedMediaIndex((current) => current === 0 ? selectedProjectGallery.length - 1 : current - 1)}
                              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.12] bg-[#0B0C0E]/78 text-white backdrop-blur-md transition-[background-color,border-color,transform] duration-300 hover:border-white/[0.22] hover:bg-[#0B0C0E]/92 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
                              aria-label={language === 'id' ? 'Foto sebelumnya' : 'Previous proof image'}
                              data-cursor-label="Previous"
                            ><ChevronLeft size={17} aria-hidden="true" /></button>
                            <button
                              type="button"
                              onClick={() => setSelectedMediaIndex((current) => (current + 1) % selectedProjectGallery.length)}
                              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.12] bg-[#0B0C0E]/78 text-white backdrop-blur-md transition-[background-color,border-color,transform] duration-300 hover:border-white/[0.22] hover:bg-[#0B0C0E]/92 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
                              aria-label={language === 'id' ? 'Foto berikutnya' : 'Next proof image'}
                              data-cursor-label="Next"
                            ><ChevronRight size={17} aria-hidden="true" /></button>
                          </>
                        )}
                      </div>

                      {selectedProjectGallery.length > 1 && (
                        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
                          {selectedProjectGallery.map((image, index) => (
                            <button
                              key={image + '-' + index}
                              type="button"
                              onClick={() => setSelectedMediaIndex(index)}
                              className={[
                                'group relative aspect-[4/3] overflow-hidden rounded-xl border transition-[border-color,opacity,transform] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red',
                                selectedMediaIndex === index ? 'border-brand-red opacity-100' : 'border-white/[0.08] opacity-60 hover:border-white/[0.18] hover:opacity-100'
                              ].join(' ')}
                              aria-label={(language === 'id' ? 'Tampilkan foto ' : 'Show proof image ') + (index + 1)}
                              aria-pressed={selectedMediaIndex === index}
                              data-cursor-label="View"
                            >
                              <img src={image} alt="" onError={handleCaseStudyImageError} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                            </button>
                          ))}
                        </div>
                      )}

                    </div>
                  </aside>

                  <section className="min-h-0 overflow-visible overscroll-contain px-4 py-6 sm:px-6 sm:py-7 lg:overflow-y-auto lg:px-8 lg:py-8" aria-label={language === 'id' ? 'Detail studi kasus' : 'Case study details'}>
                    <div className="mx-auto max-w-3xl space-y-8 sm:space-y-10">
                      <section id="case-study-modal-summary" aria-labelledby="case-study-overview-heading">
                        <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-brand-red">{language === 'id' ? 'Ringkasan Proyek' : 'Project Context'}</span>
                        <h2 id="case-study-overview-heading" className="mt-2 max-w-2xl text-2xl sm:text-3xl lg:text-[2.65rem] font-display font-bold leading-[1.08] tracking-[-0.035em] text-white">{language === 'id' ? 'Konteks, ruang lingkup, dan hasil.' : 'Context, scope, and outcome.'}</h2>
                        <p className="mt-4 text-sm sm:text-[0.98rem] leading-[1.85] text-[#C2C7D1] font-light">{selectedCaseStudyNarrative?.context || (language === 'id' ? selectedProject.descId : selectedProject.desc)}</p>

                        <div className="mt-6 rounded-[22px] border border-white/[0.08] bg-white/[0.018] p-4 sm:p-5">
                          <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                              <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#6F7480]">{language === 'id' ? 'Profil pekerjaan' : 'Engagement profile'}</span>
                              <p className="mt-1 text-xs text-[#8A909D]">{language === 'id' ? 'Gambaran singkat mengenai konteks dan cakupan proyek.' : 'A compact view of the project context and delivery scope.'}</p>
                            </div>
                            <span className="shrink-0 rounded-full border border-brand-red/20 bg-brand-red/[0.06] px-2.5 py-1 text-[9px] font-mono font-semibold uppercase tracking-[0.08em] text-brand-red">
                              {selectedProject.pillar}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {[
                              { label: language === 'id' ? 'Klien' : 'Client', value: selectedProject.client },
                              { label: language === 'id' ? 'Industri' : 'Industry', value: selectedProject.industry },
                              { label: language === 'id' ? 'Layanan' : 'Service', value: selectedProject.service },
                              { label: language === 'id' ? 'Tahun' : 'Year', value: selectedProject.year },
                              { label: language === 'id' ? 'Output' : 'Deliverables', value: String(selectedProject.deliverables.length) + (language === 'id' ? ' item' : ' items') },
                              { label: language === 'id' ? 'Teknologi' : 'Technologies', value: String(selectedProject.technologies.length) + (language === 'id' ? ' tools' : ' tools') },
                            ].map((item) => (
                              <div key={item.label} className="min-w-0 rounded-xl border border-white/[0.06] bg-black/10 px-3 py-3">
                                <span className="block text-[8px] font-mono uppercase tracking-[0.1em] text-[#6F7480]">{item.label}</span>
                                <span className="mt-1 block whitespace-normal break-words text-xs font-medium leading-snug text-white" title={item.value}>{item.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {selectedProject.deliverables.length > 0 && (
                          <div className="mt-5">
                            <div className="mb-2.5 flex items-center justify-between gap-3">
                              <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#6F7480]">{language === 'id' ? 'Ruang lingkup utama' : 'Core scope'}</span>
                              <span className="text-[9px] font-mono text-[#6F7480]">{selectedProject.deliverables.length} {language === 'id' ? 'output' : 'outputs'}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.deliverables.map((item, idx) => (
                                <span key={item + '-' + idx} className="rounded-full border border-white/[0.08] bg-white/[0.018] px-3 py-1.5 text-[10px] leading-snug text-[#C0C5CF]">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </section>

                      {selectedCaseStudyNarrative && (
                        <div className="space-y-5">
                          <section className="rounded-[22px] border border-white/[0.08] bg-white/[0.018] p-5 sm:p-6" aria-labelledby="case-study-challenge-heading">
                            <div className="mb-4 flex items-start gap-3">
                              <span className="tabular-nums text-[10px] font-mono font-semibold text-brand-red">01</span>
                              <div>
                                <h3 id="case-study-challenge-heading" className="text-xl sm:text-2xl font-display font-semibold tracking-[-0.02em] text-white">{language === 'id' ? 'Tantangan Klien & Diagnosis Masalah' : 'Client Challenge & Problem Diagnosis'}</h3>
                                <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.1em] text-[#6F7480]">{language === 'id' ? 'Masalah, dampak operasional, dan hal yang perlu diselesaikan' : 'The problem, operational friction, and what needed to change'}</p>
                              </div>
                            </div>
                            <p className="text-sm sm:text-[0.96rem] leading-[1.9] text-[#B8BEC9] font-light">{selectedCaseStudyNarrative.challenge}</p>
                            <div className="mt-5 grid grid-cols-1 gap-3">
                              {selectedCaseStudyNarrative.diagnosis.map((detail, idx) => (
                                <article key={detail.title} className="rounded-2xl border border-white/[0.06] bg-black/10 p-4 sm:p-5">
                                  <div className="flex items-start gap-3">
                                    <span className="mt-0.5 text-[10px] font-mono tabular-nums text-brand-red">{String(idx + 1).padStart(2, '0')}</span>
                                    <div className="min-w-0">
                                      <h4 className="text-sm sm:text-base font-semibold leading-6 text-white">{detail.title}</h4>
                                      <p className="mt-2 text-sm leading-7 text-[#929AA7]">{detail.body}</p>
                                    </div>
                                  </div>
                                </article>
                              ))}
                            </div>
                            <div className="mt-5 rounded-2xl border border-white/[0.06] bg-black/10 p-4 sm:p-5">
                              <h4 className="text-sm font-semibold text-white">{language === 'id' ? 'Sasaran pengerjaan' : 'Project objectives'}</h4>
                              <div className="mt-3 space-y-3">
                                {selectedCaseStudyNarrative.objectives.map((objective, idx) => (
                                  <div key={objective} className="flex items-start gap-3">
                                    <CheckCircle2 size={15} className="mt-1 shrink-0 text-brand-red" aria-hidden="true" />
                                    <p className="text-sm leading-7 text-[#A7AEB9]">{objective}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </section>

                          <section className="rounded-[22px] border border-brand-red/20 bg-brand-red/[0.035] p-5 sm:p-6" aria-labelledby="case-study-solution-heading">
                            <div className="mb-4 flex items-start gap-3">
                              <span className="tabular-nums text-[10px] font-mono font-semibold text-brand-red">02</span>
                              <div>
                                <h3 id="case-study-solution-heading" className="text-xl sm:text-2xl font-display font-semibold tracking-[-0.02em] text-white">{language === 'id' ? 'Solusi Kapitech & Alasan Strategis' : 'Kapitech Solution & Strategic Rationale'}</h3>
                                <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.1em] text-[#6F7480]">{language === 'id' ? 'Apa yang dipilih, cara kerjanya, dan mengapa relevan' : 'What was selected, how it works, and why it matters'}</p>
                              </div>
                            </div>
                            <p className="text-sm sm:text-[0.96rem] leading-[1.9] text-[#C1C6D0] font-light">{selectedCaseStudyNarrative.solution}</p>
                            <div className="mt-5 space-y-3">
                              {selectedCaseStudyNarrative.solutionLogic.map((detail, idx) => (
                                <article key={detail.title} className="grid gap-2 rounded-2xl border border-white/[0.07] bg-black/10 p-4 sm:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)] sm:gap-5 sm:p-5">
                                  <div className="flex items-start gap-3">
                                    <span className="mt-0.5 text-[10px] font-mono tabular-nums text-brand-red">{String(idx + 1).padStart(2, '0')}</span>
                                    <h4 className="text-sm font-semibold leading-6 text-white">{detail.title}</h4>
                                  </div>
                                  <p className="text-sm leading-7 text-[#929AA7]">{detail.body}</p>
                                </article>
                              ))}
                            </div>
                          </section>

                          <section className="rounded-[22px] border border-white/[0.08] bg-white/[0.018] p-5 sm:p-6" aria-labelledby="case-study-execution-heading">
                            <div className="mb-4 flex items-start gap-3">
                              <span className="tabular-nums text-[10px] font-mono font-semibold text-brand-red">03</span>
                              <div>
                                <h3 id="case-study-execution-heading" className="text-xl sm:text-2xl font-display font-semibold tracking-[-0.02em] text-white">{language === 'id' ? 'Proses Pengerjaan, Tahap demi Tahap' : 'Execution Process, Step by Step'}</h3>
                                <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.1em] text-[#6F7480]">{language === 'id' ? 'Dari perumusan masalah hingga pemeriksaan dan penyerahan' : 'From problem framing through review and handover'}</p>
                              </div>
                            </div>
                            <div className="space-y-3">
                              {selectedCaseStudyNarrative.process.map((step, idx) => (
                                <article key={step.title} className="grid gap-3 rounded-2xl border border-white/[0.06] bg-black/10 p-4 sm:grid-cols-[minmax(0,0.36fr)_minmax(0,1fr)] sm:gap-5 sm:p-5">
                                  <div>
                                    <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-brand-red">{language === 'id' ? 'Tahap' : 'Stage'} {String(idx + 1).padStart(2, '0')}</span>
                                    <h4 className="mt-2 text-sm font-semibold leading-6 text-white">{step.title.replace(/^\d+\s*·\s*/, '')}</h4>
                                  </div>
                                  <p className="text-sm leading-7 text-[#929AA7]">{step.body}</p>
                                </article>
                              ))}
                            </div>
                          </section>

                          <section className="rounded-[22px] border border-white/[0.08] bg-white/[0.018] p-5 sm:p-6" aria-labelledby="case-study-deliverables-heading">
                            <div className="mb-4 flex items-start gap-3">
                              <span className="tabular-nums text-[10px] font-mono font-semibold text-brand-red">04</span>
                              <div>
                                <h3 id="case-study-deliverables-heading" className="text-xl sm:text-2xl font-display font-semibold tracking-[-0.02em] text-white">{language === 'id' ? 'Deliverables & Rincian Hasil Kerja' : 'Deliverables & Delivery Details'}</h3>
                                <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.1em] text-[#6F7480]">{language === 'id' ? 'Bukan hanya daftar output, tetapi fungsi tiap hasil kerja' : 'Not just a list of outputs, but the role each deliverable plays'}</p>
                              </div>
                            </div>
                            {selectedCaseStudyNarrative.deliverables.length ? (
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {selectedCaseStudyNarrative.deliverables.map((deliverable, idx) => (
                                  <article key={deliverable.title} className="min-w-0 rounded-2xl border border-white/[0.06] bg-black/10 p-4 sm:p-5">
                                    <div className="flex items-center justify-between gap-3">
                                      <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#6F7480]">{language === 'id' ? 'Hasil kerja' : 'Deliverable'}</span>
                                      <span className="text-[10px] font-mono tabular-nums text-brand-red">{String(idx + 1).padStart(2, '0')}</span>
                                    </div>
                                    <h4 className="mt-3 text-sm font-semibold leading-6 text-white">{deliverable.title}</h4>
                                    <p className="mt-2 text-sm leading-7 text-[#929AA7]">{deliverable.body}</p>
                                  </article>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm leading-7 text-[#929AA7]">{language === 'id' ? 'Rincian output belum diisi dalam data proyek yang tersedia.' : 'The project record does not yet include detailed outputs.'}</p>
                            )}
                          </section>

                          <section className="rounded-[22px] border border-white/[0.08] bg-white/[0.018] p-5 sm:p-6" aria-labelledby="case-study-tools-heading">
                            <div className="mb-4 flex items-start gap-3">
                              <span className="tabular-nums text-[10px] font-mono font-semibold text-brand-red">05</span>
                              <div>
                                <h3 id="case-study-tools-heading" className="text-xl sm:text-2xl font-display font-semibold tracking-[-0.02em] text-white">{language === 'id' ? 'Tools, Teknologi & Pertimbangan Teknis' : 'Tools, Technologies & Technical Considerations'}</h3>
                                <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.1em] text-[#6F7480]">{language === 'id' ? 'Peran setiap alat di dalam solusi' : 'The role each tool plays in the solution'}</p>
                              </div>
                            </div>
                            {selectedCaseStudyNarrative.technologies.length ? (
                              <div className="space-y-4">
                                {selectedCaseStudyNarrative.technologies.map((technology) => (
                                  <div key={technology.title} className="grid gap-2 border-b border-white/[0.06] pb-4 last:border-b-0 last:pb-0 sm:grid-cols-[minmax(0,0.35fr)_minmax(0,1fr)] sm:gap-5">
                                    <span className="inline-flex h-fit max-w-full break-words rounded-full border border-white/[0.08] bg-white/[0.018] px-3 py-1.5 text-[10px] font-mono text-[#C4CAD3]">{technology.title}</span>
                                    <p className="text-sm leading-7 text-[#929AA7]">{technology.body}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm leading-7 text-[#929AA7]">{language === 'id' ? 'Daftar tools belum tersedia.' : 'No tools have been listed yet.'}</p>
                            )}
                          </section>

                          <section className="rounded-[22px] border border-white/[0.08] bg-white/[0.018] p-5 sm:p-6" aria-labelledby="case-study-impact-heading">
                            <div className="mb-4 flex items-start gap-3">
                              <span className="tabular-nums text-[10px] font-mono font-semibold text-brand-red">06</span>
                              <div>
                                <h3 id="case-study-impact-heading" className="text-xl sm:text-2xl font-display font-semibold tracking-[-0.02em] text-white">{language === 'id' ? 'Outcome, Dampak & Bukti' : 'Outcome, Client Impact & Evidence'}</h3>
                                <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.1em] text-[#6F7480]">{language === 'id' ? 'Pisahkan hasil yang tercatat dari manfaat yang dituju' : 'Separate recorded outcomes from intended benefits'}</p>
                              </div>
                            </div>
                            <p className="text-sm sm:text-[0.96rem] leading-[1.9] text-[#B8BEC9] font-light">{selectedCaseStudyNarrative.impact}</p>
                            {selectedProject.impact.length > 0 ? (
                              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                {selectedProject.impact.map((metric, idx) => (
                                  <div key={metric.label + '-' + idx} className="relative min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-black/10 p-4 sm:p-5">
                                    <span className="block break-words text-2xl sm:text-3xl font-display font-bold tracking-[-0.03em] text-white">{metric.value}</span>
                                    <span className="mt-2 block text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.08em] leading-relaxed text-[#8A909D]">{metric.label}</span>
                                  </div>
                                ))}
                              </div>
                            ) : null}
                            {selectedCaseStudyNarrative.impactDetails.length ? (
                              <div className="mt-5 grid grid-cols-1 gap-3">
                                {selectedCaseStudyNarrative.impactDetails.map((detail) => (
                                  <article key={detail.title} className="rounded-2xl border border-white/[0.06] bg-black/10 p-4">
                                    <h4 className="text-sm font-semibold leading-6 text-white">{detail.title}</h4>
                                    <p className="mt-2 text-sm leading-7 text-[#929AA7]">{detail.body}</p>
                                  </article>
                                ))}
                              </div>
                            ) : null}
                            <p className="mt-5 rounded-2xl border border-dashed border-white/[0.1] bg-black/10 p-4 text-xs leading-6 text-[#818995]">{selectedCaseStudyNarrative.evidenceNote}</p>
                            <p className="mt-4 text-sm leading-7 text-[#929AA7]">{selectedCaseStudyNarrative.relevance}</p>
                          </section>
                        </div>
                      )}
                      <section className="rounded-[22px] border border-brand-red/20 bg-gradient-to-br from-brand-red/[0.12] via-white/[0.018] to-transparent p-5 sm:p-6 lg:p-7">
                        <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-brand-red">{language === 'id' ? 'Punya tantangan serupa?' : 'A similar challenge?'}</span>
                        <h3 className="mt-1.5 text-lg sm:text-xl font-display font-semibold text-white">{language === 'id' ? 'Mari pecahkan dari konteks bisnisnya.' : 'Let’s solve it from the business context.'}</h3>
                        <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#8A909D] font-light">{language === 'id' ? 'Bahas kebutuhan Anda bersama tim Kapitech dan tentukan ruang lingkup yang paling relevan.' : 'Talk through your needs with Kapitech and define the scope that fits the problem.'}</p>
                        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                          <Link
                            to={'/work/' + projectSlug(selectedProject)}
                            onClick={() => closeCaseStudy()}
                            className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-white/[0.18] hover:bg-white/[0.08] sm:w-auto"
                          >
                            <span>{language === 'id' ? 'Buka Case Study Penuh' : 'Open Full Case Study'}</span>
                            <ArrowUpRight size={14} />
                          </Link>
                          <Link
                            to={'/contact?service=' + encodeURIComponent(selectedProject.service) + '#project-inquiry-form'}
                            onClick={() => closeCaseStudy()}
                            className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-brand-red px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-brand-red/20 transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#FF1E27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1116] sm:w-auto"
                          >
                            <span>{language === 'id' ? 'Jadwalkan Konsultasi' : 'Schedule Consultation'}</span>
                            <ArrowUpRight size={14} />
                          </Link>
                        </div>
                      </section>
                    </div>
                  </section>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </WorkModalPortal>


    </div>
  );
};