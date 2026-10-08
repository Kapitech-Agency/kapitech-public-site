import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, CheckCircle2, ExternalLink } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { fetchServerCmsProjects, getCmsProjects } from '../lib/cmsStore';
import { allProjects, type ProjectItem } from '../data/projectsData';
import { projectBySlug, projectSlug } from '../lib/publicContent';

export const CaseStudyDetail = () => {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [projects, setProjects] = useState<ProjectItem[]>(() => getCmsProjects());
  const project = useMemo(() => projectBySlug(projects.length ? projects : allProjects, slug), [projects, slug]);

  useEffect(() => {
    void fetchServerCmsProjects().then(() => setProjects(getCmsProjects()));
  }, []);

  const item = project || projectBySlug(allProjects, slug);
  const related = useMemo(() => {
    if (!item) return [];
    const source = projects.length ? projects : allProjects;
    return source.filter((candidate) => candidate.id !== item.id && (candidate.industry === item.industry || candidate.service === item.service)).slice(0, 3);
  }, [item, projects]);

  if (!item) {
    return (
      <main className="min-h-screen bg-[#0B0C0E] px-5 pb-20 pt-32 text-white sm:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">Case Study</p>
          <h1 className="mt-4 text-4xl font-display font-semibold tracking-[-0.04em] sm:text-6xl">Case study not found.</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#8A909D]">The requested project is no longer available in the public project dataset.</p>
          <button type="button" onClick={() => navigate('/work')} className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] px-5 text-xs font-semibold text-white"><ArrowLeft size={15} /> Back to Work</button>
        </div>
      </main>
    );
  }

  const copy = language === 'id' ? item.descId : item.desc;

  return (
    <main className="min-h-screen bg-[#0B0C0E] pb-24 pt-28 text-white sm:pt-32">
      <header className="border-b border-white/[0.08]">
        <div className="mx-auto max-w-7xl px-5 pb-12 sm:px-8 lg:px-12">
          <Link to="/work" className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.14em] text-[#7C8490] hover:text-white"><ArrowLeft size={13} /> Back to Work</Link>
          <div className="mt-8 max-w-5xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/[0.1] bg-white/[0.025] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.14em] text-brand-red">{item.service}</span>
              <span className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.12em] text-[#7B838F]">{item.year}</span>
            </div>
            <h1 className="mt-5 text-4xl font-display font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[5.25rem]">{item.title}</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#A2A8B4] sm:text-lg">{copy}</p>
          </div>
          <div className="mt-8 grid gap-3 border-t border-white/[0.08] pt-6 sm:grid-cols-2 lg:grid-cols-5">
            {[['Client', item.client], ['Industry', item.industry], ['Service', item.service], ['Year', item.year], ['Pillar', item.pillar]].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-4"><span className="block text-[9px] font-mono uppercase tracking-[0.13em] text-[#656D79]">{label}</span><span className="mt-2 block text-sm leading-6 text-white">{value}</span></div>
            ))}
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.7fr)] lg:px-12 lg:py-16">
        <div className="space-y-12">
          <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.018]">
            <img src={item.image} alt={item.title} className="aspect-[16/10] w-full object-cover" loading="eager" />
            {item.gallery?.length ? <div className="grid gap-2 p-2 sm:grid-cols-2">{item.gallery.map((image) => <img key={image} src={image} alt="" className="aspect-[4/3] w-full rounded-2xl object-cover" loading="lazy" />)}</div> : null}
          </div>

          <section><p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">Client Challenge</p><h2 className="mt-3 text-2xl font-display font-semibold tracking-[-0.035em] sm:text-4xl">{language === 'id' ? item.challengeId : item.challenge}</h2></section>
          <section><p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">Kapitech Solution</p><p className="mt-4 max-w-4xl text-base leading-8 text-[#A4AAB6] sm:text-lg">{language === 'id' ? item.solutionId : item.solution}</p></section>
          <section><p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">Execution & Delivery</p><p className="mt-4 max-w-4xl text-base leading-8 text-[#A4AAB6] sm:text-lg">{language === 'id' ? (item.executionId || item.solutionId) : (item.execution || item.solution)}</p></section>
          <section>
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">Outcome & Impact</p>
            <p className="mt-4 max-w-4xl text-base leading-8 text-[#A4AAB6] sm:text-lg">{language === 'id' ? (item.outcomeId || item.descId) : (item.outcome || item.desc)}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">{item.impact.map((metric) => <div key={metric.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.018] p-5"><span className="block text-[9px] font-mono uppercase tracking-[0.12em] text-[#68707C]">{metric.label}</span><span className="mt-3 block text-2xl font-display font-semibold tracking-[-0.035em] text-white">{metric.value}</span></div>)}</div>
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.018] p-6"><p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#68707C]">Deliverables</p><div className="mt-4 space-y-3">{item.deliverables.map((deliverable) => <div key={deliverable} className="flex items-start gap-3 text-sm leading-6 text-[#A2A8B4]"><CheckCircle2 size={15} className="mt-1 shrink-0 text-white" />{deliverable}</div>)}</div></div>
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.018] p-6"><p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#68707C]">Technologies</p><div className="mt-4 flex flex-wrap gap-2">{item.technologies.map((technology) => <span key={technology} className="rounded-full border border-white/[0.08] px-3 py-1.5 text-[10px] font-mono text-[#9AA1AC]">{technology}</span>)}</div></div>
          <div className="rounded-3xl border border-white/[0.08] bg-brand-red p-6"><p className="text-[10px] font-mono uppercase tracking-[0.14em] text-white/65">A similar challenge?</p><h2 className="mt-2 text-2xl font-display font-semibold tracking-[-0.03em]">Let’s discuss your project.</h2><Link to={'/book-a-call?service=' + encodeURIComponent(item.service)} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-xs font-semibold text-[#0B0C0E]">Schedule a consultation <ArrowUpRight size={14} /></Link></div>
        </aside>
      </section>

      {related.length ? <section className="mx-auto max-w-7xl px-5 pt-6 sm:px-8 lg:px-12"><div className="border-t border-white/[0.08] pt-12"><div className="flex items-end justify-between gap-5"><div><p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">Related work</p><h2 className="mt-3 text-3xl font-display font-semibold tracking-[-0.04em] sm:text-4xl">More relevant projects.</h2></div><Link to="/work" className="hidden items-center gap-2 text-xs font-semibold text-[#8F97A3] hover:text-white sm:inline-flex">View all <ExternalLink size={13} /></Link></div><div className="mt-7 grid gap-4 md:grid-cols-3">{related.map((relatedProject) => <Link key={relatedProject.id} to={'/work/' + projectSlug(relatedProject)} className="group overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.018]"><img src={relatedProject.image} alt={relatedProject.title} className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" /><div className="p-5"><span className="text-[9px] font-mono uppercase tracking-[0.12em] text-brand-red">{relatedProject.service}</span><h3 className="mt-2 text-xl font-display font-semibold tracking-[-0.03em] text-white">{relatedProject.title}</h3><p className="mt-2 text-sm leading-6 text-[#7E8692]">{relatedProject.industry}</p></div></Link>)}</div></div></section> : null}
    </main>
  );
};
