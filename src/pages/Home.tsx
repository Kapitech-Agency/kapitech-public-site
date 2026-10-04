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
import { fetchServerCmsProjects, getCmsProjects } from '../lib/cmsStore';
import { cn } from '../lib/utils';

const ProcessModalPortal = ({ children }: { children: React.ReactNode }) => {
  if (typeof document === 'undefined') return null;
  return createPortal(children, document.body);
};

export const Home = () => {
  const { t, language } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [projectsList, setProjectsList] = useState(() => getCmsProjects());
  const [activeProcessStep, setActiveProcessStep] = useState(0);
  const [selectedProcessStep, setSelectedProcessStep] = useState<number | null>(null);
  const processModalRef = React.useRef<HTMLDivElement>(null);
  const processModalTriggerRef = React.useRef<HTMLElement | null>(null);

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

  const openProcessStep = (index: number) => {
    processModalTriggerRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
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
            ? (current - 1 + processSteps.length) % processSteps.length
            : (current + 1) % processSteps.length;
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

  const trustedBrands = [
    {
      name: "Astra International",
      src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/ASTRA_international.svg"
    },
    {
      name: "MRT Jakarta",
      src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/MRT_Jakarta_logo.svg"
    },
    {
      name: "Telkom Indonesia",
      src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Telkom_Indonesia_(2002).svg"
    },
    {
      name: "Kopi Kenangan",
      src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Kopi_Kenangan.svg"
    },
    {
      name: "Siloam Hospitals",
      src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Siloam_Hospitals.svg"
    },
    {
      name: "BTN",
      src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/BTN_2024.svg"
    }
  ];

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

  // Redesigned Simple, High-Contrast Stats
  const stats = [
    {
      index: "01",
      label: language === 'id' ? "Pengalaman" : "Years in Industry",
      value: "3+",
      meta: language === 'id' ? "Sejak 2021" : "Est. 2021",
      desc: language === 'id' ? "Membangun produk digital untuk bisnis visioner." : "Building digital products for ambitious businesses."
    },
    {
      index: "02",
      label: language === 'id' ? "Portofolio" : "Completed Projects",
      value: "50+",
      meta: language === 'id' ? "Case studies" : "Case studies",
      desc: language === 'id' ? "Ratusan milestone desain, development, dan delivery." : "Design, development, and delivery across sectors."
    },
    {
      index: "03",
      label: language === 'id' ? "Fokus Klien" : "Client Focus",
      value: "SME",
      suffix: " + Enterprise",
      meta: language === 'id' ? "Kemitraan jangka panjang" : "Long-term partnerships",
      desc: language === 'id' ? "Menangani kebutuhan dari tim lean hingga organisasi besar." : "From lean teams to complex enterprise needs."
    },
    {
      index: "04",
      label: language === 'id' ? "Cara Kerja" : "Service Approach",
      value: "E2E",
      meta: language === 'id' ? "End-to-End • Strategy • Design • Code" : "End-to-End • Strategy • Design • Code",
      desc: language === 'id' ? "Satu tim dari arah awal hingga produk berjalan." : "One team from direction to delivery."
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
    <div className="bg-[#0B0C0E] text-white min-h-screen selection:bg-brand-red selection:text-white" role="main">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-center px-4 sm:px-6 md:px-12 pt-24 sm:pt-28 md:pt-32 pb-24 sm:pb-28 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <PatternWaves
            preset="silk"
            color="#dc143c"
            backgroundColor="#170f0f"
            opacity={0.58}
            fade="edges"
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
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0B0C0E] to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="max-w-4xl lg:max-w-5xl">
            {/* Status Chip */}
            <div className="kapi-section-label mb-6 sm:mb-8">
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
                className="h-12 sm:h-13 px-7 sm:px-8 rounded-full border border-brand-red/45 bg-brand-red/72 backdrop-blur-xl backdrop-saturate-150 text-white text-xs font-semibold uppercase tracking-wider transition-[background-color,border-color,box-shadow] duration-300 ease-out flex items-center justify-center gap-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_10px_28px_rgba(230,57,70,0.16)] hover:bg-brand-red/86 hover:border-brand-red/65 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_14px_34px_rgba(230,57,70,0.22)]"
              >
                <span>{language === 'id' ? 'Mulai Proyek' : 'Start a Project'}</span>
                <ArrowUpRight size={16} />
              </Link>
              <Link 
                to="/work" 
                className="h-12 sm:h-13 px-7 sm:px-8 rounded-full border border-white/[0.1] bg-[#0B0C0E]/42 backdrop-blur-xl backdrop-saturate-150 text-white transition-[background-color,border-color,box-shadow] duration-300 ease-out text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_10px_28px_rgba(0,0,0,0.14)] hover:bg-[#0B0C0E]/54 hover:border-white/[0.16] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_14px_34px_rgba(0,0,0,0.18)]"
              >
                <span>{language === 'id' ? 'Jelajahi 50 Portofolio' : 'Explore 50 Case Studies'}</span>
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
                {language === 'id' ? 'SEKILAS KAPITECH' : 'A FEW NUMBERS'}
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
      {/* CLIENTS & PARTNERS SECTION - LOOPING CAROUSEL WITH SIDE SHADOWS */}
      <section className="py-14 sm:py-20 bg-[#0B0C0E] border-b border-[#262930] overflow-hidden relative" id="clients">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 mb-10 sm:mb-12 text-center">
          <span className="kapi-section-label mb-5">
            {language === 'id' ? 'DIPERCAYA BISNIS DI INDONESIA' : 'Trusted by Businesses in Indonesia'}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-display font-semibold tracking-[-0.045em] leading-[1.08] text-white">
            {language === 'id'
              ? 'Brand Indonesia yang mempercayakan produk digitalnya kepada Kapitech'
              : 'Indonesian brands that have trusted Kapitech with their digital products'}
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed text-[#8A909D] font-light">
            {language === 'id'
              ? 'Dipilih untuk pekerjaan yang menuntut ketelitian visual, kualitas teknis, dan delivery yang konsisten.'
              : 'Chosen for work that demands visual precision, technical quality, and consistent delivery.'}
          </p>
        </div>

        {/* Looping Marquee Track with Left & Right Gradient Shadows */}
        <div className="relative w-full overflow-hidden py-4">
          
          {/* Left Gradient Shadow */}
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#0B0C0E] via-[#0B0C0E]/90 to-transparent z-20 pointer-events-none" />
          
          {/* Right Gradient Shadow */}
          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#0B0C0E] via-[#0B0C0E]/90 to-transparent z-20 pointer-events-none" />

          {/* Marquee Motion Container */}
          <div className="flex w-max">
            <motion.div
              className="flex items-center gap-4 sm:gap-5 lg:gap-6 shrink-0 pr-4 sm:pr-5 lg:pr-6"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                duration: 28,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              {[...trustedBrands, ...trustedBrands].map((logo, idx) => (
                <div
                  key={`${logo.name}-${idx}`}
                  className="flex w-[196px] sm:w-[224px] lg:w-[248px] h-20 sm:h-24 lg:h-28 items-center justify-center shrink-0"
                  aria-label={logo.name}
                >
                  <div className="flex h-10 sm:h-12 lg:h-14 w-[154px] sm:w-[176px] lg:w-[198px] items-center justify-center">
                    <img
                      src={logo.src}
                      alt={logo.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="block max-h-full max-w-full w-auto h-auto object-contain object-center bg-transparent opacity-80 brightness-0 invert hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* SOLUTIONS & CORE CAPABILITIES */}
      <section className="relative z-10 overflow-hidden border-b border-[#262930] bg-[#0B0C0E] px-4 py-16 sm:px-6 sm:py-20 md:px-12 md:py-28" id="services">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 grid gap-8 lg:mb-14 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
            <div className="max-w-3xl">
              <span className="kapi-section-label mb-5">
                {language === 'id' ? 'Layanan & Solusi Lengkap' : 'Solutions & Core Capabilities'}
              </span>
              <h2 className="mt-4 text-3xl font-display font-semibold leading-[1.02] tracking-[-0.055em] text-white sm:text-4xl md:text-5xl lg:text-[4rem]">
                {language === 'id' ? 'Satu studio untuk brand, experience, dan engineering.' : 'One studio for brand, experience, and engineering.'}
              </h2>
              <p className="mt-5 max-w-2xl text-sm font-light leading-[1.8] text-[#8A909D] sm:text-base">
                {language === 'id'
                  ? 'Kami menyatukan strategi kreatif, desain produk, dan engineering untuk membantu tim bergerak dari ide hingga delivery dengan lebih sedikit handoff.'
                  : 'We bring creative strategy, product design, and engineering together so teams can move from idea to delivery with fewer handoffs.'}
              </p>
            </div>

            <Link
              to="/services"
              className="group inline-flex min-h-[44px] items-center justify-center gap-2 self-start rounded-full border border-white/[0.1] bg-white/[0.025] px-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand-red/35 hover:bg-brand-red/[0.08] lg:self-end"
            >
              <span>{language === 'id' ? 'Jelajahi Semua Layanan' : 'Explore All Services'}</span>
              <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
            {[
              {
                number: '01',
                eyebrow: language === 'id' ? 'Identity' : 'Identity',
                title: 'Brand Systems',
                desc: language === 'id'
                  ? 'Positioning visual, identitas, dan sistem brand yang konsisten di setiap touchpoint.'
                  : 'Positioning, identity, and scalable brand systems built for consistency across every touchpoint.',
                icon: Sparkles,
                services: ['Brand Identity', 'Logo Design', 'Pitch Deck', 'Rebranding'],
                href: '/services/brand-identity'
              },
              {
                number: '02',
                eyebrow: language === 'id' ? 'Experience' : 'Experience',
                title: 'Product Experience',
                desc: language === 'id'
                  ? 'UI/UX, website, dan product design yang membuat produk lebih jelas, mudah digunakan, dan siap berkembang.'
                  : 'UI/UX, websites, and product design that make digital experiences clearer, easier to use, and ready to grow.',
                icon: Layers,
                services: ['UI/UX Design', 'Website Design', 'Website Redesign', 'UX/UI Audit'],
                href: '/services/ui-ux-design'
              },
              {
                number: '03',
                eyebrow: language === 'id' ? 'Engineering' : 'Engineering',
                title: 'Digital Engineering',
                desc: language === 'id'
                  ? 'Build web modern yang cepat, scalable, dan terhubung dengan kebutuhan bisnis nyata.'
                  : 'Modern web builds that are fast, scalable, and connected to real business requirements.',
                icon: Code2,
                services: ['Web Development', 'MVP Development', 'Corporate Websites', 'Landing Pages'],
                href: '/services/web-development'
              }
            ].map((capability, index) => {
              const Icon = capability.icon;
              return (
                <motion.article
                  key={capability.number}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  transition={{ duration: 0.7, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative flex min-h-[390px] flex-col overflow-hidden rounded-2xl border border-white/[0.075] bg-white/[0.015] p-6 transition-[background-color,border-color,transform] duration-300 hover:-translate-y-1 hover:border-brand-red/25 hover:bg-white/[0.024] sm:p-7 lg:p-8"
                >
                  <div className="pointer-events-none absolute inset-x-8 top-0 h-px origin-left scale-x-0 bg-brand-red/70 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />

                  <div className="flex items-start justify-between gap-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-[#0F1013] text-[#D9DCE2] transition-colors duration-300 group-hover:border-brand-red/30 group-hover:bg-brand-red/[0.08] group-hover:text-brand-red">
                      <Icon size={19} strokeWidth={1.8} />
                    </div>
                    <span className="text-[10px] font-mono tabular-nums uppercase tracking-[0.18em] text-[#8A909D]/65 transition-colors duration-300 group-hover:text-brand-red/85">
                      {capability.number}
                    </span>
                  </div>

                  <div className="mt-10">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-brand-red/90">
                      {capability.eyebrow}
                    </span>
                    <h3 className="mt-3 text-[1.7rem] font-display font-semibold leading-[1] tracking-[-0.05em] text-white sm:text-[1.9rem]">
                      {capability.title}
                    </h3>
                    <p className="mt-4 max-w-md text-sm font-light leading-[1.75] text-[#8A909D]">
                      {capability.desc}
                    </p>
                  </div>

                  <div className="mt-auto pt-8">
                    <div className="flex flex-wrap gap-2">
                      {capability.services.map((service) => (
                        <span
                          key={service}
                          className="rounded-full border border-white/[0.08] bg-white/[0.018] px-3 py-1.5 text-[10px] font-mono text-[#A7ACB5] transition-colors duration-300 group-hover:border-white/[0.12] group-hover:text-white"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={capability.href}
                      className="mt-7 inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:text-brand-red"
                    >
                      <span>{language === 'id' ? 'Lihat Capability' : 'View Capability'}</span>
                      <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0F1013]">
            <div className="grid lg:grid-cols-[0.82fr_2.18fr]">
              <div className="relative overflow-hidden border-b border-white/[0.07] p-6 sm:p-7 lg:border-b-0 lg:border-r lg:p-8">
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full border border-brand-red/[0.06]" aria-hidden="true" />
                <div className="pointer-events-none absolute -right-4 top-2 h-24 w-24 rounded-full border border-white/[0.025]" aria-hidden="true" />
                <div className="relative">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-brand-red">
                    {language === 'id' ? 'Cara Kami Bekerja' : 'Engagement Options'}
                  </span>
                  <h3 className="mt-4 max-w-sm text-2xl font-display font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-[2rem]">
                    {language === 'id' ? 'Pilih bentuk engagement yang paling pas.' : 'Choose the engagement that fits.'}
                  </h3>
                  <p className="mt-4 max-w-sm text-xs leading-[1.75] text-[#8A909D] sm:text-sm">
                    {language === 'id'
                      ? 'Mulai dari kebutuhan yang paling dekat dengan fase bisnis Anda, lalu masuk lebih dalam saat dibutuhkan.'
                      : 'Start with the need closest to your current business stage, then expand the engagement as the work grows.'}
                  </p>
                </div>
              </div>

              <div className="grid divide-y divide-white/[0.07] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {[
                  {
                    slug: 'mvp-design',
                    number: '01',
                    title: 'MVP Design',
                    fit: language === 'id' ? 'Untuk ide & produk baru' : 'Best for new products',
                    desc: language === 'id' ? 'Ubah ide menjadi product direction yang lebih siap dipresentasikan, divalidasi, dan dikembangkan.' : 'Turn an idea into clearer product direction ready for validation, presentation, and build.'
                  },
                  {
                    slug: 'product-redesign',
                    number: '02',
                    title: 'Product Redesign',
                    fit: language === 'id' ? 'Untuk produk yang sudah berjalan' : 'Best for existing products',
                    desc: language === 'id' ? 'Modernisasi experience, perjelas alur, dan tingkatkan kualitas produk tanpa kehilangan logika bisnisnya.' : 'Modernize the experience, clarify the flow, and improve product quality without losing business logic.'
                  },
                  {
                    slug: 'team-extension',
                    number: '03',
                    title: 'Team Extension',
                    fit: language === 'id' ? 'Untuk tim internal yang butuh kapasitas' : 'Best for growing teams',
                    desc: language === 'id' ? 'Tambah kapasitas desain dan engineering dengan tim yang bisa langsung masuk ke workflow Anda.' : 'Add design and engineering capacity with a team that can plug directly into your workflow.'
                  }
                ].map((solution) => (
                  <Link
                    key={solution.slug}
                    to={'/solutions/' + solution.slug}
                    className="group relative flex min-h-[270px] flex-col p-5 transition-[background-color] duration-300 hover:bg-white/[0.022] sm:p-6 lg:p-7"
                  >
                    <span className="absolute inset-x-5 top-0 h-px origin-left scale-x-0 bg-brand-red transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 sm:inset-x-6 lg:inset-x-7" aria-hidden="true" />

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] font-mono tabular-nums uppercase tracking-[0.18em] text-[#8A909D]/65 transition-colors duration-300 group-hover:text-brand-red">
                        {solution.number}
                      </span>
                      <ArrowUpRight size={15} className="shrink-0 text-[#6F757F] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-red" />
                    </div>

                    <div className="mt-10">
                      <h4 className="text-xl font-display font-semibold leading-none tracking-[-0.04em] text-white transition-colors duration-300 group-hover:text-brand-red sm:text-[1.45rem]">
                        {solution.title}
                      </h4>
                      <span className="mt-3 inline-flex text-[10px] font-mono uppercase tracking-[0.12em] text-[#A7ACB5]">
                        {solution.fit}
                      </span>
                      <p className="mt-4 text-xs leading-[1.75] text-[#8A909D] sm:text-[13px]">
                        {solution.desc}
                      </p>
                    </div>

                    <span className="mt-auto pt-7 text-[10px] font-mono font-semibold uppercase tracking-[0.1em] text-white transition-colors duration-300 group-hover:text-brand-red">
                      {language === 'id' ? 'Jelajahi Solusi' : 'Explore Solution'}
                    </span>
                  </Link>
                ))}
              </div>
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

          <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr] lg:grid-rows-2 lg:gap-5">
            {featuredProjects.map((project, index) => {
              const isLead = index === 0;
              const impact = project.impact?.[0];

              return (
                <Link
                  key={project.id}
                  to="/work"
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
                      aria-label={(language === 'id' ? 'Pilih fase ' : 'Select phase ') + step.step}
                      aria-pressed={isActive}
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
              <span>{language === 'id' ? 'Hover untuk preview, klik phase untuk membuka detail' : 'Hover to preview, click a phase for details'}</span>
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
                                className={cn(
                                  "h-1.5 flex-1 rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60",
                                  index === selectedProcessStep ? "bg-brand-red" : "bg-white/[0.08] hover:bg-white/[0.16]"
                                )}
                                aria-label={(language === 'id' ? 'Buka fase ' : 'Open phase ') + phase.step}
                              />
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
                      onClick={() => openProcessStep((selectedProcessStep - 1 + processSteps.length) % processSteps.length)}
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
                      onClick={() => openProcessStep((selectedProcessStep + 1) % processSteps.length)}
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-brand-red px-5 text-[10px] font-mono font-semibold uppercase tracking-[0.1em] text-white transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#FF1E27] sm:min-w-[160px]"
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
