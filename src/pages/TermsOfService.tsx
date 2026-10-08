import React from 'react';
import { motion } from 'motion/react';
import { AtmosphericBackground } from '../components/ui/AtmosphericBackground';
import { useLanguage } from '../lib/LanguageContext';

type Section = { title: string; body?: string; bullets?: string[] };

const sections: Record<'en' | 'id', Section[]> = {
  en: [
    { title: '1. Acceptance and scope', body: 'These Terms of Service (“Terms”) govern your use of kapitech.id and the website-related services made available by PT Kapitech Digital Indonesia (“Kapitech”, “we”, “us”, or “our”). By accessing the website, requesting a service, or entering into an engagement that references these Terms, you agree to them. If a signed agreement, proposal, SOW, order form, or other written project contract contains terms that conflict with these general Terms, the project-specific agreement controls for that engagement.' },
    { title: '2. About Kapitech', body: 'Kapitech is a digital agency based in Indonesia providing services that may include web design and development, UI/UX and product design, branding and identity, visual design, motion and video, digital product development, e-commerce, integrations, and related digital services. Available services, deliverables, technologies, and commercial terms are defined by the applicable proposal or SOW rather than by this website alone.' },
    { title: '3. Website use', bullets: [
      'Use the website only for lawful purposes and in a way that does not interfere with its operation or security.',
      'Do not attempt to gain unauthorised access to systems, accounts, source code, infrastructure, private endpoints, or non-public content.',
      'Do not introduce malware, exploit code, automated abuse, excessive traffic, or other activity that could damage or disrupt the website.',
      'Do not use the website to impersonate another person, misrepresent an affiliation, or submit information you do not have the right to provide.',
      'We may restrict access or take technical measures where reasonably necessary to protect the website, users, clients, or infrastructure.'
    ]},
    { title: '4. Proposals, scope, and project formation', body: 'A project normally begins with discovery and a written proposal, quotation, SOW, order form, or contract. That document may define objectives, deliverables, assumptions, milestones, review rounds, responsibilities, technologies, dependencies, fees, taxes, payment schedules, and acceptance criteria. A website page, portfolio item, estimate, article, or general statement about a service does not by itself create a contractual commitment to deliver a particular feature or result.' },
    { title: '5. Estimates and changes', bullets: [
      'Pre-contract estimates are indicative unless expressly stated as fixed in a written agreement.',
      'Material changes to scope, requirements, content, integrations, approvals, or dependencies may require a change request or revised commercial terms.',
      'Out-of-scope work is not automatically included because it is technically related to the original project.',
      'Kapitech may identify assumptions or dependencies that require client action before delivery can proceed.'
    ]},
    { title: '6. Client responsibilities', bullets: [
      'Provide accurate information, timely feedback, approvals, assets, content, credentials, access, and technical requirements reasonably needed for delivery.',
      'Ensure that materials supplied to Kapitech may lawfully be used, modified, processed, and incorporated into the project.',
      'Nominate an authorised contact for feedback and approvals where the SOW requires it.',
      'Make payments according to the agreed schedule.',
      'Review deliverables within the agreed review window and communicate material issues clearly.'
    ]},
    { title: '7. Timelines, dependencies, and delays', body: 'Project dates depend on the assumptions and dependencies stated in the SOW. Client delays, missing content, unavailable approvals, third-party outages, changed requirements, delayed access, or other external dependencies may change the delivery schedule. Kapitech will make reasonable efforts to communicate material risks and dependencies as they become known.' },
    { title: '8. Fees, invoices, taxes, and late payment', bullets: [
      'Fees, taxes, billing milestones, payment methods, deposits, and currency are defined in the applicable proposal, SOW, or invoice.',
      'Unless the project agreement states otherwise, third-party costs such as domains, hosting, paid plugins, licences, stock assets, API usage, or external platform fees may be charged separately.',
      'Client payment obligations are not cancelled by a later change in internal priorities, unless the applicable contract expressly provides otherwise.',
      'Where an invoice is overdue, Kapitech may pause work after reasonable notice and may apply any contractual late-payment consequences stated in the agreement.'
    ]},
    { title: '9. Review, approval, and acceptance', body: 'Deliverables may be subject to defined review rounds and acceptance criteria. A deliverable is not rejected merely because the client later changes direction. Material non-conformance should be raised against the agreed requirements, acceptance criteria, or approved design, rather than against a new requirement introduced after approval.' },
    { title: '10. Intellectual property', body: 'Ownership and licence rights are determined by the applicable written agreement. Unless that agreement states otherwise, client-specific deliverables are transferred or licensed according to the agreed commercial terms after the relevant payment obligations are satisfied. Pre-existing Kapitech materials, reusable components, frameworks, methods, templates, know-how, utilities, and general-purpose tools remain Kapitech property unless expressly assigned. Third-party and open-source components remain subject to their own licences.' },
    { title: '11. Client materials and third-party rights', body: 'The client remains responsible for materials, trademarks, content, data, software, imagery, fonts, credentials, and other assets it supplies or instructs Kapitech to use. The client authorises Kapitech to use those materials for the project. The client must have the necessary rights, licences, consents, and permissions. Kapitech may request replacement or removal of materials that present a legal, security, or rights concern.' },
    { title: '12. Open-source and third-party technology', body: 'Digital projects may rely on open-source libraries, frameworks, APIs, hosting providers, payment services, CMS platforms, analytics systems, fonts, plugins, or other third-party technology. Such components are governed by their own terms and licences. Kapitech will not grant rights it does not own, and a client’s rights in custom deliverables do not override third-party licence conditions.' },
    { title: '13. Confidentiality', body: 'Confidential information may be protected by an NDA or confidentiality clause. Unless agreed otherwise, each party should use the other party’s confidential information only for the relevant engagement and should take reasonable measures to prevent unauthorised disclosure. Confidentiality obligations do not normally apply to information that is public without breach, already lawfully known, independently developed, or required to be disclosed by law, subject to applicable exceptions.' },
    { title: '14. Security and personal data', body: 'Each party is responsible for the security measures appropriate to the systems and data it controls. Where Kapitech processes Personal Data as part of a client project, applicable privacy, security, confidentiality, and data-processing terms may be documented separately. The website itself is also governed by Kapitech’s Privacy Policy and Cookie Policy.' },
    { title: '15. Third-party services and availability', body: 'Projects may depend on third-party providers, including hosting, cloud platforms, payment gateways, APIs, app stores, CMS vendors, domain registrars, communication providers, analytics platforms, and other services. Kapitech does not control third-party availability or policy changes. Unless a project agreement expressly states otherwise, third-party outages, changes, pricing, rate limits, or deprecations are outside Kapitech’s direct control.' },
    { title: '16. Warranty and post-launch support', body: 'Any warranty period, bug-fix window, maintenance package, SLA, support response time, monitoring, security updates, or post-launch service is defined by the applicable SOW or service agreement. The existence of a warranty or support package should not be inferred from this website. Unless expressly agreed, a request for a new feature, new page, material design change, or new integration is not treated as a defect.' },
    { title: '17. No guarantee of business results', body: 'Kapitech provides professional design, engineering, and digital services, but we do not guarantee particular revenue, rankings, lead volume, conversion rates, market adoption, investment outcomes, or other business results unless a specific written agreement expressly guarantees a measurable result. Outcomes depend on many factors outside our control, including market conditions, client execution, content, traffic quality, pricing, product-market fit, and third-party platforms.' },
    { title: '18. Portfolio and public use of completed work', body: 'Kapitech may wish to reference completed work in its portfolio, case studies, presentations, or marketing materials. Client-specific publicity rights should follow the applicable SOW, NDA, or written approval. Kapitech will not intentionally disclose confidential client information where doing so would conflict with an applicable confidentiality obligation.' },
    { title: '19. Suspension and termination', body: 'A project may be paused or terminated according to the applicable contract. Reasons may include material breach, non-payment, extended client inactivity, security concerns, unlawful requests, or other grounds stated in the agreement. On termination, the parties’ rights concerning payment, work product, confidentiality, Personal Data, licences, and other accrued obligations are governed by the applicable contract and any provisions that by their nature should survive termination.' },
    { title: '20. Limitation of liability', body: 'To the maximum extent permitted by applicable law and subject to mandatory legal rights, Kapitech is not responsible for indirect, incidental, special, consequential, or punitive losses, or for loss of profits, business opportunities, goodwill, or data, arising from website use or an engagement unless the applicable written agreement states otherwise. Any contractual liability cap should be defined in the applicable agreement; where no cap is stated, liability will be limited to the extent permitted by applicable law.' },
    { title: '21. Indemnity', body: 'Where permitted by applicable law and subject to the applicable agreement, each party is responsible for claims arising from its own unlawful conduct, breach of contract, or infringement caused by materials or instructions it supplied. Client-specific indemnity obligations, if any, should be documented in the relevant SOW or contract.' },
    { title: '22. Force majeure', body: 'Neither party is responsible for failure or delay caused by circumstances beyond its reasonable control, which may include natural disasters, widespread outages, war, civil unrest, government restrictions, major infrastructure failures, or significant failures of third-party services, provided the affected party takes reasonable steps to mitigate the impact and resumes performance when reasonably possible.' },
    { title: '23. Governing law and disputes', body: 'These general Terms are governed by the laws of the Republic of Indonesia, unless a project-specific written agreement states a different governing law. The parties should first attempt to resolve disputes through good-faith discussion. Any forum, jurisdiction, arbitration process, or escalation procedure for a client engagement should be determined by the applicable contract.' },
    { title: '24. Changes to these Terms', body: 'We may update these Terms for changes to the website, services, legal requirements, or business practices. The current version will be posted on this page with an updated effective date. A material change to an existing client contract does not take effect merely because this website is updated; the signed contract and its amendment process continue to govern that engagement.' },
    { title: '25. Contact', body: 'PT Kapitech Digital Indonesia\\nLinea Residence, Block G No. 5, Jl. Melati Loka, Paku Jaya, Serpong Utara, Kota Tangerang Selatan, Banten 15220, Indonesia\\nEmail: hello@kapitech.id\\nPhone / WhatsApp: +62 877-6995-7062' }
  ],
  id: [
    { title: '1. Penerimaan dan ruang lingkup', body: 'Syarat Layanan (“Syarat”) ini mengatur penggunaan kapitech.id dan layanan terkait website yang disediakan PT Kapitech Digital Indonesia (“Kapitech”, “kami”). Dengan mengakses website, meminta layanan, atau masuk ke dalam engagement yang merujuk pada Syarat ini, Anda menyetujuinya. Jika proposal, SOW, order form, atau kontrak proyek yang ditandatangani memiliki ketentuan yang berbeda, ketentuan proyek tersebut berlaku untuk engagement terkait.' },
    { title: '2. Tentang Kapitech', body: 'Kapitech adalah digital agency di Indonesia yang dapat menyediakan layanan pengembangan website dan software, UI/UX dan product design, branding dan identity, visual design, motion dan video, digital product development, e-commerce, integrasi, serta layanan digital terkait. Layanan, deliverables, teknologi, dan ketentuan komersial ditentukan melalui proposal atau SOW yang berlaku, bukan hanya berdasarkan isi website.' },
    { title: '3. Penggunaan website', bullets: [
      'Gunakan website hanya untuk tujuan yang sah dan tidak mengganggu operasi atau keamanan website.',
      'Jangan mencoba memperoleh akses tidak sah ke sistem, akun, source code, infrastruktur, endpoint privat, atau konten nonpublik.',
      'Jangan memasukkan malware, exploit, traffic berlebihan, atau aktivitas lain yang dapat merusak atau mengganggu website.',
      'Jangan menggunakan website untuk menyamar sebagai pihak lain, memalsukan afiliasi, atau mengirimkan informasi yang tidak berhak Anda berikan.',
      'Kapitech dapat membatasi akses atau menerapkan langkah teknis jika diperlukan untuk melindungi website, pengguna, klien, atau infrastruktur.'
    ]},
    { title: '4. Proposal, scope, dan pembentukan proyek', body: 'Proyek umumnya dimulai melalui discovery dan proposal, quotation, SOW, order form, atau kontrak tertulis. Dokumen tersebut dapat mengatur tujuan, deliverables, asumsi, milestone, jumlah revisi, tanggung jawab, teknologi, dependensi, biaya, jadwal pembayaran, dan acceptance criteria. Halaman website, portfolio, artikel, estimasi, atau pernyataan umum tentang suatu layanan tidak dengan sendirinya menciptakan kewajiban kontraktual atas feature atau hasil tertentu.' },
    { title: '5. Estimasi dan perubahan', bullets: [
      'Estimasi sebelum kontrak bersifat indikatif kecuali dinyatakan sebagai harga tetap dalam perjanjian tertulis.',
      'Perubahan material pada scope, kebutuhan, konten, integrasi, approval, atau dependensi dapat memerlukan change request atau perubahan komersial.',
      'Pekerjaan di luar scope tidak otomatis termasuk hanya karena masih berhubungan secara teknis dengan proyek awal.',
      'Kapitech dapat meminta klarifikasi atau tindakan klien atas asumsi dan dependensi sebelum delivery dilanjutkan.'
    ]},
    { title: '6. Tanggung jawab klien', bullets: [
      'Memberikan informasi, feedback, approval, aset, konten, akses, credential, dan kebutuhan teknis yang akurat dan tepat waktu.',
      'Memastikan bahwa material yang diberikan dapat digunakan secara sah untuk proyek.',
      'Menunjuk pihak yang berwenang untuk memberi feedback dan approval jika dipersyaratkan.',
      'Membayar sesuai jadwal yang disepakati.',
      'Memeriksa deliverables dalam periode review yang disepakati dan melaporkan masalah material dengan jelas.'
    ]},
    { title: '7. Jadwal, dependensi, dan keterlambatan', body: 'Tanggal proyek bergantung pada asumsi dan dependensi dalam SOW. Keterlambatan konten, approval, akses, perubahan requirement, downtime pihak ketiga, atau dependensi eksternal lain dapat memengaruhi jadwal. Kapitech akan berupaya memberi informasi mengenai risiko dan dependensi material setelah diketahui.' },
    { title: '8. Biaya, invoice, pajak, dan keterlambatan pembayaran', bullets: [
      'Fee, pajak, milestone pembayaran, metode pembayaran, uang muka, dan mata uang ditentukan dalam proposal, SOW, atau invoice.',
      'Biaya pihak ketiga seperti domain, hosting, plugin, lisensi, stock asset, API usage, atau platform eksternal dapat dibebankan terpisah jika tidak termasuk dalam scope.',
      'Kewajiban pembayaran tidak otomatis gugur hanya karena prioritas bisnis klien berubah, kecuali kontrak mengaturnya.',
      'Untuk invoice yang jatuh tempo, Kapitech dapat menunda pekerjaan setelah pemberitahuan yang wajar dan menerapkan konsekuensi yang tercantum dalam perjanjian.'
    ]},
    { title: '9. Review, approval, dan acceptance', body: 'Deliverables dapat tunduk pada jumlah revisi dan acceptance criteria tertentu. Deliverable tidak dianggap gagal hanya karena klien kemudian mengubah arah atau kebutuhan. Ketidaksesuaian material sebaiknya dinilai berdasarkan requirement, acceptance criteria, atau desain yang telah disetujui, bukan kebutuhan baru setelah approval.' },
    { title: '10. Hak kekayaan intelektual', body: 'Hak kepemilikan dan lisensi ditentukan oleh perjanjian tertulis yang berlaku. Kecuali diatur lain, hak atas deliverables yang dibuat khusus untuk klien dialihkan atau dilisensikan sesuai ketentuan komersial setelah kewajiban pembayaran terkait dipenuhi. Material milik Kapitech yang telah ada sebelumnya, komponen reusable, framework, metode, template, know-how, utility, dan tools umum tetap menjadi milik Kapitech kecuali secara tegas dialihkan. Komponen open-source dan pihak ketiga tetap tunduk pada lisensinya.' },
    { title: '11. Material klien dan hak pihak ketiga', body: 'Klien bertanggung jawab atas konten, merek, data, software, gambar, font, credential, dan aset lain yang diberikan atau diminta untuk digunakan. Klien memberikan kewenangan kepada Kapitech untuk menggunakan material tersebut selama proyek. Klien harus memiliki hak, lisensi, izin, dan persetujuan yang diperlukan. Kapitech dapat meminta material diganti atau dihapus jika menimbulkan risiko hukum atau keamanan.' },
    { title: '12. Open-source dan teknologi pihak ketiga', body: 'Proyek dapat menggunakan open-source library, framework, API, hosting, payment service, CMS, analytics, font, plugin, atau teknologi pihak ketiga lainnya. Komponen tersebut tunduk pada syarat dan lisensi masing-masing. Kapitech tidak memberikan hak yang tidak dimilikinya dan kepemilikan atas deliverables kustom tidak menghapus kewajiban lisensi pihak ketiga.' },
    { title: '13. Kerahasiaan', body: 'Informasi rahasia dapat dilindungi oleh NDA atau klausul kerahasiaan. Kecuali disepakati lain, masing-masing pihak menggunakan informasi rahasia hanya untuk engagement terkait dan mengambil langkah wajar untuk mencegah pengungkapan yang tidak sah. Kewajiban tersebut umumnya tidak berlaku untuk informasi yang telah publik tanpa pelanggaran, telah diketahui secara sah, dikembangkan secara independen, atau wajib diungkapkan berdasarkan hukum, sepanjang pengecualian tersebut berlaku.' },
    { title: '14. Keamanan dan Data Pribadi', body: 'Masing-masing pihak bertanggung jawab atas pengamanan sistem dan data yang berada di bawah kendalinya. Jika Kapitech memproses Data Pribadi dalam proyek klien, ketentuan privasi, keamanan, kerahasiaan, dan pemrosesan data dapat diatur secara terpisah. Website publik Kapitech juga tunduk pada Kebijakan Privasi dan Kebijakan Cookie.' },
    { title: '15. Layanan pihak ketiga dan ketersediaan', body: 'Proyek dapat bergantung pada provider pihak ketiga seperti hosting, cloud, payment gateway, API, app store, CMS, registrar domain, provider komunikasi, analytics, dan layanan lainnya. Kapitech tidak mengontrol ketersediaan atau perubahan kebijakan mereka. Kecuali dinyatakan lain dalam kontrak, downtime, perubahan harga, rate limit, atau perubahan layanan pihak ketiga berada di luar kendali langsung Kapitech.' },
    { title: '16. Garansi dan dukungan pasca-launch', body: 'Periode garansi, bug-fix window, paket maintenance, SLA, response time, monitoring, security update, atau dukungan pasca-launch ditentukan oleh SOW atau perjanjian layanan yang berlaku. Website ini tidak dengan sendirinya memberikan garansi 30 hari atau SLA tertentu. Permintaan feature baru, halaman baru, perubahan desain material, atau integrasi baru tidak otomatis dianggap sebagai bug.' },
    { title: '17. Tidak ada jaminan hasil bisnis tertentu', body: 'Kapitech menyediakan layanan desain, engineering, dan digital secara profesional, tetapi tidak menjamin revenue, ranking, jumlah lead, conversion rate, market adoption, investment outcome, atau hasil bisnis tertentu kecuali dijamin secara tertulis dalam kontrak. Hasil dipengaruhi banyak faktor di luar kendali kami, termasuk pasar, eksekusi klien, kualitas konten, traffic, pricing, product-market fit, dan platform pihak ketiga.' },
    { title: '18. Portfolio dan publikasi pekerjaan', body: 'Kapitech dapat ingin menampilkan pekerjaan yang telah selesai dalam portfolio, case study, presentasi, atau materi pemasaran. Hak publikasi mengikuti SOW, NDA, atau persetujuan tertulis yang berlaku. Kapitech tidak bermaksud mengungkap informasi rahasia klien jika hal tersebut bertentangan dengan kewajiban kerahasiaan.' },
    { title: '19. Penangguhan dan penghentian', body: 'Proyek dapat ditunda atau dihentikan sesuai kontrak. Alasan dapat mencakup pelanggaran material, non-payment, inaktivitas klien yang berkepanjangan, risiko keamanan, permintaan yang melanggar hukum, atau alasan lain dalam perjanjian. Setelah penghentian, hak terkait pembayaran, deliverables, kerahasiaan, data, lisensi, dan kewajiban yang masih berlaku mengikuti kontrak yang bersangkutan.' },
    { title: '20. Batasan tanggung jawab', body: 'Sejauh diizinkan hukum dan dengan tetap menghormati hak hukum yang wajib berlaku, Kapitech tidak bertanggung jawab atas kerugian tidak langsung, insidental, khusus, konsekuensial, atau punitive, termasuk kehilangan laba, peluang bisnis, goodwill, atau data yang timbul dari penggunaan website atau engagement kecuali kontrak mengatur lain. Batas tanggung jawab kontraktual, jika ada, sebaiknya ditetapkan dalam perjanjian proyek.' },
    { title: '21. Ganti rugi', body: 'Sejauh diperbolehkan hukum dan kontrak, masing-masing pihak bertanggung jawab atas klaim yang timbul dari tindakan melawan hukum, pelanggaran kontrak, atau pelanggaran hak yang disebabkan oleh material atau instruksi yang diberikannya. Kewajiban indemnity khusus, jika ada, mengikuti perjanjian proyek.' },
    { title: '22. Keadaan kahar', body: 'Masing-masing pihak tidak bertanggung jawab atas keterlambatan atau kegagalan akibat keadaan di luar kendali wajar, termasuk bencana, perang, kerusuhan, pembatasan pemerintah, gangguan infrastruktur besar, atau kegagalan provider pihak ketiga yang signifikan, sepanjang pihak yang terdampak mengambil langkah wajar untuk mengurangi dampaknya dan kembali menjalankan kewajiban ketika memungkinkan.' },
    { title: '23. Hukum dan penyelesaian sengketa', body: 'Syarat umum ini tunduk pada hukum Republik Indonesia, kecuali kontrak proyek menentukan hukum lain. Para pihak sebaiknya terlebih dahulu mencoba menyelesaikan sengketa melalui pembicaraan dengan itikad baik. Jurisdiksi, arbitrase, forum, atau tahapan eskalasi untuk engagement tertentu mengikuti kontrak yang berlaku.' },
    { title: '24. Perubahan Syarat', body: 'Kami dapat memperbarui Syarat untuk perubahan website, layanan, hukum, atau praktik bisnis. Versi terbaru akan dipublikasikan di halaman ini dengan tanggal berlaku yang baru. Pembaruan halaman ini tidak dengan sendirinya mengubah kontrak proyek yang sudah ditandatangani; perubahan kontrak harus mengikuti mekanisme perubahan yang disepakati.' },
    { title: '25. Kontak', body: 'PT Kapitech Digital Indonesia\\nLinea Residence, Blok G No. 5, Jl. Melati Loka, Paku Jaya, Serpong Utara, Kota Tangerang Selatan, Banten 15220, Indonesia\\nEmail: hello@kapitech.id\\nTelepon / WhatsApp: +62 877-6995-7062' }
  ]
};

