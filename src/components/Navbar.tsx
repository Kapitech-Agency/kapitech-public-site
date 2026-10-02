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
  Cpu
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '@/src/lib/LanguageContext';
import { allSolutionsAndServices } from '@/src/data/servicesData';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  // Lock background scroll while the mobile navigation drawer is open.
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
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = previousOverflow;
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

  const isWorkActive = location.pathname === '/work' || location.pathname.startsWith('/work/')|| location.pathname.startsWith('/work/');
  const isAboutActive = location.pathname === '/about' || location.pathname.startsWith('/about/')|| location.pathname.startsWith('/about/');
  const isCareersActive = location.pathname === '/careers' || location.pathname.startsWith('/careers/')|| location.pathname.startsWith('/careers/');
  const isServicesActive = location.pathname.startsWith('/services') || location.pathname.startsWith('/solutions');

  // Shared navbar material used by the scrolled navbar and mobile controls.
  const navbarGlassMaterial = "bg-[#0B0C0E]/92 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-[#0B0C0E]/84";
  // Dropdown uses the same dark glass language, with stronger blur and a lighter surface.
  const dropdownGlassMaterial = "bg-[#0B0C0E]/62 backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-[#0B0C0E]/54";
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
              top: isScrolled ? '76px' : '88px',
              height: '430px',
              backgroundColor: 'rgba(11, 12, 14, 0.26)',
              backdropFilter: 'blur(36px) saturate(1.18) brightness(0.82)',
              WebkitBackdropFilter: 'blur(36px) saturate(1.18) brightness(0.82)',
            }}
          />
        )}
      </AnimatePresence>

      <nav
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b",
          isScrolled
            ? `${navbarGlassMaterial} py-3 sm:py-3.5 ${isServicesDropdownOpen ? "border-transparent shadow-none" : "border-[#262930]/80 shadow-[0_12px_36px_rgba(0,0,0,0.28)]"}`
            : isServicesDropdownOpen
              ? `${navbarGlassMaterial} py-4 sm:py-5 border-transparent shadow-none`
              : "bg-transparent backdrop-blur-none py-4 sm:py-5 border-transparent"
        )}
      >
        {/* Scroll Progress Bar */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-[2px] bg-brand-red origin-left"
          style={{ scaleX }}
        />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 flex min-h-[48px] items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group py-1 shrink-0" aria-label="Kapitech Agency Home">
            <img 
              src="https://raw.githubusercontent.com/Kapitech-Agency/Kapitech-Agency.github.io/main/public/white.png" 
              alt="Kapitech Agency" 
              className="h-6 sm:h-[22px] md:h-6 w-auto max-h-7 object-contain transition-opacity duration-300 group-hover:opacity-90 shrink-0 select-none"
            />
            {/* Hidden strictly on mobile view to maximize space and preserve top-tier minimal aesthetics */}
            <span className="hidden md:inline font-display font-bold text-[15px] sm:text-base md:text-[17px] tracking-[-0.02em] text-white group-hover:text-brand-red transition-colors whitespace-nowrap">
              Kapitech Agency
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-7 lg:gap-9">
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

            {/* Language Switcher EN | ID */}
            <div className="flex items-center gap-2 text-[10px] font-mono font-semibold tracking-[0.16em]">
              <button
                onClick={() => setLanguage('en')}
                className="group inline-flex items-center gap-1.5 rounded-full border border-transparent bg-transparent px-2.5 py-1.5 text-[#8A909D] backdrop-blur-xl backdrop-saturate-150 transition-[background-color,border-color,color,box-shadow] duration-300 hover:border-white/[0.1] hover:bg-white/[0.045] hover:text-white cursor-pointer"
                aria-label="Switch to English"
              >
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full transition-all duration-200",
                  language === 'en' ? "bg-brand-red shadow-[0_0_9px_rgba(229,9,20,0.7)]" : "bg-transparent"
                )} />
                <span className={cn(language === 'en' ? "text-white" : "text-[#8A909D]")}>EN</span>
              </button>
              <span className="h-3 w-px bg-[#262930]" aria-hidden="true" />
              <button
                onClick={() => setLanguage('id')}
                className="group inline-flex items-center gap-1.5 rounded-full border border-transparent bg-transparent px-2.5 py-1.5 text-[#8A909D] backdrop-blur-xl backdrop-saturate-150 transition-[background-color,border-color,color,box-shadow] duration-300 hover:border-white/[0.1] hover:bg-white/[0.045] hover:text-white cursor-pointer"
                aria-label="Switch to Indonesian"
              >
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full transition-all duration-200",
                  language === 'id' ? "bg-brand-red shadow-[0_0_9px_rgba(229,9,20,0.7)]" : "bg-transparent"
                )} />
                <span className={cn(language === 'id' ? "text-white" : "text-[#8A909D]")}>ID</span>
              </button>
            </div>
          </div>

          {/* Mobile Right Controls: Language Switcher & Hamburger Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 md:hidden">
            <div className="flex items-center gap-0.5 p-1 rounded-full border border-white/[0.1] bg-white/[0.035] backdrop-blur-2xl backdrop-saturate-150 text-[11px] font-mono font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_6px_18px_rgba(0,0,0,0.08)]">
              <button
                onClick={() => setLanguage('en')}
                className={cn(
                  "min-w-[36px] min-h-[36px] py-1 px-2.5 rounded-full border border-transparent transition-[background-color,border-color,color,box-shadow] duration-300 flex items-center justify-center cursor-pointer",
                  language === 'en' ? "border-brand-red/35 bg-brand-red/68 text-white font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_4px_14px_rgba(230,57,70,0.14)]" : "text-[#8A909D] hover:bg-white/[0.045] hover:text-white"
                )}
                aria-label="Switch to English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('id')}
                className={cn(
                  "min-w-[36px] min-h-[36px] py-1 px-2.5 rounded-full border border-transparent transition-[background-color,border-color,color,box-shadow] duration-300 flex items-center justify-center cursor-pointer",
                  language === 'id' ? "border-brand-red/35 bg-brand-red/68 text-white font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_4px_14px_rgba(230,57,70,0.14)]" : "text-[#8A909D] hover:bg-white/[0.045] hover:text-white"
                )}
                aria-label="Ganti ke Bahasa Indonesia"
              >
                ID
              </button>
            </div>

            <button 
              className={cn("w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl border border-white/[0.1] flex items-center justify-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_8px_22px_rgba(0,0,0,0.14)] active:bg-white/[0.04] transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 shrink-0 cursor-pointer", controlGlassMaterial)}
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <Menu size={22} />
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
              className="hidden md:block absolute top-full left-0 w-full border-b border-white/[0.08] shadow-[0_25px_60px_rgba(0,0,0,0.58)] py-8 px-6 lg:px-12"
              style={{
                backgroundColor: 'rgba(11, 12, 14, 0.68)',
                backdropFilter: 'none',
                WebkitBackdropFilter: 'none',
              }}
            >
              <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8 lg:gap-10">
                
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
              <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-[#262930] flex items-center justify-between text-xs text-[#8A909D]">
                <Link 
                  to="/services" 
                  onClick={() => setIsServicesDropdownOpen(false)}
                  className="hover:text-white inline-flex items-center gap-1.5 transition-colors font-medium"
                >
                  <span>{language === 'id' ? 'Lihat Semua Gambaran Layanan' : 'Browse All Services Overview'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-brand-red" />
                </Link>
                <div className="font-mono text-[11px] text-[#8A909D]">
                  3 Strategic Solutions &bull; 15 Dedicated Services
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Fullscreen Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label={language === 'id' ? 'Navigasi utama' : 'Main navigation'}
            className="fixed inset-0 z-[100] overflow-hidden"
          >
            <div
              className="relative z-10 flex min-h-full flex-col overflow-y-auto px-5 py-5 sm:px-8 sm:py-7 bg-[#0B0C0E]"
            >
            {/* Header in Mobile Menu */}
            <div className="flex justify-between items-center pb-4 border-b border-[#262930] shrink-0">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2.5 group"
              >
                <img 
                  src="https://raw.githubusercontent.com/Kapitech-Agency/Kapitech-Agency.github.io/main/public/white.png" 
                  alt="Kapitech" 
                  className="h-6 sm:h-[22px] w-auto max-h-7 object-contain shrink-0 transition-opacity group-hover:opacity-90 select-none"
                />
              </Link>
              
              <div className="flex items-center gap-2">
                <div className={cn("flex items-center gap-0.5 p-1 rounded-full border border-white/[0.1] text-[11px] font-mono font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_6px_18px_rgba(0,0,0,0.08)]", navbarGlassMaterial)}>
                  <button
                    onClick={() => setLanguage('en')}
                    className={cn(
                      "min-w-[36px] min-h-[36px] py-1 px-2.5 rounded-full transition-colors flex items-center justify-center cursor-pointer",
                      language === 'en' ? "bg-brand-red text-white font-bold" : "text-[#8A909D]"
                    )}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage('id')}
                    className={cn(
                      "min-w-[36px] min-h-[36px] py-1 px-2.5 rounded-full transition-colors flex items-center justify-center cursor-pointer",
                      language === 'id' ? "bg-brand-red text-white font-bold" : "text-[#8A909D]"
                    )}
                  >
                    ID
                  </button>
                </div>

                <button 
                  onClick={() => setIsMenuOpen(false)} 
                  className={cn("w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl border border-white/[0.1] hover:border-brand-red/45 hover:bg-brand-red/68 hover:text-white active:bg-brand-red/78 transition-[background-color,border-color,color,box-shadow] duration-300 text-white flex items-center justify-center shrink-0 cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_6px_18px_rgba(0,0,0,0.08)]", controlGlassMaterial)}
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Nav Links in Mobile */}
            <div className="flex flex-col my-auto py-8">
              
              {/* Work */}
              <Link
                to="/work"
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between py-3.5 px-1 border-b border-[#262930] transition-colors min-h-[52px]",
                  location.pathname === '/work' 
                    ? "text-white font-bold border-brand-red/60" 
                    : "text-[#8A909D] hover:text-white hover:bg-[#16181D] active:bg-[#16181D]"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-brand-red">01</span>
                  <span className="text-xl font-display">{t('nav.work')}</span>
                </div>
                <ChevronRight size={18} className="text-[#8A909D]/40" />
              </Link>

              {/* Services & Solutions (Accordion in Mobile Menu) */}
              <div className="border-b border-[#262930] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsMobileServicesOpen(prev => !prev)}
                  className="w-full flex items-center justify-between py-3.5 px-1 text-left text-white font-display text-xl min-h-[52px] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-brand-red">02</span>
                    <span>{t('nav.services')}</span>
                  </div>
                  <ChevronDown className={cn("w-5 h-5 text-[#8A909D] transition-transform duration-200", isMobileServicesOpen ? "rotate-180 text-brand-red" : "")} />
                </button>

                <AnimatePresence>
                  {isMobileServicesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 pb-4 space-y-4 border-t border-[#262930] pt-3"
                    >
                      {/* Solutions */}
                      <div>
                        <div className="text-[11px] font-mono text-brand-red font-semibold uppercase tracking-wider mb-2">
                          SOLUTIONS
                        </div>
                        <div className="space-y-2 pl-2 border-l border-[#262930]">
                          {solutions.map(item => (
                            <Link
                              key={item.slug}
                              to={`/solutions/${item.slug}`}
                              onClick={() => setIsMenuOpen(false)}
                              className="block py-2 text-sm text-[#8A909D] hover:text-white font-medium"
                            >
                              {item.title}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Branding */}
                      <div>
                        <div className="text-[11px] font-mono text-brand-red font-semibold uppercase tracking-wider mb-2">
                          BRANDING
                        </div>
                        <div className="space-y-2 pl-2 border-l border-[#262930]">
                          {branding.map(item => (
                            <Link
                              key={item.slug}
                              to={`/services/${item.slug}`}
                              onClick={() => setIsMenuOpen(false)}
                              className="block py-2 text-sm text-[#8A909D] hover:text-white"
                            >
                              {item.title}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Design */}
                      <div>
                        <div className="text-[11px] font-mono text-brand-red font-semibold uppercase tracking-wider mb-2">
                          DESIGN
                        </div>
                        <div className="space-y-2 pl-2 border-l border-[#262930]">
                          {design.map(item => (
                            <Link
                              key={item.slug}
                              to={`/services/${item.slug}`}
                              onClick={() => setIsMenuOpen(false)}
                              className="block py-2 text-sm text-[#8A909D] hover:text-white"
                            >
                              {item.title}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Development */}
                      <div>
                        <div className="text-[11px] font-mono text-brand-red font-semibold uppercase tracking-wider mb-2">
                          DEVELOPMENT
                        </div>
                        <div className="space-y-2 pl-2 border-l border-[#262930]">
                          {development.map(item => (
                            <Link
                              key={item.slug}
                              to={`/services/${item.slug}`}
                              onClick={() => setIsMenuOpen(false)}
                              className="block py-2 text-sm text-[#8A909D] hover:text-white"
                            >
                              {item.title}
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2">
                        <Link
                          to="/services"
                          onClick={() => setIsMenuOpen(false)}
                          className="inline-flex items-center gap-1.5 text-xs text-brand-red font-mono uppercase tracking-wider py-1.5"
                        >
                          <span>{language === 'id' ? 'Lihat Semua Layanan' : 'View All Services'}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* About */}
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between py-3.5 px-1 border-b border-[#262930] transition-colors min-h-[52px]",
                  location.pathname === '/about' 
                    ? "text-white font-bold border-brand-red/60" 
                    : "text-[#8A909D] hover:text-white hover:bg-[#16181D] active:bg-[#16181D]"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-brand-red">03</span>
                  <span className="text-xl font-display">{t('nav.about')}</span>
                </div>
                <ChevronRight size={18} className="text-[#8A909D]/40" />
              </Link>

              {/* Careers */}
              <Link
                to="/careers"
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between py-3.5 px-1 border-b border-[#262930] transition-colors min-h-[52px]",
                  location.pathname === '/careers' 
                    ? "text-white font-bold border-brand-red/60" 
                    : "text-[#8A909D] hover:text-white hover:bg-[#16181D] active:bg-[#16181D]"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-brand-red">04</span>
                  <span className="text-xl font-display">{t('nav.careers')}</span>
                </div>
                <ChevronRight size={18} className="text-[#8A909D]/40" />
              </Link>

              <div className="pt-4 mt-1">
                <Link
                  to="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="group relative isolate w-full h-12 rounded-xl border border-white/[0.1] bg-[#16181D] text-[#F3F4F6] flex items-center justify-center text-xs font-semibold uppercase tracking-wider gap-2 transition-[background-color,border-color,color,box-shadow] duration-500 ease-out hover:border-brand-red/45 hover:bg-brand-red hover:text-white hover:shadow-[0_12px_30px_-20px_rgba(229,9,20,0.4)] cursor-pointer"
                  data-cursor-label="Start"
                >

                  <span className="relative z-10">{t('nav.startProject')}</span>
                  <ArrowUpRight size={16} className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* Quick Contact & Footer in Drawer */}
            <div className="pt-4 border-t border-[#262930] space-y-3 shrink-0">
              <div className="grid grid-cols-1 gap-2 text-xs">
                <a
                  href="https://wa.me/6287769957062?text=Halo%20Kapitech%20Agency,%20saya%20ingin%20konsultasi%20proyek."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-[#16181D] border border-[#262930] flex items-center gap-2.5 text-white active:bg-[#1B1F26] transition-colors min-h-[44px]"
                >
                  <Phone size={15} className="text-brand-red shrink-0" />
                  <span className="truncate">+62 877-6995-7062 (WhatsApp)</span>
                </a>
                <div className="grid grid-cols-1 gap-2">
                  <a
                    href="mailto:hello@kapitech.co.id"
                    className="flex min-h-[44px] items-center gap-2.5 border-b border-[#262930] px-1 py-3 text-white transition-colors active:text-brand-red"
                  >
                    <Mail size={15} className="text-brand-red shrink-0" />
                    <span className="truncate">hello@kapitech.co.id</span>
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#8A909D] pt-1">
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
