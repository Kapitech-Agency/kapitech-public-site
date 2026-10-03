import React, { useEffect, useState } from 'react';
import { ArrowUp, ArrowUpRight, CheckCircle2, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/src/lib/LanguageContext';
import { submitToInbox } from '@/src/lib/submissions';

export const Footer = () => {
  const { t, language } = useLanguage();
  const [localTime, setLocalTime] = useState('');
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      setLocalTime(new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(new Date()));
    };

    updateTime();
    const interval = window.setInterval(updateTime, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault();

    const value = email.trim();
    if (!value) return;

    setIsSubscribed(true);
    setEmail('');

    try {
      await submitToInbox({
        fullName: 'Newsletter Subscriber',
        email: value,
        message: `User subscribed to newsletter updates: ${value}`,
        source: 'Footer Newsletter Form',
        type: 'newsletter',
      });
    } catch {
      // Confirmation stays visible even when the network request fails.
    }

    window.setTimeout(() => setIsSubscribed(false), 4000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: t('nav.work'), href: '/work' },
    { name: t('nav.services'), href: '/services' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.careers'), href: '/careers' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  const featuredServices = [
    { name: 'Brand Identity', href: '/services/brand-identity' },
    { name: 'UI/UX Design', href: '/services/ui-ux-design' },
    { name: 'Web Development', href: '/services/web-development' },
    { name: 'Corporate Websites', href: '/services/corporate-websites' },
    { name: 'MVP Development', href: '/services/mvp-development' },
    { name: '3D Visualization', href: '/services/3d-visualization' },
  ];

  const socialLinks = [
    { name: 'Instagram', href: 'https://instagram.com/kapitech.agency' },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/kapitech-agency' },
    { name: 'Behance', href: 'https://behance.net/kapitechagency' },
    { name: 'Dribbble', href: 'https://dribbble.com/kapitechagency' },
  ];

  return (
    <footer
      id="main-footer"
      className="relative overflow-hidden border-t border-white/[0.08] bg-[#0A0B0D]"
      aria-label={language === 'id' ? 'Footer Kapitech Agency' : 'Kapitech Agency footer'}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-red/45 to-transparent" />
        <div className="absolute right-[-12%] top-[-16rem] h-[34rem] w-[34rem] rounded-full bg-brand-red/[0.035] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-12">
        {/* Final CTA */}
        <section className="grid gap-10 border-b border-white/[0.08] py-16 sm:py-20 lg:grid-cols-12 lg:items-end lg:gap-12 lg:py-24">
          <div className="lg:col-span-8">
            <span className="mb-5 inline-flex items-center gap-3 text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-brand-red">
              <span className="h-px w-8 bg-brand-red" aria-hidden="true" />
              {t('footer.cta.tag')}
            </span>

            <h2 className="max-w-4xl text-[clamp(3rem,7vw,6.5rem)] font-display font-semibold leading-[0.9] tracking-[-0.06em] text-white">
              {t('footer.cta.title')}
            </h2>

            <p className="mt-6 max-w-2xl text-sm font-light leading-[1.85] text-[#8A909D] sm:text-base">
              {t('footer.cta.desc')}
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 lg:col-span-4 lg:items-end">
            <Link
              to="/contact"
              id="footer-cta-button"
              className="group inline-flex min-h-[56px] items-center gap-3 rounded-full bg-brand-red px-7 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-[#FF1E27] hover:shadow-[0_20px_42px_-20px_rgba(229,9,20,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60 sm:px-8"
            >
              <span>{t('footer.cta.button')}</span>
              <ArrowUpRight size={17} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.09em] text-[#6A707A]">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-red" aria-hidden="true" />
              <span>{language === 'id' ? 'South Tangerang, Indonesia' : 'South Tangerang, Indonesia'}</span>
              <span className="text-white/15" aria-hidden="true">•</span>
              <span>{localTime || '00:00:00'} WIB</span>
            </div>
          </div>
        </section>

        {/* Brand + navigation */}
        <section className="grid gap-12 py-14 sm:py-16 lg:grid-cols-12 lg:gap-10 lg:py-20">
          <div className="lg:col-span-5">
            <Link
              to="/"
              className="group inline-flex items-center"
              aria-label="Kapitech Agency Home"
            >
              <img
                src="https://raw.githubusercontent.com/Kapitech-Agency/Kapitech-Agency.github.io/main/public/white.png"
                alt="Kapitech Agency"
                className="h-7 w-auto max-w-[160px] object-contain transition-opacity duration-300 group-hover:opacity-85"
              />
            </Link>

            <p className="mt-5 max-w-md text-sm font-light leading-[1.85] text-[#8A909D]">
              {t('footer.about')}
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <a
                href="mailto:hello@kapitech.co.id"
                className="inline-flex w-fit items-center gap-2 text-sm font-medium text-white transition-colors duration-200 hover:text-brand-red"
              >
                <Mail size={14} className="text-brand-red" aria-hidden="true" />
                hello@kapitech.co.id
              </a>
              <div className="inline-flex items-start gap-2 text-xs leading-[1.6] text-[#6A707A]">
                <MapPin size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span>{t('footer.address')}</span>
              </div>
            </div>

            <form onSubmit={handleSubscribe} className="mt-8 max-w-md">
              <label
                htmlFor="footer-newsletter-email"
                className="mb-2.5 block text-[10px] font-mono font-semibold uppercase tracking-[0.14em] text-[#5E646E]"
              >
                {language === 'id' ? 'Project insights' : 'Project insights'}
              </label>

              <div className="flex gap-2">
                <input
                  id="footer-newsletter-email"
                  type="email"
                  placeholder={language === 'id' ? 'Email kerja Anda' : 'Your work email'}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="min-h-[44px] min-w-0 flex-1 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 text-xs text-white placeholder:text-[#4E535D] outline-none transition-[border-color,background-color] duration-200 focus:border-brand-red/45 focus:bg-white/[0.03]"
                />
                <button
                  type="submit"
                  className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full bg-white/[0.06] px-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-white transition-[background-color,color,transform] duration-200 hover:-translate-y-0.5 hover:bg-brand-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
                >
                  {isSubscribed ? <CheckCircle2 size={14} aria-hidden="true" /> : <span>{language === 'id' ? 'Gabung' : 'Join'}</span>}
                </button>
              </div>

              {isSubscribed && (
                <p className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-brand-red">
                  <CheckCircle2 size={11} aria-hidden="true" />
                  {language === 'id' ? 'Terima kasih, Anda sudah terdaftar.' : 'Thanks, you are subscribed.'}
                </p>
              )}
            </form>
          </div>

          <nav className="lg:col-span-2" aria-label={language === 'id' ? 'Navigasi footer' : 'Footer navigation'}>
            <h3 className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-brand-red">
              {language === 'id' ? 'Navigasi' : 'Navigate'}
            </h3>

            <ul className="mt-5 space-y-1.5">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="inline-flex min-h-[32px] items-center text-sm text-[#8A909D] transition-colors duration-200 hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-9 border-t border-white/[0.06] pt-7">
              <h3 className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-[#5E646E]">
                Legal
              </h3>

              <ul className="mt-3 space-y-1">
                {[
                  { name: 'Privacy', href: '/privacy' },
                  { name: 'Terms', href: '/terms' },
                  { name: 'Cookie', href: '/cookie-policy' },
                  { name: 'Editorial', href: '/editorial-policy' },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="inline-flex min-h-[28px] items-center text-[11px] text-[#626872] transition-colors duration-200 hover:text-white"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="lg:col-span-2">
            <h3 className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-brand-red">
              {language === 'id' ? 'Layanan Utama' : 'Selected Services'}
            </h3>

            <ul className="mt-5 space-y-1.5">
              {featuredServices.map((service) => (
                <li key={service.href}>
                  <Link
                    to={service.href}
                    className="inline-flex min-h-[32px] items-center text-sm text-[#8A909D] transition-colors duration-200 hover:text-white"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              to="/services"
              className="mt-5 inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-[0.1em] text-[#6A707A] transition-colors duration-200 hover:text-brand-red"
            >
              <span>{language === 'id' ? 'Lihat semua layanan' : 'View all services'}</span>
              <ArrowUpRight size={12} aria-hidden="true" />
            </Link>
          </div>

          <section className="lg:col-span-3" aria-labelledby="footer-contact-heading">
            <h3 id="footer-contact-heading" className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-brand-red">
              {language === 'id' ? 'Kontak' : 'Contact'}
            </h3>

            <div className="mt-5 border-y border-white/[0.07]">
              <a
                href="mailto:business@kapitech.id"
                className="group flex items-start gap-3 border-b border-white/[0.07] py-4"
              >
                <Mail size={14} className="mt-0.5 shrink-0 text-[#6A707A] transition-colors duration-200 group-hover:text-brand-red" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-[9px] font-mono uppercase tracking-[0.08em] text-[#5E646E]">Business</span>
                  <span className="mt-1 block break-words text-sm font-medium text-white transition-colors duration-200 group-hover:text-brand-red">business@kapitech.id</span>
                </span>
              </a>

              <a
                href="mailto:recruitment@kapitech.id"
                className="group flex items-start gap-3 border-b border-white/[0.07] py-4"
              >
                <Mail size={14} className="mt-0.5 shrink-0 text-[#6A707A] transition-colors duration-200 group-hover:text-brand-red" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-[9px] font-mono uppercase tracking-[0.08em] text-[#5E646E]">{t('footer.recruitment')}</span>
                  <span className="mt-1 block break-words text-sm font-medium text-white transition-colors duration-200 group-hover:text-brand-red">recruitment@kapitech.id</span>
                </span>
              </a>

              <a
                href="tel:+6287769957062"
                className="group flex items-start gap-3 border-b border-white/[0.07] py-4"
              >
                <Phone size={14} className="mt-0.5 shrink-0 text-[#6A707A] transition-colors duration-200 group-hover:text-brand-red" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-[9px] font-mono uppercase tracking-[0.08em] text-[#5E646E]">{t('footer.phone')}</span>
                  <span className="mt-1 block text-sm font-medium text-white transition-colors duration-200 group-hover:text-brand-red">+62 877-6995-7062</span>
                </span>
              </a>

              <div className="flex items-start gap-3 py-4">
                <MapPin size={14} className="mt-0.5 shrink-0 text-[#6A707A]" aria-hidden="true" />
                <span className="text-xs leading-[1.7] text-[#8A909D]">{t('footer.address')}</span>
              </div>
            </div>
          </section>
        </section>

        {/* Social + legal bottom bar */}
        <div className="border-t border-white/[0.08] py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#4E545D]">
                {language === 'id' ? 'Follow Kapitech' : 'Follow Kapitech'}
              </span>

              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#6F757F] transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
                >
                  {social.name}
                </a>
              ))}
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              id="footer-back-to-top"
              className="inline-flex min-h-[38px] w-fit items-center gap-2 text-[10px] font-mono uppercase tracking-[0.08em] text-[#6F757F] transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
            >
              <span>{t('footer.backToTop')}</span>
              <ArrowUp size={13} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/[0.06] py-5 text-[10px] text-[#525862] sm:flex-row sm:items-center sm:justify-between">
          <span>
            © 2021-{new Date().getFullYear()} Kapitech. {language === 'id'
              ? 'Beroperasi di bawah PT Kapitech Digital Indonesia.'
              : 'Operating under PT Kapitech Digital Indonesia.'} {t('footer.rights')}
          </span>

          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link to="/privacy" className="transition-colors hover:text-white">Privacy</Link>
            <Link to="/terms" className="transition-colors hover:text-white">Terms</Link>
            <Link to="/cookie-policy" className="transition-colors hover:text-white">Cookie</Link>
            <Link to="/ai-instructions" className="transition-colors hover:text-white">AI</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
