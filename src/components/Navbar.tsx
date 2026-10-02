import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { ArrowUpRight, ChevronDown, Instagram, Linkedin, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../lib/LanguageContext';
import { allSolutionsAndServices } from '../data/servicesData';

const groups = (category: 'Solutions' | 'Branding' | 'Design' | 'Development') =>
  allSolutionsAndServices.filter(item => item.category === category);

export const Navbar = () => {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const closeRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  const isServicesActive = location.pathname.startsWith('/services') || location.pathname.startsWith('/solutions');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setServicesOpen(false);
    setMobileOpen(false);
    setMobileServicesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => () => {
    if (closeRef.current) window.clearTimeout(closeRef.current);
  }, []);

  const openServices = () => {
    if (closeRef.current) window.clearTimeout(closeRef.current);
    setServicesOpen(true);
  };

  const queueClose = () => {
    closeRef.current = window.setTimeout(() => setServicesOpen(false), 120);
  };

  const serviceGroups = [
    ['Solutions', groups('Solutions')],
    ['Branding', groups('Branding')],
    ['Design', groups('Design')],
    ['Development', groups('Development')],
  ] as const;

  return (
    <>
      <nav className={`kapi-navbar ${scrolled ? 'is-scrolled' : ''}`} aria-label="Primary navigation">
        <motion.div className="kapi-navbar-progress" style={{ scaleX: progress }} />
        <div className="kapi-navbar-inner">
          <Link to="/" className="kapi-brand" aria-label="Kapitech Agency home">
            <img
              src="https://raw.githubusercontent.com/Kapitech-Agency/Kapitech-Agency.github.io/main/public/white.png"
              alt="Kapitech Agency"
            />
            <span>Kapitech Agency</span>
          </Link>

          <div className="kapi-nav-links">
            <Link to="/work" className={`kapi-nav-link ${location.pathname === '/work' ? 'is-active' : ''}`}>
              {t('nav.work')}
            </Link>

            <div className="kapi-nav-services" onMouseEnter={openServices} onMouseLeave={queueClose}>
              <button
                type="button"
                className={`kapi-nav-link ${isServicesActive ? 'is-active' : ''}`}
                onClick={() => setServicesOpen(value => !value)}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
              >
                <span>{t('nav.services')}</span>
                <ChevronDown size={14} style={{ transform: servicesOpen ? 'rotate(180deg)' : undefined }} />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    className="kapi-services-menu"
                    initial={{ opacity: 0, y: 12, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.99 }}
                    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                    onMouseEnter={openServices}
                    onMouseLeave={queueClose}
                  >
                    <div className="kapi-services-menu-head">
                      <div>
                        <span>{language === 'id' ? 'Kapabilitas' : 'Capabilities'}</span>
                        <p>{language === 'id' ? 'Solusi kreatif, digital product, dan engineering Kapitech.' : 'Kapitech creative, digital product, and engineering capabilities.'}</p>
                      </div>
                      <Link to="/services" className="kapi-nav-cta">
                        {language === 'id' ? 'Semua layanan' : 'All services'}
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                    <div className="kapi-services-menu-grid">
                      {serviceGroups.map(([label, items]) => (
                        <div key={label} className="kapi-services-menu-group">
                          <h4>{label}</h4>
                          {items.map(item => (
                            <Link key={item.slug} to={`/services/${item.slug}`}>
                              <span>{item.title}</span>
                              <ArrowUpRight size={13} />
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/about" className={`kapi-nav-link ${location.pathname === '/about' ? 'is-active' : ''}`}>
              {t('nav.about')}
            </Link>
            <Link to="/careers" className={`kapi-nav-link ${location.pathname === '/careers' ? 'is-active' : ''}`}>
              {t('nav.careers')}
            </Link>
          </div>

          <div className="kapi-nav-actions">
            <div className="kapi-language" role="group" aria-label="Language">
              <button type="button" className={language === 'en' ? 'is-active' : ''} onClick={() => setLanguage('en')}>EN</button>
              <button type="button" className={language === 'id' ? 'is-active' : ''} onClick={() => setLanguage('id')}>ID</button>
            </div>

            <Link to="/contact" className="kapi-nav-cta">
              {t('nav.startProject')}
              <ArrowUpRight size={14} />
            </Link>

            <button type="button" className="kapi-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
              <Menu size={19} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="kapi-mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="kapi-mobile-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.38, ease: [0.22,1,0.36,1] }}
            >
              <div className="kapi-mobile-head">
                <Link to="/" className="kapi-brand" onClick={() => setMobileOpen(false)}>
                  <img src="https://raw.githubusercontent.com/Kapitech-Agency/Kapitech-Agency.github.io/main/public/white.png" alt="Kapitech Agency" />
                  <span>Kapitech Agency</span>
                </Link>
                <button type="button" className="kapi-mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation">
                  <X size={19} />
                </button>
              </div>

              <div className="kapi-mobile-nav">
                <Link to="/work" onClick={() => setMobileOpen(false)}>
                  <span>01</span><strong>{t('nav.work')}</strong><ArrowUpRight size={16} />
                </Link>

                <button
                  type="button"
                  className="kapi-mobile-service-trigger"
                  onClick={() => setMobileServicesOpen(value => !value)}
                  aria-expanded={mobileServicesOpen}
                >
                  <span>02</span><strong>{t('nav.services')}</strong><ChevronDown size={17} style={{ transform: mobileServicesOpen ? 'rotate(180deg)' : undefined }} />
                </button>

                <AnimatePresence>
                  {mobileServicesOpen && (
                    <motion.div
                      className="kapi-mobile-services-list"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      {allSolutionsAndServices.map(item => (
                        <Link key={item.slug} to={`/services/${item.slug}`} onClick={() => setMobileOpen(false)}>
                          {item.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <Link to="/about" onClick={() => setMobileOpen(false)}>
                  <span>03</span><strong>{t('nav.about')}</strong><ArrowUpRight size={16} />
                </Link>
                <Link to="/careers" onClick={() => setMobileOpen(false)}>
                  <span>04</span><strong>{t('nav.careers')}</strong><ArrowUpRight size={16} />
                </Link>
              </div>

              <div className="kapi-mobile-bottom">
                <div className="kapi-language">
                  <button type="button" className={language === 'en' ? 'is-active' : ''} onClick={() => setLanguage('en')}>EN</button>
                  <button type="button" className={language === 'id' ? 'is-active' : ''} onClick={() => setLanguage('id')}>ID</button>
                </div>
                <Link to="/contact" className="kapi-mobile-cta" onClick={() => setMobileOpen(false)}>
                  {t('nav.startProject')}
                  <ArrowUpRight size={15} />
                </Link>
                <div style={{ display: 'flex', gap: 10, color: 'rgba(255,255,255,.36)' }}>
                  <a href="https://www.instagram.com/kapitechagency/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={16} /></a>
                  <a href="https://www.linkedin.com/company/kapitechagency/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={16} /></a>
                  <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '.12em' }}>Indonesia</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
