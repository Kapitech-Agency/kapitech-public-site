import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowUp, CheckCircle2, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/LanguageContext';
import { submitToInbox } from '../lib/submissions';
import { GlassButton } from './ui/PublicUI';

export const Footer = () => {
  const { t, language } = useLanguage();
  const [localTime, setLocalTime] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const update = () => setLocalTime(new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date()));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  const subscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    const value = email.trim();
    if (!value) return;
    setSubscribed(true);
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
      // Keep the confirmation UI independent from network latency.
    }
    window.setTimeout(() => setSubscribed(false), 4000);
  };

  const links = {
    branding: [
      ['Pitch Deck', '/services/pitch-deck'],
      ['Brand Identity', '/services/brand-identity'],
      ['Logo Design', '/services/logo-design'],
      ['Graphic Design', '/services/graphic-design'],
      ['Rebranding', '/services/rebranding'],
    ],
    design: [
      ['UI/UX Design', '/services/ui-ux-design'],
      ['Website Design', '/services/website-design'],
      ['Product Redesign', '/services/product-redesign'],
      ['Website Redesign', '/services/website-redesign'],
      ['UX/UI Audit', '/services/product-ux-ui-audit'],
    ],
    development: [
      ['Web Development', '/services/web-development'],
      ['MVP Development', '/services/mvp-development'],
      ['Landing Page', '/services/landing-page'],
      ['Corporate Websites', '/services/corporate-websites'],
      ['WOW Websites', '/services/wow-websites'],
    ],
  };

  return (
    <footer className="kapi-footer">
      <div className="kapi-container">
        <section className="pb-12 sm:pb-16 border-b border-white/[0.08]">
          <div className="kapi-cta-band">
            <div>
              <span className="kapi-eyebrow">{t('footer.cta.tag')}</span>
              <h2>{t('footer.cta.title')}</h2>
              <p>{t('footer.cta.desc')}</p>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-4">
              <GlassButton to="/contact">{t('footer.cta.button')}</GlassButton>
              <span className="kapi-chip">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red mr-2" />
                South Tangerang · {localTime || '—'} WIB
              </span>
            </div>
          </div>
        </section>

        <div className="kapi-footer-grid py-12 sm:py-16">
          <div className="lg:pr-10">
            <Link to="/" className="kapi-brand">
              <img src="https://raw.githubusercontent.com/Kapitech-Agency/Kapitech-Agency.github.io/main/public/white.png" alt="Kapitech Agency" />
              <span>Kapitech Agency</span>
            </Link>
            <p className="mt-5 max-w-sm">{t('footer.about')}</p>

            <form onSubmit={subscribe} className="mt-7 max-w-sm">
              <label className="block mb-2 text-[10px] font-mono uppercase tracking-[.14em] text-white/30">
                {language === 'id' ? 'Project insights' : 'Project insights'}
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  placeholder={language === 'id' ? 'Email kerja Anda' : 'Your work email'}
                  className="min-w-0 flex-1 h-11 rounded-full border border-white/[0.08] bg-white/[0.025] px-4 text-xs text-white placeholder:text-white/25 outline-none focus:border-brand-red/60"
                />
                <button type="submit" className="h-11 px-4 rounded-full bg-brand-red text-white text-[10px] font-semibold uppercase tracking-[.08em]">
                  {language === 'id' ? 'Kirim' : 'Join'}
                </button>
              </div>
              {subscribed && (
                <div className="mt-3 flex items-center gap-2 text-[11px] text-brand-red">
                  <CheckCircle2 size={13} />
                  {language === 'id' ? 'Terima kasih.' : 'Thanks for subscribing.'}
                </div>
              )}
            </form>
          </div>

          <div>
            <h4>Branding</h4>
            <div className="mt-5 grid gap-2.5">
              {links.branding.map(([label, href]) => <Link to={href} key={href}>{label}</Link>)}
            </div>
          </div>

          <div>
            <h4>Design</h4>
            <div className="mt-5 grid gap-2.5">
              {links.design.map(([label, href]) => <Link to={href} key={href}>{label}</Link>)}
            </div>
          </div>

          <div>
            <h4>Development</h4>
            <div className="mt-5 grid gap-2.5">
              {links.development.map(([label, href]) => <Link to={href} key={href}>{label}</Link>)}
            </div>
          </div>

          <div>
            <h4>{language === 'id' ? 'Contact' : 'Contact'}</h4>
            <div className="mt-5 grid gap-4">
              <a href="mailto:hello@kapitech.id" className="flex items-start gap-3">
                <Mail size={15} className="mt-0.5 text-brand-red" />
                hello@kapitech.id
              </a>
              <a href="mailto:business@kapitech.id" className="flex items-start gap-3">
                <Mail size={15} className="mt-0.5 text-brand-red" />
                business@kapitech.id
              </a>
              <a href="tel:+6287769957062" className="flex items-start gap-3">
                <Phone size={15} className="mt-0.5 text-brand-red" />
                +62 877-6995-7062
              </a>
              <div className="flex items-start gap-3">
                <MapPin size={15} className="mt-0.5 text-brand-red shrink-0" />
                {t('footer.address')}
              </div>
            </div>
          </div>
        </div>

        <div className="kapi-footer-bottom">
          <span>© 2021-{new Date().getFullYear()} Kapitech. {t('footer.rights')}</span>
          <div className="flex items-center gap-5">
            <a href="https://instagram.com/kapitech.agency" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://linkedin.com/company/kapitech-agency" target="_blank" rel="noreferrer">LinkedIn</a>
            <Link to="/privacy">Privacy</Link>
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex items-center gap-2 text-white/50 hover:text-white">
              <span>Top</span><ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
