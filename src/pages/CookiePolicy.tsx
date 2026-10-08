import React from 'react';
import { motion } from 'motion/react';
import { AtmosphericBackground } from '../components/ui/AtmosphericBackground';
import { useLanguage } from '../lib/LanguageContext';

type Section = { title: string; body?: string; bullets?: string[] };

const en: Section[] = [
  { title: '1. What this Cookie Policy covers', body: 'This Cookie Policy explains how PT Kapitech Digital Indonesia (“Kapitech”, “we”, “us”, or “our”) uses cookies, local browser storage, and similar technologies on kapitech.id. It should be read together with our Privacy Policy. Some technologies used by the site are technically not cookies but perform a similar storage or tracking function, so this policy covers them as well.' },
  { title: '2. What cookies and browser storage are', body: 'Cookies are small pieces of information stored by a website in your browser. Local storage is a browser storage mechanism that can retain small values without using a cookie. These mechanisms can support essential website functions, remember preferences, manage consent, or, when authorised, support analytics and attribution.' },
  { title: '3. Categories used by Kapitech', bullets: [
    'Essential storage: information required to operate basic website functionality and maintain consent choices.',
    'Functional preference storage: information used to remember choices such as your selected site language.',
    'Optional analytics storage: information used after consent to measure page views, interactions, performance, and aggregate website usage.',
    'Optional attribution storage: information used after consent to remember campaign and referral context, where configured.'
  ]},
  { title: '4. Essential and functional storage', body: 'The website may use local storage such as “kapitech_cookie_consent” to remember whether you selected accepted or necessary cookies, and “kapitech_lang” to remember your language preference. Consent management storage is necessary to remember your privacy choice. Restricting browser storage may cause preferences to reset or parts of the site to behave differently after refresh.' },
  { title: '5. Optional analytics and attribution', body: 'Kapitech’s public website is designed so that optional analytics is not activated until the site has recorded an “accepted” consent choice. When enabled and configured, the analytics layer may use Google Analytics 4 and/or Google Tag Manager and may process page views, interaction events, page paths, language, campaign parameters, referral host information, and other aggregate analytics data. The exact technologies depend on the environment and current configuration.' },
  { title: '6. Attribution and anonymous identifiers', body: 'After optional analytics consent, the site may store attribution information and an anonymous identifier so that first-touch or last-touch campaign context can be associated with analytics events. Current site-managed storage keys include “kapitech_attribution_v1” and “kapitech_anonymous_id_v1”. These values are intended for analytics and attribution rather than for storing directly entered contact-form content.' },
  { title: '7. Third-party analytics providers', body: 'Where Google Analytics 4 or Google Tag Manager is configured, Google may place or access cookies or related identifiers according to the service configuration and Google’s own policies. The exact cookie names, lifetimes, processing locations, and purposes can change based on provider configuration. You should also review the provider’s current privacy documentation.' },
  { title: '8. Consent choices', body: 'The cookie banner provides an “Accept all” choice and a “Only necessary” choice. Selecting “Only necessary” disables optional analytics consent. Selecting “Accept all” allows the configured optional analytics and attribution layer to initialise. The site stores your choice locally so the banner does not repeatedly ask on every page load.' },
  { title: '9. Withdrawing consent', body: 'You can withdraw optional analytics consent at any time through the “Manage cookie preferences” control available on this page and, where applicable, other site controls. When optional consent is revoked, the website removes its managed attribution and anonymous analytics storage, clears applicable analytics cookies that it can directly clear, and sends an analytics consent update indicating that optional storage is denied. Provider-side data already collected before withdrawal may be retained or processed according to the provider’s policies and applicable law.' },
  { title: '10. Browser controls', body: 'Most browsers allow you to block, delete, or control cookies and local storage. Browser-level blocking can affect essential functionality and can cause language or consent preferences to reset. Browser controls operate separately from Kapitech’s own consent mechanism.' },
  { title: '11. Do Not Track and similar signals', body: 'Browser-level privacy signals may vary in availability, meaning, and support. Kapitech’s primary control for optional website analytics is the consent mechanism described above. We do not treat an unsupported browser signal as consent to optional tracking.' },
  { title: '12. Retention', body: 'Kapitech-managed consent and attribution storage is retained only as long as needed for the relevant preference, analytics, or attribution purpose, subject to technical behaviour and any required clean-up process. Third-party provider retention is governed by the relevant provider’s configuration and policies.' },
  { title: '13. No selling of Personal Data', body: 'Kapitech does not use cookies as a mechanism to sell your Personal Data. Optional analytics is intended to understand website usage and campaign performance, not to create a commercial data-broker profile. See our Privacy Policy for broader information about Personal Data processing.' },
  { title: '14. Changes to this Cookie Policy', body: 'We may update this policy when our website, analytics configuration, vendors, technology, or legal requirements change. The latest version will be posted here with an updated date.' },
  { title: '15. Contact', body: 'For questions about cookies, consent, browser storage, or privacy at Kapitech, contact hello@kapitech.id.\\nPT Kapitech Digital Indonesia\\nLinea Residence, Block G No. 5, Jl. Melati Loka, Paku Jaya, Serpong Utara, Kota Tangerang Selatan, Banten 15220, Indonesia' }
];

