import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ExternalLink } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { fetchServerCmsProjects, getCmsProjects } from '../lib/cmsStore';
import { allProjects, type ProjectItem } from '../data/projectsData';
import { projectBySlug, projectSlug } from '../lib/publicContent';
import { buildCaseStudyNarrative } from '../lib/caseStudyNarrative';
import PublicPageHero from '../components/ui/PublicPageHero';
import { PublicPageCta } from '../components/ui/PublicPageCta';


const CASE_STUDY_FALLBACK_IMAGE = '/case-study-fallback.svg';
const cleanValues = (values: unknown): string[] =>
  Array.isArray(values)
    ? values.filter((value): value is string => typeof value === 'string' && value.trim().length > 0).map((value) => value.trim())
    : [];
const fallbackCopyToClipboard = (value: string): boolean => {
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.readOnly = true;
  textarea.setAttribute('aria-hidden', 'true');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  document.body.appendChild(textarea);
  textarea.select();
  let copied = false;
  try {
    copied = document.execCommand('copy');
  } finally {
    textarea.remove();
  }
  return copied;
};

const handleCaseStudyImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied === 'true') return;
  image.dataset.fallbackApplied = 'true';
  image.src = CASE_STUDY_FALLBACK_IMAGE;
};

export const CaseStudyDetail = () => {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [projects, setProjects] = useState<ProjectItem[]>(() => getCmsProjects());
  const project = useMemo(() => projectBySlug(projects, slug), [projects, slug]);

  useEffect(() => {
    void fetchServerCmsProjects().then(() => setProjects(getCmsProjects()));
  }, []);

  const item = project || (projects === allProjects ? projectBySlug(allProjects, slug) : undefined);
  const visualGallery = useMemo(() => {
    if (!item) return [];
    return Array.from(new Set([item.image, ...(Array.isArray(item.gallery) ? item.gallery : [])]
      .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      .map((value) => value.trim())));
  }, [item]);
  const hasAdditionalVisuals = visualGallery.length > 1;
  const isIllustrativeCover = /^https?:\/\/images\.unsplash\.com\//i.test(visualGallery[0] || '') && !hasAdditionalVisuals;
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'shared' | 'error'>('idle');
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const copyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(shareUrl);
        } catch {
          if (!fallbackCopyToClipboard(shareUrl)) throw new Error('Clipboard copy failed');
        }
      } else if (!fallbackCopyToClipboard(shareUrl)) {
        throw new Error('Clipboard copy failed');
      }
      setShareState('copied');
      window.setTimeout(() => setShareState('idle'), 1800);
    } catch {
      setShareState('error');
      window.setTimeout(() => setShareState('idle'), 2600);
    }
  };
  const shareCaseStudy = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: item?.title || 'Kapitech Case Study', url: shareUrl });
        setShareState('shared');
        window.setTimeout(() => setShareState('idle'), 1800);
        return;
      } catch (error) {
        if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') return;
      }
    }
    await copyLink();
  };
  const related = useMemo(() => {
    if (!item) return [];
    const source = projects.length ? projects : allProjects;
    return source.filter((candidate) => candidate.id !== item.id && (candidate.industry === item.industry || candidate.service === item.service)).slice(0, 3);
  }, [item, projects]);

  if (!item) {
    return (
      <div className="kapi-utility-page min-h-screen bg-[#0B0C0E] px-5 pb-20 pt-32 text-white sm:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">{language === 'id' ? 'Studi Kasus' : 'Case Study'}</p>
          <h1 className="mt-4 text-4xl font-display font-semibold tracking-[-0.04em] sm:text-6xl">{language === 'id' ? 'Studi kasus tidak ditemukan.' : 'Case study not found.'}</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#8A909D]">{language === 'id' ? 'Proyek yang diminta tidak tersedia pada daftar proyek publik saat ini.' : 'The requested project is not available in the current public project list.'}</p>
          <button type="button" onClick={() => navigate('/work')} className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] px-5 text-xs font-semibold text-white"><ArrowLeft size={15} /> {language === 'id' ? 'Kembali ke Portofolio' : 'Back to Work'}</button>
        </div>
      </div>
    );
  }

  const copy = language === 'id' ? localizedValue(item.descId, item.desc) : localizedValue(item.desc, item.descId);
  const narrative = buildCaseStudyNarrative(item, language);
  const metaLabels = language === 'id' ? [['Klien', item.client], ['Industri', item.industry], ['Layanan', item.service], ['Tahun', item.year], ['Pilar', item.pillar]] : [['Client', item.client], ['Industry', item.industry], ['Service', item.service], ['Year', item.year], ['Pillar', item.pillar]];

  return (
    <div className="kapi-page-bg min-h-screen bg-[#0B0C0E] text-white">
      <PublicPageHero
        eyebrow={(language === 'id' ? 'Studi Kasus / ' : 'Case Study / ') + (item.client || (language === 'id' ? 'Klien' : 'Client'))}
        title={item.title}
        description={copy}
        backLink={{ href: '/work', label: language === 'id' ? 'Semua studi kasus' : 'All case studies' }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-brand-red/20 bg-brand-red/[0.05] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.14em] text-brand-red">{item.service}</span>
          <span className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.12em] text-[#7B838F]">{item.year}</span>
          <span className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.12em] text-[#7B838F]">{item.industry}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => void shareCaseStudy()} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.025] px-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#C2C7D1] transition-colors hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70">
            {shareState === 'shared' ? (language === 'id' ? 'Dibagikan' : 'Shared') : (language === 'id' ? 'Bagikan studi kasus' : 'Share case study')} <ArrowUpRight size={13} />
          </button>
          <button type="button" onClick={() => void copyLink()} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.025] px-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#C2C7D1] transition-colors hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70">
            {shareState === 'copied' ? (language === 'id' ? 'Tautan disalin' : 'Link copied') : shareState === 'error' ? (language === 'id' ? 'Gagal menyalin' : 'Copy failed') : (language === 'id' ? 'Salin tautan' : 'Copy link')}
          </button>
          <span role="status" aria-live="polite" className="sr-only">
            {shareState === 'copied'
              ? (language === 'id' ? 'Tautan studi kasus berhasil disalin.' : 'Case study link copied.')
              : shareState === 'shared'
                ? (language === 'id' ? 'Studi kasus dibagikan.' : 'Case study shared.')
                : shareState === 'error'
                  ? (language === 'id' ? 'Tautan tidak dapat disalin. Silakan salin alamat halaman secara manual.' : 'The link could not be copied. Please copy the page address manually.')
                  : ''}
          </span>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {metaLabels.map(([label, value]) => (
            <div key={label} className="kapi-surface p-4"><span className="block text-[9px] font-mono uppercase tracking-[0.13em] text-[#656D79]">{label}</span><span className="mt-2 block text-sm leading-6 text-white">{value}</span></div>
          ))}
        </div>
      </PublicPageHero>


      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16" aria-label={language === 'id' ? 'Detail studi kasus' : 'Case study details'}>
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.7fr)] xl:gap-14">
          <div className="min-w-0 space-y-12">
            <section aria-labelledby="case-study-visual-title" className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.018]">
              <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] px-4 py-3.5 sm:px-5">
                <div><p className="text-[10px] font-mono uppercase tracking-[0.15em] text-brand-red">{isIllustrativeCover ? (language === 'id' ? 'Referensi ilustratif' : 'Illustrative reference') : (language === 'id' ? 'Dokumentasi proyek' : 'Project documentation')}</p><h2 id="case-study-visual-title" className="mt-1 text-sm font-medium text-white">{isIllustrativeCover ? (language === 'id' ? 'Gambar ilustratif, bukan dokumentasi proyek' : 'Illustrative cover, not project documentation') : hasAdditionalVisuals ? (language === 'id' ? 'Galeri proyek' : 'Project gallery') : (language === 'id' ? 'Gambar sampul' : 'Cover image')}</h2></div>
                {hasAdditionalVisuals ? <span className="shrink-0 text-[10px] font-mono tabular-nums text-[#727A86]">{String(visualGallery.length).padStart(2, '0')} {language === 'id' ? 'gambar' : 'images'}</span> : null}
              </div>
              <img src={visualGallery[0] || CASE_STUDY_FALLBACK_IMAGE} alt={isIllustrativeCover ? (language === 'id' ? 'Gambar ilustratif untuk ' + item.title : 'Illustrative cover image for ' + item.title) : item.title} onError={handleCaseStudyImageError} className="aspect-[16/10] w-full bg-[#101115] object-cover" loading="eager" decoding="async" />
              {visualGallery.length > 1 ? <div className="grid gap-2 p-2 sm:grid-cols-2">{visualGallery.slice(1).map((image, index) => <figure key={image} className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0B0C0E]"><img src={image} alt={item.title + ' — ' + (language === 'id' ? 'visual proyek' : 'project visual') + ' ' + (index + 2)} onError={handleCaseStudyImageError} className="aspect-[4/3] w-full object-cover" loading="lazy" decoding="async" /></figure>)}</div> : null}
            </section>
            <section id="case-study-context" aria-labelledby="case-study-context-title">
              <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">{language === 'id' ? 'Latar belakang & sasaran' : 'Context & objectives'}</p>
              <h2 id="case-study-context-title" className="mt-3 text-2xl font-display font-semibold tracking-[-0.035em] sm:text-4xl">{language === 'id' ? 'Memahami kebutuhan proyek' : 'Understanding the project brief'}</h2>
              <p className="mt-4 max-w-4xl text-base leading-8 text-[#A4AAB6] sm:text-lg">{narrative.context}</p>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {narrative.contextDetails.map((detail) => (
                  <div key={detail.title} className="min-w-0 rounded-2xl border border-white/[0.08] bg-white/[0.018] p-5">
                    <h3 className="text-sm font-semibold leading-6 text-white">{detail.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#8F97A3]">{detail.body}</p>
                  </div>
                ))}
              </div>
              <div className="mt-7 rounded-3xl border border-white/[0.08] bg-white/[0.018] p-5 sm:p-6">
                <h3 className="text-lg font-display font-semibold text-white">{language === 'id' ? 'Tujuan yang menjadi arah pengerjaan' : 'Objectives guiding the work'}</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {narrative.objectives.map((objective, index) => (
                    <div key={objective} className="flex min-w-0 gap-3 rounded-2xl border border-white/[0.06] bg-[#0B0C0E]/55 p-4">
                      <span className="mt-0.5 shrink-0 font-mono text-[10px] tabular-nums text-brand-red">{String(index + 1).padStart(2, '0')}</span>
                      <p className="text-sm leading-7 text-[#A4AAB6]">{objective}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="case-study-challenge" aria-labelledby="case-study-challenge-title">
              <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">{language === 'id' ? 'Masalah awal' : 'The starting problem'}</p>
              <h2 id="case-study-challenge-title" className="mt-3 text-2xl font-display font-semibold tracking-[-0.035em] sm:text-4xl">{language === 'id' ? 'Tantangan yang perlu diselesaikan' : 'The challenge to solve'}</h2>
              <p className="mt-4 max-w-4xl text-base leading-8 text-[#A4AAB6] sm:text-lg">{narrative.challenge}</p>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {narrative.diagnosis.map((detail, index) => (
                  <div key={detail.title} className="min-w-0 rounded-2xl border border-white/[0.08] bg-white/[0.018] p-5">
                    <span className="font-mono text-[10px] tabular-nums text-brand-red">{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="mt-3 text-base font-semibold leading-6 text-white">{detail.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#8F97A3]">{detail.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="case-study-solution" aria-labelledby="case-study-solution-title">
              <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">{language === 'id' ? 'Respons Kapitech' : 'Kapitech response'}</p>
              <h2 id="case-study-solution-title" className="mt-3 text-2xl font-display font-semibold tracking-[-0.035em] sm:text-4xl">{language === 'id' ? 'Solusi dan alasan di baliknya' : 'The solution and the reasoning behind it'}</h2>
              <p className="mt-4 max-w-4xl text-base leading-8 text-[#A4AAB6] sm:text-lg">{narrative.solution}</p>
              <div className="mt-6 space-y-3">
                {narrative.solutionLogic.map((detail, index) => (
                  <div key={detail.title} className="grid gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.018] p-5 sm:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)] sm:gap-6 sm:p-6">
                    <div className="flex items-start gap-3">
                      <span className="mt-1 font-mono text-[10px] tabular-nums text-brand-red">{String(index + 1).padStart(2, '0')}</span>
                      <h3 className="text-base font-semibold leading-6 text-white">{detail.title}</h3>
                    </div>
                    <p className="text-sm leading-7 text-[#8F97A3]">{detail.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="case-study-process" aria-labelledby="case-study-execution-title">
              <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">{language === 'id' ? 'Dari rencana ke hasil kerja' : 'From plan to delivery'}</p>
              <h2 id="case-study-execution-title" className="mt-3 text-2xl font-display font-semibold tracking-[-0.035em] sm:text-4xl">{language === 'id' ? 'Tahapan proses pengerjaan' : 'The execution process'}</h2>
              <p className="mt-4 max-w-4xl text-base leading-8 text-[#A4AAB6] sm:text-lg">{language === 'id' ? 'Bagian ini menjabarkan hubungan antara tantangan, keputusan solusi, dan keluaran yang tercatat. Setiap tahap diuraikan sesuai jenis layanan proyek ini, bukan memakai satu template proses yang sama untuk semua layanan.' : 'This section explains how the challenge, solution decisions, and recorded outputs fit together. The stages are tailored to this project’s service type rather than using one identical process template for every engagement.'}</p>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {narrative.process.map((step) => (
                  <article key={step.title} className="min-w-0 rounded-2xl border border-white/[0.08] bg-white/[0.018] p-5 sm:p-6">
                    <h3 className="text-base font-semibold leading-6 text-white">{step.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#8F97A3]">{step.body}</p>
                  </article>
                ))}
              </div>
            </section>

            <section id="case-study-deliverables" aria-labelledby="case-study-deliverables-title">
              <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">{language === 'id' ? 'Apa yang diserahkan' : 'What was delivered'}</p>
              <h2 id="case-study-deliverables-title" className="mt-3 text-2xl font-display font-semibold tracking-[-0.035em] sm:text-4xl">{language === 'id' ? 'Rincian hasil kerja' : 'Deliverables in detail'}</h2>
              <p className="mt-4 max-w-4xl text-base leading-8 text-[#A4AAB6] sm:text-lg">{language === 'id' ? 'Daftar ini menjelaskan peran setiap keluaran dalam solusi, bukan hanya mencantumkan nama file atau fitur. Detail teknis, versi, jumlah, dan format final tetap mengikuti catatan serta persetujuan ruang lingkup proyek.' : 'The list explains how each output contributes to the solution rather than only naming files or features. Technical detail, versions, quantities, and final formats remain subject to the project record and approved scope.'}</p>
              {narrative.deliverables.length ? (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {narrative.deliverables.map((deliverable, index) => (
                    <article key={deliverable.title} className="min-w-0 rounded-2xl border border-white/[0.08] bg-white/[0.018] p-5 sm:p-6">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[9px] font-mono uppercase tracking-[0.13em] text-[#69717E]">{language === 'id' ? 'Deliverable' : 'Deliverable'}</span>
                        <span className="text-[10px] font-mono tabular-nums text-[#6F7783]">{String(index + 1).padStart(2, '0')}</span>
                      </div>
                      <h3 className="mt-3 text-base font-semibold leading-6 text-white">{deliverable.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-[#8F97A3]">{deliverable.body}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-5 rounded-2xl border border-dashed border-white/[0.1] p-4 text-sm leading-6 text-[#7F8793]">{language === 'id' ? 'Daftar hasil kerja belum tersedia pada catatan proyek ini.' : 'A deliverables list is not available in the project record yet.'}</p>
              )}
            </section>

            <section id="case-study-outcome" aria-labelledby="case-study-outcome-title">
              <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">{language === 'id' ? 'Hasil, dampak, dan bukti' : 'Results, impact, and evidence'}</p>
              <h2 id="case-study-outcome-title" className="mt-3 text-2xl font-display font-semibold tracking-[-0.035em] sm:text-4xl">{language === 'id' ? 'Apa dampaknya bagi klien?' : 'What changed for the client?'}</h2>
              <p className="mt-4 max-w-4xl text-base leading-8 text-[#A4AAB6] sm:text-lg">{narrative.impact}</p>
              {item.impact?.length ? (
                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {item.impact.map((metric, index) => (
                    <div key={metric.label + '-' + index} className="min-w-0 rounded-2xl border border-white/[0.08] bg-white/[0.018] p-5">
                      <span className="block text-[9px] font-mono uppercase tracking-[0.12em] leading-5 text-[#68707C]">{metric.label}</span>
                      <span className="mt-3 block break-words text-2xl font-display font-semibold tracking-[-0.035em] text-white">{metric.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-5 rounded-2xl border border-dashed border-white/[0.1] p-4 text-sm leading-6 text-[#7F8793]">{language === 'id' ? 'Indikator hasil belum tersedia untuk proyek ini.' : 'Outcome indicators have not been provided for this project.'}</p>
              )}
              <p className="mt-5 rounded-2xl border border-white/[0.06] bg-white/[0.012] p-4 text-xs leading-6 text-[#737B87]">{narrative.evidenceNote}</p>
            </section>

            <section id="case-study-relevance" aria-labelledby="case-study-relevance-title">
              <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">{language === 'id' ? 'Relevansi bagi bisnis' : 'Business relevance'}</p>
              <h2 id="case-study-relevance-title" className="mt-3 text-2xl font-display font-semibold tracking-[-0.035em] sm:text-4xl">{language === 'id' ? 'Siapa yang bisa belajar dari proyek ini?' : 'Who can learn from this work?'}</h2>
              <p className="mt-4 max-w-4xl text-base leading-8 text-[#A4AAB6] sm:text-lg">{narrative.relevance}</p>
            </section>
          </div>
          <aside className="min-w-0 space-y-5 lg:sticky lg:top-28 lg:self-start">
            <nav aria-label={language === 'id' ? 'Navigasi studi kasus' : 'Case study navigation'} className="rounded-3xl border border-white/[0.08] bg-white/[0.018] p-5">
              <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#68707C]">{language === 'id' ? 'Di halaman ini' : 'On this page'}</p>
              <div className="mt-3 grid gap-1">
                {[
                  { href: '#case-study-context', label: language === 'id' ? 'Konteks & tujuan' : 'Context & objectives' },
                  { href: '#case-study-challenge', label: language === 'id' ? 'Tantangan' : 'The challenge' },
                  { href: '#case-study-solution', label: language === 'id' ? 'Solusi' : 'The solution' },
                  { href: '#case-study-process', label: language === 'id' ? 'Proses pengerjaan' : 'Execution process' },
                  { href: '#case-study-deliverables', label: language === 'id' ? 'Hasil kerja' : 'Deliverables' },
                  { href: '#case-study-outcome', label: language === 'id' ? 'Dampak & indikator' : 'Impact & indicators' },
                  { href: '#case-study-relevance', label: language === 'id' ? 'Relevansi bisnis' : 'Business relevance' }
                ].map((entry) => (
                  <a key={entry.href} href={entry.href} className="rounded-xl px-3 py-2.5 text-sm text-[#969EAA] transition-colors hover:bg-white/[0.04] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60">
                    {entry.label}
                  </a>
                ))}
              </div>
            </nav>
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.018] p-6">
              <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#68707C]">{language === 'id' ? 'Teknologi dan alat' : 'Technologies and tools'}</p>
              {narrative.technologies.length ? (
                <div className="mt-4 space-y-4">
                  {narrative.technologies.map((technology) => (
                    <div key={technology.title} className="min-w-0">
                      <span className="inline-flex max-w-full rounded-full border border-white/[0.08] px-3 py-1.5 text-[10px] font-mono text-[#C4CAD3]">{technology.title}</span>
                      <p className="mt-2 text-xs leading-6 text-[#7F8793]">{technology.body}</p>
                    </div>
                  ))}
                </div>
              ) : <p className="mt-4 text-sm leading-6 text-[#7F8793]">{language === 'id' ? 'Teknologi belum dicantumkan pada data publik proyek ini.' : 'The public project record does not list technologies yet.'}</p>}
            </div>
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.018] p-6">
              <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-red">{language === 'id' ? 'Punya tantangan serupa?' : 'A similar challenge?'}</p>
              <h2 className="mt-2 text-2xl font-display font-semibold tracking-[-0.03em]">{language === 'id' ? 'Mari bahas proyek Anda.' : 'Let’s discuss your project.'}</h2>
              <p className="mt-3 text-sm leading-6 text-[#8A909D]">{language === 'id' ? 'Ceritakan kebutuhan dan sasaran Anda agar ruang lingkup yang tepat dapat dibahas bersama.' : 'Share your needs and goals so we can discuss the right project scope together.'}</p>
              <Link to={'/contact?service=' + encodeURIComponent(item.service) + '#project-inquiry-form'} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-red px-5 text-xs font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70">{language === 'id' ? 'Ajukan konsultasi' : 'Request consultation'} <ArrowUpRight size={14} aria-hidden="true" /></Link>
            </div>
          </aside>
        </div>
      </section>

      {related.length ? <section className="mx-auto max-w-7xl px-5 pt-6 sm:px-8 lg:px-12"><div className="border-t border-white/[0.08] pt-12"><div className="flex items-end justify-between gap-5"><div><p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">{language === 'id' ? 'Proyek terkait' : 'Related work'}</p><h2 className="mt-3 text-3xl font-display font-semibold tracking-[-0.04em] sm:text-4xl">{language === 'id' ? 'Proyek yang relevan lainnya.' : 'More relevant projects.'}</h2></div><Link to="/work" className="hidden items-center gap-2 text-xs font-semibold text-[#8F97A3] hover:text-white sm:inline-flex">{language === 'id' ? 'Lihat semua' : 'View all'} <ExternalLink size={13} /></Link></div><div className="mt-7 grid gap-4 md:grid-cols-3">{related.map((relatedProject) => <Link key={relatedProject.id} to={'/work/' + projectSlug(relatedProject)} className="group overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.018] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E]"><img src={relatedProject.image || CASE_STUDY_FALLBACK_IMAGE} onError={handleCaseStudyImageError} alt={relatedProject.title} className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" /><div className="p-5"><span className="text-[9px] font-mono uppercase tracking-[0.12em] text-brand-red">{relatedProject.service}</span><h3 className="mt-2 text-xl font-display font-semibold tracking-[-0.03em] text-white">{relatedProject.title}</h3><p className="mt-2 text-sm leading-6 text-[#7E8692]">{relatedProject.industry}</p></div></Link>)}</div></div></section> : null}
      <PublicPageCta
        eyebrow={language === 'id' ? 'Langkah berikutnya' : 'Next step'}
        title={language === 'id' ? 'Mari bangun sesuatu yang bermakna.' : 'Let’s build something meaningful.'}
        description={language === 'id' ? 'Ceritakan masalah, target, dan kebutuhan proyek Anda. Tim Kapitech akan membantu membahas solusi yang paling relevan.' : 'Tell us about the problem, goals, and project needs. Kapitech can help explore the right solution for your team.'}
        primaryHref={'/contact?service=' + encodeURIComponent(item.service) + '#project-inquiry-form'}
        primaryLabel={language === 'id' ? 'Mulai proyek' : 'Start a project'}
        secondaryHref="/work"
        secondaryLabel={language === 'id' ? 'Jelajahi portofolio' : 'Explore the portfolio'}
      />

    </div>
  );
};
