import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowUpRight, CheckCircle2, FileText, ShieldCheck } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../lib/LanguageContext';
import { submitToInbox } from '../lib/submissions';
import { uploadProjectBrief } from '../lib/apiClient';

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
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
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
      setBriefError('Please choose a PDF, DOC, or DOCX file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setBrief(null);
      setBriefError('Project brief must be 10 MB or smaller.');
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
      setError('Enter a valid name and work email, then add project details, a preferred date, and a preferred time.');
      return;
    }
    if (form.preferredDate < today) {
      setError('Please choose today or a future date for the consultation request.');
      return;
    }
    if (form.message.trim().length > 3000) {
      setError('Project details must be 3,000 characters or fewer.');
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
        if (!upload.success || !upload.data?.briefUrl) throw new Error(upload.error || 'Project brief upload failed.');
        briefUrl = upload.data.briefUrl;
      }
      await submitToInbox({ fullName: form.fullName.trim(), email, company: form.company.trim(), phone: form.phone.trim(), services: form.service ? [form.service.trim()] : [], message: form.message.trim(), source: 'Website Consultation Booking', type: 'inquiry', availability: form.preferredDate + ' ' + form.preferredTime, location: form.timezone, industry: form.industry.trim(), ndaRequested: form.ndaRequested, briefUrl });
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Submission failed.');
    } finally { setLoading(false); }
  };

  if (submitted) return <main className="min-h-screen bg-[#0B0C0E] px-5 pb-24 pt-32 text-white sm:px-8"><div className="mx-auto max-w-3xl rounded-3xl border border-white/[0.08] bg-white/[0.018] p-7 sm:p-10"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05]"><CheckCircle2 size={22}/></div><p className="mt-6 text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">Request received</p><h1 className="mt-3 text-4xl font-display font-semibold tracking-[-0.045em] sm:text-5xl">Your consultation request is in.</h1><p className="mt-4 text-sm leading-7 text-[#8F97A4]">Kapitech will review your context, preferred time, and confidentiality requirements, then contact you to confirm the meeting.</p><Link to="/work" className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/[0.09] px-5 py-3 text-xs font-semibold">Explore case studies <ArrowUpRight size={14}/></Link></div></main>;

  return <main className="min-h-screen bg-[#0B0C0E] pb-24 pt-28 text-white sm:pt-32"><div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:px-12"><section className="lg:sticky lg:top-28 lg:self-start"><Link to="/contact" className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.14em] text-[#77808C] hover:text-white"><ArrowLeft size={13}/> Back to contact</Link><p className="mt-9 text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">Consultation</p><h1 className="mt-4 text-4xl font-display font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl">Start with the conversation your project actually needs.</h1><p className="mt-6 text-base leading-8 text-[#9097A4]">Choose a preferred time, share the project context, request an NDA when needed, and attach a brief when you have one ready.</p><div className="mt-8 space-y-3"><div className="flex gap-3 text-sm text-[#9AA1AD]"><ShieldCheck size={16} className="mt-1 shrink-0 text-white"/>NDA request can be flagged in the inquiry.</div><div className="flex gap-3 text-sm text-[#9AA1AD]"><FileText size={16} className="mt-1 shrink-0 text-white"/>PDF, DOC, and DOCX project briefs are supported.</div><div className="flex gap-3 text-sm text-[#9AA1AD]"><CheckCircle2 size={16} className="mt-1 shrink-0 text-white"/>The preferred slot is a request, not an automatic calendar booking.</div></div></section><form onSubmit={submit} className="rounded-3xl border border-white/[0.08] bg-white/[0.018] p-5 sm:p-7 lg:p-8"><div className="grid gap-5 sm:grid-cols-2">{([['fullName','Full name','text'],['email','Work email','email'],['company','Company','text'],['phone','Phone / WhatsApp','tel'] ] as const).map(([key,label,type]) => <label key={key} className="block"><span className="block text-[10px] font-mono uppercase tracking-[0.12em] text-[#7A828E]">{label}</span><input required={key==='fullName'||key==='email'} type={type} value={String(form[key as keyof typeof form] || '')} onChange={(e)=>update(key,e.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-white/[0.08] bg-black/20 px-4 text-sm text-white outline-none focus:border-brand-red/50"/></label>)}<label className="block"><span className="block text-[10px] font-mono uppercase tracking-[0.12em] text-[#7A828E]">Service</span><input value={form.service} onChange={(e)=>update('service',e.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-white/[0.08] bg-black/20 px-4 text-sm text-white outline-none focus:border-brand-red/50"/></label><label className="block"><span className="block text-[10px] font-mono uppercase tracking-[0.12em] text-[#7A828E]">Industry</span><input value={form.industry} onChange={(e)=>update('industry',e.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-white/[0.08] bg-black/20 px-4 text-sm text-white outline-none focus:border-brand-red/50"/></label><label className="block"><span className="block text-[10px] font-mono uppercase tracking-[0.12em] text-[#7A828E]">Preferred date</span><input required min={today} type="date" value={form.preferredDate} onChange={(e)=>update('preferredDate',e.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-white/[0.08] bg-black/20 px-4 text-sm text-white outline-none focus:border-brand-red/50"/></label><label className="block"><span className="block text-[10px] font-mono uppercase tracking-[0.12em] text-[#7A828E]">Preferred time</span><input required type="time" value={form.preferredTime} onChange={(e)=>update('preferredTime',e.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-white/[0.08] bg-black/20 px-4 text-sm text-white outline-none focus:border-brand-red/50"/></label><label className="block sm:col-span-2"><span className="block text-[10px] font-mono uppercase tracking-[0.12em] text-[#7A828E]">Timezone</span><select value={form.timezone} onChange={(e)=>update('timezone',e.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-white/[0.08] bg-[#111318] px-4 text-sm text-white outline-none focus:border-brand-red/50">{timezoneOptions.map((zone)=><option key={zone} value={zone}>{zone}</option>)}</select></label><label className="block sm:col-span-2"><span className="block text-[10px] font-mono uppercase tracking-[0.12em] text-[#7A828E]">Project details</span><textarea required maxLength={3000} value={form.message} onChange={(e)=>update('message',e.target.value)} rows={7} className="mt-2 w-full rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-4 text-sm leading-7 text-white outline-none focus:border-brand-red/50" placeholder="What are you trying to build, improve, launch, or solve?"/></label><label className="block sm:col-span-2"><span className="block text-[10px] font-mono uppercase tracking-[0.12em] text-[#7A828E]">Project brief attachment</span><input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e)=>handleBriefChange(e.target.files?.[0] || null)} className="mt-2 block w-full rounded-2xl border border-dashed border-white/[0.12] bg-black/20 p-4 text-xs text-[#8E96A2] file:mr-4 file:rounded-full file:border-0 file:bg-white/[0.06] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"/>{briefError ? <p className="mt-2 text-[11px] leading-5 text-brand-red" role="alert">{briefError}</p> : brief ? <p className="mt-2 text-[11px] leading-5 text-[#7D8590]">{brief.name} · {(brief.size / 1024 / 1024).toFixed(2)} MB</p> : null}</label><label className="flex items-start gap-3 sm:col-span-2"><input type="checkbox" checked={form.ndaRequested} onChange={(e)=>update('ndaRequested',e.target.checked)} className="mt-1 h-4 w-4 accent-brand-red"/><span className="text-sm leading-6 text-[#8C94A0]">I would like Kapitech to note that this inquiry requires NDA/confidential handling before detailed project information is exchanged.</span></label></div>{error?<p className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-4 text-sm leading-6 text-red-200">{error}</p>:null}<button type="submit" disabled={loading} className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-red px-6 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">{loading?'Submitting…':'Request consultation'}<ArrowUpRight size={14}/></button><p className="mt-4 text-[11px] leading-5 text-[#646C78]">Submitting this form does not reserve a calendar slot automatically. It sends your preferred time to Kapitech for confirmation.</p></form></div></main>;
};
