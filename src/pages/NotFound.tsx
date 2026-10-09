import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Terminal } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import PublicPageHero from '../components/ui/PublicPageHero';

export const NotFound = () => {
  const { language } = useLanguage();

  return (
    <div className="kapi-page-bg min-h-screen bg-[#0B0C0E] text-white">
      <PublicPageHero
        eyebrow="404 / Not Found"
        title={language === 'id' ? 'Halaman tidak ditemukan.' : 'This page could not be found.'}
        description={language === 'id' ? 'Tautan yang Anda buka mungkin sudah dipindahkan atau tidak tersedia lagi.' : 'The path you opened may have moved or may no longer be available.'}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-red px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-brand-red-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70">
            <ArrowLeft size={16}/> {language === 'id' ? 'Kembali ke Beranda' : 'Return to Home'}
          </Link>
          <Link to="/contact" className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/[0.09] bg-white/[0.02] px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:border-white/[0.16] hover:bg-white/[0.045] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70">
            {language === 'id' ? 'Hubungi Kapitech' : 'Contact Kapitech'}
          </Link>
        </div>
      </PublicPageHero>
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 md:px-12">
        <div className="kapi-surface p-6 text-sm leading-7 text-[#8F97A4] sm:p-8">
          <div className="flex items-center gap-3 text-brand-red"><Terminal size={18}/><span className="font-mono text-[10px] uppercase tracking-[0.15em]">ERROR 404</span></div>
          <p className="mt-4 max-w-2xl">{language === 'id' ? 'Silakan gunakan navigasi utama untuk melanjutkan atau kembali ke halaman sebelumnya.' : 'Use the primary navigation to continue or return to the previous route.'}</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
