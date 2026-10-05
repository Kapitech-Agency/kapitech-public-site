import React from 'react';
import { motion } from 'motion/react';
import { AtmosphericBackground } from '../components/ui/AtmosphericBackground';
import { useLanguage } from '../lib/LanguageContext';
import { Shield, ToggleLeft } from 'lucide-react';

export const CookiePolicy = () => {
  const { language } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="kapi-policy-page min-h-screen pt-28 sm:pt-36 md:pt-40 pb-16 sm:pb-20 px-4 sm:px-6 md:px-12 bg-[#0B0C0E] text-[#8A909D] font-light relative selection:bg-brand-red selection:text-white"
    >
      <AtmosphericBackground 
        imageUrl="/hero_background_3d.png"
        opacity={0.05}
        disableGrayscale={true}
      />
      <div className="max-w-4xl mx-auto relative z-10">
        <span className="kapi-section-label mb-5">
          {language === 'id' ? 'Preferensi Cookie & Privasi' : 'Cookie Preferences & Privacy'}
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white mb-4 tracking-tighter">
          {language === 'id' ? 'Kebijakan Cookie.' : 'Cookie Policy.'}
        </h1>
        <p className="text-xs sm:text-sm uppercase tracking-widest text-brand-red font-mono font-semibold mb-12">
          {language === 'id' ? 'Terakhir Diperbarui: 5 Oktober 2026' : 'Last Updated: October 5, 2026'}
        </p>
        
        {language === 'id' ? (
          <div className="space-y-12 text-base md:text-lg leading-relaxed text-[#8A909D]">
            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-4">1. Apa Itu Cookie?</h2>
              <p>
                Cookie dan penyimpanan lokal adalah data kecil yang ditempatkan atau disimpan di perangkat Anda saat mengunjungi situs web kami. Kami menggunakannya untuk preferensi bahasa, fungsi penting, dan, setelah persetujuan, penyimpanan atribusi serta analitik opsional yang membantu kami memahami interaksi dan meningkatkan performa website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-4">2. Kategori Cookie yang Kami Gunakan</h2>
              <p className="mb-4">Kami menggunakan kategori penyimpanan berikut:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-white">Penyimpanan Esensial &amp; Fungsional:</strong> Digunakan untuk fungsi inti, seperti preferensi bahasa dan perlindungan formulir.</li>
                <li><strong className="text-white">Analitik &amp; Atribusi (Opsional):</strong> Setelah Anda memberikan persetujuan, penyimpanan lokal dapat berisi parameter kampanye, halaman pendaratan, host rujukan, dan ID anonim bila integrasi analitik dikonfigurasi. Fitur ini tidak diaktifkan sebelum persetujuan analitik diberikan.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-4">3. Pengendalian & Penolakan Cookie</h2>
              <p>
                Anda dapat menarik persetujuan analitik opsional kapan saja melalui kontrol “Kelola preferensi cookie” di bawah atau melalui pengaturan browser. Saat persetujuan analitik ditarik, Kapitech berhenti mengirim event analitik baru dan menghapus penyimpanan atribusi anonim yang dikelola website sejauh browser mengizinkannya. Menolak penyimpanan analitik opsional tidak menghalangi fungsi utama website, sedangkan pembatasan penyimpanan esensial dapat membuat preferensi bahasa dan fungsi tertentu tidak tersimpan.
              </p>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('kapitech_open_cookie_preferences'))}
                className="mt-5 inline-flex min-h-[42px] items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.03] px-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#C2C7D1] transition-[background-color,border-color,color] duration-200 hover:border-white/[0.2] hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
              >
                Kelola preferensi cookie
              </button>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-4">4. Hubungi Kami</h2>
              <p>
                Jika Anda memiliki pertanyaan mengenai penggunaan cookie atau perlindungan data privasi di Kapitech Agency, silakan hubungi tim kami di <a href="mailto:hello@kapitech.id" className="text-brand-red hover:underline">hello@kapitech.id</a>.
              </p>
            </section>
          </div>
        ) : (
          <div className="space-y-12 text-base md:text-lg leading-relaxed text-[#8A909D]">
            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-4">1. What Are Cookies?</h2>
              <p>
                Cookies and local browser storage are small pieces of data placed or stored on your device when you visit our website. We use them for language preferences, essential functionality, and, after consent, optional attribution and analytics storage that helps us understand interactions and improve performance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-4">2. Categories of Cookies We Use</h2>
              <p className="mb-4">We classify cookies into the following operational groups:</p>
              <ul className="list-disc pl-6 space-y-3">
                <li><strong className="text-white">Essential & Functional Cookies (Required):</strong> Essential for core website operations, such as storing your active language toggle preference and securing contact form submissions against spam.</li>
                <li><strong className="text-white">Performance & Telemetry Cookies (Optional):</strong> Allow us to measure aggregate anonymous performance indicators, including page render latency and user navigation flows. We do not store Personally Identifiable Information (PII) in telemetry cookies.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-4">3. Managing & Withdrawing Consent</h2>
              <p>
                You can withdraw optional analytics consent at any time using the “Manage cookie preferences” control below or through your browser settings. When analytics consent is withdrawn, Kapitech stops sending new analytics events and removes the attribution and anonymous identifiers managed by the website where the browser permits it. Declining optional analytics storage does not prevent the core website from functioning, while restricting essential storage may reset language preferences and some site functionality after refresh.
              </p>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('kapitech_open_cookie_preferences'))}
                className="mt-5 inline-flex min-h-[42px] items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.03] px-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#C2C7D1] transition-[background-color,border-color,color] duration-200 hover:border-white/[0.2] hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
              >
                Manage cookie preferences
              </button>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-4">4. Inquiries</h2>
              <p>
                For questions regarding cookie management or digital privacy compliance at Kapitech Agency, reach out to our privacy office at <a href="mailto:hello@kapitech.id" className="text-brand-red hover:underline">hello@kapitech.id</a>.
              </p>
            </section>
          </div>
        )}
      </div>
    </motion.div>
  );
};
