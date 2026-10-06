import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, 
  CheckCircle2, 
  Globe, 
  Cpu, 
  Layout, 
  Code2, 
  Palette, 
  Box, 
  Shield, 
  Layers, 
  X, 
  Smartphone, 
  Sparkles, 
  Building2, 
  Briefcase, 
  Users, 
  BarChart3, 
  ChevronRight,
  Video,
  Film,
  ShoppingCart,
  Server,
  Wrench,
  TrendingUp,
  Target
} from 'lucide-react';
import { PerspectiveTilt } from '../components/ui/PerspectiveTilt';
import { Testimonials } from '../components/Testimonials';
import PatternWaves from '../components/ui/PatternWaves/PatternWavesTyped';
import { useLanguage } from '../lib/LanguageContext';
import {
  fetchServerCmsProjects,
  getCmsProjects,
  fetchServerCmsServices,
  getCmsServices,
} from '../lib/cmsStore';
import { cn } from '../lib/utils';
import { allSolutionsAndServices } from '../data/servicesData';

const ProcessModalPortal = ({ children }: { children: React.ReactNode }) => {
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

export const Home = () => {
  const { t, language } = useLanguage();
  const [projectsList, setProjectsList] = useState(() => getCmsProjects());
  const [cmsServices, setCmsServices] = useState(() => getCmsServices());
  const [activeProcessStep, setActiveProcessStep] = useState(0);
  const [selectedProcessStep, setSelectedProcessStep] = useState<number | null>(null);
  const processModalRef = React.useRef<HTMLDivElement>(null);
  const processModalTriggerRef = React.useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleCmsUpdate = () => {
      setProjectsList(getCmsProjects());
      setCmsServices(getCmsServices());
    };

    window.addEventListener('kapitech_cms_updated', handleCmsUpdate);
    void fetchServerCmsProjects().then(() => {
      setProjectsList(getCmsProjects());
    });
    void fetchServerCmsServices().then(() => {
      setCmsServices(getCmsServices());
    });

    return () => window.removeEventListener('kapitech_cms_updated', handleCmsUpdate);
  }, []);

  const openProcessStep = (index: number) => {
    if (selectedProcessStep === null) {
      processModalTriggerRef.current = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    }
    setActiveProcessStep(index);
    setSelectedProcessStep(index);
  };

  useEffect(() => {
    if (selectedProcessStep === null) return;

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedProcessStep(null);
        return;
      }

      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        setSelectedProcessStep((current) => {
          if (current === null) return current;
          const next = event.key === 'ArrowLeft'
            ? Math.max(0, current - 1)
            : Math.min(processSteps.length - 1, current + 1);
          setActiveProcessStep(next);
          return next;
        });
        return;
      }

      if (event.key !== 'Tab') return;

      const dialog = processModalRef.current;
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
    };
  }, [selectedProcessStep]);

  useEffect(() => {
    if (selectedProcessStep !== null) return;

    if (processModalTriggerRef.current && document.contains(processModalTriggerRef.current)) {
      processModalTriggerRef.current.focus();
    }
    processModalTriggerRef.current = null;
  }, [selectedProcessStep]);

  const selectedClients = Array.from(
    new Set(
      projectsList
        .map((project) => String(project.client || '').trim())
        .filter(Boolean),
    ),
  ).slice(0, 8);

  const techStack = [
    { name: "React", category: "Frontend", icon: <Layout size={18} /> },
    { name: "Next.js", category: "Full-Stack", icon: <Globe size={18} /> },
    { name: "TypeScript", category: "Core", icon: <Code2 size={18} /> },
    { name: "Tailwind CSS", category: "Styling", icon: <Palette size={18} /> },
    { name: "Node.js", category: "Backend", icon: <Cpu size={18} /> },
    { name: "Figma", category: "Design", icon: <Box size={18} /> },
    { name: "PostgreSQL", category: "Database", icon: <Layers size={18} /> },
    { name: "AWS & GCP", category: "Cloud", icon: <Shield size={18} /> },
  ];

  const featuredProjects = projectsList
    .filter((project) => project.featured && project.isPublished !== false)
    .slice(0, 3);

  const stats = [
    {
      index: "01",
      label: language === 'id' ? "Berjalan sejak" : "Established",
      value: "2021",
      meta: language === 'id' ? "Kapitech Agency" : "Kapitech Agency",
      desc: language === 'id' ? "Studio digital yang berkembang dari design hingga engineering." : "A digital studio spanning design and engineering."
    },
    {
      index: "02",
      label: language === 'id' ? "Model layanan" : "Delivery Model",
      value: "E2E",
      meta: language === 'id' ? "Strategy • Design • Code" : "Strategy • Design • Code",
      desc: language === 'id' ? "Satu alur kerja untuk merencanakan, merancang, dan membangun." : "One workflow for strategy, design, and engineering."
    },
    {
      index: "03",
      label: language === 'id' ? "Fokus pasar" : "Client Focus",
      value: "B2B",
      suffix: " • SME + Enterprise",
      meta: language === 'id' ? "Tim lean hingga organisasi besar" : "Lean teams to complex organizations",
      desc: language === 'id' ? "Engagement disesuaikan dengan kebutuhan tim dan tahap bisnis." : "Engagements adapt to team needs and business stage."
    },
    {
      index: "04",
      label: language === 'id' ? "Kekuatan utama" : "Core Strength",
      value: "01",
      meta: language === 'id' ? "Design + Engineering" : "Design + Engineering",
      desc: language === 'id' ? "Kapabilitas visual dan teknis dalam satu partner kerja." : "Visual and technical capabilities through one delivery partner."
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: language === 'id' ? "Penemuan & Ruang Lingkup" : "Discovery & Scope",
      desc: language === 'id'
        ? "Kami menganalisis target bisnis, audiens sasaran, dan kebutuhan teknis untuk merancang roadmap kerja yang terukur."
        : "We analyze your business goals, target audience, and project specifications to create an actionable roadmap.",
      objective: language === 'id'
        ? "Menyamakan arah bisnis, kebutuhan pengguna, batasan teknis, dan definisi keberhasilan sebelum pekerjaan inti dimulai."
        : "Align business goals, user needs, technical constraints, and success criteria before core production begins.",
      activities: language === 'id'
        ? ["Workshop kebutuhan & tujuan", "Audit existing product / website", "Prioritisasi scope & roadmap", "Definisi milestone dan success criteria"]
        : ["Goals & requirements workshop", "Existing product / website audit", "Scope prioritization & roadmap", "Milestone and success criteria definition"],
      deliverables: language === 'id'
        ? ["Project brief", "Scope & priority map", "User / stakeholder insights", "Roadmap delivery"]
        : ["Project brief", "Scope & priority map", "User / stakeholder insights", "Delivery roadmap"],
      checkpoint: language === 'id'
        ? "Scope disetujui bersama sebelum masuk ke tahap desain."
        : "The scope is aligned and approved before design work begins."
    },
    {
      step: "02",
      title: language === 'id' ? "Desain UI/UX & Prototipe" : "UI/UX & Prototyping",
      desc: language === 'id'
        ? "Kami merancang wireframe, alur pengguna, dan prototipe interaktif di Figma untuk ditinjau dan disetujui sebelum coding."
        : "We design wireframes, user flows, and interactive mockups in Figma for your review and approval before coding.",
      objective: language === 'id'
        ? "Mengubah kebutuhan menjadi experience yang jelas, teruji, dan siap di-handoff ke engineering."
        : "Turn requirements into a clear, validated experience that is ready for engineering handoff.",
      activities: language === 'id'
        ? ["Information architecture", "Wireframe & user flow", "High-fidelity UI", "Prototype & design review"]
        : ["Information architecture", "Wireframes & user flows", "High-fidelity UI", "Prototype & design review"],
      deliverables: language === 'id'
        ? ["UI/UX design", "Interactive prototype", "Design system / components", "Developer handoff"]
        : ["UI/UX design", "Interactive prototype", "Design system / components", "Developer handoff"],
      checkpoint: language === 'id'
        ? "Prototype dan visual direction siap diproduksi."
        : "The prototype and visual direction are production-ready."
    },
    {
      step: "03",
      title: language === 'id' ? "Pengembangan Agile" : "Agile Development",
      desc: language === 'id'
        ? "Tim engineer kami menulis kode yang bersih, teruji, dan modular dengan laporan kemajuan berkala di setiap milestone."
        : "Our engineering team writes clean, tested, and modular code with regular milestone updates and progress demos.",
      objective: language === 'id'
        ? "Membangun produk yang stabil, maintainable, dan sesuai dengan keputusan desain serta kebutuhan bisnis."
        : "Build a stable, maintainable product that stays aligned with design decisions and business requirements.",
      activities: language === 'id'
        ? ["Frontend / backend implementation", "API & third-party integration", "Responsive & state handling", "Sprint review & progress demo"]
        : ["Frontend / backend implementation", "API & third-party integration", "Responsive & state handling", "Sprint reviews & progress demos"],
      deliverables: language === 'id'
        ? ["Production-ready features", "Integrated services", "Responsive implementation", "Progress builds"]
        : ["Production-ready features", "Integrated services", "Responsive implementation", "Progress builds"],
      checkpoint: language === 'id'
        ? "Milestone fungsional tervalidasi sebelum release candidate."
        : "Functional milestones are validated before the release candidate."
    },
    {
      step: "04",
      title: language === 'id' ? "Pengujian & Peluncuran" : "Testing & Launch",
      desc: language === 'id'
        ? "QA menyeluruh di berbagai peramban dan perangkat, konfigurasi domain, deployment cloud, dan garansi pemeliharaan."
        : "Comprehensive QA across browsers and devices, domain setup, deployment, and ongoing post-launch maintenance.",
      objective: language === 'id'
        ? "Memastikan produk siap digunakan, aman, stabil, dan dapat dipantau setelah live."
        : "Make sure the product is ready to launch, stable in production, and supported after going live.",
      activities: language === 'id'
        ? ["Functional QA & regression testing", "Browser / device checks", "Production deployment", "Post-launch monitoring"]
        : ["Functional QA & regression testing", "Browser / device checks", "Production deployment", "Post-launch monitoring"],
      deliverables: language === 'id'
        ? ["QA checklist", "Production release", "Deployment configuration", "Post-launch support"]
        : ["QA checklist", "Production release", "Deployment configuration", "Post-launch support"],
      checkpoint: language === 'id'
        ? "Release dinyatakan siap dan handover dilakukan."
        : "The release is signed off and handover is completed."
    }
  ];

  return (
    <div className="bg-[#0B0C0E] text-white min-h-screen selection:bg-brand-red selection:text-white">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-center px-4 sm:px-6 md:px-12 py-24 sm:py-32 md:py-36 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-auto" aria-hidden="true">
          <PatternWaves
            preset="silk"
            color="#dc143c"
            backgroundColor="#170f0f"
            opacity={0.58}
            fade="none"
            fadeSize={0.7}
            interactive
            cursorSize={50}
            cursorStrength={0.6}
            speed={0.28}
            scale={1.05}
            depth={0.72}
            shine={0.7}
            contrast={1.08}
            intro
          />
          <div className="absolute inset-y-0 left-0 w-[14%] bg-gradient-to-r from-[#0B0C0E]/65 via-[#0B0C0E]/20 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-[14%] bg-gradient-to-l from-[#0B0C0E]/65 via-[#0B0C0E]/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-28 sm:h-36 bg-gradient-to-b from-transparent via-[#0B0C0E]/72 to-[#0B0C0E] pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 -translate-y-2 sm:-translate-y-3 md:-translate-y-4">
          <div className="max-w-4xl lg:max-w-5xl">
            {/* Status Chip */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[#262930] bg-[#16181D]/80 backdrop-blur-md mb-6 sm:mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red"></span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono tracking-wider uppercase text-[#8A909D]">
                Digital Product Design & Development Agency
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.25rem] xl:text-[6rem] font-display font-bold leading-[1.03] tracking-[-0.045em] max-w-4xl mb-5 sm:mb-8 text-white">
              {language === 'id' ? (
                <>Studio produk digital yang dirancang untuk <span className="text-brand-red">membangun & memperluas</span> bisnis Anda.</>
              ) : (
                <>Digital product studio crafted to <span className="text-brand-red">build & scale</span> your business.</>
              )}
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#8A909D] font-light leading-[1.7] max-w-2xl mb-8 sm:mb-10">
              {language === 'id'
                ? 'Kami merancang dan mengembangkan website berkinerja tinggi, aplikasi web kustom, sistem visual, dan infrastruktur cloud terpercaya untuk bisnis visioner.'
                : 'We design and develop high-performance websites, custom web applications, visual systems, and resilient cloud infrastructures for visionary enterprises.'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
              <Link 
                to="/contact" 
                className="h-12 sm:h-13 px-7 sm:px-8 bg-brand-red hover:bg-[#FF1E27] text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg shadow-brand-red/20 active:scale-95"
              >
                <span>{language === 'id' ? 'Mulai Proyek' : 'Start a Project'}</span>
                <ArrowUpRight size={16} />
              </Link>
              <Link 
                to="/work" 
                className="h-12 sm:h-13 px-7 sm:px-8 rounded-full border border-[#262930] bg-[#16181D] hover:bg-[#1B1F26] text-white transition-colors duration-300 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95"
              >
                <span>{language === 'id' ? 'Jelajahi Case Studies' : 'Explore Case Studies'}</span>
              </Link>
            </div>

            <div className="mt-5 sm:mt-6 inline-flex items-center gap-3 text-[#8A909D]">
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.18em] text-[#8A909D]/75">
                {language === 'id' ? 'Partner' : 'Partner'}
              </span>
              <span className="h-px w-5 sm:w-7 bg-[#262930]" aria-hidden="true" />
              <a
                href="https://www.hostinger.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-lg opacity-90 hover:opacity-100 transition-opacity duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
                aria-label="Hostinger Partner"
              >
                <img
                  src="/hostinger-partner-badge.svg"
                  alt="Hostinger Partner"
                  width="112"
                  height="42"
                  className="w-28 h-auto"
                />
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* STUDIO PROOF / EDITORIAL METRICS */}
      <section
        className="relative overflow-hidden py-16 sm:py-20 lg:py-24 px-4 sm:px-6 md:px-12 bg-[#0B0C0E]"
        aria-label="Agency metrics"
      >
        <div className="max-w-7xl mx-auto relative">
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.018] p-5 sm:p-7 lg:p-8 pb-6 sm:pb-8 lg:pb-9 backdrop-blur-xl overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.025),0_24px_70px_-58px_rgba(229,9,20,0.22)]">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-7 lg:gap-12 items-end mb-8 sm:mb-10 lg:mb-11">
            <div>
              <span className="kapi-section-label mb-5">
                {language === 'id' ? 'SEKILAS KAPITECH' : 'A FEW SIGNALS'}
              </span>
              <h2 className="mt-4 max-w-xl text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] font-display font-semibold tracking-[-0.06em] leading-[0.98] text-white">
                {language === 'id' ? 'Pengalaman yang terlihat dari pekerjaan kami.' : 'Experience you can see in the work.'}
              </h2>
            </div>
            <p className="max-w-xl lg:justify-self-end text-sm sm:text-base leading-[1.8] text-[#8A909D] font-light">
              {language === 'id'
                ? 'Bukan sekadar angka. Ini adalah potongan kecil dari bagaimana Kapitech bekerja: dekat dengan bisnis, serius pada detail, dan terlibat dari awal sampai selesai.'
                : 'Not just numbers. A small glimpse into how Kapitech works: close to the business, serious about detail, and involved from first brief to final delivery.'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-stretch gap-3 sm:gap-3.5 lg:gap-4">
            {stats.map((stat, i) => {
              return (
                <motion.article
                  key={stat.index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-12% 0px' }}
                  transition={{ duration: 0.7, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className={`group relative h-full min-h-[232px] rounded-2xl border border-white/[0.07] bg-white/[0.014] p-5 sm:p-5 lg:p-6 transition-[background-color,border-color,box-shadow] duration-300 hover:border-brand-red/20 hover:bg-white/[0.022] shadow-[inset_0_1px_0_rgba(255,255,255,0.018)]`}
                >
                  <div className="flex items-start justify-between gap-6">
                    <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#8A909D] transition-colors duration-300 group-hover:text-white">
                      {stat.label}
                    </span>
                    <span className="text-[10px] font-mono tabular-nums text-[#8A909D]/60 group-hover:text-brand-red transition-colors duration-300">
                      {stat.index}
                    </span>
                  </div>
                  <div className="mt-7 sm:mt-8 flex min-w-0 flex-1 flex-col gap-3">
                    <div className="flex min-w-0 min-h-[4.25rem] sm:min-h-[5rem] items-end flex-wrap gap-x-2.5 gap-y-1.5">
                      <span className="min-w-0 max-w-full text-[3.25rem] sm:text-[4.25rem] lg:text-[4.5rem] font-display font-semibold leading-[0.86] tracking-[-0.07em] text-white transition-colors duration-500 group-hover:text-brand-red break-words">
                        {stat.value}
                      </span>
                      {stat.suffix && (
                        <span className="max-w-[104px] sm:max-w-[112px] text-[10px] sm:text-xs font-mono leading-tight text-[#8A909D]">
                          {stat.suffix}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="h-px w-7 bg-brand-red/60 transition-all duration-500 group-hover:w-12" />
                      <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.14em] text-brand-red/85">
                        {stat.meta}
                      </span>
                    </div>
                    <p className="max-w-xl text-xs sm:text-sm leading-[1.7] text-[#8A909D] font-light">
                      {stat.desc}
                    </p>
                  </div>
                  <span
                    className="pointer-events-none absolute inset-x-5 sm:inset-x-6 top-0 h-px origin-left scale-x-0 rounded-full bg-brand-red/70 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                    aria-hidden="true"
                  />
                </motion.article>
              );
            })}
          </div>
          </div>
        </div>
      </section>
      {/* SELECTED CLIENT WORK */}
      <section
        className="relative overflow-hidden border-b border-[#262930] bg-[#0B0C0E] py-14 sm:py-20"
        id="clients"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-10 max-w-4xl px-4 text-center sm:mb-12 sm:px-6 md:px-12">
            <span className="kapi-section-label mb-5">
              {language === 'id' ? 'KLIEN TERPILIH' : 'SELECTED CLIENT WORK'}
            </span>
            <h2 className="mt-4 text-2xl font-display font-semibold leading-[1.08] tracking-[-0.045em] text-white sm:text-3xl md:text-4xl lg:text-[2.75rem]">
              {language === 'id'
                ? 'Perusahaan dan organisasi Indonesia yang pernah bekerja bersama Kapitech.'
                : 'Companies and organizations in Indonesia that have worked with Kapitech.'}
            </h2>
          </div>

          {(() => {
            const clientLogos = [
              {
                name: 'Pertamina',
                src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Pertamina_Logo.svg',
                className: 'h-9 sm:h-10 lg:h-11 max-w-[165px]',
              },
              {
                name: 'Bank BTN',
                src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/BTN_2024.svg',
                className: 'h-9 sm:h-10 lg:h-11 max-w-[135px]',
              },
              {
                name: 'Indonesia Investment Authority',
                src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo_Indonesia_Investment_Authority.svg',
                className: 'h-8 sm:h-9 lg:h-10 max-w-[180px]',
              },
              {
                name: 'Indonesia Healthcare Corporation',
                src: 'https://www.ihc.id/images/icons/logo-ihc-removebg-preview%201.svg',
                className: 'h-10 sm:h-11 lg:h-12 max-w-[175px]',
              },
              {
                name: 'BKKBN',
                src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo_Kementerian_Kependudukan_dan_Pembangunan_Keluarga_-_BKKBN_%282024%29.svg',
                className: 'h-11 sm:h-12 lg:h-14 max-w-[105px]',
              },
              {
                name: 'Navees Gold',
                src: 'https://naveesgold.id/_assets/logo-footer.De4CENjg_ZJnBAz.webp',
                className: 'h-10 sm:h-11 lg:h-12 max-w-[135px]',
              },
              {
                name: 'MarkPlus, Inc.',
                src: 'https://www.markplusinc.com/assets/logo/logo-new.png',
                className: 'h-10 sm:h-11 lg:h-12 max-w-[185px]',
              },
              {
                name: 'Sababay Winery',
                src: 'https://sababaywinery.com/cdn/shop/files/Logo-Sababay-Black_300x300.gif?v=1723305632',
                className: 'h-11 sm:h-12 lg:h-14 max-w-[145px]',
              },
            ];

            const rowOne = [...clientLogos, ...clientLogos, ...clientLogos];
            const rowTwo = [...clientLogos.slice(4), ...clientLogos.slice(0, 4), ...clientLogos.slice(4), ...clientLogos.slice(0, 4)];

            const renderRow = (logos, keyPrefix, reverse = false) => (
              <div className="relative w-full overflow-hidden py-4 sm:py-5">
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-[#0B0C0E] via-[#0B0C0E]/90 to-transparent sm:w-28 lg:w-40"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-[#0B0C0E] via-[#0B0C0E]/90 to-transparent sm:w-28 lg:w-40"
                  aria-hidden="true"
                />

                <motion.div
                  className="flex w-max shrink-0 items-center gap-10 pr-10 sm:gap-16 sm:pr-16 lg:gap-20 lg:pr-20"
                  animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
                  transition={{
                    duration: reverse ? 34 : 30,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  {logos.map((logo, index) => (
                    <div
                      key={`${keyPrefix}-${logo.name}-${index}`}
                      className="flex h-16 w-[170px] shrink-0 items-center justify-center px-4 sm:h-18 sm:w-[220px] sm:px-6 lg:h-20 lg:w-[250px]"
                    >
                      <img
                        src={logo.src}
                        alt={logo.name}
                        loading="lazy"
                        decoding="async"
                        className={cn(
                          'w-auto object-contain opacity-55 grayscale brightness-0 invert transition-[opacity,transform] duration-300 hover:scale-[1.035] hover:opacity-100',
                          logo.className
                        )}
                      />
                    </div>
                  ))}
                </motion.div>
              </div>
            );

            return (
              <div className="relative">
                {renderRow(rowOne, 'row-1')}
                {renderRow(rowTwo, 'row-2', true)}
              </div>
            );
          })()}
        </div>
      </section>

      {/* SERVICES & SOLUTIONS */}
      <section
        className="relative overflow-hidden border-b border-[#262930] bg-[#0B0C0E] px-4 py-16 sm:px-6 sm:py-20 md:px-12 lg:py-24"
        id="engagement"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 grid gap-7 sm:mb-12 lg:mb-14 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.42fr)] lg:items-end lg:gap-14">
            <div className="max-w-4xl">
              <span className="kapi-section-label mb-5">
                {language === 'id' ? 'SERVICES & SOLUTIONS' : 'SERVICES & SOLUTIONS'}
              </span>
              <h2 className="mt-4 max-w-4xl text-3xl font-display font-semibold leading-[1.01] tracking-[-0.055em] text-white sm:text-4xl md:text-5xl lg:text-[4rem]">
                {language === 'id'
                  ? 'Pilih kapabilitas yang Anda butuhkan, lalu lanjut ke solusi yang paling relevan.'
                  : 'Choose the capability you need, then move into the solution that fits.'}
              </h2>
            </div>

            <div className="max-w-md lg:justify-self-end lg:pb-1">
              <p className="text-xs font-light leading-[1.8] text-[#8A909D] sm:text-sm">
                {language === 'id'
                  ? 'Mulai dari layanan yang paling dekat dengan kebutuhan Anda. Untuk kebutuhan yang lebih spesifik, pilih jalur solusi yang sesuai dengan situasi proyek.'
                  : 'Start with the service closest to your need. For a more specific need, choose the solution that fits your project situation.'}
              </p>
              <Link
                to="/contact"
                className="mt-4 inline-flex items-center gap-2 text-[10px] font-mono font-semibold uppercase tracking-[0.14em] text-[#A7ACB5] transition-colors duration-300 hover:text-white"
              >
                <span>{language === 'id' ? 'Diskusikan kebutuhan Anda' : 'Discuss your project'}</span>
                <ArrowUpRight size={13} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3">
            {(['Branding', 'Design', 'Development'] as const).map((category, index) => {
              const services = cmsServices.filter(
                (service) => service.type === 'service' && service.category === category,
              );
              const categoryMeta = {
                Branding: {
                  descriptor: 'Brand & visual communication',
                  bestFor: language === 'id'
                    ? 'Untuk bisnis yang perlu tampil lebih konsisten, kredibel, dan mudah dikenali.'
                    : 'For businesses that need a clearer, more credible, and recognizable brand.',
                  action: language === 'id' ? 'Mulai dari branding' : 'Start with branding',
                },
                Design: {
                  descriptor: 'Product & digital experience',
                  bestFor: language === 'id'
                    ? 'Untuk tim yang ingin memperjelas experience, usability, dan conversion sebelum atau saat build.'
                    : 'For teams improving product experience, usability, and conversion before or during build.',
                  action: language === 'id' ? 'Mulai dari design' : 'Start with design',
                },
                Development: {
                  descriptor: 'Web & digital product delivery',
                  bestFor: language === 'id'
                    ? 'Untuk bisnis yang siap mengubah kebutuhan dan desain menjadi website atau produk digital yang berjalan.'
                    : 'For businesses ready to turn requirements and design into working websites or digital products.',
                  action: language === 'id' ? 'Mulai dari development' : 'Start with development',
                },
              }[category];

              return (
                <article
                  key={category}
                  className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.014] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.018)] transition-[background-color,border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-brand-red/20 hover:bg-white/[0.022] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.028),0_18px_40px_-30px_rgba(229,9,20,0.32)] sm:p-6 lg:p-7"
                >
                  <span
                    className="pointer-events-none absolute inset-x-5 top-0 h-px origin-left scale-x-0 bg-brand-red/75 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 sm:inset-x-6 lg:inset-x-7"
                    aria-hidden="true"
                  />
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-[10px] font-mono tabular-nums uppercase tracking-[0.18em] text-brand-red">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="h-px w-6 bg-white/[0.12]" aria-hidden="true" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#8A909D]">
                          {categoryMeta.descriptor}
                        </span>
                      </div>
                      <h3 className="mt-5 text-2xl font-display font-semibold leading-[1.02] tracking-[-0.045em] text-white transition-colors duration-300 group-hover:text-brand-red sm:text-[1.8rem]">
                        {category}
                      </h3>
                    </div>
                    <span className="shrink-0 rounded-full border border-white/[0.07] bg-white/[0.02] px-2.5 py-1 text-[9px] font-mono uppercase tracking-[0.12em] text-[#8A909D]">
                      {String(services.length).padStart(2, '0')} {language === 'id' ? 'layanan' : 'services'}
                    </span>
                  </div>

                  <div className="mt-5 border-t border-white/[0.065] pt-4">
                    <span className="text-[9px] font-mono uppercase tracking-[0.14em] text-[#6F757F]">
                      {language === 'id' ? 'Paling sesuai untuk' : 'Best for'}
                    </span>
                    <p className="mt-2 max-w-md text-xs font-light leading-[1.75] text-[#8A909D] sm:text-sm">
                      {categoryMeta.bestFor}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-white/[0.065] pt-1">
                    {services.map((service) => (
                      <Link
                        key={service.slug}
                        to={`/services/${service.slug}`}
                        data-analytics-event="service_click"
                        data-service-slug={service.slug}
                        className="group/item flex min-h-11 w-full min-w-0 items-center justify-between gap-4 border-b border-white/[0.045] py-2.5 text-left last:border-b-0 sm:min-h-12"
                      >
                        <span className="min-w-0 pr-2 text-xs font-medium leading-snug text-white/80 transition-colors duration-300 group-hover/item:text-brand-red sm:text-[13px]">
                          {service.title}
                        </span>
                        <ArrowUpRight
                          size={14}
                          className="shrink-0 text-[#626872] transition-all duration-300 group-hover/item:-translate-y-0.5 group-hover/item:translate-x-0.5 group-hover/item:text-brand-red"
                          aria-hidden="true"
                        />
                      </Link>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                    <span className="flex min-w-0 items-center gap-3 text-[9px] font-mono uppercase tracking-[0.14em] text-[#6F757F] group-hover:text-brand-red">
                      <span className="h-px w-7 bg-brand-red/55 transition-all duration-500 group-hover:w-11 group-hover:bg-brand-red/80" />
                      <span>{categoryMeta.action}</span>
                    </span>
                    <Link
                      to={services[0] ? `/services/${services[0].slug}` : '/services'}
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02] text-[#7A808A] transition-all duration-300 hover:border-brand-red/35 hover:bg-brand-red/[0.08] hover:text-brand-red"
                      aria-label={categoryMeta.action}
                    >
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10 border-t border-white/[0.065] pt-8 sm:mt-12 sm:pt-10">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-[0.16em] text-brand-red/80">
                  {language === 'id' ? 'JALUR SOLUSI SPESIFIK' : 'FOCUSED SOLUTION PATHS'}
                </span>
                <p className="mt-2 max-w-3xl text-sm font-light leading-[1.75] text-[#8A909D]">
                  {language === 'id'
                    ? 'Saat kebutuhan Anda lebih spesifik, masuk langsung lewat salah satu dari tiga solusi berikut.'
                    : 'When your need is more specific, move directly into one of these three focused solutions.'}
                </p>
              </div>
              <span className="shrink-0 text-[10px] font-mono uppercase tracking-[0.14em] text-[#6F757F]">
                03 {language === 'id' ? 'jalur' : 'paths'}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
              {allSolutionsAndServices
                .filter((item) => item.type === 'solution')
                .map((solution, index) => {
                  const solutionMeta = {
                    'mvp-design': {
                      bestFor: language === 'id'
                        ? 'Founder atau product team yang perlu memvalidasi konsep sebelum engineering.'
                        : 'Founders or product teams that need to validate the concept before engineering.',
                      outcome: language === 'id'
                        ? 'Output: prototype interaktif, user flow yang fokus, dan handoff siap build.'
                        : 'Outcome: interactive prototype, focused user flows, and build-ready handoff.',
                      cta: language === 'id' ? 'Explore MVP Design' : 'Explore MVP Design',
                    },
                    'product-redesign': {
                      bestFor: language === 'id'
                        ? 'Bisnis dengan product experience yang sudah berjalan tetapi mulai terasa lambat, rumit, atau tidak konsisten.'
                        : 'Businesses with an existing product that feels slow, complex, or inconsistent.',
                      outcome: language === 'id'
                        ? 'Outcome: UX lebih jelas, interface lebih konsisten, dan roadmap perbaikan yang terarah.'
                        : 'Outcome: clearer UX, a more consistent interface, and a focused improvement roadmap.',
                      cta: language === 'id' ? 'Explore Product Redesign' : 'Explore Product Redesign',
                    },
                    'team-extension': {
                      bestFor: language === 'id'
                        ? 'Tim internal yang membutuhkan tambahan design atau engineering tanpa menambah struktur tim permanen.'
                        : 'Internal teams that need extra design or engineering capacity without building a permanent team.',
                      outcome: language === 'id'
                        ? 'Outcome: kapasitas delivery tambahan yang masuk ke workflow dan ritme kerja tim Anda.'
                        : 'Outcome: added delivery capacity that fits your workflow and delivery rhythm.',
                      cta: language === 'id' ? 'Explore Team Extension' : 'Explore Team Extension',
                    },
                  }[solution.slug];

                  return (
                    <Link
                      key={solution.slug}
                      to={`/solutions/${solution.slug}`}
                      data-analytics-event="solution_click"
                      data-solution-slug={solution.slug}
                      className="group relative flex min-h-[246px] min-w-0 flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.014] p-5 transition-[background-color,border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-brand-red/20 hover:bg-white/[0.022] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.028),0_18px_40px_-30px_rgba(229,9,20,0.25)] sm:p-6 lg:p-7"
                    >
                      <span
                        className="pointer-events-none absolute inset-x-5 top-0 h-px origin-left scale-x-0 bg-brand-red/75 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 sm:inset-x-6"
                        aria-hidden="true"
                      />
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] font-mono tabular-nums uppercase tracking-[0.18em] text-[#8A909D]">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-red/75">
                          {language === 'id' ? 'Solusi fokus' : 'Focused solution'}
                        </span>
                      </div>

                      <div className="mt-6">
                        <h4 className="text-xl font-display font-semibold leading-tight tracking-[-0.04em] text-white transition-colors duration-300 group-hover:text-brand-red sm:text-[1.55rem]">
                          {solution.title}
                        </h4>
                        <div className="mt-4">
                          <span className="text-[9px] font-mono uppercase tracking-[0.14em] text-[#6F757F]">
                            {language === 'id' ? 'Cocok untuk' : 'Best for'}
                          </span>
                          <p className="mt-2 text-xs font-light leading-[1.75] text-[#8A909D] sm:text-sm">
                            {solutionMeta?.bestFor}
                          </p>
                        </div>
                        <p className="mt-3 text-[11px] font-medium leading-[1.65] text-white/75">
                          {solutionMeta?.outcome}
                        </p>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                        <span className="text-[9px] font-mono uppercase tracking-[0.14em] text-[#6F757F] transition-colors duration-300 group-hover:text-brand-red">
                          {solutionMeta?.cta}
                        </span>
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02] text-[#7A808A] transition-all duration-300 group-hover:border-brand-red/35 group-hover:bg-brand-red/[0.08] group-hover:text-brand-red">
                          <ArrowUpRight size={14} aria-hidden="true" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-white/[0.065] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl text-[11px] font-light leading-[1.7] text-[#6F757F]">
                {language === 'id'
                  ? 'Belum yakin jalur mana yang paling tepat? Ceritakan konteks proyek Anda dan kami bantu menentukan starting point yang paling masuk akal.'
                  : 'Not sure which path fits? Share your project context and we will help you choose the most sensible starting point.'}
              </p>
              <Link
                to="/contact"
                className="inline-flex shrink-0 items-center gap-2 text-[10px] font-mono font-semibold uppercase tracking-[0.14em] text-[#A7ACB5] transition-colors duration-300 hover:text-white"
              >
                <span>{language === 'id' ? 'Mulai diskusi' : 'Start a discussion'}</span>
                <ArrowUpRight size={13} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CASE STUDIES */}
      <section className="relative z-10 overflow-hidden border-b border-[#262930] bg-[#0B0C0E] px-4 py-16 sm:px-6 sm:py-20 md:px-12 md:py-28" id="work">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 grid gap-7 sm:mb-12 lg:mb-14 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
            <div className="max-w-3xl">
              <span className="kapi-section-label mb-5">
                {language === 'id' ? 'Studi Kasus Unggulan' : 'Featured Case Studies'}
              </span>
              <h2 className="mt-4 text-3xl font-display font-semibold leading-[1.02] tracking-[-0.055em] text-white sm:text-4xl md:text-5xl lg:text-[4rem]">
                {language === 'id' ? 'Pekerjaan yang menunjukkan bagaimana kami berpikir dan membangun.' : 'Work that shows how we think and build.'}
              </h2>
              <p className="mt-5 max-w-2xl text-sm font-light leading-[1.8] text-[#8A909D] sm:text-base">
                {language === 'id'
                  ? 'Pilihan case study dari pekerjaan visual, product, dan digital engineering yang kami bangun bersama klien.'
                  : 'A selection of visual, product, and digital engineering work built in close partnership with our clients.'}
              </p>
            </div>

            <Link
              to="/work"
              className="group inline-flex min-h-[44px] items-center justify-center gap-2 self-start rounded-full border border-white/[0.1] bg-white/[0.025] px-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand-red/35 hover:bg-brand-red/[0.08] lg:self-end"
            >
              <span>{language === 'id' ? 'Lihat Semua Case Studies' : 'View All Case Studies'}</span>
              <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr] lg:grid-rows-2 lg:gap-5">
            {featuredProjects.map((project, index) => {
              const isLead = index === 0;
              const impact = project.impact?.[0];

              return (
                <Link
                  key={project.id}
                  to={`/work?project=${encodeURIComponent(project.id)}`}
                  aria-label={language === 'id' ? `Buka studi kasus ${project.title}` : `Open case study ${project.title}`}
                  data-analytics-event="featured_case_click"
                  data-case-id={project.id}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border border-white/[0.075] bg-[#101114] transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-brand-red/25",
                    isLead ? "lg:row-span-2" : "min-h-[260px] lg:min-h-0"
                  )}
                >
                  <div className={cn(
                    "relative overflow-hidden",
                    isLead ? "aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto" : "aspect-[16/8] sm:aspect-[16/7] lg:aspect-[16/9]"
                  )}>
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      onError={handleCaseStudyImageError}
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090A0C] via-[#090A0C]/25 to-transparent" />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent" />

                    <div className="absolute left-4 top-4 flex items-center gap-2 sm:left-5 sm:top-5">
                      <span className="rounded-full border border-white/[0.12] bg-[#090A0C]/70 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.12em] text-white backdrop-blur-md">
                        {project.service}
                      </span>
                      {impact && (
                        <span className="hidden rounded-full border border-brand-red/25 bg-[#090A0C]/70 px-2.5 py-1 text-[10px] font-mono text-brand-red backdrop-blur-md sm:inline-flex">
                          {impact.value} {impact.label}
                        </span>
                      )}
                    </div>

                    <span className="absolute right-4 top-4 text-[10px] font-mono tabular-nums text-white/65 sm:right-5 sm:top-5">
                      {project.year}
                    </span>
                  </div>

                  <div className={cn(
                    "relative z-10 flex flex-col",
                    isLead ? "p-5 sm:p-7 lg:absolute lg:inset-x-0 lg:bottom-0 lg:p-8" : "p-5 sm:p-6"
                  )}>
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.12em] text-[#A7ACB5]">
                      <span>{project.client}</span>
                      <span className="h-px w-4 bg-white/[0.18]" aria-hidden="true" />
                      <span>{project.industry}</span>
                    </div>

                    <h3 className={cn(
                      "mt-3 font-display font-semibold leading-[1.02] tracking-[-0.045em] text-white transition-colors duration-300 group-hover:text-brand-red",
                      isLead ? "max-w-3xl text-2xl sm:text-3xl md:text-4xl" : "text-xl sm:text-[1.45rem]"
                    )}>
                      {project.title}
                    </h3>

                    <p className={cn(
                      "mt-3 max-w-2xl font-light leading-[1.7] text-[#A0A5AE]",
                      isLead ? "text-xs sm:text-sm" : "text-xs"
                    )}>
                      {language === 'id' ? project.descId : project.desc}
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/[0.08] pt-4">
                      <div className="flex min-w-0 flex-wrap gap-1.5">
                        {project.technologies.slice(0, isLead ? 3 : 2).map((technology) => (
                          <span
                            key={technology}
                            className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-[9px] font-mono text-[#8A909D] transition-colors duration-300 group-hover:border-white/[0.13] group-hover:text-white"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-[0.1em] text-white transition-colors duration-300 group-hover:text-brand-red">
                        {language === 'id' ? 'Buka Kasus' : 'Inspect Case'}
                        <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.014] px-6 py-12 text-center sm:px-10">
              <p className="text-xs font-mono uppercase tracking-[0.14em] text-white/40">
                {language === 'id' ? 'Case study dikelola melalui AMS' : 'Case studies are managed through AMS'}
              </p>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#8A909D]">
                {language === 'id'
                  ? 'Case study akan tampil otomatis setelah dipublikasikan melalui CMS.'
                  : 'Case studies appear automatically once they are published through the CMS.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* WORKING PROCESS STEPPING */}
      <section className="relative overflow-hidden py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-12 bg-[#0B0C0E] border-b border-[#262930]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <motion.div
            className="absolute -right-32 top-16 h-72 w-72 rounded-full border border-brand-red/[0.045]"
            animate={{ rotate: [0, 360], scale: [1, 1.04, 1] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute left-[28%] -bottom-48 h-80 w-80 rounded-full border border-white/[0.025]"
            animate={{ y: [0, -18, 0], opacity: [0.25, 0.5, 0.25] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.018] p-5 sm:p-7 lg:p-9 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-14 mb-12 sm:mb-14">
            <div className="max-w-4xl">
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-12% 0px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="kapi-section-label mb-5"
              >
                {language === 'id' ? 'ALUR KERJA STUDIO' : 'OUR WORKING FRAMEWORK'}
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-12% 0px' }}
                transition={{ duration: 0.75, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 max-w-4xl text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] font-display font-semibold tracking-[-0.06em] leading-[1.01] text-white"
              >
                {language === 'id' ? 'Dari brief pertama hingga produk diluncurkan.' : 'From first brief to final launch.'}
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-12% 0px' }}
              transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-md lg:pb-1 text-xs sm:text-sm lg:text-base leading-[1.75] text-[#8A909D] font-light"
            >
              {language === 'id'
                ? 'Empat fase yang saling terhubung menjaga kualitas, momentum, dan keputusan proyek tetap berada di jalur.'
                : 'Four connected phases keep quality, momentum, and project decisions moving in the same direction.'}
            </motion.p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {processSteps.map((step, index) => {
                const isActive = activeProcessStep === index;
                return (
                  <motion.article
                    key={step.step}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10% 0px' }}
                    transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    onMouseEnter={() => setActiveProcessStep(index)}
                    className={cn(
                      "group relative min-w-0 transition-opacity duration-500 ease-out",
                      isActive
                        ? "opacity-100"
                        : "opacity-[0.68] group-hover:opacity-100",
                      "min-w-0"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => openProcessStep(index)}
                      onFocus={() => setActiveProcessStep(index)}
                      data-analytics-event="process_phase_open"
                      data-process-step={step.step}
                      aria-label={(language === 'id' ? 'Pilih fase ' : 'Select phase ') + step.step}
                      aria-pressed={isActive}
                      data-analytics-event="process_phase_open"
                      data-process-step={step.step}
                      className="relative z-10 block w-full cursor-pointer text-left outline-none"
                    >
                      <span
                        className={cn(
                          "absolute z-20 left-0 top-[11px] h-2.5 w-2.5 rounded-full border transition-all duration-500 lg:hidden",
                          isActive
                            ? "border-brand-red bg-brand-red shadow-[0_0_0_5px_rgba(229,9,20,0.08),0_0_20px_rgba(229,9,20,0.45)]"
                            : "border-white/[0.18] bg-[#0B0C0E] group-hover:border-brand-red/70 group-hover:shadow-[0_0_0_4px_rgba(229,9,20,0.05)]"
                        )}
                      />

                      <div className="relative min-h-[270px] rounded-2xl border border-white/[0.07] bg-white/[0.014] p-5 sm:p-6 lg:p-7 transition-[background-color,border-color,box-shadow] duration-300 hover:border-brand-red/20 hover:bg-white/[0.022]">
                        <div
                          className="flex items-center justify-between gap-4 border-b border-white/[0.07] pb-3 transition-colors duration-500 lg:pr-1"
                        >
                          <span className={cn(
                            "text-[10px] font-mono uppercase tracking-[0.18em] transition-colors duration-300",
                            isActive ? "text-brand-red" : "text-[#8A909D]"
                          )}>
                            {language === 'id' ? `Fase ${step.step}` : `Phase ${step.step}`}
                          </span>
                          <motion.span
                            animate={{ opacity: isActive ? 1 : 0.45, x: isActive ? 0 : 4 }}
                            transition={{ duration: 0.35 }}
                            className="text-[10px] font-mono tabular-nums text-[#8A909D]"
                          >
                            {step.step}
                          </motion.span>
                        </div>

                        <motion.h3
                          animate={{ x: isActive ? 4 : 0, color: isActive ? '#FF1E27' : '#FFFFFF' }}
                          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                          className="mt-5 max-w-[18rem] text-xl sm:text-2xl lg:text-[1.65rem] font-display font-semibold tracking-[-0.045em] leading-[1.06]"
                        >
                          {step.title}
                        </motion.h3>

                        <motion.p
                          animate={{ opacity: isActive ? 1 : 0.68, y: isActive ? 0 : 2 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="mt-3 max-w-sm text-xs sm:text-sm leading-[1.75] text-[#8A909D] font-light"
                        >
                          {step.desc}
                        </motion.p>

                        <div className="relative mt-6 h-1 w-10 overflow-hidden rounded-full bg-white/[0.06]">
                          <motion.div
                            className="absolute inset-y-0 left-0 rounded-full bg-brand-red"
                            animate={{ width: isActive ? '100%' : '45%', opacity: isActive ? 1 : 0.45 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </div>
                      </div>
                    </button>
                  </motion.article>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="mt-4 lg:mt-5 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.01] px-4 py-3 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.16em] text-[#8A909D]"
            >
              <span>{language === 'id' ? 'Arahkan kursor untuk preview, pilih phase untuk membuka detail' : 'Hover to preview, select a phase for details'}</span>
              <span className="text-brand-red/85 tabular-nums">
                {String(activeProcessStep + 1).padStart(2, '0')} / {String(processSteps.length).padStart(2, '0')}
              </span>
            </motion.div>
          </div>
          </div>
        </div>
      </section>

      <ProcessModalPortal>
        <AnimatePresence>
          {selectedProcessStep !== null && (() => {
            const step = processSteps[selectedProcessStep];
            const isFirst = selectedProcessStep === 0;
            const isLast = selectedProcessStep === processSteps.length - 1;

            return (
              <div
                className="fixed inset-0 z-[120] flex items-center justify-center bg-[#050609]/42 p-4 backdrop-blur-md backdrop-saturate-75 sm:p-4 lg:p-6"
                role="presentation"
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) setSelectedProcessStep(null);
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  ref={processModalRef}
                  className="kapi-process-modal relative flex h-[calc(100dvh-2rem)] lg:h-[calc(100dvh-3rem)] w-full max-w-[1400px] max-h-[900px] min-h-0 flex-col overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#0F1116] shadow-[0_32px_110px_-40px_rgba(0,0,0,0.96)] will-change-[opacity,transform]"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="process-phase-modal-title"
                  aria-describedby="process-phase-modal-description"
                >
                  <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.08] bg-[#0F1116] px-4 py-4 sm:px-6 sm:py-5 lg:px-7">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-brand-red/30 bg-brand-red/10 px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-[0.1em] text-brand-red">
                          Framework Phase
                        </span>
                        <span className="truncate text-[10px] sm:text-[11px] font-mono text-[#8A909D]">
                          {language === 'id' ? 'Fase ' + step.step : 'Phase ' + step.step}
                        </span>
                        <span className="text-white/15" aria-hidden="true">•</span>
                        <span className="tabular-nums text-[10px] sm:text-[11px] font-mono text-[#8A909D]">
                          {String(selectedProcessStep + 1).padStart(2, '0')} / {String(processSteps.length).padStart(2, '0')}
                        </span>
                      </div>
                      <h3 id="process-phase-modal-title" className="truncate text-sm sm:text-base lg:text-lg font-display font-semibold text-white">
                        {step.title}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedProcessStep(null)}
                      className="flex h-11 min-h-[44px] min-w-[44px] w-11 shrink-0 items-center justify-center rounded-full border border-white/[0.09] bg-white/[0.025] text-[#8A909D] transition-[background-color,border-color,color] duration-300 hover:border-white/[0.16] hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
                      aria-label={language === 'id' ? 'Tutup detail fase' : 'Close phase details'}
                      data-cursor-label="Close"
                      autoFocus
                    >
                      <X size={18} />
                    </button>
                  </header>

                  <div className="kapi-process-modal-body grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                    <aside className="kapi-process-modal-overview min-h-0 overflow-y-auto border-b border-white/[0.08] bg-[#0B0C0E] lg:border-b-0 lg:border-r">
                      <div className="p-4 sm:p-5 lg:p-6">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-brand-red">Phase Overview</span>
                            <p className="mt-1 text-xs text-[#8A909D]">
                              {language === 'id' ? 'Tujuan dan checkpoint fase ini.' : 'Objective and checkpoint for this phase.'}
                            </p>
                          </div>
                          <span className="tabular-nums text-[10px] font-mono text-[#6F7480]">{step.step}</span>
                        </div>

                        <div className="overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#111318] p-5 sm:p-6 lg:p-7">
                          <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-brand-red">Phase Objective</span>
                          <p id="process-phase-modal-description" className="mt-4 text-sm leading-[1.85] text-[#C2C7D1] font-light sm:text-base">
                            {step.objective}
                          </p>
                        </div>

                        <div className="mt-4 rounded-[22px] border border-white/[0.08] bg-white/[0.018] p-4 sm:p-5">
                          <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#6F7480]">Checkpoint</span>
                          <p className="mt-3 border-l-2 border-brand-red/55 pl-4 text-sm leading-[1.75] text-white">
                            {step.checkpoint}
                          </p>
                        </div>

                        <div className="mt-4 rounded-[22px] border border-white/[0.08] bg-white/[0.018] p-4 sm:p-5">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#6F7480]">Workflow position</span>
                            <span className="text-[9px] font-mono tabular-nums text-[#6F7480]">
                              {String(selectedProcessStep + 1).padStart(2, '0')} / {String(processSteps.length).padStart(2, '0')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {processSteps.map((phase, index) => (
                              <button
                                key={phase.step}
                                type="button"
                                onClick={() => openProcessStep(index)}
                                className="relative flex min-h-[24px] flex-1 items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
                                aria-label={(language === 'id' ? 'Buka fase ' : 'Open phase ') + phase.step}
                                aria-pressed={index === selectedProcessStep}
                              >
                                <span
                                  className={cn(
                                    "block h-1.5 w-full rounded-full transition-colors duration-300",
                                    index === selectedProcessStep ? "bg-brand-red" : "bg-white/[0.08] hover:bg-white/[0.16]"
                                  )}
                                  aria-hidden="true"
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </aside>

                    <section className="kapi-process-modal-detail min-h-0 overflow-y-auto overscroll-contain px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8" aria-label={language === 'id' ? 'Detail fase' : 'Phase details'}>
                      <div className="mx-auto max-w-3xl space-y-8 sm:space-y-10">
                        <section>
                          <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-brand-red">
                            {language === 'id' ? 'Ringkasan Fase' : 'Phase Overview'}
                          </span>
                          <h2 className="mt-2 max-w-2xl text-2xl sm:text-3xl lg:text-[2.65rem] font-display font-bold leading-[1.08] tracking-[-0.035em] text-white">
                            {step.title}
                          </h2>
                          <p className="mt-4 text-sm sm:text-[0.98rem] leading-[1.85] text-[#C2C7D1] font-light">
                            {step.desc}
                          </p>
                        </section>

                        <section className="rounded-[22px] border border-white/[0.08] bg-white/[0.018] p-5 sm:p-6">
                          <div className="mb-4 flex items-start gap-3">
                            <span className="tabular-nums text-[10px] font-mono font-semibold text-brand-red">01</span>
                            <div>
                              <h3 className="text-xl sm:text-2xl font-display font-semibold tracking-[-0.02em] text-white">
                                {language === 'id' ? 'Aktivitas Utama' : 'Key Activities'}
                              </h3>
                              <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.1em] text-[#6F7480]">
                                {language === 'id' ? 'Yang dikerjakan pada fase ini' : 'What happens in this phase'}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {step.activities.map((activity, index) => (
                              <div key={activity} className="flex gap-3 rounded-xl border border-white/[0.06] bg-black/10 px-4 py-3.5 text-xs leading-[1.6] text-[#D0D4DB]">
                                <span className="shrink-0 text-[9px] font-mono tabular-nums text-brand-red/80">{String(index + 1).padStart(2, '0')}</span>
                                <span>{activity}</span>
                              </div>
                            ))}
                          </div>
                        </section>

                        <section className="rounded-[22px] border border-brand-red/20 bg-brand-red/[0.035] p-5 sm:p-6">
                          <div className="mb-4 flex items-start gap-3">
                            <span className="tabular-nums text-[10px] font-mono font-semibold text-brand-red">02</span>
                            <div>
                              <h3 className="text-xl sm:text-2xl font-display font-semibold tracking-[-0.02em] text-white">
                                {language === 'id' ? 'Output & Deliverables' : 'Outputs & Deliverables'}
                              </h3>
                              <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.1em] text-[#6F7480]">
                                {language === 'id' ? 'Yang dibawa ke tahap berikutnya' : 'What moves forward'}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {step.deliverables.map((deliverable) => (
                              <span key={deliverable} className="rounded-full border border-white/[0.08] bg-white/[0.018] px-3 py-1.5 text-[10px] sm:text-xs font-mono text-[#A9AFBB]">
                                {deliverable}
                              </span>
                            ))}
                          </div>
                        </section>
                      </div>
                    </section>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-white/[0.08] bg-[#0D0E11] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-7">
                    <button
                      type="button"
                      onClick={() => openProcessStep(selectedProcessStep - 1)}
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.02] px-5 text-[10px] font-mono font-semibold uppercase tracking-[0.1em] text-[#D0D4DB] transition-[background-color,border-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-35 sm:min-w-[160px]"
                      disabled={isFirst}
                    >
                      <ChevronRight size={14} className="rotate-180" />
                      <span>{language === 'id' ? 'Phase Sebelumnya' : 'Previous Phase'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedProcessStep(null)}
                      className="inline-flex min-h-[44px] items-center justify-center rounded-full px-5 text-[10px] font-mono font-semibold uppercase tracking-[0.1em] text-[#8A909D] transition-colors duration-300 hover:text-white"
                    >
                      {language === 'id' ? 'Tutup' : 'Close'}
                    </button>

                    <button
                      type="button"
                      onClick={() => openProcessStep(selectedProcessStep + 1)}
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-brand-red px-5 text-[10px] font-mono font-semibold uppercase tracking-[0.1em] text-white transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#FF1E27] disabled:cursor-not-allowed disabled:opacity-35 sm:min-w-[160px]"
                      disabled={isLast}
                    >
                      <span>{language === 'id' ? 'Phase Berikutnya' : 'Next Phase'}</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </motion.div>
              </div>
            );
          })()}
        </AnimatePresence>
      </ProcessModalPortal>
      {/* Testimonials */}
      <Testimonials />
    </div>
  );
};
