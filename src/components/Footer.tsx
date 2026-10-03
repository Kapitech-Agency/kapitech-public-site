import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Phone, ArrowUpRight, ArrowUp, CheckCircle2, Globe, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/src/lib/LanguageContext';
import { submitToInbox } from '@/src/lib/submissions';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [localTime, setLocalTime] = useState('');
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setLocalTime(new Intl.DateTimeFormat('en-GB', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      const emailToSubmit = email.trim();
      setIsSubscribed(true);
      try {
        await submitToInbox({
          fullName: 'Newsletter Subscriber',
          email: emailToSubmit,
          message: `User subscribed to newsletter updates: ${emailToSubmit}`,
          source: 'Footer Newsletter Form',
          type: 'newsletter'
        });
      } catch (err) {
        console.warn('Newsletter submission error:', err);
      }
      setTimeout(() => setIsSubscribed(false), 4000);
      setEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const brandingServices = [
    { name: 'Pitch Deck', desc: 'Get visuals that raise capital', href: '/services/pitch-deck' },
    { name: 'Brand Identity', desc: 'Build trust with design', href: '/services/brand-identity' },
    { name: 'Logo Design', desc: 'Become unforgettable', href: '/services/logo-design' },
    { name: 'Graphic Design', desc: 'Illustrations, Icons, Social media', href: '/services/graphic-design' },
    { name: 'Rebranding', desc: 'Rebrand to grow and convert', href: '/services/rebranding' },
  ];

  const designServices = [
    { name: 'UI/UX Design', desc: 'Web & digital product design', href: '/services/ui-ux-design' },
    { name: 'Website Design', desc: 'Custom websites & landings', href: '/services/website-design' },
    { name: 'Product Redesign', desc: 'Refine digital products and experiences', href: '/services/product-redesign' },
    { name: 'Website Redesign', desc: 'Modern look, higher impact', href: '/services/website-redesign' },
    { name: 'Product UX/UI Audit', desc: 'Insights that drive results', href: '/services/product-ux-ui-audit' },
  ];

  const devServices = [
    { name: 'Web Development', desc: 'Front-End & Back-End Development', href: '/services/web-development' },
    { name: 'MVP Development', desc: 'MVPs that attract funding', href: '/services/mvp-development' },
    { name: 'Landing page', desc: 'High-converting website', href: '/services/landing-page' },
    { name: 'Corporate Websites', desc: 'Built for scale and trust', href: '/services/corporate-websites' },
    { name: 'WOW Websites', desc: 'Professional, scalable, fast website', href: '/services/wow-websites' },
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://instagram.com/kapitech.agency',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      name: 'X (Twitter)',
      href: 'https://x.com/kapitechagency',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    {
      name: 'Threads',
      href: 'https://threads.net/@kapitech.agency',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.186 24C5.466 24 0 18.678 0 12.132 0 5.586 5.466.264 12.186.264c6.72 0 12.186 5.322 12.186 11.868 0 1.716-.364 3.372-1.054 4.882-.244.534-.866.772-1.4.526-.534-.244-.772-.866-.526-1.4.59-1.294.9-2.71.9-4.008 0-5.404-4.52-9.8-10.106-9.8-5.586 0-10.106 4.396-10.106 9.8 0 5.404 4.52 9.8 10.106 9.8 2.28 0 4.456-.764 6.238-2.19.466-.374 1.144-.306 1.518.16.374.466.306 1.144-.16 1.518C17.702 23.082 15.028 24 12.186 24zm4.18-8.232c-.144 0-.288-.046-.412-.138-1.074-.796-2.316-1.22-3.684-1.22-2.736 0-4.962 1.838-4.962 4.096 0 2.258 2.226 4.096 4.962 4.096 1.898 0 3.632-.88 4.542-2.314.33-.522.986-.678 1.508-.348.522.33.678.986.348 1.508-1.238 1.95-3.52 3.12-6.398 3.12-3.834 0-6.962-2.678-6.962-5.962s3.128-5.962 6.962-5.962c1.784 0 3.424.582 4.832 1.666.474.364.568 1.036.204 1.51-.238.312-.602.484-.94.484z"/>
        </svg>
      )
    },
    {
      name: 'TikTok',
      href: 'https://tiktok.com/@kapitechagency',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      )
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/@kapitechagency',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
    {
      name: 'Behance',
      href: 'https://behance.net/kapitechagency',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.171 3-4.144 0-6.555-2.777-6.555-6.666 0-3.889 2.411-6.667 6.555-6.667 4.095 0 6.27 2.778 6.27 6.667 0 .556-.05 1.056-.115 1.5H16.03c.12 1.833 1.487 2.889 3.07 2.889 1.353 0 2.308-.722 2.626-1.723h2zm-7.971-4.167h4.095c-.12-1.722-1.383-2.611-2.072-2.611-.84 0-1.854.889-2.023 2.611zm-10.755-6.166h-5v14h5.275c3.212 0 5.48-1.579 5.48-4.524 0-1.785-.92-3.155-2.483-3.83 1.218-.625 1.942-1.785 1.942-3.321 0-2.67-1.956-4.325-5.214-4.325zm-2.4 2.333h2.378c1.614 0 2.622.756 2.622 2.111 0 1.333-.984 2.167-2.622 2.167h-2.378v-4.278zm0 6.667h2.72c1.784 0 2.87.889 2.87 2.444 0 1.556-1.086 2.556-2.87 2.556h-2.72v-5z"/>
        </svg>
      )
    },
    {
      name: 'Dribbble',
      href: 'https://dribbble.com/kapitechagency',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm9.849 10.605c-.326-.062-2.584-.474-5.215-.224-.131-.299-.272-.601-.418-.905-.331-.692-.693-1.385-1.077-2.059 3.013-1.378 4.237-2.973 4.316-3.082 1.5 1.706 2.394 3.901 2.394 6.27zm-4.321-7.481c-.131.168-1.341 1.674-4.223 2.981-1.572-2.784-3.27-5.111-3.411-5.303 1.282-.516 2.686-.802 4.156-.802 1.258 0 2.457.214 3.478.624zm-9.351-1.748c.134.182 1.83 2.493 3.407 5.257-2.316.809-4.887 1.249-7.585 1.325.753-2.929 2.502-5.385 4.178-6.582zm-6.177 8.624v-.234c2.898-.078 5.666-.549 8.163-1.42.278.536.541 1.082.786 1.632.123.276.241.551.353.824-3.328 1.053-6.574 3.968-7.906 7.641-1.921-2.128-3.096-4.908-3.396-8.443zm1.699 9.943c1.233-3.425 4.22-6.155 7.378-7.147 1.343 3.551 2.062 7.027 2.215 7.828-2.617 1.229-5.597 1.246-9.593-.681zm11.23 1.134c-.183-.872-.919-4.234-2.227-7.697 2.457-.272 4.606.115 4.906.177-.384 3.197-2.348 5.922-5.079 7.52z"/>
        </svg>
      )
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/kapitechagency',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/kapitech-agency',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      )
    }
  ];

  return (
    <footer
      className="relative overflow-hidden border-t border-white/[0.08] bg-[#0B0C0E]"
      id="main-footer"
      aria-label={language === 'id' ? 'Footer Kapitech Agency' : 'Kapitech Agency footer'}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 right-[-12%] h-[34rem] w-[34rem] rounded-full bg-brand-red/[0.055] blur-[120px]" />
        <div className="absolute bottom-[-18rem] left-[-8%] h-[30rem] w-[30rem] rounded-full bg-white/[0.02] blur-[100px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-red/40 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 sm:pb-10 sm:pt-20 md:px-12 lg:pt-24">
        {/* Primary CTA */}
        <section className="border-b border-white/[0.08] pb-16 sm:pb-20" aria-labelledby="footer-cta-title">
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
              <span className="mb-4 inline-flex items-center gap-2 text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-brand-red">
                <span className="h-px w-7 bg-brand-red" aria-hidden="true" />
                {t('footer.cta.tag')}
              </span>
              <h2
                id="footer-cta-title"
                className="max-w-4xl text-4xl font-display font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-5xl md:text-6xl lg:text-[5.25rem]"
              >
                {t('footer.cta.title')}
              </h2>
              <p className="mt-5 max-w-2xl text-sm font-light leading-[1.8] text-[#8A909D] sm:text-base">
                {t('footer.cta.desc')}
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 lg:col-span-4 lg:items-end">
              <Link
                to="/contact"
                id="footer-cta-button"
                className="group inline-flex min-h-[52px] items-center gap-3 rounded-full bg-brand-red px-7 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-[0_18px_40px_-22px_rgba(229,9,20,0.9)] transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-[#FF1E27] hover:shadow-[0_22px_46px_-20px_rgba(229,9,20,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60 sm:px-8"
              >
                <span>{t('footer.cta.button')}</span>
                <ArrowUpRight size={17} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <div className="inline-flex items-center gap-2.5 text-[10px] font-mono uppercase tracking-[0.08em] text-[#8A909D]">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inset-0 rounded-full bg-brand-red opacity-50 blur-[2px]" />
                  <span className="relative h-2 w-2 rounded-full bg-brand-red" />
                </span>
                <span>{language === 'id' ? 'Tangerang Selatan, Indonesia' : 'South Tangerang, Indonesia'}</span>
                <span className="text-white/15" aria-hidden="true">•</span>
                <span>{localTime || '00:00:00'} WIB</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main footer navigation */}
        <div className="grid grid-cols-1 gap-12 py-14 sm:py-16 lg:grid-cols-12 lg:gap-8 lg:py-20">
          {/* Brand / newsletter */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3 group" aria-label="Kapitech Agency Home">
              <img
                src="https://raw.githubusercontent.com/Kapitech-Agency/Kapitech-Agency.github.io/main/public/white.png"
                alt="Kapitech Agency"
                className="h-7 w-auto max-w-[150px] object-contain transition-opacity duration-300 group-hover:opacity-90"
              />
            </Link>

            <p className="mt-5 max-w-md text-sm font-light leading-[1.8] text-[#8A909D]">
              {t('footer.about')}
            </p>

            <a
              href="mailto:hello@kapitech.co.id"
              className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-white transition-colors duration-200 hover:text-brand-red"
            >
              <Mail size={14} className="text-brand-red" aria-hidden="true" />
              hello@kapitech.co.id
            </a>

            <div className="mt-9">
              <span className="mb-2.5 block text-[10px] font-mono font-semibold uppercase tracking-[0.14em] text-[#6F7480]">
                {language === 'id' ? 'Wawasan proyek' : 'Project insights'}
              </span>

              <form onSubmit={handleSubscribe} className="flex w-full max-w-md flex-col gap-2.5 sm:flex-row">
                <label htmlFor="footer-newsletter-email" className="sr-only">
                  {language === 'id' ? 'Email bisnis' : 'Work email'}
                </label>
                <input
                  id="footer-newsletter-email"
                  type="email"
                  placeholder={language === 'id' ? 'Masukkan email bisnis Anda' : 'Enter your work email'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="min-h-[46px] min-w-0 flex-1 rounded-xl border border-white/[0.09] bg-white/[0.025] px-4 text-xs text-white placeholder:text-[#6F7480] outline-none transition-[border-color,background-color] duration-200 focus:border-brand-red/50 focus:bg-white/[0.04]"
                />
                <button
                  type="submit"
                  className="min-h-[46px] shrink-0 rounded-xl border border-brand-red/30 bg-brand-red px-5 text-xs font-semibold text-white transition-[background-color,border-color,box-shadow] duration-200 hover:border-brand-red/50 hover:bg-[#FF1E27] hover:shadow-[0_12px_28px_-18px_rgba(229,9,20,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
                >
                  {isSubscribed
                    ? (language === 'id' ? 'Terdaftar!' : 'Subscribed!')
                    : (language === 'id' ? 'Langganan' : 'Subscribe')}
                </button>
              </form>

              {isSubscribed && (
                <p className="mt-2.5 flex items-center gap-1.5 text-[10px] font-mono text-brand-red">
                  <CheckCircle2 size={12} aria-hidden="true" />
                  {language === 'id'
                    ? 'Terima kasih telah berlangganan info Kapitech Agency.'
                    : 'Thank you for subscribing to Kapitech Agency updates.'}
                </p>
              )}
            </div>
          </div>

          {/* Explore */}
          <nav className="lg:col-span-2" aria-label={language === 'id' ? 'Navigasi footer' : 'Footer navigation'}>
            <h3 className="mb-4 text-[10px] font-mono font-semibold uppercase tracking-[0.15em] text-brand-red">
              {language === 'id' ? 'Jelajahi' : 'Explore'}
            </h3>
            <ul className="space-y-2.5">
              {[
                { name: t('nav.work'), href: '/work' },
                { name: t('nav.services'), href: '/services' },
                { name: t('nav.about'), href: '/about' },
                { name: t('nav.careers'), href: '/careers' },
                { name: t('nav.contact'), href: '/contact' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="inline-flex min-h-[30px] items-center text-xs font-medium text-[#8A909D] transition-colors duration-200 hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>


          </nav>

          {/* Capabilities */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 text-[10px] font-mono font-semibold uppercase tracking-[0.15em] text-brand-red">
              {language === 'id' ? 'Kapabilitas' : 'Capabilities'}
            </h3>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-5">
              <div>
                <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.1em] text-[#6F7480]">Brand & Design</p>
                <ul className="space-y-2.5">
                  {[...brandingServices.slice(0, 3), ...designServices.slice(0, 3)].map((srv) => (
                    <li key={srv.name}>
                      <Link
                        to={srv.href}
                        className="group inline-flex min-h-[30px] items-center text-xs font-medium text-[#8A909D] transition-colors duration-200 hover:text-white"
                      >
                        <span className="transition-colors duration-200 group-hover:text-brand-red">{srv.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.1em] text-[#6F7480]">Development</p>
                <ul className="space-y-2.5">
                  {devServices.map((srv) => (
                    <li key={srv.name}>
                      <Link
                        to={srv.href}
                        className="group inline-flex min-h-[30px] items-center text-xs font-medium text-[#8A909D] transition-colors duration-200 hover:text-white"
                      >
                        <span className="transition-colors duration-200 group-hover:text-brand-red">{srv.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Contact */}
          <section className="lg:col-span-3" aria-labelledby="footer-contact-title">
            <h3 id="footer-contact-title" className="mb-4 text-[10px] font-mono font-semibold uppercase tracking-[0.15em] text-brand-red">
              {t('footer.contactsTitle')}
            </h3>
            <div className="space-y-1">
              <a
                href="mailto:hello@kapitech.co.id"
                className="group flex min-h-[54px] items-center gap-3 border-b border-white/[0.06] py-2.5 transition-colors duration-200"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-brand-red transition-colors duration-200 group-hover:border-brand-red/30">
                  <Mail size={13} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[9px] font-mono uppercase tracking-[0.08em] text-[#6F7480]">{t('footer.clientInquiry')}</span>
                  <span className="mt-0.5 block break-words text-xs font-medium text-white transition-colors duration-200 group-hover:text-brand-red">hello@kapitech.co.id</span>
                </span>
              </a>

              <a
                href="mailto:business@kapitech.id"
                className="group flex min-h-[54px] items-center gap-3 border-b border-white/[0.06] py-2.5 transition-colors duration-200"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-brand-red transition-colors duration-200 group-hover:border-brand-red/30">
                  <Globe size={13} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[9px] font-mono uppercase tracking-[0.08em] text-[#6F7480]">{language === 'id' ? 'Kerja Sama Bisnis' : 'Business Inquiry'}</span>
                  <span className="mt-0.5 block break-words text-xs font-medium text-white transition-colors duration-200 group-hover:text-brand-red">business@kapitech.id</span>
                </span>
              </a>

              <a
                href="mailto:recruitment@kapitech.id"
                className="group flex min-h-[54px] items-center gap-3 border-b border-white/[0.06] py-2.5 transition-colors duration-200"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-brand-red transition-colors duration-200 group-hover:border-brand-red/30">
                  <Briefcase size={13} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[9px] font-mono uppercase tracking-[0.08em] text-[#6F7480]">{t('footer.recruitment')}</span>
                  <span className="mt-0.5 block break-words text-xs font-medium text-white transition-colors duration-200 group-hover:text-brand-red">recruitment@kapitech.id</span>
                </span>
              </a>

              <a
                href="tel:+6287769957062"
                className="group flex min-h-[54px] items-center gap-3 border-b border-white/[0.06] py-2.5 transition-colors duration-200"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-brand-red transition-colors duration-200 group-hover:border-brand-red/30">
                  <Phone size={13} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[9px] font-mono uppercase tracking-[0.08em] text-[#6F7480]">{t('footer.phone')}</span>
                  <span className="mt-0.5 block text-xs font-medium text-white transition-colors duration-200 group-hover:text-brand-red">+62 877-6995-7062</span>
                </span>
              </a>

              <div className="flex items-start gap-3 pt-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-brand-red">
                  <MapPin size={13} aria-hidden="true" />
                </span>
                <div>
                  <span className="block text-[9px] font-mono uppercase tracking-[0.08em] text-[#6F7480]">{t('footer.addressTitle')}</span>
                  <p className="mt-1 text-xs font-light leading-[1.6] text-white/85">
                    {t('footer.address')}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Social channels */}
        <div className="flex flex-col gap-5 border-t border-white/[0.08] py-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-[0.14em] text-[#6F7480]">
              {language === 'id' ? 'Kanal resmi' : 'Official channels'}
            </span>
            <span className="mt-1 block text-xs text-[#8A909D]">
              {language === 'id' ? 'Ikuti pekerjaan dan pembaruan Kapitech.' : 'Follow Kapitech work and updates.'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                title={social.name}
                className="flex h-10 min-h-[40px] w-10 min-w-[40px] items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-[#8A909D] transition-[background-color,border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-brand-red/25 hover:bg-brand-red/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom utility bar */}
        <div className="flex flex-col gap-5 border-t border-white/[0.08] pt-6 text-[11px] text-[#6F7480] sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-3xl leading-[1.7]">
            © 2021-{currentYear} Kapitech. {language === 'id'
              ? 'Beroperasi di bawah naungan PT Kapitech Digital Indonesia.'
              : 'Operating under PT Kapitech Digital Indonesia.'} {t('footer.rights')}
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {[
              { name: language === 'id' ? 'Privacy' : 'Privacy', href: '/privacy' },
              { name: language === 'id' ? 'Terms' : 'Terms', href: '/terms' },
              { name: language === 'id' ? 'Cookie' : 'Cookie', href: '/cookie-policy' },
              { name: language === 'id' ? 'AI' : 'AI', href: '/ai-instructions' },
              { name: language === 'id' ? 'Editorial' : 'Editorial', href: '/editorial-policy' },
            ].map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="transition-colors duration-200 hover:text-white"
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={scrollToTop}
              id="footer-back-to-top"
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.025] px-3.5 py-2 text-[10px] font-mono uppercase tracking-[0.06em] text-[#8A909D] transition-[background-color,border-color,color] duration-200 hover:border-white/[0.15] hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
            >
              <span>{t('footer.backToTop')}</span>
              <ArrowUp size={13} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
