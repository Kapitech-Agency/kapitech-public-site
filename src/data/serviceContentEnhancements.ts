import type { ServiceItemData } from './servicesData';

type ServiceContentEnhancement = Partial<Pick<
  ServiceItemData,
  'problemsSolutions' | 'capabilities' | 'processStages' | 'faqs'
>> & {
  benefits?: {
    en: string[];
    id: string[];
  };
};

const problem = (
  problemTitle: string,
  problemTitleId: string,
  problemDesc: string,
  problemDescId: string,
  solutionTitle: string,
  solutionTitleId: string,
  solutionDesc: string,
  solutionDescId: string,
) => ({
  problemTitle,
  problemTitleId,
  problemDesc,
  problemDescId,
  solutionTitle,
  solutionTitleId,
  solutionDesc,
  solutionDescId,
});

const capability = (
  title: string,
  titleId: string,
  desc: string,
  descId: string,
) => ({ title, titleId, desc, descId });

const stage = (
  stageNumber: string,
  stageName: string,
  stageNameId: string,
  stageDesc: string,
  stageDescId: string,
  deliverables: string[],
  deliverablesId: string[],
) => ({
  stageNumber,
  stageName,
  stageNameId,
  stageDesc,
  stageDescId,
  deliverables,
  deliverablesId,
});

const faq = (
  q: string,
  qId: string,
  a: string,
  aId: string,
) => ({ q, qId, a, aId });