const id: Section[] = [
  { title: '1. Cakupan Kebijakan Cookie', body: 'Kebijakan Cookie ini menjelaskan bagaimana PT Kapitech Digital Indonesia (“Kapitech”, “kami”) menggunakan cookie, local browser storage, dan teknologi serupa di kapitech.id. Kebijakan ini harus dibaca bersama Privacy Policy. Sebagian teknologi secara teknis bukan cookie tetapi memiliki fungsi penyimpanan atau tracking yang serupa, sehingga ikut dijelaskan di sini.' },
  { title: '2. Apa itu cookie dan browser storage', body: 'Cookie adalah data kecil yang disimpan browser ketika website digunakan. Local storage adalah mekanisme penyimpanan browser yang dapat menyimpan nilai tertentu tanpa memakai cookie. Keduanya dapat digunakan untuk fungsi esensial, menyimpan preferensi, mengelola consent, atau setelah izin diberikan mendukung analytics dan attribution.' },
  { title: '3. Kategori yang digunakan Kapitech', bullets: [
    'Penyimpanan esensial: diperlukan untuk fungsi dasar website dan menyimpan pilihan consent.',
    'Penyimpanan preferensi: digunakan untuk mengingat pilihan seperti bahasa website.',
    'Penyimpanan analitik opsional: digunakan setelah consent untuk mengukur page view, interaksi, performa, dan penggunaan website secara agregat.',
    'Penyimpanan attribution opsional: digunakan setelah consent untuk menyimpan konteks campaign dan referral jika konfigurasi tersebut aktif.'
  ]},
  { title: '4. Penyimpanan esensial dan preferensi', body: 'Website dapat menggunakan local storage seperti “kapitech_cookie_consent” untuk menyimpan pilihan accepted atau necessary, serta “kapitech_lang” untuk mengingat bahasa pilihan. Penyimpanan consent diperlukan agar website menghormati pilihan privasi Anda. Jika browser storage dibatasi, preferensi dapat kembali ke kondisi awal setelah refresh atau fungsi tertentu dapat berperilaku berbeda.' },
  { title: '5. Analytics dan attribution opsional', body: 'Website publik Kapitech dirancang agar analytics opsional tidak diaktifkan sebelum website menerima pilihan consent “accepted”. Jika aktif dan dikonfigurasi, analytics dapat menggunakan Google Analytics 4 dan/atau Google Tag Manager serta memproses page view, interaction event, page path, bahasa, parameter campaign, referral host, dan data penggunaan agregat. Teknologi yang digunakan dapat berubah sesuai konfigurasi dan lingkungan website.' },
  { title: '6. Attribution dan anonymous identifier', body: 'Setelah consent analytics diberikan, website dapat menyimpan data attribution dan anonymous identifier agar konteks first-touch atau last-touch campaign dapat dikaitkan dengan event analytics. Storage yang dikelola website saat ini dapat menggunakan key “kapitech_attribution_v1” dan “kapitech_anonymous_id_v1”. Data ini ditujukan untuk analytics dan attribution, bukan untuk menyimpan isi langsung dari formulir kontak.' },
  { title: '7. Provider analytics pihak ketiga', body: 'Jika Google Analytics 4 atau Google Tag Manager dikonfigurasi, Google dapat menempatkan atau mengakses cookie atau identifier sesuai konfigurasi layanan dan kebijakan Google. Nama cookie, masa simpan, lokasi pemrosesan, dan tujuan dapat berubah mengikuti konfigurasi. Anda sebaiknya juga membaca dokumentasi privasi provider yang terbaru.' },
  { title: '8. Pilihan consent', body: 'Banner cookie menyediakan pilihan “Accept all” dan “Only necessary”. “Only necessary” menonaktifkan consent analytics opsional. “Accept all” mengizinkan layer analytics dan attribution yang dikonfigurasi untuk diinisialisasi. Pilihan Anda disimpan secara lokal agar banner tidak meminta pilihan yang sama pada setiap halaman.' },
  { title: '9. Menarik consent', body: 'Anda dapat menarik consent analytics opsional kapan saja melalui kontrol “Kelola preferensi cookie” di halaman ini atau kontrol yang tersedia di website. Saat consent ditarik, website menghapus storage attribution dan anonymous analytics yang dikelolanya, berupaya menghapus cookie analytics yang dapat dihapus langsung, dan mengirimkan pembaruan consent yang menandakan optional storage ditolak. Data yang sudah telanjur diproses oleh provider sebelum withdrawal dapat tetap disimpan atau diproses sesuai kebijakan provider dan hukum yang berlaku.' },
  { title: '10. Pengaturan browser', body: 'Sebagian besar browser memungkinkan Anda memblokir, menghapus, atau mengontrol cookie dan local storage. Pemblokiran dapat memengaruhi fungsi esensial serta membuat preferensi bahasa atau consent direset. Kontrol browser bekerja terpisah dari mekanisme consent Kapitech.' },
  { title: '11. Do Not Track dan sinyal serupa', body: 'Privacy signal dari browser dapat berbeda dalam ketersediaan, arti, dan dukungannya. Kontrol utama Kapitech untuk analytics opsional adalah mekanisme consent yang dijelaskan di atas. Kami tidak menganggap sinyal browser yang tidak didukung sebagai consent untuk tracking opsional.' },
  { title: '12. Masa penyimpanan', body: 'Storage consent dan attribution yang dikelola Kapitech disimpan selama diperlukan untuk tujuan preferensi, analytics, atau attribution, dengan tetap mempertimbangkan perilaku teknis dan proses clean-up yang berlaku. Retensi oleh provider pihak ketiga mengikuti konfigurasi dan kebijakan provider terkait.' },
  { title: '13. Tidak menjual Data Pribadi', body: 'Kapitech tidak menggunakan cookie sebagai sarana untuk menjual Data Pribadi. Analytics opsional ditujukan untuk memahami penggunaan website dan performa campaign, bukan untuk membuat profil data-broker komersial. Lihat Privacy Policy untuk penjelasan pemrosesan Data Pribadi yang lebih luas.' },
  { title: '14. Perubahan Kebijakan Cookie', body: 'Kami dapat memperbarui kebijakan ini ketika website, konfigurasi analytics, vendor, teknologi, atau kebutuhan hukum berubah. Versi terbaru akan tersedia di halaman ini dengan tanggal pembaruan.' },
  { title: '15. Hubungi Kami', body: 'Untuk pertanyaan tentang cookie, consent, browser storage, atau privacy di Kapitech, hubungi hello@kapitech.id.\\nPT Kapitech Digital Indonesia\\nLinea Residence, Blok G No. 5, Jl. Melati Loka, Paku Jaya, Serpong Utara, Kota Tangerang Selatan, Banten 15220, Indonesia' }
];

