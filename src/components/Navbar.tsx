import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { 
  Menu, 
  X, 
  Instagram, 
  Linkedin, 
  Twitter, 
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

const CtaFlowLine = ({ mobile = false }: { mobile?: boolean }) => (
  <span
    className="pointer-events-none absolute inset-[1px] z-20 overflow-hidden rounded-[inherit]"
    aria-hidden="true"
  >
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox={mobile ? '0 0 100 48' : '0 0 100 40'}
      preserveAspectRatio="none"
      fill="none"
    >
      <motion.rect
        x="0.55"
        y="0.55"
        width="98.9"
        height={mobile ? '46.9' : '38.9'}
        rx={mobile ? '11' : '19'}
        pathLength="100"
        stroke="currentColor"
        className="text-white/40 transition-colors duration-500 group-hover:text-brand-red"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="97 3"
        vectorEffect="non-scaling-stroke"
        animate={{ strokeDashoffset: [0, -100] }}
        transition={{
          duration: mobile ? 7.6 : 7.1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </svg>
  </span>
);

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
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock background scroll while the mobile navigation drawer is open.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsServicesDropdownOpen(false);
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

  const isWorkActive = location.pathname === '/work' || location.pathname.startsWith('/work/');
  const isAboutActive = location.pathname === '/about' || location.pathname.startsWith('/about/');
  const isCareersActive = location.pathname === '/careers' || location.pathname.startsWith('/careers/');
  const isServicesActive = location.pathname.startsWith('/services') || location.pathname.startsWith('/solutions');

  const desktopNavItemClass = (active: boolean) =>
    cn(
      "relative inline-flex items-center h-9 px-2 text-[10px] font-semibold uppercase tracking-[0.17em] leading-none transition-colors duration-300",
      active ? "text-white" : "text-[#8A909D] hover:text-white"
    );

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b",
          isScrolled
            ? "bg-[#0B0C0E]/92 backdrop-blur-xl py-3 sm:py-3.5 border-[#262930]/80 shadow-[0_12px_36px_rgba(0,0,0,0.32)]"
            : "bg-[#0B0C0E]/55 backdrop-blur-md py-4 sm:py-5 border-transparent"
        )}
      >
        {/* Scroll Progress Bar */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-[2px] bg-brand-red origin-left"
          style={{ scaleX }}
        />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 flex items-center justify-between">
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
            <div className="flex items-center gap-5 lg:gap-7">
              
              {/* Work Link */}
              <Link
                to="/work"
                className={desktopNavItemClass(isWorkActive)}
                aria-current={isWorkActive ? 'page' : undefined}
              >
                {isWorkActive && (
                  <span className="pointer-events-none absolute left-2 right-2 bottom-0 h-px rounded-full bg-brand-red" aria-hidden="true" />
                )}
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
                  className={cn(
                    desktopNavItemClass(isServicesActive || isServicesDropdownOpen),
                    isServicesDropdownOpen && "text-white"
                  )}
                  aria-expanded={isServicesDropdownOpen}
                  aria-haspopup="true"
                  aria-current={isServicesActive ? 'page' : undefined}
                >
                  {isServicesActive && (
                    <span className="pointer-events-none absolute left-2 right-8 bottom-0 h-px rounded-full bg-brand-red" aria-hidden="true" />
                  )}
                  <span className="relative z-10">{t('nav.services')}</span>

                  <ChevronDown className={cn(
                    "relative z-10 w-3.5 h-3.5 transition-[color,opacity] duration-300",
                    isServicesDropdownOpen ? "text-white opacity-100" : "text-[#8A909D] opacity-75"
                  )} />
                </button>
              </div>

              {/* About Link */}
              <Link
                to="/about"
                className={desktopNavItemClass(isAboutActive)}
                aria-current={isAboutActive ? 'page' : undefined}
              >
                {isAboutActive && (
                  <span className="pointer-events-none absolute left-2 right-2 bottom-0 h-px rounded-full bg-brand-red" aria-hidden="true" />
                )}
                <span className="relative z-10">{t('nav.about')}</span>

              </Link>

              {/* Careers Link */}
              <Link
                to="/careers"
                className={desktopNavItemClass(isCareersActive)}
                aria-current={isCareersActive ? 'page' : undefined}
              >
                {isCareersActive && (
                  <span className="pointer-events-none absolute left-0 right-0 bottom-0 h-[1.5px] origin-center rounded-full bg-brand-red" aria-hidden="true" />
                )}
                <span className="relative z-10">{t('nav.careers')}</span>
                <span className="pointer-events-none absolute left-0 right-0 bottom-[-1px] h-px origin-center scale-x-0 rounded-full bg-white/40 transition-transform duration-300 ease-out group-hover:scale-x-100" aria-hidden="true" />
              </Link>
            </div>

            {/* Start Project CTA */}
            <Link
              to="/contact"
              className="group relative isolate inline-flex items-center gap-2 h-10 px-5 lg:px-5 rounded-full border border-white/[0.12] bg-[#16181D]/75 text-[#F3F4F6] text-[11px] font-bold uppercase tracking-[0.14em] transition-[background-color,border-color,color,box-shadow] duration-500 ease-out shrink-0 hover:border-brand-red/45 hover:bg-brand-red hover:text-white hover:shadow-[0_12px_28px_-20px_rgba(229,9,20,0.45)]"
              data-cursor-label="Start"
            >
              <CtaFlowLine />
              <span className="relative z-10">{t('nav.startProject')}</span>
              <ChevronRight size={14} className="relative z-10 opacity-60 text-current transition-opacity duration-300 group-hover:opacity-100" />
            </Link>

            {/* Language Switcher EN | ID */}
            <div className="flex items-center gap-2 text-[10px] font-mono font-semibold tracking-[0.16em]">
              <button
                onClick={() => setLanguage('en')}
                className="group inline-flex h-7 items-center gap-1.5 px-1 text-[#8A909D] transition-colors duration-200 hover:text-white cursor-pointer"
                aria-label="Switch to English"
              >
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full transition-all duration-200",
                  language === 'en' ? "bg-brand-red shadow-[0_0_9px_rgba(229,9,20,0.7)]" : "bg-transparent"
                )} />
                <span className={cn(language === 'en' ? "text-white" : "text-[#8A909D]")}>EN</span>
              </button>
              <span className="h-3 w-px bg-white/[0.08]" aria-hidden="true" />
              <button
                onClick={() => setLanguage('id')}
                className="group inline-flex h-7 items-center gap-1.5 px-1 text-[#8A909D] transition-colors duration-200 hover:text-white cursor-pointer"
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
            <div className="flex items-center p-0.5 rounded-full bg-[#16181D] border border-[#262930] text-[11px] font-mono font-semibold">
              <button
                onClick={() => setLanguage('en')}
                className={cn(
                  "relative min-w-[32px] min-h-[36px] py-1 px-2 flex items-center justify-center cursor-pointer transition-colors duration-200",
                  language === 'en' ? "text-white font-bold before:absolute before:bottom-0 before:left-1/2 before:h-1 before:w-1 before:-translate-x-1/2 before:rounded-full before:bg-brand-red" : "text-[#8A909D]"
                )}
                aria-label="Switch to English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('id')}
                className={cn(
                  "relative min-w-[32px] min-h-[36px] py-1 px-2 flex items-center justify-center cursor-pointer transition-colors duration-200",
                  language === 'id' ? "text-white font-bold before:absolute before:bottom-0 before:left-1/2 before:h-1 before:w-1 before:-translate-x-1/2 before:rounded-full before:bg-brand-red" : "text-[#8A909D]"
                )}
                aria-label="Ganti ke Bahasa Indonesia"
              >
                ID
              </button>
            </div>

            <button 
              className="group w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl border border-white/[0.1] bg-[#16181D]/75 hover:border-white/20 hover:bg-[#1B1F26] flex items-center justify-center text-white transition-[border-color,background-color] duration-300 shrink-0 cursor-pointer"
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
              className="hidden md:block absolute top-full left-0 w-full bg-[#16181D]/98 backdrop-blur-2xl border-b border-[#262930] shadow-[0_25px_60px_rgba(0,0,0,0.95)] py-8 px-6 lg:px-12"
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
                        className="group block p-2.5 rounded-xl hover:bg-[#1B1F26] border border-transparent hover:border-[#262930] transition-all duration-200"
                      >
                        <div className="flex items-center justify-between text-sm font-semibold text-white group-hover:text-brand-red transition-colors">
                          <span>{item.title}</span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-50 text-brand-red transition-opacity duration-300 group-hover:opacity-100" />
                        </div>
                        <div className="text-xs text-[#8A909D] group-hover:text-white/90 transition-colors mt-0.5 font-light">
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
                        className="group block p-2.5 rounded-xl hover:bg-[#1B1F26] border border-transparent hover:border-[#262930] transition-all duration-200"
                      >
                        <div className="flex items-center justify-between text-sm font-semibold text-white group-hover:text-brand-red transition-colors">
                          <span>{item.title}</span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-50 text-brand-red transition-opacity duration-300 group-hover:opacity-100" />
                        </div>
                        <div className="text-xs text-[#8A909D] group-hover:text-white/90 transition-colors mt-0.5 font-light">
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
                        className="group block p-2.5 rounded-xl hover:bg-[#1B1F26] border border-transparent hover:border-[#262930] transition-all duration-200"
                      >
                        <div className="flex items-center justify-between text-sm font-semibold text-white group-hover:text-brand-red transition-colors">
                          <span>{item.title}</span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-50 text-brand-red transition-opacity duration-300 group-hover:opacity-100" />
                        </div>
                        <div className="text-xs text-[#8A909D] group-hover:text-white/90 transition-colors mt-0.5 font-light">
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
                        className="group block p-2.5 rounded-xl hover:bg-[#1B1F26] border border-transparent hover:border-[#262930] transition-all duration-200"
                      >
                        <div className="flex items-center justify-between text-sm font-semibold text-white group-hover:text-brand-red transition-colors">
                          <span>{item.title}</span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-50 text-brand-red transition-opacity duration-300 group-hover:opacity-100" />
                        </div>
                        <div className="text-xs text-[#8A909D] group-hover:text-white/90 transition-colors mt-0.5 font-light">
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
                  <ArrowUpRight className="w-3.5 h-3.5 text-brand-red opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
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
            className="fixed inset-0 z-[100] bg-[#0B0C0E]/98 flex flex-col p-4 sm:p-6 overflow-y-auto"
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
                <div className="flex items-center gap-1 text-[11px] font-mono font-semibold">
                  <button
                    onClick={() => setLanguage('en')}
                    className={cn(
                      "relative min-w-[32px] min-h-[36px] py-1 px-2 flex items-center justify-center cursor-pointer transition-[color,transform] duration-200 hover:-translate-y-px",
                      language === 'en' ? "bg-brand-red text-white font-bold" : "text-[#8A909D]"
                    )}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage('id')}
                    className={cn(
                      "relative min-w-[32px] min-h-[36px] py-1 px-2 flex items-center justify-center cursor-pointer transition-[color,transform] duration-200 hover:-translate-y-px",
                      language === 'id' ? "bg-brand-red text-white font-bold" : "text-[#8A909D]"
                    )}
                  >
                    ID
                  </button>
                </div>

                <button 
                  onClick={() => setIsMenuOpen(false)} 
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-[#16181D] border border-[#262930] hover:bg-[#1B1F26] hover:border-white/20 transition-[background-color,border-color,color] duration-300 text-white flex items-center justify-center shrink-0 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Nav Links in Mobile */}
            <div className="flex flex-col gap-2 my-auto py-6">
              
              {/* Work */}
              <Link
                to="/work"
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "group flex items-center justify-between py-3.5 px-1 rounded-none border-b border-white/[0.08] transition-[color,border-color] duration-300 min-h-[56px] hover:border-white/20",
                  location.pathname === '/work' 
                    ? "text-white font-bold border-brand-red/70" 
                    : "text-[#8A909D] hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-brand-red">01</span>
                  <span className="text-xl font-display">{t('nav.work')}</span>
                </div>
                <ChevronRight size={18} className="text-[#8A909D]/40" />
              </Link>

              {/* Services & Solutions (Accordion in Mobile Menu) */}
              <div className="group border-b border-white/[0.08] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsMobileServicesOpen(prev => !prev)}
                  className="w-full flex items-center justify-between py-3.5 px-1 text-left text-white font-display text-xl min-h-[56px] cursor-pointer transition-colors duration-300 hover:text-brand-red"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-brand-red">02</span>
                    <span>{t('nav.services')}</span>
                  </div>
                  <ChevronDown className={cn("w-5 h-5 transition-[color,opacity] duration-300", isMobileServicesOpen ? "text-brand-red opacity-100" : "text-[#8A909D] opacity-70")} />
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
                  "group flex items-center justify-between py-3.5 px-1 rounded-none border-b border-white/[0.08] transition-[color,border-color] duration-300 min-h-[56px] hover:border-white/20",
                  location.pathname === '/about' 
                    ? "text-white font-bold border-brand-red/70" 
                    : "text-[#8A909D] hover:text-white"
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
                  "group flex items-center justify-between py-3.5 px-1 rounded-none border-b border-white/[0.08] transition-[color,transform,border-color] duration-300 min-h-[56px] hover:border-white/20 hover:-translate-y-px",
                  location.pathname === '/careers' 
                    ? "text-white font-bold border-brand-red/70" 
                    : "text-[#8A909D] hover:text-white"
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
                  className="group relative isolate w-full h-12 rounded-xl border border-white/[0.12] bg-[#16181D]/80 text-[#F3F4F6] flex items-center justify-center text-xs font-semibold uppercase tracking-wider gap-2 hover:border-brand-red/45 hover:bg-brand-red hover:text-white hover:shadow-[0_12px_28px_-20px_rgba(229,9,20,0.4)] transition-[background-color,border-color,color,box-shadow] duration-500 ease-out cursor-pointer"
                  data-cursor-label="Start"
                >
                  <CtaFlowLine mobile />
                  <span className="relative z-10">{t('nav.startProject')}</span>
                  <ArrowUpRight size={16} className="relative z-10 opacity-60 text-current transition-opacity duration-300 group-hover:opacity-100" />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <a
                    href="mailto:hello@kapitech.co.id"
                    className="p-3 rounded-xl bg-[#16181D] border border-[#262930] flex items-center gap-2.5 text-white active:bg-[#1B1F26] transition-colors min-h-[44px]"
                  >
                    <Mail size={15} className="text-brand-red shrink-0" />
                    <span className="truncate">hello@kapitech.co.id</span>
                  </a>
                  <a
                    href="mailto:hello@kapitech.co.id"
                    className="p-3 rounded-xl bg-[#16181D] border border-[#262930] flex items-center gap-2.5 text-white active:bg-[#1B1F26] transition-colors min-h-[44px]"
                  >
                    <Mail size={15} className="text-[#8A909D] shrink-0" />
                    <span className="truncate">hello@kapitech.co.id</span>
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#8A909D] pt-1">
                <div className="flex gap-4">
                  <Instagram className="text-[#8A909D] hover:text-white cursor-pointer" size={16} />
                  <Linkedin className="text-[#8A909D] hover:text-white cursor-pointer" size={16} />
                  <Twitter className="text-[#8A909D] hover:text-white cursor-pointer" size={16} />
                </div>
                <span className="font-mono text-[10px] text-[#8A909D]">Tangerang Selatan, ID</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
