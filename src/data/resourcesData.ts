export type ResourceSection = {
  title: string;
  titleId: string;
  paragraphs: string[];
  paragraphsId: string[];
};

export type ResourceItem = {
  slug: string;
  title: string;
  titleId: string;
  type: string;
  typeId: string;
  summary: string;
  summaryId: string;
  intro: string;
  introId: string;
  sections: ResourceSection[];
};

export const resources: ResourceItem[] = [
  {
    slug: 'website-launch-checklist',
    title: 'Website Launch Checklist',
    titleId: 'Checklist Peluncuran Website',
    type: 'Checklist',
    typeId: 'Checklist',
    summary: 'A practical pre-launch review for teams preparing a corporate, marketing, or product website.',
    summaryId: 'Checklist praktis sebelum launch untuk tim yang menyiapkan website corporate, marketing, atau produk.',
    intro: 'Use this checklist to review the parts of a website that are easy to miss immediately before launch. It is written for business, design, marketing, and engineering teams that need one shared release baseline.',
    introId: 'Gunakan checklist ini untuk meninjau bagian website yang mudah terlewat sebelum launch. Checklist ini ditujukan untuk tim business, design, marketing, dan engineering yang membutuhkan satu baseline release bersama.',
    sections: [
      {
        title: 'Content and messaging',
        titleId: 'Konten dan messaging',
        paragraphs: [
          'Confirm the value proposition is clear in the first viewport and matches the service or product being offered.',
          'Review every headline, CTA, contact detail, legal link, language variant, image caption, and metadata field for consistency.',
          'Remove placeholder copy, stale claims, duplicated sections, and internal notes that should never be public.'
        ],
        paragraphsId: [
          'Pastikan value proposition jelas di viewport pertama dan sesuai dengan layanan atau produk yang ditawarkan.',
          'Periksa semua headline, CTA, detail kontak, link legal, varian bahasa, caption gambar, dan metadata agar konsisten.',
          'Hapus copy placeholder, klaim lama, section duplikat, dan catatan internal yang tidak boleh tampil ke publik.'
        ]
      },
      {
        title: 'Forms and conversion paths',
        titleId: 'Form dan jalur konversi',
        paragraphs: [
          'Submit every public form from desktop and mobile and confirm that validation, loading, success, and failure states are understandable.',
          'Verify that every primary CTA reaches a working destination and that high-intent visitors have a clear path to contact, consultation, or inquiry.'
        ],
        paragraphsId: [
          'Kirim semua form publik dari desktop dan mobile lalu pastikan state validation, loading, success, dan failure mudah dipahami.',
          'Pastikan setiap CTA utama menuju tujuan yang berfungsi dan pengunjung dengan intent tinggi memiliki jalur yang jelas menuju kontak, konsultasi, atau inquiry.'
        ]
      },
      {
        title: 'Technical release checks',
        titleId: 'Pemeriksaan teknis release',
        paragraphs: [
          'Test the production build on current Chromium, Safari, and Firefox environments where possible.',
          'Verify canonical URLs, robots directives, sitemap generation, social metadata, structured data, and 404 handling.',
          'Confirm that analytics and optional tracking only initialise according to the site consent model.'
        ],
        paragraphsId: [
          'Uji production build pada lingkungan Chromium, Safari, dan Firefox yang relevan bila memungkinkan.',
          'Periksa canonical URL, robots directive, pembuatan sitemap, social metadata, structured data, dan penanganan 404.',
          'Pastikan analytics dan tracking opsional hanya aktif sesuai model consent website.'
        ]
      },
      {
        title: 'Accessibility and performance',
        titleId: 'Accessibility dan performance',
        paragraphs: [
          'Check keyboard navigation, visible focus, dialog focus trapping, semantic headings, useful alternative text, contrast, reduced-motion behaviour, and mobile tap targets.',
          'Review image sizes, lazy-loading behaviour, font loading, layout shifts, and the amount of JavaScript executed before the page becomes usable.'
        ],
        paragraphsId: [
          'Periksa navigasi keyboard, focus yang terlihat, focus trap pada dialog, heading semantik, alternative text, contrast, perilaku reduced motion, dan ukuran tap target mobile.',
          'Periksa ukuran gambar, lazy loading, font loading, layout shift, dan jumlah JavaScript yang dieksekusi sebelum halaman siap digunakan.'
        ]
      }
    ]
  },
  {
    slug: 'mvp-discovery-checklist',
    title: 'MVP Discovery Checklist',
    titleId: 'Checklist Discovery MVP',
    type: 'Product',
    typeId: 'Produk',
    summary: 'A structured starting point for founders and teams defining an MVP before design and engineering begin.',
    summaryId: 'Kerangka awal untuk founder dan tim yang sedang menentukan MVP sebelum design dan engineering dimulai.',
    intro: 'The purpose of discovery is not to document everything a future product might become. The purpose is to create enough clarity to make a sensible first release decision.',
    introId: 'Tujuan discovery bukan mendokumentasikan semua kemungkinan produk di masa depan. Tujuannya adalah membangun kejelasan yang cukup untuk mengambil keputusan release pertama dengan masuk akal.',
    sections: [
      {
        title: 'Problem definition',
        titleId: 'Definisi masalah',
        paragraphs: [
          'State the user problem in observable terms and identify who experiences it most frequently.',
          'Document the current workaround, why it is insufficient, and what evidence suggests the problem matters.'
        ],
        paragraphsId: [
          'Jelaskan masalah pengguna dalam bentuk yang dapat diamati dan tentukan siapa yang paling sering mengalaminya.',
          'Catat solusi sementara yang sekarang digunakan, alasan solusi tersebut belum cukup, dan bukti bahwa masalahnya memang penting.'
        ]
      },
      {
        title: 'User and workflow',
        titleId: 'Pengguna dan workflow',
        paragraphs: [
          'Identify the primary user, the trigger that starts the journey, the critical decision points, and the minimum successful outcome.',
          'Separate must-have workflow steps from convenience features that can remain outside the first release.'
        ],
        paragraphsId: [
          'Tentukan pengguna utama, pemicu perjalanan, titik keputusan penting, dan hasil minimum yang dianggap berhasil.',
          'Pisahkan langkah workflow yang wajib dari fitur tambahan yang masih bisa ditunda setelah release pertama.'
        ]
      },
      {
        title: 'Scope and validation',
        titleId: 'Scope dan validasi',
        paragraphs: [
          'Define what the MVP will prove, what evidence will count as success, and what assumptions remain uncertain.',
          'Map dependencies such as integrations, authentication, payments, data sources, compliance requirements, and operational support.'
        ],
        paragraphsId: [
          'Tentukan apa yang harus dibuktikan MVP, bukti apa yang dianggap berhasil, dan asumsi apa yang masih belum pasti.',
          'Petakan dependency seperti integrasi, authentication, pembayaran, sumber data, kebutuhan compliance, dan support operasional.'
        ]
      },
      {
        title: 'Delivery readiness',
        titleId: 'Kesiapan delivery',
        paragraphs: [
          'Create an agreed backlog, delivery milestone structure, acceptance criteria, ownership model, and review cadence before production work begins.'
        ],
        paragraphsId: [
          'Buat backlog yang disepakati, struktur milestone delivery, acceptance criteria, ownership model, dan jadwal review sebelum pekerjaan produksi dimulai.'
        ]
      }
    ]
  },
  {
    slug: 'ux-audit-checklist',
    title: 'UX Audit Checklist',
    titleId: 'Checklist Audit UX',
    type: 'UX',
    typeId: 'UX',
    summary: 'A focused heuristic review framework for finding usability friction across important product journeys.',
    summaryId: 'Kerangka review heuristik untuk menemukan hambatan usability pada journey produk yang penting.',
    intro: 'This framework helps teams inspect an interface systematically before deciding which improvements deserve design or engineering investment.',
    introId: 'Kerangka ini membantu tim memeriksa interface secara sistematis sebelum menentukan improvement mana yang layak mendapat investasi design atau engineering.',
    sections: [
      {
        title: 'Navigation and information architecture',
        titleId: 'Navigasi dan information architecture',
        paragraphs: [
          'Check whether users can understand where they are, what the next action is, and how to recover when they reach the wrong place.',
          'Review naming, grouping, hierarchy, search, filtering, breadcrumbs, and the consistency of navigation patterns.'
        ],
        paragraphsId: [
          'Periksa apakah pengguna memahami posisi mereka, tindakan berikutnya, dan cara kembali ketika berada di tempat yang salah.',
          'Periksa naming, grouping, hierarchy, search, filtering, breadcrumbs, dan konsistensi pola navigasi.'
        ]
      },
      {
        title: 'Interaction quality',
        titleId: 'Kualitas interaksi',
        paragraphs: [
          'Inspect form states, loading behaviour, empty states, error recovery, confirmation patterns, modal behaviour, and keyboard interactions.',
          'Look for controls that are technically clickable but visually or semantically ambiguous.'
        ],
        paragraphsId: [
          'Periksa state form, loading, empty state, pemulihan error, pola konfirmasi, perilaku modal, dan interaksi keyboard.',
          'Cari control yang sebenarnya bisa diklik tetapi secara visual atau semantik masih membingungkan.'
        ]
      },
      {
        title: 'Content and accessibility',
        titleId: 'Konten dan accessibility',
        paragraphs: [
          'Check heading hierarchy, label clarity, readable line length, contrast, focus states, touch targets, motion, and alternative text.',
          'Review whether critical information depends on colour alone or on interactions that are difficult to discover.'
        ],
        paragraphsId: [
          'Periksa hierarchy heading, kejelasan label, panjang baris, contrast, focus state, touch target, motion, dan alternative text.',
          'Periksa apakah informasi penting hanya bergantung pada warna atau interaksi yang sulit ditemukan.'
        ]
      },
      {
        title: 'Business friction',
        titleId: 'Hambatan bisnis',
        paragraphs: [
          'Identify where users abandon a key journey, encounter unnecessary steps, or lack confidence about what happens after submitting an action.'
        ],
        paragraphsId: [
          'Identifikasi titik ketika pengguna meninggalkan journey utama, menemukan langkah yang tidak perlu, atau tidak yakin apa yang terjadi setelah mengirim suatu tindakan.'
        ]
      }
    ]
  },
  {
    slug: 'digital-project-brief-template',
    title: 'Digital Project Brief Template',
    titleId: 'Template Digital Project Brief',
    type: 'Template',
    typeId: 'Template',
    summary: 'A concise project-brief structure to help teams prepare a useful first conversation with a digital agency.',
    summaryId: 'Struktur project brief ringkas untuk membantu tim menyiapkan percakapan awal yang lebih efektif dengan digital agency.',
    intro: 'A strong project brief gives a delivery team context without pretending that every requirement is already known. Keep the information practical and state uncertainty where it exists.',
    introId: 'Project brief yang baik memberi konteks kepada delivery team tanpa berpura-pura bahwa semua requirement sudah pasti. Gunakan informasi yang praktis dan nyatakan bagian yang masih belum pasti.',
    sections: [
      {
        title: 'Business context',
        titleId: 'Konteks bisnis',
        paragraphs: [
          'Describe the organisation, the business objective, why the project matters now, and the outcome the business needs.'
        ],
        paragraphsId: [
          'Jelaskan organisasi, tujuan bisnis, alasan proyek penting saat ini, dan hasil yang dibutuhkan bisnis.'
        ]
      },
      {
        title: 'Users and scope',
        titleId: 'Pengguna dan scope',
        paragraphs: [
          'Describe the primary audience, the core workflow, the products or pages involved, and anything that is explicitly out of scope.'
        ],
        paragraphsId: [
          'Jelaskan target audience utama, workflow inti, produk atau halaman yang terlibat, serta hal yang secara jelas berada di luar scope.'
        ]
      },
      {
        title: 'Requirements and constraints',
        titleId: 'Requirement dan constraint',
        paragraphs: [
          'List known integrations, technical requirements, platforms, data considerations, content ownership, compliance constraints, deadlines, and operational dependencies.'
        ],
        paragraphsId: [
          'Cantumkan integrasi, kebutuhan teknis, platform, pertimbangan data, kepemilikan konten, constraint compliance, deadline, dan dependency operasional yang sudah diketahui.'
        ]
      },
      {
        title: 'Success and next steps',
        titleId: 'Success dan next steps',
        paragraphs: [
          'State how the team will know the project is working and identify the decision makers, review process, target milestone, and preferred next step.'
        ],
        paragraphsId: [
          'Jelaskan bagaimana tim mengetahui proyek berjalan sesuai tujuan dan tentukan decision maker, proses review, milestone target, serta langkah berikutnya yang diinginkan.'
        ]
      }
    ]
  },
  {
    slug: 'corporate-website-rfp-guide',
    title: 'Corporate Website RFP Guide',
    titleId: 'Panduan RFP Website Corporate',
    type: 'Guide',
    typeId: 'Panduan',
    summary: 'A buyer-side guide for comparing website partners without turning the RFP into a list of technology buzzwords.',
    summaryId: 'Panduan dari sisi buyer untuk membandingkan partner website tanpa mengubah RFP menjadi daftar buzzword teknologi.',
    intro: 'A useful RFP gives agencies enough context to propose the right solution while preserving room for professional judgement. Focus on outcomes, constraints, responsibilities, and acceptance criteria.',
    introId: 'RFP yang berguna memberi agency konteks yang cukup untuk mengusulkan solusi yang tepat tanpa menghilangkan ruang untuk judgement profesional. Fokus pada outcome, constraint, tanggung jawab, dan acceptance criteria.',
    sections: [
      {
        title: 'What to include',
        titleId: 'Apa yang perlu dicantumkan',
        paragraphs: [
          'Explain the current business problem, the audiences involved, the current website limitations, required content, integrations, expected traffic patterns, and internal ownership.'
        ],
        paragraphsId: [
          'Jelaskan masalah bisnis saat ini, audience yang terlibat, keterbatasan website sekarang, konten yang dibutuhkan, integrasi, pola traffic yang diharapkan, dan ownership internal.'
        ]
      },
      {
        title: 'How to compare proposals',
        titleId: 'Cara membandingkan proposal',
        paragraphs: [
          'Compare understanding of the problem, proposed information architecture, delivery process, QA approach, governance, post-launch support, relevant case studies, and clarity of assumptions.'
        ],
        paragraphsId: [
          'Bandingkan pemahaman terhadap masalah, information architecture yang diusulkan, proses delivery, pendekatan QA, governance, post-launch support, case study yang relevan, dan kejelasan asumsi.'
        ]
      },
      {
        title: 'Questions worth asking',
        titleId: 'Pertanyaan yang penting ditanyakan',
        paragraphs: [
          'Ask who will actually work on the account, how scope changes are handled, how QA is performed, how accessibility is addressed, how technical decisions are documented, and what happens after launch.'
        ],
        paragraphsId: [
          'Tanyakan siapa yang benar-benar mengerjakan account, bagaimana perubahan scope ditangani, bagaimana QA dilakukan, bagaimana accessibility diperhatikan, bagaimana keputusan teknis didokumentasikan, dan apa yang terjadi setelah launch.'
        ]
      },
      {
        title: 'Commercial clarity',
        titleId: 'Kejelasan komersial',
        paragraphs: [
          'Request a clear description of what is included, what is excluded, milestone structure, payment assumptions, dependencies, and ongoing support options.'
        ],
        paragraphsId: [
          'Minta penjelasan yang jelas tentang apa yang termasuk, apa yang tidak termasuk, struktur milestone, asumsi pembayaran, dependency, dan opsi support berkelanjutan.'
        ]
      }
    ]
  }
];