export const TermsOfService = () => {
  const { language } = useLanguage();
  const current = sections[language];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="kapi-policy-page min-h-screen pt-28 sm:pt-36 md:pt-40 pb-16 sm:pb-20 px-4 sm:px-6 md:px-12 bg-[#0B0C0E] text-[#8A909D] font-light relative selection:bg-brand-red selection:text-white">
      <AtmosphericBackground imageUrl="/hero_background_3d.png" opacity={0.05} disableGrayscale={true} />
      <div className="max-w-4xl mx-auto relative z-10">
        <span className="kapi-section-label mb-5">{language === 'id' ? 'Syarat Layanan & Engagement' : 'Service Terms & Engagement'}</span>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white mb-4 tracking-tighter">{language === 'id' ? 'Syarat Layanan.' : 'Terms of Service.'}</h1>
        <p className="text-xs sm:text-sm uppercase tracking-widest text-brand-red font-mono font-semibold mb-12">{language === 'id' ? 'Berlaku sejak: 8 Oktober 2026' : 'Effective: October 8, 2026'}</p>
        <div className="mb-12 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 text-sm leading-7 text-[#9AA1AD]">
          {language === 'id'
            ? 'Syarat ini bersifat umum. Untuk proyek tertentu, proposal, SOW, order form, NDA, dan kontrak tertulis dapat menetapkan ketentuan yang lebih spesifik dan mengesampingkan ketentuan umum sejauh diperbolehkan.'
            : 'These Terms are general terms. For a specific project, a proposal, SOW, order form, NDA, or signed contract may contain more specific terms and will control that engagement to the extent permitted.'}
        </div>
        <div className="space-y-12 text-base md:text-lg leading-relaxed text-[#8A909D]">
          {current.map((section) => (
            <section key={section.title} className="scroll-mt-32">
              <h2 className="text-2xl font-display font-bold text-white mb-4">{section.title}</h2>
              {section.body && <p className="whitespace-pre-line">{section.body}</p>}
              {section.bullets && <ul className="mt-4 list-disc pl-6 space-y-2">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
            </section>
          ))}
        </div>
        <p className="mt-14 text-xs leading-6 text-[#626B78]">
          {language === 'id'
            ? 'Catatan: Syarat ini adalah syarat umum website dan bukan nasihat hukum. Kontrak proyek yang ditandatangani tetap menjadi referensi utama untuk kewajiban komersial dan delivery.'
            : 'Note: these are general website terms and not legal advice. A signed project agreement remains the primary source for commercial and delivery obligations.'}
        </p>
      </div>
    </motion.div>
  );
};
