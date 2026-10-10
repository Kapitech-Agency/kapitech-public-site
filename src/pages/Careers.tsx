import React, { useEffect, useState } from 'react';
import PublicPageHero from '../components/ui/PublicPageHero';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, 
  CheckCircle2, 
  Globe, 
  Heart, 
  Coffee, 
  Laptop, 
  Upload, 
  Phone, 
  X, 
  Briefcase, 
  MapPin, 
  Clock,
  TrendingUp,
  Award,
  ShieldCheck,
  DollarSign,
  Layers,
  Palette,
  Code2,
  Check,
  AlertCircle,
  FolderGit2,
  ChevronDown,
  LoaderCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/LanguageContext';
import { sanitizeInput, isValidEmail, isValidPhone, validateResumeFile, clampLength } from '../lib/security';
import { submitToInbox } from '../lib/submissions';
import { api, uploadPublicResume } from '../lib/apiClient';

const CareerModalPortal = ({ children }: { children: React.ReactNode }) => {
  if (typeof document === 'undefined') return null;
  return createPortal(children, document.body);
};

type CareerDropdownOption = {
  value: string;
  label: string;
};

const CareerDropdown = ({
  value,
  options,
  onChange,
  ariaLabel
}: {
  value: string;
  options: CareerDropdownOption[];
  onChange: (value: string) => void;
  ariaLabel: string;
}) => {
  const [open, setOpen] = useState(false);
  const [activeOptionIndex, setActiveOptionIndex] = useState(0);
  const optionRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
    setActiveOptionIndex(selectedIndex);
  }, [options, value]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-career-dropdown]')) setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        const lastIndex = options.length - 1;
        setActiveOptionIndex((current) => {
          const next = event.key === 'ArrowDown'
            ? Math.min(current + 1, lastIndex)
            : event.key === 'ArrowUp'
              ? Math.max(current - 1, 0)
              : event.key === 'Home'
                ? 0
                : lastIndex;
          window.requestAnimationFrame(() => optionRefs.current[next]?.focus());
          return next;
        });
      }

      if ((event.key === 'Enter' || event.key === ' ') && document.activeElement?.getAttribute('role') === 'option') {
        event.preventDefault();
        const active = options[activeOptionIndex];
        if (active) {
          onChange(active.value);
          setOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    const focusFrame = window.requestAnimationFrame(() => optionRefs.current[activeOptionIndex]?.focus());

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, activeOptionIndex, onChange, options]);

  return (
    <div className="relative" data-career-dropdown>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => {
          setOpen((currentOpen) => !currentOpen);
          setActiveOptionIndex(Math.max(0, options.findIndex((option) => option.value === value)));
        }}
        className="flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#0B0C0E]/70 px-4 py-2.5 text-left font-mono text-xs text-white transition-[background-color,border-color,box-shadow] duration-300 hover:border-white/[0.14] hover:bg-white/[0.025] focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20"
      >
        <span className="min-w-0 truncate">{selected?.label ?? value}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-[#8A909D] transition-transform duration-200 ${open ? 'rotate-180 text-white' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.985 }}
            transition={{ duration: 0.16 }}
            className="kapi-popover-surface absolute inset-x-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden p-1.5"
            role="listbox"
            aria-label={ariaLabel}
          >
            <div className="max-h-64 overflow-y-auto overscroll-contain">
              {options.map((option, index) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    ref={(element) => {
                      optionRefs.current[index] = element;
                    }}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={index === activeOptionIndex ? 0 : -1}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={`flex min-h-[42px] w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-xs transition-colors duration-200 ${
                      isSelected
                        ? 'bg-brand-red/10 text-brand-red'
                        : 'text-[#A9AFBA] hover:bg-white/[0.045] hover:text-white'
                    }`}
                  >
                    <span className="min-w-0 leading-relaxed">{option.label}</span>
                    {isSelected && <Check className="h-4 w-4 shrink-0 text-brand-red" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CareerCheckbox = ({
  id,
  name,
  checked,
  onChange,
  title,
  children
}: {
  id: string;
  name: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  children: React.ReactNode;
}) => (
  <label
    htmlFor={id}
    className="group flex min-h-[48px] cursor-pointer select-none items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.012] px-3.5 py-3 transition-[border-color,background-color] duration-200 hover:border-white/[0.12] hover:bg-white/[0.02]"
  >
    <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
      <input
        id={id}
        name={name}
        type="checkbox"
        required
        checked={checked}
        onChange={onChange}
        className="peer absolute inset-0 h-5 w-5 cursor-pointer opacity-0"
      />
      <span
        aria-hidden="true"
        className="flex h-5 w-5 items-center justify-center rounded-md border border-white/[0.14] bg-[#0B0C0E] text-transparent transition-[background-color,border-color,color,box-shadow] duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-red/30 peer-checked:border-brand-red peer-checked:bg-brand-red peer-checked:text-white"
      >
        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
      </span>
    </span>
    <span className="min-w-0 text-xs font-light leading-relaxed text-white/80">
      <strong className="font-semibold text-white">{title}</strong>{' '}{children}
    </span>
  </label>
);

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

const normalizeCmsPosition = (input: Record<string, unknown>, language: 'id' | 'en', index: number): Position => {
  const value = (englishKey: string, indonesiaKey: string) => {
    const english = input[englishKey];
    const indonesia = input[indonesiaKey];
    const chosen = language === 'id' && typeof indonesia === 'string' && indonesia.trim()
      ? indonesia
      : english;
    return typeof chosen === 'string' ? chosen.trim() : '';
  };
  const list = (englishKey: string, indonesiaKey: string): string[] => {
    const english = input[englishKey];
    const indonesia = input[indonesiaKey];
    const chosen = language === 'id' && Array.isArray(indonesia) && indonesia.length
      ? indonesia
      : english;
    return Array.isArray(chosen) ? chosen.filter((item): item is string => typeof item === 'string' && Boolean(item.trim())) : [];
  };
  return {
    id: typeof input.id === 'string' && input.id ? input.id : typeof input.slug === 'string' && input.slug ? input.slug : 'career-' + index,
    title: value('title', 'titleId'),
    department: value('department', 'departmentId'),
    location: value('location', 'locationId'),
    type: value('type', 'typeId'),
    workplace: value('workplace', 'workplaceId'),
    badge: value('badge', 'badgeId'),
    summary: value('summary', 'summaryId'),
    responsibilities: list('responsibilities', 'responsibilitiesId'),
    requirements: list('requirements', 'requirementsId'),
    compensation: value('compensation', 'compensationId') || undefined
  };
};

export const Careers = () => {
  const { language } = useLanguage();
  const [cmsPositions, setCmsPositions] = useState<Position[] | null>(null);
  const [activePractice, setActivePractice] = useState<'all' | 'Visual Experience' | 'Innovation Development'>('all');
  const [selectedDisciplineId, setSelectedDisciplineId] = useState('frontend-engineering');
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
    agreedWfa: false,
    agreedDevice: false,
    agreedNda: false,
    resume: null as File | null
  });

  useEffect(() => {
    let active = true;
    void api.cms.getCareers()
      .then((res) => {
        if (!active || !res.success || !Array.isArray(res.data?.positions)) return;
        setCmsPositions(
          res.data.positions
            .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
            .map((item, index) => normalizeCmsPosition(item, language, index)),
        );
      })
      .catch(() => {
        // Keep the existing local roles visible if the CMS endpoint is temporarily unavailable.
      });
    return () => { active = false; };
  }, [language]);

  const hasOpenCareerModal = Boolean(selectedPosition || isFreelanceModalOpen);
  const careerModalRef = React.useRef<HTMLDivElement>(null);
  const careerModalTriggerRef = React.useRef<HTMLElement | null>(null);
  const careerModalWasOpenRef = React.useRef(false);

  useEffect(() => {
    if (!hasOpenCareerModal) {
      if (careerModalWasOpenRef.current) {
        careerModalWasOpenRef.current = false;
        if (careerModalTriggerRef.current && document.contains(careerModalTriggerRef.current)) {
          careerModalTriggerRef.current.focus();
        }
        careerModalTriggerRef.current = null;
      }
      return;
    }

    if (!careerModalWasOpenRef.current) {
      careerModalWasOpenRef.current = true;
      careerModalTriggerRef.current = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    }

    const focusIntoModal = () => {
      const dialog = careerModalRef.current;
      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.getClientRects().length > 0);

      focusable[0]?.focus();
    };

    const handleTrap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const dialog = careerModalRef.current;
      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
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

    const focusFrame = window.requestAnimationFrame(focusIntoModal);
    document.addEventListener('keydown', handleTrap);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleTrap);
    };
  }, [hasOpenCareerModal]);


  useEffect(() => {
    if (!hasOpenCareerModal) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (isFreelanceModalOpen) setIsFreelanceModalOpen(false);
      else if (selectedPosition) setSelectedPosition(null);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [hasOpenCareerModal, isFreelanceModalOpen, selectedPosition]);

  const disciplines = language === 'id'
    ? [
        { id: 'frontend-engineering', title: 'Engineering Frontend', area: 'Innovation Development', focus: 'React, Next.js, arsitektur komponen, dan performa web.' },
        { id: 'product-design-systems', title: 'UI Produk & Sistem Desain', area: 'Visual Experience', focus: 'Sistem Figma, design token, dan pustaka komponen.' },
        { id: 'motion-2d', title: 'Motion Graphics & Animasi 2D', area: 'Visual Experience', focus: 'Tipografi kinetik, animasi, dan After Effects.' },
        { id: 'brand-editorial', title: 'Identitas Brand & Desain Editorial', area: 'Visual Experience', focus: 'Identitas visual, pedoman brand, dan arah kreatif.' },
        { id: '3d-webgl', title: 'Visualisasi 3D & WebGL', area: 'Visual Experience', focus: 'Blender, aset 3D, dan pengalaman web interaktif.' },
        { id: 'product-ui', title: 'Desain UI Produk', area: 'Visual Experience', focus: 'Antarmuka responsif, alur pengguna, dan prototipe.' },
        { id: 'cloud-devops', title: 'Infrastruktur Cloud & DevOps', area: 'Innovation Development', focus: 'Cloud infrastructure, otomatisasi, dan CI/CD.' },
        { id: 'illustration', title: 'Ilustrasi 2D & Character Art', area: 'Visual Experience', focus: 'Aset vektor, ilustrasi, dan visual explainer.' },
        { id: 'backend-database', title: 'Engineering Backend & Database', area: 'Innovation Development', focus: 'Node.js, PostgreSQL, API, dan pengelolaan data.' },
        { id: 'video-color', title: 'Produksi Video & Color Grading', area: 'Visual Experience', focus: 'Editing, koreksi warna, dan finishing video.' },
        { id: 'fullstack', title: 'Aplikasi Web Full-Stack', area: 'Innovation Development', focus: 'TypeScript, integrasi API, dan sistem real-time.' },
        { id: 'pitch-publication', title: 'Pitch Deck & Desain Publikasi', area: 'Visual Experience', focus: 'Presentasi investor, laporan, dan materi komunikasi.' }
      ]
    : [
        { id: 'frontend-engineering', title: 'Frontend Engineering', area: 'Innovation Development', focus: 'React, Next.js, component architecture, and web performance.' },
        { id: 'product-design-systems', title: 'Product UI & Design Systems', area: 'Visual Experience', focus: 'Figma systems, design tokens, and component libraries.' },
        { id: 'motion-2d', title: 'Motion Graphics & 2D Animation', area: 'Visual Experience', focus: 'Kinetic typography, animation, and After Effects.' },
        { id: 'brand-editorial', title: 'Brand Identity & Editorial Design', area: 'Visual Experience', focus: 'Visual identity, brand guidelines, and creative direction.' },
        { id: '3d-webgl', title: '3D Visualization & WebGL', area: 'Visual Experience', focus: 'Blender, 3D assets, and interactive web experiences.' },
        { id: 'product-ui', title: 'Product UI Design', area: 'Visual Experience', focus: 'Responsive interfaces, user flows, and prototyping.' },
        { id: 'cloud-devops', title: 'Cloud Infrastructure & DevOps', area: 'Innovation Development', focus: 'Cloud infrastructure, automation, and CI/CD.' },
        { id: 'illustration', title: '2D Illustration & Character Art', area: 'Visual Experience', focus: 'Vector assets, illustration, and explainer visuals.' },
        { id: 'backend-database', title: 'Backend & Database Engineering', area: 'Innovation Development', focus: 'Node.js, PostgreSQL, APIs, and data systems.' },
        { id: 'video-color', title: 'Video Production & Color', area: 'Visual Experience', focus: 'Editing, color grading, and video finishing.' },
        { id: 'fullstack', title: 'Full-Stack Web Applications', area: 'Innovation Development', focus: 'TypeScript, API integration, and real-time systems.' },
        { id: 'pitch-publication', title: 'Pitch Deck & Publication Design', area: 'Visual Experience', focus: 'Investor decks, executive reports, and communication assets.' }
      ];

  const visibleDisciplines = activePractice === 'all'
    ? disciplines
    : disciplines.filter((discipline) => discipline.area === activePractice);
  const selectedDiscipline = visibleDisciplines.find((discipline) => discipline.id === selectedDisciplineId)
    || visibleDisciplines[0]
    || disciplines[0];
  const selectedDisciplineIndex = disciplines.findIndex((discipline) => discipline.id === selectedDiscipline.id);
  const selectedDisciplineIsEngineering = selectedDiscipline.area === 'Innovation Development';
  const selectedDisciplineIsMotion = /motion|video|3d|illustration|animasi|publikasi/i.test(selectedDiscipline.title);
  const SelectedDisciplineIcon = selectedDisciplineIsEngineering ? Code2 : selectedDisciplineIsMotion ? Layers : Palette;
  const practiceFilters = [
    { value: 'all' as const, label: language === 'id' ? 'Semua bidang' : 'All disciplines', count: disciplines.length },
    { value: 'Visual Experience' as const, label: 'Visual Experience', count: disciplines.filter((discipline) => discipline.area === 'Visual Experience').length },
    { value: 'Innovation Development' as const, label: 'Innovation Development', count: disciplines.filter((discipline) => discipline.area === 'Innovation Development').length }
  ];

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
        'Design pixel-perfect responsive web products and SaaS interfaces across desktop, tablet, and mobile breakpoints',
        'Architect and maintain scalable design systems, design tokens, and comprehensive component libraries in Figma',
        'Conduct user journey mapping, wireframing, interactive prototyping, and usability validation sprints',
        'Collaborate side-by-side with our Executive Creative Director and frontend engineers for flawless implementation',
        'Prepare presentation decks and articulate UX/UI rationale directly during client review sessions'
      ],
      requirements: [
        '2+ years of professional experience in UI/UX design for web products or digital agencies',
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
        'Merancang antarmuka web responsif dan sistem software SaaS berpresisi tinggi di seluruh breakpoint',
        'Membangun serta memelihara sistem desain modular, token desain, dan pustaka komponen di Figma',
        'Melakukan pemetaan alur pengguna, wireframing, pembuatan prototipe interaktif, dan uji usabilitas',
        'Berkolaborasi langsung di studio bersama Executive Creative Director dan frontend engineer untuk memastikan hasil koding sesuai desain',
        'Mempersiapkan deck presentasi dan menjelaskan pertimbangan desain secara objektif dalam sesi review klien'
      ],
      requirements: [
        '2+ tahun pengalaman profesional di bidang desain UI/UX untuk produk web atau agensi digital',
        'Portofolio desain yang kuat menunjukkan penguasaan tipografi, tata letak visual modern, dan sistem UX responsif',
        'Keahlian mendalam dalam Figma, FigJam, auto-layout, varian komponen, dan prototipe interaktif',
        'Bersedia bekerja full-time on-site (WFO) di studio Tangerang Selatan dengan semangat kolaborasi tinggi',
        'Ketelitian tinggi terhadap detail visual mikro, konsistensi brand, dan kelayakan teknis implementasi kode'
      ],
      compensation: 'Gaji Pokok Kompetitif + Asuransi Kesehatan + Bonus Kinerja Proyek'
    }
  ];

  const positions = cmsPositions ?? (language === 'id' ? positionsId : positionsEn);

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
        e.currentTarget.value = '';
        setFormData(prev => ({ ...prev, resume: null }));
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
    if (!vendorFormData.agreedWfa || !vendorFormData.agreedDevice || !vendorFormData.agreedNda) {
      errors.agreements = language === 'id'
        ? 'Konfirmasi ketiga ketentuan untuk melanjutkan pendaftaran.'
        : 'Please acknowledge all three terms to continue your application.';
    }
    if (!formData.resume) errors.resume = language === 'id' ? 'Dokumen resume / CV wajib diunggah' : 'Resume / CV file is required';

    if (Object.keys(errors).length > 0) {
      setApplicantErrors(errors);
      return;
    }

    setApplicantErrors({});
    setApplicantSubmitError('');
    setIsApplicantSubmitting(true);
    try {
      const resumeUpload = await uploadPublicResume(formData.resume!);
      if (!resumeUpload.success || !resumeUpload.data?.resumeUrl) {
        throw new Error(resumeUpload.error || 'Resume upload failed.');
      }

      await submitToInbox({
        fullName: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        positionTitle: selectedPosition ? selectedPosition.title : 'General Studio Application',
        portfolioUrl: sanitizedPortfolio,
        resumeUrl: resumeUpload.data.resumeUrl,
        message: `[Studio Role Application: ${selectedPosition?.title || 'Open Role'}]\nResume File: ${formData.resume?.name || 'Uploaded'}\nResume URL: ${resumeUpload.data.resumeUrl}\nPortfolio: ${sanitizedPortfolio || '-'}\n\nCover Letter:\n${sanitizedCoverLetter || 'No cover letter provided.'}`,
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
      setIsApplicantSubmitting(false);
      return;
    }
    setIsSubmitted(true);
    setIsApplicantSubmitting(false);
  };

  const handleVendorInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setVendorFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setVendorFormData(prev => ({ ...prev, [name]: value }));
    }
    if (vendorErrors[name] || (name.startsWith('agreed') && vendorErrors.agreements)) {
      setVendorErrors(prev => {
        const next = { ...prev };
        delete next[name];
        if (name.startsWith('agreed')) delete next.agreements;
        return next;
      });
    }
  };

  const handleVendorFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateResumeFile(file);
      if (!validation.isValid) {
        e.currentTarget.value = '';
        setVendorFormData(prev => ({ ...prev, resume: null }));
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
      let resumeUrl = '';
      if (vendorFormData.resume) {
        const resumeUpload = await uploadPublicResume(vendorFormData.resume);
        if (!resumeUpload.success || !resumeUpload.data?.resumeUrl) {
          throw new Error(resumeUpload.error || 'Resume upload failed.');
        }
        resumeUrl = resumeUpload.data.resumeUrl;
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
        resumeUrl: resumeUrl || undefined,
        ndaRequested: vendorFormData.agreedNda,
        message: `[Freelance Vendor Application]\nSpecialty: ${vendorFormData.specialty}\nExperience: ${vendorFormData.experienceYears}\nRate / Project Cost: ${sanitizedRateCard || 'Standard rate'}\nTools & Stack: ${sanitizedTools || '-'}\nPortfolio / CV Link: ${sanitizedPortfolio || '-'}\nResume File: ${vendorFormData.resume?.name || 'Not attached'}${resumeUrl ? `\nResume URL: ${resumeUrl}` : ''}\n\nAgreements accepted:\n- 100% remote & project-based: ${vendorFormData.agreedWfa ? 'Yes' : 'No'}\n- Bring your own device and licenses: ${vendorFormData.agreedDevice ? 'Yes' : 'No'}\n- NDA and milestone commitments: ${vendorFormData.agreedNda ? 'Yes' : 'No'}\n\nAdditional Notes:\n${sanitizedNotes || '-'}`,
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
      setIsVendorSubmitting(false);
      return;
    }
    setIsVendorSubmitted(true);
    setIsVendorSubmitting(false);
  };

  return (
    <div className="bg-[#0B0C0E] text-white min-h-screen selection:bg-brand-red selection:text-white relative">
      {/* Hero Section */}
      <PublicPageHero
        eyebrow={language === 'id' ? 'Karier & Peluang Kemitraan' : 'Careers & Opportunities'}
        title={language === 'id' ? 'Berkarya Bersama Kapitech.' : 'Build the Future With Us.'}
        description={
          language === 'id'
            ? 'Kami membuka kesempatan bagi talenta on-site studio di Tangerang Selatan serta jaringan Freelance Vendor berbasis proyek (100% WFA) untuk berkolaborasi menggarap produk digital kelas dunia.'
            : 'We offer on-site studio roles in South Tangerang as well as a global Freelance Vendor network (100% WFA, Project-Based) to build exceptional digital products together.'
        }
      >
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-mono text-[#8A909D]">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
            <span>2 {language === 'id' ? 'Posisi Studio Terbuka' : 'Studio Roles Hiring'}</span>
          </span>
          <span className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5">
            <span>{language === 'id' ? 'Freelance Vendor Network (WFA Terbuka)' : 'Freelance Vendor Network (WFA Open)'}</span>
          </span>
          <span className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5">
            {language === 'id' ? 'Studio di Tangerang Selatan' : 'Studio in South Tangerang'}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <a
            href="#open-positions"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.035] px-5 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider text-white transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
          >
            <span>{language === 'id' ? 'Posisi Studio On-site' : 'Studio Open Roles'}</span>
            <ArrowUpRight size={14} />
          </a>
          <button
            type="button"
            onClick={() => {
              setIsFreelanceModalOpen(true);
              setIsVendorSubmitted(false);
              setVendorSubmitError('');
            }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-brand-red/35 bg-brand-red/80 px-5 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider text-white transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-brand-red/60 hover:bg-brand-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
          >
            <FolderGit2 size={14} />
            <span>{language === 'id' ? 'Ajukan sebagai mitra freelance' : 'Apply to the partner network'}</span>
          </button>
          <Link
            to="/about"
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 py-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#A7ACB5] transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
          >
            <span>{language === 'id' ? 'Tentang Kapitech' : 'About Kapitech'}</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </PublicPageHero>

      {/* SECTION: Specialist Disciplines */}
      <section
        id="disciplines"
        className="relative isolate overflow-hidden border-b border-white/[0.08] bg-[#0B0C0E] px-4 py-16 sm:px-6 sm:py-24 md:px-12"
      >
        <div className="relative mx-auto w-full max-w-7xl">
          <div className="mb-10 grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.62fr)] lg:items-end lg:gap-12">
            <div>
              <span className="kapi-section-label mb-5">
                {language === 'id' ? 'Area Keahlian' : 'Areas of Practice'}
              </span>
              <h2 className="max-w-4xl text-4xl font-display font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-5xl md:text-[4rem]">
                {language === 'id'
                  ? <>Kreativitas bertemu <span className="text-brand-red">ketelitian teknologi.</span></>
                  : <>Creative craft meets <span className="text-brand-red">technical depth.</span></>}
              </h2>
            </div>
            <div className="lg:pb-1">
              <p className="max-w-xl text-sm font-light leading-7 text-[#949BA7] sm:text-base">
                {language === 'id'
                  ? 'Jelajahi spesialisasi yang menyatukan strategi visual, pengalaman produk, dan engineering dalam satu proses kerja.'
                  : 'Explore the specialist disciplines that bring visual thinking, product experience, and engineering into one connected practice.'}
              </p>
              <div className="mt-5 flex items-center gap-3 text-[9px] font-mono uppercase tracking-[0.15em] text-[#747C89]">
                <span>{language === 'id' ? 'Dua praktik utama' : 'Two core practices'}</span>
                <span className="h-px w-8 bg-brand-red/70" aria-hidden="true" />
                <span>12 {language === 'id' ? 'disiplin' : 'disciplines'}</span>
              </div>
            </div>
          </div>

          <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(21rem,0.92fr)] lg:gap-5">
            <div className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101217] p-4 sm:p-5 lg:p-6">
              <div className="flex flex-col gap-4 border-b border-white/[0.075] pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[9px] font-mono uppercase tracking-[0.16em] text-[#747C89]">
                    {language === 'id' ? 'Peta kapabilitas' : 'Capability index'}
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-white">
                    {language === 'id' ? 'Pilih bidang untuk melihat fokusnya' : 'Select a discipline to explore its focus'}
                  </p>
                </div>
                <span className="w-fit rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.12em] text-[#8D95A2]">
                  {String(visibleDisciplines.length).padStart(2, '0')} {language === 'id' ? 'bidang' : 'fields'}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={language === 'id' ? 'Filter bidang keahlian' : 'Filter practice areas'}>
                {practiceFilters.map((filter) => {
                  const active = activePractice === filter.value;
                  return (
                    <button
                      key={filter.value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setActivePractice(filter.value);
                        const firstMatch = filter.value === 'all'
                          ? disciplines[0]
                          : disciplines.find((discipline) => discipline.area === filter.value);
                        if (firstMatch) setSelectedDisciplineId(firstMatch.id);
                      }}
                      className={[
                        'inline-flex min-h-9 items-center gap-2 rounded-full border px-3 py-2 text-[9px] font-mono uppercase tracking-[0.09em] transition-[background-color,border-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60',
                        active
                          ? 'border-brand-red/40 bg-brand-red/10 text-white'
                          : 'border-white/[0.075] bg-white/[0.015] text-[#858D99] hover:border-white/[0.16] hover:text-white'
                      ].join(' ')}
                    >
                      <span>{filter.label}</span>
                      <span className={active ? 'text-brand-red' : 'text-[#59616D]'}>{String(filter.count).padStart(2, '0')}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2" aria-live="polite">
                {visibleDisciplines.map((discipline) => {
                  const active = discipline.id === selectedDiscipline.id;
                  return (
                    <button
                      key={discipline.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelectedDisciplineId(discipline.id)}
                      className={[
                        'group/item relative flex min-h-[68px] min-w-0 items-center gap-3 overflow-hidden rounded-xl border px-3.5 py-3 text-left transition-[background-color,border-color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60',
                        active
                          ? 'border-brand-red/40 bg-white/[0.035]'
                          : 'border-white/[0.07] bg-transparent hover:border-white/[0.14] hover:bg-white/[0.02]'
                      ].join(' ')}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-[9px] font-mono tracking-[0.12em] text-[#69717D]">
                          {String(disciplines.findIndex((item) => item.id === discipline.id) + 1).padStart(2, '0')}
                        </span>
                        <span className={['mt-1 block text-xs font-medium leading-5', active ? 'text-white' : 'text-[#A5ABB6] group-hover/item:text-white'].join(' ')}>
                          {discipline.title}
                        </span>
                      </span>
                      <ArrowUpRight size={13} className={['shrink-0 transition-[color,transform] duration-200', active ? 'translate-x-0.5 -translate-y-0.5 text-brand-red' : 'text-[#626A76] group-hover/item:text-white'].join(' ')} aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
              <p className="mt-5 text-[10px] leading-5 text-[#737B87]">
                {language === 'id'
                  ? 'Bidang keahlian tidak berarti semua posisi sedang dibuka. Lihat lowongan aktif di bawah.'
                  : 'Practice areas do not mean every discipline is hiring. See current openings below.'}
              </p>
            </div>

            <aside
              className="flex min-h-[390px] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101217] p-6 sm:p-8 lg:min-h-full lg:p-9"
              aria-live="polite"
              aria-label={language === 'id' ? 'Detail bidang terpilih' : 'Selected discipline details'}
            >

              <div className="relative flex items-start justify-between gap-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-red/25 bg-brand-red/[0.07] px-3 py-2 text-[9px] font-mono uppercase tracking-[0.14em] text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-red" aria-hidden="true" />
                  {language === 'id'
                    ? (selectedDisciplineIsEngineering ? 'Pengembangan Teknologi' : 'Visual Experience')
                    : selectedDiscipline.area}
                </span>
                <span className="text-[10px] font-mono tracking-[0.12em] text-[#666E7A]">
                  {String(selectedDisciplineIndex + 1).padStart(2, '0')} / 12
                </span>
              </div>

              <div className="relative mt-12 sm:mt-16">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-brand-red">
                  <SelectedDisciplineIcon size={25} strokeWidth={1.5} aria-hidden="true" />
                </div>
                <p className="mt-6 text-[9px] font-mono uppercase tracking-[0.16em] text-[#858D99]">
                  {language === 'id' ? 'Fokus kapabilitas' : 'Capability focus'}
                </p>
                <h3 className="mt-3 max-w-lg text-3xl font-display font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-4xl">
                  {selectedDiscipline.title}
                </h3>
                <p className="mt-4 max-w-lg text-sm font-light leading-7 text-[#949BA7]">
                  {selectedDiscipline.focus}
                </p>
              </div>

              <div className="relative mt-auto pt-10">
                <div className="mb-5 h-px w-full bg-white/[0.08]" />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#747C89]">
                    {language === 'id' ? 'Ingin berkontribusi?' : 'Interested in contributing?'}
                  </span>
                  <a
                    href="#open-positions"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-brand-red px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.11em] text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-brand-red-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
                  >
                    {language === 'id' ? 'Lihat lowongan' : 'View open roles'}
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* SECTION: Current Opportunities */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 border-b border-white/[0.08]" id="open-positions">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="kapi-section-label mb-5">
                {language === 'id' ? 'Peluang Terbuka' : 'Current Opportunities'}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
                {language === 'id' ? 'Posisi yang Sedang Dibuka' : 'Available Roles'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#8A909D] font-light max-w-md">
              {language === 'id'
                ? 'Klik salah satu posisi di bawah ini untuk melihat detail kualifikasi, tanggung jawab, dan mengirimkan lamaran langsung.'
                : 'Click any role below to review full responsibilities, qualification benchmarks, and submit your application.'
              }
            </p>
          </div>

          <div className="space-y-4 sm:space-y-5">
            {positions.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.015] px-6 py-12 text-center">
                <Briefcase className="mx-auto h-7 w-7 text-white/35" />
                <h3 className="mt-4 text-lg font-display font-semibold tracking-tight text-white">
                  {language === 'id' ? 'Belum ada lowongan aktif' : 'No open positions right now'}
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8A909D]">
                  {language === 'id' ? 'Silakan kunjungi kembali halaman ini untuk melihat peluang karier terbaru.' : 'Please check back later for new career opportunities.'}
                </p>
              </div>
            ) : positions.map((pos) => (
              <motion.div
                key={pos.id}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                aria-label={`${language === 'id' ? 'Lihat detail dan lamar' : 'View role details and apply'}: ${pos.title}`}
                onClick={() => setSelectedPosition(pos)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedPosition(pos);
                  }
                }}
                className="cursor-pointer group min-w-0 p-6 sm:p-8 lg:p-9 rounded-2xl border border-white/[0.08] bg-white/[0.015] hover:border-white/[0.16] hover:bg-white/[0.025] transition-[background-color,border-color] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55"
              >
                <div className="flex min-w-0 flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="space-y-3 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-3 py-1 rounded-full bg-brand-red/10 border border-brand-red/30 text-brand-red text-xs font-mono font-medium">
                        {pos.workplace}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/[0.02] border border-white/[0.08] text-[#8A909D] text-xs font-mono">
                        {pos.department}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/[0.025] border border-white/[0.08] text-emerald-400 text-xs font-mono">
                        {pos.badge}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl lg:text-[1.75rem] font-display font-semibold tracking-[-0.04em] text-white group-hover:text-brand-red transition-colors duration-300">
                      {pos.title}
                    </h3>

                    <p className="text-sm text-[#8A909D] font-light leading-relaxed">
                      {pos.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#8A909D] pt-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-brand-red" />
                        <span>{pos.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-brand-red" />
                        <span>{pos.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 pt-2 lg:pt-0">
                    <span className="px-5 py-2.5 rounded-full bg-white/[0.02] group-hover:bg-brand-red/[0.08] text-white text-xs font-mono font-semibold uppercase tracking-wider transition-[background-color,border-color,box-shadow] duration-300 flex items-center gap-2 border border-white/[0.09] group-hover:border-brand-red/45">
                      <span>{language === 'id' ? 'Lihat Detail & Lamar' : 'View Role & Apply'}</span>
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: Freelance Partner Network */}
      <section
        className="relative isolate overflow-hidden border-b border-white/[0.08] bg-[#0B0C0E] px-4 py-16 sm:px-6 sm:py-20 md:px-12 lg:py-24"
        id="freelance-vendor"
      >
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
            <div className="flex min-h-[430px] flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101217] p-6 sm:p-9 lg:p-11">
              <div>
                <div className="mb-7 inline-flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.17em] text-white/75">
                    Freelance Partner Network
                  </span>
                </div>

                <h2 className="max-w-3xl font-display text-4xl font-bold leading-[0.94] tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
                  {language === 'id' ? 'Keahlian Anda. Proyek yang tepat.' : 'Your expertise. The right project.'}
                </h2>
                <p className="mt-6 max-w-2xl text-sm font-light leading-7 text-[#A0A5B0] sm:text-base sm:leading-8">
                  {language === 'id'
                    ? 'Kami membentuk tim berdasarkan kebutuhan proyek klien dan melibatkan spesialis independen saat keahliannya sesuai. Daftarkan profil Anda untuk dipertimbangkan pada proyek yang relevan. Ini adalah jaringan kolaborasi berbasis proyek, bukan lowongan karyawan penuh waktu.'
                    : 'We build teams around each client brief and bring in independent specialists when their expertise fits. Share your profile to be considered for relevant projects. This is a project-based collaboration network, not a full-time employment role.'}
                </p>
              </div>

              <div className="mt-10 flex flex-col items-start gap-4 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">
                    {language === 'id' ? 'Punya keahlian yang ingin dibagikan?' : 'Have a craft worth bringing to the table?'}
                  </p>
                  <p className="mt-1.5 text-xs font-light leading-5 text-[#8A909D]">
                    {language === 'id' ? 'Mulai dengan profil dan portofolio Anda.' : 'Start with your profile and portfolio.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsFreelanceModalOpen(true);
                    setIsVendorSubmitted(false);
                    setVendorSubmitError('');
                    setVendorErrors({});
                    setVendorHoneypot('');
                  }}
                  className="group inline-flex min-h-[48px] w-full shrink-0 items-center justify-between gap-5 rounded-full border border-brand-red bg-brand-red px-5 py-3.5 text-left text-xs font-mono font-semibold uppercase tracking-[0.1em] text-white transition-colors duration-200 hover:bg-brand-red/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 sm:w-auto"
                >
                  <span>{language === 'id' ? 'Daftar sebagai mitra' : 'Join the network'}</span>
                  <ArrowUpRight size={16} className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="flex min-h-[230px] flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#101217] p-6 sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.17em] text-white/45">
                    {language === 'id' ? 'Model kolaborasi' : 'The collaboration model'}
                  </span>
                  <Layers size={17} className="text-brand-red" />
                </div>
                <div className="py-7">
                  <p className="font-display text-3xl font-semibold leading-[1.03] tracking-[-0.045em] text-white sm:text-4xl">
                    {language === 'id' ? <>Mandiri dalam bekerja.<br />Selaras dalam berkarya.</> : <>Independent by nature.<br />Aligned by craft.</>}
                  </p>
                  <p className="mt-4 max-w-sm text-xs font-light leading-6 text-[#8A909D]">
                    {language === 'id'
                      ? 'Anda membawa keahlian dan cara kerja profesional. Kami menyepakati ruang lingkup, deliverable, dan timeline bersama sebelum proyek dimulai.'
                      : 'You bring your expertise and professional practice. Scope, deliverables, and timelines are agreed together before a project begins.'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Remote', 'Project-based', 'BYOD', 'NDA'].map((item) => (
                    <span key={item} className="rounded-full border border-white/[0.09] bg-white/[0.025] px-3 py-1.5 text-[10px] font-mono text-white/65">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-[#101217] p-6 sm:p-7">
                <div className="mb-5 flex items-center gap-3">
                  <ShieldCheck size={17} className="text-brand-red" />
                  <div>
                    <p className="text-xs font-semibold text-white">
                      {language === 'id' ? 'Sejak awal harus jelas' : 'Clear from day one'}
                    </p>
                    <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.13em] text-white/35">
                      {language === 'id' ? 'Standar kerja sama' : 'Working standards'}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      title: language === 'id' ? 'Ruang lingkup' : 'Defined scope',
                      text: language === 'id' ? 'Target, tanggung jawab, dan hasil kerja disepakati.' : 'Goals, responsibilities, and deliverables are agreed.'
                    },
                    {
                      title: language === 'id' ? 'Biaya transparan' : 'Transparent fees',
                      text: language === 'id' ? 'Rate dan ketentuan pembayaran dibahas sebelum mulai.' : 'Rates and payment terms are discussed before work starts.'
                    },
                    {
                      title: language === 'id' ? 'Komunikasi profesional' : 'Professional communication',
                      text: language === 'id' ? 'Pembaruan progres, feedback, dan milestone dijaga bersama.' : 'Progress updates, feedback, and milestones are handled clearly.'
                    }
                  ].map((item) => (
                    <div key={item.title} className="grid grid-cols-[10px_minmax(0,1fr)] gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-red" />
                      <div>
                        <p className="text-xs font-medium text-white/90">{item.title}</p>
                        <p className="mt-1 text-xs font-light leading-5 text-[#8A909D]">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="rounded-2xl border border-white/[0.08] bg-[#101217] p-6 sm:p-8">
              <span className="kapi-section-label">
                {language === 'id' ? 'Bidang kolaborasi' : 'Areas of collaboration'}
              </span>
              <h3 className="mt-4 max-w-md font-display text-2xl font-semibold leading-tight tracking-[-0.035em] text-white sm:text-3xl">
                {language === 'id' ? 'Spesialis berbeda. Satu tim saat dibutuhkan.' : 'Different specialists. One team when it matters.'}
              </h3>
              <p className="mt-3 max-w-md text-xs font-light leading-6 text-[#8A909D]">
                {language === 'id'
                  ? 'Kami terbuka pada spesialisasi kreatif maupun teknis yang mendukung produk digital dari konsep hingga peluncuran.'
                  : 'We welcome creative and technical specialists who can support digital products from concept through delivery.'}
              </p>

              <div className="mt-7 divide-y divide-white/[0.08]">
                {[
                  {
                    number: '01',
                    title: language === 'id' ? 'Product & Experience' : 'Product & Experience',
                    detail: language === 'id' ? 'UI/UX, desain produk, design system, dan prototyping' : 'UI/UX, product design, design systems, and prototyping',
                    icon: Palette
                  },
                  {
                    number: '02',
                    title: language === 'id' ? 'Engineering & Delivery' : 'Engineering & Delivery',
                    detail: language === 'id' ? 'Frontend, backend, full-stack, API, cloud, dan DevOps' : 'Frontend, backend, full-stack, APIs, cloud, and DevOps',
                    icon: Code2
                  },
                  {
                    number: '03',
                    title: language === 'id' ? 'Brand & Visual Systems' : 'Brand & Visual Systems',
                    detail: language === 'id' ? 'Identitas brand, desain grafis, editorial, dan presentasi' : 'Brand identity, graphic design, editorial, and presentations',
                    icon: Briefcase
                  },
                  {
                    number: '04',
                    title: language === 'id' ? 'Motion, 3D & Media' : 'Motion, 3D & Media',
                    detail: language === 'id' ? 'Motion graphics, video, aset 3D, dan visual interaktif' : 'Motion graphics, video, 3D assets, and interactive visuals',
                    icon: Layers
                  }
                ].map(({ number, title, detail, icon: Icon }) => (
                  <div key={number} className="flex items-start gap-3.5 py-4 first:pt-0 last:pb-0">
                    <Icon size={16} className="mt-1 shrink-0 text-brand-red" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-[9px] font-mono tracking-[0.12em] text-white/30">{number}</span>
                        <h4 className="text-xs font-semibold text-white">{title}</h4>
                      </div>
                      <p className="mt-1.5 text-xs font-light leading-5 text-[#8A909D]">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#101217] p-6 sm:p-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <span className="kapi-section-label">
                    {language === 'id' ? 'Cara kerja jaringan' : 'How the network works'}
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-semibold leading-tight tracking-[-0.035em] text-white sm:text-3xl">
                    {language === 'id' ? 'Proses jelas, sejak langkah pertama.' : 'A clear process, from the first step.'}
                  </h3>
                </div>
                <span className="hidden rounded-full border border-white/[0.09] px-3 py-1.5 text-[10px] font-mono text-white/40 sm:inline-flex">
                  01 — 03
                </span>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {[
                  {
                    number: '01',
                    title: language === 'id' ? 'Kirim profil' : 'Share your profile',
                    text: language === 'id' ? 'Ceritakan spesialisasi, pengalaman, portofolio, dan kisaran rate Anda.' : 'Share your specialty, experience, portfolio, and expected rate.'
                  },
                  {
                    number: '02',
                    title: language === 'id' ? 'Tinjau kecocokan' : 'Review the fit',
                    text: language === 'id' ? 'Profil ditinjau berdasarkan kebutuhan dan konteks proyek yang tersedia.' : 'Profiles are reviewed against the needs and context of available projects.'
                  },
                  {
                    number: '03',
                    title: language === 'id' ? 'Sepakati scope' : 'Agree on the scope',
                    text: language === 'id' ? 'Jika sesuai, ruang lingkup, biaya, timeline, dan ekspektasi dibahas sebelum mulai.' : 'When there is a fit, scope, fees, timeline, and expectations are discussed before work starts.'
                  }
                ].map((step) => (
                  <div key={step.number} className="rounded-xl border border-white/[0.07] p-4 sm:p-5">
                    <p className="mb-5 font-mono text-xs tabular-nums tracking-[0.15em] text-brand-red">{step.number}</p>
                    <h4 className="text-sm font-semibold tracking-[-0.02em] text-white">{step.title}</h4>
                    <p className="mt-2.5 text-xs font-light leading-6 text-[#8A909D]">{step.text}</p>
                  </div>
                ))}
              </div>

              <p className="mt-5 flex items-start gap-2.5 border-t border-white/[0.08] pt-4 text-[11px] font-light leading-5 text-white/55">
                <ShieldCheck size={14} className="mt-0.5 shrink-0 text-brand-red" />
                <span>
                  {language === 'id'
                    ? 'Pendaftaran tidak menjamin penugasan proyek. Kami menghubungi mitra ketika kebutuhan, keahlian, dan ketersediaan sesuai.'
                    : 'Joining the network does not guarantee a project assignment. We reach out when project needs, expertise, and availability align.'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Benefits & Perks */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 border-b border-white/[0.08] bg-[#0B0C0E]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <span className="kapi-section-label mb-5">
              {language === 'id' ? 'Nilai & Keuntungan Studio' : 'Studio Culture & Core Values'}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
              {language === 'id' ? 'Lingkungan Kerja Berorientasi Prestasi' : 'Craft, Autonomy, and Real Growth'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="p-6 sm:p-8 rounded-2xl border border-white/[0.08] bg-white/[0.015] hover:border-white/[0.15] hover:bg-white/[0.025] transition-[background-color,border-color] duration-200 flex flex-col justify-between"
              >
                <div className="w-10 h-10 flex items-center justify-start text-brand-red mb-5">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8A909D] font-light leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detail & Application Modal */}
      <CareerModalPortal>
<AnimatePresence>
        {selectedPosition && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto kapi-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="career-position-title"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedPosition(null);
                setIsSubmitted(false);
                setApplicantSubmitError('');
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              ref={careerModalRef}
              className="career-modal-shell kapi-modal-surface relative flex w-full max-w-4xl min-h-0 max-h-[calc(100dvh-1rem)] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0F1116]/94 shadow-[0_24px_70px_-35px_rgba(0,0,0,0.9)] backdrop-blur-2xl my-2 sm:my-6 sm:max-h-[92vh]"
            >
              {/* Sticky Modal Header with Role Title */}
              <div className="sticky top-0 z-20 px-5 sm:px-7 pt-5 sm:pt-6 pb-5 sm:pb-6 bg-[#0F1116]/96 backdrop-blur-2xl border-b border-white/[0.08] space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-red/[0.055] border border-brand-red/28 text-brand-red text-[10px] font-mono font-semibold">
                        {selectedPosition.workplace}
                      </span>
                      <span className="text-[11px] font-mono text-[#8A909D]">
                        {selectedPosition.department}
                      </span>
                    </div>
                    <h2 id="career-position-title" className="text-xl sm:text-2xl md:text-3xl font-display font-semibold text-white tracking-[-0.045em] leading-[1.05]">
                      {selectedPosition.title}
                    </h2>
                  </div>
                  
                  <button
                    onClick={() => {
                      setSelectedPosition(null);
                      setIsSubmitted(false);
                      setApplicantSubmitError('');
                    }}
                    className="kapi-modal-close shrink-0"
                    aria-label="Close modal"
                    data-cursor-label="Close"
                    autoFocus
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-[10px] sm:text-xs font-mono text-[#8A909D]">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-brand-red shrink-0" />
                    <span>{selectedPosition.location}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} className="text-brand-red shrink-0" />
                    <span>{selectedPosition.type}</span>
                  </span>
                  {selectedPosition.compensation && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.025] border border-white/[0.08] text-[#A9AFBA] text-[10px]">
                      <Award size={13} className="shrink-0" />
                      <span><strong>{language === 'id' ? 'Kompensasi:' : 'Compensation:'}</strong> {selectedPosition.compensation}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Modal Body */}
              <div className="career-modal-scroll min-h-0 flex-1 overflow-y-auto px-5 py-6 space-y-8 overscroll-contain sm:px-7 sm:py-7 sm:space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 career-detail-grid">
                  {/* Responsibilities */}
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-brand-red mb-3 font-semibold">
                      {language === 'id' ? 'Tanggung Jawab Utama' : 'Key Responsibilities'}
                    </h4>
                    <ul className="space-y-2.5">
                      {selectedPosition.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/80 font-light">
                          <CheckCircle2 size={15} className="text-brand-red shrink-0 mt-0.5" />
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
                </div>

                {/* Application Form */}
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.018] p-5 sm:p-6">
                  <h4 className="text-lg font-display font-bold text-white mb-2">
                    {language === 'id' ? 'Kirimkan Lamaran Anda' : 'Submit Your Application'}
                  </h4>
                  <p className="text-xs text-[#8A909D] font-light mb-6">
                    {language === 'id'
                      ? 'Lengkapi formulir di bawah ini atau kirimkan CV & portofolio Anda langsung ke recruitment@kapitech.id'
                      : 'Fill in the form below or send your resume and portfolio directly to recruitment@kapitech.id'
                    }
                  </p>

                  {isSubmitted ? (
                    <div className="p-6 rounded-xl bg-white/[0.025] border border-white/[0.08] text-center space-y-3">
                      <CheckCircle2 size={36} className="text-brand-red mx-auto" />
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
                          <label htmlFor="career-name" className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase">
                            {language === 'id' ? 'Nama Lengkap *' : 'Full Name *'}
                          </label>
                          <input 
                            type="text"
                            id="career-name"
                            name="name"
                            required
                            aria-invalid={Boolean(applicantErrors.name)}
                            aria-describedby={applicantErrors.name ? 'career-name-error' : undefined}
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder={language === 'id' ? 'e.g. Alex Pratama' : 'e.g. Alex Morgan'}
                            className={`w-full min-h-[44px] bg-white/[0.015] border border-white/[0.09] rounded-xl px-4 py-2.5 text-base sm:text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 font-mono transition-[border-color,box-shadow,background-color] duration-300 ${applicantErrors.name ? 'border-brand-red' : 'border-white/[0.09]'}`}
                          />
                          {applicantErrors.name && (
                            <span id="career-name-error" className="text-[11px] font-mono text-brand-red mt-1 block" role="alert">{applicantErrors.name}</span>
                          )}
                        </div>

                        <div>
                          <label htmlFor="career-email" className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase">
                            {language === 'id' ? 'Alamat Email *' : 'Email Address *'}
                          </label>
                          <input 
                            type="email"
                            id="career-email"
                            name="email"
                            required
                            aria-invalid={Boolean(applicantErrors.email)}
                            aria-describedby={applicantErrors.email ? 'career-email-error' : undefined}
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="alex@example.com"
                            className={`w-full min-h-[44px] bg-white/[0.015] border border-white/[0.09] rounded-xl px-4 py-2.5 text-base sm:text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 font-mono transition-[border-color,box-shadow,background-color] duration-300 ${applicantErrors.email ? 'border-brand-red' : 'border-white/[0.09]'}`}
                          />
                          {applicantErrors.email && (
                            <span id="career-email-error" className="text-[11px] font-mono text-brand-red mt-1 block" role="alert">{applicantErrors.email}</span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="career-phone" className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase">
                            {language === 'id' ? 'Nomor WhatsApp / HP *' : 'Phone / WhatsApp *'}
                          </label>
                          <input 
                            type="tel"
                            id="career-phone"
                            name="phone"
                            required
                            aria-invalid={Boolean(applicantErrors.phone)}
                            aria-describedby={applicantErrors.phone ? 'career-phone-error' : undefined}
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+62 812-3456-7890"
                            className={`w-full min-h-[44px] bg-white/[0.015] border border-white/[0.09] rounded-xl px-4 py-2.5 text-base sm:text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 font-mono transition-[border-color,box-shadow,background-color] duration-300 ${applicantErrors.phone ? 'border-brand-red' : 'border-white/[0.09]'}`}
                          />
                          {applicantErrors.phone && (
                            <span id="career-phone-error" className="text-[11px] font-mono text-brand-red mt-1 block" role="alert">{applicantErrors.phone}</span>
                          )}
                        </div>

                        <div>
                          <label htmlFor="career-portfolio" className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase">
                            {language === 'id' ? 'Tautan Portofolio / LinkedIn *' : 'Portfolio / LinkedIn URL *'}
                          </label>
                          <input 
                            type="url"
                            id="career-portfolio"
                            name="portfolio"
                            required
                            aria-invalid={Boolean(applicantErrors.portfolio)}
                            aria-describedby={applicantErrors.portfolio ? 'career-portfolio-error' : undefined}
                            value={formData.portfolio}
                            onChange={handleInputChange}
                            placeholder="https://linkedin.com/in/... or https://behance.net/..."
                            className="w-full min-h-[44px] bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2.5 text-base sm:text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 font-mono transition-[border-color,box-shadow,background-color] duration-300"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="career-cover-letter" className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase">
                          {language === 'id' ? 'Pesan / Pengantar Singkat' : 'Cover Note / Introduction'}
                        </label>
                        <textarea 
                          id="career-cover-letter"
                          name="coverLetter"
                          rows={3}
                          value={formData.coverLetter}
                          onChange={handleInputChange}
                          placeholder={language === 'id' ? 'Ceritakan secara singkat pengalaman dan motivasi Anda...' : 'Briefly describe your relevant background and motivations...'}
                          className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2.5 text-base sm:text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 font-mono transition-[border-color,box-shadow,background-color] duration-300"
                        />
                      </div>

                      <div>
                        <label htmlFor="career-resume" className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase">
                          {language === 'id' ? 'Unggah CV / Resume (PDF maks 5MB)' : 'Upload Resume / CV (PDF max 5MB)'}
                        </label>
                        <div className="relative border border-dashed border-white/[0.12] rounded-xl p-4 text-center hover:border-brand-red/50 transition-colors bg-white/[0.012]">
                          <input 
                            type="file"
                            id="career-resume"
                            accept=".pdf,application/pdf"
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
                        <div className="flex items-start gap-2 rounded-xl border border-brand-red/25 bg-brand-red/[0.045] px-4 py-3 text-xs font-mono text-brand-red" role="alert">
                          <AlertCircle size={15} className="mt-0.5 shrink-0" />
                          <span>{applicantSubmitError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isApplicantSubmitting}
                        aria-busy={isApplicantSubmitting}
                        className="w-full min-h-[44px] py-3 rounded-xl bg-brand-red/72 text-white hover:bg-brand-red/86 font-semibold text-xs font-mono uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        {isApplicantSubmitting ? <><LoaderCircle size={15} className="animate-spin" /><span>{language === 'id' ? 'Mengirim...' : 'Submitting...'}</span></> : <><span>{language === 'id' ? 'Kirimkan Lamaran Sekarang' : 'Submit Application Now'}</span><ArrowUpRight size={16} /></>}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
        </CareerModalPortal>
      {/* Freelance Vendor Application Modal */}
      <CareerModalPortal>
<AnimatePresence>
        {isFreelanceModalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto kapi-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="freelance-network-title"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setIsFreelanceModalOpen(false);
                setIsVendorSubmitted(false);
                setVendorSubmitError('');
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              ref={careerModalRef}
              className="career-modal-shell relative flex w-full max-w-4xl min-h-0 max-h-[calc(100dvh-1rem)] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0F1116]/94 shadow-[0_24px_70px_-35px_rgba(0,0,0,0.9)] backdrop-blur-2xl my-2 sm:my-6 sm:max-h-[92vh]"
            >
              {/* Sticky Modal Header */}
              <div className="sticky top-0 z-20 px-5 sm:px-7 pt-5 sm:pt-6 pb-5 sm:pb-6 bg-[#0F1116]/96 backdrop-blur-2xl border-b border-white/[0.08] space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-red/15 border border-brand-red/40 text-brand-red text-[11px] font-mono font-semibold">
                        100% WFA • Project-Based
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/[0.025] border border-white/[0.08] text-[#A9AFBA] text-[10px] font-mono">
                        BYOD (No Device Provided)
                      </span>
                    </div>
                    <h2 id="freelance-network-title" className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white tracking-tight leading-tight">
                      {language === 'id' ? 'Formulir Pendaftaran Freelance Vendor' : 'Freelance Vendor Application Form'}
                    </h2>
                  </div>
                  
                  <button
                    onClick={() => {
                      setIsFreelanceModalOpen(false);
                      setIsVendorSubmitted(false);
                      setVendorSubmitError('');
                    }}
                    className="kapi-modal-close shrink-0"
                    aria-label="Close modal"
                    data-cursor-label="Close"
                    autoFocus
                  >
                    <X size={18} />
                  </button>
                </div>

                <p className="text-xs text-[#8A909D] font-light">
                  {language === 'id'
                    ? 'Daftarkan profil Anda untuk bergabung dalam jaringan vendor spesialis Kapitech. Kami akan menghubungi Anda ketika terdapat proyek yang cocok dengan keahlian Anda.'
                    : 'Submit your profile to join Kapitech’s vetted vendor network. We will reach out when a project matching your expertise becomes available.'
                  }
                </p>
              </div>

              {/* Modal Body */}
              <div className="career-modal-scroll min-h-0 flex-1 overflow-y-auto px-5 py-6 overscroll-contain sm:px-7 sm:py-7">
                {isVendorSubmitted ? (
                  <div className="p-8 rounded-2xl bg-white/[0.025] border border-white/[0.08] text-center space-y-4 my-6">
                    <div className="w-16 h-16 rounded-full bg-brand-red/[0.055] border border-brand-red/20 flex items-center justify-center text-brand-red mx-auto">
                      <CheckCircle2 size={36} />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
                      {language === 'id' ? 'Pendaftaran Vendor Berhasil Diterima!' : 'Vendor Application Received!'}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#8A909D] max-w-lg mx-auto font-light leading-relaxed">
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
                        className="px-6 py-2.5 rounded-full border border-white/[0.1] bg-white/[0.035] text-white hover:bg-white/[0.07] hover:border-white/[0.16] text-xs font-mono font-semibold uppercase tracking-wider transition-colors"
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
                        <label htmlFor="vendor-name" className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase font-semibold">
                          {language === 'id' ? 'Nama Lengkap / Studio *' : 'Full Name / Studio Name *'}
                        </label>
                        <input 
                          type="text"
                          id="vendor-name"
                          name="name"
                          required
                          aria-invalid={Boolean(vendorErrors.name)}
                          aria-describedby={vendorErrors.name ? 'vendor-name-error' : undefined}
                          value={vendorFormData.name}
                          onChange={handleVendorInputChange}
                          placeholder={language === 'id' ? 'e.g. Budi Santoso / Studio Koding' : 'e.g. Alex Morgan / Pixel Studio'}
                          className={`w-full min-h-[44px] bg-white/[0.015] border border-white/[0.09] rounded-xl px-4 py-2.5 text-base sm:text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 font-mono transition-[border-color,box-shadow,background-color] duration-300 ${vendorErrors.name ? 'border-brand-red' : 'border-white/[0.09]'}`}
                        />
                        {vendorErrors.name && (
                          <span id="vendor-name-error" className="text-[11px] font-mono text-brand-red mt-1 block" role="alert">{vendorErrors.name}</span>
                        )}
                      </div>

                      <div>
                        <label htmlFor="vendor-email" className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase font-semibold">
                          {language === 'id' ? 'Alamat Email *' : 'Email Address *'}
                        </label>
                        <input 
                          type="email"
                          id="vendor-email"
                          name="email"
                          required
                          aria-invalid={Boolean(vendorErrors.email)}
                          aria-describedby={vendorErrors.email ? 'vendor-email-error' : undefined}
                          value={vendorFormData.email}
                          onChange={handleVendorInputChange}
                          placeholder="freelancer@example.com"
                          className={`w-full min-h-[44px] bg-white/[0.015] border border-white/[0.09] rounded-xl px-4 py-2.5 text-base sm:text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 font-mono transition-[border-color,box-shadow,background-color] duration-300 ${vendorErrors.email ? 'border-brand-red' : 'border-white/[0.09]'}`}
                        />
                        {vendorErrors.email && (
                          <span id="vendor-email-error" className="text-[11px] font-mono text-brand-red mt-1 block" role="alert">{vendorErrors.email}</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="vendor-phone" className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase font-semibold">
                          {language === 'id' ? 'Nomor WhatsApp Aktif *' : 'WhatsApp Number (Active) *'}
                        </label>
                        <input 
                          type="tel"
                          id="vendor-phone"
                          name="phone"
                          required
                          aria-invalid={Boolean(vendorErrors.phone)}
                          aria-describedby={vendorErrors.phone ? 'vendor-phone-error' : undefined}
                          value={vendorFormData.phone}
                          onChange={handleVendorInputChange}
                          placeholder="+62 812-3456-7890"
                          className={`w-full min-h-[44px] bg-white/[0.015] border border-white/[0.09] rounded-xl px-4 py-2.5 text-base sm:text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 font-mono transition-[border-color,box-shadow,background-color] duration-300 ${vendorErrors.phone ? 'border-brand-red' : 'border-white/[0.09]'}`}
                        />
                        {vendorErrors.phone && (
                          <span id="vendor-phone-error" className="text-[11px] font-mono text-brand-red mt-1 block" role="alert">{vendorErrors.phone}</span>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase font-semibold">
                          {language === 'id' ? 'Spesialisasi Utama *' : 'Primary Specialty *'}
                        </label>
                        <CareerDropdown
                          ariaLabel={language === 'id' ? 'Spesialisasi utama' : 'Primary specialty'}
                          value={vendorFormData.specialty}
                          onChange={(value) => setVendorFormData((currentData) => ({ ...currentData, specialty: value }))}
                          options={[
                            { value: 'UI/UX & Product Design', label: language === 'id' ? 'UI/UX & Product Design (Figma, Design System, Prototyping)' : 'UI/UX & Product Design (Figma, Design Systems, Prototyping)' },
                            { value: 'Frontend Web Development', label: language === 'id' ? 'Frontend Web Development (React, Next.js, Tailwind)' : 'Frontend Web Development (React, Next.js, Tailwind)' },
                            { value: 'Backend & Full-Stack Development', label: language === 'id' ? 'Backend & Full-Stack Development (API, Database, Node.js)' : 'Backend & Full-Stack Development (APIs, Databases, Node.js)' },
                            { value: 'Brand Identity & Graphic Design', label: language === 'id' ? 'Brand Identity & Graphic Design (Identitas Visual, Guideline)' : 'Brand Identity & Graphic Design (Visual Identity, Guidelines)' },
                            { value: 'Motion & 3D WebGL Animation', label: language === 'id' ? 'Motion, Video & 3D (After Effects, Blender, Spline)' : 'Motion, Video & 3D (After Effects, Blender, Spline)' },
                            { value: 'Cloud & DevOps', label: language === 'id' ? 'Cloud & DevOps (Deployment, CI/CD, Infrastruktur)' : 'Cloud & DevOps (Deployment, CI/CD, Infrastructure)' },
                            { value: 'Editorial & Presentation Design', label: language === 'id' ? 'Editorial & Presentation Design (Layout, Pitch Deck)' : 'Editorial & Presentation Design (Layouts, Pitch Decks)' },
                            { value: 'Other Specialist Role', label: language === 'id' ? 'Spesialisasi Teknis / Kreatif Lainnya' : 'Other Specialist Tech / Creative Role' }
                          ]}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="vendor-portfolio" className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase font-semibold">
                          {language === 'id' ? 'Tautan Portofolio / GitHub / Dribbble *' : 'Portfolio / GitHub / Dribbble URL *'}
                        </label>
                        <input 
                          type="url"
                          id="vendor-portfolio"
                          name="portfolio"
                          required
                          aria-invalid={Boolean(vendorErrors.portfolio)}
                          aria-describedby={vendorErrors.portfolio ? 'vendor-portfolio-error' : undefined}
                          value={vendorFormData.portfolio}
                          onChange={handleVendorInputChange}
                          placeholder="https://behance.net/... or https://github.com/..."
                          className="w-full min-h-[44px] bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2.5 text-base sm:text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 font-mono transition-[border-color,box-shadow,background-color] duration-300"
                        />
                      </div>

                      <div>
                        <label htmlFor="vendor-rate-card" className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase font-semibold">
                          {language === 'id' ? 'Ekspektasi Rate Card (per Proyek / Jam)' : 'Rate Card Expectation (per Project / Hourly)'}
                        </label>
                        <input 
                          type="text"
                          id="vendor-rate-card"
                          name="rateCard"
                          value={vendorFormData.rateCard}
                          onChange={handleVendorInputChange}
                          placeholder={language === 'id' ? 'e.g. Rp 5.000.000 - Rp 15.000.000 / project' : 'e.g. $25 - $45 / hour or per project range'}
                          className="w-full min-h-[44px] bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2.5 text-base sm:text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 font-mono transition-[border-color,box-shadow,background-color] duration-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase font-semibold">
                          {language === 'id' ? 'Pengalaman Profesional' : 'Years of Experience'}
                        </label>
                        <CareerDropdown
                          ariaLabel={language === 'id' ? 'Pengalaman profesional' : 'Years of experience'}
                          value={vendorFormData.experienceYears}
                          onChange={(value) => setVendorFormData((currentData) => ({ ...currentData, experienceYears: value }))}
                          options={[
                            { value: '1-2 Years', label: '1 - 2 Years' },
                            { value: '3-5 Years', label: '3 - 5 Years (Mid-Level)' },
                            { value: '5-8 Years', label: '5 - 8 Years (Senior)' },
                            { value: '8+ Years', label: '8+ Years (Lead / Principal)' }
                          ]}
                        />
                      </div>

                      <div>
                        <label htmlFor="vendor-tools" className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase font-semibold">
                          {language === 'id' ? 'Alat Kerja / Stack Utama' : 'Core Tools & Tech Stack'}
                        </label>
                        <input 
                          type="text"
                          id="vendor-tools"
                          name="tools"
                          value={vendorFormData.tools}
                          onChange={handleVendorInputChange}
                          placeholder="e.g. Figma, React, Next.js, After Effects, Blender"
                          className="w-full min-h-[44px] bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2.5 text-base sm:text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 font-mono transition-[border-color,box-shadow,background-color] duration-300"
                        />
                      </div>
                    </div>

                    {/* MANDATORY CHECKBOXES (Crucial Requirements) */}
                    <div className="p-4 sm:p-5 rounded-xl bg-white/[0.018] border border-white/[0.08] space-y-3">
                      <span className="text-[11px] font-mono uppercase text-brand-red font-bold block mb-1">
                        {language === 'id' ? 'Konfirmasi Aturan & Ketentuan Kerja Sama *' : 'Mandatory Terms & Policy Acknowledgment *'}
                      </span>

                      <CareerCheckbox
                        id="vendor-agreed-wfa"
                        name="agreedWfa"
                        checked={vendorFormData.agreedWfa}
                        onChange={handleVendorInputChange}
                        title="100% WFA & Project-Based:"
                      >
                        {language === 'id'
                          ? 'Saya memahami dan setuju bahwa pekerjaan ini bersifat berbasis proyek (project-based) dan dikerjakan secara jarak jauh (Work From Anywhere).'
                          : 'I acknowledge that this engagement is strictly project-based under a 100% remote (WFA) collaboration model.'}
                      </CareerCheckbox>

                      <CareerCheckbox
                        id="vendor-agreed-device"
                        name="agreedDevice"
                        checked={vendorFormData.agreedDevice}
                        onChange={handleVendorInputChange}
                        title="BYOD (No Device Provided):"
                      >
                        {language === 'id'
                          ? 'Saya memahami bahwa Kapitech TIDAK menyediakan perangkat kerja/laptop, dan saya menggunakan perangkat workstation & lisensi software mandiri.'
                          : 'I acknowledge that Kapitech does NOT provide hardware/devices, and I will use my own capable workstation & software licenses.'}
                      </CareerCheckbox>

                      <CareerCheckbox
                        id="vendor-agreed-nda"
                        name="agreedNda"
                        checked={vendorFormData.agreedNda}
                        onChange={handleVendorInputChange}
                        title="NDA & Deadline Discipline:"
                      >
                        {language === 'id'
                          ? 'Saya bersedia menandatangani NDA kerahasiaan data klien serta berkomitmen 100% pada timeline milestone dan komunikasi yang responsif.'
                          : 'I agree to execute project NDAs and maintain strict adherence to milestone deadlines and prompt communication.'}
                      </CareerCheckbox>
                    </div>
                    {vendorErrors.agreements && (
                      <p className="rounded-lg border border-brand-red/25 bg-brand-red/[0.045] px-3.5 py-2.5 text-[11px] font-mono leading-5 text-brand-red" role="alert">
                        {vendorErrors.agreements}
                      </p>
                    )}

                    <div>
                      <label htmlFor="vendor-notes" className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase font-semibold">
                        {language === 'id' ? 'Catatan Tambahan / Deskripsi Keahlian' : 'Additional Notes / Key Highlights'}
                      </label>
                      <textarea 
                        id="vendor-notes"
                        name="notes"
                        rows={2}
                        value={vendorFormData.notes}
                        onChange={handleVendorInputChange}
                        placeholder={language === 'id' ? 'Ceritakan proyek terbaik yang pernah Anda kerjakan atau keahlian spesifik Anda...' : 'Highlight your proudest past projects or unique skill sets...'}
                        className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2.5 text-base sm:text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 font-mono transition-[border-color,box-shadow,background-color] duration-300"
                      />
                    </div>

                    <div>
                      <label htmlFor="vendor-resume" className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase font-semibold">
                        {language === 'id' ? 'Unggah CV / Portofolio PDF (Opsional, maks 5MB)' : 'Upload CV / Portfolio PDF (Optional, max 5MB)'}
                      </label>
                      <div className="relative border border-dashed border-white/[0.12] rounded-xl p-4 text-center hover:border-brand-red/50 transition-colors bg-white/[0.012]">
                        <input 
                          type="file"
                          id="vendor-resume"
                          accept=".pdf,application/pdf"
                          onChange={handleVendorFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <Upload className="w-5 h-5 text-white/40 mx-auto mb-1.5" />
                        <span className="text-xs text-[#8A909D] font-mono block">
                          {vendorFormData.resume ? vendorFormData.resume.name : (language === 'id' ? 'Klik atau seret file dokumen Anda ke sini' : 'Click or drag your document here')}
                        </span>
                      </div>
                      {vendorErrors.resume && (
                        <span className="text-[11px] font-mono text-brand-red mt-1 block" role="alert">{vendorErrors.resume}</span>
                      )}
                    </div>

                    {vendorSubmitError && (
                      <div className="flex items-start gap-2 rounded-xl border border-brand-red/25 bg-brand-red/[0.045] px-4 py-3 text-xs font-mono text-brand-red" role="alert">
                        <AlertCircle size={15} className="mt-0.5 shrink-0" />
                        <span>{vendorSubmitError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isVendorSubmitting}
                      aria-busy={isVendorSubmitting}
                      className="w-full min-h-[44px] py-3.5 rounded-xl bg-brand-red/72 text-white hover:bg-brand-red/86 disabled:opacity-60 disabled:cursor-wait font-semibold text-xs font-mono uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {isVendorSubmitting ? <><LoaderCircle size={15} className="animate-spin" /><span>{language === 'id' ? 'Mengirim...' : 'Submitting...'}</span></> : <><span>{language === 'id' ? 'Kirimkan Pendaftaran Freelance Vendor' : 'Submit Vendor Application'}</span><ArrowUpRight size={16} /></>}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
        </CareerModalPortal>
    </div>
  );
};
