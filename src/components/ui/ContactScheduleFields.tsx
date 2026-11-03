import React, { useEffect, useRef, useState } from 'react';
import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Clock3, Globe2 } from 'lucide-react';

type Props = {
  language: 'id' | 'en';
  today: string;
  date: string;
  time: string;
  timezone: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onTimezoneChange: (value: string) => void;
};

const zones = [
  ['Asia/Jakarta', 'Jakarta · WIB (UTC+7)'],
  ['Asia/Singapore', 'Singapore (UTC+8)'],
  ['Asia/Kuala_Lumpur', 'Kuala Lumpur (UTC+8)'],
  ['Asia/Bangkok', 'Bangkok (UTC+7)'],
  ['Asia/Tokyo', 'Tokyo (UTC+9)'],
  ['Australia/Perth', 'Perth (UTC+8)'],
  ['Europe/London', 'London'],
  ['Europe/Berlin', 'Berlin'],
  ['America/New_York', 'New York'],
  ['America/Los_Angeles', 'Los Angeles']
] as const;
const times = Array.from({ length: 24 * 2 }, (_, index) => {
  const hour = String(Math.floor(index / 2)).padStart(2, '0');
  return hour + ':' + (index % 2 ? '30' : '00');
});
const parseDay = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};
const formatDay = (day: Date) =>
  [day.getFullYear(), String(day.getMonth() + 1).padStart(2, '0'), String(day.getDate()).padStart(2, '0')].join('-');

