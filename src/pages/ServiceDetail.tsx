import React, { useEffect, useState } from 'react';
import PatternWaves from '../components/ui/PatternWaves/PatternWavesTyped';
import { useParams, useLocation, Link, Navigate } from 'react-router-dom';
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
  Star,
  Target
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { fetchServerCmsProjects, fetchServerCmsServices, getCmsProjects, getCmsServices } from '../lib/cmsStore';
import { allSolutionsAndServices, getServiceBySlug } from '../data/servicesData';
import { mergeServiceContent, serviceContentEnhancements } from '../data/serviceContentEnhancements';
import { cn } from '../lib/utils';

export const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { pathname } = useLocation();
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
  const isSolutionPage = staticService?.type === 'solution';

  if (staticService && pathname.startsWith('/solutions/') && !isSolutionPage) {
    return <Navigate to={'/services/' + staticService.slug} replace />;
  }

  if (staticService && pathname.startsWith('/services/') && isSolutionPage) {
    return <Navigate to={'/solutions/' + staticService.slug} replace />;
  }

  const baseService = slug
    ? cmsServices.find((item) => item.slug === slug) || staticService
    : undefined;
  const service = baseService
    ? mergeServiceContent(baseService, serviceContentEnhancements[baseService.slug])
    : undefined;

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const performanceMetrics = Array.isArray(service.metrics) ? service.metrics.slice(0, 3) : [];

  const identityFoundations = [
    {
      number: '01',
      label: language === 'id' ? 'Identitas' : 'Service Identity',
      title: service.badge,
      description: language === 'id' ? service.heroSubtitleId : service.heroSubtitle,
      icon: Sparkles,
    },
    {
      number: '02',
      label: language === 'id' ? 'Fondasi Strategis' : 'Strategic Foundation',
      title: service.capabilities?.[0]?.title || service.category,
      description: service.capabilities?.[0]
        ? (language === 'id' ? service.capabilities[0].descId : service.capabilities[0].desc)
        : (language === 'id' ? 'Arah kerja dibangun dari kebutuhan bisnis dan pengguna.' : 'The engagement is grounded in business and user needs.'),
      icon: Target,
    },
    {
      number: '03',
      label: language === 'id' ? 'Fondasi Delivery' : 'Delivery Foundation',
      title: service.processStages?.[0]?.stageName || (language === 'id' ? 'Discovery' : 'Discovery'),
      description: service.processStages?.[0]
        ? (language === 'id' ? service.processStages[0].stageDescId : service.processStages[0].stageDesc)
        : (language === 'id' ? 'Tahapan kerja terstruktur dari discovery sampai delivery.' : 'A structured workflow from discovery through delivery.'),
      icon: Layers,
    },
    {
      number: '04',
      label: language === 'id' ? 'Fondasi Teknis' : 'Technical Foundation',
      title: service.tools?.slice(0, 2).join(' · ') || 'Kapitech Toolkit',
      description: language === 'id'
        ? 'Toolchain dipilih berdasarkan kebutuhan proyek, kualitas output, dan kesiapan untuk handoff.'
        : 'The toolchain is selected around project needs, output quality, and production-ready handoff.',
      icon: ShieldCheck,
    },
  ];

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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        
        {/* BREADCRUMB & BACK NAVIGATION */}
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 text-xs sm:text-sm text-[#8A909D] mb-8 sm:mb-12">
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
          <span className="min-w-0 max-w-[11rem] sm:max-w-none text-white font-medium break-words sm:truncate">
            {service.title}
          </span>
        </div>


        {/* HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 sm:mb-16 lg:mb-20"
        >
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2.5 mb-6">
              <span className="kapi-section-label mb-0">
                {language === 'id' ? service.badgeId : service.badge}
              </span>
              {isSolutionPage && (
                <span className="rounded-full border border-white/[0.08] bg-white/[0.018] px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.14em] text-[#8A909D]">
                  {language === 'id' ? 'Solution' : 'Solution'}
                </span>
              )}
            </div>

            <h1 className="max-w-5xl text-3xl sm:text-5xl lg:text-[4.5rem] font-display font-semibold tracking-[-0.055em] text-white leading-[0.98] mb-6">
              {language === 'id' ? service.heroHeadlineId : service.heroHeadline}
            </h1>

            <p className="text-sm sm:text-lg lg:text-xl text-[#8A909D] font-light leading-[1.8] max-w-3xl mb-10">
              {language === 'id' ? service.heroSubtitleId : service.heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to={'/contact?service=' + encodeURIComponent(service.title)}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-brand-red text-white font-semibold text-sm hover:bg-[#FF1E27] hover:text-white transition-[background-color,color,box-shadow] duration-300 shadow-[0_12px_28px_-18px_rgba(229,9,20,0.48)] group"
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

            <div className="mt-8 grid max-w-4xl grid-cols-1 gap-2.5 sm:grid-cols-3">
              {[
                {
                  label: language === 'id' ? 'Kategori' : 'Category',
                  value: service.category
                },
                {
                  label: language === 'id' ? 'Cocok untuk' : 'Best for',
                  value: language === 'id' ? service.navSubtitleId : service.navSubtitle
                },
                {
                  label: language === 'id' ? 'Tahap awal' : 'Starting point',
                  value: language === 'id'
                    ? service.processStages?.[0]?.stageNameId || 'Discovery'
                    : service.processStages?.[0]?.stageName || 'Discovery'
                }
              ].map((item) => (
                <div
                  key={item.label}
                  className="min-w-0 rounded-2xl border border-white/[0.07] bg-white/[0.014] px-4 py-3.5"
                >
                  <span className="block text-[9px] font-mono uppercase tracking-[0.15em] text-[#6F757F]">
                    {item.label}
                  </span>
                  <span className="mt-1.5 block text-xs font-medium leading-[1.55] text-white">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* PERFORMANCE METRICS */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          aria-labelledby="performance-metrics-title"
          className="mb-20 sm:mb-24 lg:mb-28 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.018] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]"
        >
          <div className="flex flex-col gap-5 border-b border-white/[0.07] px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-brand-red">
                {language === 'id' ? 'Metrik Kinerja' : 'Performance Metrics'}
              </span>
              <h2 id="performance-metrics-title" className="mt-2 max-w-2xl text-xl font-display font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-2xl">
                {language === 'id' ? 'Indikator utama yang membantu menilai layanan ini.' : 'The key indicators that help frame this service.'}
              </h2>
            </div>
            <span className="shrink-0 text-[9px] font-mono uppercase tracking-[0.14em] text-[#555A63]">
              {language === 'id' ? 'Ringkasan layanan' : 'Service snapshot'}
            </span>
          </div>

          <div className="grid grid-cols-1 divide-y divide-white/[0.07] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {performanceMetrics.length > 0 ? (
              performanceMetrics.map((metric, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.12 + idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative min-h-[132px] p-5 transition-colors duration-300 hover:bg-white/[0.022] sm:min-h-[150px] sm:p-6 lg:p-7"
                >
                  <span className="pointer-events-none absolute inset-x-5 top-0 h-px origin-left scale-x-0 bg-brand-red/80 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 sm:inset-x-6 lg:inset-x-7" aria-hidden="true" />
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#555A63]">
                      {language === 'id' ? 'Indikator' : 'Indicator'}
                    </span>
                  </div>
                  <div className="mt-5">
                    <div className="break-words text-[2.35rem] font-display font-semibold leading-[0.92] tracking-[-0.055em] text-white transition-colors duration-300 group-hover:text-brand-red sm:text-[2.7rem]">
                      {metric.value}
                    </div>
                    <div className="mt-2.5 max-w-xs text-xs leading-[1.55] text-[#A7ACB5] sm:text-sm">
                      {language === 'id' ? metric.labelId : metric.label}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-5 text-xs leading-relaxed text-[#8A909D] sm:col-span-3 sm:p-6">
                {language === 'id' ? 'Metrik layanan belum tersedia.' : 'Service metrics are not available yet.'}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-white/[0.07] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span className="text-[9px] font-mono font-semibold uppercase tracking-[0.16em] text-[#555A63]">
              {language === 'id' ? 'Toolchain & Stack' : 'Toolchain & Stack'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {service.tools.map((tool, idx) => (
                <span
                  key={idx}
                  className="rounded-full border border-white/[0.07] bg-white/[0.018] px-2.5 py-1 text-[9px] font-mono text-[#8A909D] transition-colors duration-200 hover:border-white/[0.13] hover:text-white"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* OUR IDENTITY & FOUNDATIONS */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          aria-labelledby="identity-foundations-title"
          className="mb-20 sm:mb-24 lg:mb-28"
        >
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <div className="max-w-3xl">
              <span className="kapi-section-label mb-5">
                {language === 'id' ? 'Cara Kami Bekerja' : 'How We Work'}
              </span>
              <h2
                id="identity-foundations-title"
                className="mt-4 text-2xl font-display font-semibold leading-[1.03] tracking-[-0.045em] text-white sm:text-3xl lg:text-[2.75rem]"
              >
                {language === 'id'
                  ? 'Empat fondasi yang menjaga scope, keputusan, delivery, dan handoff tetap selaras.'
                  : 'Four foundations keep scope, decisions, delivery, and handoff aligned.'}
              </h2>
            </div>
            <p className="max-w-md text-xs leading-[1.8] text-[#8A909D] sm:text-sm lg:pb-1">
              {language === 'id'
                ? 'Lihat cara layanan ini dibentuk, dari arah strategis sampai toolchain yang dipakai untuk delivery.'
                : 'See how this service is shaped, from strategic direction to the toolchain used for delivery.'}
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0F1013]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-white/[0.07]">
              {identityFoundations.map((foundation) => {
                const Icon = foundation.icon;
                return (
                  <motion.article
                    key={foundation.number}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative min-h-[255px] border-b border-white/[0.07] p-5 transition-colors duration-300 hover:bg-white/[0.018] sm:p-6 lg:border-b-0 lg:p-7"
                  >
                    <span
                      className="pointer-events-none absolute inset-x-5 top-0 h-px origin-left scale-x-0 bg-brand-red transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 sm:inset-x-6 lg:inset-x-7"
                      aria-hidden="true"
                    />

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-[#0B0C0E] text-[#A7ACB5] transition-colors duration-300 group-hover:border-brand-red/30 group-hover:bg-brand-red/[0.08] group-hover:text-brand-red">
                        <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                      </div>
                      <span className="text-[9px] font-mono tabular-nums uppercase tracking-[0.18em] text-[#555A63] transition-colors duration-300 group-hover:text-brand-red">
                        {foundation.number}
                      </span>
                    </div>

                    <div className="mt-9">
                      <span className="text-[9px] font-mono font-semibold uppercase tracking-[0.16em] text-brand-red">
                        {foundation.label}
                      </span>
                      <h3 className="mt-3 text-base font-display font-semibold leading-[1.12] tracking-[-0.025em] text-white sm:text-lg">
                        {foundation.title}
                      </h3>
                      <p className="mt-3 text-xs leading-[1.75] text-[#8A909D]">
                        {foundation.description}
                      </p>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 border-t border-white/[0.07] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-7">
              <div className="flex items-center gap-2 text-[9px] font-mono font-semibold uppercase tracking-[0.16em] text-[#555A63]">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-red" aria-hidden="true" />
                <span>{language === 'id' ? 'Tool yang mendukung delivery' : 'Tools supporting delivery'}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(service.tools || []).slice(0, 5).map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-white/[0.07] bg-white/[0.018] px-2.5 py-1 text-[9px] font-mono text-[#8A909D] transition-colors duration-200 hover:border-white/[0.13] hover:text-white"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

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
                  loading="lazy"
                  decoding="async"
                  width="48"
                  height="48"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {service.problemsSolutions.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.5, delay: idx * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.018] p-6 sm:p-7 flex flex-col justify-between hover:border-brand-red/25 hover:bg-white/[0.024] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] transition-[background-color,border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5"
              >
                <span className="pointer-events-none absolute inset-x-6 top-0 h-px origin-left scale-x-0 bg-brand-red transition-transform duration-500 group-hover:scale-x-100" aria-hidden="true" />
                <div>
                  <div className="mb-5 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.16em] text-[#8A909D]/65">
                    <span>{language === 'id' ? 'Kasus' : 'Case'}</span>
                    <span>{String(idx + 1).padStart(2, '0')}</span>
                  </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {service.capabilities.map((cap, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.018] p-6 sm:p-7 hover:border-brand-red/25 hover:bg-white/[0.024] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] transition-[background-color,border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0F1013] border border-white/[0.07] flex items-center justify-center text-white mb-5 group-hover:border-brand-red/40 group-hover:text-brand-red transition-colors">
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
                {language === 'id' ? 'Contoh Pekerjaan' : 'Related Work'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-display text-white tracking-tight">
                {language === 'id' ? 'Contoh proyek yang relevan dengan layanan ini' : 'Selected work relevant to this service'}
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
                    loading="lazy"
                    decoding="async"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {service.processStages.map((stage, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.018] p-6 sm:p-7 flex flex-col justify-between hover:border-brand-red/25 hover:bg-white/[0.024] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] transition-[background-color,border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5"
              >
                <div>
                  <div className="text-3xl font-display text-brand-red/75 font-light mb-4">
                    {stage.stageNumber}
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    {language === 'id' ? stage.stageNameId : stage.stageName}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8A909D] leading-relaxed mb-6">
                    {language === 'id' ? stage.stageDescId : stage.stageDesc}
                  </p>
                </div>

                <div className="pt-5 border-t border-white/[0.07] space-y-1.5">
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
                  {language === 'id' ? 'Dampak untuk Bisnis' : 'Business Impact'}
                </span>
                <h2 className="text-2xl sm:text-4xl font-display text-white tracking-tight">
                  {language === 'id' ? 'Apa yang bisa dibuka oleh engagement ini' : 'What this engagement can unlock'}
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
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-brand-red text-white font-semibold text-sm hover:bg-[#FF1E27] hover:text-white transition-[background-color,color,box-shadow] duration-300 shadow-[0_0_20px_rgba(255,26,26,0.3)]"
                  >
                    <span>{language === 'id' ? 'Mulai Proyek Sekarang' : 'Start a Project Now'}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <div className="text-xs text-[#8A909D] font-mono">
                    hello@kapitech.id &bull; Response within 24 business hours
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
                      id={`service-faq-trigger-${idx}`}
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={isOpen}
                      aria-controls={`service-faq-panel-${idx}`}
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
                          id={`service-faq-panel-${idx}`}
                          role="region"
                          aria-labelledby={`service-faq-trigger-${idx}`}
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

        {/* BROWSE SERVICES */}
        <section className="mt-8 border-t border-white/[0.07] pt-14 sm:pt-20" aria-labelledby="browse-services-title">
          <div className="mb-9 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="kapi-section-label mb-5">
                {language === 'id' ? 'Jelajahi Layanan' : 'Browse Services'}
              </span>
              <h2
                id="browse-services-title"
                className="mt-4 text-2xl font-display font-semibold leading-[1.03] tracking-[-0.045em] text-white sm:text-3xl lg:text-[2.65rem]"
              >
                {language === 'id'
                  ? 'Pilih layanan yang paling dekat dengan kebutuhan Anda.'
                  : 'Choose the service that best matches your next move.'}
              </h2>
              <p className="mt-4 max-w-2xl text-sm font-light leading-[1.8] text-[#8A909D] sm:text-[15px]">
                {language === 'id'
                  ? 'Kami mengelompokkan layanan berdasarkan jenis pekerjaan agar Anda bisa membandingkan pilihan tanpa harus membaca semuanya sekaligus.'
                  : 'Services are grouped by work type so you can compare the right options without scanning one long list.'}
              </p>
            </div>

            <Link
              to="/services"
              className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/[0.08] bg-white/[0.018] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A7ACB5] transition-[border-color,background-color,color] duration-300 hover:border-white/[0.16] hover:bg-white/[0.028] hover:text-white lg:self-end"
            >
              <span>{language === 'id' ? 'Lihat Semua Layanan' : 'View All Services'}</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
            {(['Solutions', 'Branding', 'Design', 'Development'] as const).map((category) => {
              const items = allSolutionsAndServices.filter((item) => item.category === category);
              const categoryLabel =
                category === 'Solutions'
                  ? 'Strategic Solutions'
                  : category;
              const categoryKicker =
                category === 'Solutions'
                  ? (language === 'id' ? 'Strategic' : 'Strategic')
                  : category === 'Branding'
                    ? (language === 'id' ? 'Brand' : 'Brand')
                    : category === 'Design'
                      ? (language === 'id' ? 'Experience' : 'Experience')
                      : (language === 'id' ? 'Build' : 'Build');
              const categoryDescription =
                category === 'Solutions'
                  ? (language === 'id'
                      ? 'Arah strategis untuk keputusan produk, redesign, dan capacity building.'
                      : 'Strategic engagements for product direction, redesign, and delivery capacity.')
                  : category === 'Branding'
                    ? (language === 'id'
                        ? 'Identitas, presentasi, dan sistem visual yang membuat brand lebih konsisten.'
                        : 'Identity, presentations, and visual systems that make your brand more consistent.')
                    : category === 'Design'
                      ? (language === 'id'
                          ? 'Pengalaman digital, interface, dan struktur UX yang lebih jelas.'
                          : 'Digital experiences, interfaces, and UX structures built for clarity.')
                      : (language === 'id'
                          ? 'Website dan aplikasi yang siap dibangun, dirilis, dan dikembangkan.'
                          : 'Websites and applications built to ship, scale, and evolve.');

              return (
                <div
                  key={category}
                  className="group/category overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.014] backdrop-blur-xl transition-[border-color,background-color] duration-300 hover:border-white/[0.12] hover:bg-white/[0.018]"
                >
                  <div className="border-b border-white/[0.07] px-5 py-5 sm:px-6 sm:py-6">
                    <div className="flex items-start justify-between gap-5">
                      <div className="min-w-0">
                        <span className="text-[9px] font-mono font-semibold uppercase tracking-[0.16em] text-brand-red">
                          {categoryKicker}
                        </span>
                        <h3 className="mt-2 text-xl font-display font-semibold tracking-[-0.03em] text-white sm:text-[1.35rem]">
                          {categoryLabel}
                        </h3>
                        <p className="mt-2 max-w-md text-xs leading-[1.7] text-[#8A909D]">
                          {categoryDescription}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full border border-white/[0.07] bg-white/[0.018] px-2.5 py-1.5 text-[9px] font-mono tabular-nums uppercase tracking-[0.12em] text-[#6F757F]">
                        {String(items.length).padStart(2, '0')} {language === 'id' ? 'Layanan' : 'Services'}
                      </span>
                    </div>
                  </div>

                  <div className="px-2 py-2 sm:px-3 sm:py-3">
                    {items.map((item, index) => {
                      const isCurrent = item.slug === service.slug;
                      const isLast = index === items.length - 1;

                      return (
                        <Link
                          key={item.slug}
                          to={`/services/${item.slug}`}
                          aria-current={isCurrent ? 'page' : undefined}
                          className={cn(
                            'group relative flex min-w-0 items-center gap-4 rounded-2xl px-3.5 py-3.5 transition-[background-color,color] duration-300 sm:px-4',
                            !isLast && 'mb-1',
                            isCurrent
                              ? 'border border-brand-red/20 bg-white/[0.045] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
                              : 'border border-transparent hover:bg-white/[0.024]'
                          )}
                        >
                          <span
                            className={cn(
                              'h-1.5 w-1.5 shrink-0 rounded-full transition-[background-color,transform] duration-300',
                              isCurrent
                                ? 'scale-110 bg-brand-red'
                                : 'bg-[#4E535C] group-hover:scale-110 group-hover:bg-brand-red/80'
                            )}
                            aria-hidden="true"
                          />

                          <div className="min-w-0 flex-1">
                            <div
                              className={cn(
                                'text-sm font-display font-semibold leading-[1.25] transition-colors duration-300 sm:text-[15px]',
                                isCurrent
                                  ? 'text-white'
                                  : 'text-[#F4F5F7] group-hover:text-white'
                              )}
                            >
                              {item.title}
                            </div>
                            <div className={cn(
                              'mt-1 text-[10px] leading-[1.5] transition-colors duration-300',
                              isCurrent ? 'text-[#AEB4BF]' : 'text-[#6F757F] group-hover:text-[#8A909D]'
                            )}>
                              {language === 'id' ? item.navSubtitleId : item.navSubtitle}
                            </div>
                          </div>

                          <span
                            className={cn(
                              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-[border-color,background-color,color,transform] duration-300',
                              isCurrent
                                ? 'border-brand-red/35 bg-brand-red/[0.14] text-white'
                                : 'border-white/[0.07] bg-white/[0.012] text-[#6F757F] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-white/[0.14] group-hover:text-white'
                            )}
                            aria-hidden="true"
                          >
                            {isCurrent
                              ? <CheckCircle2 className="h-3.5 w-3.5" />
                              : <ArrowUpRight className="h-3.5 w-3.5" />}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
};
