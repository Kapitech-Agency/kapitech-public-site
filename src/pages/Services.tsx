import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/LanguageContext';
import { allSolutionsAndServices } from '../data/servicesData';
import { GlassPanel, PageHero, Reveal, SectionHeader } from '../components/ui/PublicUI';

type Category = 'All' | 'Solutions' | 'Branding' | 'Design' | 'Development';

export const Services = () => {
  const { language } = useLanguage();
  const [category, setCategory] = useState<Category>('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return allSolutionsAndServices.filter(item => {
      const categoryMatch = category === 'All' || item.category === category;
      const q = query.trim().toLowerCase();
      const text = [item.title, item.navSubtitle, item.heroHeadline, item.heroSubtitle].join(' ').toLowerCase();
      return categoryMatch && (!q || text.includes(q));
    });
  }, [category, query]);

  const categories: Category[] = ['All', 'Solutions', 'Branding', 'Design', 'Development'];

  return (
    <div className="kapi-page kapi-services-page">
      <PageHero
        eyebrow={language === 'id' ? 'Services & strategic solutions' : 'Services & strategic solutions'}
        title={language === 'id' ? <>Kapabilitas yang menjaga <span className="text-brand-red">brand, product,</span> dan web tetap bergerak.</> : <>Capabilities for <span className="text-brand-red">brand, product,</span> and web.</>}
        description={language === 'id'
          ? 'Pilih solusi strategis atau kapabilitas spesialis sesuai kebutuhan project Anda.'
          : 'Choose a strategic engagement or a specialist capability that fits your project.'}
      />

      <section className="kapi-section pt-10 sm:pt-14">
        <div className="kapi-container">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-9">
            <div className="kapi-filter-inner">
              {categories.map(item => (
                <button key={item} type="button" className={`kapi-filter-button ${category === item ? 'is-active' : ''}`} onClick={() => setCategory(item)}>
                  {item === 'All' ? (language === 'id' ? 'Semua' : 'All') : item}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Search size={15} className="text-white/28" />
              <input className="kapi-search" value={query} onChange={event => setQuery(event.target.value)} placeholder={language === 'id' ? 'Cari layanan...' : 'Search services...'} />
            </div>
          </div>

          <div className="grid gap-14">
            {(['Solutions', 'Branding', 'Design', 'Development'] as const).map(section => {
              const sectionItems = filtered.filter(item => item.category === section);
              if (!sectionItems.length) return null;
              return (
                <section key={section}>
                  <SectionHeader
                    eyebrow={section}
                    title={
                      section === 'Solutions'
                        ? (language === 'id' ? 'Model engagement strategis.' : 'Strategic engagement models.')
                        : section === 'Branding'
                          ? (language === 'id' ? 'Identitas yang konsisten di setiap touchpoint.' : 'Identity systems that stay consistent.')
                          : section === 'Design'
                            ? (language === 'id' ? 'Pengalaman produk yang mudah dipahami.' : 'Product experiences people understand.')
                            : (language === 'id' ? 'Engineering yang siap dipakai.' : 'Engineering built to ship.')
                    }
                  />

                  <div className="kapi-service-grid">
                    {sectionItems.map((item, index) => (
                      <Reveal key={item.slug} delay={Math.min(index, 6) * 0.04}>
                        <Link to={item.type === 'solution' ? `/solutions/${item.slug}` : `/services/${item.slug}`} className="block h-full">
                          <GlassPanel className="kapi-service-card kapi-panel--interactive h-full">
                            <div className="flex items-start justify-between gap-5">
                              <div>
                                <span className="kapi-chip kapi-chip--accent">{item.badge}</span>
                                <h3 className="mt-5">{item.title}</h3>
                                <p>{language === 'id' ? item.heroSubtitleId : item.heroSubtitle}</p>
                              </div>
                              <div className="w-10 h-10 rounded-full border border-white/[0.08] grid place-items-center text-white/45 shrink-0">
                                <ArrowUpRight size={16} />
                              </div>
                            </div>
                            <div className="kapi-service-links">
                              {(language === 'id' ? item.capabilities.map(x => x.titleId) : item.capabilities.map(x => x.title)).slice(0,4).map(capability => (
                                <span className="kapi-chip" key={capability}>{capability}</span>
                              ))}
                            </div>
                          </GlassPanel>
                        </Link>
                      </Reveal>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          <Reveal className="mt-16">
            <div className="kapi-cta-band">
              <div>
                <span className="kapi-eyebrow">{language === 'id' ? 'Butuh scope yang lebih spesifik?' : 'Need a more specific scope?'}</span>
                <h2>{language === 'id' ? 'Ceritakan tujuan project Anda.' : 'Tell us what you are trying to build.'}</h2>
                <p>{language === 'id' ? 'Kami akan membantu memilih service mix dan delivery model yang paling masuk akal.' : 'We can help shape the right service mix and delivery model.'}</p>
              </div>
              <div className="flex justify-start lg:justify-end">
                <Link to="/contact" className="kapi-button kapi-button--primary">
                  {language === 'id' ? 'Mulai diskusi' : 'Start a conversation'}
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
