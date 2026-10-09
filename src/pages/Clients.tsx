import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, Layers3, Users } from 'lucide-react';
import { allProjects, type ProjectItem } from '../data/projectsData';
import { fetchServerCmsProjects, getCmsProjects } from '../lib/cmsStore';
import { clientSlug, projectSlug } from '../lib/publicContent';
import { useLanguage } from '../lib/LanguageContext';
import PublicPageHero from '../components/ui/PublicPageHero';

export const Clients = () => {
  const { language } = useLanguage();
  const [projects, setProjects] = useState<ProjectItem[]>(() => getCmsProjects());

  useEffect(() => {
    void fetchServerCmsProjects().then(() => setProjects(getCmsProjects()));
  }, []);

  const source = projects.length ? projects.filter((project) => project.isPublished !== false) : allProjects.filter((project) => project.isPublished !== false);

  const clientEntries = useMemo(() => {
    const names = Array.from(new Set(source.map((project) => project.client).filter(Boolean)));
    return names.map((client) => {
      const clientProjects = source.filter((project) => project.client === client);
      const industries = Array.from(new Set(clientProjects.map((project) => project.industry).filter(Boolean)));
      const services = Array.from(new Set(clientProjects.map((project) => project.service).filter(Boolean)));
      const latestYear = clientProjects.map((project) => Number(project.year)).filter((year) => Number.isFinite(year)).sort((a, b) => b - a)[0];
      return { client, projects: clientProjects, industries, services, latestYear };
    }).sort((a, b) => b.projects.length - a.projects.length || a.client.localeCompare(b.client));
  }, [source]);

  const featured = clientEntries[0];
  const totalProjects = source.length;
  const totalClients = clientEntries.length;
  const totalServices = new Set(source.map((project) => project.service).filter(Boolean)).size;

  return (
    <main className="kapi-utility-page kapi-page-bg min-h-screen bg-[#0B0C0E] text-white">
      <PublicPageHero
        eyebrow={language === 'id' ? 'Client & proof' : 'Clients & proof'}
        title={language === 'id' ? 'Hubungan client dilihat melalui pekerjaan yang nyata.' : 'Client relationships, viewed through the work itself.'}
        description={language === 'id' ? 'Jelajahi client yang terwakili dalam portfolio publik Kapitech. Setiap profil menghubungkan nama client dengan project, layanan, dan konteks industri yang benar-benar tercatat di portfolio.' : 'Explore clients represented in Kapitech’s public portfolio. Each profile connects the client to projects, services, and industry contexts actually represented in the work.'}
        aside={
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
            <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.16em] text-brand-red">
              <Users size={13} />
              {language === 'id' ? 'Portfolio lens' : 'Portfolio lens'}
            </div>
            <p className="mt-4 text-sm leading-6 text-[#8B949F]">
              {language === 'id' ? 'Bukan sekadar daftar logo. Lihat pola pekerjaan, capability, dan konteks yang membentuk setiap hubungan.' : 'Not just a logo list. See the work patterns, capabilities, and contexts that shape each relationship.'}
            </p>
            <div className="mt-6 grid grid-cols-3 divide-x divide-white/[0.08]">
              <div className="pr-3"><p className="text-2xl font-display font-semibold">{totalClients}</p><p className="mt-1 text-[9px] font-mono uppercase tracking-[0.12em] text-[#626B77]">{language === 'id' ? 'Client' : 'Clients'}</p></div>
              <div className="px-3"><p className="text-2xl font-display font-semibold">{totalProjects}</p><p className="mt-1 text-[9px] font-mono uppercase tracking-[0.12em] text-[#626B77]">{language === 'id' ? 'Project' : 'Projects'}</p></div>
              <div className="pl-3"><p className="text-2xl font-display font-semibold">{totalServices}</p><p className="mt-1 text-[9px] font-mono uppercase tracking-[0.12em] text-[#626B77]">{language === 'id' ? 'Layanan' : 'Services'}</p></div>
            </div>
          </div>
        }
      />

      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 md:px-12">
        {featured && (
          <section className="mt-12" aria-labelledby="featured-client-title">
            <div className="mb-5 flex items-end justify-between gap-6">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">{language === 'id' ? 'Client spotlight' : 'Client spotlight'}</p>
                <h2 id="featured-client-title" className="mt-3 text-3xl font-display font-semibold tracking-[-0.04em] sm:text-4xl">{featured.client}</h2>
              </div>
              <Link to={'/clients/' + clientSlug(featured.client)} className="hidden items-center gap-2 text-sm text-[#9AA2AD] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 sm:inline-flex">
                {language === 'id' ? 'Lihat profil' : 'View profile'} <ArrowRight size={15} />
              </Link>
            </div>

            <div className="grid overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.025] lg:grid-cols-[1.15fr_0.85fr]">
              <Link to={'/work/' + projectSlug(featured.projects[0])} className="group relative min-h-[320px] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-red/70">
                <img src={featured.projects[0].image} alt={featured.projects[0].title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090A0C] via-[#090A0C]/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <span className="text-[9px] font-mono uppercase tracking-[0.14em] text-brand-red">{featured.projects[0].service}</span>
                  <h3 className="mt-2 text-2xl font-display font-semibold sm:text-3xl">{featured.projects[0].title}</h3>
                </div>
              </Link>

              <div className="flex flex-col justify-between p-6 sm:p-8">
                <div>
                  <div className="flex items-center gap-2 text-[#69727E]"><BriefcaseBusiness size={15} /><span className="text-[9px] font-mono uppercase tracking-[0.14em]">{language === 'id' ? 'Snapshot' : 'Snapshot'}</span></div>
                  <p className="mt-5 text-sm leading-7 text-[#858E9A]">{language === 'id' ? featured.projects[0].descId : featured.projects[0].desc}</p>
                  <div className="mt-7 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/[0.07] bg-black/10 p-4"><p className="text-xl font-display font-semibold">{featured.projects.length}</p><p className="mt-1 text-[9px] font-mono uppercase tracking-[0.12em] text-[#626B77]">{language === 'id' ? 'Project publik' : 'Public projects'}</p></div>
                    <div className="rounded-2xl border border-white/[0.07] bg-black/10 p-4"><p className="text-xl font-display font-semibold">{featured.services.length}</p><p className="mt-1 text-[9px] font-mono uppercase tracking-[0.12em] text-[#626B77]">{language === 'id' ? 'Layanan' : 'Services'}</p></div>
                  </div>
                </div>
                <Link to={'/clients/' + clientSlug(featured.client)} className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-brand-red px-4 py-2.5 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E]">
                  {language === 'id' ? 'Buka client profile' : 'Open client profile'} <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className="mt-20" aria-labelledby="client-directory-title">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">{language === 'id' ? 'Client directory' : 'Client directory'}</p>
              <h2 id="client-directory-title" className="mt-3 text-3xl font-display font-semibold tracking-[-0.04em] sm:text-4xl">{language === 'id' ? 'Temukan konteks yang paling dekat dengan bisnis Anda.' : 'Find the context closest to your business.'}</h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-[#78818D]">{language === 'id' ? 'Gunakan setiap profil untuk melihat project, industri, dan layanan yang terwakili, bukan hanya nama client.' : 'Use each profile to see the represented projects, industries, and services, not just the client name.'}</p>
            </div>

            <div className="divide-y divide-white/[0.08] rounded-[2rem] border border-white/[0.08] bg-white/[0.018]">
              {clientEntries.map((entry, index) => (
                <Link key={entry.client} to={'/clients/' + clientSlug(entry.client)} className="group block p-5 transition-colors hover:bg-white/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-red/70 sm:p-6">
                  <div className="grid gap-5 md:grid-cols-[52px_minmax(0,1fr)_auto] md:items-center">
                    <span className="text-[10px] font-mono tabular-nums text-[#4F5762]">{String(index + 1).padStart(2, '0')}</span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="text-lg font-display font-semibold tracking-[-0.025em] transition-colors group-hover:text-white">{entry.client}</h3>
                        {entry.latestYear && <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#59616D]">{entry.latestYear}</span>}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {entry.industries.slice(0, 2).map((item) => <span key={item} className="rounded-full border border-white/[0.07] bg-white/[0.018] px-2.5 py-1 text-[8px] font-mono uppercase tracking-[0.1em] text-[#6E7783]">{item}</span>)}
                        {entry.services.slice(0, 2).map((item) => <span key={item} className="rounded-full border border-brand-red/15 bg-brand-red/[0.04] px-2.5 py-1 text-[8px] font-mono uppercase tracking-[0.1em] text-brand-red">{item}</span>)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 md:justify-end">
                      <span className="text-xs text-[#69727E]">{entry.projects.length} {language === 'id' ? 'project' : entry.projects.length === 1 ? 'project' : 'projects'}</span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] text-[#69727E] transition-all group-hover:border-white/[0.16] group-hover:text-white"><ArrowUpRight size={15} /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-20 grid gap-4 md:grid-cols-2" aria-label={language === 'id' ? 'Ajakan konsultasi' : 'Consultation call to action'}>
          <div className="rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <div className="flex items-center gap-2 text-[#69727E]"><Layers3 size={15} /><span className="text-[9px] font-mono uppercase tracking-[0.14em]">{language === 'id' ? 'Portfolio signal' : 'Portfolio signal'}</span></div>
            <h2 className="mt-4 text-2xl font-display font-semibold tracking-[-0.035em]">{language === 'id' ? 'Pekerjaan berbeda, kebutuhan juga berbeda.' : 'Different work calls for different needs.'}</h2>
            <p className="mt-3 text-sm leading-7 text-[#78818D]">{language === 'id' ? 'Lihat profil client untuk memahami bagaimana layanan dan konteks industri muncul di dalam pekerjaan yang dipublikasikan.' : 'Open a client profile to understand how services and industry context show up across the published work.'}</p>
          </div>
          <div className="rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">{language === 'id' ? 'Punya kebutuhan serupa?' : 'Have a similar need?'}</p>
            <h2 className="mt-4 text-2xl font-display font-semibold tracking-[-0.035em]">{language === 'id' ? 'Mari bahas konteks project Anda.' : 'Let’s discuss your project context.'}</h2>
            <p className="mt-3 text-sm leading-7 text-[#78818D]">{language === 'id' ? 'Bagikan kebutuhan, target, atau masalah yang sedang Anda hadapi. Kapitech akan membantu menentukan bentuk engagement yang paling relevan.' : 'Share your needs, goals, or current challenge. Kapitech can help identify the most relevant engagement path.'}</p>
            <Link to="/book-a-call" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-3 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E]">
              {language === 'id' ? 'Ajukan konsultasi' : 'Request consultation'} <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};
