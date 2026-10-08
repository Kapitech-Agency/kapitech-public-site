import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { 
  Menu, 
  X, 
  Instagram, 
  ChevronRight, 
  ChevronDown, 
  Phone, 
  Mail, 
  ArrowUpRight,
  Layers,
  Sparkles,
  Palette,
  Code2,
  Cpu,
  Search as SearchIcon
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '@/src/lib/LanguageContext';
import { allSolutionsAndServices } from '@/src/data/servicesData';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuTriggerRef = React.useRef<HTMLButtonElement>(null);
  const wasMobileMenuOpenRef = useRef(false);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);


  // Lock background scroll and expose drawer state for other floating mobile UI.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsServicesDropdownOpen(false);
        setIsMobileServicesOpen(false);
      }
    };

    if (isMenuOpen) {
      wasMobileMenuOpenRef.current = true;
      document.body.dataset.kapiMobileMenuOpen = 'true';
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else if (wasMobileMenuOpenRef.current) {
      wasMobileMenuOpenRef.current = false;
      delete document.body.dataset.kapiMobileMenuOpen;
      window.requestAnimationFrame(() => mobileMenuTriggerRef.current?.focus());
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      if (!isMenuOpen) {
        delete document.body.dataset.kapiMobileMenuOpen;
      }
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  // Close menu & dropdown on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsServicesDropdownOpen(false);
    setIsMobileServicesOpen(false);
  }, [location.pathname]);

  const handleMouseEnterServices = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsServicesDropdownOpen(true);
  };

  const handleMouseLeaveServices = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsServicesDropdownOpen(false);
    }, 150);
  };

  // Organize services by categories
  const solutions = allSolutionsAndServices.filter(s => s.category === 'Solutions');
  const branding = allSolutionsAndServices.filter(s => s.category === 'Branding');
  const design = allSolutionsAndServices.filter(s => s.category === 'Design');
  const development = allSolutionsAndServices.filter(s => s.category === 'Development');
  const dedicatedServiceCount = branding.length + design.length + development.length;

  const isWorkActive = location.pathname === '/work' || location.pathname.startsWith('/work/');
  const isInsightsActive = location.pathname === '/insights' || location.pathname.startsWith('/insights/');
  const isAboutActive = location.pathname === '/about' || location.pathname.startsWith('/about/');
  const isCareersActive = location.pathname === '/careers' || location.pathname.startsWith('/careers/');
  const isServicesActive = location.pathname.startsWith('/services') || location.pathname.startsWith('/solutions');

  // Shared navbar material used by the scrolled navbar and mobile controls.
  const navbarGlassMaterial = "bg-[#0B0C0E]/92 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-[#0B0C0E]/84";
  // Dropdown uses the same dark glass language, with stronger blur and a lighter surface.
  const dropdownGlassMaterial = "bg-[#0B0C0E]/82 backdrop-blur-sm backdrop-saturate-110 supports-[backdrop-filter]:bg-[#0B0C0E]/76";
  const controlGlassMaterial = "bg-[#0B0C0E]/42 backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-[#0B0C0E]/34";

  const desktopNavItemClass = (active: boolean) =>
    cn(
      "group relative inline-flex items-center h-9 px-3 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em] leading-none border transition-[background-color,border-color,color,box-shadow] duration-300",
      active
        ? "text-white border-brand-red/25 bg-white/[0.05] backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(230,57,70,0.16),0_6px_18px_rgba(0,0,0,0.08)]"
        : "text-[#8A909D] border-transparent bg-transparent hover:text-white hover:border-white/[0.08] hover:bg-white/[0.035] hover:backdrop-blur-xl hover:backdrop-saturate-150"
    );

  return (
    <>
      <AnimatePresence>
        {isServicesDropdownOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 z-40 hidden md:block pointer-events-none"
            aria-hidden="true"
            style={{
              top: isScrolled ? '72px' : '88px',
              height: '480px',
              backgroundColor: 'rgba(11, 12, 14, 0.26)',
              backdropFilter: 'blur(36px) saturate(1.18) brightness(0.82)',
              WebkitBackdropFilter: 'blur(36px) saturate(1.18) brightness(0.82)',
            }}
          />
        )}
      </AnimatePresence>

      <nav
        className={cn(
          "kapi-public-navbar fixed top-0 left-0 w-full z-50 transition-[background-color,border-color,box-shadow,padding] duration-500 border-b pt-[env(safe-area-inset-top)]",
          isScrolled
              ? `${navbarGlassMaterial} py-3 sm:py-3.5 ${isServicesDropdownOpen ? "border-transparent shadow-none" : "border-[#262930]/80 shadow-[0_12px_36px_rgba(0,0,0,0.28)]"}`
              : isServicesDropdownOpen
                ? `${navbarGlassMaterial} py-4 sm:py-5 border-transparent shadow-none`
                : "bg-transparent backdrop-blur-none py-4 sm:py-5 border-transparent"
        )}
      >
        <div
          className={cn(
            "relative z-20 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 flex min-h-[48px] shrink-0 items-center justify-between",
          )}
        >
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group py-1 shrink-0" aria-label="Kapitech Agency Home">
            <img 
              src="https://raw.githubusercontent.com/Kapitech-Agency/Kapitech-Agency.github.io/main/public/white.png" 
              alt="Kapitech Agency" 
              className="h-6 sm:h-[22px] md:h-6 w-auto max-h-7 object-contain transition-opacity duration-300 group-hover:opacity-90 shrink-0 select-none"
            />
            {/* Hidden strictly on mobile view to maximize space and preserve top-tier minimal aesthetics */}
            <span className="hidden lg:inline font-display font-bold text-[15px] sm:text-base md:text-[17px] tracking-[-0.02em] text-white group-hover:text-brand-red transition-colors whitespace-nowrap">
              Kapitech Agency
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-7 lg:gap-9">
            <div className="flex items-center gap-7 lg:gap-9">
              
              {/* Work Link */}
              <Link
                to="/work"
                className={desktopNavItemClass(isWorkActive)}
                aria-current={isWorkActive ? 'page' : undefined}
              >
                <span className="relative z-10">{t('nav.work')}</span>
              </Link>

              {/* SERVICES DROPDOWN TRIGGER */}
              <div 
                className="relative flex items-center h-7"
                onMouseEnter={handleMouseEnterServices}
                onMouseLeave={handleMouseLeaveServices}
              >
                <button
                  type="button"
                  onClick={() => setIsServicesDropdownOpen(prev => !prev)}
                  onFocus={handleMouseEnterServices}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      setIsServicesDropdownOpen(false);
                    }
                  }}
                  className={cn(
                    desktopNavItemClass(isServicesActive || isServicesDropdownOpen),
                    "gap-1.5",
                  )}
                  aria-expanded={isServicesDropdownOpen}
                  aria-controls="desktop-services-dropdown"
                  aria-haspopup="true"
                  aria-current={isServicesActive ? 'page' : undefined}
                >
                  <span className="relative z-10">{t('nav.services')}</span>
                  <motion.span
                    className="relative z-10 ml-0.5 flex h-4 w-4 shrink-0 items-center justify-center origin-center"
                    animate={{ rotate: isServicesDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-colors duration-200",
                        isServicesDropdownOpen ? "text-white" : "text-[#8A909D]"
                      )}
                    />
                  </motion.span>
                </button>
              </div>

              <Link to="/industries" className={desktopNavItemClass(location.pathname.startsWith('/industries'))} aria-current={location.pathname.startsWith('/industries') ? 'page' : undefined}><span className="relative z-10">Industries</span></Link>
              <Link to="/clients" className={desktopNavItemClass(location.pathname.startsWith('/clients'))} aria-current={location.pathname.startsWith('/clients') ? 'page' : undefined}><span className="relative z-10">Clients</span></Link>
              <Link to="/resources" className={desktopNavItemClass(location.pathname.startsWith('/resources'))} aria-current={location.pathname.startsWith('/resources') ? 'page' : undefined}><span className="relative z-10">Resources</span></Link>

              {/* Insights Link */}
              <Link
                to="/insights"
                className={desktopNavItemClass(isInsightsActive)}
                aria-current={isInsightsActive ? 'page' : undefined}
              >
                <span className="relative z-10">{t('nav.insights')}</span>
              </Link>

              {/* About Link */}
              <Link
                to="/about"
                className={desktopNavItemClass(isAboutActive)}
                aria-current={isAboutActive ? 'page' : undefined}
              >
                <span className="relative z-10">{t('nav.about')}</span>
              </Link>

              {/* Careers Link */}
              <Link
                to="/careers"
                className={desktopNavItemClass(isCareersActive)}
                aria-current={isCareersActive ? 'page' : undefined}
              >
                <span className="relative z-10">{t('nav.careers')}</span>
              </Link>
            </div>

            {/* Start Project CTA */}
            <Link
              to="/contact"
              className="group relative isolate inline-flex items-center gap-2 h-10 px-5 rounded-full border border-white/[0.1] bg-[#0B0C0E]/34 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-[#0B0C0E]/28 text-[#F3F4F6] text-[11px] font-bold uppercase tracking-[0.13em] transition-[background-color,border-color,color,box-shadow] duration-500 ease-out shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_8px_24px_rgba(0,0,0,0.1)] hover:border-brand-red/50 hover:bg-brand-red/72 hover:text-white hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.13),0_10px_28px_rgba(230,57,70,0.16)]"
              data-cursor-label="Start"
            >

              <span className="relative z-10">{t('nav.startProject')}</span>
              <ChevronRight size={14} className="relative z-10 opacity-70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
            </Link>

            <Link to="/search" aria-label="Search" className={cn(desktopNavItemClass(location.pathname === '/search'), "h-9 w-9 justify-center px-0")}><SearchIcon size={15} /></Link>

            {/* Language Switcher */}
            <div
              className="inline-flex items-center rounded-full border border-white/[0.09] bg-[#0B0C0E]/42 p-1 backdrop-blur-2xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_6px_18px_rgba(0,0,0,0.08)]"
              role="group"
              aria-label="Language"
            >
              <button
                type="button"
                onClick={() => setLanguage('en')}
                aria-pressed={language === 'en'}
                aria-label="Switch to English"
                className={cn(
                  "inline-flex h-8 min-w-[42px] items-center justify-center gap-1.5 rounded-full px-2.5 text-[9px] font-mono font-bold tracking-[0.12em] transition-[background-color,color,box-shadow] duration-200 cursor-pointer",
                  language === 'en'
                    ? "bg-white/[0.09] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]"
                    : "text-[#6F757F] hover:text-white hover:bg-white/[0.035]"
                )}
              >
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full transition-[background-color,box-shadow] duration-200",
                  language === 'en'
                    ? "bg-brand-red shadow-[0_0_8px_rgba(229,9,20,0.65)]"
                    : "bg-[#4E535C]"
                )} aria-hidden="true" />
                <span>EN</span>
              </button>

              <button
                type="button"
                onClick={() => setLanguage('id')}
                aria-pressed={language === 'id'}
                aria-label="Switch to Indonesian"
                className={cn(
                  "inline-flex h-8 min-w-[42px] items-center justify-center gap-1.5 rounded-full px-2.5 text-[9px] font-mono font-bold tracking-[0.12em] transition-[background-color,color,box-shadow] duration-200 cursor-pointer",
                  language === 'id'
                    ? "bg-white/[0.09] text-white shadow-[inset_0_1px 0_rgba(255,255,255,0.07)]"
                    : "text-[#6F757F] hover:text-white hover:bg-white/[0.035]"
                )}
              >
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full transition-[background-color,box-shadow] duration-200",
                  language === 'id'
                    ? "bg-brand-red shadow-[0_0_8px_rgba(229,9,20,0.65)]"
                    : "bg-[#4E535C]"
                )} aria-hidden="true" />
                <span>ID</span>
              </button>
            </div>
          </div>

          {/* Mobile Right Controls: Language Switcher & Hamburger Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 lg:hidden">
            <div
              className="inline-flex items-center gap-0.5 rounded-full border border-white/[0.09] bg-[#0B0C0E]/48 p-1 backdrop-blur-2xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_6px_18px_rgba(0,0,0,0.1)]"
              role="group"
              aria-label="Language"
            >
              <button
                type="button"
                onClick={() => setLanguage('en')}
                aria-pressed={language === 'en'}
                aria-label="Switch to English"
                className={cn(
                  "min-w-[42px] min-h-[38px] rounded-full px-3 text-[10px] font-mono font-bold tracking-[0.1em] transition-[background-color,color,box-shadow] duration-200 flex items-center justify-center gap-1.5 cursor-pointer",
                  language === 'en'
                    ? "bg-white/[0.09] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]"
                    : "text-[#6F757F] hover:bg-white/[0.035] hover:text-white"
                )}
              >
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full transition-[background-color,box-shadow] duration-200",
                  language === 'en'
                    ? "bg-brand-red shadow-[0_0_8px_rgba(229,9,20,0.55)]"
                    : "bg-[#4E535C]"
                )} aria-hidden="true" />
                <span>EN</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('id')}
                aria-pressed={language === 'id'}
                aria-label="Ganti ke Bahasa Indonesia"
                className={cn(
                  "min-w-[42px] min-h-[38px] rounded-full px-3 text-[10px] font-mono font-bold tracking-[0.1em] transition-[background-color,color,box-shadow] duration-200 flex items-center justify-center gap-1.5 cursor-pointer",
                  language === 'id'
                    ? "bg-white/[0.09] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]"
                    : "text-[#6F757F] hover:bg-white/[0.035] hover:text-white"
                )}
              >
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full transition-[background-color,box-shadow] duration-200",
                  language === 'id'
                    ? "bg-brand-red shadow-[0_0_8px_rgba(229,9,20,0.55)]"
                    : "bg-[#4E535C]"
                )} aria-hidden="true" />
                <span>ID</span>
              </button>
            </div>

            <button 
              ref={mobileMenuTriggerRef}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              className={cn("w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl border border-white/[0.1] flex items-center justify-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_8px_22px_rgba(0,0,0,0.14)] active:bg-white/[0.04] transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 shrink-0 cursor-pointer", controlGlassMaterial)}
              onClick={() => setIsMenuOpen(prev => !prev)}
              aria-label={isMenuOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MEGA DROPDOWN MENU FOR DESKTOP */}
        {/* ======================================================== */}
        <AnimatePresence>
          {isServicesDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={handleMouseEnterServices}
              onMouseLeave={handleMouseLeaveServices}
              id="desktop-services-dropdown"
              ref={servicesDropdownRef}
              onBlur={(event) => {
                const nextTarget = event.relatedTarget;
                const trigger = event.currentTarget.parentElement?.querySelector<HTMLButtonElement>('button[aria-haspopup="true"]');
                if (
                  nextTarget instanceof Node &&
                  (event.currentTarget.contains(nextTarget) || trigger?.contains(nextTarget))
                ) return;
                setIsServicesDropdownOpen(false);
              }}
              className={cn(
                "hidden md:block absolute top-full left-0 w-full border-b border-white/[0.08] shadow-[0_25px_60px_rgba(0,0,0,0.38)] py-8 px-6 lg:px-12",
                dropdownGlassMaterial
              )}

            >
              <div className="max-w-7xl mx-auto grid grid-cols-4 gap-4 lg:gap-10">
                
                {/* COLUMN 1: SOLUTIONS */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-[#262930] text-xs font-mono tracking-widest text-brand-red uppercase font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-brand-red" />
                    <span>SOLUTIONS</span>
                  </div>
                  <div className="space-y-3">
                    {solutions.map((item) => (
                      <Link
                        key={item.slug}
                        to={`/solutions/${item.slug}`}
                        onClick={() => setIsServicesDropdownOpen(false)}
                        className="group block p-2.5 rounded-xl border border-transparent hover:border-white/[0.06] hover:bg-transparent transition-all duration-200"
                      >
                        <div className="flex items-center justify-between text-sm font-semibold text-[#E9EAF0] group-hover:text-brand-red transition-colors">
                          <span>{item.title}</span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-red" />
                        </div>
                        <div className="text-xs text-[#737985] group-hover:text-[#A4A8B2] transition-colors mt-0.5 font-light">
                          {language === 'id' ? item.navSubtitleId : item.navSubtitle}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* COLUMN 2: BRANDING */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-[#262930] text-xs font-mono tracking-widest text-brand-red uppercase font-semibold">
                    <Palette className="w-3.5 h-3.5 text-brand-red" />
                    <span>BRANDING</span>
                  </div>
                  <div className="space-y-3">
                    {branding.map((item) => (
                      <Link
                        key={item.slug}
                        to={`/services/${item.slug}`}
                        onClick={() => setIsServicesDropdownOpen(false)}
                        className="group block p-2.5 rounded-xl border border-transparent hover:border-white/[0.07] hover:bg-white/[0.02] transition-all duration-200"
                      >
                        <div className="flex items-center justify-between text-sm font-semibold text-[#E9EAF0] group-hover:text-brand-red transition-colors">
                          <span>{item.title}</span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-red" />
                        </div>
                        <div className="text-xs text-[#737985] group-hover:text-[#A4A8B2] transition-colors mt-0.5 font-light">
                          {language === 'id' ? item.navSubtitleId : item.navSubtitle}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* COLUMN 3: DESIGN */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-[#262930] text-xs font-mono tracking-widest text-brand-red uppercase font-semibold">
                    <Layers className="w-3.5 h-3.5 text-brand-red" />
                    <span>DESIGN</span>
                  </div>
                  <div className="space-y-3">
                    {design.map((item) => (
                      <Link
                        key={item.slug}
                        to={`/services/${item.slug}`}
                        onClick={() => setIsServicesDropdownOpen(false)}
                        className="group block p-2.5 rounded-xl border border-transparent hover:border-white/[0.07] hover:bg-white/[0.02] transition-all duration-200"
                      >
                        <div className="flex items-center justify-between text-sm font-semibold text-[#E9EAF0] group-hover:text-brand-red transition-colors">
                          <span>{item.title}</span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-red" />
                        </div>
                        <div className="text-xs text-[#737985] group-hover:text-[#A4A8B2] transition-colors mt-0.5 font-light">
                          {language === 'id' ? item.navSubtitleId : item.navSubtitle}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* COLUMN 4: DEVELOPMENT */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-[#262930] text-xs font-mono tracking-widest text-brand-red uppercase font-semibold">
                    <Code2 className="w-3.5 h-3.5 text-brand-red" />
                    <span>DEVELOPMENT</span>
                  </div>
                  <div className="space-y-3">
                    {development.map((item) => (
                      <Link
                        key={item.slug}
                        to={`/services/${item.slug}`}
                        onClick={() => setIsServicesDropdownOpen(false)}
                        className="group block p-2.5 rounded-xl border border-transparent hover:border-white/[0.07] hover:bg-white/[0.02] transition-all duration-200"
                      >
                        <div className="flex items-center justify-between text-sm font-semibold text-[#E9EAF0] group-hover:text-brand-red transition-colors">
                          <span>{item.title}</span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-red" />
                        </div>
                        <div className="text-xs text-[#737985] group-hover:text-[#A4A8B2] transition-colors mt-0.5 font-light">
                          {language === 'id' ? item.navSubtitleId : item.navSubtitle}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom Quick Hub Bar */}
              <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-[#262930] flex flex-wrap items-center justify-between gap-4 text-xs text-[#8A909D]">
                <Link 
                  to="/services" 
                  onClick={() => setIsServicesDropdownOpen(false)}
                  className="hover:text-white inline-flex items-center gap-1.5 transition-colors font-medium"
                >
                  <span>{language === 'id' ? 'Lihat Semua Gambaran Layanan' : 'Browse All Services Overview'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-brand-red" />
                </Link>
                <div className="font-mono text-[11px] text-[#8A909D]">
                  {solutions.length} Strategic Solutions &bull; {dedicatedServiceCount} Dedicated Services
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Mobile navigation drawer. The main navbar remains the single header; the drawer opens below it. */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              id="mobile-navigation"
              aria-label={language === 'id' ? 'Navigasi utama' : 'Main navigation'}
              className="absolute left-0 right-0 top-full z-10 lg:hidden max-h-[calc(100dvh-5rem)] overflow-hidden border-b border-white/[0.08] bg-[#0B0C0E]/96 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl backdrop-saturate-150"
            >
              <div className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain px-5 py-5 sm:px-8 sm:py-7">
                <div className="flex flex-col">
                  {/* Nav Links in Mobile */}
                  <div className="flex flex-col">
                    <Link
                      to="/work"
                      onClick={() => setIsMenuOpen(false)}
                      aria-current={isWorkActive ? 'page' : undefined}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3 py-3.5 min-h-[52px] transition-colors",
                        isWorkActive
                          ? "bg-brand-red/[0.08] text-brand-red"
                          : "text-[#8A909D] hover:bg-white/[0.035] hover:text-white active:bg-white/[0.05]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-xs font-mono text-brand-red">01</span>
                        <span className="text-xl font-display">{t('nav.work')}</span>
                      </div>
                      <ChevronRight size={18} className={cn(isWorkActive ? "text-brand-red" : "text-[#8A909D]/50")} />
                    </Link>

                    <div className="mt-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setIsMobileServicesOpen(prev => !prev)}
                        aria-expanded={isMobileServicesOpen}
                        aria-controls="mobile-services-submenu"
                        aria-current={isServicesActive ? 'page' : undefined}
                        className={cn(
                          "w-full flex items-center justify-between rounded-xl px-3 py-3.5 text-left font-display text-xl min-h-[52px] cursor-pointer transition-colors",
                          isServicesActive || isMobileServicesOpen
                            ? "bg-brand-red/[0.08] text-brand-red"
                            : "text-[#8A909D] hover:bg-white/[0.035] hover:text-white"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 text-xs font-mono text-brand-red">02</span>
                          <span>{t('nav.services')}</span>
                        </div>
                        <ChevronDown
                          className={cn(
                            "w-5 h-5 transition-transform duration-200",
                            isMobileServicesOpen ? "rotate-180 text-brand-red" : "text-[#8A909D]/60"
                          )}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isMobileServicesOpen && (
                          <motion.div
                            id="mobile-services-submenu"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 space-y-4 rounded-xl bg-white/[0.018] px-4 py-4">
                              {[
                                { label: 'SOLUTIONS', items: solutions, base: '/solutions/' },
                                { label: 'BRANDING', items: branding, base: '/services/' },
                                { label: 'DESIGN', items: design, base: '/services/' },
                                { label: 'DEVELOPMENT', items: development, base: '/services/' }
                              ].map((group) => (
                                <div key={group.label}>
                                  <div className="mb-2 text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-brand-red">
                                    {group.label}
                                  </div>
                                  <div className="space-y-1">
                                    {group.items.map(item => {
                                      const itemPath = `${group.base}${item.slug}`;
                                      const itemActive = location.pathname === itemPath;
                                      return (
                                        <Link
                                          key={item.slug}
                                          to={itemPath}
                                          onClick={() => setIsMenuOpen(false)}
                                          aria-current={itemActive ? 'page' : undefined}
                                          className={cn(
                                            "flex min-h-[44px] items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                            itemActive
                                              ? "bg-brand-red/[0.08] text-white"
                                              : "text-[#8A909D] hover:bg-white/[0.035] hover:text-white active:bg-white/[0.05]"
                                          )}
                                        >
                                          <span>{item.title}</span>
                                        </Link>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}

                              <Link
                                to="/services"
                                onClick={() => setIsMenuOpen(false)}
                                aria-current={location.pathname === '/services' ? 'page' : undefined}
                                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 text-xs font-mono uppercase tracking-[0.12em] text-brand-red transition-colors hover:bg-brand-red/[0.08]"
                              >
                                <span>{language === 'id' ? 'Lihat Semua Layanan' : 'View All Services'}</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <Link
                      to="/insights"
                      onClick={() => setIsMenuOpen(false)}
                      aria-current={isInsightsActive ? 'page' : undefined}
                      className={cn(
                        "mt-1 flex items-center justify-between rounded-xl px-3 py-3.5 min-h-[52px] transition-colors",
                        isInsightsActive
                          ? "bg-brand-red/[0.08] text-brand-red"
                          : "text-[#8A909D] hover:bg-white/[0.035] hover:text-white active:bg-white/[0.05]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-xs font-mono text-brand-red">03</span>
                        <span className="text-xl font-display">{t('nav.insights')}</span>
                      </div>
                      <ChevronRight size={18} className={cn(isInsightsActive ? "text-brand-red" : "text-[#8A909D]/50")} />
                    </Link>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link to="/industries" onClick={() => setIsMenuOpen(false)} className="rounded-xl border border-white/[0.08] bg-white/[0.018] px-3 py-3 text-sm font-medium text-[#A4AAB5] hover:text-white">Industries</Link>
                      <Link to="/clients" onClick={() => setIsMenuOpen(false)} className="rounded-xl border border-white/[0.08] bg-white/[0.018] px-3 py-3 text-sm font-medium text-[#A4AAB5] hover:text-white">Clients</Link>
                      <Link to="/resources" onClick={() => setIsMenuOpen(false)} className="rounded-xl border border-white/[0.08] bg-white/[0.018] px-3 py-3 text-sm font-medium text-[#A4AAB5] hover:text-white">Resources</Link>
                      <Link to="/faq" onClick={() => setIsMenuOpen(false)} className="rounded-xl border border-white/[0.08] bg-white/[0.018] px-3 py-3 text-sm font-medium text-[#A4AAB5] hover:text-white">FAQ</Link>
                      <Link to="/search" onClick={() => setIsMenuOpen(false)} className="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.018] px-3 py-3 text-sm font-medium text-[#A4AAB5] hover:text-white"><SearchIcon size={15}/> Search</Link>
                    </div>

                    <Link
                      to="/about"
                      onClick={() => setIsMenuOpen(false)}
                      aria-current={isAboutActive ? 'page' : undefined}
                      className={cn(
                        "mt-1 flex items-center justify-between rounded-xl px-3 py-3.5 min-h-[52px] transition-colors",
                        isAboutActive
                          ? "bg-brand-red/[0.08] text-brand-red"
                          : "text-[#8A909D] hover:bg-white/[0.035] hover:text-white active:bg-white/[0.05]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-xs font-mono text-brand-red">04</span>
                        <span className="text-xl font-display">{t('nav.about')}</span>
                      </div>
                      <ChevronRight size={18} className={cn(isAboutActive ? "text-brand-red" : "text-[#8A909D]/50")} />
                    </Link>

                    <Link
                      to="/careers"
                      onClick={() => setIsMenuOpen(false)}
                      aria-current={isCareersActive ? 'page' : undefined}
                      className={cn(
                        "mt-1 flex items-center justify-between rounded-xl px-3 py-3.5 min-h-[52px] transition-colors",
                        isCareersActive
                          ? "bg-brand-red/[0.08] text-brand-red"
                          : "text-[#8A909D] hover:bg-white/[0.035] hover:text-white active:bg-white/[0.05]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-xs font-mono text-brand-red">05</span>
                        <span className="text-xl font-display">{t('nav.careers')}</span>
                      </div>
                      <ChevronRight size={18} className={cn(isCareersActive ? "text-brand-red" : "text-[#8A909D]/50")} />
                    </Link>

                    <Link
                      to="/contact"
                      onClick={() => setIsMenuOpen(false)}
                      className="group mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.035] text-xs font-semibold uppercase tracking-[0.12em] text-white transition-[background-color,border-color,box-shadow] duration-300 hover:border-brand-red/45 hover:bg-brand-red hover:shadow-[0_12px_30px_-20px_rgba(229,9,20,0.4)]"
                      data-cursor-label="Start"
                    >
                      <span>{t('nav.startProject')}</span>
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>

                  {/* Quick Contact & Footer */}
                  <div className="mt-5 border-t border-white/[0.07] pt-5 space-y-3">
                    <a
                      href="https://wa.me/6287769957062?text=Halo%20Kapitech%20Agency,%20saya%20ingin%20konsultasi%20proyek."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-[44px] items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 text-sm text-white transition-colors hover:bg-white/[0.045] active:bg-white/[0.06]"
                    >
                      <Phone size={15} className="text-brand-red shrink-0" />
                      <span className="truncate">+62 877-6995-7062 (WhatsApp)</span>
                    </a>
                    <a
                      href="mailto:hello@kapitech.id"
                      className="flex min-h-[44px] items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 text-sm text-white transition-colors hover:bg-white/[0.045] active:bg-white/[0.06]"
                    >
                      <Mail size={15} className="text-brand-red shrink-0" />
                      <span className="truncate">hello@kapitech.id</span>
                    </a>
                    <div className="flex items-center justify-between pt-1 text-xs text-[#8A909D]">
                      <a
                        href="https://www.instagram.com/kapitechagency/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Kapitech Agency on Instagram"
                        className="text-[#8A909D] transition-colors hover:text-white"
                      >
                        <Instagram size={16} />
                      </a>
                      <span className="font-mono text-[10px] text-[#8A909D]">Tangerang Selatan, ID</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>


    </>
  );
};
