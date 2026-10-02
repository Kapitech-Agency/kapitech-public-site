import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Clock, CheckCircle2, ArrowUpRight, Send, Globe, MessageSquare, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, AlertCircle, LoaderCircle } from 'lucide-react';
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
  const [submissionId, setSubmissionId] = useState('');
  const [formStep, setFormStep] = useState(0);
  const [showSpecificServices, setShowSpecificServices] = useState(false);
  const [showOptionalContact, setShowOptionalContact] = useState(false);

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

  const serviceGroups = [
    { label: 'Branding', items: serviceOptions.slice(0, 5) },
    { label: 'Design', items: serviceOptions.slice(5, 10) },
    { label: 'Development', items: serviceOptions.slice(10, 15) },
    { label: language === 'id' ? 'Solusi Strategis' : 'Strategic Solutions', items: serviceOptions.slice(15) }
  ];

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

  const serviceChoices = [
    {
      title: language === 'id' ? 'Brand & Identity' : 'Brand & Identity',
      description: language === 'id' ? 'Bangun atau perbarui identitas brand.' : 'Build or refresh your brand identity.',
      values: [serviceOptions[1], serviceOptions[2], serviceOptions[4]]
    },
    {
      title: language === 'id' ? 'Website & Landing Page' : 'Website & Landing Page',
      description: language === 'id' ? 'Website baru, redesign, atau landing page.' : 'New websites, redesigns, or landing pages.',
      values: [serviceOptions[6], serviceOptions[7], serviceOptions[8]]
    },
    {
      title: language === 'id' ? 'Product & UX/UI' : 'Product & UX/UI',
      description: language === 'id' ? 'Design produk digital dan audit pengalaman.' : 'Digital product design and UX audits.',
      values: [serviceOptions[5], serviceOptions[8]]
    },
    {
      title: language === 'id' ? 'Web App & MVP' : 'Web App & MVP',
      description: language === 'id' ? 'Bangun aplikasi web atau MVP yang siap diuji.' : 'Build a web application or testable MVP.',
      values: [serviceOptions[9], serviceOptions[10], serviceOptions[11]]
    },
    {
      title: language === 'id' ? 'Interactive Digital' : 'Interactive Digital',
      description: language === 'id' ? 'Website atau experience digital yang lebih immersive.' : 'More immersive digital experiences.',
      values: [serviceOptions[13]]
    },
    {
      title: language === 'id' ? 'Strategy / Lainnya' : 'Strategy / Other',
      description: language === 'id' ? 'Masih eksplorasi atau butuh arahan.' : 'Still exploring or need direction.',
      values: [serviceOptions[14], serviceOptions[15], serviceOptions[16]]
    }
  ];

  const toggleServiceBundle = (values: string[]) => {
    setSelectedServices(prev => {
      const allSelected = values.every(value => prev.includes(value));
      if (allSelected) return prev.filter(value => !values.includes(value));
      return Array.from(new Set([...prev, ...values]));
    });
  };

  const validateContactStep = () => {
    const nextErrors: { [key: string]: string } = {};
    const sanitizedName = sanitizeInput(clampLength(formState.name, 100));
    const sanitizedEmail = sanitizeInput(clampLength(formState.email, 120));

    if (!sanitizedName) {
      nextErrors.name = language === 'id' ? 'Nama wajib diisi' : 'Name is required';
    }
    if (!sanitizedEmail) {
      nextErrors.email = language === 'id' ? 'Email wajib diisi' : 'Email is required';
    } else if (!isValidEmail(sanitizedEmail)) {
      nextErrors.email = language === 'id' ? 'Format email tidak valid' : 'Invalid email address';
    }

    setFormErrors(prev => ({ ...prev, ...nextErrors }));
    if (Object.keys(nextErrors).length > 0) return false;

    setFormErrors(prev => {
      const next = { ...prev };
      delete next.name;
      delete next.email;
      return next;
    });
    return true;
  };

  const handleNextStep = () => {
    if (formStep === 1 && !validateContactStep()) return;
    setFormStep(prev => Math.min(prev + 1, 2));
  };

  const handlePreviousStep = () => {
    setFormStep(prev => Math.max(prev - 1, 0));
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
      const result = await submitToInbox({
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
      setSubmissionId(result.id);
      setIsSubmitted(true);
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
    <div className="bg-[#0B0C0E] text-white min-h-screen selection:bg-brand-red selection:text-white relative" role="main">
      {/* Hero Section */}
      <section className="relative pt-28 sm:pt-32 md:pt-36 pb-12 sm:pb-16 px-4 sm:px-6 md:px-12 border-b border-[#262930] overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <span className="kapi-section-label mb-5">
              {language === 'id' ? 'Kontak & Konsultasi Proyek' : 'Contact & Inquiries'}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] font-display font-bold leading-[1.03] tracking-[-0.045em] mb-5 sm:mb-6 text-white">
              {language === 'id' ? (
                <>Mari bangun produk digital <span className="text-brand-red">luar biasa</span> bersama kami.</>
              ) : (
                <>Let’s build something <span className="text-brand-red">exceptional</span> together.</>
              )}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[#8A909D] font-light leading-relaxed">
              {language === 'id'
                ? 'Punya ide proyek, membutuhkan konsultasi arsitektur perangkat lunak, atau ingin menjajaki kemitraan? Hubungi tim Kapitech Agency secara langsung.'
                : 'Have an upcoming project, need technical consultation, or want to explore collaboration? Reach out to Kapitech Agency directly.'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Form & Info Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-12 border-b border-[#262930] relative z-10 bg-[#0B0C0E]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Left Column: Direct Info & Location */}
            <div className="lg:col-span-5 self-start lg:sticky lg:top-28 space-y-6 sm:space-y-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-brand-red block mb-2 font-semibold">
                  {language === 'id' ? 'Informasi Perusahaan' : 'Corporate Information'}
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-bold mb-2 sm:mb-3 text-white">
                  Kapitech Agency
                </h3>
                <p className="text-xs font-mono text-[#8A909D] uppercase tracking-wider mb-2.5 sm:mb-3">
                  PT Kapitech Digital Indonesia
                </p>
                <p className="text-xs sm:text-sm text-[#8A909D] font-light leading-relaxed">
                  {language === 'id'
                    ? 'Agensi produk digital independen yang berfokus pada desain UI/UX strategis, rekayasa web full-stack, dan identitas brand modern.'
                    : 'An independent digital product agency specializing in strategic UI/UX design, full-stack web engineering, and brand systems.'}
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* Email Client */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#16181D] border border-[#262930] flex items-start gap-3.5 sm:gap-4 hover:border-brand-red/40 transition-colors">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red shrink-0 mt-0.5">
                    <Mail size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-mono text-[#8A909D] uppercase block mb-0.5">
                      {language === 'id' ? 'Konsultasi Klien & Proyek' : 'Client Inquiries'}
                    </span>
                    <a href="mailto:hello@kapitech.id" className="text-xs sm:text-sm font-semibold text-white hover:text-brand-red transition-colors block truncate">
                      hello@kapitech.id
                    </a>
                    <p className="text-[10px] sm:text-[11px] text-[#8A909D]/70 mt-0.5">
                      {language === 'id' ? 'Tanggapan terjamin dalam 24 jam kerja' : 'Responses guaranteed within 24 business hours'}
                    </p>
                  </div>
                </div>

                {/* Email Business */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#16181D] border border-[#262930] flex items-start gap-3.5 sm:gap-4 hover:border-brand-red/40 transition-colors">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center text-[#E50914] shrink-0 mt-0.5">
                    <Globe size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-mono text-[#8A909D] uppercase block mb-0.5">
                      {language === 'id' ? 'Kemitraan & Korporasi' : 'Partnerships & Corporate'}
                    </span>
                    <a href="mailto:business@kapitech.id" className="text-xs sm:text-sm font-semibold text-white hover:text-brand-red transition-colors block truncate">
                      business@kapitech.id
                    </a>
                    <p className="text-[10px] sm:text-[11px] text-[#8A909D]/70 mt-0.5">
                      {language === 'id' ? 'Untuk kebutuhan vendor, enterprise, dan media' : 'For vendor, enterprise, and press inquiries'}
                    </p>
                  </div>
                </div>

                {/* Careers Recruitment Email */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#16181D] border border-[#262930] flex items-start gap-3.5 sm:gap-4 hover:border-brand-red/40 transition-colors">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red shrink-0 mt-0.5">
                    <Mail size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-mono text-[#8A909D] uppercase block mb-0.5">
                      {language === 'id' ? 'Karir & Rekrutmen' : 'Careers & Talent'}
                    </span>
                    <a href="mailto:recruitment@kapitech.id" className="text-xs sm:text-sm font-semibold text-white hover:text-brand-red transition-colors block truncate">
                      recruitment@kapitech.id
                    </a>
                    <p className="text-[10px] sm:text-[11px] text-[#8A909D]/70 mt-0.5">
                      {language === 'id' ? 'Untuk lamaran kerja dan program magang' : 'For job applications and internships'}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#16181D] border border-[#262930] flex items-start gap-3.5 sm:gap-4 hover:border-brand-red/40 transition-colors">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red shrink-0 mt-0.5">
                    <Phone size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-mono text-[#8A909D] uppercase block mb-0.5">
                      {language === 'id' ? 'Telepon Langsung / WhatsApp' : 'Direct Phone / WhatsApp'}
                    </span>
                    <a href="tel:+6287769957062" className="text-xs sm:text-sm font-semibold text-white hover:text-brand-red transition-colors block truncate">
                      +62 877-6995-7062
                    </a>
                    <p className="text-[10px] sm:text-[11px] text-[#8A909D]/70 mt-0.5">
                      {language === 'id' ? 'Tersedia Senin - Jumat, 09:00 - 18:00 WIB' : 'Available Mon-Fri, 09:00 - 18:00 WIB'}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#16181D] border border-[#262930] flex items-start gap-3.5 sm:gap-4 hover:border-brand-red/40 transition-colors">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red shrink-0 mt-0.5">
                    <MapPin size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-mono text-[#8A909D] uppercase block mb-0.5">
                      {language === 'id' ? 'Alamat Kantor Pusat' : 'Headquarters Address'}
                    </span>
                    <p className="text-xs text-white leading-relaxed font-light">
                      Linea Residence, Block G No. 5, Melati Loka Street, Paku Jaya, North Serpong, South Tangerang City, Banten 15220, Indonesia
                    </p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#16181D] border border-[#262930] flex items-start gap-3.5 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red shrink-0 mt-0.5">
                    <Clock size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-mono text-[#8A909D] uppercase block mb-0.5">
                      {language === 'id' ? 'Jam Operasional' : 'Operating Hours'}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-white">
                      {language === 'id' ? 'Senin - Jumat: 09:00 - 18:00 WIB' : 'Monday - Friday: 09:00 - 18:00 WIB'}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-[#8A909D]/70 mt-0.5">GMT+7 (Waktu Indonesia Barat)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Consultation Form */}
            <div className="lg:col-span-7">
              <div className="p-0">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="py-10 sm:py-14"
                    role="status"
                    aria-live="polite"
                  >
                    <div className="max-w-lg mx-auto text-center">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.08, type: 'spring', stiffness: 220, damping: 18 }}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-brand-red/10 border border-brand-red/25 flex items-center justify-center text-brand-red mx-auto mb-5"
                      >
                        <CheckCircle2 size={30} />
                      </motion.div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-brand-red/90">
                        {language === 'id' ? 'Permintaan diterima' : 'Inquiry received'}
                      </span>
                      <h3 className="mt-2 text-2xl sm:text-3xl font-display font-bold tracking-[-0.03em] text-white">
                        {language === 'id' ? 'Terima kasih. Kami akan menghubungi Anda.' : 'Thank you. We’ll be in touch.'}
                      </h3>
                      <p className="mt-3 text-xs sm:text-sm text-[#8A909D] font-light leading-relaxed">
                        {language === 'id'
                          ? 'Tim Kapitech akan meninjau kebutuhan proyek Anda dan menghubungi Anda dalam 24 jam kerja untuk langkah berikutnya.'
                          : 'The Kapitech team will review your project details and contact you within 24 business hours with the next steps.'}
                      </p>
                      {submissionId && (
                        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.02] px-3.5 py-2 text-[10px] font-mono uppercase tracking-[0.14em] text-[#8A909D]">
                          <span>{language === 'id' ? 'Referensi' : 'Reference'}</span>
                          <span className="text-white">{submissionId.slice(-8).toUpperCase()}</span>
                        </div>
                      )}
                      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setIsSubmitted(false);
                            setSubmitError('');
                            setSubmissionId('');
                            setFormState({ name: '', email: '', company: '', phone: '', message: '' });
                            setFormErrors({});
                            setSelectedServices([]);
                            setBudgetRange('');
                            setFormStep(0);
                            setShowSpecificServices(false);
                            setShowOptionalContact(false);
                          }}
                          className="w-full sm:w-auto px-6 py-3 rounded-full border border-brand-red/45 bg-brand-red/72 text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-red/86 hover:border-brand-red/60 transition-[background-color,border-color,box-shadow] duration-300 min-h-[44px] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_10px_24px_-18px_rgba(229,9,20,0.72)]"
                        >
                          {language === 'id' ? 'Kirim Inquiry Baru' : 'Send Another Inquiry'}
                        </button>
                        <Link
                          to="/"
                          className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/[0.02] border border-white/[0.09] hover:border-white/[0.16] text-white text-xs font-semibold uppercase tracking-wider transition-colors min-h-[44px] flex items-center justify-center gap-2"
                        >
                          <span>{language === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}</span>
                          <ArrowUpRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" noValidate>
                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="company_website_hp">Do not fill this</label>
                      <input type="text" id="company_website_hp" name="company_website_hp" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
                    </div>

                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                      <div className="px-5 sm:px-7 pt-5 sm:pt-7 pb-5 sm:pb-6 border-b border-white/[0.08]">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-brand-red">
                              {language === 'id' ? `0${formStep + 1} / 03` : `0${formStep + 1} / 03`}
                            </span>
                            <h3 className="mt-1.5 text-xl sm:text-2xl font-display font-semibold tracking-[-0.04em] text-white">
                              {formStep === 0
                                ? (language === 'id' ? 'Apa yang ingin Anda bangun?' : 'What are you looking to build?')
                                : formStep === 1
                                  ? (language === 'id' ? 'Bagaimana kami menghubungi Anda?' : 'How can we reach you?')
                                  : (language === 'id' ? 'Sedikit konteks, lalu selesai.' : 'A little context, then we’re done.')}
                            </h3>
                          </div>
                          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                            {[0, 1, 2].map(step => (
                              <span
                                key={step}
                                className={`h-1.5 rounded-full transition-all duration-300 ${step === formStep ? 'w-8 bg-brand-red/90' : step < formStep ? 'w-4 bg-brand-red/45' : 'w-4 bg-white/[0.08]'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-2.5 text-xs sm:text-sm text-[#8A909D] font-light leading-relaxed max-w-2xl">
                          {formStep === 0
                            ? (language === 'id'
                              ? 'Pilih yang paling mendekati. Kami bisa bantu merapikan scope setelahnya.'
                              : 'Pick what feels closest. We can shape the exact scope together afterwards.')
                            : formStep === 1
                              ? (language === 'id'
                                ? 'Nama dan email sudah cukup untuk memulai. Detail lain sepenuhnya opsional.'
                                : 'Your name and email are enough to start. Everything else is optional.')
                              : (language === 'id'
                                ? 'Brief singkat sudah cukup. Tidak perlu menulis proposal panjang.'
                                : 'A concise brief is enough. No need to write a full proposal.')}
                        </p>
                      </div>

                      <div className="px-5 sm:px-7 py-5 sm:py-7">
                        <AnimatePresence mode="wait" initial={false}>
                          {formStep === 0 && (
                            <motion.div
                              key="step-services"
                              initial={{ opacity: 0, x: 14 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -14 }}
                              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                              className="space-y-4"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {serviceChoices.map((choice, index) => {
                                  const selected = choice.values.every(value => selectedServices.includes(value));
                                  return (
                                    <motion.button
                                      key={choice.title}
                                      type="button"
                                      onClick={() => toggleServiceBundle(choice.values)}
                                      whileTap={{ scale: 0.985 }}
                                      className={`group relative overflow-hidden rounded-xl border px-4 py-4 text-left transition-[border-color,background-color,box-shadow] duration-300 min-h-[108px] ${selected ? 'border-brand-red/45 bg-brand-red/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]' : 'border-white/[0.08] bg-white/[0.015] hover:border-white/[0.15] hover:bg-white/[0.025]'}`}
                                      aria-pressed={selected}
                                      data-cursor-label="Select"
                                    >
                                      <div className="flex items-start justify-between gap-4">
                                        <span className={`text-[10px] font-mono tracking-[0.16em] ${selected ? 'text-white' : 'text-[#8A909D]'}`}>0{index + 1}</span>
                                        <span className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${selected ? 'bg-brand-red/[0.14] border-brand-red/55 text-brand-red' : 'border-white/[0.14] text-transparent'}`}>
                                          <CheckCircle2 size={12} />
                                        </span>
                                      </div>
                                      <h4 className={`mt-5 text-sm font-semibold transition-colors duration-300 ${selected ? 'text-white' : 'text-white group-hover:text-brand-red'}`}>{choice.title}</h4>
                                      <p className="mt-1 text-[11px] text-[#8A909D] leading-relaxed">{choice.description}</p>
                                    </motion.button>
                                  );
                                })}
                              </div>

                              <button
                                type="button"
                                onClick={() => setShowSpecificServices(prev => !prev)}
                                className="w-full flex items-center justify-between rounded-xl border border-dashed border-white/[0.1] bg-transparent px-4 py-3 text-xs text-[#8A909D] hover:border-brand-red/30 hover:text-white transition-colors"
                                aria-expanded={showSpecificServices}
                              >
                                <span>{language === 'id' ? 'Butuh memilih layanan yang lebih spesifik?' : 'Need a more specific service?'}</span>
                                {showSpecificServices ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                              </button>

                              <AnimatePresence initial={false}>
                                {showSpecificServices && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.012] p-3.5 sm:p-4"
                                  >
                                    <div className="space-y-3">
                                      {serviceGroups.map(group => (
                                        <div key={group.label}>
                                          <span className="block mb-2 px-0.5 text-[9px] font-mono uppercase tracking-[0.16em] text-[#8A909D]">{group.label}</span>
                                          <div className="flex flex-wrap gap-2">
                                            {group.items.map(srv => {
                                              const selected = selectedServices.includes(srv);
                                              return (
                                                <button
                                                  key={srv}
                                                  type="button"
                                                  onClick={() => toggleService(srv)}
                                                  className={`rounded-lg border px-3 py-2 text-[11px] transition-[border-color,background-color,color] duration-200 ${selected ? 'border-brand-red/40 bg-brand-red/[0.045] text-white' : 'border-white/[0.08] bg-white/[0.02] text-[#8A909D] hover:border-white/[0.15] hover:text-white'}`}
                                                  aria-pressed={selected}
                                                >
                                                  {srv}
                                                </button>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              <div className="flex justify-end pt-1">
                                <button
                                  type="button"
                                  onClick={handleNextStep}
                                  className="inline-flex items-center gap-2 min-h-[46px] rounded-full bg-brand-red px-5 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-[#FF1E27] transition-all active:scale-[0.98] shadow-[0_10px_24px_-18px_rgba(229,9,20,0.72)]"
                                  data-cursor-label="Next"
                                >
                                  <span>{language === 'id' ? 'Lanjut' : 'Continue'}</span>
                                  <ChevronRight size={15} />
                                </button>
                              </div>
                            </motion.div>
                          )}

                          {formStep === 1 && (
                            <motion.div
                              key="step-contact"
                              initial={{ opacity: 0, x: 14 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -14 }}
                              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                              className="space-y-4"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                  <label htmlFor="inquiry-name" className="block text-[10px] font-mono text-[#8A909D] uppercase mb-1.5">{language === 'id' ? 'Nama Lengkap *' : 'Your Name *'}</label>
                                  <input id="inquiry-name" type="text" name="name" required autoComplete="name" value={formState.name} onChange={handleInputChange} placeholder={language === 'id' ? 'cth. Budi Santoso' : 'e.g. John Doe'} aria-invalid={Boolean(formErrors.name)} aria-describedby={formErrors.name ? 'inquiry-name-error' : undefined} className={`w-full min-h-[46px] bg-white/[0.015] border ${formErrors.name ? 'border-brand-red/70' : 'border-white/[0.09]'} rounded-xl px-4 py-3 text-base sm:text-sm text-white placeholder:text-[#8A909D]/50 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 transition-[border-color,box-shadow,background-color] duration-300`} />
                                  {formErrors.name && <p id="inquiry-name-error" className="text-[11px] font-mono text-brand-red mt-1.5 flex items-center gap-1" role="alert"><AlertCircle size={12} /><span>{formErrors.name}</span></p>}
                                </div>
                                <div>
                                  <label htmlFor="inquiry-email" className="block text-[10px] font-mono text-[#8A909D] uppercase mb-1.5">{language === 'id' ? 'Email Kerja *' : 'Work Email *'}</label>
                                  <input id="inquiry-email" type="email" name="email" required autoComplete="email" inputMode="email" value={formState.email} onChange={handleInputChange} placeholder="name@company.com" aria-invalid={Boolean(formErrors.email)} aria-describedby={formErrors.email ? 'inquiry-email-error' : undefined} className={`w-full min-h-[46px] bg-white/[0.015] border ${formErrors.email ? 'border-brand-red/70' : 'border-white/[0.09]'} rounded-xl px-4 py-3 text-base sm:text-sm text-white placeholder:text-[#8A909D]/50 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 transition-[border-color,box-shadow,background-color] duration-300`} />
                                  {formErrors.email && <p id="inquiry-email-error" className="text-[11px] font-mono text-brand-red mt-1.5 flex items-center gap-1" role="alert"><AlertCircle size={12} /><span>{formErrors.email}</span></p>}
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => setShowOptionalContact(prev => !prev)}
                                className="w-full flex items-center justify-between rounded-xl border border-dashed border-white/[0.1] bg-transparent px-4 py-3 text-xs text-[#8A909D] hover:border-brand-red/30 hover:text-white transition-colors"
                                aria-expanded={showOptionalContact}
                              >
                                <span>{language === 'id' ? 'Tambahkan perusahaan & WhatsApp (opsional)' : 'Add company & WhatsApp (optional)'}</span>
                                {showOptionalContact ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                              </button>

                              <AnimatePresence initial={false}>
                                {showOptionalContact && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 overflow-hidden"
                                  >
                                    <div>
                                      <label htmlFor="inquiry-company" className="block text-[10px] font-mono text-[#8A909D] uppercase mb-1.5">{language === 'id' ? 'Perusahaan / Brand' : 'Company / Brand'}</label>
                                      <input id="inquiry-company" type="text" name="company" autoComplete="organization" value={formState.company} onChange={handleInputChange} placeholder={language === 'id' ? 'Nama perusahaan' : 'Company name'} className="w-full min-h-[46px] bg-white/[0.015] border border-white/[0.09] rounded-xl px-4 py-3 text-base sm:text-sm text-white placeholder:text-[#8A909D]/50 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 transition-[border-color,box-shadow,background-color] duration-300" />
                                    </div>
                                    <div>
                                      <label htmlFor="inquiry-phone" className="block text-[10px] font-mono text-[#8A909D] uppercase mb-1.5">{language === 'id' ? 'WhatsApp / Telepon' : 'Phone / WhatsApp'}</label>
                                      <input id="inquiry-phone" type="tel" name="phone" autoComplete="tel" inputMode="tel" value={formState.phone} onChange={handleInputChange} placeholder="+62 812-xxxx-xxxx" aria-invalid={Boolean(formErrors.phone)} aria-describedby={formErrors.phone ? 'inquiry-phone-error' : undefined} className={`w-full min-h-[46px] bg-white/[0.015] border ${formErrors.phone ? 'border-brand-red/70' : 'border-white/[0.09]'} rounded-xl px-4 py-3 text-base sm:text-sm text-white placeholder:text-[#8A909D]/50 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 transition-[border-color,box-shadow,background-color] duration-300`} />
                                      {formErrors.phone && <p id="inquiry-phone-error" className="text-[11px] font-mono text-brand-red mt-1.5 flex items-center gap-1" role="alert"><AlertCircle size={12} /><span>{formErrors.phone}</span></p>}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              <div className="flex items-center justify-between gap-3 pt-2">
                                <button type="button" onClick={handlePreviousStep} className="inline-flex items-center gap-2 min-h-[44px] rounded-full border border-white/[0.09] bg-white/[0.02] px-4 text-xs font-semibold text-[#8A909D] hover:text-white hover:border-white/[0.16] transition-colors">
                                  <ChevronLeft size={15} />
                                  <span>{language === 'id' ? 'Kembali' : 'Back'}</span>
                                </button>
                                <button type="button" onClick={handleNextStep} className="inline-flex items-center gap-2 min-h-[46px] rounded-full bg-brand-red px-5 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-[#FF1E27] transition-all active:scale-[0.98] shadow-[0_12px_28px_-18px_rgba(229,9,20,0.9)]" data-cursor-label="Next">
                                  <span>{language === 'id' ? 'Lanjut' : 'Continue'}</span>
                                  <ChevronRight size={15} />
                                </button>
                              </div>
                            </motion.div>
                          )}

                          {formStep === 2 && (
                            <motion.div
                              key="step-context"
                              initial={{ opacity: 0, x: 14 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -14 }}
                              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                              className="space-y-5"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-3 mb-1.5">
                                  <label htmlFor="inquiry-message" className="block text-[10px] font-mono text-white uppercase tracking-[0.14em]">{language === 'id' ? 'Apa yang perlu kami tahu? *' : 'What should we know? *'}</label>
                                  <span className="text-[10px] font-mono tabular-nums text-[#8A909D]">{formState.message.length}/3000</span>
                                </div>
                                <textarea id="inquiry-message" name="message" required rows={6} maxLength={3000} value={formState.message} onChange={handleInputChange} placeholder={language === 'id' ? 'Contoh: kami butuh website company profile baru untuk launching kuartal depan.' : 'Example: we need a new company website for a launch next quarter.'} aria-invalid={Boolean(formErrors.message)} aria-describedby={formErrors.message ? 'inquiry-message-error' : undefined} className={`w-full min-h-[150px] bg-white/[0.015] border ${formErrors.message ? 'border-brand-red/70' : 'border-white/[0.09]'} rounded-xl px-4 py-3.5 text-base sm:text-sm text-white placeholder:text-[#8A909D]/50 focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 resize-y transition-all duration-200`} />
                                {formErrors.message ? (
                                  <p id="inquiry-message-error" className="text-[11px] font-mono text-brand-red mt-1.5 flex items-center gap-1" role="alert"><AlertCircle size={12} /><span>{formErrors.message}</span></p>
                                ) : (
                                  <p className="mt-1.5 text-[11px] text-[#8A909D]/75">{language === 'id' ? 'Minimal 10 karakter. Singkat saja sudah cukup.' : 'Minimum 10 characters. Keep it concise.'}</p>
                                )}
                              </div>

                              <div>
                                <div className="flex items-end justify-between gap-3 mb-2">
                                  <div>
                                    <span className="block text-[10px] font-mono text-white uppercase tracking-[0.14em]">{language === 'id' ? 'Budget (opsional)' : 'Budget (optional)'}</span>
                                  </div>
                                  {budgetRange && (
                                    <button type="button" onClick={() => setBudgetRange('')} className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#8A909D] hover:text-white">Reset</button>
                                  )}
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  {budgetOptions.map((opt, index) => {
                                    const selected = budgetRange === opt;
                                    return (
                                      <motion.button
                                        type="button"
                                        key={opt}
                                        onClick={() => setBudgetRange(opt)}
                                        whileTap={{ scale: 0.985 }}
                                        aria-pressed={selected}
                                        className={`min-h-[50px] rounded-xl border px-3.5 py-2.5 text-left text-xs transition-[border-color,background-color,color,box-shadow] duration-250 ${selected ? 'border-brand-red/45 bg-brand-red/[0.055] text-white font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]' : 'border-white/[0.08] bg-white/[0.015] text-[#8A909D] hover:border-white/[0.15] hover:text-white'}`}
                                      >
                                        <span className="block text-[9px] font-mono uppercase tracking-[0.1em] opacity-70">0{index + 1}</span>
                                        <span className="block mt-0.5">{opt}</span>
                                      </motion.button>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="flex items-center justify-between gap-3 pt-1">
                                <button type="button" onClick={handlePreviousStep} className="inline-flex items-center gap-2 min-h-[46px] rounded-full border border-white/[0.09] bg-white/[0.02] px-4 text-xs font-semibold text-[#8A909D] hover:text-white hover:border-white/15 transition-colors">
                                  <ChevronLeft size={15} />
                                  <span>{language === 'id' ? 'Kembali' : 'Back'}</span>
                                </button>
                                <button
                                  type="submit"
                                  disabled={isSubmitting}
                                  className="group inline-flex items-center justify-center gap-2 min-h-[48px] rounded-full bg-brand-red px-5 sm:px-6 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-[#FF1E27] disabled:opacity-70 disabled:cursor-wait transition-all active:scale-[0.99] shadow-[0_10px_24px_-18px_rgba(229,9,20,0.72)]"
                                  data-cursor-label="Send"
                                >
                                  {isSubmitting ? <LoaderCircle size={15} className="animate-spin" /> : <span>{language === 'id' ? 'Kirim inquiry' : 'Send inquiry'}</span>}
                                  {!isSubmitting && <Send size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />}
                                </button>
                              </div>

                              {submitError && (
                                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2 rounded-xl border border-brand-red/25 bg-brand-red/[0.06] px-4 py-3 text-xs font-mono text-brand-red" role="alert">
                                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                                  <span>{submitError}</span>
                                </motion.div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 relative z-10 bg-[#0B0C0E]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-10 sm:mb-16">
            <span className="text-brand-red font-mono font-semibold tracking-widest uppercase text-xs mb-2 sm:mb-3 block">
              {language === 'id' ? 'Jawaban Lengkap' : 'Clear Answers'}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold tracking-tight mb-3 text-white">
              {language === 'id' ? 'Pertanyaan yang Sering Diajukan' : 'Frequently Asked Questions'}
            </h2>
            <p className="text-xs sm:text-sm text-[#8A909D] font-light leading-relaxed">
              {language === 'id'
                ? 'Semua hal yang perlu Anda ketahui mengenai kolaborasi bersama Kapitech Agency.'
                : 'Everything you need to know about partnering with Kapitech Agency.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
            {displayedFaqs.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="p-6 sm:p-8 rounded-2xl bg-[#16181D] border border-[#262930] flex flex-col justify-between min-h-[150px] sm:min-h-[170px] hover:border-brand-red/40 transition-colors"
              >
                <div>
                  <h3 className="text-sm sm:text-base font-display font-bold text-white mb-2 sm:mb-3">
                    {faq.q}
                  </h3>
                  <p className="text-xs text-[#8A909D] font-light leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View More / Show Less Toggle Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowAllFaqs(prev => !prev)}
              className="px-7 sm:px-8 py-3.5 rounded-full border border-[#262930] bg-[#16181D] hover:bg-[#1B1F26] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 active:scale-95 min-h-[44px]"
            >
              <span>
                {language === 'id'
                  ? showAllFaqs ? 'Tampilkan Lebih Sedikit' : `Lihat FAQ Lainnya (${allFaqs.length - 4} Lainnya)`
                  : showAllFaqs ? 'Show Less FAQs' : `View More FAQs (${allFaqs.length - 4} More)`}
              </span>
              {showAllFaqs ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
