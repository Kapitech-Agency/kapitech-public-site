import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ExternalLink } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { fetchServerCmsProjects, getCmsProjects } from '../lib/cmsStore';
import { allProjects, type ProjectItem } from '../data/projectsData';
import { projectBySlug, projectSlug } from '../lib/publicContent';
import PublicPageHero from '../components/ui/PublicPageHero';
import { PublicPageCta } from '../components/ui/PublicPageCta';


const CASE_STUDY_FALLBACK_IMAGE = '/case-study-fallback.svg';
const cleanValues = (values: unknown): string[] =>
  Array.isArray(values)
    ? values.filter((value): value is string => typeof value === 'string' && value.trim().length > 0).map((value) => value.trim())
    : [];
const readableList = (values: string[], language: string): string => {
  if (values.length < 2) return values[0] || '';
  if (values.length === 2) return values[0] + (language === 'id' ? ' dan ' : ' and ') + values[1];
  return values.slice(0, -1).join(', ') + (language === 'id' ? ', dan ' : ', and ') + values[values.length - 1];
};
const localizedValue = (primary: string | undefined, fallback: string | undefined): string =>
  primary?.trim() || fallback?.trim() || '';
const buildExecutionSummary = (item: ProjectItem, language: string): string => {
  const deliverables = cleanValues(item.deliverables);
  const technologies = cleanValues(item.technologies);
  const pieces: string[] = [];
  if (language === 'id') {
    pieces.push(deliverables.length
      ? 'Ruang lingkup penyerahan yang tercatat untuk proyek ini mencakup ' + readableList(deliverables, language) + '.'
      : 'Ruang lingkup penyerahan belum dirinci pada data publik proyek ini.');
    if (technologies.length) pieces.push('Teknologi atau perangkat kerja yang tercatat adalah ' + readableList(technologies, language) + '.');
    pieces.push('Daftar hasil kerja di bawah merangkum keluaran yang didokumentasikan untuk studi kasus ini.');
  } else {
    pieces.push(deliverables.length
      ? 'The recorded delivery scope for this project includes ' + readableList(deliverables, language) + '.'
      : 'The public project record does not yet include a detailed deliverables list.');
    if (technologies.length) pieces.push('The technologies or production tools recorded for this engagement are ' + readableList(technologies, language) + '.');
    pieces.push('The deliverables below make the documented scope easier to review.');
  }
  return pieces.join(' ');
};
const buildOutcomeSummary = (item: ProjectItem, language: string): string => {
  const indicators = cleanValues((item.impact || []).map((metric) => metric?.label));
  if (language === 'id') {
    if (indicators.length) return 'Indikator dampak yang dicantumkan pada catatan proyek ini adalah ' + readableList(indicators, language) + '. Nilai yang tersedia ditampilkan di bawah agar konteks hasilnya mudah ditinjau.';
    return 'Ringkasan hasil terukur belum dicantumkan pada data publik proyek ini.';
  }
  if (indicators.length) return 'The impact indicators listed in this project record are ' + readableList(indicators, language) + '. Available values are shown below so the reported outcomes can be reviewed in context.';
  return 'A measured outcome summary has not been included in this public project record yet.';
};
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
  const challengeCopy = language === 'id' ? localizedValue(item.challengeId, item.challenge) : localizedValue(item.challenge, item.challengeId);
  const solutionCopy = language === 'id' ? localizedValue(item.solutionId, item.solution) : localizedValue(item.solution, item.solutionId);
  const executionCopy = language === 'id' ? localizedValue(item.executionId, item.execution) || buildExecutionSummary(item, language) : localizedValue(item.execution, item.executionId) || buildExecutionSummary(item, language);
  const outcomeCopy = language === 'id' ? localizedValue(item.outcomeId, item.outcome) || buildOutcomeSummary(item, language) : localizedValue(item.outcome, item.outcomeId) || buildOutcomeSummary(item, language);
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
                <div><p className="text-[10px] font-mono uppercase tracking-[0.15em] text-brand-red">{language === 'id' ? 'Dokumentasi proyek' : 'Project visuals'}</p><h2 id="case-study-visual-title" className="mt-1 text-sm font-medium text-white">{language === 'id' ? 'Ringkasan visual' : 'Visual overview'}</h2></div>
                <span className="shrink-0 text-[10px] font-mono tabular-nums text-[#727A86]">{String(Math.max(visualGallery.length, 1)).padStart(2, '0')} {language === 'id' ? 'gambar' : 'images'}</span>
              </div>
              <img src={visualGallery[0] || CASE_STUDY_FALLBACK_IMAGE} alt={item.title} onError={handleCaseStudyImageError} className="aspect-[16/10] w-full bg-[#101115] object-cover" loading="eager" decoding="async" />
              {visualGallery.length > 1 ? <div className="grid gap-2 p-2 sm:grid-cols-2">{visualGallery.slice(1).map((image, index) => <figure key={image} className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0B0C0E]"><img src={image} alt={item.title + ' — ' + (language === 'id' ? 'visual proyek' : 'project visual') + ' ' + (index + 2)} onError={handleCaseStudyImageError} className="aspect-[4/3] w-full object-cover" loading="lazy" decoding="async" /></figure>)}</div> : null}
            </section>
            <section aria-labelledby="case-study-challenge-title">
              <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">{language === 'id' ? 'Titik awal' : 'Starting point'}</p>
              <h2 id="case-study-challenge-title" className="mt-3 text-2xl font-display font-semibold tracking-[-0.035em] sm:text-4xl">{language === 'id' ? 'Tantangan klien' : 'The client challenge'}</h2>
              <p className="mt-4 max-w-4xl text-base leading-8 text-[#A4AAB6] sm:text-lg">{challengeCopy || (language === 'id' ? 'Rincian tantangan belum ditambahkan pada data publik proyek ini.' : 'The project challenge has not yet been added to the public record.')}</p>
            </section>
            <section aria-labelledby="case-study-solution-title">
              <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">{language === 'id' ? 'Respons Kapitech' : 'Kapitech response'}</p>
              <h2 id="case-study-solution-title" className="mt-3 text-2xl font-display font-semibold tracking-[-0.035em] sm:text-4xl">{language === 'id' ? 'Solusi yang dirancang' : 'The solution'}</h2>
              <p className="mt-4 max-w-4xl text-base leading-8 text-[#A4AAB6] sm:text-lg">{solutionCopy || (language === 'id' ? 'Rincian solusi belum ditambahkan pada data publik proyek ini.' : 'The solution has not yet been added to the public project record.')}</p>
            </section>
            <section aria-labelledby="case-study-execution-title">
              <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">{language === 'id' ? 'Ruang lingkup pekerjaan' : 'Scope of work'}</p>
              <h2 id="case-study-execution-title" className="mt-3 text-2xl font-display font-semibold tracking-[-0.035em] sm:text-4xl">{language === 'id' ? 'Eksekusi dan penyerahan' : 'Execution and delivery'}</h2>
              <p className="mt-4 max-w-4xl text-base leading-8 text-[#A4AAB6] sm:text-lg">{executionCopy}</p>
              {cleanValues(item.deliverables).length ? <div className="mt-6 grid gap-3 sm:grid-cols-2">{cleanValues(item.deliverables).map((deliverable, index) => <div key={deliverable} className="min-w-0 rounded-2xl border border-white/[0.08] bg-white/[0.018] p-4 sm:p-5"><div className="flex items-center justify-between gap-3"><span className="text-[9px] font-mono uppercase tracking-[0.13em] text-[#69717E]">{language === 'id' ? 'Hasil kerja' : 'Deliverable'}</span><span className="text-[10px] font-mono tabular-nums text-[#6F7783]">{String(index + 1).padStart(2, '0')}</span></div><h3 className="mt-3 text-sm font-semibold leading-6 text-white">{deliverable}</h3></div>)}</div> : null}
            </section>
            <section aria-labelledby="case-study-outcome-title">
              <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">{language === 'id' ? 'Hasil dan indikator' : 'Results and indicators'}</p>
              <h2 id="case-study-outcome-title" className="mt-3 text-2xl font-display font-semibold tracking-[-0.035em] sm:text-4xl">{language === 'id' ? 'Dampak proyek' : 'Outcome and impact'}</h2>
              <p className="mt-4 max-w-4xl text-base leading-8 text-[#A4AAB6] sm:text-lg">{outcomeCopy}</p>
              {item.impact?.length ? <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{item.impact.map((metric, index) => <div key={metric.label + '-' + index} className="min-w-0 rounded-2xl border border-white/[0.08] bg-white/[0.018] p-5"><span className="block text-[9px] font-mono uppercase tracking-[0.12em] leading-5 text-[#68707C]">{metric.label}</span><span className="mt-3 block break-words text-2xl font-display font-semibold tracking-[-0.035em] text-white">{metric.value}</span></div>)}</div> : <p className="mt-5 rounded-2xl border border-dashed border-white/[0.1] p-4 text-sm leading-6 text-[#7F8793]">{language === 'id' ? 'Indikator hasil belum tersedia untuk proyek ini.' : 'Outcome indicators have not been provided for this project.'}</p>}
            </section>
          </div>
          <aside className="min-w-0 space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.018] p-6">
              <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#68707C]">{language === 'id' ? 'Teknologi dan alat' : 'Technologies and tools'}</p>
              {cleanValues(item.technologies).length ? <div className="mt-4 flex flex-wrap gap-2">{cleanValues(item.technologies).map((technology) => <span key={technology} className="rounded-full border border-white/[0.08] px-3 py-1.5 text-[10px] font-mono text-[#9AA1AC]">{technology}</span>)}</div> : <p className="mt-4 text-sm leading-6 text-[#7F8793]">{language === 'id' ? 'Teknologi belum dicantumkan pada data publik proyek ini.' : 'The public project record does not list technologies yet.'}</p>}
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
