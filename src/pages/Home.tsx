import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, X } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { fetchServerCmsProjects, getCmsProjects } from '../lib/cmsStore';
import type { ProjectItem } from '../data/projectsData';
import { GlassButton, GlassPanel, ImageReveal, Reveal, SectionHeader } from '../components/ui/PublicUI';
import { Testimonials } from '../components/Testimonials';

const capabilities = {
  creative: [
    'Video Production & Creative Content',
    'Graphic Design',
    'Key Visual',
    'Motion Design',
    '2D Animation',
    'UI/UX',
    'Branding & Identity',
    'Digital Ads',
    'Product Photography',
    'Social Media Specialist',
  ],
  technology: [
    'Custom Website Development',
    'Company Profile Website',
    'E-Commerce Website',
    'Brochure Site',
    'Custom Web Application',
    'Data Analysis',
    'IT Support & Maintenance',
  ],
};

const process = [
  ['01', 'Understand', 'Align the business goal, audience, scope, and success criteria.'],
  ['02', 'Shape', 'Turn the brief into a clear visual and product direction.'],
  ['03', 'Build', 'Design, develop, produce, test, and refine with direct communication.'],
  ['04', 'Launch', 'Ship the work, document it, and stay available after release.'],
];

export const Home = () => {
  const { language } = useLanguage();
  const [projects, setProjects] = useState<ProjectItem[]>(() => getCmsProjects());
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    const update = () => setProjects(getCmsProjects());
    window.addEventListener('kapitech_cms_updated', update);
    void fetchServerCmsProjects().then(() => setProjects(getCmsProjects()));
    return () => window.removeEventListener('kapitech_cms_updated', update);
  }, []);

  const featured = useMemo(() => projects.filter(item => item.featured).slice(0, 5), [projects]);
  const lead = featured[0];

  return (
    <div className="kapi-page kapi-home">
      <section className="kapi-editorial-hero">
        <div className="kapi-container kapi-editorial-hero-grid">
          <div className="kapi-editorial-hero-copy">
            <Reveal y={12}>
              <span className="kapi-eyebrow">Creative & IT Development Agency</span>
            </Reveal>

            <Reveal delay={0.06} y={18}>
              <h1>
                {language === 'id'
                  ? <>Kami membuat <span>brand, digital products,</span> dan pengalaman yang membantu bisnis bergerak.</>
                  : <>We create <span>brands, digital products,</span> and experiences that move businesses forward.</>}
              </h1>
            </Reveal>

            <Reveal delay={0.12} y={14}>
              <p>
                {language === 'id'
                  ? 'Kapitech menggabungkan creative direction, design, engineering, dan production dalam satu tim yang bekerja langsung bersama Anda.'
                  : 'Kapitech brings creative direction, design, engineering, and production into one team working directly with you.'}
              </p>
            </Reveal>

            <Reveal delay={0.18} y={10}>
              <div className="kapi-editorial-hero-actions">
                <GlassButton to="/work">
                  {language === 'id' ? 'Lihat karya' : 'See the work'}
                </GlassButton>
                <Link to="/contact" className="kapi-editorial-text-link">
                  {language === 'id' ? 'Mulai proyek' : 'Start a project'}
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.24} y={8}>
              <div className="kapi-editorial-hero-meta">
                <span>South Tangerang</span>
                <span>Est. 2021</span>
                <span>Creative + Technology</span>
              </div>
            </Reveal>
          </div>

          {lead && (
            <Reveal delay={0.1} y={20} className="kapi-editorial-hero-media-wrap">
              <button
                type="button"
                className="kapi-editorial-hero-media"
                onClick={() => setSelectedProject(lead)}
                aria-label="Open featured project"
              >
                <img src={lead.image} alt={lead.title} />
                <span className="kapi-editorial-hero-media-label">
                  <span>{lead.service}</span>
                  <span>{lead.year}</span>
                </span>
              </button>
            </Reveal>
          )}
        </div>
      </section>

      <section className="kapi-section kapi-home-work">
        <div className="kapi-container">
          <SectionHeader
            eyebrow={language === 'id' ? 'Selected work' : 'Selected work'}
            title={language === 'id' ? 'Lihat apa yang Kapitech buat.' : 'See what Kapitech makes.'}
            description={language === 'id'
              ? 'Portfolio menjadi bukti utama kemampuan kami. Setiap project menampilkan jenis pekerjaan, craft, dan detail yang kami kerjakan.'
              : 'The portfolio is the clearest proof of our capability. Each project shows the type of work, craft, and detail behind the delivery.'}
          />

          <div className="kapi-home-featured-grid">
            {featured.slice(0, 4).map((project, index) => (
              <Reveal
                key={project.id}
                delay={Math.min(index, 3) * 0.05}
                className={'kapi-home-featured-item kapi-home-featured-item--' + (index + 1)}
              >
                <button type="button" className="kapi-home-featured-project" onClick={() => setSelectedProject(project)}>
                  <ImageReveal
                    src={project.image}
                    alt={project.title}
                    className="kapi-home-featured-media"
                    imgClassName="w-full h-full"
                  />
                  <div className="kapi-home-featured-info">
                    <div className="kapi-project-meta">
                      <span className="text-brand-red">{project.service}</span>
                      <span>•</span>
                      <span>{project.year}</span>
                    </div>
                    <div className="kapi-project-title">{project.title}</div>
                    <p>{language === 'id' ? project.descId : project.desc}</p>
                    <span className="kapi-project-arrow">
                      {language === 'id' ? 'Lihat project' : 'View project'}
                      <ArrowUpRight size={13} />
                    </span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>

          <Reveal className="kapi-editorial-section-link">
            <Link to="/work" className="kapi-editorial-text-link">
              {language === 'id' ? 'Lihat semua project' : 'Browse all projects'}
              <ArrowUpRight size={15} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="kapi-section kapi-home-capabilities">
        <div className="kapi-container">
          <div className="kapi-editorial-split-heading">
            <div>
              <span className="kapi-eyebrow">{language === 'id' ? 'Capabilities' : 'Capabilities'}</span>
              <h2>{language === 'id' ? 'Tunjukkan pekerjaan, bukan daftar panjang.' : 'Show the work, not a long service list.'}</h2>
            </div>
            <p>
              {language === 'id'
                ? 'Kami menghubungkan creative dan technology agar brand, content, website, dan product terasa datang dari tim yang sama.'
                : 'We connect creative and technology so brand, content, websites, and products feel like parts of one system.'}
            </p>
          </div>

          <div className="kapi-capability-board">
            <div className="kapi-capability-column">
              <div className="kapi-capability-heading">
                <span>01</span>
                <h3>Creative</h3>
              </div>
              <div className="kapi-capability-list">
                {capabilities.creative.map((item, index) => (
                  <div key={item} className="kapi-capability-row">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{item}</strong>
                    <ArrowUpRight size={14} />
                  </div>
                ))}
              </div>
            </div>

            <div className="kapi-capability-column">
              <div className="kapi-capability-heading">
                <span>02</span>
                <h3>Technology</h3>
              </div>
              <div className="kapi-capability-list">
                {capabilities.technology.map((item, index) => (
                  <div key={item} className="kapi-capability-row">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{item}</strong>
                    <ArrowUpRight size={14} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="kapi-section kapi-home-process">
        <div className="kapi-container">
          <SectionHeader
            eyebrow={language === 'id' ? 'How we work' : 'How we work'}
            title={language === 'id' ? 'Langsung, terarah, dan mudah diikuti.' : 'Direct, focused, and easy to follow.'}
          />
          <div className="kapi-process">
            {process.map(([number, title, copy], index) => (
              <Reveal key={number} delay={index * 0.045}>
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

      <section className="kapi-section kapi-home-final">
        <div className="kapi-container">
          <div className="kapi-editorial-final">
            <span className="kapi-eyebrow">{language === 'id' ? 'Start a project' : 'Start a project'}</span>
            <h2>{language === 'id' ? 'Punya brief. Mari ubah jadi sesuatu yang siap dilihat, dipakai, dan dirasakan.' : 'Have a brief. Let’s turn it into something people can see, use, and remember.'}</h2>
            <Link to="/contact" className="kapi-button kapi-button--primary">
              {language === 'id' ? 'Hubungi Kapitech' : 'Talk to Kapitech'}
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <div className="kapi-modal-backdrop" onMouseDown={() => setSelectedProject(null)}>
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
                <div className="flex flex-wrap gap-4">
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
