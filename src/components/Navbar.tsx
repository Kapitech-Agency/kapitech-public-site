import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
import { industryCatalog } from '@/src/data/industryCatalog';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuTriggerRef = React.useRef<HTMLButtonElement>(null);
  const mobileMenuRef = React.useRef<HTMLDivElement>(null);
  const wasMobileMenuOpenRef = useRef(false);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  const industriesDropdownRef = useRef<HTMLDivElement>(null);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isIndustriesDropdownOpen, setIsIndustriesDropdownOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isMobileIndustriesOpen, setIsMobileIndustriesOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
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
        setIsIndustriesDropdownOpen(false);
        setIsMobileServicesOpen(false);
        setIsMobileIndustriesOpen(false);
        return;
      }

      if (event.key !== 'Tab' || !isMenuOpen) return;

      const menu = mobileMenuRef.current;
      if (!menu) return;

      const focusable = Array.from(
        menu.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.getClientRects().length > 0);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && (activeElement === first || !menu.contains(activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    if (isMenuOpen) {
      wasMobileMenuOpenRef.current = true;
      document.body.dataset.kapiMobileMenuOpen = 'true';
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      window.requestAnimationFrame(() => {
        const firstFocusable = mobileMenuRef.current?.querySelector<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        firstFocusable?.focus();
      });
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
    setIsIndustriesDropdownOpen(false);
    setIsMobileServicesOpen(false);
    setIsMobileIndustriesOpen(false);
  }, [location.pathname]);

  const handleMouseEnterServices = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsServicesDropdownOpen(true);
    setIsIndustriesDropdownOpen(false);
  };

  const handleMouseLeaveServices = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsServicesDropdownOpen(false);
    }, 150);
  };

  const handleMouseEnterIndustries = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsIndustriesDropdownOpen(true);
    setIsServicesDropdownOpen(false);
  };

  const handleMouseLeaveIndustries = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsIndustriesDropdownOpen(false);
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
  const isIndustriesActive = location.pathname.startsWith('/industries');

  // Shared navbar material used by the scrolled navbar and mobile controls.
  const navbarGlassMaterial = "bg-[#0B0C0E]/92 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-[#0B0C0E]/84";
  // Dropdown uses the same dark glass language, with stronger blur and a lighter surface.
  const dropdownGlassMaterial = "bg-[#0B0C0E]/82 backdrop-blur-sm backdrop-saturate-110 supports-[backdrop-filter]:bg-[#0B0C0E]/76";
  const controlGlassMaterial = "bg-[#0B0C0E]/42 backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-[#0B0C0E]/34";

  const desktopNavItemClass = (active: boolean) =>
    cn(
      "group relative inline-flex items-center h-9 px-2.5 rounded-full text-[9.5px] font-semibold uppercase tracking-[0.14em] leading-none border transition-[background-color,border-color,color,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E]",
      active
        ? "text-brand-red border-white/[0.08] bg-brand-red/[0.08] backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(229,9,20,0.08),0_6px_18px_rgba(0,0,0,0.08)]"
        : "text-[#8A909D] border-transparent bg-transparent hover:text-white hover:border-white/[0.08] hover:bg-white/[0.035] hover:backdrop-blur-xl hover:backdrop-saturate-150"
    );

  return (
    <>
      <AnimatePresence>
        {(isServicesDropdownOpen || isIndustriesDropdownOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 z-40 hidden xl:block pointer-events-none"
            aria-hidden="true"
            style={{
              top: isScrolled ? '72px' : '88px',
              height: '500px',
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
              ? `${navbarGlassMaterial} py-3 sm:py-3.5 ${(isServicesDropdownOpen || isIndustriesDropdownOpen) ? "border-transparent shadow-none" : "border-[#262930]/80 shadow-[0_12px_36px_rgba(0,0,0,0.28)]"}`
              : (isServicesDropdownOpen || isIndustriesDropdownOpen)
                ? `${navbarGlassMaterial} py-4 sm:py-5 border-transparent shadow-none`
                : "bg-transparent backdrop-blur-none py-4 sm:py-5 border-transparent"
        )}
      >
        <div
          className={cn(
            "relative z-20 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 flex xl:grid xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] min-h-[48px] shrink-0 items-center",
          )}
        >
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group py-1 shrink-0 xl:justify-self-start" aria-label="Kapitech Agency Home">
            <img 
              src="https://raw.githubusercontent.com/Kapitech-Agency/Kapitech-Agency.github.io/main/public/white.png" 
              alt="Kapitech Agency" 
              className="h-6 sm:h-[22px] md:h-6 w-auto max-h-7 object-contain transition-opacity duration-300 group-hover:opacity-90 shrink-0 select-none"
            />
            {/* Hidden strictly on mobile view to maximize space and preserve top-tier minimal aesthetics */}
            <span className="hidden xl:inline font-display font-bold text-[15px] sm:text-base md:text-[17px] tracking-[-0.02em] text-white group-hover:text-brand-red transition-colors whitespace-nowrap">
              Kapitech Agency
            </span>
          </Link>

          {/* Desktop Navigation: one centered group, independent from brand and actions */}
          <div className="hidden min-w-0 xl:flex items-center justify-self-center gap-1.5">

              
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

              <div
                className="relative flex items-center h-7"
                onMouseEnter={handleMouseEnterIndustries}
                onMouseLeave={handleMouseLeaveIndustries}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsIndustriesDropdownOpen((prev) => !prev);
                    setIsServicesDropdownOpen(false);
                  }}
                  onFocus={handleMouseEnterIndustries}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      setIsIndustriesDropdownOpen(false);
                    }
                  }}
                  className={cn(desktopNavItemClass(isIndustriesActive || isIndustriesDropdownOpen), "gap-1.5")}
                  aria-expanded={isIndustriesDropdownOpen}
                  aria-controls="desktop-industries-dropdown"
                  aria-haspopup="true"
                  aria-current={isIndustriesActive ? 'page' : undefined}
                >
                  <span className="relative z-10">{language === 'id' ? 'Industri' : 'Industries'}</span>
                  <motion.span
                    className="relative z-10 ml-0.5 flex h-4 w-4 shrink-0 items-center justify-center origin-center"
                    animate={{ rotate: isIndustriesDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <ChevronDown className={cn("h-3.5 w-3.5 transition-colors duration-200", isIndustriesDropdownOpen ? "text-white" : "text-[#8A909D]")} />
                  </motion.span>
                </button>
              </div>

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

          {/* Desktop Actions: one right-aligned group independent from navigation */}
          <div className="hidden min-w-0 xl:flex items-center justify-self-end gap-2">
            {/* Start Project CTA */}
            <Link
              to="/contact"
              className="group relative isolate inline-flex items-center gap-2 h-10 px-4 rounded-full border border-white/[0.1] bg-[#0B0C0E]/34 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-[#0B0C0E]/28 text-[#F3F4F6] text-[10px] font-bold uppercase tracking-[0.12em] transition-[background-color,border-color,color,box-shadow] duration-500 ease-out shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_8px_24px_rgba(0,0,0,0.1)] hover:border-brand-red/50 hover:bg-brand-red/72 hover:text-white hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.13),0_10px_28px_rgba(230,57,70,0.16)]"
              data-cursor-label="Start"
            >

              <span className="relative z-10">{t('nav.startProject')}</span>
              <ChevronRight size={14} className="relative z-10 opacity-70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
            </Link>

            <Link to="/search" aria-label={language === 'id' ? 'Cari' : 'Search'} className={cn(desktopNavItemClass(location.pathname === '/search'), "h-9 w-9 justify-center px-0")}><SearchIcon size={15} /></Link>

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
                  "inline-flex h-8 min-w-[40px] items-center justify-center gap-1.5 rounded-full px-2 text-[9px] font-mono font-bold tracking-[0.12em] transition-[background-color,color,box-shadow] duration-200 cursor-pointer",
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
          <div className="flex items-center gap-2 sm:gap-3 xl:hidden">
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
                "hidden xl:block absolute top-full left-0 w-full border-b border-white/[0.08] shadow-[0_25px_60px_rgba(0,0,0,0.38)] py-8 px-6 lg:px-12",
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
        <AnimatePresence>
          {isIndustriesDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={handleMouseEnterIndustries}
              onMouseLeave={handleMouseLeaveIndustries}
              id="desktop-industries-dropdown"
              ref={industriesDropdownRef}
              className={cn(
                "hidden xl:block absolute top-full left-0 w-full border-b border-white/[0.08] shadow-[0_25px_60px_rgba(0,0,0,0.38)] py-7 px-6 lg:px-12",
                dropdownGlassMaterial
              )}
            >
              <div className="mx-auto max-w-7xl">
                <div className="flex items-end justify-between gap-6 border-b border-white/[0.07] pb-5">
                  <div>
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-brand-red">
                      {language === 'id' ? 'Pilih industri' : 'Choose an industry'}
                    </span>
                    <h2 className="mt-2 text-2xl font-display font-semibold tracking-[-0.04em] text-white">
                      {language === 'id' ? 'Lihat bagaimana Kapitech bekerja di konteks yang paling relevan.' : 'See how Kapitech works in the context that matters to you.'}
                    </h2>
                  </div>
                  <span className="hidden text-[9px] font-mono uppercase tracking-[0.12em] text-[#5E6672] md:block">
                    {industryCatalog.length} {language === 'id' ? 'industry paths' : 'industry paths'}
                  </span>
                </div>
                <div className="mt-5 grid grid-cols-4 gap-2 lg:gap-3">
                  {industryCatalog.map((item, index) => {
                    const active = location.pathname === '/industries/' + item.slug;
                    return (
                      <Link
                        key={item.slug}
                        to={'/industries/' + item.slug}
                        onClick={() => setIsIndustriesDropdownOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          "group rounded-2xl border p-4 transition-[border-color,background-color,transform] duration-200",
                          active
                            ? "border-brand-red/30 bg-brand-red/[0.07]"
                            : "border-white/[0.07] bg-white/[0.018] hover:-translate-y-0.5 hover:border-white/[0.15] hover:bg-white/[0.035]"
                        )}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-mono text-[9px] tabular-nums tracking-[0.14em] text-[#505965]">{String(index + 1).padStart(2, '0')}</span>
                          <ArrowUpRight size={13} className={active ? "text-brand-red" : "text-[#5E6672] group-hover:text-brand-red"} />
                        </div>
                        <p className="mt-6 text-[9px] font-mono uppercase tracking-[0.12em] text-[#69727D]">{item.eyebrow}</p>
                        <p className="mt-1.5 text-base font-display font-semibold leading-tight tracking-[-0.025em] text-white">{item.shortLabel}</p>
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#69727D]">{item.description}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
              ref={mobileMenuRef}
              role="dialog"
              aria-modal="true"
              aria-label={language === 'id' ? 'Navigasi utama' : 'Main navigation'}
              className="absolute left-0 right-0 top-full z-10 xl:hidden max-h-[calc(100dvh-5rem)] overflow-hidden border-b border-white/[0.08] bg-[#0B0C0E]/96 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl backdrop-saturate-150"
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

                    <div className="mt-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setIsMobileIndustriesOpen((prev) => !prev)}
                        aria-expanded={isMobileIndustriesOpen}
                        aria-controls="mobile-industries-submenu"
                        aria-current={isIndustriesActive ? 'page' : undefined}
                        className={cn(
                          "w-full flex items-center justify-between rounded-xl px-3 py-3.5 text-left font-display text-xl min-h-[52px] cursor-pointer transition-colors",
                          isIndustriesActive || isMobileIndustriesOpen
                            ? "bg-brand-red/[0.08] text-brand-red"
                            : "text-[#8A909D] hover:bg-white/[0.035] hover:text-white"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 text-xs font-mono text-brand-red">04</span>
                          <span>{language === 'id' ? 'Industri' : 'Industries'}</span>
                        </div>
                        <ChevronDown
                          className={cn(
                            "w-5 h-5 transition-transform duration-200",
                            isMobileIndustriesOpen ? "rotate-180 text-brand-red" : "text-[#8A909D]/60"
                          )}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isMobileIndustriesOpen && (
                          <motion.div
                            id="mobile-industries-submenu"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 space-y-1 rounded-xl bg-white/[0.018] p-3">
                              {industryCatalog.map((item, index) => {
                                const itemActive = location.pathname === '/industries/' + item.slug;
                                return (
                                  <Link
                                    key={item.slug}
                                    to={'/industries/' + item.slug}
                                    onClick={() => setIsMenuOpen(false)}
                                    aria-current={itemActive ? 'page' : undefined}
                                    className={cn(
                                      "group flex min-h-[52px] items-center justify-between rounded-xl px-3 py-2 transition-colors",
                                      itemActive
                                        ? "bg-brand-red/[0.08] text-white"
                                        : "text-[#8A909D] hover:bg-white/[0.035] hover:text-white"
                                    )}
                                  >
                                    <span className="min-w-0">
                                      <span className="block text-sm font-semibold">{item.shortLabel}</span>
                                      <span className="mt-0.5 block truncate text-[10px] text-[#626B76]">{item.label}</span>
                                    </span>
                                    <ChevronRight size={16} className="shrink-0 text-[#59616D] group-hover:text-brand-red" />
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="mt-1 flex flex-col gap-1">
                      <Link
                        to="/faq"
                        onClick={() => setIsMenuOpen(false)}
                        aria-current={location.pathname === '/faq' ? 'page' : undefined}
                        className={cn(
                          "flex min-h-[52px] items-center justify-between rounded-xl px-3 py-3 text-xl font-display transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-inset",
                          location.pathname === '/faq'
                            ? "bg-brand-red/[0.08] text-brand-red"
                            : "text-[#8A909D] hover:bg-white/[0.035] hover:text-white active:bg-white/[0.05]"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 text-xs font-mono text-brand-red">05</span>
                          <span>FAQ</span>
                        </div>
                        <ChevronRight size={18} className={location.pathname === '/faq' ? "text-brand-red" : "text-[#8A909D]/50"} />
                      </Link>
                      <Link
                        to="/search"
                        onClick={() => setIsMenuOpen(false)}
                        aria-current={location.pathname === '/search' ? 'page' : undefined}
                        className={cn(
                          "flex min-h-[52px] items-center justify-between rounded-xl px-3 py-3 text-xl font-display transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-inset",
                          location.pathname === '/search'
                            ? "bg-brand-red/[0.08] text-brand-red"
                            : "text-[#8A909D] hover:bg-white/[0.035] hover:text-white active:bg-white/[0.05]"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 text-xs font-mono text-brand-red">06</span>
                          <span>{language === 'id' ? 'Cari' : 'Search'}</span>
                        </div>
                        <SearchIcon size={15} className={location.pathname === '/search' ? "text-brand-red" : "text-[#8A909D]/50"} />
                      </Link>
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
                        <span className="w-6 text-xs font-mono text-brand-red">07</span>
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
                        <span className="w-6 text-xs font-mono text-brand-red">08</span>
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
