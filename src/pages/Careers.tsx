import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, 
  CheckCircle2, 
  Globe, 
  Users, 
  Heart, 
  Coffee, 
  Laptop, 
  Upload, 
  FileText, 
  Phone, 
  Mail, 
  User, 
  Link as LinkIcon, 
  X, 
  Briefcase, 
  MapPin, 
  Clock,
  Sparkles,
  Building2,
  TrendingUp,
  Award,
  ShieldCheck,
  Zap,
  DollarSign,
  Layers,
  Palette,
  Code2,
  Check,
  AlertCircle,
  FolderGit2
} from 'lucide-react';
import { AtmosphericBackground } from '../components/ui/AtmosphericBackground';
import { useLanguage } from '../lib/LanguageContext';
import { sanitizeInput, isValidEmail, isValidPhone, validateResumeFile, clampLength } from '../lib/security';
import { submitToInbox } from '../lib/submissions';
import { uploadPublicResume } from '../lib/apiClient';

export interface Position {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  workplace: string;
  badge: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  compensation?: string;
}

export const Careers = () => {
  const { language } = useLanguage();
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicantSubmitError, setApplicantSubmitError] = useState('');
  const [isApplicantSubmitting, setIsApplicantSubmitting] = useState(false);
  const [applicantErrors, setApplicantErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    portfolio: '',
    coverLetter: '',
    resume: null as File | null
  });

  // Freelance Vendor Modal & Form State
  const [isFreelanceModalOpen, setIsFreelanceModalOpen] = useState(false);
  const [isVendorSubmitted, setIsVendorSubmitted] = useState(false);
  const [vendorSubmitError, setVendorSubmitError] = useState('');
  const [isVendorSubmitting, setIsVendorSubmitting] = useState(false);
  const [vendorErrors, setVendorErrors] = useState<{ [key: string]: string }>({});
  const [vendorHoneypot, setVendorHoneypot] = useState('');
  const [vendorFormData, setVendorFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: 'UI/UX & Product Design',
    portfolio: '',
    rateCard: '',
    experienceYears: '3-5 Years',
    tools: '',
    notes: '',
    agreedWfa: true,
    agreedDevice: true,
    agreedNda: true,
    resume: null as File | null
  });

  const [selectedTalent, setSelectedTalent] = useState<any | null>(null);

  const twelveTalentsEn = [
    {
      id: "aditya-pratama",
      name: "Aditya Pratama",
      role: "Lead Frontend Engineer",
      specialty: "React, Next.js & Web Performance",
      department: "Innovation Development",
      experience: "6+ Years Exp",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=85&w=800",
      bio: "Specializes in sub-second DOM hydration, micro-frontend architecture, and fluid motion physics."
    },
    {
      id: "nathania-kusuma",
      name: "Nathania Kusuma",
      role: "Senior UI/UX & Design Systems Lead",
      specialty: "Figma Systems & Design Tokens",
      department: "Visual Experience",
      experience: "5+ Years Exp",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=85&w=800",
      bio: "Crafts mathematically scaled Figma design systems, accessible WCAG color models, and interactive micro-interactions."
    },
    {
      id: "bagas-wicaksono",
      name: "Bagas Wicaksono",
      role: "Senior Motion & 2D Animator",
      specialty: "Kinetic Typography & After Effects",
      department: "Visual Experience",
      experience: "4+ Years Exp",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=85&w=800",
      bio: "Brings brand stories to life through high-frame-rate kinetic animation, 2D character explainers, and Lottie assets."
    },
    {
      id: "clarissa-angela",
      name: "Clarissa Angela",
      role: "Brand Identity & Editorial Designer",
      specialty: "Brand Guidelines & Visual Story",
      department: "Visual Experience",
      experience: "5+ Years Exp",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=85&w=800",
      bio: "Authors bespoke typography pairings, multi-brand identity kits, and investor presentation collateral."
    },
    {
      id: "dimas-rizky",
      name: "Dimas Rizky",
      role: "3D Visualizer & Spline Technologist",
      specialty: "Blender 3D & WebGL Environments",
      department: "Visual Experience",
      experience: "4+ Years Exp",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=85&w=800",
      bio: "Builds photorealistic architectural renders, 3D product prototypes, and real-time Spline WebGL canvases."
    },
    {
      id: "evelyn-santoso",
      name: "Evelyn Santoso",
      role: "Senior Product & Mobile UI Designer",
      specialty: "iOS/Android Ergonomics & Prototypes",
      department: "Visual Experience",
      experience: "5+ Years Exp",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=85&w=800",
      bio: "Engineers thumb-accessible mobile UX flows, haptic feedback loops, and multi-tenant mobile applications."
    },
    {
      id: "farhan-ramadhan",
      name: "Farhan Ramadhan",
      role: "Cloud Infrastructure & DevOps Specialist",
      specialty: "AWS, GCP & Automated CI/CD",
      department: "Innovation Development",
      experience: "6+ Years Exp",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=85&w=800",
      bio: "Maintains 99.99% cloud uptime, automated blue-green deployment pipelines, and zero-trust security."
    },
    {
      id: "gabriella-tan",
      name: "Gabriella Tan",
      role: "2D Character Artist & Illustrator",
      specialty: "Vector Assets & Explainer Artworks",
      department: "Visual Experience",
      experience: "4+ Years Exp",
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=85&w=800",
      bio: "Draws distinctive editorial vectors, custom icon sets, and charismatic 2D character sets for brand campaigns."
    },
    {
      id: "haikal-firdaus",
      name: "Haikal Firdaus",
      role: "Senior Backend & Database Architect",
      specialty: "Node.js, PostgreSQL & Distributed Cache",
      department: "Innovation Development",
      experience: "7+ Years Exp",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=85&w=800",
      bio: "Architects scalable microservices, low-latency Redis caching layers, and high-volume relational schemas."
    },
    {
      id: "indah-permata",
      name: "Indah Permata",
      role: "Video Producer & Commercial Colorist",
      specialty: "TVC Editing, Cinematic LUTs & DaVinci",
      department: "Visual Experience",
      experience: "5+ Years Exp",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=85&w=800",
      bio: "Directs cinematic commercial shoots, color grades in DaVinci Resolve Studio, and produces TVC broadcast masters."
    },
    {
      id: "julian-mahendra",
      name: "Julian Mahendra",
      role: "Full-Stack SaaS & Web App Engineer",
      specialty: "TypeScript, GraphQL & Realtime Sockets",
      department: "Innovation Development",
      experience: "5+ Years Exp",
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=85&w=800",
      bio: "Develops real-time collaborative SaaS platforms, custom enterprise CRM tooling, and high-security REST APIs."
    },
    {
      id: "karina-wijaya",
      name: "Karina Wijaya",
      role: "Pitch Deck & Publication Strategist",
      specialty: "Investor Decks & High-Impact Reports",
      department: "Visual Experience",
      experience: "4+ Years Exp",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=85&w=800",
      bio: "Translates complex financial data and corporate roadmaps into crisp, executive-ready presentation decks."
    }
  ];

  const twelveTalentsId = [
    {
      id: "aditya-pratama",
      name: "Aditya Pratama",
      role: "Lead Frontend Engineer",
      specialty: "React, Next.js & Web Performance",
      department: "Innovation Development",
      experience: "Pengalaman 6+ Tahun",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=85&w=800",
      bio: "Spesialis dalam hidrasi DOM sub-detik, arsitektur micro-frontend, dan fisika animasi berbasis kode modern."
    },
    {
      id: "nathania-kusuma",
      name: "Nathania Kusuma",
      role: "Senior UI/UX & Design Systems Lead",
      specialty: "Sistem Desain Figma & Token UI",
      department: "Visual Experience",
      experience: "Pengalaman 5+ Tahun",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=85&w=800",
      bio: "Merancang sistem desain modular Figma, standar aksesibilitas WCAG, dan uji interaksi prototipe pengguna."
    },
    {
      id: "bagas-wicaksono",
      name: "Bagas Wicaksono",
      role: "Senior Motion & 2D Animator",
      specialty: "Tipografi Kinetik & After Effects",
      department: "Visual Experience",
      experience: "Pengalaman 4+ Tahun",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=85&w=800",
      bio: "Menghidupkan cerita brand lewat animasi frame-rate tinggi, video explainer komersial, dan aset Lottie."
    },
    {
      id: "clarissa-angela",
      name: "Clarissa Angela",
      role: "Brand Identity & Editorial Designer",
      specialty: "Pedoman Brand & Identitas Visual",
      department: "Visual Experience",
      experience: "Pengalaman 5+ Tahun",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=85&w=800",
      bio: "Merancang identitas korporat, brandbook komprehensif, dan materi publikasi editorial tingkat tinggi."
    },
    {
      id: "dimas-rizky",
      name: "Dimas Rizky",
      role: "3D Visualizer & Spline Technologist",
      specialty: "Blender 3D & Lingkungan WebGL",
      department: "Visual Experience",
      experience: "Pengalaman 4+ Tahun",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=85&w=800",
      bio: "Membangun render fotorealistis 3D produk, visualisasi arsitektur, dan aset WebGL real-time interaktif."
    },
    {
      id: "evelyn-santoso",
      name: "Evelyn Santoso",
      role: "Senior Product & Mobile UI Designer",
      specialty: "Ergonomi iOS/Android & Prototipe",
      department: "Visual Experience",
      experience: "Pengalaman 5+ Tahun",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=85&w=800",
      bio: "Merancang pengalaman aplikasi mobile yang ramah ibu jari, alur onboarding mulus, dan responsivitas layar."
    },
    {
      id: "farhan-ramadhan",
      name: "Farhan Ramadhan",
      role: "Cloud Infrastructure & DevOps Engineer",
      specialty: "AWS, Docker & Otomasi Pipeline CI/CD",
      department: "Innovation Development",
      experience: "Pengalaman 6+ Tahun",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=85&w=800",
      bio: "Menjaga uptime server 99.99%, otomatisasi build pipeline multi-region, dan mitigasi keamanan cloud."
    },
    {
      id: "gabriella-tan",
      name: "Gabriella Tan",
      role: "2D Character Artist & Illustrator",
      specialty: "Aset Vektor & Artwork Video Explainer",
      department: "Visual Experience",
      experience: "Pengalaman 4+ Tahun",
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=85&w=800",
      bio: "Menggambar ilustrasi vektor orisinal, paket ikon kustom, dan karakter visual berkarakter kuat untuk kampanye."
    },
    {
      id: "haikal-firdaus",
      name: "Haikal Firdaus",
      role: "Senior Backend & Database Architect",
      specialty: "Node.js, PostgreSQL & Distributed Cache",
      department: "Innovation Development",
      experience: "Pengalaman 7+ Tahun",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=85&w=800",
      bio: "Membangun arsitektur microservices terukur, cache berkinerja tinggi, dan relasi database berkeamanan tinggi."
    },
    {
      id: "indah-permata",
      name: "Indah Permata",
      role: "Video Producer & Commercial Colorist",
      specialty: "Editing TVC, LUT Sinematik & DaVinci",
      department: "Visual Experience",
      experience: "Pengalaman 5+ Tahun",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=85&w=800",
      bio: "Memproduksi video komersial brand, grading warna sinematik di DaVinci Studio, dan supervisi audio master."
    },
    {
      id: "julian-mahendra",
      name: "Julian Mahendra",
      role: "Full-Stack SaaS & Web App Engineer",
      specialty: "TypeScript, GraphQL & Realtime Sockets",
      department: "Innovation Development",
      experience: "Pengalaman 5+ Tahun",
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=85&w=800",
      bio: "Mengembangkan aplikasi SaaS kolaboratif real-time, integrasi sistem CRM bisnis, dan API terenkripsi."
    },
    {
      id: "karina-wijaya",
      name: "Karina Wijaya",
      role: "Pitch Deck & Publication Strategist",
      specialty: "Investor Pitch Deck & Laporan Finansial",
      department: "Visual Experience",
      experience: "Pengalaman 4+ Tahun",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=85&w=800",
      bio: "Mengubah data bisnis dan proyeksi keuangan yang kompleks menjadi deck presentasi investor yang meyakinkan."
    }
  ];

  const twelveTalents = language === 'id' ? twelveTalentsId : twelveTalentsEn;

  const positionsEn: Position[] = [
    {
      id: 'bdr-partnership',
      title: 'Business Development Representative (BDR)',
      department: 'Business & Partnerships',
      location: 'South Tangerang & Remote',
      workplace: 'Hybrid',
      type: 'Commission Based • Contract Freelancer Partnership',
      badge: 'High Commission + Bonus',
      summary: 'Drive high-value enterprise and mid-market client partnerships. You will identify business opportunities for our Visual Experience and Innovation Development services, conduct discovery pitches, and earn competitive uncapped commissions.',
      responsibilities: [
        'Identify and prospect prospective corporate clients, startups, and brand leaders requiring digital transformation or visual design',
        'Initiate outbound sales outreach via LinkedIn, email sequences, and high-impact discovery calls',
        'Present Kapitech Agency capabilities, pitch decks, and tailored solution proposals to key decision-makers (C-Level, VP, Directors)',
        'Negotiate scope agreements and collaborate closely with our CEO and Project Managers for seamless client onboarding',
        'Maintain accurate deal telemetry, CRM pipeline tracking, and revenue forecasting'
      ],
      requirements: [
        'Proven track record in B2B sales, agency business development, or software solutions partnership',
        'Strong network in technology, corporate, creative, or e-commerce sectors',
        'Outstanding verbal and written communication skills with persuasive pitching ability',
        'Self-motivated, goal-oriented mindset thriving in a performance-driven commission structure',
        'Fluency in Bahasa Indonesia and professional English proficiency'
      ],
      compensation: 'Uncapped Deal Commissions + Milestone Performance Bonuses'
    },
    {
      id: 'ui-ux-product-designer',
      title: 'UI/UX & Product Designer',
      department: 'Design & Visual Experience',
      location: 'Kapitech Studio, South Tangerang',
      workplace: 'WFO (Work From Office)',
      type: 'Full Time',
      badge: 'Full Time • On-site Studio',
      summary: 'Join our in-studio creative squad to author world-class digital interfaces, responsive design systems in Figma, and interactive user experiences for global and domestic client projects.',
      responsibilities: [
        'Design pixel-perfect responsive web, mobile app (iOS/Android), and SaaS software interfaces',
        'Architect and maintain scalable design systems, design tokens, and comprehensive component libraries in Figma',
        'Conduct user journey mapping, wireframing, interactive prototyping, and usability validation sprints',
        'Collaborate side-by-side with our Executive Creative Director and frontend engineers for flawless implementation',
        'Prepare presentation decks and articulate UX/UI rationale directly during client review sessions'
      ],
      requirements: [
        '2+ years of professional experience in UI/UX design for web platforms, mobile apps, or digital agencies',
        'Stunning design portfolio showcasing modern visual hierarchy, clean typography, and responsive UX systems',
        'Mastery of Figma, FigJam, auto-layout, component variants, and interactive prototyping',
        'Ability to work full-time on-site at our South Tangerang studio with strong collaborative energy',
        'High attention to visual craft, micro-interactions, and design-to-code feasibility'
      ],
      compensation: 'Competitive Monthly Salary + Health Coverage + Project Performance Bonuses'
    }
  ];

  const positionsId: Position[] = [
    {
      id: 'bdr-partnership',
      title: 'Business Development Representative (BDR)',
      department: 'Bisnis & Kemitraan',
      location: 'Tangerang Selatan & Remote',
      workplace: 'Hybrid',
      type: 'Commission Based • Contract Freelancer Partnership',
      badge: 'Komisi Tinggi + Bonus',
      summary: 'Pimpin ekspansi kemitraan klien korporat dan pasar menengah. Anda akan mengidentifikasi peluang bisnis untuk layanan Visual Experience dan Innovation Development kami, mempresentasikan solusi, dan memperoleh komisi berbasis performa tanpa batas.',
      responsibilities: [
        'Mengidentifikasi dan memprospek calon klien perusahaan, startup, dan brand yang membutuhkan transformasi digital atau desain visual',
        'Melakukan outbound sales outreach melalui LinkedIn, email bisnis, dan discovery call terarah',
        'Mempresentasikan portofolio Kapitech Agency, proposal kustom, dan lingkup kerja kepada pengambil keputusan utama (C-Level, VP, Direktur)',
        'Membantu negosiasi kontrak kerja sama dan berkoordinasi langsung dengan CEO serta Project Manager kami',
        'Memelihara catatan pipeline prospek di CRM dan pelacakan target pendapatan secara terstruktur'
      ],
      requirements: [
        'Pengalaman terbukti dalam B2B sales, kemitraan agensi digital, atau penjualan solusi perangkat lunak',
        'Memiliki jaringan luas di sektor teknologi, korporasi, retail kreatif, atau e-commerce',
        'Kemampuan komunikasi lisan dan tulisan yang persuasif serta percaya diri saat presentasi',
        'Mandiri, berorientasi pada target, dan termotivasi oleh skema komisi berbasis kinerja',
        'Fasih berbahasa Indonesia dan memiliki kemampuan bahasa Inggris bisnis yang baik'
      ],
      compensation: 'Komisi Proyek Tanpa Batas + Bonus Pencapaian Target Milestone'
    },
    {
      id: 'ui-ux-product-designer',
      title: 'UI/UX & Product Designer',
      department: 'Desain & Visual Experience',
      location: 'Studio Kapitech, Tangerang Selatan',
      workplace: 'WFO (Work From Office)',
      type: 'Full Time',
      badge: 'Full Time • Studio On-site',
      summary: 'Bergabunglah bersama tim kreatif di studio kami untuk merancang antarmuka digital kelas dunia, sistem desain responsif di Figma, dan pengalaman pengguna interaktif untuk klien global dan nasional.',
      responsibilities: [
        'Merancang antarmuka web responsif, aplikasi mobile (iOS/Android), dan sistem software SaaS berpresisi tinggi',
        'Membangun serta memelihara sistem desain modular, token desain, dan pustaka komponen di Figma',
        'Melakukan pemetaan alur pengguna, wireframing, pembuatan prototipe interaktif, dan uji usabilitas',
        'Berkolaborasi langsung di studio bersama Executive Creative Director dan frontend engineer untuk memastikan hasil koding sesuai desain',
        'Mempersiapkan deck presentasi dan menjelaskan pertimbangan desain secara objektif dalam sesi review klien'
      ],
      requirements: [
        '2+ tahun pengalaman profesional di bidang desain UI/UX untuk platform web, aplikasi mobile, atau agensi',
        'Portofolio desain yang kuat menunjukkan penguasaan tipografi, tata letak visual modern, dan sistem UX responsif',
        'Keahlian mendalam dalam Figma, FigJam, auto-layout, varian komponen, dan prototipe interaktif',
        'Bersedia bekerja full-time on-site (WFO) di studio Tangerang Selatan dengan semangat kolaborasi tinggi',
        'Ketelitian tinggi terhadap detail visual mikro, konsistensi brand, dan kelayakan teknis implementasi kode'
      ],
      compensation: 'Gaji Pokok Kompetitif + Asuransi Kesehatan + Bonus Kinerja Proyek'
    }
  ];

  const positions = language === 'id' ? positionsId : positionsEn;

  const benefitsEn = [
    {
      icon: <TrendingUp size={24} />,
      title: "Uncapped Earnings & Growth",
      desc: "Lucrative performance-driven commissions for BDRs and structured career paths with annual salary reviews."
    },
    {
      icon: <Briefcase size={24} />,
      title: "Real Enterprise Impact",
      desc: "Work on genuine client products for high-growth ventures, enterprise leaders, and disruptive global startups."
    },
    {
      icon: <Coffee size={24} />,
      title: "Inspiring Studio Culture",
      desc: "Modern collaborative workspace in South Tangerang equipped with cutting-edge hardware, ergonomic setups, and zero bureaucracy."
    },
    {
      icon: <Heart size={24} />,
      title: "Health & Professional Tools",
      desc: "Full Figma Organization licenses, AI tool subscriptions, learning stipends, and comprehensive health coverage."
    }
  ];

  const benefitsId = [
    {
      icon: <TrendingUp size={24} />,
      title: "Pendapatan & Karier Bertumbuh",
      desc: "Komisi performa tanpa batas untuk BDR dan jenjang karier terstruktur dengan tinjauan berkala."
    },
    {
      icon: <Briefcase size={24} />,
      title: "Dampak Nyata Bersama Klien",
      desc: "Berkontribusi pada proyek riil untuk startup berkembang pesat dan perusahaan korporat terkemuka."
    },
    {
      icon: <Coffee size={24} />,
      title: "Budaya Studio yang Menginspirasi",
      desc: "Ruang kerja studio kolaboratif di Tangerang Selatan dengan perangkat kerja modern dan komunikasi langsung tanpa birokrasi."
    },
    {
      icon: <Heart size={24} />,
      title: "Kesehatan & Fasilitas Alat Kerja",
      desc: "Lisensi penuh Figma, langganan tool AI, anggaran pengembangan keahlian, dan perlindungan kesehatan komprehensif."
    }
  ];

  const benefits = language === 'id' ? benefitsId : benefitsEn;
  const [honeypot, setHoneypot] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (applicantErrors[name]) {
      setApplicantErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateResumeFile(file);
      if (!validation.isValid) {
        setApplicantErrors(prev => ({ ...prev, resume: validation.error || 'Invalid file' }));
        return;
      }
      setApplicantErrors(prev => {
        const next = { ...prev };
        delete next.resume;
        return next;
      });
      setFormData(prev => ({ ...prev, resume: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot.trim().length > 0) {
      setIsSubmitted(true);
      return;
    }
    const sanitizedName = sanitizeInput(clampLength(formData.name, 100));
    const sanitizedEmail = sanitizeInput(clampLength(formData.email, 120));
    const sanitizedPhone = sanitizeInput(clampLength(formData.phone, 30));
    const sanitizedPortfolio = sanitizeInput(clampLength(formData.portfolio, 250));
    const sanitizedCoverLetter = sanitizeInput(clampLength(formData.coverLetter, 2000));

    const errors: { [key: string]: string } = {};
    if (!sanitizedName) errors.name = language === 'id' ? 'Nama wajib diisi' : 'Name is required';
    if (!sanitizedEmail || !isValidEmail(sanitizedEmail)) errors.email = language === 'id' ? 'Email tidak valid' : 'Valid email is required';
    if (sanitizedPhone && !isValidPhone(sanitizedPhone)) errors.phone = language === 'id' ? 'Nomor telepon tidak valid' : 'Valid phone number is required';
    if (!formData.resume) errors.resume = language === 'id' ? 'Dokumen resume / CV wajib diunggah' : 'Resume / CV file is required';

    if (Object.keys(errors).length > 0) {
      setApplicantErrors(errors);
      return;
    }

    setApplicantErrors({});
    setApplicantSubmitError('');
    setIsApplicantSubmitting(true);
    try {
      const resumeUpload = formData.resume ? await uploadPublicResume(formData.resume) : null;
      if (!resumeUpload?.success || !resumeUpload.data?.resumeUrl) {
        throw new Error(resumeUpload?.error || 'Resume upload failed.');
      }

      await submitToInbox({
        fullName: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        positionTitle: selectedPosition ? selectedPosition.title : 'General Studio Application',
        portfolioUrl: sanitizedPortfolio,
        resumeUrl: resumeUpload.data.resumeUrl,
        message: `[Studio Role Application: ${selectedPosition?.title || 'Open Role'}]\nResume File: ${resumeUpload?.data?.filename || 'Not attached'}\nPortfolio: ${sanitizedPortfolio || '-'}\n\nCover Letter:\n${sanitizedCoverLetter || 'No cover letter provided.'}`,
        source: `Careers: ${selectedPosition?.title || 'Studio Role'}`,
        type: 'career'
      });
    } catch (err) {
      console.warn('Applicant submission error:', err);
      setApplicantSubmitError(
        language === 'id'
          ? 'Lamaran belum tersimpan. Periksa koneksi lalu coba lagi.'
          : 'Your application was not saved. Please check your connection and try again.'
      );
      return;
    } finally {
      setIsApplicantSubmitting(false);
    }
    setIsSubmitted(true);
  };

  const handleVendorInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setVendorFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setVendorFormData(prev => ({ ...prev, [name]: value }));
    }
    if (vendorErrors[name]) {
      setVendorErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleVendorFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateResumeFile(file);
      if (!validation.isValid) {
        setVendorErrors(prev => ({ ...prev, resume: validation.error || 'Invalid file' }));
        return;
      }
      setVendorErrors(prev => {
        const next = { ...prev };
        delete next.resume;
        return next;
      });
      setVendorFormData(prev => ({ ...prev, resume: file }));
    }
  };

  const handleVendorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (vendorHoneypot.trim().length > 0) {
      setIsVendorSubmitted(true);
      return;
    }
    const sanitizedName = sanitizeInput(clampLength(vendorFormData.name, 100));
    const sanitizedEmail = sanitizeInput(clampLength(vendorFormData.email, 120));
    const sanitizedPhone = sanitizeInput(clampLength(vendorFormData.phone, 30));
    const sanitizedPortfolio = sanitizeInput(clampLength(vendorFormData.portfolio, 250));
    const sanitizedRateCard = sanitizeInput(clampLength(vendorFormData.rateCard, 100));
    const sanitizedTools = sanitizeInput(clampLength(vendorFormData.tools, 200));
    const sanitizedNotes = sanitizeInput(clampLength(vendorFormData.notes, 2000));

    const errors: { [key: string]: string } = {};
    if (!sanitizedName) errors.name = language === 'id' ? 'Nama wajib diisi' : 'Name is required';
    if (!sanitizedEmail || !isValidEmail(sanitizedEmail)) errors.email = language === 'id' ? 'Email tidak valid' : 'Valid email is required';
    if (sanitizedPhone && !isValidPhone(sanitizedPhone)) errors.phone = language === 'id' ? 'Nomor telepon tidak valid' : 'Valid phone number is required';

    if (Object.keys(errors).length > 0) {
      setVendorErrors(errors);
      return;
    }

    setVendorErrors({});
    setVendorSubmitError('');
    setIsVendorSubmitting(true);
    try {
      const resumeUpload = vendorFormData.resume ? await uploadPublicResume(vendorFormData.resume) : null;
      if (vendorFormData.resume && (!resumeUpload?.success || !resumeUpload.data?.resumeUrl)) {
        throw new Error(resumeUpload?.error || 'Resume upload failed.');
      }

      await submitToInbox({
        fullName: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        specialty: vendorFormData.specialty,
        rateCard: sanitizedRateCard,
        experienceYears: vendorFormData.experienceYears,
        tools: sanitizedTools,
        portfolioUrl: sanitizedPortfolio,
        resumeUrl: resumeUpload?.data?.resumeUrl,
        message: `[Freelance Vendor Application]\nSpecialty: ${vendorFormData.specialty}\nExperience: ${vendorFormData.experienceYears}\nRate / Project Cost: ${sanitizedRateCard || 'Standard rate'}\nTools & Stack: ${sanitizedTools || '-'}\nPortfolio / CV Link: ${sanitizedPortfolio || '-'}\nResume File: ${resumeUpload.data.filename}\n\nAdditional Notes:\n${sanitizedNotes || '-'}`,
        source: 'Careers: Freelance Vendor Network',
        type: 'vendor'
      });
    } catch (err) {
      console.warn('Vendor submission error:', err);
      setVendorSubmitError(
        language === 'id'
          ? 'Pendaftaran vendor belum tersimpan. Periksa koneksi lalu coba lagi.'
          : 'Your vendor application was not saved. Please check your connection and try again.'
      );
      return;
    } finally {
      setIsVendorSubmitting(false);
    }
    setIsVendorSubmitted(true);
  };

  return (
    <div className="kapi-careers bg-[#0B0C0E] text-white min-h-screen selection:bg-brand-red selection:text-white relative" role="main">
      {/* Hero Section */}
      <section className="relative min-h-[720px] pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 md:px-12 border-b border-line overflow-hidden flex items-end">
        <AtmosphericBackground
          imageUrl="/hero_background_3d.png"
          opacity={0.05}
          disableGrayscale={true}
        />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_78%_28%,rgba(229,9,20,0.08),transparent_32%)]" />
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-12 lg:gap-20 items-end">
            <div>
              <div className="flex items-center gap-3 mb-7">
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand-red">KAPITECH / CAREERS</span>
                <span className="h-px w-16 bg-line" />
                <span className="font-mono text-[10px] text-muted uppercase tracking-wider">2026</span>
              </div>
              <h1 className="max-w-5xl text-[clamp(3.5rem,8.5vw,8.5rem)] font-display font-bold leading-[0.84] tracking-[-0.065em] text-white">
                {language === 'id'
                  ? <>Berkarya.<br /><span className="text-brand-red">Tumbuh.</span><br />Bergerak.</>
                  : <>Build.<br /><span className="text-brand-red">Grow.</span><br />Move.</>}
              </h1>
              <p className="mt-8 max-w-2xl text-base sm:text-lg md:text-xl text-white/58 font-light leading-relaxed">
                {language === 'id'
                  ? 'Kami mencari orang yang suka mengerjakan hal sulit dengan standar tinggi, baik di studio maupun sebagai bagian dari network specialist kami.'
                  : 'We look for people who enjoy difficult work at a high standard, whether inside the studio or across our specialist network.'}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#open-positions"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-black hover:bg-brand-red hover:text-white text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300"
                >
                  <span>{language === 'id' ? 'Lihat posisi aktif' : 'View open roles'}</span>
                  <ArrowUpRight size={14} />
                </a>
                <button
                  onClick={() => {
                    setIsFreelanceModalOpen(true);
                    setIsVendorSubmitted(false);
                    setVendorSubmitError('');
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-brand-red hover:bg-[#FF2B38] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 shadow-lg shadow-brand-red/20"
                >
                  <FolderGit2 size={14} />
                  <span>{language === 'id' ? 'Gabung network' : 'Join the network'}</span>
                </button>
              </div>
            </div>

            <div className="lg:pb-1">
              <div className="border-t border-line">
                <div className="grid grid-cols-2 border-b border-line">
                  <div className="py-5 pr-4 border-r border-line">
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-muted">01</span>
                    <strong className="mt-2 block text-lg font-display font-semibold text-white">{language === 'id' ? 'Studio' : 'Studio'}</strong>
                    <span className="mt-1 block text-xs text-muted leading-relaxed">{language === 'id' ? 'Role on-site di Tangerang Selatan' : 'On-site roles in South Tangerang'}</span>
                  </div>
                  <div className="py-5 pl-4">
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-muted">02</span>
                    <strong className="mt-2 block text-lg font-display font-semibold text-white">{language === 'id' ? 'Network' : 'Network'}</strong>
                    <span className="mt-1 block text-xs text-muted leading-relaxed">{language === 'id' ? 'Specialist 100% WFA, project-based' : '100% WFA specialist network'}</span>
                  </div>
                </div>
                <div className="py-6">
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-brand-red mb-2">{language === 'id' ? 'Saat ini' : 'Now hiring'}</span>
                  <div className="flex items-end justify-between gap-5">
                    <div>
                      <strong className="block text-4xl sm:text-5xl font-display font-semibold text-white leading-none">02</strong>
                      <span className="mt-2 block text-xs text-muted">{language === 'id' ? 'posisi studio aktif' : 'active studio roles'}</span>
                    </div>
                    <div className="w-16 h-16 rounded-full border border-brand-red/30 bg-brand-red/10 flex items-center justify-center text-brand-red">
                      <Sparkles size={22} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-5 border-t border-line text-[10px] font-mono uppercase tracking-widest text-muted">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {language === 'id' ? 'Open for applications' : 'Open for applications'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: People & Studio Philosophy */}
      <section className="kapi-careers-people py-20 sm:py-28 md:py-32 px-4 sm:px-6 md:px-12 border-b border-line relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-50">
          <div className="absolute -top-32 -right-24 w-[32rem] h-[32rem] rounded-full bg-brand-red/5 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-10 lg:gap-20 items-start mb-14 sm:mb-18">
            <div className="lg:sticky lg:top-28">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-[10px] tracking-[0.22em] text-brand-red uppercase">01 / PEOPLE</span>
                <span className="h-px w-12 bg-line" />
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold tracking-[-0.04em] leading-[0.98] text-white">
                {language === 'id' ? <>Orang yang membuat<br /><span className="text-brand-red">pekerjaan ini hidup.</span></> : <>The people who make<br /><span className="text-brand-red">the work feel alive.</span></>}
              </h2>
            </div>
            <div className="max-w-2xl">
              <p className="text-base sm:text-lg text-white/70 leading-relaxed font-light">
                {language === 'id'
                  ? 'Kapitech dibangun sebagai studio kecil dengan disiplin produk. Desainer, engineer, motion artist, dan strategist bekerja dekat, saling mengoreksi, dan mengubah brief menjadi sesuatu yang benar-benar siap digunakan.'
                  : 'Kapitech is built like a compact product studio. Designers, engineers, motion artists, and strategists work close together, challenge the work, and turn a brief into something genuinely ready to ship.'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px mt-8 border border-line bg-line rounded-2xl overflow-hidden">
                {[
                  ['12', language === 'id' ? 'spesialis' : 'specialists'],
                  ['05', language === 'id' ? 'disiplin' : 'disciplines'],
                  ['01', language === 'id' ? 'standar kerja' : 'craft standard'],
                  ['∞', language === 'id' ? 'ruang tumbuh' : 'room to grow']
                ].map(([value,label]) => (
                  <div key={label} className="bg-bg p-4 sm:p-5">
                    <strong className="block text-2xl sm:text-3xl font-display font-semibold text-white">{value}</strong>
                    <span className="mt-1 block text-[10px] font-mono uppercase tracking-wider text-muted">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between gap-6 mb-6">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Studio directory</span>
              <p className="mt-1 text-sm text-white/45">{language === 'id' ? 'Klik profil untuk melihat craft dan spesialisasi.' : 'Open a profile to explore each craft and specialty.'}</p>
            </div>
            <span className="hidden sm:block font-mono text-[10px] text-muted">12 / 12</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {twelveTalents.map((talent, index) => (
              <motion.div
                key={talent.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: (index % 6) * 0.04 }}
                className={(index === 0 || index === 7) ? 'lg:col-span-2' : ''}
              >
                <button
                  onClick={() => setSelectedTalent(talent)}
                  className="kapi-careers-talent-card group relative w-full overflow-hidden rounded-2xl border border-line bg-panel p-0 text-left aspect-[0.82] focus:outline-none focus:ring-2 focus:ring-brand-red/50"
                  title={`${talent.name} - ${talent.role}`}
                  aria-label={`View photo and profile of ${talent.name}`}
                >
                  <img
                    src={talent.image}
                    alt={talent.name}
                    className="w-full h-full object-cover object-top brightness-[0.72] contrast-[1.08] saturate-[0.88] group-hover:brightness-[0.94] group-hover:saturate-[1.02] group-hover:scale-105 transition-all duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent opacity-90" />
                  <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-brand-red">{talent.department}</span>
                      <span className="text-[9px] font-mono text-white/45">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <span className="block text-sm sm:text-base font-display font-semibold text-white leading-tight">{talent.name}</span>
                    <span className="block text-[10px] sm:text-[11px] text-white/55 mt-1 truncate">{talent.role}</span>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: How We Work */}
      <section className="py-20 sm:py-24 md:py-28 px-4 sm:px-6 md:px-12 border-b border-line bg-panel/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-10 lg:gap-20">
            <div>
              <span className="font-mono text-[10px] tracking-[0.22em] text-brand-red uppercase">02 / HOW WE WORK</span>
              <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-[-0.035em] leading-tight text-white">
                {language === 'id' ? 'Sedikit birokrasi. Banyak craft.' : 'Less bureaucracy. More craft.'}
              </h2>
            </div>
            <div className="border-t border-line">
              {[
                {
                  n:'01',
                  title: language === 'id' ? 'Brief yang jelas' : 'Clear briefs',
                  desc: language === 'id' ? 'Scope, target, constraint, dan output dibicarakan sejak awal. Tidak ada tebak-tebakan setelah pekerjaan berjalan.' : 'Scope, targets, constraints, and outputs are made explicit from the start. Less guessing once the work is underway.'
                },
                {
                  n:'02',
                  title: language === 'id' ? 'Kerja dekat' : 'Close collaboration',
                  desc: language === 'id' ? 'Creative, design, engineering, dan project lead duduk dalam loop yang sama, bukan bekerja sebagai silo.' : 'Creative, design, engineering, and project leads stay in the same loop instead of operating in silos.'
                },
                {
                  n:'03',
                  title: language === 'id' ? 'Review tanpa ego' : 'Low-ego reviews',
                  desc: language === 'id' ? 'Feedback diarahkan ke kualitas output. Kami mencari keputusan yang membuat produk lebih kuat, bukan mempertahankan ide pribadi.' : 'Feedback stays focused on the quality of the output. The goal is a stronger product, not defending personal ideas.'
                },
                {
                  n:'04',
                  title: language === 'id' ? 'Ship dengan standar' : 'Ship with standards',
                  desc: language === 'id' ? 'Detail visual, usability, performance, dan handoff tetap dijaga sampai pekerjaan benar-benar siap dipakai.' : 'Visual detail, usability, performance, and handoff stay accountable until the work is genuinely ready to ship.'
                }
              ].map((item) => (
                <div key={item.n} className="grid sm:grid-cols-[54px_0.55fr_1fr] gap-4 sm:gap-8 py-6 border-b border-line items-start group">
                  <span className="font-mono text-[11px] text-brand-red pt-1">{item.n}</span>
                  <h3 className="text-lg sm:text-xl font-display font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Current Opportunities */}
      <section className="py-20 sm:py-28 md:py-32 px-4 sm:px-6 md:px-12 border-b border-line" id="open-positions">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-[10px] tracking-[0.22em] text-brand-red uppercase">03 / OPEN ROLES</span>
                <span className="h-px w-12 bg-line" />
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold tracking-[-0.04em] text-white">
                {language === 'id' ? <>Mungkin kursinya<br /><span className="text-brand-red">menunggu Anda.</span></> : <>There may be a seat<br /><span className="text-brand-red">with your name on it.</span></>}
              </h2>
            </div>
            <p className="text-sm text-muted max-w-md leading-relaxed">
              {language === 'id'
                ? 'Dua peran aktif saat ini. Buka satu untuk melihat ekspektasi, tanggung jawab, dan cara melamar.'
                : 'Two active roles at the moment. Open one to see expectations, responsibilities, and the application flow.'}
            </p>
          </div>

          <div className="border-t border-line">
            {positions.map((pos, index) => (
              <motion.button
                type="button"
                key={pos.id}
                whileHover={{ x: 4 }}
                onClick={() => setSelectedPosition(pos)}
                className="w-full text-left grid lg:grid-cols-[72px_1fr_auto] gap-4 lg:gap-8 py-8 sm:py-10 border-b border-line group"
              >
                <div className="font-mono text-xs text-muted pt-1">
                  <span className="text-brand-red">{String(index + 1).padStart(2, '0')}</span>
                  <span className="mx-1.5 text-white/15">/</span>
                  <span>02</span>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-brand-red/10 border border-brand-red/25 text-brand-red text-[10px] font-mono uppercase">{pos.workplace}</span>
                    <span className="px-2.5 py-1 rounded-full bg-bg border border-line text-muted text-[10px] font-mono">{pos.department}</span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-mono">{pos.badge}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-semibold text-white group-hover:text-brand-red transition-colors leading-tight">{pos.title}</h3>
                  <p className="mt-3 max-w-3xl text-sm text-muted leading-relaxed">{pos.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-4 text-[11px] font-mono text-muted">
                    <span className="inline-flex items-center gap-1.5"><MapPin size={13} className="text-brand-red" />{pos.location}</span>
                    <span className="inline-flex items-center gap-1.5"><Clock size={13} className="text-brand-red" />{pos.type}</span>
                  </div>
                </div>
                <div className="flex items-center lg:pt-1">
                  <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white group-hover:text-brand-red transition-colors">
                    {language === 'id' ? 'Buka posisi' : 'Open role'} <ArrowUpRight size={15} />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: Freelance Vendor Network */}
      <section className="py-20 sm:py-28 md:py-32 px-4 sm:px-6 md:px-12 border-b border-line relative overflow-hidden" id="freelance-vendor">
        <div className="absolute -top-24 left-1/3 w-[28rem] h-[28rem] rounded-full bg-brand-red/5 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-[0.72fr_1.28fr] gap-10 lg:gap-20 items-start">
            <div className="lg:sticky lg:top-28">
              <span className="font-mono text-[10px] tracking-[0.22em] text-brand-red uppercase">04 / NETWORK</span>
              <h2 className="mt-4 text-3xl sm:text-5xl md:text-6xl font-display font-bold tracking-[-0.04em] leading-[0.98] text-white">
                {language === 'id' ? <>Tidak semua pekerjaan<br /><span className="text-brand-red">membutuhkan kantor.</span></> : <>Not every project<br /><span className="text-brand-red">needs an office.</span></>}
              </h2>
              <p className="mt-5 text-sm sm:text-base text-muted leading-relaxed max-w-md">
                {language === 'id'
                  ? 'Kami membangun jaringan freelancer dan independent specialists untuk proyek berbasis scope. Remote, project-based, dan tetap bekerja dengan standar Kapitech.'
                  : 'We build a network of independent specialists for scoped project work. Remote, project-based, and held to the same Kapitech standards.'}
              </p>
              <button
                onClick={() => {
                  setIsFreelanceModalOpen(true);
                  setIsVendorSubmitted(false);
                  setVendorSubmitError('');
                }}
                className="mt-7 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-brand-red hover:bg-[#FF2B38] text-white font-semibold text-xs font-mono uppercase tracking-wider transition-all shadow-lg shadow-brand-red/20"
              >
                <FolderGit2 size={16} />
                <span>{language === 'id' ? 'Masuk Vendor Network' : 'Join Vendor Network'}</span>
                <ArrowUpRight size={15} />
              </button>
            </div>

            <div>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon:<Globe size={17} />, label: language === 'id' ? '100% WFA' : '100% WFA', copy: language === 'id' ? 'Kerja dari mana saja.' : 'Work from anywhere.' },
                  { icon:<Briefcase size={17} />, label: language === 'id' ? 'Project-Based' : 'Project-Based', copy: language === 'id' ? 'Scope dan milestone jelas.' : 'Clear scope and milestones.' },
                  { icon:<Laptop size={17} />, label: language === 'id' ? 'BYOD' : 'BYOD', copy: language === 'id' ? 'Perangkat dan lisensi sendiri.' : 'Own workstation and licenses.' },
                  { icon:<ShieldCheck size={17} />, label: language === 'id' ? 'NDA & Deadline' : 'NDA & Deadlines', copy: language === 'id' ? 'Kerahasiaan dan disiplin eksekusi.' : 'Confidentiality and execution discipline.' }
                ].map((item) => (
                  <div key={item.label} className="p-5 sm:p-6 rounded-2xl border border-line bg-panel/65 hover:bg-panel transition-colors">
                    <div className="w-9 h-9 rounded-xl border border-brand-red/25 bg-brand-red/10 flex items-center justify-center text-brand-red mb-4">{item.icon}</div>
                    <h3 className="text-sm font-display font-semibold text-white">{item.label}</h3>
                    <p className="mt-1.5 text-xs text-muted leading-relaxed">{item.copy}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-line">
                {[
                  {
                    title: language === 'id' ? 'Partnership model' : 'Partnership model',
                    copy: language === 'id' ? 'Brief terstruktur, kolaborasi langsung, dan pipeline proyek yang dapat berlanjut.' : 'Structured briefs, direct collaboration, and a pipeline that can continue beyond one project.',
                    icon:<Layers size={18} />
                  },
                  {
                    title: language === 'id' ? 'Standar kerja' : 'Working standards',
                    copy: language === 'id' ? 'NDA, deadline milestone, dan standar Kapitech untuk design, code, dan komunikasi.' : 'NDAs, milestone discipline, and Kapitech standards across design, code, and communication.',
                    icon:<ShieldCheck size={18} />
                  },
                  {
                    title: language === 'id' ? 'Benefit' : 'Benefits',
                    copy: language === 'id' ? 'Fee proyek transparan, portofolio, dan fleksibilitas lokasi untuk spesialis yang cocok.' : 'Transparent project fees, portfolio opportunities, and location flexibility for the right specialists.',
                    icon:<DollarSign size={18} />
                  },
                  {
                    title: language === 'id' ? 'Skill yang dicari' : 'Skills we need',
                    copy: language === 'id' ? 'UI/UX, frontend, backend/full-stack, brand, motion, 3D, dan specialists terkait.' : 'UI/UX, frontend, backend/full-stack, brand, motion, 3D, and adjacent specialist roles.',
                    icon:<Code2 size={18} />
                  }
                ].map((item, index) => (
                  <div key={item.title} className="grid sm:grid-cols-[48px_0.55fr_1fr] gap-4 sm:gap-7 items-start py-5 border-b border-line">
                    <div className="w-10 h-10 rounded-xl border border-line bg-bg flex items-center justify-center text-brand-red">{item.icon}</div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-muted">0{index + 1}</span>
                      <h3 className="mt-1 text-base font-display font-semibold text-white">{item.title}</h3>
                    </div>
                    <p className="text-sm text-muted leading-relaxed">{item.copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Benefits & Perks */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 md:px-12 border-b border-line">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-10 lg:gap-20">
            <div>
              <span className="font-mono text-[10px] tracking-[0.22em] text-brand-red uppercase">05 / STUDIO PERKS</span>
              <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-[-0.035em] text-white">
                {language === 'id' ? 'Yang kami bawa ke meja.' : 'What we bring to the table.'}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-px border border-line bg-line rounded-2xl overflow-hidden">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="bg-panel p-6 sm:p-7 hover:bg-panel-hover transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-brand-red/10 border border-brand-red/25 flex items-center justify-center text-brand-red mb-5">
                    {benefit.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-display font-semibold text-white">{benefit.title}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Detail & Application Modal */}
      <AnimatePresence>
        {selectedPosition && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="kapi-careers-modal relative w-full max-w-4xl bg-panel border border-line rounded-3xl overflow-hidden shadow-2xl my-8 max-h-[92vh] flex flex-col"
            >
              {/* Sticky Modal Header with Role Title */}
              <div className="sticky top-0 z-20 p-5 sm:p-6 bg-panel/95 backdrop-blur-md border-b border-line space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-red/15 border border-brand-red/40 text-brand-red text-[11px] font-mono font-semibold">
                        {selectedPosition.workplace}
                      </span>
                      <span className="text-[11px] font-mono text-[#8E8E93]">
                        {selectedPosition.department}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white tracking-tight leading-tight">
                      {selectedPosition.title}
                    </h2>
                  </div>
                  
                  <button
                    onClick={() => {
                      setSelectedPosition(null);
                      setIsSubmitted(false);
                      setApplicantSubmitError('');
                    }}
                    className="kapi-modal-close w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-bg/70 hover:bg-brand-red hover:text-white border border-line hover:border-brand-red flex items-center justify-center text-muted transition-all shrink-0"
                    aria-label="Close modal"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono text-[#8E8E93]">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-brand-red shrink-0" />
                    <span>{selectedPosition.location}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} className="text-brand-red shrink-0" />
                    <span>{selectedPosition.type}</span>
                  </span>
                  {selectedPosition.compensation && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px]">
                      <Award size={13} className="shrink-0" />
                      <span><strong>{language === 'id' ? 'Kompensasi:' : 'Compensation:'}</strong> {selectedPosition.compensation}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Modal Body */}
              <div className="kapi-careers-modal-body overflow-y-auto p-5 sm:p-8 space-y-8">
                {/* Responsibilities */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-brand-red mb-3 font-semibold">
                    {language === 'id' ? 'Tanggung Jawab Utama' : 'Key Responsibilities'}
                  </h4>
                  <ul className="space-y-2.5">
                    {selectedPosition.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/80 font-light">
                        <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requirements */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-brand-red mb-3 font-semibold">
                    {language === 'id' ? 'Kualifikasi & Persyaratan' : 'Requirements & Skills'}
                  </h4>
                  <ul className="space-y-2.5">
                    {selectedPosition.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/80 font-light">
                        <CheckCircle2 size={15} className="text-brand-red shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Application Form */}
                <div className="pt-6 border-t border-[#2A2A2A]">
                  <h4 className="text-lg font-display font-bold text-white mb-2">
                    {language === 'id' ? 'Kirimkan Lamaran Anda' : 'Submit Your Application'}
                  </h4>
                  <p className="text-xs text-[#8E8E93] font-light mb-6">
                    {language === 'id'
                      ? 'Lengkapi formulir di bawah ini atau kirimkan CV & portofolio Anda langsung ke recruitment@kapitech.id'
                      : 'Fill in the form below or send your resume and portfolio directly to recruitment@kapitech.id'
                    }
                  </p>

                  {isSubmitted ? (
                    <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                      <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
                      <h5 className="text-lg font-display font-bold text-white">
                        {language === 'id' ? 'Lamaran Berhasil Dikirimkan!' : 'Application Successfully Submitted!'}
                      </h5>
                      <p className="text-xs text-white/80 max-w-md mx-auto font-light">
                        {language === 'id'
                          ? 'Terima kasih atas minat Anda bergabung di Kapitech Agency. Tim rekrutmen kami akan meninjau profil Anda dan menghubungi Anda dalam 2-3 hari kerja.'
                          : 'Thank you for your interest in joining Kapitech Agency. Our recruitment squad will review your application and reach out within 2-3 business days.'
                        }
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Anti-spam honeypot */}
                      <div className="hidden" aria-hidden="true">
                        <label htmlFor="applicant_title_hp">Do not fill</label>
                        <input 
                          type="text" 
                          id="applicant_title_hp" 
                          name="applicant_title_hp" 
                          value={honeypot} 
                          onChange={(e) => setHoneypot(e.target.value)} 
                          tabIndex={-1} 
                          autoComplete="off" 
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase">
                            {language === 'id' ? 'Nama Lengkap *' : 'Full Name *'}
                          </label>
                          <input 
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder={language === 'id' ? 'e.g. Alex Pratama' : 'e.g. Alex Morgan'}
                            className={`w-full min-h-[44px] bg-[#0B0C0E] border rounded-xl px-4 py-2.5 text-base sm:text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-brand-red font-mono ${applicantErrors.name ? 'border-brand-red' : 'border-[#262930]'}`}
                          />
                          {applicantErrors.name && (
                            <span className="text-[11px] font-mono text-brand-red mt-1 block">{applicantErrors.name}</span>
                          )}
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase">
                            {language === 'id' ? 'Alamat Email *' : 'Email Address *'}
                          </label>
                          <input 
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="alex@example.com"
                            className={`w-full min-h-[44px] bg-[#0B0C0E] border rounded-xl px-4 py-2.5 text-base sm:text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-brand-red font-mono ${applicantErrors.email ? 'border-brand-red' : 'border-[#262930]'}`}
                          />
                          {applicantErrors.email && (
                            <span className="text-[11px] font-mono text-brand-red mt-1 block">{applicantErrors.email}</span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase">
                            {language === 'id' ? 'Nomor WhatsApp / HP *' : 'Phone / WhatsApp *'}
                          </label>
                          <input 
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+62 812-3456-7890"
                            className={`w-full min-h-[44px] bg-[#0B0C0E] border rounded-xl px-4 py-2.5 text-base sm:text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-brand-red font-mono ${applicantErrors.phone ? 'border-brand-red' : 'border-[#262930]'}`}
                          />
                          {applicantErrors.phone && (
                            <span className="text-[11px] font-mono text-brand-red mt-1 block">{applicantErrors.phone}</span>
                          )}
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase">
                            {language === 'id' ? 'Tautan Portofolio / LinkedIn *' : 'Portfolio / LinkedIn URL *'}
                          </label>
                          <input 
                            type="url"
                            name="portfolio"
                            required
                            value={formData.portfolio}
                            onChange={handleInputChange}
                            placeholder="https://linkedin.com/in/... or https://behance.net/..."
                            className="w-full min-h-[44px] bg-[#0B0C0E] border border-[#262930] rounded-xl px-4 py-2.5 text-base sm:text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-brand-red font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase">
                          {language === 'id' ? 'Pesan / Pengantar Singkat' : 'Cover Note / Introduction'}
                        </label>
                        <textarea 
                          name="coverLetter"
                          rows={3}
                          value={formData.coverLetter}
                          onChange={handleInputChange}
                          placeholder={language === 'id' ? 'Ceritakan secara singkat pengalaman dan motivasi Anda...' : 'Briefly describe your relevant background and motivations...'}
                          className="w-full bg-[#0B0C0E] border border-[#262930] rounded-xl px-4 py-2.5 text-base sm:text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-brand-red font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase">
                          {language === 'id' ? 'Unggah CV / Resume (PDF maks 5MB)' : 'Upload Resume / CV (PDF max 5MB)'}
                        </label>
                        <div className="relative border border-dashed border-[#262930] rounded-xl p-4 text-center hover:border-brand-red/50 transition-colors bg-[#0B0C0E]/50">
                          <input 
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <Upload className="w-5 h-5 text-white/40 mx-auto mb-1.5" />
                          <span className="text-xs text-[#8A909D] font-mono block">
                            {formData.resume ? formData.resume.name : (language === 'id' ? 'Klik atau seret file CV Anda ke sini' : 'Click or drag your CV file here')}
                          </span>
                        </div>
                        {applicantErrors.resume && (
                          <span className="text-[11px] font-mono text-brand-red mt-1 block">{applicantErrors.resume}</span>
                        )}
                      </div>

                      {applicantSubmitError && (
                        <div className="flex items-start gap-2 rounded-xl border border-brand-red/30 bg-brand-red/10 px-4 py-3 text-xs font-mono text-brand-red" role="alert">
                          <AlertCircle size={15} className="mt-0.5 shrink-0" />
                          <span>{applicantSubmitError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isApplicantSubmitting}
                        className="w-full min-h-[44px] py-3 rounded-xl bg-brand-red hover:bg-white text-white hover:text-black font-semibold text-xs font-mono uppercase tracking-wider transition-all duration-300 shadow-lg shadow-brand-red/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <span>
                          {isApplicantSubmitting
                            ? (language === 'id' ? 'Mengunggah & Mengirim...' : 'Uploading & Submitting...')
                            : (language === 'id' ? 'Kirimkan Lamaran Sekarang' : 'Submit Application Now')}
                        </span>
                        <ArrowUpRight size={16} />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Freelance Vendor Application Modal */}
      <AnimatePresence>
        {isFreelanceModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="kapi-careers-modal relative w-full max-w-4xl bg-panel border border-brand-red/35 rounded-3xl overflow-hidden shadow-2xl my-8 max-h-[92vh] flex flex-col"
            >
              {/* Sticky Modal Header */}
              <div className="sticky top-0 z-20 p-5 sm:p-6 bg-panel/95 backdrop-blur-md border-b border-line space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-red/15 border border-brand-red/40 text-brand-red text-[11px] font-mono font-semibold">
                        100% WFA • Project-Based
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono">
                        BYOD (No Device Provided)
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white tracking-tight leading-tight">
                      {language === 'id' ? 'Formulir Pendaftaran Freelance Vendor' : 'Freelance Vendor Application Form'}
                    </h2>
                  </div>
                  
                  <button
                    onClick={() => {
                      setIsFreelanceModalOpen(false);
                      setIsVendorSubmitted(false);
                      setVendorSubmitError('');
                    }}
                    className="kapi-modal-close w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-bg/70 hover:bg-brand-red hover:text-white border border-line hover:border-brand-red flex items-center justify-center text-muted transition-all shrink-0"
                    aria-label="Close modal"
                  >
                    <X size={18} />
                  </button>
                </div>

                <p className="text-xs text-[#8E8E93] font-light">
                  {language === 'id'
                    ? 'Daftarkan profil Anda untuk bergabung dalam jaringan vendor spesialis Kapitech. Kami akan menghubungi Anda ketika terdapat proyek yang cocok dengan keahlian Anda.'
                    : 'Submit your profile to join Kapitech’s vetted vendor network. We will reach out when a project matching your expertise becomes available.'
                  }
                </p>
              </div>

              {/* Modal Body */}
              <div className="kapi-careers-modal-body overflow-y-auto p-5 sm:p-8">
                {isVendorSubmitted ? (
                  <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 my-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                      <CheckCircle2 size={36} />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
                      {language === 'id' ? 'Pendaftaran Vendor Berhasil Diterima!' : 'Vendor Application Received!'}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#8E8E93] max-w-lg mx-auto font-light leading-relaxed">
                      {language === 'id'
                        ? 'Terima kasih atas minat Anda bermitra dengan Kapitech. Tim operasional dan tech/creative lead kami akan meninjau portofolio Anda dan menghubungi Anda via WhatsApp/Email saat proyek baru dimulai.'
                        : 'Thank you for registering. Our creative and engineering leads will review your portfolio and reach out via WhatsApp/Email when matching project scopes kick off.'
                      }
                    </p>
                    <div className="pt-4">
                      <button
                        onClick={() => {
                          setIsFreelanceModalOpen(false);
                          setIsVendorSubmitted(false);
                        }}
                        className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-mono font-bold uppercase tracking-wider transition-colors"
                      >
                        {language === 'id' ? 'Tutup Formulir' : 'Close Form'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleVendorSubmit} className="space-y-5">
                    {/* Anti-spam honeypot */}
                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="vendor_hp">Do not fill</label>
                      <input 
                        type="text" 
                        id="vendor_hp" 
                        name="vendor_hp" 
                        value={vendorHoneypot} 
                        onChange={(e) => setVendorHoneypot(e.target.value)} 
                        tabIndex={-1} 
                        autoComplete="off" 
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase font-semibold">
                          {language === 'id' ? 'Nama Lengkap / Studio *' : 'Full Name / Studio Name *'}
                        </label>
                        <input 
                          type="text"
                          name="name"
                          required
                          value={vendorFormData.name}
                          onChange={handleVendorInputChange}
                          placeholder={language === 'id' ? 'e.g. Budi Santoso / Studio Koding' : 'e.g. Alex Morgan / Pixel Studio'}
                          className={`w-full min-h-[44px] bg-[#0B0C0E] border rounded-xl px-4 py-2.5 text-base sm:text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-brand-red font-mono ${vendorErrors.name ? 'border-brand-red' : 'border-[#262930]'}`}
                        />
                        {vendorErrors.name && (
                          <span className="text-[11px] font-mono text-brand-red mt-1 block">{vendorErrors.name}</span>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase font-semibold">
                          {language === 'id' ? 'Alamat Email *' : 'Email Address *'}
                        </label>
                        <input 
                          type="email"
                          name="email"
                          required
                          value={vendorFormData.email}
                          onChange={handleVendorInputChange}
                          placeholder="freelancer@example.com"
                          className={`w-full min-h-[44px] bg-[#0B0C0E] border rounded-xl px-4 py-2.5 text-base sm:text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-brand-red font-mono ${vendorErrors.email ? 'border-brand-red' : 'border-[#262930]'}`}
                        />
                        {vendorErrors.email && (
                          <span className="text-[11px] font-mono text-brand-red mt-1 block">{vendorErrors.email}</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase font-semibold">
                          {language === 'id' ? 'Nomor WhatsApp Aktif *' : 'WhatsApp Number (Active) *'}
                        </label>
                        <input 
                          type="tel"
                          name="phone"
                          required
                          value={vendorFormData.phone}
                          onChange={handleVendorInputChange}
                          placeholder="+62 812-3456-7890"
                          className={`w-full min-h-[44px] bg-[#0B0C0E] border rounded-xl px-4 py-2.5 text-base sm:text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-brand-red font-mono ${vendorErrors.phone ? 'border-brand-red' : 'border-[#262930]'}`}
                        />
                        {vendorErrors.phone && (
                          <span className="text-[11px] font-mono text-brand-red mt-1 block">{vendorErrors.phone}</span>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase font-semibold">
                          {language === 'id' ? 'Spesialisasi Utama *' : 'Primary Specialty *'}
                        </label>
                        <select
                          name="specialty"
                          required
                          value={vendorFormData.specialty}
                          onChange={handleVendorInputChange}
                          className="w-full min-h-[44px] bg-[#0B0C0E] border border-[#262930] rounded-xl px-4 py-2.5 text-base sm:text-xs text-white focus:outline-none focus:border-brand-red font-mono"
                        >
                          <option value="UI/UX & Product Design">UI/UX & Product Design (Figma, Systems, Prototyping)</option>
                          <option value="Frontend Web Development">Frontend Web Dev (React, Next.js, Tailwind, Motion)</option>
                          <option value="Backend & Full-Stack Development">Backend / Full-Stack (Node.js, PostgreSQL, Supabase)</option>
                          <option value="Brand Identity & Graphic Design">Brand Identity & Graphic Design (Illustrator, Guidelines)</option>
                          <option value="Motion & 3D WebGL Animation">Motion & 3D (After Effects, Lottie, Blender, Spline)</option>
                          <option value="Pitch Deck & Presentation Specialist">Pitch Deck & Presentation Specialist (Keynote, Pitch Decks)</option>
                          <option value="Other Specialist Role">Other Specialist Tech / Creative Role</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase font-semibold">
                          {language === 'id' ? 'Tautan Portofolio / GitHub / Dribbble *' : 'Portfolio / GitHub / Dribbble URL *'}
                        </label>
                        <input 
                          type="url"
                          name="portfolio"
                          required
                          value={vendorFormData.portfolio}
                          onChange={handleVendorInputChange}
                          placeholder="https://behance.net/... or https://github.com/..."
                          className="w-full min-h-[44px] bg-[#0B0C0E] border border-[#262930] rounded-xl px-4 py-2.5 text-base sm:text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-brand-red font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase font-semibold">
                          {language === 'id' ? 'Ekspektasi Rate Card (per Proyek / Jam)' : 'Rate Card Expectation (per Project / Hourly)'}
                        </label>
                        <input 
                          type="text"
                          name="rateCard"
                          value={vendorFormData.rateCard}
                          onChange={handleVendorInputChange}
                          placeholder={language === 'id' ? 'e.g. Rp 5.000.000 - Rp 15.000.000 / project' : 'e.g. $25 - $45 / hour or per project range'}
                          className="w-full min-h-[44px] bg-[#0B0C0E] border border-[#262930] rounded-xl px-4 py-2.5 text-base sm:text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-brand-red font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase font-semibold">
                          {language === 'id' ? 'Pengalaman Profesional' : 'Years of Experience'}
                        </label>
                        <select
                          name="experienceYears"
                          value={vendorFormData.experienceYears}
                          onChange={handleVendorInputChange}
                          className="w-full min-h-[44px] bg-[#0B0C0E] border border-[#262930] rounded-xl px-4 py-2.5 text-base sm:text-xs text-white focus:outline-none focus:border-brand-red font-mono"
                        >
                          <option value="1-2 Years">1 - 2 Years</option>
                          <option value="3-5 Years">3 - 5 Years (Mid-Level)</option>
                          <option value="5-8 Years">5 - 8 Years (Senior)</option>
                          <option value="8+ Years">8+ Years (Lead / Principal)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase font-semibold">
                          {language === 'id' ? 'Alat Kerja / Stack Utama' : 'Core Tools & Tech Stack'}
                        </label>
                        <input 
                          type="text"
                          name="tools"
                          value={vendorFormData.tools}
                          onChange={handleVendorInputChange}
                          placeholder="e.g. Figma, React, Next.js, After Effects, Blender"
                          className="w-full min-h-[44px] bg-[#0B0C0E] border border-[#262930] rounded-xl px-4 py-2.5 text-base sm:text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-brand-red font-mono"
                        />
                      </div>
                    </div>

                    {/* MANDATORY CHECKBOXES (Crucial Requirements) */}
                    <div className="p-4 rounded-xl bg-[#0B0C0E] border border-[#262930] space-y-3">
                      <span className="text-[11px] font-mono uppercase text-brand-red font-bold block mb-1">
                        {language === 'id' ? 'Konfirmasi Aturan & Ketentuan Kerja Sama *' : 'Mandatory Terms & Policy Acknowledgment *'}
                      </span>

                      <label className="flex items-start gap-3 cursor-pointer select-none text-xs text-white/80 font-light min-h-[32px]">
                        <input 
                          type="checkbox"
                          name="agreedWfa"
                          required
                          checked={vendorFormData.agreedWfa}
                          onChange={handleVendorInputChange}
                          className="mt-0.5 rounded border-[#262930] text-brand-red focus:ring-brand-red bg-[#16181D] w-4 h-4 shrink-0"
                        />
                        <span>
                          <strong>100% WFA & Project-Based:</strong> {language === 'id' 
                            ? 'Saya memahami dan setuju bahwa pekerjaan ini bersifat berbasis proyek (project-based) dan dikerjakan secara jarak jauh (Work From Anywhere).'
                            : 'I acknowledge that this engagement is strictly project-based under a 100% remote (WFA) collaboration model.'}
                        </span>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer select-none text-xs text-white/80 font-light min-h-[32px]">
                        <input 
                          type="checkbox"
                          name="agreedDevice"
                          required
                          checked={vendorFormData.agreedDevice}
                          onChange={handleVendorInputChange}
                          className="mt-0.5 rounded border-[#262930] text-brand-red focus:ring-brand-red bg-[#16181D] w-4 h-4 shrink-0"
                        />
                        <span>
                          <strong>BYOD (No Device Provided):</strong> {language === 'id'
                            ? 'Saya memahami bahwa Kapitech TIDAK menyediakan perangkat kerja/laptop, dan saya menggunakan perangkat workstation & lisensi software mandiri.'
                            : 'I acknowledge that Kapitech does NOT provide hardware/devices, and I will use my own capable workstation & software licenses.'}
                        </span>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer select-none text-xs text-white/80 font-light min-h-[32px]">
                        <input 
                          type="checkbox"
                          name="agreedNda"
                          required
                          checked={vendorFormData.agreedNda}
                          onChange={handleVendorInputChange}
                          className="mt-0.5 rounded border-[#262930] text-brand-red focus:ring-brand-red bg-[#16181D] w-4 h-4 shrink-0"
                        />
                        <span>
                          <strong>NDA & Deadline Discipline:</strong> {language === 'id'
                            ? 'Saya bersedia menandatangani NDA kerahasiaan data klien serta berkomitmen 100% pada timeline milestone dan komunikasi yang responsif.'
                            : 'I agree to execute project NDAs and maintain strict adherence to milestone deadlines and prompt communication.'}
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase font-semibold">
                        {language === 'id' ? 'Catatan Tambahan / Deskripsi Keahlian' : 'Additional Notes / Key Highlights'}
                      </label>
                      <textarea 
                        name="notes"
                        rows={2}
                        value={vendorFormData.notes}
                        onChange={handleVendorInputChange}
                        placeholder={language === 'id' ? 'Ceritakan proyek terbaik yang pernah Anda kerjakan atau keahlian spesifik Anda...' : 'Highlight your proudest past projects or unique skill sets...'}
                        className="w-full bg-[#0B0C0E] border border-[#262930] rounded-xl px-4 py-2.5 text-base sm:text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-brand-red font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase font-semibold">
                        {language === 'id' ? 'Unggah CV / Portofolio PDF (Opsional, maks 5MB)' : 'Upload CV / Portfolio PDF (Optional, max 5MB)'}
                      </label>
                      <div className="relative border border-dashed border-[#262930] rounded-xl p-4 text-center hover:border-brand-red/50 transition-colors bg-[#0B0C0E]/50">
                        <input 
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleVendorFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <Upload className="w-5 h-5 text-white/40 mx-auto mb-1.5" />
                        <span className="text-xs text-[#8A909D] font-mono block">
                          {vendorFormData.resume ? vendorFormData.resume.name : (language === 'id' ? 'Klik atau seret file dokumen Anda ke sini' : 'Click or drag your document here')}
                        </span>
                      </div>
                      {vendorErrors.resume && (
                        <span className="text-[11px] font-mono text-brand-red mt-1 block">{vendorErrors.resume}</span>
                      )}
                    </div>

                    {vendorSubmitError && (
                      <div className="flex items-start gap-2 rounded-xl border border-brand-red/30 bg-brand-red/10 px-4 py-3 text-xs font-mono text-brand-red" role="alert">
                        <AlertCircle size={15} className="mt-0.5 shrink-0" />
                        <span>{vendorSubmitError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isVendorSubmitting}
                      className="w-full min-h-[48px] py-3.5 rounded-xl bg-brand-red hover:bg-[#FF2B38] text-white font-semibold text-xs font-mono uppercase tracking-wider transition-all duration-300 shadow-xl shadow-brand-red/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <span>
                        {isVendorSubmitting
                          ? (language === 'id' ? 'Mengunggah & Mengirim...' : 'Uploading & Submitting...')
                          : (language === 'id' ? 'Kirimkan Pendaftaran Freelance Vendor' : 'Submit Vendor Application')}
                      </span>
                      <ArrowUpRight size={16} />
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
