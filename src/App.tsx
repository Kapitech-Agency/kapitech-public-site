import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { LanguageProvider, useLanguage } from './lib/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingContact } from './components/FloatingContact';
import { api } from './lib/apiClient';
import { fetchServerCmsProjects, fetchServerCmsServices, fetchServerCmsTestimonials } from './lib/cmsStore';
import { cn } from './lib/utils';
import { PublicMotion } from './components/ui/PublicMotion';
import { SiteCursor } from './components/SiteCursor';

const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Work = lazy(() => import('./pages/Work').then((m) => ({ default: m.Work })));
const Services = lazy(() => import('./pages/Services').then((m) => ({ default: m.Services })));
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })));
const Contact = lazy(() => import('./pages/Contact').then((m) => ({ default: m.Contact })));
const Careers = lazy(() => import('./pages/Careers').then((m) => ({ default: m.Careers })));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail').then((m) => ({ default: m.ServiceDetail })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then((m) => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./pages/TermsOfService').then((m) => ({ default: m.TermsOfService })));
const AiInstructions = lazy(() => import('./pages/AiInstructions').then((m) => ({ default: m.AiInstructions })));
const EditorialPolicy = lazy(() => import('./pages/EditorialPolicy').then((m) => ({ default: m.EditorialPolicy })));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy').then((m) => ({ default: m.CookiePolicy })));
const NotFound = lazy(() => import('./pages/NotFound'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="w-full flex-1 flex flex-col"
      >
        <Suspense
          fallback={
            <div className="flex min-h-[40vh] items-center justify-center px-6 text-sm text-white/60" role="status" aria-live="polite">
              Loading…
            </div>
          }
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/solutions/:slug" element={<ServiceDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/ai-instructions" element={<AiInstructions />} />
            <Route path="/editorial-policy" element={<EditorialPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

function AppShell() {
  const { language } = useLanguage();
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);

  useEffect(() => {
    let cancelled = false;

    void api.cms.getPublicSettings().then((res) => {
      if (cancelled || !res.success || !res.data?.settings) return;

      const { siteTitle, siteDescription, maintenanceMode: serverMaintenanceMode } = res.data.settings;
      setMaintenanceMode(Boolean(serverMaintenanceMode));

      if (siteTitle) document.title = siteTitle;
      if (siteDescription) {
        let description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
        if (!description) {
          description = document.createElement('meta');
          description.name = 'description';
          document.head.appendChild(description);
        }
        description.content = siteDescription;
      }
    }).catch(() => undefined);

    void Promise.all([
      fetchServerCmsServices(),
      fetchServerCmsProjects(),
      fetchServerCmsTestimonials()
    ]).finally(() => {
      if (!cancelled) {
        window.dispatchEvent(new Event('kapitech_cms_updated'));
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (maintenanceMode) {
    return (
      <div className="kapi-public-shell min-h-screen bg-[var(--k-bg-deep)] text-white flex items-center justify-center px-6">
        <div className="w-full max-w-xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-red/30 bg-brand-red/10 text-brand-red text-xs font-sans uppercase tracking-[0.16em] mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
            <span>Maintenance</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-sans font-bold tracking-[-0.04em] leading-[1.05] mb-4">
            We’re working on the site.
          </h1>
          <p className="text-sm sm:text-base text-[var(--k-text-secondary)] leading-relaxed max-w-lg mx-auto">
            {language === 'id'
              ? 'Website Kapitech sedang dalam pemeliharaan. Silakan kembali beberapa saat lagi.'
              : 'Kapitech is currently performing maintenance. Please check back shortly.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SiteCursor />
      <Navbar />
      <div className={cn('relative z-10 text-white selection:bg-brand-red selection:text-white min-h-screen flex flex-col kapi-public-shell')}>
        <PublicMotion />
        <main className="flex-grow flex flex-col">
          <AnimatedRoutes />
        </main>
        <Footer />
        <FloatingContact />
      </div>
    </>
  );
};

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <Router>
          <ScrollToTop />
          <AppShell />
        </Router>
      </LanguageProvider>
    </MotionConfig>
  );
}
