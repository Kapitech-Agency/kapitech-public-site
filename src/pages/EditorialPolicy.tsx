import React from 'react';
import { motion } from 'motion/react';
import { AtmosphericBackground } from '../components/ui/AtmosphericBackground';
import { useLanguage } from '../lib/LanguageContext';

type Section = { title: string; body?: string; bullets?: string[] };

const en: Section[] = [
  { title: '1. Purpose and scope', body: 'This Editorial Policy explains how Kapitech creates, reviews, publishes, updates, corrects, and discloses editorial content on kapitech.id, including Insights articles, guides, explainers, research-led articles, technical materials, and public case-study content. It is designed to keep our content useful, accurate, transparent, and responsible while recognising that Kapitech is a commercial digital agency and not an independent newsroom.' },
  { title: '2. Editorial mission', body: 'Our editorial content aims to help readers understand digital products, websites, design, engineering, branding, technology choices, and related business decisions. We prioritise practical usefulness, clarity, evidence, and honest explanation over publishing volume.' },
  { title: '3. Editorial principles', bullets: [
    'Accuracy: factual claims should be checked against reliable sources or evidence appropriate to the topic.',
    'Clarity: complex subjects should be explained in language that the intended reader can understand without unnecessary jargon.',
    'Usefulness: articles should answer a real reader question or decision rather than exist only to target a keyword.',
    'Originality: Kapitech content should be original in wording, structure, analysis, and visual communication. Third-party material must be appropriately attributed.',
    'Transparency: commercial interests, uncertainty, conflicts, sponsorship, and material limitations should be disclosed where relevant.',
    'Responsibility: we avoid deliberately misleading claims, fabricated evidence, deceptive comparisons, plagiarism, and manipulative presentation.',
    'Accessibility: content should be structured so that readers can navigate, understand, and access it across common devices and assistive technologies.'
  ]},
  { title: '4. Topic selection and search intent', body: 'Topics may be selected based on reader needs, industry relevance, questions raised by clients, technology developments, service expertise, search demand, or gaps in existing explanations. Search intent can inform topic selection and structure, but editorial content should not be distorted solely to manipulate search rankings.' },
  { title: '5. Research and source standards', bullets: [
    'Prefer primary or authoritative sources where available, including official documentation, standards, regulations, research papers, product documentation, and direct data.',
    'Use secondary sources when they provide useful context, while checking material claims against stronger sources when practical.',
    'Record or retain the reasoning and source trail needed for meaningful fact checking.',
    'Do not invent statistics, quotations, case-study outcomes, benchmarks, customer opinions, or research findings.',
    'Where evidence is incomplete, disputed, estimated, or context-dependent, the article should say so.'
  ]},
  { title: '6. Expert review and technical validation', body: 'Technical, legal-adjacent, product, security, or other specialist content should be reviewed by a person with appropriate subject-matter knowledge when the topic warrants it. A review may verify factual accuracy, technical feasibility, source quality, terminology, risks, and whether the article overstates a conclusion. Review does not necessarily mean the reviewer agrees with every opinion in the article.' },
  { title: '7. Authors, editors, and reviewers', body: 'Where practical, published articles should identify the author, editorial owner, reviewer, or responsible team. Kapitech may use a team byline for collaborative work. Authorship should reflect a meaningful contribution to the content. Editing, fact checking, or visual production does not automatically make a person the author, but those contributions may be acknowledged where appropriate.' },
  { title: '8. Use of AI in editorial production', body: 'Kapitech may use AI tools as internal assistance for research discovery, outlining, brainstorming, language refinement, data organisation, code examples, or other production tasks. AI output is not treated as authoritative by default. Human editors remain responsible for factual verification, originality, source checking, legal and commercial sensitivity, and the final published version. We do not publish unreviewed AI output as if it were verified human work.' },
  { title: '9. Originality, plagiarism, and attribution', body: 'Kapitech does not intentionally copy articles, illustrations, diagrams, code, or other protected material from third parties and present it as our own. Short quotations, references, data, external images, open-source components, and other third-party materials must be used according to their applicable rights and licence conditions. Where attribution is required or useful, we provide it clearly.' },
  { title: '10. Case studies and client protection', body: 'Client names, logos, screenshots, metrics, quotes, and project details may be confidential or contractually restricted. Kapitech publishes case-study information only where we have an appropriate basis to do so, such as client permission, an agreed publication right, or information already public. Confidential financial, operational, technical, or personal information should not be exposed merely to make a case study more persuasive.' },
  { title: '11. Commercial content and conflicts of interest', body: 'Kapitech is a commercial agency. Some editorial pages may naturally discuss services, methods, or solutions that Kapitech also sells. Relevant promotional content should be identifiable through context, labels, or clearly separated calls to action. We should not disguise a paid placement, affiliate relationship, or direct commercial promotion as independent research. Comparative content should explain its basis and limitations.' },
  { title: '12. Sponsored, contributed, and third-party content', body: 'Guest contributions, sponsored materials, co-authored pieces, externally supplied research, or content that materially originated from a third party should be reviewed before publication and clearly identified where the reader could reasonably misunderstand its origin or commercial relationship. Third-party claims are not adopted as Kapitech facts merely because they appear in a contributed piece.' },
  { title: '13. Visuals, charts, and data', body: 'Charts, diagrams, tables, screenshots, and bespoke illustrations should accurately represent the underlying information. Visual simplification must not change the meaning of the source data. Images should be original, licensed, supplied with permission, or otherwise used under an applicable legal basis. Generated visuals should not be presented as documentary evidence of a real event unless they are clearly labelled as illustrative.' },
  { title: '14. SEO and editorial integrity', bullets: [
    'Titles, headings, metadata, internal links, and structured content may be optimised for discovery and usability.',
    'We do not intentionally hide material information, stuff keywords, create false statements, or use misleading headings solely for traffic.',
    'Search performance is not a substitute for factual quality or reader value.',
    'If a keyword conflicts with a more accurate description, accuracy takes priority.'
  ]},
  { title: '15. Corrections and factual errors', body: 'When we discover a material factual error, we investigate it and correct the article as appropriate. Corrections may include replacing inaccurate text, adding context, updating a source, or publishing an editorial note when the change affects the substance of the article. Material updates should have an updated date so readers can distinguish revised content from the original publication.' },
  { title: '16. Updates, versioning, and outdated content', body: 'Technology, regulations, software versions, pricing, interfaces, and best practices change. We may periodically review older articles and update, revise, or retire information that is no longer reliable. An article should not be treated as current merely because its URL still exists. Where the age of the information matters, readers should check the article’s published and updated dates and linked primary sources.' },
  { title: '17. Reader feedback and challenges', body: 'Readers can send editorial corrections, source challenges, or requests for clarification to hello@kapitech.id. Useful feedback should identify the relevant statement and, where possible, provide a credible source or explanation. We may investigate feedback and update content when the evidence supports a correction.' },
  { title: '18. Editorial independence from sales', body: 'Sales or marketing goals may influence which business topics Kapitech chooses to cover, but they should not require an editor to publish a known falsehood or suppress a material correction. Editorial staff should be able to correct factual errors even where the correction is commercially inconvenient.' },
  { title: '19. Limitations and professional advice', body: 'Editorial content is educational and informational. Articles are not substitutes for legal, tax, financial, medical, cybersecurity, compliance, or other professional advice. Where a topic creates material legal, safety, financial, or regulatory risk, readers should consult a suitably qualified professional and use primary sources.' },
  { title: '20. Policy changes', body: 'Kapitech may update this Editorial Policy as its editorial processes, technology, team structure, or legal obligations change. The current version will be maintained on this page with its update date.' },
  { title: '21. Contact', body: 'Editorial questions, corrections, attribution requests, and feedback can be sent to hello@kapitech.id.\\nPT Kapitech Digital Indonesia\\nLinea Residence, Block G No. 5, Jl. Melati Loka, Paku Jaya, Serpong Utara, Kota Tangerang Selatan, Banten 15220, Indonesia' }
];