export const serviceContentEnhancements: Record<string, ServiceContentEnhancement> = {
  'mvp-design': {
    faqs: [
      faq(
        'Can the prototype be tested with real users before development?',
        'Apakah prototipe bisa diuji ke pengguna nyata sebelum masuk development?',
        'Yes. We can prepare moderated or unmoderated usability sessions, capture friction points, and translate the findings into a prioritized design revision.',
        'Ya. Kami dapat menyiapkan sesi usability terarah, menangkap titik friksi, lalu menerjemahkan temuannya menjadi revisi desain yang diprioritaskan.',
      ),
    ],
  },

  'product-redesign': {
    faqs: [
      faq(
        'Can you redesign without changing the underlying product architecture?',
        'Bisakah redesain dilakukan tanpa langsung mengubah arsitektur produk?',
        'Yes. We can separate UX and visual changes from engineering changes, then provide a staged implementation plan so the highest-impact improvements land first.',
        'Bisa. Kami dapat memisahkan perubahan UX dan visual dari perubahan engineering, lalu menyusun implementasi bertahap agar perbaikan berdampak tinggi dikerjakan lebih dulu.',
      ),
    ],
  },

  'team-extension': {
    faqs: [
      faq(
        'Can your designers and engineers work inside our existing workflow?',
        'Apakah designer dan engineer Kapitech bisa bekerja di workflow internal kami?',
        'Yes. We can adapt to your project rituals, repositories, design tools, communication channels, sprint cadence, and approval flow.',
        'Bisa. Kami dapat mengikuti ritual proyek, repository, tools desain, kanal komunikasi, ritme sprint, dan alur approval yang sudah Anda gunakan.',
      ),
    ],
  },

  'pitch-deck': {
    faqs: [
      faq(
        'Can you work from an existing pitch narrative and financial model?',
        'Apakah Kapitech bisa bekerja dari pitch narrative dan financial model yang sudah ada?',
        'Yes. We can preserve the underlying story and numbers while restructuring the information hierarchy, visuals, and investor-facing flow.',
        'Bisa. Kami mempertahankan cerita dan angka yang sudah ada sambil memperbaiki hierarchy informasi, visual, dan alur presentasi untuk investor.',
      ),
    ],
  },

  'brand-identity': {
    problemsSolutions: [
      problem(
        'Fragmented Brand Touchpoints',
        'Touchpoint Brand Tidak Konsisten',
        'Different teams and vendors often produce assets that look related but do not behave like one coherent brand.',
        'Tim dan vendor yang berbeda sering menghasilkan aset yang terlihat serupa tetapi tidak terasa sebagai satu brand yang konsisten.',
        'A Governed Brand System',
        'Sistem Brand yang Terarah',
        'We define reusable visual rules, templates, and approval standards so the identity stays coherent as the business grows.',
        'Kami menetapkan aturan visual, template, dan standar approval yang dapat digunakan ulang agar identitas tetap konsisten saat bisnis berkembang.',
      ),
    ],
    faqs: [
      faq(
        'Do you provide brand guidelines that internal teams can actually use?',
        'Apakah Kapitech menyediakan brand guideline yang benar-benar bisa dipakai tim internal?',
        'Yes. The guideline is structured around practical rules, examples, templates, and usage boundaries rather than only presenting a visual moodboard.',
        'Ya. Guideline disusun berdasarkan aturan praktis, contoh, template, dan batas penggunaan, bukan sekadar moodboard visual.',
      ),
      faq(
        'Can the identity system extend to digital products and websites?',
        'Apakah sistem identitas bisa diterapkan ke produk digital dan website?',
        'Yes. We can translate the brand into digital-ready typography, color tokens, interface patterns, social templates, and campaign assets.',
        'Bisa. Kami dapat menerjemahkan brand ke tipografi digital, color token, pola interface, template sosial media, dan aset kampanye.',
      ),
    ],
  },

  'logo-design': {
    problemsSolutions: [
      problem(
        'Weak Recognition Across Sizes',
        'Logo Sulit Dikenali di Berbagai Ukuran',
        'A mark can look acceptable on a large presentation but lose clarity in favicons, social avatars, product headers, or print.',
        'Logo yang terlihat bagus pada presentasi besar dapat kehilangan kejelasan saat digunakan sebagai favicon, avatar sosial, header produk, atau media cetak.',
        'Responsive Logo Family',
        'Keluarga Logo yang Responsif',
        'We develop primary, compact, monochrome, and small-size variants so recognition survives across real-world applications.',
        'Kami mengembangkan varian utama, compact, monokrom, dan ukuran kecil agar karakter logo tetap terbaca di berbagai penggunaan.',
      ),
      problem(
        'No Clear Usage Rules',
        'Tidak Ada Aturan Penggunaan yang Jelas',
        'Without spacing, background, and minimum-size rules, teams gradually introduce inconsistent logo treatments.',
        'Tanpa aturan spacing, background, dan ukuran minimum, tim akan semakin sering menggunakan logo secara tidak konsisten.',
        'Practical Logo Guidelines',
        'Panduan Logo yang Praktis',
        'We document clear do-and-don’t examples, spacing rules, color variants, and handoff assets for day-to-day use.',
        'Kami mendokumentasikan contoh penggunaan dan larangan, aturan spacing, varian warna, serta aset siap pakai untuk kebutuhan harian.',
      ),
    ],
    capabilities: [
      capability(
        'Logo Lockups & Responsive Variants',
        'Lockup Logo & Varian Responsif',
        'Primary, stacked, horizontal, icon-only, and small-size variants prepared for different touchpoints.',
        'Varian primary, stacked, horizontal, icon-only, dan small-size untuk berbagai touchpoint.',
      ),
      capability(
        'Usage Guide & Asset Handoff',
        'Panduan Penggunaan & Handoff Aset',
        'Production-ready files with naming, formats, clear space, minimum size, and background guidance.',
        'File siap produksi lengkap dengan penamaan, format, clear space, ukuran minimum, dan panduan background.',
      ),
    ],
    processStages: [
      stage(
        '04',
        'Finalization & Brand Handoff',
        'Finalisasi & Handoff Brand',
        'Finalize selected direction, prepare responsive lockups, and package all source and export formats.',
        'Memfinalisasi arah terpilih, menyiapkan lockup responsif, dan mengemas seluruh format source maupun export.',
        ['Final logo family', 'Usage guideline', 'Source & export package'],
        ['Keluarga logo final', 'Panduan penggunaan', 'Paket source & export'],
      ),
    ],
    faqs: [
      faq(
        'How many concepts do you normally present?',
        'Berapa banyak konsep logo yang biasanya dipresentasikan?',
        'We normally present a focused set of distinct directions rather than many minor variations, then refine the selected route through review rounds.',
        'Kami biasanya menyajikan beberapa arah yang benar-benar berbeda, lalu mengembangkan arah pilihan melalui beberapa putaran review.',
      ),
      faq(
        'Can the final mark work for both digital and print?',
        'Apakah logo final bisa digunakan untuk digital dan print?',
        'Yes. We prepare vector masters and responsive variants suitable for websites, social media, documents, packaging, signage, and print production.',
        'Bisa. Kami menyiapkan master vector dan varian responsif untuk website, social media, dokumen, packaging, signage, dan kebutuhan print.',
      ),
    ],
    benefits: {
      en: [
        'Create a recognizable mark that remains clear across small and large touchpoints',
        'Give internal teams practical rules that reduce inconsistent logo usage',
      ],
      id: [
        'Membangun logo yang mudah dikenali di berbagai touchpoint berukuran kecil maupun besar',
        'Memberikan aturan praktis agar penggunaan logo oleh tim internal tetap konsisten',
      ],
    },
  },

  'graphic-design': {
    problemsSolutions: [
      problem(
        'Inconsistent Visual Campaigns',
        'Visual Kampanye Tidak Konsisten',
        'Campaign assets often evolve across different sizes and contributors, causing inconsistent typography, composition, and visual tone.',
        'Aset kampanye sering berkembang di banyak ukuran dan dikerjakan banyak pihak sehingga tipografi, komposisi, dan tone visual menjadi tidak konsisten.',
        'Campaign Visual System',
        'Sistem Visual Kampanye',
        'We establish a repeatable art direction and asset structure that makes new campaign variations easier to produce and approve.',
        'Kami membangun art direction dan struktur aset yang dapat diulang sehingga variasi kampanye lebih mudah diproduksi dan disetujui.',
      ),
      problem(
        'Too Much Production Rework',
        'Revisi Produksi Terlalu Banyak',
        'Assets created without a clear content hierarchy generate unnecessary back-and-forth between marketing, design, and stakeholders.',
        'Aset yang dibuat tanpa hierarchy konten yang jelas memicu revisi berulang antara marketing, desain, dan stakeholder.',
        'Approval-Ready Design Routes',
        'Desain yang Siap Di-approve',
        'We turn the brief into clear visual routes before production so feedback stays focused on the chosen creative direction.',
        'Kami menerjemahkan brief menjadi beberapa jalur visual yang jelas sebelum produksi sehingga feedback tetap fokus pada arah kreatif yang dipilih.',
      ),
    ],
    capabilities: [
      capability(
        'Campaign Key Visuals',
        'Key Visual Kampanye',
        'Master compositions that can be adapted into social, digital ads, presentations, and offline formats.',
        'Komposisi master yang dapat diadaptasi ke social media, digital ads, presentasi, dan format offline.',
      ),
      capability(
        'Multi-Format Asset Production',
        'Produksi Aset Multi-Format',
        'Structured production across portrait, landscape, square, story, banner, and presentation formats.',
        'Produksi terstruktur untuk format portrait, landscape, square, story, banner, dan presentasi.',
      ),
    ],
    processStages: [
      stage(
        '03',
        'Production & Adaptation',
        'Produksi & Adaptasi',
        'Produce the approved key visual and translate it into the formats your campaign actually needs.',
        'Memproduksi key visual yang disetujui lalu menerjemahkannya ke format yang benar-benar dibutuhkan kampanye.',
        ['Master artwork', 'Multi-format adaptations', 'Editable production assets'],
        ['Artwork master', 'Adaptasi multi-format', 'Aset produksi editable'],
      ),
      stage(
        '04',
        'Final QA & Asset Library',
        'QA Final & Asset Library',
        'Run visual checks, naming standards, and handoff packaging so teams can reuse the assets without guesswork.',
        'Melakukan pengecekan visual, standardisasi penamaan, dan packaging handoff agar aset mudah digunakan kembali.',
        ['Final QA set', 'Asset naming structure', 'Organized delivery folder'],
        ['Set QA final', 'Struktur penamaan aset', 'Folder delivery terorganisir'],
      ),
    ],
    faqs: [
      faq(
        'Can you build a repeatable visual system for recurring campaigns?',
        'Apakah Kapitech bisa membuat sistem visual yang dapat dipakai untuk kampanye berulang?',
        'Yes. We can create master artwork, modular layouts, templates, and production rules so future campaign assets are faster to adapt.',
        'Bisa. Kami dapat membuat artwork master, layout modular, template, dan aturan produksi agar aset kampanye berikutnya lebih cepat dibuat.',
      ),
      faq(
        'Can the same campaign direction be adapted for social media and presentations?',
        'Apakah satu arah kampanye bisa diadaptasi ke social media dan presentasi?',
        'Yes. We design from a master composition and then adapt the hierarchy rather than simply resizing the same artwork.',
        'Bisa. Kami merancang dari komposisi master lalu menyesuaikan hierarchy, bukan sekadar memperbesar atau memperkecil artwork yang sama.',
      ),
    ],
    benefits: {
      en: [
        'Reduce repeated design rework with a clearer campaign visual system',
        'Keep campaign quality consistent across teams, channels, and formats',
      ],
      id: [
        'Mengurangi revisi desain berulang dengan sistem visual kampanye yang lebih jelas',
        'Menjaga kualitas kampanye tetap konsisten di berbagai tim, channel, dan format',
      ],
    },
  },

  'rebranding': {
    problemsSolutions: [
      problem(
        'Internal Alignment Breaks Down',
        'Alignment Internal Tidak Lagi Selaras',
        'A rebrand can fail when leadership, marketing, sales, and product teams interpret the new identity differently.',
        'Rebrand bisa gagal ketika leadership, marketing, sales, dan product team memahami identitas baru secara berbeda.',
        'Rollout Governance',
        'Governance untuk Rollout',
        'We define ownership, approval rules, migration priorities, and practical rollout phases so the new brand can be adopted consistently.',
        'Kami menetapkan ownership, aturan approval, prioritas migrasi, dan tahapan rollout agar brand baru dapat diadopsi secara konsisten.',
      ),
      problem(
        'Legacy Assets Slow the Transition',
        'Aset Lama Menghambat Transisi',
        'Dozens of existing templates and communication materials can create a long, expensive, and inconsistent migration.',
        'Puluhan template dan materi komunikasi yang sudah ada dapat membuat proses migrasi menjadi panjang, mahal, dan tidak konsisten.',
        'Prioritized Asset Migration',
        'Migrasi Aset Berdasarkan Prioritas',
        'We identify the highest-visibility assets first, define replacement waves, and package reusable templates for internal teams.',
        'Kami mengidentifikasi aset dengan visibilitas tertinggi, menentukan gelombang penggantian, dan membuat template reusable bagi tim internal.',
      ),
    ],
    capabilities: [
      capability(
        'Positioning & Messaging Alignment',
        'Alignment Positioning & Messaging',
        'Connect the new visual identity with a clear market position, audience, and communication priorities.',
        'Menghubungkan identitas visual baru dengan positioning, audiens, dan prioritas komunikasi yang jelas.',
      ),
      capability(
        'Brand Rollout Toolkit',
        'Toolkit Rollout Brand',
        'Templates, social systems, presentation assets, and practical rules that make the new identity usable immediately.',
        'Template, sistem social media, aset presentasi, dan aturan praktis agar identitas baru langsung dapat digunakan.',
      ),
    ],
    processStages: [
      stage(
        '03',
        'Identity System & Template Build',
        'Sistem Identitas & Pembuatan Template',
        'Translate the approved strategy into a scalable identity system and the templates teams use every week.',
        'Menerjemahkan strategi yang disetujui menjadi sistem identitas scalable dan template yang dipakai tim setiap minggu.',
        ['Brand system', 'Core templates', 'Digital asset kit'],
        ['Sistem brand', 'Template inti', 'Kit aset digital'],
      ),
      stage(
        '04',
        'Rollout & Adoption',
        'Rollout & Adopsi',
        'Prepare migration priorities, internal guidance, and final assets for launch across the organization.',
        'Menyiapkan prioritas migrasi, panduan internal, dan aset final untuk peluncuran di seluruh organisasi.',
        ['Rollout roadmap', 'Internal usage guide', 'Migration-ready assets'],
        ['Roadmap rollout', 'Panduan penggunaan internal', 'Aset siap migrasi'],
      ),
    ],
    faqs: [
      faq(
        'Do we need to replace everything immediately during a rebrand?',
        'Apakah semua aset harus diganti sekaligus saat rebranding?',
        'Not necessarily. A phased migration can prioritize high-visibility touchpoints first while legacy materials are replaced in a controlled sequence.',
        'Tidak selalu. Migrasi bertahap dapat memprioritaskan touchpoint dengan visibilitas tinggi terlebih dahulu lalu mengganti aset lama secara terkontrol.',
      ),
      faq(
        'Can you help our team adopt the new identity internally?',
        'Apakah Kapitech bisa membantu tim internal mengadopsi identitas baru?',
        'Yes. We can prepare practical guidelines, templates, examples, and handoff sessions for marketing, sales, HR, and product teams.',
        'Bisa. Kami dapat menyiapkan guideline praktis, template, contoh, dan sesi handoff untuk tim marketing, sales, HR, dan product.',
      ),
    ],
  },

  'ui-ux-design': {
    problemsSolutions: [
      problem(
        'Users Cannot See the Next Step',
        'Pengguna Tidak Menemukan Langkah Berikutnya',
        'Complex interfaces often overload users with choices and weak hierarchy, increasing hesitation and support requests.',
        'Interface yang kompleks sering membebani pengguna dengan terlalu banyak pilihan dan hierarchy yang lemah sehingga meningkatkan kebingungan dan kebutuhan support.',
        'Task-Led Interaction Design',
        'Desain Interaksi Berbasis Task',
        'We prioritize the actions that matter most and design navigation, hierarchy, feedback, and states around real user tasks.',
        'Kami memprioritaskan aksi terpenting lalu merancang navigasi, hierarchy, feedback, dan state berdasarkan task pengguna nyata.',
      ),
      problem(
        'Design Stops at the Happy Path',
        'Desain Hanya Memikirkan Happy Path',
        'Missing empty, loading, error, permission, and edge states creates implementation gaps and inconsistent production experiences.',
        'Ketiadaan state empty, loading, error, permission, dan edge case menciptakan gap implementasi dan pengalaman produksi yang tidak konsisten.',
        'Complete State Coverage',
        'Cakupan State yang Lengkap',
        'We design the full interaction state model so engineering receives decisions for both normal and exceptional situations.',
        'Kami merancang model state interaksi secara menyeluruh agar engineering memiliki keputusan desain untuk kondisi normal maupun exceptional.',
      ),
    ],
    capabilities: [
      capability(
        'Interaction State Design',
        'Desain State Interaksi',
        'Loading, empty, error, success, disabled, permission, and responsive states defined before handoff.',
        'State loading, empty, error, success, disabled, permission, dan responsive ditentukan sebelum handoff.',
      ),
      capability(
        'Developer-Ready Handoff',
        'Handoff Siap Developer',
        'Annotated flows, components, tokens, assets, and behavior notes that reduce interpretation during implementation.',
        'Flow teranotasi, komponen, token, aset, dan catatan behavior untuk mengurangi interpretasi saat implementasi.',
      ),
    ],
    processStages: [
      stage(
        '03',
        'Interface System & Prototype',
        'Sistem Interface & Prototipe',
        'Build the final component language, interaction states, and responsive prototype around validated user flows.',
        'Membangun bahasa komponen final, interaction state, dan prototype responsif berdasarkan user flow tervalidasi.',
        ['Component system', 'Responsive prototype', 'Interaction specification'],
        ['Sistem komponen', 'Prototype responsif', 'Spesifikasi interaksi'],
      ),
      stage(
        '04',
        'Validation & Handoff',
        'Validasi & Handoff',
        'Review the experience with stakeholders, refine edge cases, and package an implementation-ready handoff.',
        'Mereview experience bersama stakeholder, memperbaiki edge case, dan menyiapkan handoff siap implementasi.',
        ['Review notes', 'Final prototype', 'Developer handoff package'],
        ['Catatan review', 'Prototype final', 'Paket handoff developer'],
      ),
    ],
    faqs: [
      faq(
        'Do you work from an existing product or from a blank canvas?',
        'Apakah Kapitech bisa bekerja dari produk yang sudah ada atau mulai dari nol?',
        'Both. We can audit an existing interface and improve it, or build the experience architecture from first principles for a new product.',
        'Keduanya. Kami dapat mengaudit interface yang sudah ada lalu memperbaikinya, atau membangun arsitektur experience dari awal untuk produk baru.',
      ),
      faq(
        'Can you design a system that our internal team can keep extending?',
        'Apakah sistem desainnya bisa dilanjutkan oleh tim internal kami?',
        'Yes. We structure components and tokens so future features can reuse the same rules instead of creating isolated UI patterns.',
        'Bisa. Kami menyusun komponen dan token agar fitur berikutnya dapat memakai aturan yang sama tanpa membuat pola UI terpisah.',
      ),
    ],
    benefits: {
      en: [
        'Give users clearer paths through complex tasks and interfaces',
        'Reduce implementation ambiguity through complete interaction-state coverage',
      ],
      id: [
        'Memberikan alur yang lebih jelas untuk task dan interface yang kompleks',
        'Mengurangi ambiguitas implementasi melalui cakupan interaction state yang lengkap',
      ],
    },
  },

  'website-design': {
    problemsSolutions: [
      problem(
        'Beautiful Pages with Weak Conversion Paths',
        'Halaman Bagus Tetapi Jalur Konversinya Lemah',
        'Visual quality alone does not move visitors when the page hierarchy and calls to action are unclear.',
        'Kualitas visual saja tidak cukup ketika hierarchy halaman dan call to action tidak jelas.',
        'Content-Led Conversion Design',
        'Desain Konversi Berbasis Konten',
        'We structure messaging, proof, navigation, and CTAs around the decisions visitors need to make.',
        'Kami menata messaging, proof, navigasi, dan CTA berdasarkan keputusan yang perlu diambil pengunjung.',
      ),
      problem(
        'Design Cannot Scale into Development',
        'Desain Sulit Diterjemahkan ke Development',
        'A one-off mockup may look polished but still create inconsistent implementation when components are not systemized.',
        'Mockup satu kali bisa terlihat bagus namun tetap menghasilkan implementasi tidak konsisten ketika komponennya tidak disistemkan.',
        'Component-Based Website Design',
        'Desain Website Berbasis Komponen',
        'We design reusable sections, responsive states, and content patterns that can move directly into development.',
        'Kami merancang section reusable, responsive state, dan pola konten yang siap diteruskan ke development.',
      ),
    ],
    capabilities: [
      capability(
        'Information Architecture',
        'Arsitektur Informasi',
        'Clear page hierarchy and navigation structure that helps visitors understand what matters first.',
        'Hierarchy halaman dan struktur navigasi yang jelas agar pengunjung memahami informasi terpenting lebih dulu.',
      ),
      capability(
        'Responsive Design System',
        'Sistem Desain Responsif',
        'Reusable components and layout rules designed for desktop, tablet, and mobile from the start.',
        'Komponen reusable dan aturan layout yang dirancang untuk desktop, tablet, dan mobile sejak awal.',
      ),
    ],
    processStages: [
      stage(
        '03',
        'High-Fidelity Website System',
        'Sistem Website High-Fidelity',
        'Translate the approved hierarchy into a responsive visual system, reusable components, and interaction patterns.',
        'Menerjemahkan hierarchy yang disetujui menjadi sistem visual responsif, komponen reusable, dan interaction pattern.',
        ['Desktop & mobile designs', 'Component library', 'Interaction references'],
        ['Desain desktop & mobile', 'Library komponen', 'Referensi interaksi'],
      ),
      stage(
        '04',
        'Handoff & Build Alignment',
        'Handoff & Alignment Development',
        'Review the final layouts with engineering so design decisions are understood before production starts.',
        'Mereview layout final bersama engineering agar keputusan desain dipahami sebelum produksi dimulai.',
        ['Annotated design files', 'Responsive specs', 'Developer handoff'],
        ['File desain teranotasi', 'Spesifikasi responsif', 'Handoff developer'],
      ),
    ],
    faqs: [
      faq(
        'Do you provide the website copy and content structure too?',
        'Apakah Kapitech juga membantu copy dan struktur konten website?',
        'We can work with your existing copy, refine the structure, or help shape the content hierarchy and section messaging during the design process.',
        'Kami bisa bekerja dari copy yang sudah ada, memperbaiki strukturnya, atau membantu membentuk hierarchy konten dan messaging tiap section.',
      ),
      faq(
        'Can the same design be developed by your engineering team?',
        'Apakah desain yang dibuat bisa langsung dikembangkan oleh tim engineering Kapitech?',
        'Yes. We can continue into development so design intent, responsive behavior, and interaction details remain aligned through launch.',
        'Bisa. Kami dapat melanjutkan ke development agar intent desain, behavior responsif, dan detail interaksi tetap konsisten hingga launch.',
      ),
    ],
  },

  'website-redesign': {
    problemsSolutions: [
      problem(
        'Content and UX Drift Over Time',
        'Konten dan UX Semakin Tidak Terarah',
        'A website that grows without governance accumulates duplicated pages, unclear journeys, and inconsistent messaging.',
        'Website yang terus bertumbuh tanpa governance akan menumpuk halaman duplikat, journey yang tidak jelas, dan messaging yang tidak konsisten.',
        'Structured Content & UX Reset',
        'Reset Struktur Konten & UX',
        'We simplify page hierarchy, consolidate overlapping content, and define clearer journeys before the visual redesign is finalized.',
        'Kami menyederhanakan hierarchy halaman, menggabungkan konten yang tumpang tindih, dan memperjelas journey sebelum visual redesign difinalkan.',
      ),
      problem(
        'Mobile Experience Falls Behind',
        'Pengalaman Mobile Tertinggal',
        'Desktop-first layouts can become difficult to navigate, read, and convert on smaller screens.',
        'Layout desktop-first sering menjadi sulit dinavigasi, dibaca, dan dikonversi pada layar yang lebih kecil.',
        'Mobile-First Responsive Rebuild',
        'Rebuild Responsif Mobile-First',
        'We rethink spacing, hierarchy, interaction, and CTA placement across breakpoints instead of simply shrinking the desktop design.',
        'Kami meninjau ulang spacing, hierarchy, interaksi, dan posisi CTA di setiap breakpoint, bukan sekadar mengecilkan desain desktop.',
      ),
    ],
    capabilities: [
      capability(
        'Content & Information Architecture Review',
        'Review Konten & Arsitektur Informasi',
        'Map existing pages, identify redundancy, and rebuild the structure around user intent.',
        'Memetakan halaman yang ada, menemukan redundansi, dan membangun ulang struktur berdasarkan intent pengguna.',
      ),
      capability(
        'Migration-Aware Visual Redesign',
        'Redesign yang Memperhatikan Migrasi',
        'Design new layouts with redirects, content mapping, and implementation constraints in mind.',
        'Merancang layout baru dengan mempertimbangkan redirect, content mapping, dan constraint implementasi.',
      ),
    ],
    processStages: [
      stage(
        '03',
        'Responsive Redesign System',
        'Sistem Redesign Responsif',
        'Create the new visual language, component patterns, and responsive behaviors for priority templates.',
        'Membangun bahasa visual baru, pola komponen, dan behavior responsif untuk template prioritas.',
        ['Priority page designs', 'Responsive states', 'Reusable component map'],
        ['Desain halaman prioritas', 'State responsif', 'Peta komponen reusable'],
      ),
      stage(
        '04',
        'Migration & Launch Readiness',
        'Migrasi & Kesiapan Launch',
        'Prepare content mapping, redirect considerations, QA scenarios, and launch sequencing for the refreshed site.',
        'Menyiapkan content mapping, pertimbangan redirect, skenario QA, dan urutan launch untuk website baru.',
        ['Migration checklist', 'QA scenario set', 'Launch sequence'],
        ['Checklist migrasi', 'Set skenario QA', 'Urutan launch'],
      ),
    ],
    faqs: [
      faq(
        'Can an existing CMS stay in place during the redesign?',
        'Apakah CMS lama bisa tetap digunakan saat redesign?',
        'Often, yes. We can redesign the front-end while keeping the current CMS, or plan a CMS migration when the existing platform is limiting the experience.',
        'Sering kali bisa. Kami dapat mendesain ulang front-end dengan CMS yang sama, atau merencanakan migrasi jika platform lama sudah membatasi experience.',
      ),
      faq(
        'Will redirects and SEO structure be considered during the redesign?',
        'Apakah redirect dan struktur SEO akan ikut diperhatikan saat redesign?',
        'Yes. Existing URLs, priority pages, metadata, redirects, and content hierarchy should be considered together with the new experience.',
        'Ya. URL yang sudah ada, halaman prioritas, metadata, redirect, dan hierarchy konten perlu dipertimbangkan bersama experience baru.',
      ),
    ],
  },

  'product-ux-ui-audit': {
    problemsSolutions: [
      problem(
        'Teams Disagree on What to Fix First',
        'Tim Tidak Sepakat Mana yang Harus Diperbaiki Lebih Dulu',
        'Product discussions can become opinion-driven when evidence from usability, analytics, and task completion is not combined.',
        'Diskusi product mudah berubah menjadi opini ketika bukti dari usability, analytics, dan task completion tidak digabungkan.',
        'Evidence-Based Prioritization',
        'Prioritas Berbasis Bukti',
        'We combine heuristic findings, user friction, business impact, and implementation effort into a practical prioritization model.',
        'Kami menggabungkan temuan heuristik, friction pengguna, dampak bisnis, dan effort implementasi menjadi model prioritas yang praktis.',
      ),
      problem(
        'Small UX Issues Compound into Revenue Loss',
        'Masalah UX Kecil Menumpuk Menjadi Kerugian',
        'Minor interaction problems across onboarding, search, forms, and checkout can compound into measurable business leakage.',
        'Masalah interaksi kecil pada onboarding, search, form, dan checkout dapat menumpuk menjadi kebocoran bisnis yang terukur.',
        'Friction-to-Impact Mapping',
        'Pemetaan Friction ke Dampak',
        'We connect interface problems to user tasks and business outcomes so recommendations become easier to act on.',
        'Kami menghubungkan masalah interface dengan task pengguna dan outcome bisnis agar rekomendasi lebih mudah dieksekusi.',
      ),
    ],
    capabilities: [
      capability(
        'Analytics & Session Review',
        'Review Analytics & Session',
        'Use available analytics, recordings, funnels, and support signals to identify where users struggle.',
        'Memanfaatkan analytics, recordings, funnel, dan sinyal support yang tersedia untuk menemukan titik kesulitan pengguna.',
      ),
      capability(
        'Executive-Ready Audit Report',
        'Laporan Audit Siap untuk Stakeholder',
        'A prioritized report that connects evidence, screenshots, severity, business impact, and recommended action.',
        'Laporan prioritas yang menghubungkan bukti, screenshot, tingkat keparahan, dampak bisnis, dan rekomendasi aksi.',
      ),
    ],
    processStages: [
      stage(
        '03',
        'Prioritization & Recommendation',
        'Prioritas & Rekomendasi',
        'Group findings by severity, business impact, confidence, and implementation effort.',
        'Mengelompokkan temuan berdasarkan severity, dampak bisnis, confidence, dan effort implementasi.',
        ['Priority matrix', 'Quick-win list', 'Strategic recommendation set'],
        ['Matriks prioritas', 'Daftar quick win', 'Set rekomendasi strategis'],
      ),
      stage(
        '04',
        'Readout & Action Plan',
        'Presentasi Hasil & Action Plan',
        'Walk the team through the findings and define a practical sequence for design and product improvements.',
        'Membahas temuan bersama tim lalu menyusun urutan praktis untuk perbaikan desain dan product.',
        ['Audit presentation', 'Action plan', 'Follow-up workshop options'],
        ['Presentasi audit', 'Action plan', 'Opsi workshop lanjutan'],
      ),
    ],
    faqs: [
      faq(
        'Do you need access to our analytics tools?',
        'Apakah Kapitech membutuhkan akses ke analytics tools kami?',
        'Access helps, but it is not mandatory. We can also conduct a heuristic and interface audit from product access, recordings, screenshots, or documented user issues.',
        'Akses akan membantu, tetapi tidak wajib. Kami juga dapat melakukan audit heuristik dan interface dari akses produk, recording, screenshot, atau dokumentasi masalah pengguna.',
      ),
      faq(
        'Is the audit useful if we already have an internal UX team?',
        'Apakah audit tetap berguna jika kami sudah punya tim UX internal?',
        'Yes. An external audit can provide an independent perspective, benchmark internal assumptions, and help the team prioritize improvements objectively.',
        'Bisa. Audit eksternal dapat memberikan perspektif independen, menguji asumsi internal, dan membantu memprioritaskan perbaikan secara lebih objektif.',
      ),
    ],
  },

  'web-development': {
    problemsSolutions: [
      problem(
        'Feature Delivery Keeps Slowing Down',
        'Delivery Fitur Semakin Lambat',
        'As codebases grow without clear boundaries, seemingly small changes become risky and release cycles get longer.',
        'Saat codebase berkembang tanpa boundary yang jelas, perubahan kecil menjadi berisiko dan release cycle semakin panjang.',
        'Modular Delivery Architecture',
        'Arsitektur Delivery Modular',
        'We establish clearer domain boundaries, reusable components, and deployment practices so teams can ship changes with less regression risk.',
        'Kami membangun boundary domain yang lebih jelas, komponen reusable, dan praktik deployment agar tim dapat merilis perubahan dengan risiko regresi yang lebih kecil.',
      ),
      problem(
        'Production Reliability Is Reactive',
        'Reliability Produksi Masih Reaktif',
        'Without observability, testing, and release discipline, teams discover failures after users encounter them.',
        'Tanpa observability, testing, dan disiplin release, tim baru menemukan masalah setelah pengguna mengalaminya.',
        'Release & Quality Controls',
        'Kontrol Quality & Release',
        'We combine automated checks, environment separation, monitoring, and rollback-aware deployment practices into the delivery workflow.',
        'Kami menggabungkan automated checks, pemisahan environment, monitoring, dan praktik deployment yang mempertimbangkan rollback ke dalam workflow delivery.',
      ),
    ],
    capabilities: [
      capability(
        'Performance & Core Web Vitals',
        'Performance & Core Web Vitals',
        'Optimize rendering, asset delivery, caching, and interaction performance for real user conditions.',
        'Mengoptimalkan rendering, delivery aset, caching, dan performa interaksi untuk kondisi pengguna nyata.',
      ),
      capability(
        'Deployment & Environment Strategy',
        'Strategi Environment & Deployment',
        'Structured local, staging, and production environments with repeatable release practices.',
        'Environment local, staging, dan production yang terstruktur dengan praktik release yang dapat diulang.',
      ),
    ],
    processStages: [
      stage(
        '04',
        'Hardening, Launch & Monitoring',
        'Hardening, Launch & Monitoring',
        'Validate the release under realistic conditions, deploy safely, and establish post-launch checks.',
        'Memvalidasi release dalam kondisi realistis, melakukan deployment secara aman, dan menyiapkan pengecekan pasca-launch.',
        ['Release checklist', 'Production deployment', 'Monitoring handover'],
        ['Checklist release', 'Deployment production', 'Handoff monitoring'],
      ),
    ],
    faqs: [
      faq(
        'Can you work with an existing repository and architecture?',
        'Apakah Kapitech bisa bekerja dengan repository dan arsitektur yang sudah ada?',
        'Yes. We can enter an existing codebase, map the current architecture, identify risk areas, and improve it incrementally rather than forcing a full rewrite.',
        'Bisa. Kami dapat masuk ke codebase yang sudah ada, memetakan arsitektur, menemukan area berisiko, lalu memperbaikinya bertahap tanpa memaksa rewrite total.',
      ),
      faq(
        'Can you deploy and maintain the website after launch?',
        'Apakah Kapitech bisa melakukan deployment dan maintenance setelah launch?',
        'Yes. Depending on scope, we can handle deployment, environment configuration, monitoring, maintenance, and planned improvement cycles.',
        'Bisa. Sesuai scope, kami dapat menangani deployment, konfigurasi environment, monitoring, maintenance, dan improvement cycle berkala.',
      ),
    ],
  },

  'mvp-development': {
    problemsSolutions: [
      problem(
        'Too Many Features Before Validation',
        'Terlalu Banyak Fitur Sebelum Validasi',
        'Teams often spend early budget on features that have not yet proven their user or commercial value.',
        'Tim sering menghabiskan budget awal pada fitur yang belum terbukti memiliki nilai bagi pengguna maupun bisnis.',
        'Milestone-Led MVP Scope',
        'Scope MVP Berbasis Milestone',
        'We define the smallest reliable release that can validate the product while leaving a clear path for the next build phase.',
        'Kami menentukan release minimum yang tetap reliable untuk validasi produk sekaligus menyiapkan jalur jelas ke fase build berikutnya.',
      ),
      problem(
        'Prototype-to-Code Handoffs Lose Momentum',
        'Momentum Hilang Saat Handoff Prototype ke Code',
        'When design and engineering decisions are disconnected, implementation starts with unanswered questions and avoidable rework.',
        'Ketika keputusan desain dan engineering terpisah, implementasi dimulai dengan banyak pertanyaan yang belum terjawab dan rework.',
        'Integrated Design-to-Build Delivery',
        'Delivery Terintegrasi dari Design ke Build',
        'Design decisions, technical constraints, and product milestones are coordinated in the same delivery plan.',
        'Keputusan desain, constraint teknis, dan milestone product dikoordinasikan dalam satu delivery plan.',
      ),
    ],
    capabilities: [
      capability(
        'MVP Architecture Planning',
        'Perencanaan Arsitektur MVP',
        'Define the technical baseline, data boundaries, auth model, and deployment approach for the first release.',
        'Menentukan baseline teknis, boundary data, model auth, dan pendekatan deployment untuk release pertama.',
      ),
      capability(
        'Analytics & Instrumentation',
        'Analytics & Instrumentation',
        'Prepare event tracking and product signals so the MVP can produce useful evidence after launch.',
        'Menyiapkan event tracking dan product signal agar MVP menghasilkan bukti yang berguna setelah launch.',
      ),
    ],
    processStages: [
      stage(
        '03',
        'Core Feature Implementation',
        'Implementasi Fitur Inti',
        'Build the prioritized features in working increments and review them against the agreed milestone scope.',
        'Membangun fitur prioritas dalam increment yang bekerja dan mereview hasilnya terhadap scope milestone.',
        ['Working feature increments', 'Integrated backend services', 'Staging reviews'],
        ['Increment fitur yang berfungsi', 'Service backend terintegrasi', 'Review staging'],
      ),
      stage(
        '04',
        'QA, Launch & Measurement',
        'QA, Launch & Measurement',
        'Test the release, deploy to production, and ensure the first product signals can be measured.',
        'Menguji release, melakukan deployment production, dan memastikan product signal awal dapat diukur.',
        ['QA release', 'Production launch', 'Analytics baseline'],
        ['QA release', 'Launch production', 'Baseline analytics'],
      ),
    ],
    faqs: [
      faq(
        'Can an MVP be designed and developed by the same Kapitech team?',
        'Apakah MVP bisa didesain dan dikembangkan oleh tim Kapitech yang sama?',
        'Yes. We can connect product definition, UX/UI, engineering, QA, and launch so decisions remain aligned throughout the project.',
        'Bisa. Kami dapat menghubungkan product definition, UX/UI, engineering, QA, dan launch agar semua keputusan tetap selaras.',
      ),
      faq(
        'How do you prevent an MVP from becoming an overbuilt product?',
        'Bagaimana Kapitech mencegah MVP berubah menjadi produk yang terlalu kompleks?',
        'We anchor the scope to the product hypothesis, user value, and validation goal, then treat lower-priority features as explicit follow-up milestones.',
        'Kami mengikat scope pada hipotesis produk, user value, dan tujuan validasi, lalu menempatkan fitur prioritas rendah sebagai milestone lanjutan yang eksplisit.',
      ),
    ],
  },

  'landing-page': {
    problemsSolutions: [
      problem(
        'Good Traffic, Weak Lead Quality',
        'Traffic Bagus Tetapi Kualitas Lead Rendah',
        'A landing page can generate clicks without giving visitors enough context or qualification signals before they submit a lead.',
        'Landing page dapat menghasilkan klik tetapi belum memberikan konteks dan sinyal kualifikasi yang cukup sebelum lead masuk.',
        'Intent-Led Conversion Structure',
        'Struktur Konversi Berbasis Intent',
        'We organize proof, offer framing, qualification, objections, and CTA placement around the visitor’s decision journey.',
        'Kami menata proof, offer framing, qualification, objection handling, dan CTA berdasarkan perjalanan keputusan pengunjung.',
      ),
      problem(
        'Campaign Pages Are Hard to Iterate',
        'Halaman Kampanye Sulit Diiterasi',
        'When each campaign needs a custom rebuild, marketing teams move slowly and cannot test hypotheses efficiently.',
        'Ketika setiap kampanye membutuhkan rebuild khusus, tim marketing bergerak lambat dan sulit menguji hipotesis secara efisien.',
        'Reusable Campaign Architecture',
        'Arsitektur Kampanye Reusable',
        'We build reusable page sections and tracking conventions so future campaigns can launch faster.',
        'Kami membangun section reusable dan konvensi tracking agar kampanye berikutnya dapat diluncurkan lebih cepat.',
      ),
    ],
    capabilities: [
      capability(
        'Conversion-Focused Content Structure',
        'Struktur Konten Berfokus Konversi',
        'Hero, proof, objection handling, offer framing, and CTA hierarchy designed around a single conversion goal.',
        'Hero, proof, objection handling, offer framing, dan hierarchy CTA dirancang untuk satu tujuan konversi.',
      ),
      capability(
        'Campaign Analytics Readiness',
        'Kesiapan Analytics Kampanye',
        'Event naming, tracking points, and form attribution planned so performance can be measured after launch.',
        'Penamaan event, tracking point, dan atribusi form disiapkan agar performa dapat diukur setelah launch.',
      ),
    ],
    processStages: [
      stage(
        '03',
        'Responsive Build & Tracking',
        'Build Responsif & Tracking',
        'Implement the page, integrate lead capture, and configure the analytics and attribution points needed by the campaign.',
        'Mengimplementasikan halaman, menghubungkan lead capture, dan menyiapkan analytics serta attribution yang dibutuhkan.',
        ['Responsive page', 'Lead routing', 'Tracking events'],
        ['Halaman responsif', 'Routing lead', 'Event tracking'],
      ),
      stage(
        '04',
        'Launch QA & Optimization',
        'QA Launch & Optimasi',
        'Validate the full conversion path, launch safely, and prepare the page for iterative improvement.',
        'Memvalidasi seluruh conversion path, melakukan launch dengan aman, dan menyiapkan halaman untuk iterasi berikutnya.',
        ['Conversion QA', 'Launch checklist', 'Optimization backlog'],
        ['QA konversi', 'Checklist launch', 'Backlog optimasi'],
      ),
    ],
    faqs: [
      faq(
        'Can a landing page be connected to multiple lead destinations?',
        'Apakah landing page bisa diarahkan ke beberapa tujuan lead sekaligus?',
        'Yes. Depending on the setup, leads can be routed to WhatsApp, email, CRM systems, spreadsheets, or APIs with clear attribution.',
        'Bisa. Sesuai setup, lead dapat diarahkan ke WhatsApp, email, CRM, spreadsheet, atau API dengan attribution yang jelas.',
      ),
      faq(
        'Can we run A/B tests or change campaign sections later?',
        'Apakah landing page bisa dipakai untuk A/B test atau perubahan kampanye berikutnya?',
        'Yes. We can structure the implementation so common sections remain reusable and future experiments are easier to deploy.',
        'Bisa. Kami dapat menyusun implementasi dengan section reusable agar eksperimen berikutnya lebih mudah dilakukan.',
      ),
    ],
  },

  'corporate-websites': {
    problemsSolutions: [
      problem(
        'Too Many Stakeholders, No Content Governance',
        'Terlalu Banyak Stakeholder, Tidak Ada Governance Konten',
        'Corporate websites often slow down because no one owns content models, publishing rules, and approvals.',
        'Website korporat sering melambat karena tidak ada ownership yang jelas untuk model konten, publishing rules, dan approval.',
        'Clear Content Operations',
        'Operasional Konten yang Jelas',
        'We define content structures, permissions, and publishing roles so communication teams can move without engineering bottlenecks.',
        'Kami menetapkan struktur konten, permission, dan role publishing agar tim komunikasi dapat bergerak tanpa bottleneck engineering.',
      ),
      problem(
        'Corporate Content Is Difficult to Discover',
        'Konten Korporat Sulit Ditemukan',
        'Information-heavy sites can bury careers, services, investor information, and newsroom content behind weak navigation and search.',
        'Website dengan informasi padat dapat menyembunyikan informasi karier, layanan, investor, dan newsroom di balik navigasi yang lemah.',
        'Structured Content Discovery',
        'Penemuan Konten yang Terstruktur',
        'We organize information architecture, metadata, internal linking, and page templates around how audiences actually search.',
        'Kami menata arsitektur informasi, metadata, internal linking, dan template halaman berdasarkan cara audiens mencari informasi.',
      ),
    ],
    capabilities: [
      capability(
        'Content Governance & Roles',
        'Governance & Role Konten',
        'Define editorial roles, content schemas, publishing workflows, and approvals for communication teams.',
        'Menentukan role editorial, schema konten, workflow publishing, dan approval untuk tim komunikasi.',
      ),
      capability(
        'SEO & Structured Content',
        'SEO & Structured Content',
        'Page templates, metadata, internal linking, and structured content models designed for search visibility.',
        'Template halaman, metadata, internal linking, dan model konten terstruktur untuk visibilitas pencarian.',
      ),
    ],
    processStages: [
      stage(
        '03',
        'Content Build & CMS Operations',
        'Content Build & Operasional CMS',
        'Populate priority content, validate templates, and configure workflows for the teams who will operate the site.',
        'Mengisi konten prioritas, memvalidasi template, dan mengonfigurasi workflow untuk tim pengelola website.',
        ['Priority content migration', 'Editorial workflow', 'CMS configuration'],
        ['Migrasi konten prioritas', 'Workflow editorial', 'Konfigurasi CMS'],
      ),
      stage(
        '04',
        'Launch, Training & Governance',
        'Launch, Training & Governance',
        'Launch the platform, train internal editors, and establish the rules that keep the site healthy after handover.',
        'Meluncurkan platform, melatih editor internal, dan menetapkan aturan untuk menjaga website tetap sehat setelah handover.',
        ['Launch checklist', 'CMS training', 'Content governance guide'],
        ['Checklist launch', 'Training CMS', 'Panduan governance konten'],
      ),
    ],
    faqs: [
      faq(
        'Can different teams have different content permissions?',
        'Apakah setiap tim bisa memiliki permission konten yang berbeda?',
        'Yes. We can define role-based content permissions and approval workflows based on your organization structure.',
        'Bisa. Kami dapat menentukan permission konten berbasis role dan approval workflow sesuai struktur organisasi Anda.',
      ),
      faq(
        'Can the site support careers, newsroom, investor, and corporate content together?',
        'Apakah website dapat menangani careers, newsroom, investor, dan konten korporat sekaligus?',
        'Yes. We can structure separate content types and templates while keeping one consistent design system and navigation model.',
        'Bisa. Kami dapat membuat content type dan template terpisah dengan tetap mempertahankan satu design system dan model navigasi yang konsisten.',
      ),
    ],
  },

  'wow-websites': {
    problemsSolutions: [
      problem(
        'Visual Effects Hurt Performance',
        'Visual Effect Mengorbankan Performa',
        'Heavy animation and 3D assets can introduce slowdowns, battery drain, and poor mobile experiences when not engineered carefully.',
        'Animasi dan aset 3D yang berat dapat menurunkan performa, menguras baterai, dan merusak experience mobile jika tidak direkayasa dengan baik.',
        'Performance-Aware Experience Design',
        'Experience Design yang Menjaga Performa',
        'We plan the motion language, asset budgets, fallbacks, and loading strategy together so visual impact stays technically responsible.',
        'Kami merencanakan bahasa motion, budget aset, fallback, dan strategi loading secara bersamaan agar visual impact tetap bertanggung jawab secara teknis.',
      ),
      problem(
        'Immersive Interactions Have No Business Role',
        'Interaksi Immersive Tidak Terhubung ke Tujuan Bisnis',
        'A visually impressive experience can still underperform when interactions do not support storytelling, product understanding, or conversion.',
        'Experience yang sangat visual tetap bisa gagal ketika interaksinya tidak membantu storytelling, pemahaman produk, atau konversi.',
        'Purposeful Motion & Interaction',
        'Motion & Interaction yang Punya Tujuan',
        'We use motion to explain, guide, reveal, or reinforce important information rather than adding effects for their own sake.',
        'Kami menggunakan motion untuk menjelaskan, memandu, mengungkap, atau memperkuat informasi penting, bukan sekadar menambah efek.',
      ),
    ],
    capabilities: [
      capability(
        'Device-Aware Performance Fallbacks',
        'Fallback Performa Berbasis Perangkat',
        'Graceful degradation for low-power or constrained devices without breaking the core experience.',
        'Fallback yang tetap menjaga experience pada perangkat dengan resource terbatas.',
      ),
      capability(
        'Motion Narrative & Interaction Direction',
        'Arah Narasi Motion & Interaksi',
        'Define where motion begins, why it exists, and how it supports storytelling and business objectives.',
        'Menentukan di mana motion dimulai, mengapa digunakan, dan bagaimana mendukung storytelling maupun tujuan bisnis.',
      ),
    ],
    processStages: [
      stage(
        '03',
        'Interaction Engineering & Optimization',
        'Engineering Interaksi & Optimasi',
        'Implement interactive motion, shaders, and 3D behaviors while continuously checking real-device performance.',
        'Mengimplementasikan motion interaktif, shader, dan behavior 3D sambil terus mengecek performa di perangkat nyata.',
        ['Interactive experience build', 'Fallback states', 'Performance pass'],
        ['Build experience interaktif', 'State fallback', 'Performance pass'],
      ),
      stage(
        '04',
        'Cross-Device QA & Launch',
        'QA Lintas Perangkat & Launch',
        'Validate visual quality, responsiveness, accessibility basics, and performance across representative devices.',
        'Memvalidasi kualitas visual, responsivitas, basic accessibility, dan performa di berbagai perangkat.',
        ['Cross-device QA', 'Launch optimization', 'Final experience handoff'],
        ['QA lintas perangkat', 'Optimasi launch', 'Handoff experience final'],
      ),
    ],
    faqs: [
      faq(
        'Can an immersive website still be accessible?',
        'Apakah website immersive tetap bisa dibuat accessible?',
        'Yes. Motion should enhance the experience without becoming the only way to understand content. We can also provide reduced-motion and fallback states where appropriate.',
        'Bisa. Motion tidak boleh menjadi satu-satunya cara memahami konten. Kami juga dapat menyiapkan reduced-motion dan fallback state yang sesuai.',
      ),
      faq(
        'Can you optimize an existing 3D website instead of rebuilding it?',
        'Apakah website 3D yang sudah ada bisa dioptimalkan tanpa rebuild total?',
        'Often, yes. We can profile the current experience, identify asset and rendering bottlenecks, and improve the highest-impact areas first.',
        'Sering kali bisa. Kami dapat memprofilkan experience yang ada, menemukan bottleneck aset dan rendering, lalu memperbaiki area yang paling berdampak terlebih dahulu.',
      ),
    ],
  },

};

