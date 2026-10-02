import React, { useEffect, useState } from 'react';
import PatternWaves from '../components/ui/PatternWaves/PatternWavesTyped';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, 
  ChevronRight, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles, 
  Layers, 
  Cpu, 
  Code2, 
  Palette, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  HelpCircle, 
  ChevronDown, 
  ExternalLink,
  Briefcase,
  Star
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { fetchServerCmsProjects, fetchServerCmsServices, getCmsProjects, getCmsServices } from '../lib/cmsStore';
import { getServiceBySlug } from '../data/servicesData';

export const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [cmsServices, setCmsServices] = useState(() => getCmsServices());
  const [cmsProjects, setCmsProjects] = useState(() => getCmsProjects());

  useEffect(() => {
    const handleUpdate = () => {
      setCmsServices(getCmsServices());
      setCmsProjects(getCmsProjects());
    };

    window.addEventListener('kapitech_cms_updated', handleUpdate);
    void Promise.all([
      fetchServerCmsServices(),
      fetchServerCmsProjects()
    ]).then(() => {
      setCmsServices(getCmsServices());
      setCmsProjects(getCmsProjects());
    });

    return () => window.removeEventListener('kapitech_cms_updated', handleUpdate);
  }, []);

  const staticService = slug ? getServiceBySlug(slug) : undefined;
  const service = slug
    ? cmsServices.find((item) => item.slug === slug) || staticService
    : undefined;

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  // Find related case studies from allProjects
  const relatedCaseStudySlugs = Array.isArray(service.caseStudySlugs) ? service.caseStudySlugs : [];
  const relatedProjects = cmsProjects.filter(p =>
    relatedCaseStudySlugs.includes(p.id) ||
    p.pillar.toLowerCase().includes(service.category.toLowerCase()) ||
    p.service.toLowerCase().includes(service.category.toLowerCase()) ||
    p.title.toLowerCase().includes(service.title.toLowerCase())
  ).slice(0, 3);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="kapi-service-page relative min-h-screen bg-white/[0.012] text-white selection:bg-brand-red selection:text-white pt-28 pb-28 overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <PatternWaves
          preset="terminal"
          color="#E50914"
          backgroundColor="#0B0C0E"
          opacity={0.1}
          fade="edges"
          fadeSize={0.86}
          interactive
          cursorSize={46}
          cursorStrength={0.28}
          speed={0.17}
          scale={1.05}
          depth={0.62}
          shine={0.42}
          contrast={1.02}
          intro
        />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/78 to-transparent" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BREADCRUMB & BACK NAVIGATION */}
        <div className="flex items-center gap-3 text-xs sm:text-sm text-[#8A909D] mb-8 sm:mb-12">
          <Link 
            to="/services" 
            className="inline-flex items-center gap-1.5 text-[#8A909D] hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'id' ? 'Semua Solusi & Layanan' : 'All Solutions & Services'}</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#8A909D]" />
          <span className="kapi-section-label mb-0">
            {service.category}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-[#8A909D]" />
          <span className="text-white font-medium truncate max-w-[200px] sm:max-w-none">
            {service.title}
          </span>
        </div>

        {/* HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-20 lg:mb-28"
        >
          <div className="lg:col-span-8">
            
            {/* Category / Badge */}
            <span className="kapi-section-label mb-6">
              {language === 'id' ? service.badgeId : service.badge}
            </span>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display tracking-tight text-white leading-[1.1] mb-6">
              {language === 'id' ? service.heroHeadlineId : service.heroHeadline}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-[#8A909D] font-light leading-relaxed max-w-3xl mb-10">
              {language === 'id' ? service.heroSubtitleId : service.heroSubtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to={`/contact?service=${encodeURIComponent(service.title)}`}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-brand-red text-white font-semibold text-sm hover:bg-white hover:text-black transition-all duration-300 shadow-[0_12px_28px_-18px_rgba(229,9,20,0.48)] group"
              >
                <span>{language === 'id' ? 'Mulai Proyek Ini' : 'Start This Project'}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <a
                href="#case-studies"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/[0.08] bg-white/[0.018] text-white font-medium text-sm hover:border-brand-red/30 hover:bg-white/[0.03] transition-[background-color,border-color,color] duration-200"
              >
                <span>{language === 'id' ? 'Lihat Studi Kasus' : 'View Case Studies'}</span>
                <ChevronDown className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* METRICS SIDEBAR */}
          <div className="lg:col-span-4 w-full">
            <motion.div
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl border border-white/[0.08] bg-white/[0.018] backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.025),0_22px_60px_-42px_rgba(229,9,20,0.22)]"
            >
              <div className="text-xs font-mono uppercase tracking-widest text-[#8A909D] flex items-center justify-between">
                <span>{language === 'id' ? 'METRIK KINERJA' : 'PERFORMANCE METRICS'}</span>
                <Sparkles className="w-4 h-4 text-brand-red" />
              </div>
              <div className="space-y-6 divide-y divide-white/[0.07]">
                {service.metrics.map((metric, idx) => (
                  <div key={idx} className={idx > 0 ? 'pt-6' : ''}>
                    <div className="text-3xl sm:text-4xl font-display text-white tracking-tight">
                      {metric.value}
                    </div>
                    <div className="text-xs sm:text-sm text-[#8A909D] mt-1">
                      {language === 'id' ? metric.labelId : metric.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tools Stack */}
              <div className="pt-6 border-t border-white/[0.07]">
                <div className="text-xs font-mono uppercase tracking-wider text-[#8A909D] mb-3">
                  {language === 'id' ? 'TOOLCHAIN & STANDAR' : 'TOOLCHAIN & STACK'}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {service.tools.map((tool, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/[0.018] border border-white/[0.08] text-[#8A909D]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* TESTIMONIAL PULL QUOTE */}
        {service.testimonial && (
          <div className="mb-20 sm:mb-28">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-12% 0px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-3xl border border-white/[0.08] bg-white/[0.018] p-8 sm:p-12 backdrop-blur-xl overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center gap-1.5 text-brand-red mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl sm:text-2xl lg:text-3xl font-display text-white leading-relaxed mb-8">
                &ldquo;{language === 'id' ? service.testimonial.quoteId : service.testimonial.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-4">
                <img
                  src={service.testimonial.avatar}
                  alt={service.testimonial.author}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border border-white/[0.07]"
                />
                <div>
                  <div className="text-base font-semibold text-white">
                    {service.testimonial.author}
                  </div>
                  <div className="text-xs sm:text-sm text-[#8A909D]">
                    {service.testimonial.role} &bull; <span className="text-white">{service.testimonial.company}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* PROBLEM VS. SOLUTION MATRIX */}
        <div className="mb-20 sm:mb-28">
          <div className="max-w-3xl mb-12">
            <span className="kapi-section-label mb-5">
              {language === 'id' ? 'Tantangan & Solusi' : 'Challenge & Solution'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-display text-white tracking-tight">
              {language === 'id' ? 'Menghadapi hambatan umum produk digital?' : 'Facing common digital bottlenecks?'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {service.problemsSolutions.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.5, delay: idx * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl border border-white/[0.08] bg-white/[0.018] p-6 sm:p-8 flex flex-col justify-between hover:border-brand-red/25 hover:bg-white/[0.024] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] transition-[background-color,border-color,box-shadow] duration-300"
              >
                <div>
                  {/* Problem Block */}
                  <div className="mb-6 pb-6 border-b border-white/[0.07]">
                    <div className="text-xs font-mono uppercase tracking-wider text-brand-red mb-2 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />
                      <span>{language === 'id' ? 'Tantangan' : 'The Problem'}</span>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">
                      {language === 'id' ? item.problemTitleId : item.problemTitle}
                    </h3>
                    <p className="text-sm text-[#8A909D] leading-relaxed">
                      {language === 'id' ? item.problemDescId : item.problemDesc}
                    </p>
                  </div>

                  {/* Solution Block */}
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-brand-red mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-red" />
                      <span>{language === 'id' ? 'Solusi Kapitech' : 'Kapitech Solution'}</span>
                    </div>
                    <h4 className="text-base font-semibold text-white mb-2">
                      {language === 'id' ? item.solutionTitleId : item.solutionTitle}
                    </h4>
                    <p className="text-sm text-[#8A909D] leading-relaxed">
                      {language === 'id' ? item.solutionDescId : item.solutionDesc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CORE CAPABILITIES & SPECIALIZATIONS */}
        <div className="mb-20 sm:mb-28">
          <div className="max-w-3xl mb-12">
            <span className="kapi-section-label mb-5">
              {language === 'id' ? 'Kapabilitas Utama' : 'Core Capabilities'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-display text-white tracking-tight">
              {language === 'id' ? 'Apa yang kami kerjakan untuk Anda' : 'What we deliver for your business'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.capabilities.map((cap, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl border border-white/[0.08] bg-white/[0.018] p-6 hover:border-brand-red/25 hover:bg-white/[0.024] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] transition-[background-color,border-color,box-shadow] duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.012] border border-white/[0.07] flex items-center justify-center text-white mb-4 group-hover:border-brand-red/40 group-hover:text-brand-red transition-colors">
                  <Layers className="w-5 h-5 text-brand-red" />
                </div>
                <h3 className="text-base font-medium text-white mb-2">
                  {language === 'id' ? cap.titleId : cap.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#8A909D] leading-relaxed">
                  {language === 'id' ? cap.descId : cap.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CASE STUDIES SHOWCASE */}
        <div id="case-studies" className="mb-20 sm:mb-28 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <span className="kapi-section-label mb-5">
                {language === 'id' ? 'Bukti Nyata' : 'Proven Case Studies'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-display text-white tracking-tight">
                {language === 'id' ? 'Proyek terkait yang telah kami rilis' : 'Related work we have shipped'}
              </h2>
            </div>
            <Link
              to="/work"
              className="inline-flex items-center gap-2 text-sm text-[#8A909D] hover:text-white font-medium transition-colors"
            >
              <span>{language === 'id' ? 'Lihat Semua Proyek' : 'View All Projects'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {relatedProjects.map((project) => (
              <motion.div
                key={project.id}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="group rounded-3xl border border-white/[0.08] bg-white/[0.018] overflow-hidden hover:border-brand-red/25 hover:bg-white/[0.024] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] transition-[background-color,border-color,box-shadow] duration-300"
              >
                <Link
                  to="/work"
                  data-cursor-label="Open"
                  className="block"
                >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0B0C0E]">
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-black/80 backdrop-blur-md border border-white/[0.07] text-white">
                      {project.service}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-lg font-display font-medium text-white group-hover:text-brand-red transition-colors truncate">
                      {project.title}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-[#8A909D] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                  </div>
                  <p className="text-xs sm:text-sm text-[#8A909D] line-clamp-2 leading-relaxed mb-4">
                    {language === 'id' ? project.descId : project.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 2).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.012] border border-white/[0.07] text-[#8A909D]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* PROCESS & METHODOLOGY (01, 02, 03, 04) */}
        <div className="mb-20 sm:mb-28">
          <div className="max-w-3xl mb-12">
            <span className="kapi-section-label mb-5">
              {language === 'id' ? 'Metodologi Kerja' : 'Process & Methodology'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-display text-white tracking-tight">
              {language === 'id' ? 'Tahapan pelaksanaan terstruktur' : 'How we execute from day one'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.processStages.map((stage, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl border border-white/[0.08] bg-white/[0.018] p-6 flex flex-col justify-between hover:border-brand-red/25 hover:bg-white/[0.024] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] transition-[background-color,border-color,box-shadow] duration-300"
              >
                <div>
                  <div className="text-3xl font-display text-[#8A909D] font-light mb-4">
                    {stage.stageNumber}
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    {language === 'id' ? stage.stageNameId : stage.stageName}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8A909D] leading-relaxed mb-6">
                    {language === 'id' ? stage.stageDescId : stage.stageDesc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.07] space-y-1.5">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#8A909D] mb-2">
                    {language === 'id' ? 'Hasil Kerja:' : 'Deliverables:'}
                  </div>
                  {(language === 'id' ? stage.deliverablesId : stage.deliverables).map((del, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2 text-xs text-white/80">
                      <span className="w-1 h-1 rounded-full bg-brand-red shrink-0" />
                      <span className="truncate">{del}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* BUSINESS OUTCOMES & DISCOVERY CALL BANNER */}
        <div className="mb-20 sm:mb-28">
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.018] p-8 sm:p-12 lg:p-16 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className="kapi-section-label mb-5">
                  {language === 'id' ? 'Nilai Tambah Bisnis' : 'Tangible ROI'}
                </span>
                <h2 className="text-2xl sm:text-4xl font-display text-white tracking-tight">
                  {language === 'id' ? service.businessOutcomes.headingId : service.businessOutcomes.heading}
                </h2>
                <div className="space-y-3.5 pt-2">
                  {(language === 'id' ? service.businessOutcomes.benefitsId : service.businessOutcomes.benefits).map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base text-[#8A909D] leading-relaxed">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 w-full">
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.012] p-6 sm:p-8 space-y-5 text-center">
                  <div className="w-12 h-12 rounded-full bg-brand-red/10 border border-brand-red/30 flex items-center justify-center text-brand-red mx-auto">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-display text-white">
                    {language === 'id' ? 'Siap mendiskusikan kebutuhan Anda?' : 'Ready to discuss your project?'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8A909D] leading-relaxed">
                    {language === 'id' 
                      ? 'Jadwalkan sesi konsultasi gratis 30 menit bersama tim arsitek produk kami.' 
                      : 'Schedule a free 30-minute discovery call with our senior product architects.'}
                  </p>
                  <Link
                    to={`/contact?service=${encodeURIComponent(service.title)}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-brand-red text-white font-semibold text-sm hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(255,26,26,0.3)]"
                  >
                    <span>{language === 'id' ? 'Mulai Proyek Sekarang' : 'Start a Project Now'}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <div className="text-xs text-[#8A909D] font-mono">
                    hello@kapitech.co.id &bull; Response within 24 business hours
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FREQUENTLY ASKED QUESTIONS */}
        {service.faqs && service.faqs.length > 0 && (
          <div className="mb-20 sm:mb-28 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="kapi-section-label mb-5">
                {language === 'id' ? 'Pertanyaan Umum' : 'Frequently Asked Questions'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-display text-white tracking-tight">
                {language === 'id' ? 'Hal yang sering ditanyakan' : 'Everything you need to know'}
              </h2>
            </div>

            <div className="space-y-4">
              {service.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-3xl border border-white/[0.08] bg-white/[0.018] overflow-hidden backdrop-blur-xl transition-[border-color,background-color] duration-300"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-6 text-left flex items-center justify-between gap-4 text-white font-medium hover:text-brand-red transition-colors"
                    >
                      <span className="text-base sm:text-lg">
                        {language === 'id' ? faq.qId : faq.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 shrink-0 text-[#8A909D] transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-white' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <div className="px-6 pb-6 text-sm text-[#8A909D] leading-relaxed border-t border-white/[0.07] pt-4">
                            {language === 'id' ? faq.aId : faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* BOTTOM GLOBAL NAVIGATION STRIP (Browse other services) */}
        <div className="pt-12 mt-8 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm text-[#8A909D] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'id' ? 'Kembali ke Semua Layanan' : 'Back to All Services'}</span>
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-red text-white text-sm font-medium hover:bg-brand-red/90 transition-[background-color,color,box-shadow] shadow-[0_12px_28px_-18px_rgba(229,9,20,0.48)]"
          >
            <span>{language === 'id' ? 'Konsultasi Gratis' : 'Book a Discovery Call'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};
