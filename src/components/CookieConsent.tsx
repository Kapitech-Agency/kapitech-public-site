import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Cookie, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/LanguageContext';
import { AnimatePresence, motion } from 'motion/react';

const COOKIE_CONSENT_KEY = 'kapitech_cookie_consent';

type ConsentChoice = 'accepted' | 'necessary';

export const CookieConsent = () => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const savedConsent = window.localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentChoice | null;
      if (savedConsent !== 'accepted' && savedConsent !== 'necessary') {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const saveConsent = (choice: ConsentChoice) => {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, choice);
    } catch {
      // Keep the banner dismissible even when browser storage is unavailable.
    }

    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-[120] px-3 pb-3 sm:px-5 sm:pb-5"
          role="dialog"
          aria-label={language === 'id' ? 'Persetujuan cookie' : 'Cookie consent'}
        >
          <div className="mx-auto flex w-full max-w-5xl items-start gap-4 rounded-2xl border border-white/[0.1] bg-[#111318]/96 p-4 shadow-[0_24px_80px_-28px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-5 lg:items-center lg:gap-6">
            <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-red/20 bg-brand-red/[0.08] text-brand-red sm:flex">
              <Cookie size={17} aria-hidden="true" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3 sm:block">
                <div>
                  <p className="text-xs font-semibold text-white sm:text-sm">
                    {language === 'id' ? 'Kami menggunakan cookie' : 'We use cookies'}
                  </p>
                  <p className="mt-1.5 max-w-3xl text-[11px] leading-[1.65] text-[#8A909D] sm:text-xs">
                    {language === 'id'
                      ? 'Cookie membantu menyimpan preferensi dan menjaga pengalaman website tetap berjalan dengan baik. Cookie opsional hanya digunakan setelah Anda memberikan persetujuan.'
                      : 'Cookies help remember preferences and keep the website experience working smoothly. Optional cookies are only used after you give consent.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => saveConsent('necessary')}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025] text-[#8A909D] transition-[background-color,border-color,color] duration-200 hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60 sm:hidden"
                  aria-label={language === 'id' ? 'Gunakan cookie yang diperlukan saja' : 'Use necessary cookies only'}
                >
                  <X size={15} aria-hidden="true" />
                </button>
              </div>

              <Link
                to="/cookie-policy"
                className="mt-2 inline-flex items-center gap-1 text-[10px] font-mono font-medium uppercase tracking-[0.08em] text-[#6F7480] transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
              >
                <span>{language === 'id' ? 'Pelajari kebijakan cookie' : 'Read cookie policy'}</span>
                <ArrowUpRight size={11} aria-hidden="true" />
              </Link>
            </div>

            <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => saveConsent('necessary')}
                className="min-h-[42px] rounded-full border border-white/[0.09] bg-white/[0.025] px-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#C2C7D1] transition-[background-color,border-color,color] duration-200 hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
              >
                {language === 'id' ? 'Hanya yang diperlukan' : 'Only necessary'}
              </button>

              <button
                type="button"
                onClick={() => saveConsent('accepted')}
                className="group inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full bg-brand-red px-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_12px_28px_-16px_rgba(229,9,20,0.9)] transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#FF1E27] hover:shadow-[0_16px_32px_-16px_rgba(229,9,20,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
              >
                <span>{language === 'id' ? 'Terima semua' : 'Accept all'}</span>
                <ArrowUpRight size={12} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
