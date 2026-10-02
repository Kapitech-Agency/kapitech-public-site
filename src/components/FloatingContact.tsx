import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Mail, MessageSquare, Phone, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/LanguageContext';

export const FloatingContact = () => {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 420;
      setVisible(next);
      if (!next) setOpen(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const options = [
    {
      label: language === 'id' ? 'WhatsApp' : 'WhatsApp',
      href: 'https://wa.me/6287769957062?text=Halo%20Kapitech%20Agency,%20saya%20ingin%20konsultasi%20proyek.',
      icon: <Phone size={16} />,
      external: true,
    },
    {
      label: language === 'id' ? 'Email bisnis' : 'Business email',
      href: 'mailto:business@kapitech.id',
      icon: <Mail size={16} />,
      external: true,
    },
    {
      label: language === 'id' ? 'Mulai proyek' : 'Start a project',
      href: '/contact',
      icon: <ArrowUpRight size={16} />,
      external: false,
    },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="kapi-floating-contact"
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.9 }}
        >
          <AnimatePresence>
            {open && (
              <motion.div
                className="kapi-floating-menu"
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
              >
                {options.map(option => (
                  option.external ? (
                    <a key={option.label} className="kapi-floating-link" href={option.href} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
                      <span>{option.label}</span>
                      {option.icon}
                    </a>
                  ) : (
                    <Link key={option.label} className="kapi-floating-link" to={option.href} onClick={() => setOpen(false)}>
                      <span>{option.label}</span>
                      {option.icon}
                    </Link>
                  )
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            className="kapi-floating-button"
            onClick={() => setOpen(value => !value)}
            aria-label={open ? 'Close contact menu' : 'Open contact menu'}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <MessageSquare size={20} />}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
