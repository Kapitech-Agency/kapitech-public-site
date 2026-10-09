import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Phone, Mail, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';

export const FloatingContact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCookieVisible, setIsCookieVisible] = useState(false);
  const { language } = useLanguage();
  const contactTriggerRef = React.useRef<HTMLButtonElement>(null);
  const contactPanelRef = React.useRef<HTMLDivElement>(null);
  const firstContactOptionRef = React.useRef<HTMLAnchorElement>(null);
  const wasOpenRef = React.useRef(false);

  useEffect(() => {
    try {
      const consent = window.localStorage.getItem('kapitech_cookie_consent');
      setIsCookieVisible(consent !== 'accepted' && consent !== 'necessary');
    } catch {
      setIsCookieVisible(true);
    }

    const handleCookieOpen = () => setIsCookieVisible(true);
    const handleCookieChange = () => setIsCookieVisible(false);
    window.addEventListener('kapitech_open_cookie_preferences', handleCookieOpen);
    window.addEventListener('kapitech_consent_changed', handleCookieChange);

    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      window.removeEventListener('kapitech_open_cookie_preferences', handleCookieOpen);
      window.removeEventListener('kapitech_consent_changed', handleCookieChange);
    };
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isOpen) {
      wasOpenRef.current = true;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsOpen(false);
          return;
        }

        if (event.key !== 'Tab') return;

        const panel = contactPanelRef.current;
        if (!panel) return;

        const focusable = Array.from(
          panel.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((element) => element.getClientRects().length > 0);

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      const focusFrame = window.requestAnimationFrame(() => {
        firstContactOptionRef.current?.focus();
      });

      return () => {
        window.cancelAnimationFrame(focusFrame);
        document.body.style.overflow = previousOverflow;
        document.removeEventListener('keydown', handleKeyDown);
      };
    }

    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      window.requestAnimationFrame(() => contactTriggerRef.current?.focus());
    }

    document.body.style.overflow = previousOverflow;
  }, [isOpen]);

  const contactOptions = [
    {
      icon: <Phone size={18} />,
      label: language === 'id' ? 'WhatsApp Langsung' : 'Direct WhatsApp',
      href: 'https://wa.me/6287769957062?text=Halo%20Kapitech%20Agency,%20saya%20ingin%20konsultasi%20proyek.',
      color: 'bg-emerald-600',
      isExternal: true
    },
    {
      icon: <Mail size={18} />,
      label: language === 'id' ? 'Email Kapitech' : 'Kapitech Email',
      href: 'mailto:hello@kapitech.id',
      color: 'bg-[#0B0C0E]/58 backdrop-blur-xl backdrop-saturate-150 border border-white/[0.08]'
    },
    {
      icon: <MessageSquare size={18} />,
      label: language === 'id' ? 'Mulai Proyek' : 'Start a Project',
      href: '/contact#project-inquiry-form',
      isLink: true,
      color: 'bg-brand-red'
    }
  ];

  return (
    <>
      {/* Backdrop overlay for mobile to dismiss */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-[#0B0C0E]/58 backdrop-blur-xl backdrop-saturate-150 z-[90]"
          />
        )}
      </AnimatePresence>

      <div
        className="kapi-floating-contact fixed right-4 z-[95] flex flex-col items-end gap-3 sm:right-8 sm:bottom-8"
        style={{
          bottom: isCookieVisible
            ? 'calc(6.5rem + env(safe-area-inset-bottom))'
            : 'calc(1rem + env(safe-area-inset-bottom))'
        }}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={contactPanelRef}
              role="dialog"
              aria-modal="true"
              aria-label={language === 'id' ? 'Kontak cepat Kapitech' : 'Kapitech quick contact'}
              initial={{ opacity: 0, scale: 0.85, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 15 }}
              className="flex flex-col gap-2.5 mb-2 w-full max-w-[calc(100vw-5rem)] sm:max-w-[85vw]"
            >
              {contactOptions.map((option, i) => (
                <motion.div
                  key={option.label}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  {option.isLink ? (
                    <Link
                      to={option.href}
                      onClick={() => setIsOpen(false)}
                      ref={i === 0 ? firstContactOptionRef : undefined}
                      data-analytics-event="floating_contact_click"
                      data-contact-option={option.label}
                      className="flex items-center justify-end gap-2.5 sm:gap-3 group min-h-[44px] focus-visible:outline-none"
                    >
                      <span className="max-w-full px-3.5 py-2 rounded-xl bg-[#0B0C0E]/58 backdrop-blur-xl backdrop-saturate-150 border border-white/[0.08] text-xs font-medium text-white shadow-lg transition-all group-hover:border-brand-red/60 group-hover:text-brand-red whitespace-normal break-words sm:whitespace-nowrap">
                        {option.label}
                      </span>
                      <div className={cn(
                        "w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white shadow-xl transition-transform hover:scale-105 active:scale-95 shrink-0 group-focus-visible:ring-2 group-focus-visible:ring-brand-red/70 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[#0B0C0E]",
                        option.color
                      )}>
                        {option.icon}
                      </div>
                    </Link>
                  ) : (
                    <a
                      href={option.href}
                      target={option.isExternal ? "_blank" : undefined}
                      rel={option.isExternal ? "noopener noreferrer" : undefined}
                      onClick={() => setIsOpen(false)}
                      ref={i === 0 ? firstContactOptionRef : undefined}
                      data-analytics-event="floating_contact_click"
                      data-contact-option={option.label}
                      className="flex items-center justify-end gap-2.5 sm:gap-3 group min-h-[44px]"
                    >
                      <span className="max-w-full px-3.5 py-2 rounded-xl bg-[#0B0C0E]/58 backdrop-blur-xl backdrop-saturate-150 border border-white/[0.08] text-xs font-medium text-white shadow-lg transition-all group-hover:border-brand-red/60 group-hover:text-brand-red whitespace-normal break-words sm:whitespace-nowrap">
                        {option.label}
                      </span>
                      <div className={cn(
                        "w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white shadow-xl transition-transform hover:scale-105 active:scale-95 shrink-0",
                        option.color
                      )}>
                        {option.icon}
                      </div>
                    </a>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0, rotate: 45 }}
              className="relative group"
            >
              <motion.button
                ref={contactTriggerRef}
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isOpen ? "Tutup Kontak Cepat" : "Buka Kontak Cepat"}
                aria-expanded={isOpen}
                aria-haspopup="dialog"
                data-cursor-label={isOpen ? "Close" : "Contact"}
                className={cn(
                  "w-12 h-12 sm:w-14 sm:h-14 min-h-[44px] min-w-[44px] rounded-full sm:rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E]",
                  isOpen 
                    ? "bg-[#0B0C0E]/58 backdrop-blur-xl backdrop-saturate-150 border border-white/[0.08]" 
                    : "bg-brand-red/78 backdrop-blur-xl border border-brand-red/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_12px_28px_-18px_rgba(229,9,20,0.72)]"
                )}
              >
                {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
              </motion.button>
              
              {!isOpen && (
                <div className="hidden sm:block absolute right-full mr-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="px-3 py-1.5 rounded-xl bg-[#0B0C0E]/58 backdrop-blur-xl backdrop-saturate-150 border border-white/[0.08] whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-white">
                      {language === 'id' ? 'Hubungi Kapitech' : 'Contact Kapitech'}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
