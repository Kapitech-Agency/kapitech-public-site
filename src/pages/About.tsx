import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, CheckCircle2, Globe, Cpu, Layout, Code2, Palette, Shield, Zap, Sparkles, Building2, MapPin, Users, Award, Terminal, Cloud, Layers, Check, Database, Server } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { GlassPanel, Reveal, SectionHeader } from '../components/ui/PublicUI';
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
      desc: "Built on modern frameworks like React, Next.js, and TypeScript, our web and mobile architectures emphasize high speed, robust security, and maintainability."
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
      desc: "Dibangun di atas framework terdepan seperti React, Next.js, dan TypeScript, arsitektur web dan mobile kami menekankan kecepatan tinggi, keamanan teruji, dan kemudahan pemeliharaan."
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
      desc: "Expanded into full-stack web application development, SaaS platform engineering, and custom mobile application interfaces." 
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
      desc: "Memperluas kapabilitas ke pengembangan aplikasi web full-stack, rekayasa platform SaaS, dan antarmuka aplikasi mobile kustom." 
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
    <div className="kapi-page kapi-about">
      <section className="kapi-page-hero">
        <div className="kapi-container">
          <Reveal>
            <span className="kapi-eyebrow">{t('about.tag')}</span>
            <h1>
              {language === 'id'
                ? <>Agensi digital untuk <span className="text-brand-red">kejelasan dan pertumbuhan.</span></>
                : <>A digital agency engineered for <span className="text-brand-red">clarity and growth.</span></>}
            </h1>
            <p>{t('about.subtitle')}</p>
          </Reveal>
        </div>
      </section>

      <section className="kapi-section">
        <div className="kapi-container grid lg:grid-cols-[1.05fr_.95fr] gap-10 lg:gap-16 items-center">
          <Reveal>
            <span className="kapi-eyebrow">{language === 'id' ? 'Identity & foundations' : 'Identity & foundations'}</span>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl leading-[.98] tracking-[-.05em]">
              {language === 'id' ? 'Menjembatani desain strategis dengan engineering yang dapat diandalkan.' : 'Bridging strategic design with dependable engineering.'}
            </h2>
            <div className="mt-6 grid gap-4 text-sm leading-7 text-white/50">
              <p>{language === 'id'
                ? 'Kapitech Agency beroperasi di bawah PT Kapitech Digital Indonesia, berbasis di Tangerang Selatan dan bekerja sebagai tim kolaboratif yang terdistribusi.'
                : 'Kapitech Agency operates under PT Kapitech Digital Indonesia, based in South Tangerang with a collaborative distributed team.'}</p>
              <p>{language === 'id'
                ? 'Kami fokus pada kode yang bersih, pengalaman pengguna yang mudah dipahami, dan delivery yang dapat dipertanggungjawabkan.'
                : 'We focus on clean code, understandable user experiences, and accountable delivery.'}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-white/[0.08]">
              <div><span className="kapi-stat-value">50+</span><span className="kapi-stat-label">{t('about.stats.projects')}</span></div>
              <div><span className="kapi-stat-value">3+</span><span className="kapi-stat-label">{t('about.stats.experience')}</span></div>
              <div><span className="kapi-stat-value">100%</span><span className="kapi-stat-label">{t('about.stats.craft')}</span></div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="kapi-media aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
                alt="Kapitech Agency team collaboration"
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-transparent to-transparent" />
              <div className="absolute left-5 right-5 bottom-5">
                <span className="kapi-eyebrow">Kapitech Agency</span>
                <div className="mt-2 font-display text-xl sm:text-2xl tracking-[-.04em]">{language === 'id' ? 'Kualitas, transparansi, dan delivery yang dapat diandalkan.' : 'Quality, transparency, and dependable delivery.'}</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="kapi-section">
        <div className="kapi-container">
          <SectionHeader eyebrow={t('about.leadership.tag')} title={t('about.leadership.title')} description={t('about.leadership.subtitle')} />
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {team.map((member, index) => (
              <Reveal key={member.name} delay={Math.min(index,4) * 0.04}>
                <GlassPanel className="overflow-hidden kapi-panel--interactive h-full p-0">
                  <div className="aspect-[4/4.5] bg-[#0d0f13] overflow-hidden">
                    <img src={member.image} alt={member.name} referrerPolicy="no-referrer" className="w-full h-full object-contain object-top" />
                  </div>
                  <div className="p-4">
                    <div className="font-display font-semibold text-sm">{member.name}</div>
                    <div className="mt-1 text-[9px] font-mono uppercase tracking-[.1em] text-brand-red">{member.role}</div>
                    <p className="mt-3 text-[11px] leading-5 text-white/42">{member.bio}</p>
                  </div>
                </GlassPanel>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="kapi-section">
        <div className="kapi-container">
          <SectionHeader
            eyebrow={language === 'id' ? 'Working principles' : 'Working principles'}
            title={language === 'id' ? 'Standar yang kami bawa ke setiap project.' : 'The standards we bring to every project.'}
          />
          <div className="kapi-grid-3">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.05}>
                <GlassPanel className="p-6 sm:p-7 min-h-[250px] kapi-panel--interactive">
                  <div className="w-11 h-11 rounded-[14px] bg-brand-red/10 border border-brand-red/20 text-brand-red grid place-items-center">{value.icon}</div>
                  <h3 className="mt-6 font-display text-xl tracking-[-.03em]">{value.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/45">{value.desc}</p>
                </GlassPanel>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="kapi-section">
        <div className="kapi-container">
          <SectionHeader eyebrow={language === 'id' ? 'Agency history' : 'Agency history'} title={language === 'id' ? 'Dibangun dan berkembang sejak 2021.' : 'Built and growing since 2021.'} />
          <div className="kapi-grid-4">
            {journey.map((item, index) => (
              <Reveal key={item.year} delay={index * 0.04}>
                <GlassPanel className="p-6 min-h-[210px] kapi-panel--interactive">
                  <span className="font-display text-3xl text-brand-red">{item.year}</span>
                  <h3 className="mt-8 font-display text-xl tracking-[-.03em]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/43">{item.desc}</p>
                </GlassPanel>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="kapi-section">
        <div className="kapi-container">
          <SectionHeader eyebrow={t('about.tools.tag')} title={t('about.tools.title')} description={t('about.tools.subtitle')} />
          <div className="kapi-grid-4">
            {techStack.map((stack, index) => (
              <Reveal key={stack.category} delay={index * 0.035}>
                <GlassPanel className="p-5 kapi-panel--interactive h-full">
                  <div className="flex items-center justify-between gap-4">
                    <div className="w-11 h-11 rounded-[14px] border border-brand-red/20 bg-brand-red/10 text-brand-red grid place-items-center">{stack.icon}</div>
                    <span className="kapi-chip">{stack.badge}</span>
                  </div>
                  <h3 className="mt-6 font-display text-xl tracking-[-.03em]">{stack.category}</h3>
                  <p className="mt-2 text-xs leading-6 text-white/42">{stack.subtitle}</p>
                  <div className="mt-5 pt-4 border-t border-white/[0.08] grid gap-2">
                    {stack.tools.map(tool => (
                      <div key={tool.name} className="flex items-center justify-between gap-3 py-1.5 text-xs">
                        <span>{tool.name}</span><span className="font-mono text-[9px] text-white/28 uppercase">{tool.level}</span>
                      </div>
                    ))}
                  </div>
                </GlassPanel>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="kapi-section">
        <div className="kapi-container">
          <Reveal>
            <div className="kapi-cta-band">
              <div>
                <span className="kapi-eyebrow">{language === 'id' ? 'Collaborate' : 'Collaborate'}</span>
                <h2>{language === 'id' ? 'Siap membangun produk digital berikutnya?' : 'Ready to build the next digital product?'}</h2>
                <p>{language === 'id' ? 'Hubungi tim Kapitech untuk membahas kebutuhan, timeline, dan scope.' : 'Talk to Kapitech about your scope, timeline, and delivery needs.'}</p>
              </div>
              <div className="flex justify-start lg:justify-end">
                <Link to="/contact" className="kapi-button kapi-button--primary">Start a conversation <ArrowUpRight size={15} /></Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