const id: Section[] = [
  { title: '1. Tujuan dan ruang lingkup', body: 'Editorial Policy ini menjelaskan bagaimana Kapitech membuat, meninjau, menerbitkan, memperbarui, mengoreksi, dan mengungkapkan konten editorial di kapitech.id, termasuk Insights, artikel panduan, explainer, artikel berbasis riset, materi teknis, dan case study publik. Tujuannya adalah menjaga konten tetap berguna, akurat, transparan, dan bertanggung jawab, dengan tetap mengakui bahwa Kapitech adalah digital agency komersial dan bukan newsroom independen.' },
  { title: '2. Misi editorial', body: 'Konten editorial Kapitech dibuat untuk membantu pembaca memahami digital product, website, design, engineering, branding, pilihan teknologi, dan keputusan bisnis yang terkait. Kami mengutamakan kegunaan praktis, kejelasan, bukti, dan penjelasan yang jujur daripada mengejar volume publikasi.' },
  { title: '3. Prinsip editorial', bullets: [
    'Akurasi: klaim faktual diperiksa dengan sumber atau bukti yang sesuai dengan topiknya.',
    'Kejelasan: topik kompleks dijelaskan dengan bahasa yang dapat dipahami pembaca tanpa jargon yang tidak perlu.',
    'Kegunaan: artikel harus menjawab pertanyaan atau keputusan nyata pembaca, bukan hanya dibuat untuk keyword.',
    'Orisinalitas: tulisan, struktur, analisis, dan komunikasi visual harus orisinal. Materi pihak ketiga harus diberi atribusi yang tepat.',
    'Transparansi: kepentingan komersial, ketidakpastian, konflik kepentingan, sponsorship, dan keterbatasan material perlu dijelaskan jika relevan.',
    'Tanggung jawab: kami menghindari klaim menyesatkan, bukti palsu, plagiarisme, perbandingan yang manipulatif, dan penyajian data yang menipu.',
    'Aksesibilitas: konten harus disusun agar mudah dinavigasi dan dipahami pada perangkat umum maupun dengan assistive technology.'
  ]},
  { title: '4. Pemilihan topik dan search intent', body: 'Topik dapat dipilih berdasarkan kebutuhan pembaca, relevansi industri, pertanyaan klien, perkembangan teknologi, keahlian layanan, search demand, atau celah pada penjelasan yang sudah ada. Search intent dapat membantu menentukan topik dan struktur, tetapi konten tidak boleh dipelintir hanya untuk mengejar ranking.' },
  { title: '5. Riset dan standar sumber', bullets: [
    'Utamakan sumber primer atau berwenang seperti dokumentasi resmi, regulasi, standar, research paper, dokumentasi produk, dan data langsung.',
    'Sumber sekunder dapat dipakai untuk konteks, tetapi klaim penting sebaiknya diverifikasi terhadap sumber yang lebih kuat jika memungkinkan.',
    'Jejak sumber dan alasan editorial yang diperlukan untuk fact checking perlu dipertahankan.',
    'Jangan mengarang statistik, kutipan, hasil case study, benchmark, opini klien, atau hasil penelitian.',
    'Jika bukti tidak lengkap, diperdebatkan, berupa estimasi, atau bergantung konteks, hal tersebut harus dijelaskan.'
  ]},
  { title: '6. Expert review dan validasi teknis', body: 'Konten teknis, security, product, topik yang berdekatan dengan hukum, atau topik spesialis lain dapat ditinjau oleh orang dengan pengetahuan yang sesuai. Review dapat memeriksa akurasi, kelayakan teknis, kualitas sumber, terminologi, risiko, dan apakah kesimpulan terlalu jauh. Reviewer tidak harus setuju dengan seluruh opini artikel.' },
  { title: '7. Author, editor, dan reviewer', body: 'Jika memungkinkan, artikel mencantumkan author, editorial owner, reviewer, atau tim yang bertanggung jawab. Kapitech dapat menggunakan byline tim untuk pekerjaan kolaboratif. Author harus mencerminkan kontribusi yang bermakna terhadap isi artikel. Editing, fact checking, atau produksi visual tidak otomatis berarti seseorang adalah author, tetapi kontribusi tersebut dapat dicantumkan jika relevan.' },
  { title: '8. Penggunaan AI dalam produksi editorial', body: 'Kapitech dapat menggunakan tools AI sebagai bantuan internal untuk discovery riset, outline, brainstorming, perbaikan bahasa, pengorganisasian data, contoh kode, atau tugas produksi lainnya. Output AI tidak dianggap benar secara otomatis. Editor manusia tetap bertanggung jawab terhadap verifikasi fakta, orisinalitas, pemeriksaan sumber, sensitivitas hukum dan komersial, serta versi final yang diterbitkan. Output AI yang belum direview tidak dipublikasikan sebagai materi yang telah diverifikasi.' },
  { title: '9. Orisinalitas, plagiarisme, dan atribusi', body: 'Kapitech tidak dengan sengaja menyalin artikel, ilustrasi, diagram, kode, atau materi berhak cipta pihak lain lalu menyajikannya sebagai karya sendiri. Kutipan singkat, referensi, data, gambar eksternal, komponen open-source, dan material pihak ketiga harus digunakan sesuai hak dan lisensinya. Jika atribusi diperlukan atau membantu pembaca, kami mencantumkannya secara jelas.' },
  { title: '10. Case study dan perlindungan klien', body: 'Nama klien, logo, screenshot, metric, quote, dan detail proyek dapat bersifat rahasia atau dibatasi kontrak. Kapitech menerbitkan case study hanya jika memiliki dasar yang sesuai, seperti izin klien, hak publikasi yang disepakati, atau informasi yang memang sudah publik. Informasi finansial, operasional, teknis, atau personal yang rahasia tidak boleh dibuka hanya agar case study terlihat lebih meyakinkan.' },
  { title: '11. Konten komersial dan konflik kepentingan', body: 'Kapitech adalah agency komersial. Sebagian artikel dapat membahas layanan, metode, atau solusi yang juga ditawarkan Kapitech. Materi promosi yang relevan harus dapat dikenali melalui konteks, label, atau CTA yang jelas. Kami tidak menyamarkan paid placement, affiliate relationship, atau promosi komersial langsung sebagai riset independen. Artikel perbandingan harus menjelaskan dasar dan batasannya.' },
  { title: '12. Sponsored, contributed, dan third-party content', body: 'Guest contribution, sponsored material, co-authored article, riset eksternal, atau materi yang secara material berasal dari pihak ketiga perlu direview sebelum diterbitkan dan diberi penjelasan yang sesuai jika pembaca dapat salah memahami asal atau hubungan komersialnya. Klaim pihak ketiga tidak otomatis menjadi fakta Kapitech hanya karena ada di artikel kontribusi.' },
  { title: '13. Visual, chart, dan data', body: 'Chart, diagram, tabel, screenshot, dan ilustrasi harus menggambarkan informasi dasarnya secara akurat. Penyederhanaan visual tidak boleh mengubah makna sumber data. Gambar harus merupakan karya asli, berlisensi, diberikan dengan izin, atau digunakan berdasarkan dasar hukum yang sesuai. Visual generatif tidak boleh ditampilkan sebagai dokumentasi kejadian nyata kecuali diberi label sebagai ilustrasi.' },
  { title: '14. SEO dan integritas editorial', bullets: [
    'Title, heading, metadata, internal link, dan struktur konten dapat dioptimalkan untuk discovery dan usability.',
    'Kami tidak sengaja menyembunyikan informasi material, melakukan keyword stuffing, membuat klaim palsu, atau memakai heading menyesatkan hanya untuk traffic.',
    'Performa search bukan pengganti kualitas fakta dan nilai bagi pembaca.',
    'Jika keyword bertentangan dengan deskripsi yang lebih akurat, akurasi menjadi prioritas.'
  ]},
  { title: '15. Koreksi dan kesalahan faktual', body: 'Jika menemukan kesalahan faktual material, kami akan menyelidiki dan memperbaikinya sesuai kebutuhan. Koreksi dapat berupa penggantian teks, penambahan konteks, pembaruan sumber, atau catatan editorial jika perubahan memengaruhi substansi artikel. Pembaruan material sebaiknya disertai tanggal update agar pembaca dapat membedakan versi yang telah diperbarui.' },
  { title: '16. Update, versioning, dan konten lama', body: 'Teknologi, regulasi, versi software, harga, interface, dan best practice dapat berubah. Kami dapat meninjau artikel lama dan memperbarui, merevisi, atau menghentikan informasi yang tidak lagi dapat diandalkan. URL yang masih aktif tidak berarti seluruh isinya otomatis terkini. Perhatikan tanggal published dan updated serta sumber primer yang ditautkan.' },
  { title: '17. Feedback dan challenge dari pembaca', body: 'Pembaca dapat mengirim koreksi editorial, pertanyaan tentang sumber, atau permintaan klarifikasi ke hello@kapitech.id. Feedback yang baik sebaiknya menyebutkan klaim yang dimaksud dan, jika memungkinkan, menyertakan sumber yang kredibel. Kami dapat menyelidiki feedback dan memperbarui konten jika bukti mendukung koreksi.' },
  { title: '18. Independensi editorial dari sales', body: 'Target sales atau marketing dapat memengaruhi topik yang dipilih Kapitech, tetapi tujuan komersial tidak boleh mengharuskan editor menerbitkan fakta yang diketahui salah atau menahan koreksi material. Kesalahan faktual harus dapat diperbaiki meskipun koreksi tersebut secara komersial tidak nyaman.' },
  { title: '19. Batasan dan nasihat profesional', body: 'Konten editorial bersifat edukatif dan informasional. Artikel bukan pengganti nasihat hukum, pajak, keuangan, medis, cybersecurity, compliance, atau nasihat profesional lainnya. Untuk topik yang membawa risiko hukum, keselamatan, finansial, atau regulasi, pembaca sebaiknya berkonsultasi dengan profesional yang kompeten dan menggunakan sumber primer.' },
  { title: '20. Perubahan kebijakan', body: 'Kapitech dapat memperbarui Editorial Policy ketika proses editorial, teknologi, struktur tim, atau kewajiban hukum berubah. Versi terbaru akan tersedia di halaman ini dengan tanggal update.' },
  { title: '21. Kontak', body: 'Pertanyaan editorial, koreksi, permintaan atribusi, dan feedback dapat dikirim ke hello@kapitech.id.\\nPT Kapitech Digital Indonesia\\nLinea Residence, Blok G No. 5, Jl. Melati Loka, Paku Jaya, Serpong Utara, Kota Tangerang Selatan, Banten 15220, Indonesia' }
];

