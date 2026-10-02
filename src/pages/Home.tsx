import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import { ArrowUpRight, ChevronLeft, ChevronRight, Code2, Layers, Palette, Sparkles, X } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { fetchServerCmsProjects, getCmsProjects } from '../lib/cmsStore';
import type { ProjectItem } from '../data/projectsData';
import PatternWaves from '../components/ui/PatternWaves';
import { EASE, GlassButton, GlassPanel, ImageReveal, Reveal, SectionHeader, TextReveal } from '../components/ui/PublicUI';
import { AnimatedNumber, ParallaxMedia, SplitWords, useMotion } from '../components/motion/MotionSystem';
import { Testimonials } from '../components/Testimonials';

const pillars = [
  {
    number: '01',
    label: 'Identity',
    title: 'Brand identity & systems',
    icon: Sparkles,
    description: 'Build clear positioning, cohesive visual systems, and a brand language that scales across every touchpoint.',
    tags: ['Pitch Deck', 'Brand Identity', 'Logo Design', 'Rebranding'],
  },
  {
    number: '02',
    label: 'Experience',
    title: 'UI/UX & product design',
    icon: Layers,
    description: 'Design intuitive digital experiences, prototypes, and reusable systems that keep product teams moving.',
    tags: ['UI/UX Design', 'Web & Mobile', 'Redesign', 'UX Audit'],
  },
  {
    number: '03',
    label: 'Engineering',
    title: 'Full-stack development',
    icon: Code2,
    description: 'Develop high-performance websites and web applications with dependable architecture and clean delivery.',
    tags: ['Web Development', 'MVP Build', 'Landing Pages', 'Enterprise'],
  },
];

const process = [
  ['01', 'Discovery & scope', 'We align business goals, audience needs, requirements, and the practical scope of delivery.'],
  ['02', 'UI/UX & prototyping', 'We map user flows and create interactive design directions for review before implementation.'],
  ['03', 'Agile development', 'We build in clear milestones with structured feedback, QA, and production-ready handoff.'],
  ['04', 'Testing & launch', 'We test across devices, deploy the product, and stay available for post-launch maintenance.'],
];

