import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Clock, CheckCircle2, ArrowUpRight, Send, Globe, MessageSquare, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { GlassPanel, PageHero, Reveal, SectionHeader } from '../components/ui/PublicUI';
import { useLanguage } from '../lib/LanguageContext';
import { sanitizeInput, isValidEmail, isValidPhone, clampLength } from '../lib/security';
import { submitToInbox } from '../lib/submissions';

export const Contact = () => {
  const { t, language } = useLanguage();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState<string>('');
  const [showAllFaqs, setShowAllFaqs] = useState<boolean>(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const serviceOptionsEn = [
    // Branding
    'Pitch Deck (Investor Visuals)',
    'Brand Identity & Guidelines',
    'Logo Design',
    'Graphic Design & Illustrations',
    'Rebranding',
    // Design
    'UI/UX Design (Web & Mobile)',
    'Website Design & Landings',
    'Mobile App Design (iOS & Android)',
    'Website Redesign',
    'Product UX/UI Audit',
    // Development
    'Web Development (Full-Stack)',
    'MVP Development',
    'Landing Page Development',
    'Corporate Websites',
    'WOW / Interactive Websites',
    // Strategic Solutions
    'Strategic Solution: MVP Design',
    'Strategic Solution: Product Redesign',
    'Strategic Solution: Team Extension'
  ];

  const serviceOptionsId = [
    // Branding
    'Pitch Deck (Visual Presentasi Investor)',
    'Identitas Brand & Brandbook',
    'Desain Logo Ikonik',
    'Desain Grafis & Ilustrasi',
    'Rebranding & Transformasi Visual',
    // Design
    'Desain UI/UX (Web & Mobile)',
    'Desain Website & Landing Page',
    'Desain Aplikasi Mobile (iOS/Android)',
    'Redesain Website & Modernisasi',
    'Audit UX/UI Produk Digital',
    // Development
    'Pengembangan Web (Front-End & Back-End)',
    'Pengembangan MVP Cepat',
    'Pembuatan Landing Page Berkonversi Tinggi',
    'Website Korporat & Skala Enterprise',
    'Website WOW / Interaktif & Cepat',
    // Strategic Solutions
    'Solusi Strategis: Desain MVP',
    'Solusi Strategis: Redesain Produk',
    'Solusi Strategis: Team Extension (Talenta Dedikasi)'
  ];

  const serviceOptions = language === 'id' ? serviceOptionsId : serviceOptionsEn;

  const budgetOptionsEn = [
    '< $3,000 (IDR 40M - 50M)',
    '$3,000 - $10,000 (IDR 50M - 150M)',
    '$10,000 - $25,000 (IDR 150M - 400M)',
    '$25,000+ (Enterprise)'
  ];

  const budgetOptionsId = [
    '< Rp 50 Juta (Skala Standar)',
    'Rp 50 Juta - Rp 150 Juta (Menengah)',
    'Rp 150 Juta - Rp 400 Juta (Lanjutan)',
    '> Rp 400 Juta (Skala Enterprise)'
  ];

  const budgetOptions = language === 'id' ? budgetOptionsId : budgetOptionsEn;

  const toggleService = (srv: string) => {
    setSelectedServices(prev =>
      prev.includes(srv) ? prev.filter(s => s !== srv) : [...prev, srv]
    );
  };

  const [honeypot, setHoneypot] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Anti-spam honeypot detection
    if (honeypot.trim().length > 0) {
      // Silently reject bot submissions
      setIsSubmitting(false);
      setIsSubmitted(true);
      return;
    }
    
    // Strict sanitization
    const sanitizedName = sanitizeInput(clampLength(formState.name, 100));
    const sanitizedEmail = sanitizeInput(clampLength(formState.email, 120));
    const sanitizedCompany = sanitizeInput(clampLength(formState.company, 100));
    const sanitizedPhone = sanitizeInput(clampLength(formState.phone, 30));
    const sanitizedMessage = sanitizeInput(clampLength(formState.message, 3000));

    const errors: { [key: string]: string } = {};

    if (!sanitizedName) {
      errors.name = language === 'id' ? 'Nama wajib diisi' : 'Name is required';
    }

    if (!sanitizedEmail) {
      errors.email = language === 'id' ? 'Email wajib diisi' : 'Email is required';
    } else if (!isValidEmail(sanitizedEmail)) {
      errors.email = language === 'id' ? 'Format email tidak valid' : 'Invalid email address';
    }

    if (sanitizedPhone && !isValidPhone(sanitizedPhone)) {
      errors.phone = language === 'id' ? 'Format nomor telepon tidak valid' : 'Invalid phone number';
    }

    if (!sanitizedMessage || sanitizedMessage.length < 10) {
      errors.message = language === 'id' ? 'Pesan minimal 10 karakter' : 'Message must be at least 10 characters';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setSubmitError('');
    setIsSubmitting(true);
    
    try {
      await submitToInbox({
        fullName: sanitizedName,
        email: sanitizedEmail,
        company: sanitizedCompany || undefined,
        phone: sanitizedPhone || undefined,
        services: selectedServices.length > 0 ? selectedServices : undefined,
        budget: budgetRange || undefined,
        message: sanitizedMessage,
        source: 'Contact Page Form',
        type: 'inquiry'
      });
    } catch (err) {
      console.warn('Submission error:', err);
      setSubmitError(
        language === 'id'
          ? 'Pesan belum tersimpan. Periksa koneksi lalu coba lagi.'
          : 'Your inquiry was not saved. Please check your connection and try again.'
      );
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqsEn = [
    {
      q: "What is your typical project turnaround time?",
      a: "Standard corporate websites and brand systems take between 3 to 6 weeks. Full-scale custom web applications, SaaS platforms, and mobile apps typically range from 6 to 14 weeks depending on the technical complexity and feature set."
    },
    {
      q: "Do you sign Non-Disclosure Agreements (NDAs)?",
      a: "Yes, absolutely. We prioritize your privacy and intellectual property. We are happy to execute an NDA before reviewing any proprietary assets or product specifications."
    },
    {
      q: "How does project billing and payment work?",
      a: "For fixed-scope projects, we usually operate on milestone-based payments (e.g. 50% deposit upon kickoff, 25% design sign-off, 25% final deployment). For ongoing product support, we offer monthly retainer agreements."
    },
    {
      q: "Do you provide post-launch maintenance and technical support?",
      a: "Yes. Every deployed project comes with a 30-day post-launch warranty for bug fixes and adjustments. We also offer dedicated monthly SLA maintenance packages for security, backups, and feature iterations."
    },
    {
      q: "Can Kapitech take over or revamp an existing legacy codebase?",
      a: "Yes. We conduct a preliminary architectural audit to evaluate code quality, security vulnerabilities, and database performance before recommending an incremental refactor or modern framework migration."
    },
    {
      q: "How is communication and progress tracked during sprints?",
      a: "We provide dedicated Slack/WhatsApp channels, shared Figma project files, and weekly milestone demos. You have direct transparent communication with our tech lead and project manager."
    },
    {
      q: "Do you assist with cloud hosting and app store deployments?",
      a: "Yes. We handle end-to-end production setups on Google Cloud, AWS, Vercel, or custom servers, including SSL certificates, custom DNS routing, and Apple App Store / Google Play submission assistance."
    },
    {
      q: "What core tech stack do you specialize in?",
      a: "Our core engineering ecosystem centers around modern React, Next.js (App Router), TypeScript, Tailwind CSS, Node.js, Express, PostgreSQL, Firebase, and React Native for mobile applications."
    }
  ];

  const faqsId = [
    {
      q: "Berapa lama estimasi waktu pengerjaan sebuah proyek?",
      a: "Website korporat standar dan sistem identitas brand memakan waktu antara 3 hingga 6 minggu. Aplikasi web kustom berskala penuh, platform SaaS, dan aplikasi mobile umumnya berkisar antara 6 hingga 14 minggu tergantung pada kompleksitas teknis dan ruang lingkup fitur."
    },
    {
      q: "Apakah Kapitech bersedia menandatangani perjanjian kerahasiaan (NDA)?",
      a: "Tentu saja. Kami sangat menghargai privasi dan hak kekayaan intelektual (HAKI) Anda. Kami siap menandatangani NDA resmi sebelum meninjau dokumen spesifikasi proyek atau aset milik Anda."
    },
    {
      q: "Bagaimana sistem pembayaran dan penagihan proyek?",
      a: "Untuk proyek dengan ruang lingkup tetap (fixed-scope), kami menggunakan skema pembayaran berbasis milestone (misalnya 50% deposit saat kickoff, 25% setelah persetujuan desain, dan 25% saat peluncuran final). Untuk dukungan jangka panjang, kami menyediakan sistem retainer bulanan."
    },
    {
      q: "Apakah Anda menyediakan dukungan teknis dan pemeliharaan setelah rilis?",
      a: "Ya. Setiap proyek yang dirilis dilengkapi dengan garansi pasca-peluncuran 30 hari untuk perbaikan bug dan penyesuaian. Kami juga menawarkan paket pemeliharaan SLA bulanan untuk pembaruan keamanan, backup berkala, dan iterasi fitur baru."
    },
    {
      q: "Bisakah Kapitech melanjutkan atau merombak codebase lama (legacy code)?",
      a: "Bisa. Kami akan melakukan audit arsitektur awal untuk mengevaluasi kualitas kode, celah keamanan, dan performa database sebelum merekomendasikan refactoring bertahap atau migrasi ke framework modern."
    },
    {
      q: "Bagaimana komunikasi dan pemantauan progress selama sprint berlangsung?",
      a: "Kami menyediakan kanal komunikasi langsung (Slack/WhatsApp), akses file Figma bersama, dan sesi demo milestone mingguan. Anda dapat berkomunikasi secara transparan langsung dengan Tech Lead dan Project Manager kami."
    },
    {
      q: "Apakah Anda membantu proses hosting cloud dan rilis aplikasi ke app store?",
      a: "Ya. Kami menangani konfigurasi cloud production end-to-end di Google Cloud, AWS, Vercel, atau server kustom, termasuk sertifikat SSL, routing DNS, hingga bantuan submisi ke Apple App Store dan Google Play Store."
    },
    {
      q: "Apa saja teknologi (tech stack) utama yang menjadi spesialisasi Anda?",
      a: "Ekosistem rekayasa utama kami berpusat pada React modern, Next.js (App Router), TypeScript, Tailwind CSS, Node.js, Express, PostgreSQL, Firebase, serta React Native untuk aplikasi mobile."
    }
  ];

  const allFaqs = language === 'id' ? faqsId : faqsEn;
  const displayedFaqs = showAllFaqs ? allFaqs : allFaqs.slice(0, 4);

  return (
    <div className="kapi-page kapi-contact">
      <section className="kapi-page-hero">
        <div className="kapi-container">
          <Reveal>
            <span className="kapi-eyebrow">{language === 'id' ? 'Contact & project inquiries' : 'Contact & project inquiries'}</span>
            <h1>{language === 'id' ? <>Mari bangun sesuatu yang <span className="text-brand-red">bernilai.</span></> : <>Let’s build something <span className="text-brand-red">exceptional.</span></>}</h1>
            <p>{language === 'id'
              ? 'Ceritakan kebutuhan project, konsultasi teknis, atau peluang kemitraan Anda. Tim Kapitech akan merespons secara langsung.'
              : 'Tell us about your project, technical consultation, or partnership opportunity. The Kapitech team responds directly.'}</p>
          </Reveal>
        </div>
      </section>

      <section className="kapi-section pt-12 sm:pt-16">
        <div className="kapi-container grid lg:grid-cols-[.72fr_1.28fr] gap-5 lg:gap-7 items-start">
          <Reveal>
            <GlassPanel className="p-5 sm:p-7 sticky top-24">
              <span className="kapi-eyebrow">Kapitech Agency</span>
              <h2 className="mt-3 font-display text-2xl sm:text-3xl tracking-[-.04em]">PT Kapitech Digital Indonesia</h2>
              <p className="mt-4 text-sm leading-7 text-white/45">
                {language === 'id'
                  ? 'Agensi digital independen untuk UI/UX, branding, website, dan web application.'
                  : 'Independent agency for UI/UX, branding, websites, and web applications.'}
              </p>
              <div className="mt-7 pt-6 border-t border-white/[0.08] grid gap-5">
                <a href="mailto:hello@kapitech.id" className="text-sm hover:text-brand-red transition-colors">hello@kapitech.id</a>
                <a href="mailto:business@kapitech.id" className="text-sm hover:text-brand-red transition-colors">business@kapitech.id</a>
                <a href="tel:+6287769957062" className="text-sm hover:text-brand-red transition-colors">+62 877-6995-7062</a>
                <p className="text-xs leading-6 text-white/38">{t('footer.address')}</p>
                <span className="text-[10px] font-mono uppercase tracking-[.12em] text-white/28">Mon–Fri · 09:00–18:00 WIB</span>
              </div>
            </GlassPanel>
          </Reveal>

          <Reveal delay={0.08}>
            <GlassPanel className="p-5 sm:p-8">
              {isSubmitted ? (
                <div className="min-h-[520px] grid place-items-center text-center py-12">
                  <div>
                    <div className="w-14 h-14 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 grid place-items-center mx-auto">
                      <CheckCircle2 size={25} />
                    </div>
                    <h2 className="mt-6 font-display text-3xl tracking-[-.04em]">{language === 'id' ? 'Pesan sudah terkirim.' : 'Your inquiry has been sent.'}</h2>
                    <p className="mt-3 max-w-md text-sm leading-7 text-white/45 mx-auto">
                      {language === 'id' ? 'Tim Kapitech akan meninjau kebutuhan Anda dan menghubungi kembali dalam waktu 24 jam kerja.' : 'The Kapitech team will review your requirements and follow up within 24 business hours.'}
                    </p>
                    <button
                      type="button"
                      className="kapi-button kapi-button--secondary mt-7"
                      onClick={() => {
                        setIsSubmitted(false);
                        setSubmitError('');
                        setFormState({ name: '', email: '', company: '', phone: '', message: '' });
                        setFormErrors({});
                        setSelectedServices([]);
                        setBudgetRange('');
                      }}
                    >
                      {language === 'id' ? 'Kirim pesan lain' : 'Send another inquiry'}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid gap-7">
                  <div>
                    <span className="kapi-eyebrow">Project brief</span>
                    <h2 className="mt-3 font-display text-2xl sm:text-3xl tracking-[-.04em]">
                      {language === 'id' ? 'Ceritakan apa yang ingin Anda bangun.' : 'Tell us what you want to build.'}
                    </h2>
                  </div>

                  <div className="hidden" aria-hidden="true">
                    <input type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={event => setHoneypot(event.target.value)} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="grid gap-2 text-xs">
                      <span className="text-white/45">Name</span>
                      <input name="name" value={formState.name} onChange={handleInputChange} className="h-12 rounded-control border border-white/[0.08] bg-white/[0.025] px-4 outline-none focus:border-brand-red/60" />
                      {formErrors.name && <span className="text-rose-300">{formErrors.name}</span>}
                    </label>
                    <label className="grid gap-2 text-xs">
                      <span className="text-white/45">Email</span>
                      <input type="email" name="email" value={formState.email} onChange={handleInputChange} className="h-12 rounded-control border border-white/[0.08] bg-white/[0.025] px-4 outline-none focus:border-brand-red/60" />
                      {formErrors.email && <span className="text-rose-300">{formErrors.email}</span>}
                    </label>
                    <label className="grid gap-2 text-xs">
                      <span className="text-white/45">Company</span>
                      <input name="company" value={formState.company} onChange={handleInputChange} className="h-12 rounded-control border border-white/[0.08] bg-white/[0.025] px-4 outline-none focus:border-brand-red/60" />
                    </label>
                    <label className="grid gap-2 text-xs">
                      <span className="text-white/45">Phone / WhatsApp</span>
                      <input name="phone" value={formState.phone} onChange={handleInputChange} className="h-12 rounded-control border border-white/[0.08] bg-white/[0.025] px-4 outline-none focus:border-brand-red/60" />
                      {formErrors.phone && <span className="text-rose-300">{formErrors.phone}</span>}
                    </label>
                  </div>

                  <div className="grid gap-3">
                    <span className="text-xs text-white/45">{language === 'id' ? 'Service yang dibutuhkan' : 'Services you need'}</span>
                    <div className="flex flex-wrap gap-2">
                      {serviceOptions.map(option => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleService(option)}
                          className={`kapi-filter-button ${selectedServices.includes(option) ? 'is-active' : ''}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="grid gap-2 text-xs">
                    <span className="text-white/45">{language === 'id' ? 'Budget range' : 'Budget range'}</span>
                    <select value={budgetRange} onChange={event => setBudgetRange(event.target.value)} className="h-12 rounded-control border border-white/[0.08] bg-[#0d1015] px-4 outline-none">
                      <option value="">Select</option>
                      {budgetOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </label>

                  <label className="grid gap-2 text-xs">
                    <span className="text-white/45">Message</span>
                    <textarea name="message" value={formState.message} onChange={handleInputChange} rows={7} className="rounded-[14px] border border-white/[0.08] bg-white/[0.025] p-4 outline-none resize-y focus:border-brand-red/60" />
                    {formErrors.message && <span className="text-rose-300">{formErrors.message}</span>}
                  </label>

                  {submitError && <div className="p-3 rounded-control border border-rose-400/20 bg-rose-400/10 text-rose-200 text-xs">{submitError}</div>}

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <p className="text-[10px] font-mono uppercase tracking-[.12em] text-white/24">Kapitech Agency · PT Kapitech Digital Indonesia</p>
                    <button type="submit" disabled={isSubmitting} className="kapi-button kapi-button--primary disabled:opacity-50">
                      {isSubmitting ? 'Sending…' : (language === 'id' ? 'Kirim inquiry' : 'Send inquiry')}
                      <ArrowUpRight size={15} />
                    </button>
                  </div>
                </form>
              )}
            </GlassPanel>
          </Reveal>
        </div>
      </section>

      <section className="kapi-section">
        <div className="kapi-container">
          <SectionHeader eyebrow={language === 'id' ? 'FAQ' : 'FAQ'} title={language === 'id' ? 'Pertanyaan yang sering muncul.' : 'Frequently asked questions.'} />
          <div className="grid gap-2 max-w-4xl">
            {allFaqs.slice(0, showAllFaqs ? allFaqs.length : 4).map((faq, index) => (
              <GlassPanel key={index} className="p-5 sm:p-6">
                <div className="font-display text-base sm:text-lg tracking-[-.02em]">{faq.q}</div>
                <p className="mt-3 text-sm leading-7 text-white/45">{faq.a}</p>
              </GlassPanel>
            ))}
          </div>
          {allFaqs.length > 4 && (
            <button type="button" className="kapi-button kapi-button--secondary mt-7" onClick={() => setShowAllFaqs(value => !value)}>
              {showAllFaqs ? 'Show fewer' : 'Show more'}
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
