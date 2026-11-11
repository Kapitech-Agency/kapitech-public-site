import React, { useEffect, useRef, useState } from 'react';
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

  const savedChoice = useRef<ConsentChoice | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const banner = useRef<HTMLDivElement>(null);
  const bannerTrigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      const savedConsent = window.localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentChoice | null;
      if (savedConsent === 'accepted' || savedConsent === 'necessary') savedChoice.current = savedConsent;
      if (savedConsent === 'accepted') setAnalyticsEnabled(true);
      if (savedConsent !== 'accepted' && savedConsent !== 'necessary') setIsVisible(true);
    } catch {
      setIsVisible(true);
    }

    const handleOpenPreferences = (event: Event) => {
      const trigger = event instanceof CustomEvent ? event.detail : document.activeElement;
      opener.current = trigger instanceof HTMLElement ? trigger : null;
      setAnalyticsEnabled(savedChoice.current === 'accepted');
      setShowPreferences(true);
    };
    window.addEventListener('kapitech_open_cookie_preferences', handleOpenPreferences);
    return () => window.removeEventListener('kapitech_open_cookie_preferences', handleOpenPreferences);
  }, []);

  useEffect(() => {
    if (!showPreferences) return;
    const panel = dialog.current;
    panel?.showModal();
    return () => panel?.close();
  }, [showPreferences]);

  useEffect(() => {
    const element = banner.current;
    const shell = element?.closest<HTMLElement>('.kapi-public-shell');
    if (!element || !shell || !isVisible || showPreferences) return;

    const update = () => shell.style.setProperty('--kapi-cookie-banner-height', element.offsetHeight + 'px');
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      observer.disconnect();
      shell.style.removeProperty('--kapi-cookie-banner-height');
    };
  }, [isVisible, showPreferences]);

  const closePreferences = (returnToBanner: boolean) => {
    dialog.current?.close();
    setShowPreferences(false);
    const trigger = opener.current;
    opener.current = null;
    window.requestAnimationFrame(() => {
      const target = trigger?.isConnected ? trigger : returnToBanner ? bannerTrigger.current : null;
      target?.focus({ preventScroll: true });
    });
  };

  const saveConsent = (choice: ConsentChoice) => {
    const optionalAnalyticsAllowed = choice === 'accepted';
    savedChoice.current = choice;
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
    if (showPreferences) closePreferences(false);
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && !showPreferences && (
          <motion.div
            ref={banner}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="kapi-cookie-consent fixed inset-x-0 bottom-0 z-[120] px-3 pb-3 sm:px-5 sm:pb-5"
            role="region"
            aria-label={language === 'id' ? 'Preferensi cookie' : 'Cookie preferences'}
          >
            <div className="kapi-modal-surface mx-auto w-full max-w-4xl p-3 sm:p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
                <div className="min-w-0 flex-1">
                  <p id="cookie-consent-title" className="text-xs font-semibold text-white sm:text-sm">{language === 'id' ? 'Kami menggunakan cookie' : 'We use cookies'}</p>
                  <p className="mt-1.5 max-w-3xl text-[11px] leading-[1.65] text-text-body sm:text-xs">{language === 'id' ? 'Storage esensial menjaga fungsi website. Analytics dan attribution opsional hanya berjalan setelah consent.' : 'Essential storage supports website functions. Optional analytics and attribution only run after consent.'}</p>
                  <Link to="/cookie-policy" className="mt-2 inline-flex text-[10px] font-mono uppercase tracking-[0.08em] text-[#6F7480] hover:text-white">{language === 'id' ? 'Baca kebijakan cookie' : 'Read cookie policy'}</Link>
                </div>
                <div className="grid w-full grid-cols-2 gap-2 sm:flex lg:w-auto">
                  <button type="button" ref={bannerTrigger} aria-haspopup="dialog" onClick={() => {
                    setAnalyticsEnabled(savedChoice.current === 'accepted');
                    setShowPreferences(true);
                  }} className="min-h-[42px] rounded-full border border-white/[0.09] bg-white/[0.025] px-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#C2C7D1] hover:bg-white/[0.06]">{language === 'id' ? 'Kelola preferensi' : 'Manage preferences'}</button>
                  <button type="button" onClick={() => saveConsent('necessary')} className="min-h-[42px] rounded-full border border-white/[0.09] bg-white/[0.025] px-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#C2C7D1] hover:bg-white/[0.06]">{language === 'id' ? 'Hanya yang diperlukan' : 'Only necessary'}</button>
                  <button type="button" onClick={() => saveConsent('accepted')} className="col-span-2 min-h-[42px] rounded-full bg-brand-red px-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-white hover:bg-[#C40F34]">{language === 'id' ? 'Terima semua' : 'Accept all'}</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {showPreferences && (
        <dialog
          ref={dialog}
          aria-labelledby="cookie-preferences-title"
          onCancel={(event) => {
            event.preventDefault();
            closePreferences(isVisible);
          }}
          className="kapi-cookie-dialog kapi-modal-surface fixed inset-x-3 top-auto bottom-3 mx-auto max-h-[calc(100dvh-1.5rem)] w-auto max-w-4xl overflow-y-auto p-4 text-white backdrop:bg-black/45 sm:inset-x-5 sm:bottom-5 sm:p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div><p id="cookie-preferences-title" className="text-sm font-semibold text-white">{language === 'id' ? 'Kelola preferensi cookie' : 'Manage cookie preferences'}</p><p className="mt-1.5 text-xs leading-6 text-[#858D99]">{language === 'id' ? 'Kapitech saat ini mengelompokkan analytics dan attribution sebagai satu kategori opsional.' : 'Kapitech currently groups analytics and attribution into one optional category.'}</p></div>
            <button type="button" onClick={() => closePreferences(isVisible)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02] text-text-body hover:text-white" aria-label={language === 'id' ? 'Tutup preferensi cookie' : 'Close cookie preferences'}><X size={15}/></button>
          </div>
          <div className="mt-5 space-y-3">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.018] p-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <p className="text-sm font-semibold text-white">{language === 'id' ? 'Penyimpanan esensial' : 'Essential storage'}</p>
                <span className="whitespace-nowrap rounded-full border border-white/[0.08] px-3 py-1 text-[9px] font-mono uppercase text-[#7D8591]">{language === 'id' ? 'Selalu aktif' : 'Always on'}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-[#858D99]">{language === 'id' ? 'Diperlukan untuk consent, bahasa, tema, dan fungsi website dasar.' : 'Required for consent, language, theme, and core website functions.'}</p>
            </div>
            <button type="button" role="switch" aria-checked={analyticsEnabled} aria-labelledby="cookie-analytics-title" aria-describedby="cookie-analytics-description" onClick={() => setAnalyticsEnabled((value) => !value)} className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.018] p-4 text-left"><div className="flex items-center justify-between gap-4"><div><p id="cookie-analytics-title" className="text-sm font-semibold text-white">Analytics &amp; attribution</p><p id="cookie-analytics-description" className="mt-1 text-xs leading-5 text-[#767E8A]">{language === 'id' ? 'Digunakan untuk pengukuran penggunaan website dan campaign setelah consent.' : 'Used for website usage and campaign measurement after consent.'}</p></div><span className={analyticsEnabled ? 'relative h-6 w-11 shrink-0 rounded-full bg-brand-red' : 'relative h-6 w-11 shrink-0 rounded-full bg-white/[0.12]'}><span className={analyticsEnabled ? 'absolute right-1 top-1 h-4 w-4 rounded-full bg-white' : 'absolute left-1 top-1 h-4 w-4 rounded-full bg-white'} /></span></div></button>
          </div>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => saveConsent('necessary')} className="min-h-[42px] rounded-full border border-white/[0.09] px-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#C2C7D1]">{language === 'id' ? 'Simpan tanpa analytics' : 'Save without analytics'}</button>
            <button type="button" onClick={() => saveConsent(analyticsEnabled ? 'accepted' : 'necessary')} className="min-h-[42px] rounded-full bg-brand-red px-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">{language === 'id' ? 'Simpan preferensi' : 'Save preferences'}</button>
          </div>
        </dialog>
      )}
    </>
  );
};
