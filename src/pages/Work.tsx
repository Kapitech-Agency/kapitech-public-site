import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import Fuse from 'fuse.js';
import { useLanguage } from '../lib/LanguageContext';
import { fetchServerCmsProjects, getCmsProjects } from '../lib/cmsStore';
import type { ProjectItem } from '../data/projectsData';
import { GlassButton, GlassPanel, ImageReveal, PageHero, Reveal, SectionHeader } from '../components/ui/PublicUI';

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

  useEffect(() => {
    const update = () => setProjects(getCmsProjects());
    window.addEventListener('kapitech_cms_updated', update);
    void fetchServerCmsProjects().then(() => setProjects(getCmsProjects()));
    return () => window.removeEventListener('kapitech_cms_updated', update);
  }, []);

  const featured = useMemo(() => projects.filter(item => item.featured), [projects]);

  useEffect(() => {
    if (featured.length <= 1) return;
    const timer = window.setInterval(() => setFeaturedIndex(prev => (prev + 1) % featured.length), 7200);
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
        title={language === 'id'
          ? <>Kerja yang dibuat untuk <span className="text-brand-red">dilihat dan dirasakan.</span></>
          : <>Work made to be <span className="text-brand-red">seen and felt.</span></>}
        description={language === 'id'
          ? 'Jelajahi project Kapitech dalam branding, content, motion, UI/UX, dan web development.'
          : 'Explore Kapitech projects across branding, content, motion, UI/UX, and web development.'}
      />

      {currentFeatured && (
        <section className="kapi-section kapi-work-featured-section">
          <div className="kapi-container">
            <div className="kapi-work-featured-head">
              <div>
                <span className="kapi-eyebrow">Featured work</span>
                <span className="kapi-work-counter">{featuredIndex + 1} / {featured.length}</span>
              </div>
              <div className="flex gap-2">
                <button type="button" className="kapi-close" onClick={() => setFeaturedIndex(prev => (prev - 1 + featured.length) % featured.length)} aria-label="Previous featured project"><ChevronLeft size={17} /></button>
                <button type="button" className="kapi-close" onClick={() => setFeaturedIndex(prev => (prev + 1) % featured.length)} aria-label="Next featured project"><ChevronRight size={17} /></button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeatured.id}
                className="kapi-work-featured-editorial"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
              >
                <button type="button" className="kapi-work-featured-media" onClick={() => setSelected(currentFeatured)}>
                  <ImageReveal src={currentFeatured.image} alt={currentFeatured.title} className="w-full h-full" imgClassName="w-full h-full" />
                </button>

                <div className="kapi-work-featured-copy">
                  <div className="kapi-project-meta">
                    <span className="text-brand-red">{currentFeatured.service}</span>
                    <span>•</span>
                    <span>{currentFeatured.year}</span>
                    <span>•</span>
                    <span>{currentFeatured.client}</span>
                  </div>
                  <h2>{currentFeatured.title}</h2>
                  <p>{language === 'id' ? currentFeatured.descId : currentFeatured.desc}</p>
                  <div className="kapi-work-featured-detail">
                    {currentFeatured.impact.slice(0, 3).map(item => (
                      <div key={item.label}>
                        <strong>{item.value}</strong>
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                  <button type="button" className="kapi-editorial-text-link" onClick={() => setSelected(currentFeatured)}>
                    {language === 'id' ? 'Lihat case study' : 'View case study'}
                    <ArrowUpRight size={15} />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      )}

      <section className="kapi-work-controls">
        <div className="kapi-container">
          <div className="kapi-work-controls-row">
            <div className="kapi-filter-inner">
              {pillars.map(item => (
                <button
                  key={item}
                  type="button"
                  className={'kapi-filter-button ' + (pillar === item ? 'is-active' : '')}
                  onClick={() => { setPillar(item); setService('All'); setVisibleCount(12); }}
                >
                  {item === 'All' ? (language === 'id' ? 'Semua' : 'All') : item}
                </button>
              ))}
            </div>

            <label className="kapi-work-search">
              <Search size={15} />
              <input
                value={query}
                onChange={event => { setQuery(event.target.value); setVisibleCount(12); }}
                placeholder={language === 'id' ? 'Cari project atau layanan' : 'Search project or service'}
              />
            </label>
          </div>

          <div className="kapi-filter-inner kapi-work-services">
            {services.map(item => (
              <button
                key={item}
                type="button"
                className={'kapi-filter-button ' + (service === item ? 'is-active' : '')}
                onClick={() => { setService(item); setVisibleCount(12); }}
              >
                {item === 'All' ? (language === 'id' ? 'Semua layanan' : 'All services') : item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="kapi-section kapi-work-library">
        <div className="kapi-container">
          <div className="kapi-work-library-head">
            <SectionHeader
              eyebrow={language === 'id' ? 'All work' : 'All work'}
              title={language === 'id' ? 'Pilih pekerjaan yang ingin Anda lihat lebih dekat.' : 'Choose the work you want to inspect more closely.'}
            />
            <span>{Math.min(visibleCount, filtered.length)} / {filtered.length}</span>
          </div>

          {filtered.length ? (
            <div className="kapi-work-grid">
              {filtered.slice(0, visibleCount).map((project, index) => (
                <Reveal
                  key={project.id}
                  delay={Math.min(index, 8) * 0.035}
                  className={'kapi-work-item kapi-work-item--' + ((index % 4) + 1)}
                >
                  <button type="button" className="kapi-work-card" onClick={() => setSelected(project)}>
                    <ImageReveal src={project.image} alt={project.title} className="kapi-work-card-media" imgClassName="w-full h-full" />
                    <div className="kapi-work-card-copy">
                      <div className="kapi-project-meta">
                        <span className="text-brand-red">{project.service}</span>
                        <span>•</span>
                        <span>{project.year}</span>
                      </div>
                      <h3>{project.title}</h3>
                      <p>{language === 'id' ? project.descId : project.desc}</p>
                      <span className="kapi-project-arrow">
                        Inspect
                        <ArrowUpRight size={13} />
                      </span>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          ) : (
            <GlassPanel className="kapi-work-empty">
              <div>
                <span className="kapi-eyebrow">No match</span>
                <h3>{language === 'id' ? 'Project tidak ditemukan.' : 'No case studies found.'}</h3>
                <p>{language === 'id' ? 'Coba ubah filter atau kata pencarian.' : 'Try a different filter or search term.'}</p>
              </div>
              <button
                type="button"
                className="kapi-editorial-text-link"
                onClick={() => { setPillar('All'); setService('All'); setQuery(''); setVisibleCount(12); }}
              >
                {language === 'id' ? 'Reset filter' : 'Reset filters'}
                <ArrowUpRight size={15} />
              </button>
            </GlassPanel>
          )}

          {visibleCount < filtered.length && (
            <div className="kapi-work-load-more">
              <button type="button" className="kapi-button kapi-button--secondary" onClick={() => setVisibleCount(prev => prev + 12)}>
                {language === 'id' ? 'Muat lebih banyak' : 'Load more'}
              </button>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <div className="kapi-modal-backdrop" onMouseDown={() => setSelected(null)}>
            <motion.div
              className="kapi-modal"
              onMouseDown={event => event.stopPropagation()}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
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
                  {selected.impact.map(item => (
                    <GlassPanel key={item.label} className="p-4">
                      <span className="font-display text-2xl">{item.value}</span>
                      <span className="block mt-1 text-[9px] font-mono uppercase tracking-[.1em] text-white/30">{item.label}</span>
                    </GlassPanel>
                  ))}
                </div>
                <div className="grid md:grid-cols-2 gap-7">
                  <div>
                    <span className="kapi-eyebrow">Challenge</span>
                    <p className="mt-3 text-sm leading-7 text-white/48">{language === 'id' ? selected.challengeId : selected.challenge}</p>
                  </div>
                  <div>
                    <span className="kapi-eyebrow">Solution</span>
                    <p className="mt-3 text-sm leading-7 text-white/48">{language === 'id' ? selected.solutionId : selected.solution}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  {selected.technologies.map(item => <span className="kapi-chip" key={item}>{item}</span>)}
                </div>
                <div className="flex justify-end">
                  <GlassButton to="/contact">{language === 'id' ? 'Mulai proyek serupa' : 'Start a similar project'}</GlassButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