export const Home = () => {
  const { language } = useLanguage();
  const [projects, setProjects] = useState<ProjectItem[]>(() => getCmsProjects());
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const { reducedMotion } = useMotion();

  useEffect(() => {
    const update = () => setProjects(getCmsProjects());
    window.addEventListener('kapitech_cms_updated', update);
    void fetchServerCmsProjects().then(() => setProjects(getCmsProjects()));
    return () => window.removeEventListener('kapitech_cms_updated', update);
  }, []);

  const featured = useMemo(() => projects.filter(item => item.featured).slice(0, 4), [projects]);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    if (!hero || reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      const words = hero.querySelectorAll<HTMLElement>('.kapi-word-inner');
      const intro = hero.querySelector<HTMLElement>('[data-hero-intro]');
      const copy = hero.querySelector<HTMLElement>('[data-hero-copy]');
      const actions = hero.querySelector<HTMLElement>('[data-hero-actions]');
      const meta = hero.querySelector<HTMLElement>('[data-hero-meta]');
      const visual = hero.querySelector<HTMLElement>('[data-hero-visual]');
      const center = hero.querySelector<HTMLElement>('.kapi-hero-center');
      const rings = hero.querySelectorAll<HTMLElement>('.kapi-hero-ring, .kapi-hero-orbit');

      const introTimeline = gsap.timeline({ defaults: { ease: 'power4.out' } });
      introTimeline
        .fromTo(intro, { autoAlpha: 0, y: 18, letterSpacing: '0.24em' }, { autoAlpha: 1, y: 0, letterSpacing: '0.18em', duration: 0.55 })
        .fromTo(words, { yPercent: 120, rotateX: -28, autoAlpha: 0 }, { yPercent: 0, rotateX: 0, autoAlpha: 1, duration: 1.08, stagger: 0.045, ease: 'expo.out' }, '-=0.15')
        .fromTo(copy, { autoAlpha: 0, y: 28, clipPath: 'inset(0 0 100% 0)' }, { autoAlpha: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.82 }, '-=0.52')
        .fromTo(actions, { autoAlpha: 0, y: 24, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.3)' }, '-=0.38')
        .fromTo(meta, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.58 }, '-=0.26')
        .fromTo(visual, { autoAlpha: 0, clipPath: 'inset(12% 12% 12% 12% round 32px)', scale: 1.08, y: 44 }, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0% round 32px)', scale: 1, y: 0, duration: 1.35, ease: 'expo.out' }, 0.42)
        .fromTo(center, { scale: 0.86, rotate: -8 }, { scale: 1, rotate: 0, duration: 1.2, ease: 'back.out(1.2)' }, 0.55)
        .fromTo(rings, { autoAlpha: 0, scale: 0.82 }, { autoAlpha: 1, scale: 1, duration: 1.4, stagger: 0.08, ease: 'expo.out' }, 0.65);

      const scrub = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: '+=88%',
          scrub: 1.1,
        },
      });

      scrub
        .to(words, { yPercent: -28, rotateX: 7, stagger: 0.012, ease: 'none' }, 0)
        .to(copy, { yPercent: -18, autoAlpha: 0.38, ease: 'none' }, 0.04)
        .to(actions, { yPercent: -10, autoAlpha: 0.22, scale: 0.96, ease: 'none' }, 0.04)
        .to(meta, { yPercent: -4, autoAlpha: 0, ease: 'none' }, 0.08)
        .to(visual, { yPercent: 18, scale: 0.88, rotateY: -5, rotateX: 3, ease: 'none' }, 0)
        .to(center, { rotate: 9, scale: 0.9, ease: 'none' }, 0)
        .to(rings, { rotation: 26, scale: 1.08, ease: 'none', stagger: 0.02 }, 0);

      gsap.to(hero.querySelector('.kapi-hero-grid'), {
        backgroundPosition: '36px 36px',
        duration: 7,
        repeat: -1,
        ease: 'none',
      });
    }, heroRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div className="kapi-page kapi-home">
      <section ref={heroRef} className="relative overflow-hidden min-h-[760px] sm:min-h-[860px] flex items-center border-b border-white/[0.08] kapi-hero-scene" data-motion-section>
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true" data-hero-bg>
          <PatternWaves
            preset="silk"
            color="#e63946"
            backgroundColor="transparent"
            fade="edges"
            opacity={0.24}
            interactive
            cursorSize={48}
            cursorStrength={0.35}
            speed={0.2}
            depth={0.55}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(230,57,70,.16),transparent_32rem),linear-gradient(180deg,#08090b_0%,rgba(8,9,11,.45)_52%,#08090b_100%)]" />
        </div>

        <div className="kapi-container relative z-10 grid grid-cols-1 lg:grid-cols-[1.05fr_.95fr] gap-14 lg:gap-8 items-center pt-28 pb-16">
          <div>
            <Reveal>
              <span className="kapi-eyebrow">
                {language === 'id' ? 'Creative & IT Development Agency' : 'Creative & IT Development Agency'}
              </span>
            </Reveal>

            <div className="mt-5 kapi-hero-title-mask" style={{ perspective: '900px' }}>
              <h1 className="font-display text-[clamp(3.2rem,7.5vw,7rem)] leading-[.9] tracking-[-.065em] font-semibold max-w-[900px]">
                {language === 'id' ? (
                  <>
                    <SplitWords text="Studio digital untuk membangun dan memperluas bisnis Anda." highlight={['membangun', 'memperluas']} />
                  </>
                ) : (
                  <SplitWords text="A digital studio built to build and scale your business." highlight={['build', 'scale']} />
                )}
              </h1>
            </div>

            <Reveal delay={0.18}>
              <p className="mt-6 max-w-[660px] text-base sm:text-lg leading-8 text-white/58">
                {language === 'id'
                  ? 'Kami merancang dan mengembangkan website, web application, visual systems, dan digital experiences untuk bisnis yang ingin bergerak lebih cepat.'
                  : 'We design and develop websites, web applications, visual systems, and digital experiences for businesses ready to move forward with clarity.'}
              </p>
            </Reveal>

            <Reveal delay={0.28}>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <GlassButton to="/contact">
                  {language === 'id' ? 'Mulai proyek' : 'Start a project'}
                </GlassButton>
                <GlassButton to="/work" variant="secondary">
                  {language === 'id' ? 'Lihat portfolio' : 'Explore work'}
                </GlassButton>
              </div>
            </Reveal>

            <Reveal delay={0.36}>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] font-mono uppercase tracking-[.16em] text-white/34">
                <span>South Tangerang</span>
                <span className="hidden sm:inline h-1 w-1 rounded-full bg-brand-red" />
                <span>Est. 2021</span>
                <span className="hidden sm:inline h-1 w-1 rounded-full bg-brand-red" />
                <span>Digital products & creative systems</span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="hidden lg:block">
            <ParallaxMedia strength={5} className="kapi-hero-visual-wrap" ><div className="kapi-hero-visual" data-hero-visual>
              <div className="kapi-hero-ring" />
              <div className="kapi-hero-orbit" />
              <div className="kapi-hero-center">
                <div className="kapi-hero-grid" />
                <div className="kapi-hero-mark">
                  <img
                    src="https://raw.githubusercontent.com/Kapitech-Agency/Kapitech-Agency.github.io/main/public/white.png"
                    alt=""
                    className="w-12 h-auto"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="kapi-section">
        <div className="kapi-container">
          <Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 border-y border-white/[0.08]">
              <div className="kapi-stat border-r border-white/[0.08] p-5 sm:p-7">
                <span className="kapi-surface-number">01</span>
                <AnimatedNumber value={3} suffix="+" className="kapi-stat-value" />
                <span className="kapi-stat-label">{language === 'id' ? 'Years in industry' : 'Years in industry'}</span>
              </div>
              <div className="kapi-stat border-r border-white/[0.08] p-5 sm:p-7">
                <span className="kapi-surface-number">02</span>
                <AnimatedNumber value={50} suffix="+" className="kapi-stat-value" />
                <span className="kapi-stat-label">{language === 'id' ? 'Completed projects' : 'Completed projects'}</span>
              </div>
              <div className="kapi-stat border-r border-white/[0.08] p-5 sm:p-7">
                <span className="kapi-surface-number">03</span>
                <span className="kapi-stat-value">SME</span>
                <span className="kapi-stat-label">{language === 'id' ? '& enterprise' : '& enterprise'}</span>
              </div>
              <div className="kapi-stat p-5 sm:p-7">
                <span className="kapi-surface-number">04</span>
                <span className="kapi-stat-value">E2E</span>
                <span className="kapi-stat-label">{language === 'id' ? 'Strategy • Design • Code' : 'Strategy • Design • Code'}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="kapi-section pt-16 sm:pt-20">
        <div className="kapi-container">
          <SectionHeader
            eyebrow={language === 'id' ? 'Solutions & core capabilities' : 'Solutions & core capabilities'}
            title={language === 'id' ? 'Kejelasan visual. Produk yang bekerja.' : 'Clear visual direction. Products that work.'}
            description={language === 'id'
              ? 'Kami menggabungkan creative direction, product design, dan engineering dalam satu alur kerja yang terukur.'
              : 'We combine creative direction, product design, and engineering in one focused delivery workflow.'}
          />

          <div className="kapi-grid-3">
            {pillars.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.number} delay={index * 0.06}>
                  <GlassPanel className="kapi-service-card kapi-panel--interactive h-full">
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-11 h-11 rounded-[14px] border border-brand-red/20 bg-brand-red/10 flex items-center justify-center text-brand-red">
                        <Icon size={20} />
                      </div>
                      <span className="kapi-surface-number">{item.number}</span>
                    </div>
                    <div>
                      <span className="kapi-eyebrow mb-3">{item.label}</span>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                    <div className="kapi-service-links">
                      {item.tags.map(tag => <span className="kapi-chip" key={tag}>{tag}</span>)}
                    </div>
                  </GlassPanel>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.18} className="mt-7">
            <GlassPanel className="p-5 sm:p-7">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-7">
                <div>
                  <span className="kapi-eyebrow">{language === 'id' ? 'Strategic solutions' : 'Strategic solutions'}</span>
                  <h3 className="mt-3 font-display text-2xl sm:text-3xl tracking-[-.04em]">
                    {language === 'id' ? 'MVP, redesign, dan team extension.' : 'MVP, redesign, and team extension.'}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/48">
                    {language === 'id'
                      ? 'Pilih model engagement yang paling sesuai dengan tahap bisnis dan kebutuhan delivery Anda.'
                      : 'Choose an engagement model that fits your stage, delivery needs, and internal team.'}
                  </p>
                </div>
                <GlassButton to="/services" variant="secondary">
                  {language === 'id' ? 'Lihat semua solusi' : 'Explore all solutions'}
                </GlassButton>
              </div>
            </GlassPanel>
          </Reveal>
        </div>
      </section>

      <section className="kapi-section">
        <div className="kapi-container">
          <SectionHeader
            eyebrow={language === 'id' ? 'Selected work' : 'Selected work'}
            title={language === 'id' ? 'Karya nyata. Dampak nyata.' : 'Real work. Real impact.'}
            description={language === 'id'
              ? 'Beberapa proyek pilihan dari portfolio Kapitech.'
              : 'A selection of projects from the Kapitech portfolio.'}
          />

          <div className="kapi-project-grid">
            {featured.map((project, index) => (
              <Reveal key={project.id} delay={index * 0.05} className={`kapi-project-card ${index === 2 ? 'kapi-project-card--wide' : ''}`}>
                <button type="button" onClick={() => setSelectedProject(project)} className="text-left w-full">
                  <ImageReveal
                    src={project.image}
                    alt={project.title}
                    className="kapi-project-media"
                    imgClassName="w-full h-full"
                  />
                  <div className="kapi-project-body">
                    <div className="kapi-project-meta">
                      <span className="text-brand-red">{project.service}</span>
                      <span>•</span>
                      <span>{project.year}</span>
                      <span>•</span>
                      <span>{project.client}</span>
                    </div>
                    <div className="kapi-project-title">{project.title}</div>
                    <p className="kapi-project-copy">
                      {language === 'id' ? project.descId : project.desc}
                    </p>
                    <span className="kapi-project-arrow">Inspect case study <ArrowUpRight size={13} /></span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-9 flex justify-end">
            <GlassButton to="/work" variant="secondary">
              {language === 'id' ? 'Lihat semua portfolio' : 'View all case studies'}
            </GlassButton>
          </Reveal>
        </div>
      </section>

      <section className="kapi-section">
        <div className="kapi-container">
          <SectionHeader
            eyebrow={language === 'id' ? 'Our working framework' : 'Our working framework'}
            title={language === 'id' ? 'Terstruktur tanpa terasa kaku.' : 'Structured without feeling rigid.'}
          />
          <div className="kapi-process">
            {process.map(([number, title, copy], index) => (
              <Reveal key={number} delay={index * 0.05}>
                <GlassPanel className="kapi-process-item kapi-panel--interactive h-full">
                  <span className="kapi-process-index">{number}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </GlassPanel>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      <section className="kapi-section">
        <div className="kapi-container">
          <Reveal>
            <div className="kapi-cta-band">
              <div>
                <span className="kapi-eyebrow">{language === 'id' ? 'Mulai proyek baru' : 'Start a new project'}</span>
                <h2>{language === 'id' ? 'Mari buat sesuatu yang benar-benar berguna.' : 'Let’s build something that matters.'}</h2>
                <p>{language === 'id'
                  ? 'Ceritakan kebutuhan Anda. Kami akan bantu menerjemahkannya menjadi scope, desain, dan delivery plan yang jelas.'
                  : 'Tell us what you need. We will help turn it into a clear scope, design direction, and delivery plan.'}</p>
              </div>
              <div className="flex justify-start lg:justify-end">
                <GlassButton to="/contact">
                  {language === 'id' ? 'Hubungi Kapitech' : 'Contact Kapitech'}
                </GlassButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <div className="kapi-modal-backdrop" onMouseDown={() => setSelectedProject(null)}>
            <motion.div
              className="kapi-modal"
              onMouseDown={event => event.stopPropagation()}
              initial={{ opacity: 0, y: 22, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.99 }}
              transition={{ duration: 0.34, ease: EASE }}
            >
              <div className="kapi-modal-header">
                <div className="min-w-0">
                  <div className="kapi-project-meta">
                    <span className="text-brand-red">{selectedProject.service}</span>
                    <span>•</span>
                    <span>{selectedProject.year}</span>
                  </div>
                  <h3 className="mt-1 font-display text-xl sm:text-2xl tracking-[-.04em] truncate">{selectedProject.title}</h3>
                </div>
                <button className="kapi-close" type="button" onClick={() => setSelectedProject(null)} aria-label="Close case study">
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 sm:p-7 grid gap-7">
                <ImageReveal src={selectedProject.image} alt={selectedProject.title} className="aspect-[16/9]" imgClassName="w-full h-full" />
                <div className="grid md:grid-cols-3 gap-3">
                  {selectedProject.impact.map(metric => (
                    <GlassPanel key={metric.label} className="p-4">
                      <span className="block font-display text-2xl tracking-[-.04em]">{metric.value}</span>
                      <span className="block mt-1 text-[10px] uppercase tracking-[.12em] font-mono text-white/35">{metric.label}</span>
                    </GlassPanel>
                  ))}
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <span className="kapi-eyebrow">Challenge</span>
                    <p className="mt-3 text-sm leading-7 text-white/56">{language === 'id' ? selectedProject.challengeId : selectedProject.challenge}</p>
                  </div>
                  <div>
                    <span className="kapi-eyebrow">Solution</span>
                    <p className="mt-3 text-sm leading-7 text-white/56">{language === 'id' ? selectedProject.solutionId : selectedProject.solution}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map(tool => <span key={tool} className="kapi-chip">{tool}</span>)}
                </div>
                <div className="flex justify-end">
                  <GlassButton to="/contact">{language === 'id' ? 'Diskusikan proyek serupa' : 'Discuss a similar project'}</GlassButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