export const EditorialPolicy = () => {
  const { language } = useLanguage();
  const current = language === 'id' ? id : en;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="kapi-policy-page min-h-screen pt-28 sm:pt-36 md:pt-40 pb-16 sm:pb-20 px-4 sm:px-6 md:px-12 bg-[#0B0C0E] text-[#8A909D] font-light relative selection:bg-brand-red selection:text-white">
      <AtmosphericBackground imageUrl="/hero_background_3d.png" opacity={0.05} disableGrayscale={true} />
      <div className="max-w-4xl mx-auto relative z-10">
        <span className="kapi-section-label mb-5">{language === 'id' ? 'Standar Konten & Publikasi' : 'Content & Publication Standards'}</span>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white mb-4 tracking-tighter">{language === 'id' ? 'Kebijakan Editorial.' : 'Editorial Policy.'}</h1>
        <p className="text-xs sm:text-sm uppercase tracking-widest text-brand-red font-mono font-semibold mb-12">{language === 'id' ? 'Diperbarui: 8 Oktober 2026' : 'Updated: October 8, 2026'}</p>
        <div className="mb-12 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 text-sm leading-7 text-[#9AA1AD]">
          {language === 'id'
            ? 'Kapitech adalah publisher komersial. Kebijakan ini menjelaskan bagaimana kami berusaha menjaga kualitas, akurasi, transparansi, dan tanggung jawab editorial.'
            : 'Kapitech is a commercial publisher. This policy explains how we aim to maintain editorial quality, accuracy, transparency, and responsibility.'}
        </div>
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
