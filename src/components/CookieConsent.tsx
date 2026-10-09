import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/LanguageContext';
import { AnimatePresence, motion } from 'motion/react';
import { revokeOptionalAnalyticsConsent } from '../lib/analytics';

const COOKIE_CONSENT_KEY = 'kapitech_cookie_consent';

type ConsentChoice = 'accepted' | 'necessary';

export const CookieConsent = () => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    try {
      const savedConsent = window.localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentChoice | null;
      if (savedConsent === 'accepted') setAnalyticsEnabled(true);
      if (savedConsent !== 'accepted' && savedConsent !== 'necessary') setIsVisible(true);
    } catch {
      setIsVisible(true);
    }

    const handleOpenPreferences = () => {
      try {
        setAnalyticsEnabled(window.localStorage.getItem(COOKIE_CONSENT_KEY) === 'accepted');
      } catch {
        setAnalyticsEnabled(false);
      }
      setIsVisible(true);
      setShowPreferences(true);
    };
    window.addEventListener('kapitech_open_cookie_preferences', handleOpenPreferences);
    return () => window.removeEventListener('kapitech_open_cookie_preferences', handleOpenPreferences);
  }, []);

  const saveConsent = (choice: ConsentChoice) => {
    const optionalAnalyticsAllowed = choice === 'accepted';
    setAnalyticsEnabled(optionalAnalyticsAllowed);

    if (!optionalAnalyticsAllowed) {
      revokeOptionalAnalyticsConsent();
    }

    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, choice);
    } catch {
      // Keep the banner dismissible even when browser storage is unavailable.
    }

    window.dispatchEvent(new CustomEvent('kapitech_consent_changed', { detail: { choice } }));
    setIsVisible(false);
    setShowPreferences(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="kapi-cookie-consent fixed inset-x-0 bottom-0 z-[120] px-3 pb-3 sm:px-5 sm:pb-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-consent-title"
        >
          <div className="kapi-modal-surface mx-auto w-full max-w-4xl p-4 sm:p-5">
            {!showPreferences ? (
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
                <div className="min-w-0 flex-1">
                  <p id="cookie-consent-title" className="text-xs font-semibold text-white sm:text-sm">{language === 'id' ? 'Kami menggunakan cookie' : 'We use cookies'}</p>
                  <p className="mt-1.5 max-w-3xl text-[11px] leading-[1.65] text-[#8A909D] sm:text-xs">{language === 'id' ? 'Storage esensial menjaga fungsi website. Analytics dan attribution opsional hanya berjalan setelah consent.' : 'Essential storage supports website functions. Optional analytics and attribution only run after consent.'}</p>
                  <Link to="/cookie-policy" className="mt-2 inline-flex text-[10px] font-mono uppercase tracking-[0.08em] text-[#6F7480] hover:text-white">{language === 'id' ? 'Baca kebijakan cookie' : 'Read cookie policy'}</Link>
                </div>
                <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                  <button type="button" onClick={() => setShowPreferences(true)} className="min-h-[42px] rounded-full border border-white/[0.09] bg-white/[0.025] px-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#C2C7D1] hover:bg-white/[0.06]">{language === 'id' ? 'Kelola preferensi' : 'Manage preferences'}</button>
                  <button type="button" onClick={() => saveConsent('necessary')} className="min-h-[42px] rounded-full border border-white/[0.09] bg-white/[0.025] px-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#C2C7D1] hover:bg-white/[0.06]">{language === 'id' ? 'Hanya yang diperlukan' : 'Only necessary'}</button>
                  <button type="button" onClick={() => saveConsent('accepted')} className="min-h-[42px] rounded-full bg-brand-red px-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-white hover:bg-[#FF1E27]">{language === 'id' ? 'Terima semua' : 'Accept all'}</button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div><p id="cookie-consent-title" className="text-sm font-semibold text-white">{language === 'id' ? 'Kelola preferensi cookie' : 'Manage cookie preferences'}</p><p className="mt-1.5 text-xs leading-6 text-[#858D99]">{language === 'id' ? 'Kapitech saat ini mengelompokkan analytics dan attribution sebagai satu kategori opsional.' : 'Kapitech currently groups analytics and attribution into one optional category.'}</p></div>
                  <button type="button" onClick={() => setShowPreferences(false)} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02] text-[#8A909D] hover:text-white" aria-label="Close cookie preferences"><X size={15}/></button>
                </div>
                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.018] p-4"><div className="flex items-center justify-between gap-4"><div><p className="text-sm font-semibold text-white">{language === 'id' ? 'Essential storage' : 'Essential storage'}</p><p className="mt-1 text-xs leading-5 text-[#767E8A]">{language === 'id' ? 'Diperlukan untuk consent, bahasa, tema, dan fungsi website dasar.' : 'Required for consent, language, theme, and core website functions.'}</p></div><span className="rounded-full border border-white/[0.08] px-3 py-1 text-[9px] font-mono uppercase text-[#7D8591]">{language === 'id' ? 'Selalu aktif' : 'Always on'}</span></div></div>
                  <button type="button" onClick={() => setAnalyticsEnabled((value) => !value)} className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.018] p-4 text-left"><div className="flex items-center justify-between gap-4"><div><p className="text-sm font-semibold text-white">{language === 'id' ? 'Analytics & attribution' : 'Analytics & attribution'}</p><p className="mt-1 text-xs leading-5 text-[#767E8A]">{language === 'id' ? 'Digunakan untuk pengukuran penggunaan website dan campaign setelah consent.' : 'Used for website usage and campaign measurement after consent.'}</p></div><span className={analyticsEnabled ? 'relative h-6 w-11 rounded-full bg-brand-red' : 'relative h-6 w-11 rounded-full bg-white/[0.12]'}><span className={analyticsEnabled ? 'absolute right-1 top-1 h-4 w-4 rounded-full bg-white' : 'absolute left-1 top-1 h-4 w-4 rounded-full bg-white'} /></span></div></button>
                </div>
                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <button type="button" onClick={() => saveConsent('necessary')} className="min-h-[42px] rounded-full border border-white/[0.09] px-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#C2C7D1]">{language === 'id' ? 'Simpan tanpa analytics' : 'Save without analytics'}</button>
                  <button type="button" onClick={() => saveConsent(analyticsEnabled ? 'accepted' : 'necessary')} className="min-h-[42px] rounded-full bg-brand-red px-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">{language === 'id' ? 'Simpan preferensi' : 'Save preferences'}</button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

    </AnimatePresence>
  );
};
