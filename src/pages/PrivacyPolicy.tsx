import React from 'react';
import { motion } from 'motion/react';
import { AtmosphericBackground } from '../components/ui/AtmosphericBackground';
import { useLanguage } from '../lib/LanguageContext';

type Section = {
  title: string;
  body?: string;
  bullets?: string[];
};

const sections: Record<'en' | 'id', Section[]> = {
  en: [
    {
      title: '1. Purpose and scope',
      body: 'This Privacy Policy explains how PT Kapitech Digital Indonesia (“Kapitech”, “we”, “us”, or “our”) collects, uses, discloses, stores, and protects Personal Data when you visit kapitech.id, submit a form, contact our team, apply for a role, subscribe to updates, or otherwise interact with our public website. It applies to the website and website-related interactions. Client projects, employee records, and services operated under a separate agreement may be governed by additional privacy, security, or data-processing terms in that agreement.'
    },
    {
      title: '2. Who controls your Personal Data',
      body: 'For Personal Data processed through this website for Kapitech’s own purposes, the data controller is PT Kapitech Digital Indonesia. Our current contact details are provided in the Contact section below. Where Kapitech processes personal data on behalf of a client as part of a separately contracted service, Kapitech may act as a processor or service provider according to the applicable agreement and the client’s instructions.'
    },
    {
      title: '3. Personal Data we may collect',
      body: 'The information collected depends on how you use the website and what you choose to submit. Depending on the interaction, it may include:',
      bullets: [
        'Identity and contact information, such as your name, business email address, phone or WhatsApp number, company, job title, and other contact details you provide.',
        'Project and commercial information, such as services of interest, budget range, project requirements, business objectives, timelines, and the contents of your enquiry.',
        'Recruitment information, such as position applied for, portfolio URL, CV/resume, cover letter, professional experience, skills, specialty, tools or stack, and related contact information.',
        'Vendor or freelance information, such as specialty, years of experience, rate or project cost information, tools, portfolio, CV/resume, and notes you submit.',
        'Newsletter or communications information, such as your email address and subscription or communication preferences.',
        'Technical and usage information that may be generated when you access the website, such as browser and device characteristics, IP address, timestamps, pages visited, referring host, and security or diagnostic information.',
        'Marketing attribution information, such as UTM parameters and similar campaign identifiers, only where the relevant analytics functionality is enabled in accordance with the Cookie Policy.',
        'Any other information you voluntarily provide in a message, attachment, consultation request, or other website interaction.'
      ]
    },
    {
      title: '4. How we receive Personal Data',
      bullets: [
        'Directly from you when you complete a contact, career, vendor, newsletter, or other form or communicate with us.',
        'Automatically or indirectly from your browser or device when the website processes essential technical information.',
        'From third-party services that support website operations, submissions, analytics, hosting, security, or communications, where those services process information on our behalf or according to your interaction with them.',
        'From public or professional information you choose to provide or make available, for example a portfolio or professional profile included in an application.'
      ]
    },
    {
      title: '5. Why we use Personal Data',
      body: 'We process Personal Data for specific and legitimate purposes, including:',
      bullets: [
        'Responding to enquiries, consultation requests, proposals, and business communications.',
        'Understanding project requirements and preparing scopes, estimates, schedules, or other pre-contract materials.',
        'Managing contracts, invoices, project administration, client communications, and related business records.',
        'Receiving and evaluating employment or freelance applications and communicating with candidates.',
        'Sending newsletters or requested business updates where you have subscribed or otherwise authorised the communication.',
        'Operating, securing, troubleshooting, monitoring, and improving the website and its infrastructure.',
        'Measuring optional website analytics and campaign attribution after the applicable consent has been provided.',
        'Protecting the rights, property, systems, users, clients, and personnel of Kapitech; detecting abuse, fraud, malicious activity, or security incidents.',
        'Meeting applicable legal, regulatory, accounting, tax, or dispute-resolution obligations.'
      ]
    },
    {
      title: '6. Legal bases for processing',
      body: 'We aim to process Personal Data only where a valid legal basis exists under applicable law. Depending on the context, this may include your valid consent, taking steps at your request before entering into a contract, performing a contract, complying with a legal obligation, protecting vital interests, carrying out a public-interest function where applicable, or pursuing a legitimate interest that is balanced against your rights and interests. Where processing depends on consent, you may withdraw that consent, subject to legal and operational limitations.'
    },
    {
      title: '7. Forms, submissions, and communications',
      body: 'When you submit information through the website, we use it to handle the specific request for which it was submitted. We do not treat a contact form as an automatic subscription to marketing communications. A newsletter or other recurring communication is sent only where you have subscribed or otherwise authorised it. We may retain correspondence and submission records so that we can respond, maintain business records, investigate disputes, and demonstrate how a request was handled.'
    },
    {
      title: '8. Recruitment and vendor applications',
      body: 'If you apply for a role or join our freelance/vendor pipeline, your information may be reviewed by authorised members of Kapitech’s recruitment, project, design, engineering, operations, or management teams, depending on the opportunity. We use application information to assess suitability, communicate with you, schedule interviews or follow-ups, and manage future opportunities where permitted. Do not submit sensitive Personal Data that is unnecessary for the application.'
    },
    {
      title: '9. Cookies, local storage, analytics, and attribution',
      body: 'Kapitech uses browser storage and cookies as described in our Cookie Policy. Essential storage may be required for functions such as language preferences and consent management. Optional analytics and attribution are enabled only after the corresponding consent is recorded. The analytics implementation may process aggregate page-view, interaction, and campaign-attribution information through configured providers such as Google Analytics 4 or Google Tag Manager. You can withdraw optional analytics consent through the cookie-preference controls described in the Cookie Policy.'
    },
    {
      title: '10. Service providers and disclosures',
      body: 'We may share or make Personal Data available to service providers that help us operate the website and business, such as hosting, database, file storage, form or CRM/inbox processing, security, analytics, communication, email, or other infrastructure providers. They should receive only the information reasonably required for the relevant service and are subject to contractual, technical, or organisational controls appropriate to the processing. We may also disclose information when required by law, legal process, court order, regulatory request, or when necessary to protect rights, safety, security, or the integrity of our systems.'
    },
    {
      title: '11. Client and project confidentiality',
      body: 'Personal Data and confidential business information received as part of a client engagement may be subject to additional confidentiality, NDA, security, or data-processing obligations. Those obligations may be stricter than the general website policy. Kapitech does not intentionally publish client confidential information through the public website unless it has an appropriate contractual basis, permission, or other lawful basis to do so.'
    },
    {
      title: '12. International processing and transfers',
      body: 'Some service providers used by Kapitech or its infrastructure may process information in countries outside Indonesia. Where Personal Data is transferred or made accessible across jurisdictions, we take reasonable steps to apply appropriate contractual, technical, and organisational safeguards and to comply with applicable requirements for international transfers. The exact location of processing may vary as vendors and infrastructure change.'
    },
    {
      title: '13. Data retention',
      body: 'We retain Personal Data only for as long as reasonably necessary for the purpose for which it was collected, for the duration of a relevant relationship or application process, to maintain legitimate business records, to comply with legal or accounting requirements, to resolve disputes, or to protect security and legal interests. Different categories may have different retention periods. When Personal Data is no longer required, we seek to delete, destroy, anonymise, or otherwise securely dispose of it, subject to lawful retention requirements.'
    },
    {
      title: '14. Data security',
      body: 'We use reasonable technical and organisational measures designed to protect Personal Data against unauthorised access, disclosure, alteration, misuse, loss, or destruction. Depending on the system and sensitivity of the information, controls may include encrypted transport, access controls, authentication, restricted privileges, secure file handling, logging, monitoring, backups, and other safeguards. No internet transmission or storage system can be guaranteed to be completely secure.'
    },
    {
      title: '15. Data incidents',
      body: 'If we become aware of a Personal Data incident that creates obligations to notify affected individuals or authorities, we will assess and respond according to applicable law, the nature of the incident, and the risks involved. We may communicate relevant information through the contact details available to us and take reasonable steps to contain, investigate, remediate, and prevent recurrence.'
    },
    {
      title: '16. Your rights',
      body: 'Subject to applicable law and its conditions or exceptions, you may have rights to obtain clear information about processing, access and receive a copy of your Personal Data, correct inaccurate or incomplete information, request deletion or destruction where permitted, withdraw consent where consent is the basis of processing, request termination or restriction of processing, object to certain automated decision-making or profiling, and exercise other rights recognised by applicable data-protection law. Requests may require reasonable identity verification.'
    },
    {
      title: '17. How to exercise your rights',
      body: 'Send a privacy or data-rights request to hello@kapitech.id. Please state the request clearly, identify the information or processing concerned, and provide enough information for us to locate the relevant record. We will handle requests within the time and conditions required by applicable law. If we cannot comply fully, we will explain the applicable limitation where permitted.'
    },
    {
      title: '18. Children',
      body: 'Our website and professional services are intended primarily for businesses, professionals, clients, candidates, and other adult users. We do not knowingly request unnecessary Personal Data from children. If you believe a child has provided Personal Data to us without an appropriate basis, contact us so that we can assess and take appropriate action.'
    },
    {
      title: '19. Third-party websites and services',
      body: 'Our website may contain links to third-party websites, platforms, social networks, or services. We do not control their privacy practices and this policy does not govern their processing. Review the relevant third party’s privacy and cookie information before submitting information to them.'
    },
    {
      title: '20. Changes to this Privacy Policy',
      body: 'We may update this Privacy Policy to reflect changes to our website, services, technology, vendors, legal requirements, or processing practices. The latest version will be posted on this page with an updated effective date. Where applicable, we will provide additional notice when a material change requires it.'
    },
    {
      title: '21. Contact',
      body: 'PT Kapitech Digital Indonesia\\nLinea Residence, Block G No. 5, Jl. Melati Loka, Paku Jaya, Serpong Utara, Kota Tangerang Selatan, Banten 15220, Indonesia\\nEmail: hello@kapitech.id\\nPhone / WhatsApp: +62 877-6995-7062'
    },
    {
      title: '22. Applicable framework',
      body: 'This policy is intended to operate consistently with applicable Indonesian data-protection and electronic-system requirements, including Law of the Republic of Indonesia No. 27 of 2022 on Personal Data Protection and Government Regulation No. 71 of 2019 on the Operation of Electronic Systems and Transactions, as applicable and as amended, supplemented, or replaced from time to time.'
    }
  ],
  id: [
    {
      title: '1. Tujuan dan ruang lingkup',
      body: 'Kebijakan Privasi ini menjelaskan bagaimana PT Kapitech Digital Indonesia (“Kapitech”, “kami”) mengumpulkan, menggunakan, mengungkapkan, menyimpan, dan melindungi Data Pribadi saat Anda mengunjungi kapitech.id, mengirim formulir, menghubungi tim kami, melamar pekerjaan, berlangganan informasi, atau berinteraksi dengan website. Kebijakan ini berlaku untuk website dan interaksi yang berkaitan dengan website. Proyek klien, data karyawan, dan layanan yang diatur dalam perjanjian terpisah dapat tunduk pada ketentuan privasi, keamanan, atau pemrosesan data tambahan dalam perjanjian tersebut.'
    },
    {
      title: '2. Pihak yang mengendalikan Data Pribadi',
      body: 'Untuk Data Pribadi yang diproses melalui website untuk kepentingan Kapitech sendiri, pengendali datanya adalah PT Kapitech Digital Indonesia. Kontak kami tercantum di bagian Hubungi Kami. Jika Kapitech memproses data pribadi atas nama klien dalam proyek yang memiliki perjanjian terpisah, Kapitech dapat bertindak sebagai prosesor atau penyedia layanan sesuai perjanjian dan instruksi klien.'
    },
    {
      title: '3. Data Pribadi yang dapat kami kumpulkan',
      body: 'Data yang diproses bergantung pada cara Anda menggunakan website dan informasi yang Anda pilih untuk kirimkan.',
      bullets: [
        'Identitas dan kontak, seperti nama, email bisnis, nomor telepon atau WhatsApp, perusahaan, jabatan, dan informasi kontak lain yang Anda berikan.',
        'Informasi proyek dan komersial, seperti layanan yang diminati, kisaran anggaran, kebutuhan proyek, tujuan bisnis, jadwal, dan isi pertanyaan atau permintaan Anda.',
        'Informasi rekrutmen, seperti posisi yang dilamar, URL portfolio, CV/resume, cover letter, pengalaman profesional, keahlian, spesialisasi, tools atau stack, dan informasi kontak.',
        'Informasi vendor atau freelance, seperti spesialisasi, pengalaman, rate atau estimasi biaya, tools, portfolio, CV/resume, dan catatan yang Anda kirimkan.',
        'Informasi newsletter atau komunikasi, seperti alamat email dan preferensi komunikasi.',
        'Informasi teknis dan penggunaan yang dapat dihasilkan saat Anda mengakses website, seperti karakteristik browser dan perangkat, alamat IP, waktu akses, halaman yang dikunjungi, host rujukan, serta informasi keamanan atau diagnostik.',
        'Informasi atribusi pemasaran seperti parameter UTM dan identifier kampanye serupa, hanya jika fungsi analitik terkait diaktifkan sesuai Kebijakan Cookie.',
        'Informasi lain yang Anda pilih untuk berikan melalui pesan, lampiran, permintaan konsultasi, atau interaksi website lainnya.'
      ]
    },
    {
      title: '4. Bagaimana kami memperoleh Data Pribadi',
      bullets: [
        'Langsung dari Anda ketika mengisi formulir kontak, karier, vendor, newsletter, atau formulir lainnya atau berkomunikasi dengan kami.',
        'Secara otomatis atau tidak langsung dari browser atau perangkat ketika website memproses informasi teknis yang diperlukan.',
        'Dari penyedia layanan yang mendukung operasional website, pengiriman formulir, analitik, hosting, keamanan, atau komunikasi, sepanjang pemrosesan tersebut relevan dengan layanan mereka atau interaksi Anda.',
        'Dari informasi profesional yang Anda pilih untuk berikan atau publikasikan, misalnya portfolio atau profil profesional dalam proses lamaran.'
      ]
    },
    {
      title: '5. Untuk apa Data Pribadi digunakan',
      body: 'Kami memproses Data Pribadi untuk tujuan yang spesifik dan sah, termasuk:',
      bullets: [
        'Menjawab pertanyaan, permintaan konsultasi, proposal, dan komunikasi bisnis.',
        'Memahami kebutuhan proyek dan menyiapkan scope, estimasi, jadwal, atau materi pra-kontrak.',
        'Mengelola kontrak, invoice, administrasi proyek, komunikasi klien, dan catatan bisnis terkait.',
        'Menerima dan mengevaluasi lamaran kerja atau freelance serta berkomunikasi dengan kandidat.',
        'Mengirim newsletter atau informasi bisnis yang diminta ketika Anda berlangganan atau memberi izin yang sesuai.',
        'Mengoperasikan, mengamankan, memecahkan masalah, memantau, dan meningkatkan website dan infrastrukturnya.',
        'Mengukur analitik website dan atribusi kampanye yang bersifat opsional setelah persetujuan terkait diberikan.',
        'Melindungi hak, properti, sistem, pengguna, klien, dan personel Kapitech serta mendeteksi penyalahgunaan, fraud, aktivitas berbahaya, atau insiden keamanan.',
        'Memenuhi kewajiban hukum, regulasi, akuntansi, perpajakan, atau penyelesaian sengketa yang berlaku.'
      ]
    },
    {
      title: '6. Dasar pemrosesan',
      body: 'Kami berupaya memastikan setiap pemrosesan Data Pribadi memiliki dasar pemrosesan yang sah sesuai hukum yang berlaku. Tergantung konteksnya, dasar tersebut dapat berupa persetujuan yang sah, kebutuhan untuk mengambil langkah sebelum kontrak, pelaksanaan kontrak, kewajiban hukum, perlindungan kepentingan vital, pelaksanaan tugas untuk kepentingan umum jika relevan, atau kepentingan sah yang telah diseimbangkan dengan hak dan kepentingan Anda. Jika pemrosesan bergantung pada persetujuan, persetujuan tersebut dapat ditarik sesuai ketentuan yang berlaku.'
    },
    {
      title: '7. Formulir, pengiriman data, dan komunikasi',
      body: 'Informasi yang Anda kirim melalui website digunakan untuk menangani permintaan yang menjadi tujuan pengiriman data tersebut. Pengisian formulir kontak tidak otomatis berarti Anda berlangganan pemasaran. Newsletter atau komunikasi berkala hanya dikirim ketika Anda mendaftar atau memberikan izin yang sesuai. Kami dapat menyimpan catatan komunikasi dan pengiriman formulir untuk menjawab permintaan, menjaga catatan bisnis, menangani sengketa, dan membuktikan bagaimana suatu permintaan diproses.'
    },
    {
      title: '8. Lamaran kerja dan vendor',
      body: 'Jika Anda melamar posisi atau mendaftar sebagai freelance/vendor, informasi Anda dapat ditinjau oleh anggota tim rekrutmen, project, desain, engineering, operasional, atau manajemen yang berwenang sesuai kebutuhan. Data digunakan untuk menilai kesesuaian, berkomunikasi, menjadwalkan proses lanjutan, dan mengelola peluang berikutnya jika diperbolehkan. Jangan mengirimkan Data Pribadi yang sensitif dan tidak diperlukan untuk proses tersebut.'
    },
    {
      title: '9. Cookie, local storage, analitik, dan atribusi',
      body: 'Kapitech menggunakan penyimpanan browser dan cookie sebagaimana dijelaskan dalam Kebijakan Cookie. Penyimpanan esensial dapat diperlukan untuk fungsi seperti preferensi bahasa dan pengelolaan persetujuan. Analitik dan atribusi opsional hanya dijalankan setelah persetujuan terkait tercatat. Implementasi analitik dapat memproses informasi page view, interaksi, dan atribusi kampanye melalui penyedia yang dikonfigurasi seperti Google Analytics 4 atau Google Tag Manager. Anda dapat menarik persetujuan analitik melalui kontrol preferensi cookie.'
    },
    {
      title: '10. Penyedia layanan dan pengungkapan',
      body: 'Kami dapat memberikan atau menyediakan akses Data Pribadi kepada penyedia layanan yang membantu mengoperasikan website dan bisnis, seperti hosting, database, penyimpanan file, pemrosesan formulir atau inbox/CRM, keamanan, analitik, komunikasi, email, dan infrastruktur lainnya. Informasi yang diberikan seharusnya terbatas pada kebutuhan layanan dan tunduk pada kontrol kontraktual, teknis, atau organisasi yang sesuai. Kami juga dapat mengungkapkan data jika diwajibkan oleh hukum, proses hukum, putusan pengadilan, permintaan regulator, atau bila diperlukan untuk melindungi hak, keamanan, atau integritas sistem.'
    },
    {
      title: '11. Kerahasiaan klien dan proyek',
      body: 'Data Pribadi dan informasi bisnis rahasia yang kami terima dalam hubungan klien dapat tunduk pada NDA, kewajiban keamanan, atau ketentuan pemrosesan data tambahan. Ketentuan tersebut dapat lebih ketat daripada kebijakan website ini. Kapitech tidak dengan sengaja mempublikasikan informasi rahasia klien melalui website publik kecuali terdapat dasar kontraktual, izin, atau dasar hukum yang sesuai.'
    },
    {
      title: '12. Pemrosesan dan transfer lintas negara',
      body: 'Sebagian penyedia layanan Kapitech atau infrastrukturnya dapat memproses data di luar Indonesia. Jika Data Pribadi ditransfer atau dapat diakses lintas yurisdiksi, kami mengambil langkah yang wajar untuk menerapkan perlindungan kontraktual, teknis, dan organisasi yang sesuai serta memenuhi persyaratan hukum yang berlaku. Lokasi pemrosesan dapat berubah mengikuti vendor dan infrastruktur yang digunakan.'
    },
    {
      title: '13. Retensi Data',
      body: 'Kami menyimpan Data Pribadi selama diperlukan secara wajar untuk tujuan pengumpulan, selama hubungan atau proses yang relevan berlangsung, untuk menjaga catatan bisnis yang sah, memenuhi kewajiban hukum atau akuntansi, menyelesaikan sengketa, atau melindungi keamanan dan kepentingan hukum. Setiap kategori data dapat memiliki masa retensi yang berbeda. Setelah tidak diperlukan lagi, kami berupaya menghapus, memusnahkan, menganonimkan, atau membuang data secara aman, dengan tetap memperhatikan kewajiban penyimpanan yang sah.'
    },
    {
      title: '14. Keamanan Data',
      body: 'Kami menggunakan langkah teknis dan organisasi yang wajar untuk melindungi Data Pribadi dari akses, pengungkapan, perubahan, penyalahgunaan, kehilangan, atau pemusnahan yang tidak sah. Tergantung sistem dan sensitivitas datanya, pengamanan dapat mencakup enkripsi transport, kontrol akses, autentikasi, pembatasan hak akses, penanganan file yang aman, logging, monitoring, backup, dan kontrol lainnya. Tidak ada sistem internet atau penyimpanan yang dapat dijamin 100% aman.'
    },
    {
      title: '15. Insiden pelindungan data',
      body: 'Jika kami mengetahui adanya insiden Data Pribadi yang menimbulkan kewajiban pemberitahuan berdasarkan hukum yang berlaku, kami akan menilai dan menanganinya sesuai jenis insiden dan risikonya. Kami dapat memberikan pemberitahuan melalui kontak yang tersedia serta mengambil langkah untuk menahan, menyelidiki, memulihkan, dan mencegah kejadian serupa.'
    },
    {
      title: '16. Hak Anda',
      body: 'Tunduk pada hukum dan pengecualian yang berlaku, Anda dapat memiliki hak untuk memperoleh informasi yang jelas tentang pemrosesan, mengakses dan memperoleh salinan Data Pribadi, memperbaiki data yang tidak akurat, meminta penghapusan atau pemusnahan jika diperbolehkan, menarik persetujuan ketika persetujuan menjadi dasar pemrosesan, meminta penghentian atau pembatasan pemrosesan, mengajukan keberatan terhadap keputusan otomatis tertentu atau pemrofilan, dan menggunakan hak lain yang diberikan oleh peraturan pelindungan data yang berlaku. Kami dapat meminta verifikasi identitas yang wajar.'
    },
    {
      title: '17. Cara menggunakan hak',
      body: 'Kirimkan permintaan terkait privasi atau Data Pribadi ke hello@kapitech.id. Jelaskan permintaan, data atau proses yang dimaksud, serta informasi yang membantu kami menemukan catatan terkait. Kami akan menangani permintaan sesuai jangka waktu dan ketentuan hukum yang berlaku. Jika permintaan tidak dapat dipenuhi sepenuhnya, kami akan menjelaskan batasan yang berlaku sejauh diperbolehkan.'
    },
    {
      title: '18. Anak',
      body: 'Website dan layanan Kapitech terutama ditujukan untuk bisnis, profesional, klien, kandidat, dan pengguna dewasa lainnya. Kami tidak dengan sengaja meminta Data Pribadi yang tidak diperlukan dari anak. Jika Anda mengetahui bahwa Data Pribadi anak telah diberikan kepada kami tanpa dasar yang sesuai, silakan hubungi kami.'
    },
    {
      title: '19. Website dan layanan pihak ketiga',
      body: 'Website dapat memiliki tautan ke website, platform, jejaring sosial, atau layanan pihak ketiga. Kami tidak mengendalikan praktik privasi mereka. Kebijakan ini tidak mengatur pemrosesan oleh pihak ketiga tersebut, sehingga Anda disarankan membaca kebijakan privasi dan cookie mereka sebelum mengirim data.'
    },
    {
      title: '20. Perubahan Kebijakan Privasi',
      body: 'Kami dapat memperbarui Kebijakan Privasi ini untuk mencerminkan perubahan website, layanan, teknologi, vendor, persyaratan hukum, atau praktik pemrosesan. Versi terbaru akan tersedia di halaman ini dengan tanggal berlaku yang diperbarui. Jika perubahan material memerlukan pemberitahuan tambahan, kami akan melakukan pemberitahuan yang sesuai.'
    },
    {
      title: '21. Hubungi Kami',
      body: 'PT Kapitech Digital Indonesia\\nLinea Residence, Blok G No. 5, Jl. Melati Loka, Paku Jaya, Serpong Utara, Kota Tangerang Selatan, Banten 15220, Indonesia\\nEmail: hello@kapitech.id\\nTelepon / WhatsApp: +62 877-6995-7062'
    },
    {
      title: '22. Kerangka hukum yang berlaku',
      body: 'Kebijakan ini disusun dengan memperhatikan ketentuan pelindungan data pribadi dan penyelenggaraan sistem elektronik yang berlaku di Indonesia, termasuk Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi dan Peraturan Pemerintah Nomor 71 Tahun 2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik, sepanjang relevan dan sebagaimana dapat diubah, ditambah, atau diganti dari waktu ke waktu.'
    }
  ]
};

