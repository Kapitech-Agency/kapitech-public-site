import React from 'react';
import PatternWaves from '../components/ui/PatternWaves/PatternWavesTyped';
import { motion } from 'motion/react';
import { ArrowUpRight, CheckCircle2, Globe, Cpu, Layout, Code2, Palette, Shield, Zap, Sparkles, Building2, MapPin, Users, Award, Terminal, Cloud, Layers, Check, Database, Server } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/LanguageContext';

export const About = () => {
  const { t, language } = useLanguage();

  const valuesEn = [
    {
      title: "Functional & Purposeful Design",
      icon: <Palette size={24} />,
      desc: "We prioritize usability, intuitive information hierarchy, and clean aesthetics. Every screen element is designed to serve a concrete user need rather than superficial decoration."
    },
    {
      title: "Modern & Scalable Engineering",
      icon: <Code2 size={24} />,
      desc: "Built on modern frameworks like React, Next.js, and TypeScript, our web products and digital systems emphasize high speed, robust security, and maintainability."
    },
    {
      title: "Direct & Transparent Partnership",
      icon: <Globe size={24} />,
      desc: "We work directly with founders and product teams. No bureaucratic layers or hidden overhead—just clear communication and accountable milestones."
    }
  ];

  const valuesId = [
    {
      title: "Desain Fungsional & Bertujuan",
      icon: <Palette size={24} />,
      desc: "Kami memprioritaskan kemudahan penggunaan, hierarki informasi yang intuitif, dan estetika bersih. Setiap elemen antarmuka dirancang untuk menjawab kebutuhan nyata pengguna."
    },
    {
      title: "Rekayasa Modern & Skalabel",
      icon: <Code2 size={24} />,
      desc: "Dibangun di atas framework terdepan seperti React, Next.js, dan TypeScript, produk web dan sistem digital kami menekankan kecepatan tinggi, keamanan teruji, dan kemudahan pemeliharaan."
    },
    {
      title: "Kemitraan Langsung & Transparan",
      icon: <Globe size={24} />,
      desc: "Kami berkolaborasi langsung dengan founder dan tim produk. Tanpa birokrasi berbelit atau biaya tersembunyi—hanya komunikasi terbuka dan pencapaian milestone yang bertanggung jawab."
    }
  ];

  const values = language === 'id' ? valuesId : valuesEn;

  const journeyEn = [
    { 
      year: "2021", 
      title: "Agency Inception", 
      desc: "Founded as a specialized digital studio by Fikri Nurlete and Reynaldo Fransiskus Anakotta, delivering custom web products and brand identities." 
    },
    { 
      year: "2022", 
      title: "Engineering Expansion", 
      desc: "Expanded into full-stack web application development and SaaS platform engineering, strengthening our product and infrastructure capabilities." 
    },
    { 
      year: "2023", 
      title: "Diverse Client Ecosystem", 
      desc: "Delivered 40+ digital platforms for growing startups, real estate firms, and e-commerce companies across Southeast Asia and global markets." 
    },
    { 
      year: "2024", 
      title: "Official Corporate Entity", 
      desc: "Officially registered as PT Kapitech Digital Indonesia in South Tangerang, standardizing enterprise delivery and continuous client SLA support." 
    }
  ];

  const journeyId = [
    { 
      year: "2021", 
      title: "Awal Berdirinya Agensi", 
      desc: "Didirikan sebagai studio digital khusus oleh Fikri Nurlete dan Reynaldo Fransiskus Anakotta, menghadirkan produk web kustom dan identitas brand modern." 
    },
    { 
      year: "2022", 
      title: "Ekspansi Rekayasa Software", 
      desc: "Memperluas kapabilitas ke pengembangan aplikasi web full-stack dan rekayasa platform SaaS, sekaligus memperkuat kapabilitas produk dan infrastruktur kami." 
    },
    { 
      year: "2023", 
      title: "Ekosistem Klien Beragam", 
      desc: "Menyelesaikan 40+ platform digital untuk startup berkembang, perusahaan properti, dan bisnis e-commerce di Asia Tenggara dan pasar global." 
    },
    { 
      year: "2024", 
      title: "Entitas Badan Hukum Resmi", 
      desc: "Resmi terdaftar sebagai PT Kapitech Digital Indonesia di Tangerang Selatan, menstandarisasi delivery kelas korporat dan garansi SLA berkesinambungan." 
    }
  ];

  const journey = language === 'id' ? journeyId : journeyEn;

  const techStackEn = [
    { 
      category: "Frontend Engineering", 
      subtitle: "Fast, accessible, and reactive interfaces",
      badge: "Modern Web",
      icon: <Code2 size={22} className="text-brand-red" />,
      tools: [
        { name: "React 18+", level: "Primary UI" },
        { name: "Next.js (App Router)", level: "SSR / SSG" },
        { name: "TypeScript", level: "Type-Safety" },
        { name: "Tailwind CSS", level: "Design Tokens" },
        { name: "Motion", level: "Micro-Interactions" },
        { name: "Vite", level: "Build Tooling" }
      ]
    },
    { 
      category: "Backend & Cloud Services", 
      subtitle: "Scalable APIs and robust databases",
      badge: "Full-Stack Core",
      icon: <Server size={22} className="text-brand-red" />,
      tools: [
        { name: "Node.js / Express", level: "API Runtime" },
        { name: "PostgreSQL", level: "Relational DB" },
        { name: "Firebase / Firestore", level: "Realtime & Auth" },
        { name: "RESTful & GraphQL", level: "Contract Design" },
        { name: "Prisma & Drizzle", level: "Type-Safe ORM" },
        { name: "Redis", level: "In-Memory Cache" }
      ]
    },
    { 
      category: "Design & Product Systems", 
      subtitle: "User-centric research & Figma systems",
      badge: "Creative Suite",
      icon: <Palette size={22} className="text-brand-red" />,
      tools: [
        { name: "Figma & FigJam", level: "Prototypes & UI" },
        { name: "Design Tokens", level: "Cross-Platform" },
        { name: "Adobe Illustrator", level: "Vector Systems" },
        { name: "Adobe Photoshop", level: "Asset Retouching" },
        { name: "Spline 3D", level: "3D Interaction" },
        { name: "Miro", level: "Flow Mapping" }
      ]
    },
    { 
      category: "DevOps & Infrastructure", 
      subtitle: "Automated CI/CD and secure deployments",
      badge: "Cloud Scalability",
      icon: <Cloud size={22} className="text-brand-red" />,
      tools: [
        { name: "Google Cloud Platform", level: "Managed Cloud" },
        { name: "Amazon Web Services", level: "S3 & Compute" },
        { name: "Vercel & Netlify", level: "Edge Hosting" },
        { name: "Docker", level: "Containerization" },
        { name: "GitHub Actions", level: "CI/CD Pipeline" },
        { name: "Cloudflare", level: "DNS & Security" }
      ]
    }
  ];

  const techStackId = [
    { 
      category: "Rekayasa Frontend", 
      subtitle: "Antarmuka cepat, aksesibel, dan reaktif",
      badge: "Web Modern",
      icon: <Code2 size={22} className="text-brand-red" />,
      tools: [
        { name: "React 18+", level: "UI Utama" },
        { name: "Next.js (App Router)", level: "SSR / SSG" },
        { name: "TypeScript", level: "Keamanan Tipe" },
        { name: "Tailwind CSS", level: "Token Desain" },
        { name: "Motion", level: "Mikro-Interaksi" },
        { name: "Vite", level: "Build Tool" }
      ]
    },
    { 
      category: "Backend & Layanan Cloud", 
      subtitle: "API skalabel dan database tangguh",
      badge: "Inti Full-Stack",
      icon: <Server size={22} className="text-brand-red" />,
      tools: [
        { name: "Node.js / Express", level: "Runtime API" },
        { name: "PostgreSQL", level: "Database Relasional" },
        { name: "Firebase / Firestore", level: "Realtime & Otentikasi" },
        { name: "RESTful & GraphQL", level: "Desain Kontrak API" },
        { name: "Prisma & Drizzle", level: "ORM Bertipe Aman" },
        { name: "Redis", level: "Cache Memori Cepat" }
      ]
    },
    { 
      category: "Sistem Desain & Produk", 
      subtitle: "Riset pengguna & sistem desain Figma",
      badge: "Suite Kreatif",
      icon: <Palette size={22} className="text-brand-red" />,
      tools: [
        { name: "Figma & FigJam", level: "Prototipe & UI" },
        { name: "Design Tokens", level: "Lintas Platform" },
        { name: "Adobe Illustrator", level: "Sistem Vektor" },
        { name: "Adobe Photoshop", level: "Retouching Visual" },
        { name: "Spline 3D", level: "Interaksi 3D" },
        { name: "Miro", level: "Pemetaan Alur" }
      ]
    },
    { 
      category: "DevOps & Infrastruktur Cloud", 
      subtitle: "CI/CD otomatis dan deployment aman",
      badge: "Skalabilitas Cloud",
      icon: <Cloud size={22} className="text-brand-red" />,
      tools: [
        { name: "Google Cloud Platform", level: "Cloud Terkelola" },
        { name: "Amazon Web Services", level: "S3 & Komputasi" },
        { name: "Vercel & Netlify", level: "Hosting Edge" },
        { name: "Docker", level: "Kontainerisasi" },
        { name: "GitHub Actions", level: "Pipeline CI/CD" },
        { name: "Cloudflare", level: "DNS & Keamanan" }
      ]
    }
  ];

  const techStack = language === 'id' ? techStackId : techStackEn;

  const teamEn = [
    {
      name: "Fikri Nurlete",
      role: "Founder & Chief Executive Officer",
      image: "https://raw.githubusercontent.com/Kapitech-Agency/Kapitech-Agency.github.io/main/public/1.png",
      bio: "Leads agency vision, technical architecture, and client partnerships to deliver scalable digital products."
    },
    {
      name: "Reynaldo Fransiskus Anakotta",
      role: "Co-Founder & Project Manager",
      image: "https://raw.githubusercontent.com/Kapitech-Agency/Kapitech-Agency.github.io/main/public/3.png",
      bio: "Directs agile project management, sprint delivery, and operational workflows ensuring on-time release."
    },
    {
      name: "Hendri Hassan",
      role: "Executive Creative Director",
      image: "https://raw.githubusercontent.com/Kapitech-Agency/Kapitech-Agency.github.io/main/public/2.png",
      bio: "Directs visual design systems, brand identity, and intuitive user experience standards."
    },
    {
      name: "Ibrahim M.I",
      role: "Chief Marketing Officer",
      image: "https://raw.githubusercontent.com/Kapitech-Agency/Kapitech-Agency.github.io/main/public/5.png",
      bio: "Spearheads marketing strategy, client acquisition, brand storytelling, and strategic partnerships."
    },
    {
      name: "Akell Ahmed",
      role: "Associate Project Manager",
      image: "https://raw.githubusercontent.com/Kapitech-Agency/Kapitech-Agency.github.io/main/public/4.png",
      bio: "Coordinates project communications, milestone checklists, and cross-functional team execution."
    }
  ];

  const teamId = [
    {
      name: "Fikri Nurlete",
      role: "Pendiri & Chief Executive Officer",
      image: "https://raw.githubusercontent.com/Kapitech-Agency/Kapitech-Agency.github.io/main/public/1.png",
      bio: "Memimpin visi agensi, arsitektur teknis, dan kemitraan klien untuk produk digital berskala tinggi."
    },
    {
      name: "Reynaldo Fransiskus Anakotta",
      role: "Co-Founder & Project Manager",
      image: "https://raw.githubusercontent.com/Kapitech-Agency/Kapitech-Agency.github.io/main/public/3.png",
      bio: "Mengawasi manajemen proyek agile, eksekusi sprint, dan ketepatan jadwal rilis produk."
    },
    {
      name: "Hendri Hassan",
      role: "Executive Creative Director",
      image: "https://raw.githubusercontent.com/Kapitech-Agency/Kapitech-Agency.github.io/main/public/2.png",
      bio: "Memimpin arahan visual, sistem identitas brand, dan standar pengalaman pengguna modern."
    },
    {
      name: "Ibrahim M.I",
      role: "Chief Marketing Officer",
      image: "https://raw.githubusercontent.com/Kapitech-Agency/Kapitech-Agency.github.io/main/public/5.png",
      bio: "Memimpin strategi pemasaran, akuisisi klien, narasi brand, dan kemitraan strategis global."
    },
    {
      name: "Akell Ahmed",
      role: "Associate Project Manager",
      image: "https://raw.githubusercontent.com/Kapitech-Agency/Kapitech-Agency.github.io/main/public/4.png",
      bio: "Mengoordinasikan komunikasi proyek, checklist milestone, dan kolaborasi eksekusi tim."
    }
  ];

  const team = language === 'id' ? teamId : teamEn;

  return (
    <div className="bg-[#0B0C0E] text-white min-h-screen selection:bg-brand-red selection:text-white relative" role="main">
      {/* Hero Section */}
      <section className="relative pt-28 sm:pt-32 md:pt-36 pb-12 sm:pb-16 px-4 sm:px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <PatternWaves
            preset="ocean"
            color="#E50914"
            backgroundColor="#0B0C0E"
            opacity={0.3}
            fade="edges"
            fadeSize={0.74}
            interactive
            cursorSize={50}
            cursorStrength={0.32}
            speed={0.18}
            scale={1.06}
            depth={0.56}
            shine={0.52}
            contrast={1.04}
            intro
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/50 to-transparent" />
        </div><div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="kapi-section-label mb-5">
              {t('about.tag')}
            </span>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] font-display font-bold leading-[1.03] tracking-[-0.045em] mb-5 sm:mb-6 text-white"
            >
              {language === 'id' ? (
                <>Agensi digital yang dirancang untuk <span className="text-brand-red">kejelasan dan pertumbuhan</span>.</>
              ) : (
                <>A digital agency engineered for <span className="text-brand-red">clarity and growth</span>.</>
              )}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="text-sm sm:text-base md:text-lg text-[#8A909D] font-light leading-relaxed"
            >
              {t('about.subtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Our Identity & Foundations */}
      <section className="relative overflow-hidden border-b border-[#262930] bg-[#0B0C0E] px-4 py-16 sm:px-6 sm:py-20 md:px-12 md:py-28">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -right-40 top-10 h-96 w-96 rounded-full border border-brand-red/[0.045]" />
          <div className="absolute right-0 top-0 h-72 w-72 bg-brand-red/[0.025] blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 xl:gap-24">
            <div>
              <span className="kapi-section-label mb-5">
                {language === 'id' ? 'Identitas & Fondasi Kami' : 'Our Identity & Foundations'}
              </span>

              <motion.h2
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-12% 0px' }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 max-w-4xl text-3xl font-display font-semibold leading-[1.01] tracking-[-0.06em] text-white sm:text-4xl md:text-5xl lg:text-[4rem]"
              >
                {language === 'id'
                  ? 'Menjembatani strategi, desain, dan engineering untuk pekerjaan yang benar-benar berjalan.'
                  : 'Bridging strategy, design, and engineering for work that actually ships.'}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-12% 0px' }}
                transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 max-w-2xl text-sm font-light leading-[1.85] text-[#8A909D] sm:text-base"
              >
                {language === 'id'
                  ? 'Kapitech Agency beroperasi di bawah PT Kapitech Digital Indonesia, berbasis di Tangerang Selatan. Kami bekerja sebagai tim kolaboratif yang menyatukan keputusan kreatif dan teknis sejak awal, sehingga hasil akhir tidak berhenti sebagai konsep.'
                  : 'Kapitech Agency operates under PT Kapitech Digital Indonesia, based in South Tangerang. We work as a collaborative team that connects creative and technical decisions from the start, so the final result does not stop at the concept stage.'}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-12% 0px' }}
                transition={{ duration: 0.65, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 max-w-2xl text-sm font-light leading-[1.85] text-[#8A909D] sm:text-base"
              >
                {language === 'id'
                  ? 'Kami mengutamakan struktur yang jelas, eksekusi yang disiplin, dan kualitas yang dapat dipertanggungjawabkan. Dari identitas visual hingga produk digital, setiap keputusan harus punya alasan dan tujuan yang jelas.'
                  : 'We value clear structure, disciplined execution, and accountable quality. From visual identity to digital products, every decision should have a clear reason and a clear purpose.'}
              </motion.p>

              <div className="mt-10 border-y border-white/[0.07] py-6 sm:py-7">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-5">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#6F757F]">
                      {language === 'id' ? 'Portofolio' : 'Portfolio'}
                    </span>
                    <div className="mt-2 flex items-end gap-2">
                      <span className="text-4xl font-display font-semibold leading-none tracking-[-0.06em] text-white">50+</span>
                      <span className="pb-0.5 text-[10px] font-mono uppercase tracking-[0.12em] text-brand-red">projects</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#6F757F]">
                      {language === 'id' ? 'Pengalaman' : 'Experience'}
                    </span>
                    <div className="mt-2 flex items-end gap-2">
                      <span className="text-4xl font-display font-semibold leading-none tracking-[-0.06em] text-white">3+</span>
                      <span className="pb-0.5 text-[10px] font-mono uppercase tracking-[0.12em] text-brand-red">years</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#6F757F]">
                      {language === 'id' ? 'Basis' : 'Base'}
                    </span>
                    <div className="mt-2 text-sm font-medium leading-tight text-white sm:max-w-[11rem]">
                      South Tangerang, Indonesia
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex items-start gap-3 text-xs text-[#8A909D]">
                <MapPin size={15} className="mt-0.5 shrink-0 text-brand-red" aria-hidden="true" />
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#6F757F]">
                    {language === 'id' ? 'Kantor Pusat Perusahaan' : 'Corporate Headquarters'}
                  </span>
                  <p className="mt-1 max-w-2xl leading-[1.7] text-[#A7ACB5]">
                    Linea Residence, Block G No. 5, Melati Loka Street, Paku Jaya, North Serpong, South Tangerang City, Banten 15220, Indonesia
                  </p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-12% 0px' }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="lg:pt-10"
            >
              <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121316] sm:rounded-3xl">
                <div className="aspect-[4/5] overflow-hidden sm:aspect-[5/6]">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
                    alt="Kapitech Agency team collaboration"
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#08090B] via-[#08090B]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                  <div className="border-t border-white/[0.14] pt-4">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-brand-red">
                      {language === 'id' ? 'Fondasi Kapitech' : 'Kapitech Foundation'}
                    </span>
                    <p className="mt-2 max-w-md text-lg font-display font-semibold leading-tight tracking-[-0.035em] text-white sm:text-xl">
                      {language === 'id'
                        ? 'Kualitas, transparansi, dan delivery yang dapat diandalkan.'
                        : 'Quality, transparency, and dependable delivery.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#6F757F]">
                    {language === 'id' ? 'Model kerja' : 'Working model'}
                  </span>
                  <p className="mt-2 text-sm font-medium text-white">
                    {language === 'id' ? 'Kolaboratif & langsung' : 'Direct & collaborative'}
                  </p>
                </div>
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#6F757F]">
                    {language === 'id' ? 'Fokus' : 'Focus'}
                  </span>
                  <p className="mt-2 text-sm font-medium text-white">
                    {language === 'id' ? 'Outcome & delivery' : 'Outcome & delivery'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Executive Leadership */}
      <section className="relative overflow-hidden border-b border-[#262930] bg-[#0B0C0E] px-4 py-16 sm:px-6 sm:py-20 md:px-12 md:py-28" id="team">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -right-40 top-10 h-96 w-96 rounded-full border border-brand-red/[0.035]" />
          <div className="absolute -left-40 bottom-[-12rem] h-96 w-96 rounded-full border border-white/[0.02]" />
          <div className="absolute right-0 top-0 h-72 w-72 bg-brand-red/[0.018] blur-[110px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-10 grid gap-8 lg:mb-14 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div className="max-w-4xl">
              <span className="kapi-section-label mb-5">
                {t('about.leadership.tag')}
              </span>
              <motion.h2
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-12% 0px' }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 max-w-4xl text-3xl font-display font-semibold leading-[1.01] tracking-[-0.06em] text-white sm:text-4xl md:text-5xl lg:text-[4rem]"
              >
                {t('about.leadership.title')}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-12% 0px' }}
                transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 max-w-2xl text-sm font-light leading-[1.85] text-[#8A909D] sm:text-base"
              >
                {t('about.leadership.subtitle')}
              </motion.p>
            </div>

            <div className="hidden lg:flex lg:flex-col lg:items-end lg:gap-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#6F757F]">
                {language === 'id' ? 'Tim inti' : 'Core team'}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-display font-semibold tracking-[-0.05em] text-white">{String(team.length).padStart(2, '0')}</span>
                <span className="h-px w-10 bg-brand-red/70" aria-hidden="true" />
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#6F757F]">
                  {language === 'id' ? 'Leadership roles' : 'Leadership roles'}
                </span>
              </div>
            </div>
          </div>

          {team[0] && (
            <motion.article
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="group relative mb-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111216] transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-brand-red/30"
            >
              <div className="grid min-w-0 lg:grid-cols-[minmax(320px,0.78fr)_minmax(0,1.22fr)]">
                <div className="relative flex min-h-[320px] items-center overflow-hidden bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.045),transparent_55%)] p-5 sm:min-h-[430px] sm:p-6 lg:min-h-[500px]">
                  <div className="relative w-full overflow-hidden rounded-xl border border-white/[0.06] bg-[#0D0E11] aspect-[16/15]">
                    <img
                      src={team[0].image}
                      alt={team[0].name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08090B]/65 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2.5 sm:bottom-5 sm:left-5 sm:gap-3">
                      <span className="inline-flex rounded-full border border-white/[0.12] bg-[#090A0C]/70 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.12em] text-white backdrop-blur-md">
                        01
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-white/65">
                        {language === 'id' ? 'Executive lead' : 'Executive lead'}
                      </span>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#08090B]/10 via-transparent to-[#08090B]/10" />
                </div>

                <div className="flex min-w-0 flex-col justify-between p-6 sm:p-8 lg:p-10 xl:p-12">
                  <div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-brand-red">
                        {language === 'id' ? 'Executive Leadership' : 'Executive Leadership'}
                      </span>
                      <span className="h-px w-6 bg-white/[0.12]" aria-hidden="true" />
                      <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#6F757F]">
                        {String(1).padStart(2, '0')} / {String(team.length).padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="mt-5 max-w-3xl text-3xl font-display font-semibold leading-[0.96] tracking-[-0.055em] text-white sm:text-4xl lg:text-[3.4rem]">
                      {team[0].name}
                    </h3>
                    <p className="mt-3 text-xs font-mono uppercase tracking-[0.12em] text-[#A7ACB5] sm:text-sm">
                      {team[0].role}
                    </p>
                    <p className="mt-6 max-w-2xl text-sm font-light leading-[1.85] text-[#8A909D] sm:text-base">
                      {team[0].bio}
                    </p>
                  </div>

                  <div className="mt-10 border-t border-white/[0.07] pt-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#6F757F]">
                          {language === 'id' ? 'Fokus kepemimpinan' : 'Leadership focus'}
                        </span>
                        <p className="mt-2 text-sm font-medium leading-relaxed text-white">
                          {language === 'id' ? 'Visi, arsitektur, dan partnership' : 'Vision, architecture, and partnerships'}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#6F757F]">
                          {language === 'id' ? 'Cara memimpin' : 'Leadership approach'}
                        </span>
                        <p className="mt-2 text-sm font-medium leading-relaxed text-white">
                          {language === 'id' ? 'Strategis, langsung, dan delivery-focused' : 'Strategic, direct, and delivery-focused'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {team.slice(1).map((member, index) => {
              const focusEn = [
                'Project delivery & operations',
                'Creative direction & brand systems',
                'Growth, marketing & partnerships',
                'Project coordination & team execution'
              ][index];
              const focusId = [
                'Delivery proyek & operasional',
                'Arahan kreatif & sistem brand',
                'Growth, marketing & partnership',
                'Koordinasi proyek & eksekusi tim'
              ][index];

              return (
                <motion.article
                  key={member.name}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative min-w-0 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111216] transition-[border-color,transform,background-color] duration-300 hover:-translate-y-1 hover:border-brand-red/25 hover:bg-[#141519]"
                >
                  <div className="relative aspect-[16/15] overflow-hidden bg-[#171920]">
                    <img
                      src={member.image}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08090B]/80 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full border border-white/[0.1] bg-[#090A0C]/65 px-2.5 py-1 text-[10px] font-mono tabular-nums text-white/75 backdrop-blur-md">
                      {String(index + 2).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="min-w-0 p-5 sm:p-6">
                    <h3 className="text-lg font-display font-semibold leading-tight tracking-[-0.04em] text-white transition-colors duration-300 group-hover:text-brand-red">
                      {member.name}
                    </h3>
                    <p className="mt-2 text-[10px] font-mono uppercase leading-[1.4] tracking-[0.12em] text-brand-red sm:text-[11px]">
                      {member.role}
                    </p>
                    <div className="mt-4 border-t border-white/[0.07] pt-4">
                      <span className="text-[9px] font-mono uppercase tracking-[0.14em] text-[#6F757F]">
                        {language === 'id' ? 'Fokus' : 'Focus'}
                      </span>
                      <p className="mt-1.5 text-xs font-medium leading-relaxed text-white/90">
                        {language === 'id' ? focusId : focusEn}
                      </p>
                    </div>
                    <p className="mt-3 text-xs font-light leading-[1.75] text-[#8A909D]">
                      {member.bio}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Principles / Values */}
      <section className="relative z-10 overflow-hidden border-b border-[#262930] bg-[#0B0C0E] px-4 py-16 sm:px-6 sm:py-24 md:px-12">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -right-40 top-10 h-80 w-80 rounded-full border border-brand-red/[0.035]" />
          <div className="absolute right-0 top-0 h-72 w-72 bg-brand-red/[0.018] blur-[110px]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl sm:mb-14 md:mb-16">
            <span className="kapi-section-label mb-5">
              {language === 'id' ? 'Prinsip Kerja Kami' : 'Our Principles'}
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-12% 0px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 max-w-3xl text-3xl font-display font-semibold leading-[1.02] tracking-[-0.06em] text-white sm:text-4xl md:text-5xl lg:text-[4rem]"
            >
              {language === 'id' ? 'Bagaimana kami menangani setiap proyek.' : 'How we approach every project.'}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-12% 0px' }}
              transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 max-w-2xl text-sm font-light leading-[1.85] text-[#8A909D] sm:text-base"
            >
              {language === 'id'
                ? 'Kami memegang standar ketat untuk kegunaan, kecepatan, dan dampak bisnis nyata.'
                : 'We hold our work to strict standards of usability, speed, and business impact.'}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:gap-8">
            {values.map((v, i) => (
              <motion.article
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className="group relative flex min-w-0 min-h-[230px] flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111216] p-6 transition-[border-color,transform,background-color] duration-300 hover:border-brand-red/30 hover:bg-[#141519] sm:min-h-[250px] sm:p-7 md:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-red/20 bg-brand-red/10 text-brand-red transition-transform duration-300 group-hover:scale-[1.03] sm:h-12 sm:w-12">
                    {v.icon}
                  </div>
                  <span className="pt-1 text-[10px] font-mono tabular-nums tracking-[0.14em] text-[#6F757F]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="mt-8 min-w-0">
                  <h3 className="text-xl font-display font-semibold leading-tight tracking-[-0.04em] text-white sm:text-[1.35rem]">
                    {v.title}
                  </h3>
                  <p className="mt-3 text-sm font-light leading-[1.8] text-[#8A909D]">
                    {v.desc}
                  </p>
                </div>

                <span
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-brand-red/0 transition-colors duration-300 group-hover:bg-brand-red/60"
                  aria-hidden="true"
                />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Journey */}
      <section className="relative z-10 overflow-hidden border-b border-[#262930] bg-[#0B0C0E] px-4 py-16 sm:px-6 sm:py-24 md:px-12">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-40 top-20 h-80 w-80 rounded-full border border-white/[0.025]" />
          <div className="absolute right-[-6rem] bottom-[-8rem] h-96 w-96 rounded-full border border-brand-red/[0.03]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl sm:mb-14 md:mb-16">
            <span className="kapi-section-label mb-5">
              {language === 'id' ? 'Sejarah Agensi' : 'Agency History'}
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-12% 0px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 max-w-3xl text-3xl font-display font-semibold leading-[1.02] tracking-[-0.06em] text-white sm:text-4xl md:text-5xl lg:text-[4rem]"
            >
              {language === 'id' ? 'Perjalanan pertumbuhan kami yang berkelanjutan.' : 'Our journey of continuous growth.'}
            </motion.h2>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {journey.map((item, index) => (
              <motion.article
                key={item.year}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className="group relative flex min-w-0 min-h-[220px] flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111216] p-6 transition-[border-color,transform,background-color] duration-300 hover:border-brand-red/30 hover:bg-[#141519] sm:min-h-[250px] sm:p-7 lg:p-8"
              >
                <span
                  className="absolute inset-y-0 left-0 w-px bg-brand-red/0 transition-colors duration-300 group-hover:bg-brand-red/60"
                  aria-hidden="true"
                />
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-2xl font-display font-semibold tracking-[-0.05em] text-brand-red font-mono sm:text-[1.7rem]">
                      {item.year}
                    </span>
                    <span className="text-[10px] font-mono tabular-nums tracking-[0.14em] text-[#6F757F]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="mt-8 min-w-0">
                    <h3 className="text-lg font-display font-semibold leading-tight tracking-[-0.035em] text-white sm:text-xl">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm font-light leading-[1.8] text-[#8A909D]">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <span
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-brand-red/0 transition-colors duration-300 group-hover:bg-brand-red/60"
                  aria-hidden="true"
                />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Redesigned Technology Stack Grid */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-[#0B0C0E] border-b border-[#262930] relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-10 sm:mb-16">
            <span className="text-brand-red font-mono font-semibold tracking-widest uppercase text-xs mb-2 sm:mb-3 block">
              {t('about.tools.tag')}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold tracking-tight mb-3 text-white">
              {t('about.tools.title')}
            </h2>
            <p className="text-xs sm:text-sm text-[#8A909D] font-light leading-relaxed">
              {t('about.tools.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {techStack.map((stack) => (
              <motion.div
                key={stack.category}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.5, delay: techStack.indexOf(stack) * 0.07, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#16181D] border border-[#262930] hover:border-brand-red/50 hover:bg-[#1B1F26] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5 sm:mb-6">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {stack.icon}
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#0B0C0E] text-[#E50914] border border-[#262930]">
                      {stack.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-display font-bold text-white mb-1 group-hover:text-brand-red transition-colors">
                    {stack.category}
                  </h3>
                  <p className="text-xs text-[#8A909D] font-light mb-5 sm:mb-6">
                    {stack.subtitle}
                  </p>

                  <div className="space-y-2 sm:space-y-2.5 pt-4 border-t border-[#262930]">
                    {stack.tools.map((tool) => (
                      <div 
                        key={tool.name} 
                        className="flex items-center justify-between p-2 rounded-xl bg-[#0B0C0E] border border-[#262930] hover:border-brand-red/30 transition-colors"
                      >
                        <span className="text-xs font-medium text-white">{tool.name}</span>
                        <span className="text-[9px] sm:text-[10px] font-mono text-[#8A909D] uppercase">{tool.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 text-center relative z-10 bg-[#0B0C0E]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold mb-4 sm:mb-6 text-white">
            {language === 'id' ? 'Siap berkolaborasi membangun produk digital Anda berikutnya?' : 'Ready to collaborate on your next digital product?'}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#8A909D] font-light leading-relaxed mb-6 sm:mb-8 max-w-xl mx-auto">
            {language === 'id'
              ? 'Hubungi tim Kapitech Agency di Tangerang Selatan untuk mendiskusikan kebutuhan proyek, estimasi waktu, dan rincian biaya.'
              : 'Get in touch with Kapitech Agency in South Tangerang to discuss your project requirements, timeline, and estimation.'}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 rounded-full bg-brand-red hover:bg-[#FF1E27] text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-brand-red/20 active:scale-95"
          >
            <span>{language === 'id' ? 'Mulai Diskusi' : 'Start a Conversation'}</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};
