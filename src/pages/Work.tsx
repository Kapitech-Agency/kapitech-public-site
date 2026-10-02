import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import Fuse from 'fuse.js';
import { useLanguage } from '../lib/LanguageContext';
import { fetchServerCmsProjects, getCmsProjects } from '../lib/cmsStore';
import type { ProjectItem } from '../data/projectsData';
import PatternWaves from '../components/ui/PatternWaves';
import { EASE, GlassButton, GlassPanel, ImageReveal, PageHero, Reveal, SectionHeader } from '../components/ui/PublicUI';

const pillars = ['All', 'Visual Experience', 'Innovation Development'];

export const Work = () => {
  const { language } = useLanguage();
  const [projects, setProjects] = useState<ProjectItem[]>(() => getCmsProjects());
  const [pillar, setPillar] = useState('All');
  const [service, setService] = useState('All');
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [selected, setSelected] = useState<ProjectItem | null>(null);
  const serviceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => setProjects(getCmsProjects());
    window.addEventListener('kapitech_cms_updated', update);
    void fetchServerCmsProjects().then(() => setProjects(getCmsProjects()));
    return () => window.removeEventListener('kapitech_cms_updated', update);
  }, []);

  const featured = useMemo(() => projects.filter(item => item.featured), [projects]);

  useEffect(() => {
    if (featured.length <= 1) return;
    const timer = window.setInterval(() => setFeaturedIndex(prev => (prev + 1) % featured.length), 6800);
    return () => window.clearInterval(timer);
  }, [featured.length]);

  const services = useMemo(() => {
    const source = pillar === 'All' ? projects : projects.filter(item => item.pillar === pillar);
    return ['All', ...Array.from(new Set(source.map(item => item.service)))];
  }, [projects, pillar]);

  const filtered = useMemo(() => {
    let list = projects;
    if (pillar !== 'All') list = list.filter(item => item.pillar === pillar);
    if (service !== 'All') list = list.filter(item => item.service === service);
    if (query.trim()) {
      const fuse = new Fuse(list, {
        keys: ['title', 'client', 'industry', 'service', 'pillar', 'desc', 'descId', 'technologies'],
        threshold: 0.33,
      });
      list = fuse.search(query).map(result => result.item);
    }
    return list;
  }, [projects, pillar, service, query]);

  const currentFeatured = featured[featuredIndex];

  return (
    <div className="kapi-page kapi-work">
      <PageHero
        eyebrow={language === 'id' ? 'Portfolio & case studies' : 'Portfolio & case studies'}
        title={language === 'id' ? <>Karya yang dibuat untuk <span className="text-brand-red">hasil nyata.</span></> : <>Crafted for <span className="text-brand-red">real impact.</span></>}
        description={language === 'id'
          ? 'Jelajahi project pilihan Kapitech across UI/UX, creative production, branding, dan web engineering.'
          : 'Explore selected Kapitech projects across UI/UX, creative production, branding, and web engineering.'}
      >
        <div className="mt-8 flex flex-wrap gap-2">
          <span className="kapi-chip kapi-chip--accent">{projects.length} Case Studies</span>
          <span className="kapi-chip">12 Core Disciplines</span>
          <span className="kapi-chip">Indonesia & Global</span>
        </div>
      </PageHero>

      {currentFeatured && (
        <section className="kapi-section pt-12 sm:pt-16">
          <div className="kapi-container">
            <Reveal>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <span className="kapi-eyebrow">Featured case study</span>
                  <div className="mt-2 text-xs font-mono text-white/32">{featuredIndex + 1} / {featured.length}</div>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="kapi-close" onClick={() => setFeaturedIndex(prev => (prev - 1 + featured.length) % featured.length)} aria-label="Previous featured project"><ChevronLeft size={17} /></button>
                  <button type="button" className="kapi-close" onClick={() => setFeaturedIndex(prev => (prev + 1) % featured.length)} aria-label="Next featured project"><ChevronRight size={17} /></button>
                </div>
              </div>

              <button type="button" className="w-full text-left" onClick={() => setSelected(currentFeatured)}>
                <GlassPanel className="overflow-hidden p-0">
                  <div className="grid lg:grid-cols-[1.35fr_.65fr]">
                    <ImageReveal src={currentFeatured.image} alt={currentFeatured.title} className="min-h-[320px] lg:min-h-[520px] rounded-none border-0" imgClassName="w-full h-full" />
                    <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <span className="kapi-chip kapi-chip--accent">{currentFeatured.service}</span>
                          <span className="kapi-chip">{currentFeatured.year}</span>
                        </div>
                        <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl leading-[.96] tracking-[-.05em]">{currentFeatured.title}</h2>
                        <p className="mt-4 text-sm leading-7 text-white/46">{language === 'id' ? currentFeatured.descId : currentFeatured.desc}</p>
                      </div>
                      <div className="pt-7 mt-7 border-t border-white/[0.08]">
                        <div className="grid grid-cols-3 gap-3">
                          {currentFeatured.impact.map(item => (
                            <div key={item.label}>
                              <span className="font-display text-2xl tracking-[-.04em] block">{item.value}</span>
                              <span className="mt-1 block text-[9px] font-mono uppercase tracking-[.1em] text-white/30">{item.label}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-7 kapi-project-arrow">Inspect case study <ArrowUpRight size={13} /></div>
                      </div>
                    </div>
                  </div>
                </GlassPanel>
              </button>
            </Reveal>
          </div>
        </section>
      )}

      <div className="kapi-filter-bar">
        <div className="kapi-container">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="kapi-filter-inner flex-1" ref={serviceRef}>
              {pillars.map(item => (
                <button key={item} type="button" className={`kapi-filter-button ${pillar === item ? 'is-active' : ''}`} onClick={() => { setPillar(item); setService('All'); setVisibleCount(12); }}>
                  {item}
                </button>
              ))}
            </div>
            <div className="w-full lg:w-auto">
              <input className="kapi-search" value={query} onChange={event => { setQuery(event.target.value); setVisibleCount(12); }} placeholder={language === 'id' ? 'Cari project, client, service...' : 'Search project, client, service...'} />
            </div>
          </div>
          <div className="kapi-filter-inner mt-2" ref={serviceRef}>
            {services.map(item => (
              <button key={item} type="button" className={`kapi-filter-button ${service === item ? 'is-active' : ''}`} onClick={() => { setService(item); setVisibleCount(12); }}>
                {item === 'All' ? (language === 'id' ? 'Semua layanan' : 'All services') : item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="kapi-section pt-12 sm:pt-16">
        <div className="kapi-container">
          <div className="flex items-end justify-between gap-4 mb-8">
            <SectionHeader eyebrow={language === 'id' ? 'All case studies' : 'All case studies'} title={language === 'id' ? 'Pilih project untuk melihat detail.' : 'Choose a project to inspect the detail.'} />
            <span className="hidden sm:block text-[10px] font-mono uppercase tracking-[.14em] text-white/25">{Math.min(visibleCount, filtered.length)} / {filtered.length}</span>
          </div>

          {filtered.length ? (
            <>
              <div className="kapi-project-grid">
                {filtered.slice(0, visibleCount).map((project, index) => (
                  <Reveal key={project.id} delay={Math.min(index, 7) * 0.035} className="kapi-project-card">
                    <button type="button" className="w-full text-left" onClick={() => setSelected(project)}>
                      <ImageReveal src={project.image} alt={project.title} className="kapi-project-media" imgClassName="w-full h-full" />
                      <div className="kapi-project-body">
                        <div className="kapi-project-meta">
                          <span className="text-brand-red">{project.service}</span>
                          <span>•</span>
                          <span>{project.year}</span>
                          <span>•</span>
                          <span>{project.client}</span>
                        </div>
                        <div className="kapi-project-title">{project.title}</div>
                        <p className="kapi-project-copy">{language === 'id' ? project.descId : project.desc}</p>
                        <span className="kapi-project-arrow">Inspect <ArrowUpRight size={13} /></span>
                      </div>
                    </button>
                  </Reveal>
                ))}
              </div>

              {visibleCount < filtered.length && (
                <div className="flex justify-center mt-10">
                  <button
                    type="button"
                    onClick={() => setVisibleCount(prev => prev + 12)}
                    className="kapi-button kapi-button--secondary"
                  >
                    {language === 'id' ? 'Muat lebih banyak' : 'Load more'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <GlassPanel className="py-20 text-center">
              <div className="font-display text-2xl">{language === 'id' ? 'Project tidak ditemukan.' : 'No case studies found.'}</div>
              <p className="mt-3 text-sm text-white/45">{language === 'id' ? 'Coba ubah kata pencarian atau reset filter.' : 'Try a different search or reset the filters.'}</p>
              <button type="button" className="kapi-button kapi-button--secondary mt-7" onClick={() => { setPillar('All'); setService('All'); setQuery(''); setVisibleCount(12); }}>Reset</button>
            </GlassPanel>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <div className="kapi-modal-backdrop" onMouseDown={() => setSelected(null)}>
            <motion.div
              className="kapi-modal"
              onMouseDown={event => event.stopPropagation()}
              initial={{ opacity: 0, y: 22, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.32, ease: EASE }}
            >
              <div className="kapi-modal-header">
                <div className="min-w-0">
                  <div className="kapi-project-meta">
                    <span className="text-brand-red">{selected.service}</span>
                    <span>•</span>
                    <span>{selected.year}</span>
                  </div>
                  <h3 className="mt-1 font-display text-xl sm:text-2xl tracking-[-.04em] truncate">{selected.title}</h3>
                </div>
                <button type="button" className="kapi-close" onClick={() => setSelected(null)} aria-label="Close case study"><X size={18} /></button>
              </div>

              <div className="p-5 sm:p-7 grid gap-7">
                <ImageReveal src={selected.image} alt={selected.title} className="aspect-[16/8.5]" imgClassName="w-full h-full" />
                <div className="grid md:grid-cols-3 gap-3">
                  {selected.impact.map(item => <GlassPanel key={item.label} className="p-4"><span className="font-display text-2xl">{item.value}</span><span className="block mt-1 text-[9px] font-mono uppercase tracking-[.1em] text-white/30">{item.label}</span></GlassPanel>)}
                </div>
                <div className="grid md:grid-cols-2 gap-7">
                  <div><span className="kapi-eyebrow">Challenge</span><p className="mt-3 text-sm leading-7 text-white/48">{language === 'id' ? selected.challengeId : selected.challenge}</p></div>
                  <div><span className="kapi-eyebrow">Solution</span><p className="mt-3 text-sm leading-7 text-white/48">{language === 'id' ? selected.solutionId : selected.solution}</p></div>
                </div>
                <div className="flex flex-wrap gap-2">{selected.technologies.map(item => <span className="kapi-chip" key={item}>{item}</span>)}</div>
                <div className="flex justify-end"><GlassButton to="/contact">{language === 'id' ? 'Mulai proyek serupa' : 'Start a similar project'}</GlassButton></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