export const PrivacyPolicy = () => {
  const { language } = useLanguage();
  const current = sections[language];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="kapi-policy-page min-h-screen pt-28 sm:pt-36 md:pt-40 pb-16 sm:pb-20 px-4 sm:px-6 md:px-12 bg-[#0B0C0E] text-[#8A909D] font-light relative selection:bg-brand-red selection:text-white">
      <AtmosphericBackground imageUrl="/hero_background_3d.png" opacity={0.05} disableGrayscale={true} />
      <div className="max-w-4xl mx-auto relative z-10">
        <span className="kapi-section-label mb-5">{language === 'id' ? 'Privasi & Pelindungan Data' : 'Privacy & Data Protection'}</span>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white mb-4 tracking-tighter">
          {language === 'id' ? 'Kebijakan Privasi.' : 'Privacy Policy.'}
        </h1>
        <p className="text-xs sm:text-sm uppercase tracking-widest text-brand-red font-mono font-semibold mb-12">
          {language === 'id' ? 'Berlaku sejak: 8 Oktober 2026' : 'Effective: October 8, 2026'}
        </p>
        <div className="mb-12 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 text-sm leading-7 text-[#9AA1AD]">
          {language === 'id'
            ? 'Dokumen ini menjelaskan praktik pemrosesan data untuk website publik Kapitech. Untuk proyek klien, dokumen kontrak, SOW, NDA, atau Data Processing Agreement yang berlaku dapat menetapkan ketentuan tambahan atau berbeda.'
            : 'This document describes processing practices for Kapitech’s public website. Client contracts, SOWs, NDAs, or Data Processing Agreements may impose additional or different requirements for project-specific processing.'}
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
            ? 'Catatan: halaman ini adalah kebijakan website dan bukan nasihat hukum. Untuk kebutuhan kepatuhan khusus, lakukan peninjauan dengan penasihat hukum yang memahami kegiatan dan yurisdiksi bisnis Anda.'
            : 'Note: this page is a website policy and not legal advice. For specific compliance requirements, obtain advice from qualified counsel familiar with your business activities and jurisdictions.'}
        </p>
      </div>
    </motion.div>
  );
};
