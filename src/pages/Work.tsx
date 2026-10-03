import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import PatternWaves from '../components/ui/PatternWaves/PatternWavesTyped';
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

const WorkModalPortal = ({ children }: { children: React.ReactNode }) => {
  if (typeof document === 'undefined') return null;
  return createPortal(children, document.body);
};
import { fetchServerCmsProjects, getCmsProjects } from '../lib/cmsStore';

export const Work = () => {
  const { t, language } = useLanguage();
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(() => getCmsProjects());
  const [activePillar, setActivePillar] = useState<string>('All');
  const [activeService, setActiveService] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [featuredIndex, setFeaturedIndex] = useState<number>(0);
  const [isSpotlightPaused, setIsSpotlightPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const spotlightRef = React.useRef<HTMLElement>(null);
  const [visibleCount, setVisibleCount] = useState<number>(12);

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

  useEffect(() => {
    if (!selectedProject) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedProject(null);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProject]);

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
    return projectsList.filter(p => p.featured);
  }, [projectsList]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncReducedMotion = () => setReducedMotion(media.matches);

    syncReducedMotion();
    media.addEventListener('change', syncReducedMotion);

    return () => media.removeEventListener('change', syncReducedMotion);
  }, []);

  useEffect(() => {
    setFeaturedIndex((current) =>
      Math.min(current, Math.max(0, featuredProjects.length - 1)),
    );
  }, [featuredProjects.length]);

  useEffect(() => {
    if (reducedMotion || isSpotlightPaused || featuredProjects.length <= 1) return;

    const interval = setInterval(() => {
      setFeaturedIndex(prev => (prev + 1) % featuredProjects.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [featuredProjects.length, isSpotlightPaused, reducedMotion]);

  const serviceOptions = useMemo(() => {
    if (activePillar === 'Visual Experience') {
      return [
        'All',
        'UI/UX Design',
        'Video Production',
        '2D Animation',
        'Branding & Identity',
        'Motion & Graphic Design',
        'Creative Design',
        '3D Visualization'
      ];
    }
    if (activePillar === 'Innovation Development') {
      return [
        'All',
        'Company Profile Website',
        'E-Commerce Website',
        'Web Application',
        'ERP / CRM System',
        'IT Support & Infrastructure'
      ];
    }
    return [
      'All',
      'UI/UX Design',
      'Video Production',
      '2D Animation',
      'Branding & Identity',
      'Motion & Graphic Design',
      'Creative Design',
      '3D Visualization',
      'Company Profile Website',
      'E-Commerce Website',
      'Web Application',
      'ERP / CRM System',
      'IT Support & Infrastructure'
    ];
  }, [activePillar]);

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

    if (activePillar !== 'All') {
      list = list.filter(p => p.pillar === activePillar);
    }

    if (activeService !== 'All') {
      list = list.filter(p => p.service === activeService);
    }

    if (searchQuery.trim()) {
      const fuse = new Fuse(list, {
        keys: ['title', 'client', 'industry', 'service', 'pillar', 'desc', 'descId', 'technologies', 'deliverables'],
        threshold: 0.35,
      });
      list = fuse.search(searchQuery).map(res => res.item);
    }

    return list;
  }, [projectsList, activePillar, activeService, searchQuery]);

  const currentFeatured = featuredProjects[featuredIndex] || projectsList[0];

  const featuredPositionLabel =
    language === 'id'
      ? `${featuredIndex + 1} dari ${featuredProjects.length}: ${currentFeatured?.title ?? ''}`
      : `${featuredIndex + 1} of ${featuredProjects.length}: ${currentFeatured?.title ?? ''}`;
  const featuredProgress = `${((featuredIndex + 1) / Math.max(featuredProjects.length, 1)) * 100}%`;

  return (
    <div className="bg-[#0B0C0E] text-white min-h-screen selection:bg-brand-red selection:text-white relative" role="main">
      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-36 md:pt-40 pb-16 sm:pb-20 px-4 sm:px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <PatternWaves
            preset="lines"
            color="#E50914"
            backgroundColor="#0B0C0E"
            opacity={0.48}
            fade="edges"
            fadeSize={0.72}
            interactive
            cursorSize={48}
            cursorStrength={0.42}
            speed={0.2}
            scale={1.08}
            depth={0.68}
            shine={0.48}
            contrast={1.04}
            intro
          />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/42 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="kapi-section-label mb-5">
              {language === 'id' ? 'Koleksi Portofolio & Studi Kasus' : 'Portfolio & Case Studies'}
            </span>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] font-display font-bold tracking-[-0.045em] leading-[1.03] text-white mb-6"
            >
              {language === 'id' ? 'Karya Nyata. Dampak Nyata.' : 'Crafted for Real Impact.'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="text-base sm:text-lg text-[#8A909D] font-light leading-relaxed mb-6"
            >
              {language === 'id'
                ? `Jelajahi ${projectsList.length} studi kasus dan portofolio komprehensif kami yang mencakup pilar Visual Experience dan Innovation Development untuk para pemimpin industri global.`
                : `Explore our portfolio of ${projectsList.length} comprehensive case studies spanning Visual Experience and Innovation Development across global industry leaders.`
              }
            </motion.p>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#8A909D]">
              <span className="px-3 py-1.5 rounded-full bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                <span>{projectsList.length} {language === 'id' ? 'Studi Kasus Lengkap' : 'Case Studies Verified'}</span>
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl">
                {serviceOptions.filter((item) => item !== 'All').length} {language === 'id' ? 'Layanan Spesialisasi' : 'Core Disciplines'}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl">
                {language === 'id' ? 'Klien Global & Indonesia' : 'Global & Local Enterprise'}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Spotlight Carousel */}
      {currentFeatured && (
        <section
          ref={spotlightRef}
          className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-12 bg-[#0B0C0E]"
          role="region"
          aria-roledescription="carousel"
          aria-label={language === 'id' ? 'Sorotan studi kasus unggulan' : 'Featured case studies'}
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
                  {language === 'id' ? 'Sorotan Studi Kasus Unggulan' : 'Featured Case Study Spotlight'}
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
                  {String(featuredIndex + 1).padStart(2, '0')} / {String(featuredProjects.length).padStart(2, '0')}
                </div>
                <button
                  onClick={() => setFeaturedIndex(prev => (prev - 1 + featuredProjects.length) % featuredProjects.length)}
                  className="w-10 h-10 min-w-10 min-h-10 rounded-full border border-white/[0.08] bg-white/[0.018] hover:bg-white/[0.06] hover:border-white/[0.14] flex items-center justify-center text-[#8A909D] hover:text-white transition-[background-color,border-color,color] duration-300"
                  aria-label={language === 'id' ? 'Studi kasus unggulan sebelumnya' : 'Previous featured case study'}
                  data-cursor-label="Previous"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setFeaturedIndex(prev => (prev + 1) % featuredProjects.length)}
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
                  onClick={() => setSelectedProject(currentFeatured)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedProject(currentFeatured);
                      return;
                    }

                    if (event.key === 'ArrowLeft' && featuredProjects.length > 1) {
                      event.preventDefault();
                      setFeaturedIndex(prev => (prev - 1 + featuredProjects.length) % featuredProjects.length);
                      return;
                    }

                    if (event.key === 'ArrowRight' && featuredProjects.length > 1) {
                      event.preventDefault();
                      setFeaturedIndex(prev => (prev + 1) % featuredProjects.length);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-roledescription="slide"
                  aria-label={featuredPositionLabel}
                  data-cursor-label="Open"
                  className="cursor-pointer group relative overflow-hidden rounded-[22px] border border-white/[0.07] bg-[#0F1116]/82 hover:border-brand-red/28 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/40 transition-[background-color,border-color,box-shadow] duration-300 grid grid-cols-1 lg:grid-cols-12"
                >
                  <div className="lg:col-span-7 relative min-h-[260px] sm:min-h-[360px] lg:min-h-[480px] overflow-hidden bg-[#0B0C0E]">
                    <img
                      src={currentFeatured.image}
                      alt={currentFeatured.title}
                      className="block w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.035] lg:scale-[1.025] lg:group-hover:scale-[1.055]"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E]/92 via-[#0B0C0E]/20 to-transparent" />
                    <div className="absolute top-4 left-4 sm:top-5 sm:left-5 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-[#0B0C0E]/72 backdrop-blur-md border border-white/[0.1] text-[10px] font-mono font-semibold uppercase tracking-[0.12em] text-white">
                        {language === 'id' ? 'Unggulan' : 'Featured'}
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
                {featuredProjects.length} {language === 'id' ? 'studi kasus unggulan' : 'featured case studies'}
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
        <div className="max-w-7xl mx-auto rounded-2xl border border-white/[0.08] bg-transparent px-3 py-2.5 sm:px-3.5 sm:py-3">
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
                {(activePillar !== 'All' || activeService !== 'All' || searchQuery) && (
                  <button
                    onClick={() => {
                      setActivePillar('All');
                      setActiveService('All');
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
                className="min-w-0 w-fit max-w-full flex-none overflow-x-auto rounded-full border border-white/[0.07] bg-white/[0.018] p-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
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
                      onClick={() => {
                        if (suppressServiceClickRef.current) {
                          suppressServiceClickRef.current = false;
                          return;
                        }
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
                  className="w-full [appearance:textfield] [&::-webkit-search-cancel-button]:appearance-none bg-white/[0.018] border border-white/[0.08] rounded-full pl-10 pr-10 py-1.5 text-base sm:text-xs text-white placeholder:text-[#8A909D] focus:outline-none focus:border-brand-red transition-[border-color,background-color,box-shadow] duration-200 font-mono min-h-[44px] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
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
                    onClick={() => {
                      if (suppressServiceClickRef.current) {
                        suppressServiceClickRef.current = false;
                        return;
                      }
                      setActiveService(srv);
                      setVisibleCount(12);
                    }}
                    aria-pressed={activeService === srv}
                    data-cursor-label="Filter"
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono whitespace-nowrap transition-[background-color,border-color,color,box-shadow] duration-200 shrink-0 border min-h-[38px] sm:min-h-[30px] flex items-center ${
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
                  <motion.article
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => setSelectedProject(project)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedProject(project);
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
                        <div className="flex min-w-0 items-center justify-between gap-4">
                          <div className="min-w-0">
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
                  </motion.article>
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
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#0B0C0E]/82 backdrop-blur-2xl backdrop-saturate-150"
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-modal-title"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedProject(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-5xl bg-[#0F1116]/94 backdrop-blur-2xl border border-white/[0.08] rounded-3xl overflow-hidden shadow-[0_24px_70px_-35px_rgba(0,0,0,0.9)] my-3 sm:my-8 max-h-[calc(100dvh-1.5rem)] sm:max-h-[92vh] flex flex-col"
            >
              {/* Modal Header Bar */}
              <div className="sticky top-0 z-20 flex items-center justify-between px-5 sm:px-7 py-5 sm:py-6 bg-[#0F1116]/96 backdrop-blur-2xl border-b border-white/[0.08] gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-red/10 border border-brand-red/30 text-brand-red text-[11px] font-mono font-medium">
                      {selectedProject.pillar}
                    </span>
                    <span className="text-[11px] font-mono text-[#8A909D] truncate">
                      {selectedProject.service}
                    </span>
                  </div>
                  <h3 id="case-study-modal-title" className="text-sm sm:text-base font-display font-bold text-white truncate">
                    {selectedProject.title} <span className="text-[#8A909D] font-normal">({selectedProject.client})</span>
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/[0.025] hover:bg-white/[0.06] border border-white/[0.09] flex items-center justify-center text-[#8A909D] hover:text-white transition-[background-color,border-color,color] duration-300 shrink-0"
                  aria-label="Close case study modal"
                  data-cursor-label="Close"
                  autoFocus
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Scrollable Content */}
              <div className="overflow-y-auto px-5 sm:px-7 py-6 sm:py-7 space-y-8">
                {/* Hero Banner */}
                <div className="relative aspect-[16/10] sm:aspect-auto sm:h-80 md:h-96 rounded-2xl overflow-hidden bg-[#0B0C0E] border border-white/[0.08]">
                  <img 
                    src={selectedProject.image} 
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6">
                    <span className="text-xs font-mono text-[#8A909D] block mb-1">
                      {selectedProject.client} • {selectedProject.industry} • {selectedProject.year}
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white">
                      {selectedProject.title}
                    </h2>
                  </div>
                </div>

                {/* Measurable Impact Metrics Grid */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-brand-red mb-3 font-semibold">
                    {language === 'id' ? 'Hasil & Dampak Terukur' : 'Key Performance & Impact Metrics'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedProject.impact.map((item, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-white/[0.018] border border-white/[0.07]">
                        <span className="text-2xl sm:text-3xl font-display font-bold text-white block mb-1">
                          {item.value}
                        </span>
                        <span className="text-xs font-mono text-[#8A909D] block">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Challenge & Solution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-5 rounded-2xl bg-white/[0.018] border border-white/[0.07]">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-brand-red mb-2 font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-red" />
                      <span>{language === 'id' ? 'Tantangan Bisnis' : 'The Challenge'}</span>
                    </h4>
                    <p className="text-sm text-[#8A909D] leading-relaxed font-light">
                      {language === 'id' ? selectedProject.challengeId : selectedProject.challenge}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.018] border border-white/[0.07]">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-brand-red mb-2 font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-red" />
                      <span>{language === 'id' ? 'Solusi & Rekayasa Kapitech' : 'Our Solution & Execution'}</span>
                    </h4>
                    <p className="text-sm text-[#8A909D] leading-relaxed font-light">
                      {language === 'id' ? selectedProject.solutionId : selectedProject.solution}
                    </p>
                  </div>
                </div>

                {/* Deliverables & Tech Stack */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.018] p-5">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#8A909D] mb-3 font-semibold">
                      {language === 'id' ? 'Hasil Kerja & Serah Terima' : 'Core Deliverables'}
                    </h4>
                    <ul className="space-y-2">
                      {selectedProject.deliverables.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 text-xs text-white font-light">
                          <CheckCircle2 size={14} className="text-brand-red shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.018] p-5">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#8A909D] mb-3 font-semibold">
                      {language === 'id' ? 'Teknologi & Perangkat' : 'Tech Stack & Tooling'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full bg-white/[0.018] border border-white/[0.08] text-xs font-mono text-[#8A909D]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer CTA inside Modal */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-brand-red/[0.11] via-white/[0.018] to-white/[0.018] border border-brand-red/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-display font-bold text-white">
                      {language === 'id' ? 'Tertarik membangun proyek serupa?' : 'Looking to build a similar project?'}
                    </h4>
                    <p className="text-xs text-[#8A909D] font-light">
                      {language === 'id' ? 'Diskusikan kebutuhan produk Anda bersama tim arsitek dan desainer kami.' : 'Schedule a discovery session with our tech leads and creative directors.'}
                    </p>
                  </div>
                  <Link
                    to="/contact"
                    onClick={() => setSelectedProject(null)}
                    className="px-6 py-3 rounded-full bg-brand-red hover:bg-[#FF1E27] text-white text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 flex items-center gap-2 shadow-lg shadow-brand-red/20 min-h-[44px]"
                  >
                    <span>{language === 'id' ? 'Mulai Konsultasi' : 'Start Project'}</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        </AnimatePresence>
      </WorkModalPortal>
    </div>
  );
};
