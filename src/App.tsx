import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { LanguageProvider, useLanguage } from './lib/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingContact } from './components/FloatingContact';
import { api } from './lib/apiClient';
import { cn } from './lib/utils';
import { PublicMotion } from './components/ui/PublicMotion';
import { SiteCursor } from './components/SiteCursor';
import { CookieConsent } from './components/CookieConsent';
import { SeoMeta } from './components/SeoMeta';
import { initAnalytics } from './lib/analytics';

const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Work = lazy(() => import('./pages/Work').then((m) => ({ default: m.Work })));
const Services = lazy(() => import('./pages/Services').then((m) => ({ default: m.Services })));
const Insights = lazy(() => import('./pages/Insights').then((m) => ({ default: m.Insights })));
const InsightDetail = lazy(() => import('./pages/InsightDetail').then((m) => ({ default: m.InsightDetail })));
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })));
const Contact = lazy(() => import('./pages/Contact').then((m) => ({ default: m.Contact })));
const Careers = lazy(() => import('./pages/Careers').then((m) => ({ default: m.Careers })));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail').then((m) => ({ default: m.ServiceDetail })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then((m) => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./pages/TermsOfService').then((m) => ({ default: m.TermsOfService })));
const AiInstructions = lazy(() => import('./pages/AiInstructions').then((m) => ({ default: m.AiInstructions })));
const EditorialPolicy = lazy(() => import('./pages/EditorialPolicy').then((m) => ({ default: m.EditorialPolicy })));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy').then((m) => ({ default: m.CookiePolicy })));
const CaseStudyDetail = lazy(() => import('./pages/CaseStudyDetail').then((m) => ({ default: m.CaseStudyDetail })));
const Industries = lazy(() => import('./pages/Industries').then((m) => ({ default: m.Industries })));
const IndustryDetail = lazy(() => import('./pages/IndustryDetail').then((m) => ({ default: m.IndustryDetail })));
const Clients = lazy(() => import('./pages/Clients').then((m) => ({ default: m.Clients })));
const ClientDetail = lazy(() => import('./pages/ClientDetail').then((m) => ({ default: m.ClientDetail })));
const Resources = lazy(() => import('./pages/Resources').then((m) => ({ default: m.Resources })));
const ResourceDetail = lazy(() => import('./pages/ResourceDetail').then((m) => ({ default: m.ResourceDetail })));
const Faq = lazy(() => import('./pages/Faq').then((m) => ({ default: m.Faq })));
const Search = lazy(() => import('./pages/Search').then((m) => ({ default: m.Search })));
const BookCall = lazy(() => import('./pages/BookCall').then((m) => ({ default: m.BookCall })));
const NotFound = lazy(() => import('./pages/NotFound'));

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.replace(/^#/, ''));
      window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' });
      });
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
};

class RouteErrorBoundary extends React.Component<
  { children: React.ReactNode; pathname: string },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: unknown): { error: Error } {
    return {
      error: error instanceof Error ? error : new Error(String(error))
    };
  }

  componentDidCatch(error: Error): void {
    console.error('[Kapitech Public Site] route render failed:', {
      pathname: this.props.pathname,
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  }

  render() {
    if (!this.state.error) return this.props.children;

    const isInsight = this.props.pathname.startsWith('/insights/');
    return (
      <section className="flex min-h-[55vh] w-full items-center justify-center bg-[#0B0C0E] px-5 py-24 sm:px-8">
        <div className="w-full max-w-2xl">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-brand-red">
            {isInsight ? 'Insight / Runtime error' : 'Page / Runtime error'}
          </p>
          <h1 className="mt-4 text-3xl font-display font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            {isInsight ? 'The article could not be rendered.' : 'This page could not be rendered.'}
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#8B929F]">
            {isInsight
              ? 'A client-side error occurred while rendering this article. Reload the page or return to the Insights library.'
              : 'A client-side error occurred while rendering this page. Reload the page or return to the home page.'}
          </p>
          {import.meta.env.DEV ? (
            <pre className="mt-6 max-h-40 overflow-auto rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 text-xs leading-6 text-[#B9BEC8]">
              {this.state.error.name + ': ' + this.state.error.message}
            </pre>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-full bg-brand-red px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-white"
            >
              Reload
            </button>
            <a
              href={isInsight ? '/insights' : '/'}
              className="inline-flex items-center justify-center rounded-full border border-white/[0.09] bg-white/[0.04] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-white"
            >
              {isInsight ? 'Back to Insights' : 'Back to Home'}
            </a>
          </div>
        </div>
      </section>
    );
  }
}

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
        <RouteErrorBoundary key={location.pathname} pathname={location.pathname}>
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
              <Route path="/work/:slug" element={<CaseStudyDetail />} />
              <Route path="/services" element={<Services />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/insights/:slug" element={<InsightDetail />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/solutions/:slug" element={<ServiceDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/industries" element={<Industries />} />
              <Route path="/industries/:slug" element={<IndustryDetail />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/clients/:slug" element={<ClientDetail />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/:slug" element={<ResourceDetail />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/search" element={<Search />} />
              <Route path="/book-a-call" element={<BookCall />} />
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
        </RouteErrorBoundary>
      </motion.div>
    </AnimatePresence>
  );
};

function AppShell() {
  const { language } = useLanguage();
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);

  useEffect(() => {
    initAnalytics();
    let cancelled = false;

    void api.cms.getPublicSettings().then((res) => {
      if (cancelled || !res.success || !res.data?.settings) return;

      const { siteTitle, siteDescription, maintenanceMode: serverMaintenanceMode } = res.data.settings;
      setMaintenanceMode(Boolean(serverMaintenanceMode));

      // SeoMeta is the single source of truth for route-specific title and description.
      // CMS site settings must not overwrite indexable page metadata after navigation.
    }).catch(() => undefined);

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
      <a
        href="#main-content"
        className="kapi-skip-link"
      >
        {language === 'id' ? 'Lewati ke konten utama' : 'Skip to main content'}
      </a>
      <Navbar />
      <div className={cn('relative z-10 text-white selection:bg-brand-red selection:text-white min-h-screen flex flex-col kapi-public-shell')}>
        <PublicMotion />
        <main id="main-content" className="flex-grow flex flex-col" tabIndex={-1}>
          <AnimatedRoutes />
        </main>
        <Footer />
        <FloatingContact />
        <CookieConsent />
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
          <SeoMeta />
          <AppShell />
        </Router>
      </LanguageProvider>
    </MotionConfig>
  );
}
