import React, { useEffect, useState } from 'react';
import PatternWaves from '../components/ui/PatternWaves/PatternWavesTyped';
import { createPortal } from 'react-dom';
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
  FolderGit2,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { sanitizeInput, isValidEmail, isValidPhone, validateResumeFile, clampLength } from '../lib/security';
import { submitToInbox } from '../lib/submissions';
import { uploadPublicResume } from '../lib/apiClient';

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
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-career-dropdown]')) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" data-career-dropdown>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((currentOpen) => !currentOpen)}
        className="flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#0B0C0E]/70 px-4 py-2.5 text-left font-mono text-xs text-white transition-[background-color,border-color,box-shadow] duration-300 hover:border-white/[0.14] hover:bg-white/[0.025] focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20"
      >
        <span className="min-w-0 truncate">{selected?.label ?? value}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#8A909D] transition-transform duration-200 ${open ? 'rotate-180 text-white' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.985 }}
            transition={{ duration: 0.16 }}
            className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111216]/98 p-1.5 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.95)] backdrop-blur-2xl"
            role="listbox"
            aria-label={ariaLabel}
          >
            <div className="max-h-64 overflow-y-auto overscroll-contain">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
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
                        className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2.5 text-base sm:text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 font-mono transition-[border-color,box-shadow,background-color] duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-[#8A909D] mb-1.5 uppercase font-semibold">
                        {language === 'id' ? 'Unggah CV / Portofolio PDF (Opsional, maks 5MB)' : 'Upload CV / Portfolio PDF (Optional, max 5MB)'}
                      </label>
                      <div className="relative border border-dashed border-white/[0.12] rounded-xl p-4 text-center hover:border-brand-red/50 transition-colors bg-white/[0.012]">
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
                      <div className="flex items-start gap-2 rounded-xl border border-brand-red/25 bg-brand-red/[0.045] px-4 py-3 text-xs font-mono text-brand-red" role="alert">
                        <AlertCircle size={15} className="mt-0.5 shrink-0" />
                        <span>{vendorSubmitError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full min-h-[44px] py-3.5 rounded-xl bg-brand-red/72 text-white hover:bg-brand-red/86 font-semibold text-xs font-mono uppercase tracking-wider transition-all duration-300 shadow-[0_10px_24px_-18px_rgba(229,9,20,0.72)] flex items-center justify-center gap-2"
                    >
                      <span>{language === 'id' ? 'Kirimkan Pendaftaran Freelance Vendor' : 'Submit Vendor Application'}</span>
                      <ArrowUpRight size={16} />
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