const businessOutcomeEnhancements: Record<string, { en: string[]; id: string[] }> = {
  'mvp-design': { en: [], id: [] },
  'product-redesign': { en: [], id: [] },
  'team-extension': {
    en: [
      'Add senior design or engineering capacity without rebuilding your internal team structure',
      'Increase delivery bandwidth while keeping ownership and product context close to your team',
    ],
    id: [
      'Menambah kapasitas design atau engineering senior tanpa membangun ulang struktur tim internal',
      'Meningkatkan bandwidth delivery sambil menjaga ownership dan konteks produk tetap dekat dengan tim Anda',
    ],
  },
  'pitch-deck': {
    en: [
      'Present a clearer investment story with stronger hierarchy, proof, and visual consistency',
      'Create a reusable presentation system for fundraising, sales, and executive communication',
    ],
    id: [
      'Menyajikan cerita investasi yang lebih jelas dengan hierarchy, proof, dan konsistensi visual yang lebih kuat',
      'Membangun sistem presentasi reusable untuk fundraising, sales, dan komunikasi eksekutif',
    ],
  },
  'brand-identity': {
    en: [
      'Create a consistent identity that scales across digital, print, campaigns, and internal materials',
      'Reduce design inconsistency by giving teams a practical system they can reuse confidently',
    ],
    id: [
      'Membangun identitas konsisten yang scalable untuk digital, print, campaign, dan materi internal',
      'Mengurangi inkonsistensi desain dengan sistem praktis yang dapat digunakan ulang oleh tim',
    ],
  },
  'rebranding': {
    en: [
      'Refresh market perception while protecting the equity the existing brand has already built',
      'Roll out the new identity through prioritized assets instead of an uncontrolled big-bang migration',
    ],
    id: [
      'Memperbarui persepsi pasar sambil menjaga ekuitas yang sudah dibangun brand sebelumnya',
      'Meluncurkan identitas baru melalui aset prioritas tanpa migrasi besar yang tidak terkontrol',
    ],
  },
  'website-design': {
    en: [
      'Turn brand and business goals into a clear website structure that supports discovery and conversion',
      'Start development with reusable design decisions instead of one-off screens',
    ],
    id: [
      'Menerjemahkan brand dan tujuan bisnis menjadi struktur website yang jelas untuk discovery dan conversion',
      'Memulai development dengan keputusan desain reusable, bukan screen satu kali',
    ],
  },
  'website-redesign': {
    en: [
      'Improve trust, usability, and content clarity without treating the redesign as a purely visual refresh',
      'Reduce migration risk with an implementation plan that accounts for existing content and URLs',
    ],
    id: [
      'Meningkatkan trust, usability, dan kejelasan konten tanpa menjadikan redesign sekadar refresh visual',
      'Mengurangi risiko migrasi dengan rencana implementasi yang mempertimbangkan konten dan URL existing',
    ],
  },
  'product-ux-ui-audit': {
    en: [
      'Give product teams an evidence-based backlog instead of a long list of subjective opinions',
      'Focus limited design and engineering capacity on changes with the clearest user and business impact',
    ],
    id: [
      'Memberikan backlog berbasis bukti alih-alih daftar opini subjektif yang panjang',
      'Memfokuskan kapasitas design dan engineering pada perubahan dengan dampak pengguna dan bisnis yang paling jelas',
    ],
  },
  'web-development': {
    en: [
      'Ship faster with a codebase and release workflow designed for maintainability',
      'Improve production confidence through structured testing, deployment, and monitoring practices',
    ],
    id: [
      'Merilis lebih cepat dengan codebase dan workflow release yang dirancang untuk maintainability',
      'Meningkatkan kepercayaan production melalui testing, deployment, dan monitoring yang terstruktur',
    ],
  },
  'mvp-development': {
    en: [
      'Validate a working product with a focused technical scope instead of overbuilding before learning',
      'Create a production-ready foundation that can continue evolving after the first release',
    ],
    id: [
      'Memvalidasi produk yang berfungsi dengan scope teknis terfokus tanpa overbuilding sebelum mendapat pembelajaran',
      'Membangun fondasi production-ready yang dapat terus berkembang setelah release pertama',
    ],
  },
  'landing-page': {
    en: [
      'Turn paid and organic traffic into clearer conversion journeys with measurable actions',
      'Launch campaign pages faster through reusable sections and tracking conventions',
    ],
    id: [
      'Mengubah traffic berbayar dan organik menjadi conversion journey yang lebih jelas dan terukur',
      'Meluncurkan campaign page lebih cepat melalui section reusable dan konvensi tracking',
    ],
  },
  'corporate-websites': {
    en: [
      'Give corporate audiences a clearer path to services, careers, newsroom, and investor information',
      'Reduce publishing bottlenecks with a content system that internal teams can operate confidently',
    ],
    id: [
      'Memberikan jalur yang lebih jelas bagi audiens ke layanan, careers, newsroom, dan informasi investor',
      'Mengurangi bottleneck publishing dengan sistem konten yang dapat dioperasikan tim internal',
    ],
  },
  'wow-websites': {
    en: [
      'Create a distinctive digital flagship that strengthens brand perception and product storytelling',
      'Deliver immersive interaction with deliberate performance budgets and device-aware fallbacks',
    ],
    id: [
      'Membangun digital flagship yang memperkuat persepsi brand dan product storytelling',
      'Menghadirkan interaksi immersive dengan performance budget dan fallback berbasis perangkat yang terukur',
    ],
  },
  'logo-design': { en: [], id: [] },
  'graphic-design': {
    en: [
      'Produce campaign assets faster with a reusable visual direction and organized asset structure',
      'Keep brand quality consistent across recurring campaigns and multiple production formats',
    ],
    id: [
      'Memproduksi aset kampanye lebih cepat dengan arah visual reusable dan struktur aset yang terorganisir',
      'Menjaga kualitas brand konsisten pada kampanye berulang dan berbagai format produksi',
    ],
  },
};

export const mergeServiceContent = (
  service: ServiceItemData,
  enhancement?: ServiceContentEnhancement,
): ServiceItemData => {
  if (!enhancement) return service;

  const takeMinimum = <T,>(base: T[], extras: T[] | undefined, minimum: number) => {
    const merged = [...base, ...(extras || [])];
    return merged.slice(0, Math.max(minimum, base.length));
  };

  const extraBenefits = enhancement.benefits || businessOutcomeEnhancements[service.slug];
  return {
    ...service,
    problemsSolutions: takeMinimum(service.problemsSolutions, enhancement.problemsSolutions, 3),
    capabilities: takeMinimum(service.capabilities, enhancement.capabilities, 4),
    processStages: takeMinimum(service.processStages, enhancement.processStages, 4),
    faqs: takeMinimum(service.faqs, enhancement.faqs, 3),
    businessOutcomes: {
      ...service.businessOutcomes,
      benefits: takeMinimum(
        service.businessOutcomes.benefits,
        extraBenefits?.en,
        4,
      ),
      benefitsId: takeMinimum(
        service.businessOutcomes.benefitsId,
        extraBenefits?.id,
        4,
      ),
    },
  };
};
