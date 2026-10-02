import React, { useEffect, useState } from 'react';
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
import { AtmosphericBackground } from '../components/ui/AtmosphericBackground';
import PatternWaves from '../components/ui/PatternWaves/PatternWavesTyped';
import { useLanguage } from '../lib/LanguageContext';
import { fetchServerCmsProjects, getCmsProjects } from '../lib/cmsStore';

export const Home = () => {
  const { t, language } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [projectsList, setProjectsList] = useState(() => getCmsProjects());

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

  const trustedBrands = [
    {
      name: "Pertamina",
      src: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Pertamina_Logo.svg",
      className: "w-[150px] sm:w-[180px] lg:w-[190px]"
    },
    {
      name: "BTN",
      src: "https://upload.wikimedia.org/wikipedia/commons/c/ca/BTN_2024.svg",
      className: "w-[82px] sm:w-[96px] lg:w-[108px]"
    },
    {
      name: "IHC",
      src: "https://kftd.co.id/assets/img/customer/1.%20IHC.jpg",
      className: "w-[130px] sm:w-[160px] lg:w-[170px]"
    },
    {
      name: "MarkPlus",
      src: "https://www.markplusinc.com/assets/logo/logo.png",
      className: "w-[132px] sm:w-[162px] lg:w-[174px]"
    },
    {
      name: "Sababay Winery",
      src: "https://cdn.sejutacita.id/657558cf2470a30014750e5d/JobPortalCompanyLogo/c1ac6eb5-23f1-4de6-909f-36d9b584456e.jpg",
      className: "w-[120px] sm:w-[146px] lg:w-[156px]"
    },
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

  const previewProjects = projectsList.slice(0, 4);

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
      value: "End-to-End",
      meta: language === 'id' ? "Strategy • Design • Code" : "Strategy • Design • Code",
      desc: language === 'id' ? "Satu tim dari arah awal hingga produk berjalan." : "One team from direction to delivery."
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: language === 'id' ? "Penemuan & Ruang Lingkup" : "Discovery & Scope",
      desc: language === 'id' 
        ? "Kami menganalisis target bisnis, audiens sasaran, dan kebutuhan teknis untuk merancang roadmap kerja yang terukur."
        : "We analyze your business goals, target audience, and project specifications to create an actionable roadmap."
    },
    {
      step: "02",
      title: language === 'id' ? "Desain UI/UX & Prototipe" : "UI/UX & Prototyping",
      desc: language === 'id'
        ? "Kami merancang wireframe, alur pengguna, dan prototipe interaktif di Figma untuk ditinjau dan disetujui sebelum coding."
        : "We design wireframes, user flows, and interactive mockups in Figma for your review and approval before coding."
    },
    {
      step: "03",
      title: language === 'id' ? "Pengembangan Agile" : "Agile Development",
      desc: language === 'id'
        ? "Tim engineer kami menulis kode yang bersih, teruji, dan modular dengan laporan kemajuan berkala di setiap milestone."
        : "Our engineering team writes clean, tested, and modular code with regular milestone updates and progress demos."
    },
    {
      step: "04",
      title: language === 'id' ? "Pengujian & Peluncuran" : "Testing & Launch",
      desc: language === 'id'
        ? "QA menyeluruh di berbagai peramban dan perangkat, konfigurasi domain, deployment cloud, dan garansi pemeliharaan."
        : "Comprehensive QA across browsers and devices, domain setup, deployment, and ongoing post-launch maintenance."
    }
  ];

  return (
    <div className="bg-[#0B0C0E] text-white min-h-screen selection:bg-brand-red selection:text-white" role="main">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-center px-4 sm:px-6 md:px-12 pt-28 sm:pt-36 md:pt-40 pb-16 sm:pb-20 overflow-hidden">
        <AtmosphericBackground
          imageUrl="/hero_background_3d.png"
          opacity={0.06}
          disableGrayscale={true}
        />

        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <PatternWaves
            preset="silk"
            color="#E50914"
            backgroundColor="transparent"
            opacity={0.55}
            fade="edges"
            fadeSize={0.7}
            interactive
            cursorSize={72}
            cursorStrength={0.45}
            speed={0.28}
            scale={1.15}
            depth={0.78}
            shine={0.65}
            contrast={1.1}
            intro
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(11,12,14,0.12),rgba(11,12,14,0.76)_78%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0B0C0E] to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
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

      {/* AGENCY PROOF / METRICS */}
      <section className="py-14 sm:py-18 lg:py-20 px-4 sm:px-6 md:px-12 bg-[#0B0C0E] border-y border-[#262930]" aria-label="Agency metrics">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8 sm:mb-10">
            <div>
              <span className="text-brand-red font-mono font-semibold tracking-[0.18em] uppercase text-[10px] sm:text-xs">
                {language === 'id' ? 'Studio dalam angka' : 'Studio at a glance'}
              </span>
              <h2 className="mt-2 text-xl sm:text-2xl md:text-3xl font-display font-semibold tracking-[-0.03em] text-white">
                {language === 'id' ? 'Ringkas. Terukur. Siap dieksekusi.' : 'Focused, measurable, ready to execute.'}
              </h2>
            </div>
            <p className="max-w-md text-xs sm:text-sm leading-relaxed text-[#8A909D] font-light">
              {language === 'id'
                ? 'Kapitech menggabungkan strategi, desain, dan engineering dalam satu alur kerja yang rapat.'
                : 'Kapitech brings strategy, design, and engineering into one tightly connected workflow.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-[#262930]">
            {stats.map((stat, i) => (
              <div
                key={stat.index}
                className={`relative py-6 sm:py-7 lg:py-8 pr-5 sm:pr-7 lg:pr-8 ${i > 0 ? 'lg:pl-7 border-t sm:border-t-0 lg:border-l border-[#262930]' : ''} group`}
              >
                <div className="flex items-center justify-between gap-4 mb-7">
                  <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#8A909D]">
                    {stat.label}
                  </span>
                  <span className="text-[10px] font-mono tabular-nums text-brand-red/70">
                    {stat.index}
                  </span>
                </div>

                <div className="min-h-[82px] flex flex-col justify-end">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[2.6rem] sm:text-[3.1rem] lg:text-[3.3rem] font-display font-semibold leading-none tracking-[-0.06em] text-white group-hover:text-brand-red transition-colors duration-300">
                      {stat.value}
                    </span>
                    {stat.suffix && (
                      <span className="text-xs sm:text-sm font-mono text-[#8A909D]">
                        {stat.suffix}
                      </span>
                    )}
                  </div>
                  <span className="mt-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.14em] text-brand-red/80">
                    {stat.meta}
                  </span>
                </div>

                <p className="mt-5 max-w-xs text-xs sm:text-sm leading-relaxed text-[#8A909D] font-light">
                  {stat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENTS & PARTNERS SECTION - LOOPING CAROUSEL WITH SIDE SHADOWS */}
      <section className="py-14 sm:py-20 bg-[#0B0C0E] border-b border-[#262930] overflow-hidden relative" id="clients">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 mb-8 sm:mb-10 text-left">
          <span className="text-brand-red font-mono font-semibold tracking-widest uppercase text-xs mb-2 block">
            {language === 'id' ? 'DIPERCAYA DI INDONESIA' : 'TRUSTED BY INDONESIAN TEAMS'}
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold tracking-[-0.03em] text-white max-w-3xl">
            {language === 'id' 
              ? 'Brand Indonesia yang pernah bekerja bersama Kapitech' 
              : 'Indonesian brands that have worked with Kapitech'}
          </h2>
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
              className="flex items-center gap-12 sm:gap-20 shrink-0 pr-12 sm:pr-20"
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
                  className="flex min-w-[170px] sm:min-w-[220px] lg:min-w-[250px] h-20 sm:h-24 items-center justify-center shrink-0 px-6 sm:px-8"
                  aria-label={logo.name}
                >
                  <img
                    src={logo.src}
                    alt=""
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className={`${logo.className} max-h-12 sm:max-h-14 object-contain opacity-55 grayscale brightness-0 invert group-hover:opacity-100 transition-opacity duration-300`}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* SOLUTIONS & 3 CORE PILLARS SECTION */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-[#0B0C0E] border-b border-[#262930] relative z-10" id="services">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-12 sm:mb-16">
            <div>
              <span className="text-brand-red font-mono font-semibold tracking-widest uppercase text-xs mb-2 sm:mb-3 block">
                {language === 'id' ? 'Layanan & Solusi Lengkap' : 'Solutions & Core Capabilities'}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold tracking-tight text-white">
                {language === 'id' ? 'Solusi Strategis & Keahlian Studio' : 'Strategic Solutions & Studio Craft'}
              </h2>
            </div>
            <Link 
              to="/services" 
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-red hover:text-white transition-colors"
            >
              <span>{language === 'id' ? 'Lihat Semua Layanan & Solusi' : 'Explore All Services & Solutions'}</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Solutions 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 mb-12">
            {[
              {
                slug: 'mvp-design',
                title: 'MVP DESIGN',
                audience: language === 'id' ? 'Untuk ekosistem enterprise & startup' : 'For enterprise ecosystems',
                desc: language === 'id' ? 'Ciptakan produk digital berdaya saing, pikat investor, dan raih klien baru.' : 'Create a digital product, attract investors and new clients'
              },
              {
                slug: 'product-redesign',
                title: 'PRODUCT REDESIGN',
                audience: language === 'id' ? 'Untuk UKM & korporasi berkembang' : 'For SMEs & enterprises',
                desc: language === 'id' ? 'Dapatkan tampilan modern, tingkatkan UX, dan optimalkan konversi.' : 'Get a fresh look, improved user experience, or enhanced functionality'
              },
              {
                slug: 'team-extension',
                title: 'TEAM EXTENSION',
                audience: language === 'id' ? 'Untuk perusahaan dengan tim internal' : 'For existing companies',
                desc: language === 'id' ? 'Perluas kapasitas tim Anda bersama desainer & engineer berdedikasi kami.' : 'Expand your team with our dedicated and talented design experts'
              }
            ].map((sol, idx) => (
              <Link 
                key={idx} 
                to={`/solutions/${sol.slug}`}
                className="group p-7 sm:p-8 min-h-[250px] rounded-2xl bg-[#16181D] border border-[#262930] hover:border-brand-red/40 hover:bg-[#1B1F26] transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand-red font-semibold block mb-1">
                    {sol.audience}
                  </span>
                  <h3 className="text-xl font-display font-bold text-white group-hover:text-brand-red transition-colors mb-2">
                    {sol.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8A909D] font-light leading-relaxed">
                    {sol.desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#262930]">
                  <div className="text-xs font-mono text-brand-red group-hover:text-white flex items-center gap-1.5 transition-colors">
                    <span>{language === 'id' ? 'Lihat Detail Subpage' : 'Explore Subpage'}</span>
                    <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 3 Pillars Grid (Branding, Design, Development) with kapi-card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1: Branding */}
            <div className="kapi-card" id="card-branding">
              <div className="kapi-card-header">
                <div className="kapi-card-icon-box">
                  <Sparkles className="w-5 h-5 text-current" />
                </div>
                <span className="kapi-card-pill">01. IDENTITY</span>
              </div>

              <div className="kapi-card-body">
                <h3 className="kapi-card-title">
                  BRAND IDENTITY & SYSTEM
                </h3>
                <p className="kapi-card-desc">
                  {language === 'id' 
                    ? 'Merumuskan positioning, panduan gaya visual terstruktur, dan strategi diferensiasi brand yang memperkuat reputasi pasar.' 
                    : 'Build undeniable market distinction, cohesive visual systems, and high-trust positioning.'}
                </p>
                <div className="kapi-card-tags">
                  <span className="kapi-card-tag">Pitch Deck</span>
                  <span className="kapi-card-tag">Brand Identity</span>
                  <span className="kapi-card-tag">Logo Design</span>
                  <span className="kapi-card-tag">Rebranding</span>
                </div>
              </div>

              <div className="kapi-card-footer">
                <Link to="/services" className="flex items-center justify-between w-full">
                  <span>{language === 'id' ? 'Jelajahi 5 Layanan Branding' : 'Explore 5 Branding Services'}</span>
                  <div className="kapi-card-arrow">
                    <ArrowUpRight size={14} />
                  </div>
                </Link>
              </div>
            </div>

            {/* Pillar 2: Design */}
            <div className="kapi-card" id="card-design">
              <div className="kapi-card-header">
                <div className="kapi-card-icon-box">
                  <Layers className="w-5 h-5 text-current" />
                </div>
                <span className="kapi-card-pill">02. EXPERIENCE</span>
              </div>

              <div className="kapi-card-body">
                <h3 className="kapi-card-title">
                  UI/UX & PRODUCT DESIGN
                </h3>
                <p className="kapi-card-desc">
                  {language === 'id' 
                    ? 'Pengalaman antarmuka intuitif berstandar global, prototipe interaktif, dan Design System multi-platform di Figma.' 
                    : 'Frictionless UI/UX architectures, interactive prototyping, and cross-platform design systems in Figma.'}
                </p>
                <div className="kapi-card-tags">
                  <span className="kapi-card-tag">UI/UX Design</span>
                  <span className="kapi-card-tag">Web & Mobile</span>
                  <span className="kapi-card-tag">Redesign</span>
                  <span className="kapi-card-tag">UX Audit</span>
                </div>
              </div>

              <div className="kapi-card-footer">
                <Link to="/services" className="flex items-center justify-between w-full">
                  <span>{language === 'id' ? 'Jelajahi 5 Layanan Desain' : 'Explore 5 Design Services'}</span>
                  <div className="kapi-card-arrow">
                    <ArrowUpRight size={14} />
                  </div>
                </Link>
              </div>
            </div>

            {/* Pillar 3: Development */}
            <div className="kapi-card" id="card-development">
              <div className="kapi-card-header">
                <div className="kapi-card-icon-box">
                  <Code2 className="w-5 h-5 text-current" />
                </div>
                <span className="kapi-card-pill">03. ENGINEERING</span>
              </div>

              <div className="kapi-card-body">
                <h3 className="kapi-card-title">
                  FULL-STACK ENGINEERING
                </h3>
                <p className="kapi-card-desc">
                  {language === 'id' 
                    ? 'Rekayasa web modern berperforma tinggi, skalabilitas cloud elastis, integrasi API, dan skor Lighthouse 99+.' 
                    : 'High-performance web applications, resilient cloud architecture, and ultra-fast Lighthouse 99+ loading speeds.'}
                </p>
                <div className="kapi-card-tags">
                  <span className="kapi-card-tag">Web Development</span>
                  <span className="kapi-card-tag">MVP Build</span>
                  <span className="kapi-card-tag">Landing Pages</span>
                  <span className="kapi-card-tag">Enterprise</span>
                </div>
              </div>

              <div className="kapi-card-footer">
                <Link to="/services" className="flex items-center justify-between w-full">
                  <span>{language === 'id' ? 'Jelajahi 5 Layanan Engineering' : 'Explore 5 Engineering Services'}</span>
                  <div className="kapi-card-arrow">
                    <ArrowUpRight size={14} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS PREVIEW (Linked to 50 Case Studies) */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-[#0B0C0E] border-b border-[#262930] relative z-10" id="work">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-10 sm:mb-16">
            <div>
              <span className="text-brand-red font-mono font-semibold tracking-widest uppercase text-xs mb-2 sm:mb-3 block">
                {language === 'id' ? 'Studi Kasus Unggulan' : 'Featured Case Studies'}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold tracking-tight text-white">
                {language === 'id' ? 'Karya Nyata & Berkelanjutan' : 'Real Work for Real Leaders'}
              </h2>
            </div>
            <Link 
              to="/work" 
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white hover:text-brand-red transition-colors"
            >
              <span>{language === 'id' ? 'Buka Semua 50 Portofolio' : 'View All 50 Case Studies'}</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {previewProjects.map((project) => (
              <Link 
                key={project.id}
                to="/work"
                className="group rounded-2xl overflow-hidden bg-[#16181D] border border-[#262930] hover:border-brand-red/40 transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0B0C0E]">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#0B0C0E]/90 backdrop-blur-md text-[10px] font-mono text-brand-red border border-[#262930]">
                    {project.impact[0] ? `${project.impact[0].value} ${project.impact[0].label}` : project.year}
                  </div>
                </div>
                <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className="text-[11px] font-mono font-medium text-brand-red uppercase tracking-wider">
                        {project.service}
                      </span>
                      <span className="text-[11px] font-light text-[#8A909D]">
                        {project.client}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-display font-bold mb-2.5 text-white group-hover:text-brand-red transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#8A909D] font-light leading-relaxed mb-5">
                      {language === 'id' ? project.descId : project.desc}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#262930]">
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 3).map((item) => (
                        <span key={item} className="px-2 py-0.5 rounded bg-[#0B0C0E] border border-[#262930] text-[10px] font-mono text-[#8A909D]">
                          {item}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-medium text-brand-red inline-flex items-center gap-1">
                      {language === 'id' ? 'Buka Kasus' : 'Inspect'} <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WORKING PROCESS STEPPING */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-[#0B0C0E] border-b border-[#262930]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12 sm:mb-16">
            <span className="text-brand-red font-mono font-semibold tracking-widest uppercase text-xs mb-3 block">
              {language === 'id' ? 'Alur Kerja Studio' : 'Our Working Framework'}
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight text-white">
              {language === 'id' ? 'Eksekusi Tangkas & Terukur' : 'Disciplined Agile Execution'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8">
            {processSteps.map((step) => (
              <div 
                key={step.step}
                className="relative pt-6 border-t border-[#262930] hover:border-brand-red/50 transition-colors flex flex-col justify-between"
              >
                <div className="text-2xl font-display font-bold text-brand-red font-mono mb-4">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8A909D] font-light leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />
    </div>
  );
};