export const ContactScheduleFields = ({ language, today, date, time, timezone, onDateChange, onTimeChange, onTimezoneChange }: Props) => {
  const [open, setOpen] = useState<'date' | 'time' | 'zone' | null>(null);
  const [month, setMonth] = useState(() => {
    const d = parseDay(date || today);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = language === 'id' ? 'id-ID' : 'en-US';
  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(null);
    };
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(null);
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeEscape);
    };
  }, [open]);

  const firstWeekday = (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: firstWeekday + daysInMonth }, (_, index) => index < firstWeekday ? null : index - firstWeekday + 1);
  const dateLabel = date ? parseDay(date).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' }) : (language === 'id' ? 'Pilih tanggal' : 'Choose a date');
  const trigger = 'flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-white/[0.12] bg-[#15171B] px-4 text-left text-sm text-white transition-colors hover:border-white/[0.24] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70';
  const label = 'mb-2 block text-[10px] font-mono uppercase tracking-[0.12em] text-[#A7ACB5]';
  const cell = 'flex h-9 w-full items-center justify-center rounded-lg text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70';
  return (
    <div ref={containerRef} className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="relative min-w-0">
        <span className={label} id="contact-date-label">{language === 'id' ? 'Tanggal pilihan' : 'Preferred date'}</span>
        <button type="button" aria-labelledby="contact-date-label" aria-expanded={open === 'date'} aria-controls="contact-date-panel" onClick={() => setOpen(open === 'date' ? null : 'date')} className={trigger}>
          <span className="flex min-w-0 items-center gap-2"><CalendarDays size={16} className="shrink-0 text-brand-red" /><span className="truncate">{dateLabel}</span></span><ChevronDown size={15} className="shrink-0 text-[#9AA1AD]" />
        </button>
        {open === 'date' && <div id="contact-date-panel" className="absolute left-0 right-0 z-50 mt-2 rounded-2xl border border-white/[0.16] bg-[#17191F] p-3 shadow-2xl sm:right-auto sm:w-[310px]">
          <div className="mb-3 flex items-center justify-between gap-2">
            <button type="button" className="rounded-lg p-2 hover:bg-white/[0.08]" aria-label={language === 'id' ? 'Bulan sebelumnya' : 'Previous month'} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft size={17}/></button>
            <span className="text-sm font-semibold text-white">{month.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}</span>
            <button type="button" className="rounded-lg p-2 hover:bg-white/[0.08]" aria-label={language === 'id' ? 'Bulan berikutnya' : 'Next month'} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight size={17}/></button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">{(language === 'id' ? ['Sen','Sel','Rab','Kam','Jum','Sab','Min'] : ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']).map(d => <span key={d} className="py-1 text-[10px] text-[#8E96A2]">{d}</span>)}
            {days.map((day, index) => {
              const value = day === null ? '' : formatDay(new Date(month.getFullYear(), month.getMonth(), day));
              const disabled = value < today;
              return day === null ? <span key={'blank-' + index}/> : <button key={value} type="button" disabled={disabled} aria-pressed={date === value} onClick={() => { onDateChange(value); setOpen(null); }} className={cell + (date === value ? ' bg-brand-red text-white' : disabled ? ' cursor-not-allowed text-[#555B65]' : ' text-[#E4E7ED] hover:bg-white/[0.09]')}>{day}</button>;
            })}
          </div>
          {date && <button type="button" onClick={() => { onDateChange(''); setOpen(null); }} className="mt-3 w-full border-t border-white/[0.08] pt-3 text-xs text-[#AEB5C1] hover:text-white">{language === 'id' ? 'Hapus tanggal' : 'Clear date'}</button>}
        </div>}
      </div>
      <div className="relative min-w-0">
        <span className={label} id="contact-time-label">{language === 'id' ? 'Waktu pilihan' : 'Preferred time'}</span>
        <button type="button" aria-labelledby="contact-time-label" aria-expanded={open === 'time'} aria-controls="contact-time-panel" onClick={() => setOpen(open === 'time' ? null : 'time')} className={trigger}><span className="flex items-center gap-2"><Clock3 size={16} className="text-brand-red"/>{time || (language === 'id' ? 'Pilih waktu' : 'Choose a time')}</span><ChevronDown size={15} className="text-[#9AA1AD]"/></button>
        {open === 'time' && <div id="contact-time-panel" className="absolute inset-x-0 z-50 mt-2 max-h-60 overflow-y-auto rounded-xl border border-white/[0.16] bg-[#17191F] p-2 shadow-2xl">
          <div className="grid grid-cols-3 gap-1">{times.map(slot => <button key={slot} type="button" aria-pressed={slot === time} onClick={() => { onTimeChange(slot); setOpen(null); }} className={'min-h-10 rounded-lg text-xs transition-colors ' + (slot === time ? 'bg-brand-red text-white' : 'text-[#CED3DC] hover:bg-white/[0.08]')}>{slot}</button>)}</div>
          {time && <button type="button" className="mt-2 w-full border-t border-white/[0.08] pt-2 text-xs text-[#AEB5C1]" onClick={() => { onTimeChange(''); setOpen(null); }}>{language === 'id' ? 'Hapus waktu' : 'Clear time'}</button>}
        </div>}
      </div>
      <div className="relative min-w-0 sm:col-span-2">
        <span className={label} id="contact-zone-label">{language === 'id' ? 'Zona waktu' : 'Time zone'}</span>
        <button type="button" aria-labelledby="contact-zone-label" aria-expanded={open === 'zone'} aria-controls="contact-zone-panel" onClick={() => setOpen(open === 'zone' ? null : 'zone')} className={trigger}><span className="flex min-w-0 items-center gap-2"><Globe2 size={16} className="shrink-0 text-brand-red"/><span className="truncate">{zones.find(([value]) => value === timezone)?.[1] || timezone}</span></span><ChevronDown size={15} className="shrink-0 text-[#9AA1AD]"/></button>
        {open === 'zone' && <div id="contact-zone-panel" className="absolute inset-x-0 z-50 mt-2 max-h-56 overflow-y-auto rounded-xl border border-white/[0.16] bg-[#17191F] p-2 shadow-2xl">
          {zones.map(([value, title]) => <button key={value} type="button" onClick={() => { onTimezoneChange(value); setOpen(null); }} className={'flex min-h-10 w-full items-center justify-between gap-3 rounded-lg px-3 text-left text-xs transition-colors ' + (timezone === value ? 'bg-brand-red/15 text-white' : 'text-[#C6CBD5] hover:bg-white/[0.08]')}><span>{title}</span>{timezone === value && <Check size={14} className="shrink-0 text-brand-red"/>}</button>)}
        </div>}
      </div>
    </div>
  );
};
