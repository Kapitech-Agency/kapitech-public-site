import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowUpRight, CheckCircle2, FileText, ShieldCheck } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../lib/LanguageContext';
import { submitToInbox } from '../lib/submissions';
import { uploadProjectBrief } from '../lib/apiClient';
import PublicPageHero from '../components/ui/PublicPageHero';

export const BookCall = () => {
  const { language } = useLanguage();
  const [params] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [brief, setBrief] = useState<File | null>(null);
  const [briefError, setBriefError] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    company: '',
    phone: '',
    service: params.get('service') || '',
    industry: params.get('industry') || '',
    preferredDate: '',
    preferredTime: '',
    timezone: 'Asia/Jakarta',
    ndaRequested: false,
    message: ''
  });
  const timezoneOptions = useMemo(() => ['Asia/Jakarta', 'Asia/Singapore', 'Asia/Kuala_Lumpur', 'Asia/Bangkok', 'Asia/Tokyo', 'Australia/Perth', 'Europe/London', 'Europe/Berlin', 'America/New_York', 'America/Los_Angeles'], []);
  const today = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  }, []);
  const update = (key: string, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));
  const handleBriefChange = (file: File | null) => {
    setBriefError('');
    if (!file) {
      setBrief(null);
      return;
    }
    const allowedTypes = new Set(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);
    const allowedExtensions = /\.(pdf|doc|docx)$/i;
    if (!allowedExtensions.test(file.name) || (file.type && !allowedTypes.has(file.type))) {
      setBrief(null);
      setBriefError(language === 'id' ? 'Pilih file PDF, DOC, atau DOCX.' : 'Please choose a PDF, DOC, or DOCX file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setBrief(null);
      setBriefError(language === 'id' ? 'Project brief maksimal 10 MB.' : 'Project brief must be 10 MB or smaller.');
      return;
    }
    setBrief(file);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    const email = form.email.trim().toLowerCase();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!form.fullName.trim() || !email || !validEmail || !form.message.trim() || !form.preferredDate || !form.preferredTime) {
      setError(language === 'id' ? 'Isi nama dan email kerja yang valid, lalu lengkapi detail proyek, tanggal, dan waktu konsultasi.' : 'Enter a valid name and work email, then add project details, a preferred date, and a preferred time.');
      return;
    }
    if (form.preferredDate < today) {
      setError(language === 'id' ? 'Pilih tanggal hari ini atau tanggal setelahnya untuk permintaan konsultasi.' : 'Please choose today or a future date for the consultation request.');
      return;
    }
    if (form.message.trim().length > 3000) {
      setError(language === 'id' ? 'Detail proyek maksimal 3.000 karakter.' : 'Project details must be 3,000 characters or fewer.');
      return;
    }
    if (briefError) {
      setError(briefError);
      return;
    }
    setLoading(true);
    try {
      let briefUrl = '';
      if (brief) {
        const upload = await uploadProjectBrief(brief);
        if (!upload.success || !upload.data?.briefUrl) throw new Error(upload.error || (language === 'id' ? 'Upload project brief gagal.' : 'Project brief upload failed.'));
        briefUrl = upload.data.briefUrl;
      }
      await submitToInbox({ fullName: form.fullName.trim(), email, company: form.company.trim(), phone: form.phone.trim(), services: form.service ? [form.service.trim()] : [], message: form.message.trim(), source: 'Website Consultation Booking', type: 'inquiry', availability: form.preferredDate + ' ' + form.preferredTime, location: form.timezone, industry: form.industry.trim(), ndaRequested: form.ndaRequested, briefUrl });
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : (language === 'id' ? 'Pengiriman gagal. Silakan coba lagi.' : 'Submission failed.'));
    } finally { setLoading(false); }
  };

  if (submitted) return (
    <main className="kapi-page-bg min-h-screen bg-[#0B0C0E] text-white">
      <PublicPageHero
        eyebrow={language === 'id' ? 'Permintaan diterima' : 'Request received'}
        title={language === 'id' ? 'Permintaan konsultasi Anda sudah diterima.' : 'Your consultation request is in.'}
        description={language === 'id' ? 'Kapitech akan meninjau konteks, waktu yang dipilih, dan kebutuhan kerahasiaan Anda, lalu menghubungi Anda untuk mengonfirmasi pertemuan.' : 'Kapitech will review your context, preferred time, and confidentiality requirements, then contact you to confirm the meeting.'}
      >
        <Link to="/work" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.02] px-5 py-3 text-xs font-semibold text-white transition-colors hover:border-white/[0.16] hover:bg-white/[0.04]">
          {language === 'id' ? 'Lihat studi kasus' : 'Explore case studies'} <ArrowUpRight size={14}/>
        </Link>
      </PublicPageHero>
      <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 md:px-12"><div className="kapi-surface p-6 sm:p-8"><CheckCircle2 size={22}/><p className="sr-only">Request successfully submitted</p></div></div>
    </main>
  );

  return (
    <main className="kapi-page-bg min-h-screen bg-[#0B0C0E] text-white">
      <PublicPageHero
        eyebrow={language === 'id' ? 'Konsultasi' : 'Consultation'}
        title={language === 'id' ? 'Mulai dengan percakapan yang benar-benar dibutuhkan proyek Anda.' : 'Start with the conversation your project actually needs.'}
        description={language === 'id' ? 'Pilih waktu yang diinginkan, jelaskan konteks proyek, minta NDA bila diperlukan, dan lampirkan brief jika sudah siap.' : 'Choose a preferred time, share the project context, request an NDA when needed, and attach a brief when you have one ready.'}
        backLink={{ href: '/contact', label: language === 'id' ? 'Kembali ke kontak' : 'Back to contact' }}
      >
        <div className="grid gap-2.5 sm:grid-cols-3">
          <div className="kapi-surface p-4 text-sm text-[#9AA1AD]"><ShieldCheck size={16} className="mb-2 text-white"/>{language === 'id' ? 'NDA dapat ditandai di inquiry.' : 'NDA can be flagged in the inquiry.'}</div>
          <div className="kapi-surface p-4 text-sm text-[#9AA1AD]"><FileText size={16} className="mb-2 text-white"/>{language === 'id' ? 'PDF, DOC, dan DOCX didukung.' : 'PDF, DOC, and DOCX are supported.'}</div>
          <div className="kapi-surface p-4 text-sm text-[#9AA1AD]"><CheckCircle2 size={16} className="mb-2 text-white"/>{language === 'id' ? 'Waktu yang dipilih perlu dikonfirmasi.' : 'Preferred times are confirmed manually.'}</div>
        </div>
      </PublicPageHero>
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 md:px-12">
        <form onSubmit={submit} className="rounded-3xl border border-white/[0.08] bg-white/[0.018] p-5 sm:p-7 lg:p-8"><div className="grid gap-5 sm:grid-cols-2">{([['fullName','Full name','Nama lengkap','text'],['email','Work email','Email kerja','email'],['company','Company','Perusahaan','text'],['phone','Phone / WhatsApp','Telepon / WhatsApp','tel'] ] as const).map(([key,label,labelId,type]) => <label key={key} className="block"><span className="block text-[10px] font-mono uppercase tracking-[0.12em] text-[#7A828E]">{language === 'id' ? labelId : label}</span><input required={key==='fullName'||key==='email'} type={type} value={String(form[key as keyof typeof form] || '')} onChange={(e)=>update(key,e.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-white/[0.08] bg-black/20 px-4 text-sm text-white outline-none focus:border-brand-red/50"/></label>)}<label className="block"><span className="block text-[10px] font-mono uppercase tracking-[0.12em] text-[#7A828E]">{language === 'id' ? 'Layanan' : 'Service'}</span><input value={form.service} onChange={(e)=>update('service',e.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-white/[0.08] bg-black/20 px-4 text-sm text-white outline-none focus:border-brand-red/50"/></label><label className="block"><span className="block text-[10px] font-mono uppercase tracking-[0.12em] text-[#7A828E]">{language === 'id' ? 'Industri' : 'Industry'}</span><input value={form.industry} onChange={(e)=>update('industry',e.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-white/[0.08] bg-black/20 px-4 text-sm text-white outline-none focus:border-brand-red/50"/></label><label className="block"><span className="block text-[10px] font-mono uppercase tracking-[0.12em] text-[#7A828E]">{language === 'id' ? 'Tanggal yang diinginkan' : 'Preferred date'}</span><input required min={today} type="date" value={form.preferredDate} onChange={(e)=>update('preferredDate',e.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-white/[0.08] bg-black/20 px-4 text-sm text-white outline-none focus:border-brand-red/50"/></label><label className="block"><span className="block text-[10px] font-mono uppercase tracking-[0.12em] text-[#7A828E]">{language === 'id' ? 'Waktu yang diinginkan' : 'Preferred time'}</span><input required type="time" value={form.preferredTime} onChange={(e)=>update('preferredTime',e.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-white/[0.08] bg-black/20 px-4 text-sm text-white outline-none focus:border-brand-red/50"/></label><label className="block sm:col-span-2"><span className="block text-[10px] font-mono uppercase tracking-[0.12em] text-[#7A828E]">{language === 'id' ? 'Zona waktu' : 'Timezone'}</span><select value={form.timezone} onChange={(e)=>update('timezone',e.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-white/[0.08] bg-[#111318] px-4 text-sm text-white outline-none focus:border-brand-red/50">{timezoneOptions.map((zone)=><option key={zone} value={zone}>{zone}</option>)}</select></label><label className="block sm:col-span-2"><span className="block text-[10px] font-mono uppercase tracking-[0.12em] text-[#7A828E]">{language === 'id' ? 'Detail proyek' : 'Project details'}</span><textarea required maxLength={3000} value={form.message} onChange={(e)=>update('message',e.target.value)} rows={7} className="mt-2 w-full rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-4 text-sm leading-7 text-white outline-none focus:border-brand-red/50" placeholder={language === 'id' ? 'Apa yang ingin Anda bangun, perbaiki, luncurkan, atau selesaikan?' : 'What are you trying to build, improve, launch, or solve?'}/></label><label className="block sm:col-span-2"><span className="block text-[10px] font-mono uppercase tracking-[0.12em] text-[#7A828E]">{language === 'id' ? 'Lampiran project brief' : 'Project brief attachment'}</span><input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e)=>handleBriefChange(e.target.files?.[0] || null)} className="mt-2 block w-full rounded-2xl border border-dashed border-white/[0.12] bg-black/20 p-4 text-xs text-[#8E96A2] file:mr-4 file:rounded-full file:border-0 file:bg-white/[0.06] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"/>{briefError ? <p className="mt-2 text-[11px] leading-5 text-brand-red" role="alert">{briefError}</p> : brief ? <p className="mt-2 text-[11px] leading-5 text-[#7D8590]">{brief.name} · {(brief.size / 1024 / 1024).toFixed(2)} MB</p> : null}</label><label className="flex items-start gap-3 sm:col-span-2"><input type="checkbox" checked={form.ndaRequested} onChange={(e)=>update('ndaRequested',e.target.checked)} className="mt-1 h-4 w-4 accent-brand-red"/><span className="text-sm leading-6 text-[#8C94A0]">{language === 'id' ? 'Saya ingin Kapitech mencatat bahwa inquiry ini membutuhkan penanganan NDA/rahasia sebelum detail proyek dibagikan.' : 'I would like Kapitech to note that this inquiry requires NDA/confidential handling before detailed project information is exchanged.'}</span></label></div>{error?<p className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-4 text-sm leading-6 text-red-200">{error}</p>:null}<button type="submit" disabled={loading} className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-red px-6 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">{loading ? (language === 'id' ? 'Mengirim…' : 'Submitting…') : (language === 'id' ? 'Minta konsultasi' : 'Request consultation')}<ArrowUpRight size={14}/></button><p className="mt-4 text-[11px] leading-5 text-[#646C78]">{language === 'id' ? 'Form ini tidak langsung memesan slot kalender. Waktu yang dipilih akan dikirim ke Kapitech untuk dikonfirmasi.' : 'Submitting this form does not reserve a calendar slot automatically. It sends your preferred time to Kapitech for confirmation.'}</p></form>
      </div>
    </main>
  );
};