export const CookiePolicy = () => {
  const { language } = useLanguage();
  const current = language === 'id' ? id : en;

  const openPreferences = () => window.dispatchEvent(new Event('kapitech_open_cookie_preferences'));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="kapi-policy-page min-h-screen pt-28 sm:pt-36 md:pt-40 pb-16 sm:pb-20 px-4 sm:px-6 md:px-12 bg-[#0B0C0E] text-[#8A909D] font-light relative selection:bg-brand-red selection:text-white">
      <AtmosphericBackground imageUrl="/hero_background_3d.png" opacity={0.05} disableGrayscale={true} />
      <div className="max-w-4xl mx-auto relative z-10">
        <span className="kapi-section-label mb-5">{language === 'id' ? 'Cookie & Browser Storage' : 'Cookies & Browser Storage'}</span>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white mb-4 tracking-tighter">{language === 'id' ? 'Kebijakan Cookie.' : 'Cookie Policy.'}</h1>
        <p className="text-xs sm:text-sm uppercase tracking-widest text-brand-red font-mono font-semibold mb-12">{language === 'id' ? 'Diperbarui: 8 Oktober 2026' : 'Updated: October 8, 2026'}</p>
        <div className="mb-8 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 text-sm leading-7 text-[#9AA1AD]">
          {language === 'id'
            ? 'Website membedakan penyimpanan yang diperlukan dari analytics opsional. Analytics tidak dijalankan sampai pilihan consent “Accept all” tercatat.'
            : 'The website distinguishes necessary storage from optional analytics. Optional analytics is not activated until an “Accept all” consent choice is recorded.'}
        </div>
        <button type="button" onClick={openPreferences}
          className="mb-12 inline-flex min-h-[42px] items-center justify-center rounded-full bg-brand-red px-5 text-[10px] font-semibold uppercase tracking-[0.09em] text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#FF1E27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60">
          {language === 'id' ? 'Kelola preferensi cookie' : 'Manage cookie preferences'}
        </button>
        <div className="space-y-12 text-[15px] md:text-base leading-[1.78] text-[#8A909D]">
          {current.map((section) => (
            <section key={section.title} className="scroll-mt-32">
              <h2 className="text-[clamp(21px,2.2vw,27px)] leading-[1.18] font-sans font-bold text-white mb-4 tracking-[-0.025em]">{section.title}</h2>
              {section.body && <p className="whitespace-pre-line">{section.body}</p>}
              {section.bullets && <ul className="mt-4 list-disc pl-6 space-y-2">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
            </section>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
