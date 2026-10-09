import type { ProjectItem } from '../data/projectsData';

export interface CaseStudyNarrativeLine {
  title: string;
  body: string;
}

export interface CaseStudyNarrative {
  context: string;
  contextDetails: CaseStudyNarrativeLine[];
  challenge: string;
  diagnosis: CaseStudyNarrativeLine[];
  objectives: string[];
  solution: string;
  solutionLogic: CaseStudyNarrativeLine[];
  process: CaseStudyNarrativeLine[];
  deliverables: CaseStudyNarrativeLine[];
  technologies: CaseStudyNarrativeLine[];
  impact: string;
  impactDetails: CaseStudyNarrativeLine[];
  evidenceNote: string;
  relevance: string;
}

interface LocalizedPlaybook {
  context: string;
  objective: string[];
  diagnosis: CaseStudyNarrativeLine[];
  decisions: CaseStudyNarrativeLine[];
  process: CaseStudyNarrativeLine[];
  relevance: string;
}

interface ServicePlaybook {
  en: LocalizedPlaybook;
  id: LocalizedPlaybook;
}

const servicePlaybooks: Record<ProjectItem['service'], ServicePlaybook> = {
  'UI/UX Design': {
    en: {
      context: 'This work sits at the intersection of task clarity, interface behaviour, and a consistent system that product and engineering teams can continue using. The key question is not only how a screen looks, but whether people can understand what to do, recover from mistakes, and complete the important task with less uncertainty.',
      objective: [
        'Make the highest-priority user journey understandable from entry to completion.',
        'Give important actions, statuses, errors, and next steps a predictable visual hierarchy.',
        'Create reusable interface patterns so new screens do not need to be designed from scratch.',
        'Make the design handoff specific enough for implementation rather than leaving interaction behaviour open to interpretation.'
      ],
      diagnosis: [
        { title: 'Locate the point of friction', body: 'The recorded challenge identifies the part of the journey where users or operators encounter unnecessary effort. That point becomes the primary design problem, rather than treating every screen as an isolated visual task.' },
        { title: 'Make states and decisions visible', body: 'A usable flow must account for more than the ideal path. The interface needs to make progress, confirmation, pending states, exceptions, and the next action legible wherever they are relevant to the recorded scope.' },
        { title: 'Balance density with comprehension', body: 'The solution has to respect the amount of information the user needs without making every item compete for attention. Hierarchy, spacing, grouping, and interaction priority work together to reduce scanning effort.' }
      ],
      decisions: [
        { title: 'Design the journey before decorating screens', body: 'The solution should be judged against the user task it is meant to support. Journey and interaction decisions provide the logic for the screen layout, not the other way around.' },
        { title: 'Use reusable patterns for repeated tasks', body: 'Repeated controls, status indicators, forms, tables, or transaction patterns should behave consistently. A shared component language lowers the cost of refinement and implementation across the product.' },
        { title: 'Treat handoff as part of the design', body: 'A screen is not implementation-ready merely because it looks finished. Interaction details, responsive behaviour, states, and reusable tokens need to be clear enough for engineering to build the same experience.' }
      ],
      process: [
        { title: '01 · Frame the user problem', body: 'Start from the documented challenge and identify the task that currently costs users the most effort. Define what the interface must make clearer, faster, safer, or easier to understand before proposing a visual treatment.' },
        { title: '02 · Structure the journey and information', body: 'Organise the required steps, decision points, and information hierarchy. Remove unnecessary choices where the documented scope allows it, and make the expected next action explicit at each critical point.' },
        { title: '03 · Design and prototype interaction states', body: 'Translate the selected solution into interface patterns and interactive states. The prototype and user-flow deliverables named in the project record make the intended journey reviewable before it is handed to implementation.' },
        { title: '04 · Package the system for implementation', body: 'Consolidate components, design tokens, interaction specifications, and handoff notes into reusable references. This helps the client team maintain consistency when the product grows beyond the screens shown in the initial scope.' }
      ],
      relevance: 'This case is most useful to teams improving a product with complex journeys, dense information, multiple user roles, or an interface that needs to scale without becoming inconsistent.'
    },
    id: {
      context: 'Pekerjaan ini berada di antara kejelasan tugas pengguna, perilaku antarmuka, dan sistem desain yang tetap bisa digunakan oleh tim produk maupun developer setelah proyek selesai. Pertanyaannya bukan hanya bagaimana layar terlihat, tetapi apakah pengguna paham apa yang harus dilakukan, bisa memperbaiki kesalahan, dan dapat menyelesaikan tugas utama tanpa banyak keraguan.',
      objective: [
        'Membuat alur pengguna utama mudah dipahami dari awal sampai selesai.',
        'Memberi hierarki visual yang konsisten untuk aksi, status, pesan kesalahan, dan langkah berikutnya.',
        'Menyusun pola antarmuka yang dapat dipakai ulang agar layar baru tidak selalu dimulai dari nol.',
        'Membuat handoff cukup spesifik untuk diimplementasikan, bukan membiarkan perilaku interaksi hanya berdasarkan asumsi developer.'
      ],
      diagnosis: [
        { title: 'Menemukan titik hambatan', body: 'Tantangan yang tercatat mengidentifikasi bagian perjalanan pengguna yang menambah usaha atau kebingungan. Titik ini menjadi masalah desain utama, bukan memperlakukan semua layar sebagai pekerjaan visual yang berdiri sendiri.' },
        { title: 'Memperjelas status dan keputusan', body: 'Alur yang baik tidak hanya memikirkan jalur ideal. Progres, konfirmasi, status tertunda, kondisi pengecualian, dan tindakan berikutnya perlu terlihat jelas sesuai ruang lingkup proyek.' },
        { title: 'Menyeimbangkan kepadatan informasi', body: 'Antarmuka perlu menampilkan informasi yang diperlukan tanpa membuat semua elemen saling berebut perhatian. Hierarki, jarak, pengelompokan, dan prioritas interaksi perlu bekerja sebagai satu sistem.' }
      ],
      decisions: [
        { title: 'Merancang alur sebelum mempercantik layar', body: 'Solusi harus dinilai dari tugas pengguna yang ingin diselesaikan. Keputusan tentang perjalanan dan interaksi menjadi dasar tata letak layar, bukan sebaliknya.' },
        { title: 'Menggunakan pola yang konsisten untuk tugas berulang', body: 'Kontrol, indikator status, formulir, tabel, atau pola transaksi yang berulang perlu memiliki perilaku yang konsisten. Sistem komponen bersama memudahkan penyempurnaan dan implementasi di seluruh produk.' },
        { title: 'Menjadikan handoff bagian dari desain', body: 'Layar yang terlihat selesai belum otomatis siap diimplementasikan. Detail interaksi, perilaku responsif, berbagai status, dan token yang dapat dipakai ulang harus jelas bagi developer.' }
      ],
      process: [
        { title: '01 · Merumuskan masalah pengguna', body: 'Mulai dari tantangan yang tercatat dan tentukan tugas yang paling banyak menimbulkan hambatan. Tetapkan hal yang perlu dibuat lebih jelas, cepat, aman, atau mudah dipahami sebelum memilih tampilan visual.' },
        { title: '02 · Menata alur dan informasi', body: 'Susun langkah, titik pengambilan keputusan, dan hierarki informasi. Kurangi pilihan yang tidak perlu jika ruang lingkup memungkinkan, lalu pastikan tindakan berikutnya jelas pada setiap titik penting.' },
        { title: '03 · Mendesain dan membuat prototipe interaksi', body: 'Terjemahkan solusi ke dalam pola antarmuka dan status interaksi. Deliverable prototipe dan user flow yang tercatat membantu tim meninjau maksud desain sebelum masuk ke implementasi.' },
        { title: '04 · Menyiapkan sistem untuk implementasi', body: 'Konsolidasikan komponen, token desain, spesifikasi interaksi, dan catatan handoff menjadi referensi yang dapat digunakan kembali. Ini membantu tim klien menjaga konsistensi ketika produk berkembang.' }
      ],
      relevance: 'Studi kasus ini paling relevan bagi tim yang sedang memperbaiki alur produk yang kompleks, informasi yang padat, banyak peran pengguna, atau antarmuka yang perlu berkembang tanpa kehilangan konsistensi.'
    }
  },
  'Video Production': {
    en: {
      context: 'A production case must connect a creative idea to what can actually be planned, captured, edited, and delivered. The visual treatment, location or environment, camera choices, sound, colour, and final formats need to support the same message instead of competing with one another.',
      objective: [
        'Translate the required brand or story impression into a clear visual direction.',
        'Plan capture and production choices around the environments and conditions named in the brief.',
        'Keep picture, sound, pacing, and colour treatment consistent through post-production.',
        'Deliver a master plus the required cut-downs or supporting assets for the intended channels.'
      ],
      diagnosis: [
        { title: 'Define the visual promise', body: 'The brief describes the mood or story the film must communicate. That promise is the standard against which framing, movement, light, sound, and editing decisions should be evaluated.' },
        { title: 'Plan around production conditions', body: 'Locations, movement, changing light, acoustic conditions, and access can affect what is realistically captured. The chosen production approach needs to support the visual ambition while respecting the conditions recorded for the project.' },
        { title: 'Design the edit for more than one screen', body: 'A master film and short-form edits serve different viewing contexts. Their pacing, opening moments, framing, and duration need to remain coherent without simply cropping the same timeline blindly.' }
      ],
      decisions: [
        { title: 'Let storyboarding guide the shoot', body: 'A sequence plan translates the concept into shots, transitions, and coverage requirements. This helps align the crew around what each scene must communicate and reduces reliance on improvisation in post-production.' },
        { title: 'Match capture tools to the scene', body: 'Camera movement, lens choice, stabilisation, aerial capture, and lighting should be selected for the action and atmosphere required by the project, not used as decoration.' },
        { title: 'Finish picture and sound as one piece', body: 'Colour grading, sound design, music, dialogue, and transitions must support one another. Technical finishing is part of the storytelling, not merely an export step.' }
      ],
      process: [
        { title: '01 · Concept and visual direction', body: 'Translate the required feeling and message into a creative premise, reference direction, and sequence outline. The objective is to give the project a coherent visual point of view before production begins.' },
        { title: '02 · Pre-production and shot planning', body: 'Turn the sequence into a practical plan covering scenes, locations, movement, equipment, sound requirements, and coverage. This is the stage where production risks can be identified before they affect the shoot.' },
        { title: '03 · Capture the planned story', body: 'Capture the material required by the concept, paying attention to continuity, exposure, motion, usable sound, and enough coverage for the intended edit. The specific capture techniques follow the solution and scope recorded for this project.' },
        { title: '04 · Edit, grade, sound, and package', body: 'Build the narrative in the edit, refine pacing, complete colour and audio finishing, then prepare the master and listed versions. Each output should preserve the campaign idea while fitting its own delivery requirement.' }
      ],
      relevance: 'This case is relevant when a brand needs a film that feels intentional from concept through final grade, especially when production conditions and multiple delivery formats need to be managed together.'
    },
    id: {
      context: 'Studi kasus produksi video perlu menghubungkan ide kreatif dengan hal yang benar-benar dapat direncanakan, direkam, diedit, dan diserahkan. Arah visual, lokasi, pilihan kamera, suara, warna, dan format akhir harus mendukung pesan yang sama, bukan berjalan sendiri-sendiri.',
      objective: [
        'Menerjemahkan kesan brand atau cerita yang dibutuhkan menjadi arah visual yang jelas.',
        'Merencanakan pengambilan gambar sesuai lingkungan dan kondisi yang disebut dalam brief.',
        'Menjaga konsistensi visual, suara, tempo, dan warna selama pascaproduksi.',
        'Menyiapkan master video serta versi pendek atau aset pendukung untuk kanal yang dituju.'
      ],
      diagnosis: [
        { title: 'Menentukan janji visual', body: 'Brief menjelaskan suasana atau cerita yang harus disampaikan film. Hal itu menjadi acuan saat menentukan framing, pergerakan kamera, pencahayaan, suara, dan keputusan editing.' },
        { title: 'Merencanakan kondisi produksi', body: 'Lokasi, pergerakan, perubahan cahaya, akustik, dan akses dapat memengaruhi materi yang bisa direkam. Pendekatan produksi harus mendukung tujuan visual sekaligus memperhitungkan kondisi yang tercatat pada proyek.' },
        { title: 'Merancang editing untuk beberapa layar', body: 'Film utama dan versi pendek digunakan dalam konteks yang berbeda. Tempo, pembuka, framing, dan durasinya perlu disesuaikan tanpa sekadar memotong timeline yang sama secara sembarangan.' }
      ],
      decisions: [
        { title: 'Menjadikan storyboard panduan syuting', body: 'Rencana adegan menerjemahkan konsep menjadi shot, transisi, dan kebutuhan footage. Ini menyamakan pemahaman tim tentang fungsi setiap adegan serta mengurangi ketergantungan pada improvisasi saat editing.' },
        { title: 'Menyesuaikan perangkat dengan adegan', body: 'Pergerakan kamera, lensa, stabilisasi, pengambilan aerial, dan pencahayaan dipilih berdasarkan aksi dan suasana yang dibutuhkan, bukan sekadar sebagai efek dekoratif.' },
        { title: 'Menyelesaikan gambar dan suara sebagai satu kesatuan', body: 'Color grading, desain suara, musik, dialog, dan transisi harus saling mendukung. Finishing teknis adalah bagian dari penyampaian cerita, bukan hanya tahap ekspor.' }
      ],
      process: [
        { title: '01 · Konsep dan arah visual', body: 'Terjemahkan kesan dan pesan yang dibutuhkan menjadi ide kreatif, referensi visual, dan garis besar adegan. Tujuannya adalah menetapkan sudut pandang visual yang konsisten sebelum produksi dimulai.' },
        { title: '02 · Pra-produksi dan perencanaan shot', body: 'Ubah urutan adegan menjadi rencana praktis yang mencakup lokasi, pergerakan, peralatan, kebutuhan suara, dan cakupan gambar. Tahap ini membantu menemukan risiko sebelum memengaruhi proses syuting.' },
        { title: '03 · Pengambilan materi cerita', body: 'Rekam materi yang dibutuhkan dengan memperhatikan kontinuitas, eksposur, gerakan, kualitas suara, dan footage pendukung untuk editing. Teknik yang dipakai mengikuti solusi dan ruang lingkup yang tercatat pada proyek.' },
        { title: '04 · Editing, grading, audio, dan penyerahan', body: 'Susun narasi dalam editing, sempurnakan tempo, tuntaskan warna dan audio, lalu siapkan master serta versi yang tercantum pada ruang lingkup. Setiap output harus menjaga ide kampanye sekaligus sesuai kebutuhan formatnya.' }
      ],
      relevance: 'Studi kasus ini relevan ketika brand membutuhkan film yang terarah dari konsep sampai final grade, terutama jika kondisi produksi dan beberapa format output harus dikelola bersama.'
    }
  },
  '2D Animation': {
    en: {
      context: 'Animation is useful when an idea, process, or message is difficult to show with live action alone. The work needs to turn the source information into a visual sequence whose language, timing, transitions, and sound make the message easier to follow.',
      objective: [
        'Reduce the conceptual distance between the topic and the intended audience.',
        'Use a consistent visual language for characters, diagrams, typography, and transitions.',
        'Make pacing serve comprehension instead of adding movement without a purpose.',
        'Prepare the listed episodes, motion assets, source files, and format variations for their intended use.'
      ],
      diagnosis: [
        { title: 'Find the idea viewers must understand', body: 'The documented challenge points to information that is abstract, technical, or easy to misunderstand. The animation must prioritise the concept that the viewer needs to retain, not animate every detail equally.' },
        { title: 'Choose a visual metaphor that helps', body: 'Character, shape, typography, diagrams, and transitions need a clear relationship with the subject. Visual devices should clarify sequence, scale, cause, or comparison rather than become unrelated decoration.' },
        { title: 'Control information density and timing', body: 'The viewer needs time to read, connect, and remember each point. Scene duration, text volume, motion speed, and transitions therefore need to follow the complexity of the message.' }
      ],
      decisions: [
        { title: 'Build a visual explanation, not just moving artwork', body: 'Each scene should have a job: introduce an idea, connect steps, compare states, or reinforce the message. This makes the result easier to follow and gives editing a clear purpose.' },
        { title: 'Keep the visual system reusable', body: 'Characters, icons, typography, colours, and motion rules should be consistent across episodes and formats. Reusable source assets also make later updates easier when information changes.' },
        { title: 'Deliver assets in the formats the product needs', body: 'A rendered video, an in-app animation, and an editable source package have different technical requirements. The final export should match the use case listed in the delivery scope.' }
      ],
      process: [
        { title: '01 · Break down the message', body: 'Separate the source material into a logical sequence of ideas. Identify what has to be explained first, what requires an example, and what should remain visible long enough to be understood.' },
        { title: '02 · Establish storyboard and visual language', body: 'Translate the explanation into scenes, composition, character or diagram behaviour, typography, and transitions. The storyboard provides a reviewable structure before the animation becomes expensive to change.' },
        { title: '03 · Animate, time, and refine', body: 'Build the movement according to the intended meaning, then refine timing, easing, transitions, and audio relationships. Motion should direct attention and clarify the message rather than compete with it.' },
        { title: '04 · Export and organise the asset set', body: 'Prepare the listed episode masters, short-form variants, vector or JSON files, and source assets as applicable. Consistent naming, dimensions, and delivery formats make the work more useful to teams that publish or maintain it.' }
      ],
      relevance: 'This case is relevant when complex instructions, educational content, product explanations, or brand stories need to become easier to understand across video and digital interfaces.'
    },
    id: {
      context: 'Animasi berguna ketika ide, proses, atau pesan sulit ditampilkan hanya dengan video nyata. Pekerjaan ini perlu mengubah informasi sumber menjadi urutan visual yang bahasa, tempo, transisi, dan suaranya membantu audiens mengikuti penjelasan.',
      objective: [
        'Mendekatkan konsep yang sulit dengan pemahaman audiens yang dituju.',
        'Menjaga bahasa visual yang konsisten untuk karakter, diagram, tipografi, dan transisi.',
        'Menggunakan tempo untuk membantu pemahaman, bukan menambah gerakan tanpa tujuan.',
        'Menyiapkan episode, aset motion, file sumber, dan variasi format yang tercantum pada ruang lingkup.'
      ],
      diagnosis: [
        { title: 'Menentukan konsep yang harus dipahami', body: 'Tantangan yang tercatat menunjukkan informasi yang abstrak, teknis, atau mudah disalahpahami. Animasi perlu memprioritaskan konsep yang harus diingat audiens, bukan memberi bobot yang sama pada setiap detail.' },
        { title: 'Memilih metafora visual yang membantu', body: 'Karakter, bentuk, tipografi, diagram, dan transisi perlu memiliki hubungan yang jelas dengan topik. Elemen visual harus menjelaskan urutan, skala, sebab, atau perbandingan, bukan menjadi dekorasi yang tidak terkait.' },
        { title: 'Mengendalikan kepadatan dan tempo', body: 'Audiens membutuhkan waktu untuk membaca, menghubungkan, dan mengingat setiap poin. Durasi adegan, jumlah teks, kecepatan gerak, dan transisi harus menyesuaikan tingkat kerumitan pesan.' }
      ],
      decisions: [
        { title: 'Membangun penjelasan visual, bukan sekadar gambar bergerak', body: 'Setiap adegan perlu memiliki fungsi: memperkenalkan ide, menghubungkan langkah, membandingkan kondisi, atau menegaskan pesan. Ini membuat animasi mudah diikuti dan proses editing memiliki tujuan jelas.' },
        { title: 'Menjaga sistem visual tetap dapat digunakan ulang', body: 'Karakter, ikon, tipografi, warna, dan aturan gerak perlu konsisten di berbagai episode dan format. Aset sumber yang rapi juga memudahkan pembaruan jika informasi berubah.' },
        { title: 'Menyiapkan aset sesuai kebutuhan produk', body: 'Video final, animasi di dalam aplikasi, dan paket file sumber memiliki kebutuhan teknis yang berbeda. Ekspor akhir harus mengikuti penggunaan yang tercantum di dalam ruang lingkup.' }
      ],
      process: [
        { title: '01 · Memecah pesan menjadi bagian yang jelas', body: 'Pisahkan materi sumber menjadi urutan ide yang logis. Tentukan apa yang perlu dijelaskan lebih dulu, bagian yang membutuhkan contoh, dan informasi yang perlu ditampilkan lebih lama agar dipahami.' },
        { title: '02 · Menyusun storyboard dan bahasa visual', body: 'Terjemahkan penjelasan menjadi adegan, komposisi, perilaku karakter atau diagram, tipografi, dan transisi. Storyboard membuat struktur bisa ditinjau sebelum perubahan animasi menjadi lebih mahal.' },
        { title: '03 · Menganimasikan dan menyempurnakan tempo', body: 'Bangun gerakan sesuai makna yang ingin disampaikan, lalu rapikan timing, easing, transisi, dan hubungan dengan audio. Motion harus mengarahkan perhatian, bukan bersaing dengan pesan.' },
        { title: '04 · Mengekspor dan merapikan paket aset', body: 'Siapkan master episode, variasi format pendek, file vektor atau JSON, serta aset sumber yang memang tercantum pada proyek. Penamaan, ukuran, dan format yang konsisten memudahkan publikasi dan pemeliharaan.' }
      ],
      relevance: 'Studi kasus ini relevan ketika instruksi kompleks, materi edukasi, penjelasan produk, atau cerita brand perlu lebih mudah dipahami melalui video dan antarmuka digital.'
    }
  },
  'Branding & Identity': {
    en: {
      context: 'An identity project needs to do more than produce a logo. It must define a recognisable visual language and explain how that language behaves across the real touchpoints where customers encounter the brand.',
      objective: [
        'Give the brand a clear and distinctive visual point of view.',
        'Make identity elements coherent across print, packaging, digital, environmental, and service touchpoints listed in the scope.',
        'Balance differentiation with legibility, production constraints, and the brand context described in the brief.',
        'Create guidelines that allow internal teams and external partners to apply the identity consistently.'
      ],
      diagnosis: [
        { title: 'Define what needs to be recognised', body: 'The challenge describes how the brand needs to be perceived or distinguished. That requirement should guide symbol, typography, colour, materials, and image direction so the system communicates one coherent impression.' },
        { title: 'Design for the places the identity will live', body: 'A visual that works on a large screen may not translate to packaging, a small label, signage, or stationery. The system needs rules and variants that preserve recognition across the deliverables listed in the record.' },
        { title: 'Respect context without relying on clichés', body: 'Where heritage, place, craft, or premium positioning matters, references need to be translated into design decisions with care. The result should feel appropriate to the brief rather than depend on decorative motifs alone.' }
      ],
      decisions: [
        { title: 'Build a system instead of a single mark', body: 'The identity needs a relationship between core mark, secondary assets, typography, colour, layout, and image treatment. That relationship helps the brand remain recognisable as formats and applications change.' },
        { title: 'Connect concept to application', body: 'Brand assets should be tested against the applications in the actual delivery list. Packaging, signage, collateral, and digital surfaces expose different constraints, so each one informs practical rules.' },
        { title: 'Document decisions for future use', body: 'A guideline or brandbook records the intended use of the identity and helps prevent inconsistent adaptations. It is a working reference for everyday production, not only a presentation of the concept.' }
      ],
      process: [
        { title: '01 · Define the brand problem and position', body: 'Translate the brief into the perception, audience, and differentiation problem the identity must address. This creates a decision filter for evaluating creative directions.' },
        { title: '02 · Develop the identity concept', body: 'Explore the relationship between symbol, typography, palette, material, and visual tone. The aim is a coherent concept that can communicate the desired character without relying on one isolated graphic.' },
        { title: '03 · Apply the system to real touchpoints', body: 'Use the listed collateral and applications to check how the identity behaves at different sizes, materials, and viewing contexts. The applications make the system practical rather than purely presentational.' },
        { title: '04 · Package the guidelines and production assets', body: 'Organise approved identity components, layout rules, file types, and application examples. This gives the client a clear reference for consistent internal use and supplier handoff.' }
      ],
      relevance: 'This case is relevant when a brand is entering a new stage, expanding to more touchpoints, modernising its perception, or trying to keep multiple outlets and partners visually consistent.'
    },
    id: {
      context: 'Proyek identitas tidak berhenti pada pembuatan logo. Brand membutuhkan bahasa visual yang mudah dikenali sekaligus aturan penerapan di berbagai titik kontak tempat pelanggan melihat dan mengalami brand tersebut.',
      objective: [
        'Memberi brand arah visual yang jelas dan berbeda dari kompetitor.',
        'Menjaga konsistensi identitas pada media cetak, kemasan, digital, lingkungan, dan layanan yang tercantum dalam ruang lingkup.',
        'Menyeimbangkan diferensiasi dengan keterbacaan, batas produksi, serta konteks brand dalam brief.',
        'Menyusun panduan agar tim internal dan mitra eksternal dapat menerapkan identitas dengan konsisten.'
      ],
      diagnosis: [
        { title: 'Menentukan hal yang harus mudah dikenali', body: 'Tantangan proyek menjelaskan bagaimana brand perlu dipersepsikan atau dibedakan. Kebutuhan ini menjadi dasar pemilihan simbol, tipografi, warna, material, dan arah visual agar semuanya membangun kesan yang sama.' },
        { title: 'Merancang untuk semua media penerapan', body: 'Visual yang bekerja di layar besar belum tentu cocok untuk kemasan, label kecil, signage, atau stationery. Sistem perlu memiliki aturan dan variasi yang menjaga pengenalan brand di setiap output yang tercatat.' },
        { title: 'Menghormati konteks tanpa bergantung pada klise', body: 'Jika warisan budaya, lokasi, craftsmanship, atau positioning premium berperan, referensi harus diterjemahkan secara cermat menjadi keputusan desain. Hasilnya perlu sesuai brief, bukan hanya mengandalkan ornamen dekoratif.' }
      ],
      decisions: [
        { title: 'Membangun sistem, bukan hanya satu logo', body: 'Identitas membutuhkan hubungan antara logo utama, elemen pendukung, tipografi, warna, tata letak, dan perlakuan gambar. Hubungan tersebut menjaga brand tetap dikenali saat format berubah.' },
        { title: 'Menghubungkan konsep dengan penerapan', body: 'Aset identitas perlu diuji terhadap aplikasi yang tercantum dalam ruang lingkup. Kemasan, signage, materi promosi, dan media digital memiliki batas berbeda yang memengaruhi aturan penerapannya.' },
        { title: 'Mendokumentasikan keputusan untuk penggunaan berikutnya', body: 'Pedoman atau brandbook mencatat aturan penggunaan identitas dan membantu mencegah adaptasi yang tidak konsisten. Dokumen ini menjadi acuan kerja sehari-hari, bukan hanya presentasi konsep.' }
      ],
      process: [
        { title: '01 · Merumuskan masalah dan posisi brand', body: 'Terjemahkan brief menjadi masalah persepsi, audiens, dan diferensiasi yang harus dijawab oleh identitas. Rumusan ini menjadi acuan saat mengevaluasi arah kreatif.' },
        { title: '02 · Mengembangkan konsep identitas', body: 'Eksplorasi hubungan antara simbol, tipografi, palet warna, material, dan tone visual. Tujuannya adalah menemukan konsep yang utuh, bukan mengandalkan satu elemen grafis saja.' },
        { title: '03 · Menerapkan sistem ke titik kontak nyata', body: 'Gunakan media dan aplikasi yang tercantum untuk menilai perilaku identitas pada ukuran, material, dan konteks yang berbeda. Penerapan ini membuat sistem siap dipakai, bukan sekadar terlihat menarik pada presentasi.' },
        { title: '04 · Menyusun panduan dan file produksi', body: 'Rapikan komponen identitas, aturan tata letak, jenis file, dan contoh penerapan. Klien mendapat acuan untuk menjaga konsistensi penggunaan internal dan proses serah-terima ke vendor.' }
      ],
      relevance: 'Studi kasus ini relevan ketika brand memasuki tahap baru, memperluas media penerapan, ingin memperbarui persepsinya, atau perlu menjaga konsistensi banyak outlet dan mitra.'
    }
  },
  'Motion & Graphic Design': {
    en: {
      context: 'Motion and campaign design must earn attention quickly while keeping the message readable. The design system needs to work within the viewing duration, display environment, aspect ratio, and audience behaviour described by the project.',
      objective: [
        'Establish a clear first point of attention and a readable message hierarchy.',
        'Use movement, composition, and transitions to direct attention rather than add noise.',
        'Keep the campaign recognisable across the formats and surfaces listed in the deliverables.',
        'Prepare a production-ready asset set that can be published without rebuilding the core idea each time.'
      ],
      diagnosis: [
        { title: 'Understand the viewing context', body: 'A commuter passing a large display, a social viewer scrolling on a phone, and an esports audience watching a live stream have different attention windows. The design must account for the specific environment named in the brief.' },
        { title: 'Prioritise the message hierarchy', body: 'The main message, supporting information, and call to action cannot compete equally for attention. Scale, contrast, sequence, duration, and placement establish what people should notice first.' },
        { title: 'Keep motion purposeful and technically reliable', body: 'Movement needs to support comprehension and visual rhythm. Delivery also has to respect output resolution, playback context, timing, and any live-data or system constraints recorded in the project.' }
      ],
      decisions: [
        { title: 'Design for the first few seconds', body: 'Open with a composition or movement that makes the subject immediately legible. This is particularly important where the recorded challenge involves passing audiences or short-form media.' },
        { title: 'Build a repeatable visual grammar', body: 'Typography, transitions, colour behaviour, and graphic elements should share a consistent logic so each variant still feels part of the same campaign or broadcast.' },
        { title: 'Validate the asset against its display format', body: 'A 3D OOH canvas, station information screen, mobile vertical ad, and live broadcast overlay each impose different safe areas and readability constraints. The export must be designed for the actual destination.' }
      ],
      process: [
        { title: '01 · Identify audience, message, and viewing conditions', body: 'Start from the use context recorded for the campaign: how long someone can view it, how far away they are, which information matters first, and which device or display will show it.' },
        { title: '02 · Establish the key visual and motion rule set', body: 'Define composition, typography, graphic elements, movement, and transition behaviour. A shared system keeps creative decisions coherent as the campaign expands into more sizes and placements.' },
        { title: '03 · Build and refine the animation or campaign assets', body: 'Develop the movement, timing, and graphic sequence around the message hierarchy. Where real-time overlays or display requirements are listed, the asset structure must also respect those technical boundaries.' },
        { title: '04 · Adapt and package each format', body: 'Prepare the masters and variations listed in the deliverables, checking framing, legibility, duration, and the way each version starts and ends. The goal is consistency without forcing every format into an identical crop.' }
      ],
      relevance: 'This case is relevant to campaigns, public information, digital signage, paid social, OOH, and live events where attention time and display conditions strongly shape the creative solution.'
    },
    id: {
      context: 'Motion dan desain kampanye perlu menarik perhatian dengan cepat tanpa mengorbankan keterbacaan pesan. Sistem desain harus sesuai dengan durasi tayang, lingkungan display, rasio layar, dan perilaku audiens yang dijelaskan dalam proyek.',
      objective: [
        'Menentukan titik perhatian pertama dan hierarki pesan yang mudah dibaca.',
        'Menggunakan gerak, komposisi, dan transisi untuk mengarahkan perhatian, bukan menambah gangguan.',
        'Menjaga identitas kampanye tetap konsisten di berbagai format dan media yang tercantum.',
        'Menyiapkan paket aset siap produksi tanpa perlu membangun ulang ide utama untuk setiap penempatan.'
      ],
      diagnosis: [
        { title: 'Memahami konteks audiens melihat konten', body: 'Orang yang melewati layar besar, pengguna yang menggulir media sosial, dan penonton siaran esports memiliki waktu perhatian yang berbeda. Desain perlu mengikuti lingkungan yang disebutkan dalam brief.' },
        { title: 'Menentukan hierarki pesan', body: 'Pesan utama, informasi pendukung, dan ajakan bertindak tidak bisa mendapat prioritas yang sama. Ukuran, kontras, urutan, durasi, dan penempatan menentukan informasi yang terlihat terlebih dahulu.' },
        { title: 'Menjaga gerak tetap berfungsi dan andal', body: 'Gerakan perlu mendukung pemahaman dan ritme visual. Penyerahan aset juga harus memperhitungkan resolusi, konteks playback, timing, serta batas integrasi data atau sistem jika tercantum pada proyek.' }
      ],
      decisions: [
        { title: 'Merancang untuk beberapa detik pertama', body: 'Mulai dengan komposisi atau gerak yang membuat subjek langsung terbaca. Ini penting ketika tantangan berkaitan dengan audiens yang bergerak atau konten berdurasi pendek.' },
        { title: 'Membangun tata bahasa visual yang konsisten', body: 'Tipografi, transisi, perilaku warna, dan elemen grafis harus mengikuti logika yang sama agar setiap variasi tetap terasa berasal dari kampanye atau siaran yang sama.' },
        { title: 'Menyesuaikan aset dengan format display', body: 'Layar OOH 3D, layar informasi stasiun, iklan vertikal, dan overlay siaran langsung memiliki batas safe area dan keterbacaan yang berbeda. Ekspor harus dirancang sesuai tujuan pemakaiannya.' }
      ],
      process: [
        { title: '01 · Menentukan audiens, pesan, dan kondisi tayang', body: 'Mulai dari konteks yang tercatat: berapa lama orang dapat melihatnya, dari jarak berapa, informasi apa yang paling penting, serta perangkat atau layar yang akan menampilkan konten.' },
        { title: '02 · Menentukan key visual dan aturan gerak', body: 'Tetapkan komposisi, tipografi, elemen grafis, pergerakan, dan perilaku transisi. Sistem bersama menjaga keputusan kreatif tetap konsisten saat kampanye diperluas ke ukuran dan penempatan lain.' },
        { title: '03 · Membuat dan menyempurnakan aset gerak', body: 'Kembangkan pergerakan, tempo, dan urutan grafis berdasarkan hierarki pesan. Jika overlay real-time atau kebutuhan display tercantum, struktur aset juga harus mengikuti batas teknis tersebut.' },
        { title: '04 · Mengadaptasi dan menyiapkan setiap format', body: 'Siapkan master dan variasi yang tercantum sambil memeriksa framing, keterbacaan, durasi, serta pembuka dan penutup tiap versi. Tujuannya konsisten tanpa memaksakan semua format memakai crop yang sama.' }
      ],
      relevance: 'Studi kasus ini relevan untuk kampanye, informasi publik, digital signage, iklan media sosial, OOH, dan acara langsung yang sangat dipengaruhi waktu perhatian dan kondisi display.'
    }
  },
  'Creative Design': {
    en: {
      context: 'Editorial and communication design often has to make dense information understandable without losing credibility. The challenge is to create a narrative hierarchy that helps the reader move from context to evidence, then to the decision or message that matters.',
      objective: [
        'Organise information so readers can scan the main message and then access supporting detail.',
        'Make data, technical content, and narrative feel like parts of one coherent publication.',
        'Keep typography, grids, charts, imagery, and page rhythm consistent throughout the asset.',
        'Deliver versions appropriate to the print, presentation, and digital formats listed in the scope.'
      ],
      diagnosis: [
        { title: 'Separate primary information from supporting detail', body: 'Reports, whitepapers, pitch decks, and lookbooks often contain content with different levels of importance. The reader needs a clear path through the document rather than a sequence of pages with equal visual weight.' },
        { title: 'Make evidence legible', body: 'Tables, comparisons, charts, and figures only help when labels and context are readable. Information design has to explain relationships without distorting the data or relying on decoration.' },
        { title: 'Plan for the actual reading situation', body: 'A boardroom presentation, printed report, and mobile PDF are consumed differently. Layout, page density, scale, and navigation should account for the final format.' }
      ],
      decisions: [
        { title: 'Use narrative structure to order the information', body: 'A clear sequence gives the reader context before detail and detail before a conclusion. It makes the publication easier to navigate and helps decision-makers find the information relevant to them.' },
        { title: 'Build a stable editorial system', body: 'Grids, typography, spacing, chart styles, and image treatments should be reusable across the publication. Consistency reduces visual friction and makes updates easier.' },
        { title: 'Treat every format as a real deliverable', body: 'Print files, interactive PDFs, flipbooks, and presentation decks have different production requirements. Their layout and export settings need to be planned around the actual use case.' }
      ],
      process: [
        { title: '01 · Define the reader and the main message', body: 'Clarify what the publication must help the audience understand or decide. This determines what belongs in the opening, what needs supporting evidence, and what can remain secondary.' },
        { title: '02 · Structure content and information hierarchy', body: 'Group related points, sequence the narrative, and decide where diagrams, charts, imagery, or summaries will clarify the content. The result is a readable structure before visual styling begins.' },
        { title: '03 · Design the editorial language', body: 'Apply grid, typography, colour, image direction, and data-visualisation rules to the structure. Reusable templates keep long documents coherent and make repetitive content easier to maintain.' },
        { title: '04 · Prepare and check publication formats', body: 'Package the required print, digital, or presentation files against the delivery list. Resolution, font handling, link behaviour, page order, and legibility should match the intended channel.' }
      ],
      relevance: 'This case is relevant when organisations need to communicate complex business, financial, technical, investment, sustainability, or product information clearly and professionally.'
    },
    id: {
      context: 'Desain editorial dan komunikasi sering harus membuat informasi padat lebih mudah dipahami tanpa menghilangkan kredibilitasnya. Tantangannya adalah membangun hierarki narasi yang membantu pembaca memahami konteks, melihat bukti, lalu menangkap keputusan atau pesan utamanya.',
      objective: [
        'Menyusun informasi agar pesan utama mudah dipindai dan detail pendukung tetap mudah ditemukan.',
        'Menyatukan data, materi teknis, dan narasi ke dalam satu publikasi yang utuh.',
        'Menjaga tipografi, grid, grafik, gambar, dan ritme halaman tetap konsisten.',
        'Menyiapkan format yang sesuai untuk cetak, presentasi, dan kanal digital pada ruang lingkup.'
      ],
      diagnosis: [
        { title: 'Memisahkan informasi utama dan pendukung', body: 'Laporan, whitepaper, pitch deck, dan lookbook memiliki informasi dengan tingkat kepentingan berbeda. Pembaca membutuhkan alur yang jelas, bukan rangkaian halaman dengan bobot visual yang sama.' },
        { title: 'Membuat bukti mudah dibaca', body: 'Tabel, perbandingan, grafik, dan angka hanya membantu jika label dan konteksnya terbaca. Desain informasi harus menjelaskan hubungan tanpa mengubah makna data atau bergantung pada dekorasi.' },
        { title: 'Merancang sesuai situasi membaca', body: 'Presentasi ruang rapat, laporan cetak, dan PDF di ponsel digunakan dengan cara berbeda. Tata letak, kepadatan halaman, skala, dan navigasi perlu menyesuaikan format akhir.' }
      ],
      decisions: [
        { title: 'Menggunakan struktur narasi untuk mengurutkan informasi', body: 'Urutan yang jelas memberikan konteks sebelum detail dan detail sebelum kesimpulan. Ini memudahkan navigasi dan membantu pengambil keputusan menemukan informasi yang relevan.' },
        { title: 'Membangun sistem editorial yang stabil', body: 'Grid, tipografi, jarak, gaya grafik, dan perlakuan gambar harus dapat digunakan ulang. Konsistensi mengurangi hambatan visual dan mempermudah pembaruan.' },
        { title: 'Memperlakukan setiap format sebagai deliverable tersendiri', body: 'File cetak, PDF interaktif, flipbook, dan deck presentasi memiliki kebutuhan produksi berbeda. Tata letak dan pengaturan ekspor harus mengikuti cara aset tersebut akan digunakan.' }
      ],
      process: [
        { title: '01 · Menentukan pembaca dan pesan utama', body: 'Pastikan hal yang perlu dipahami atau diputuskan oleh audiens. Ini menentukan informasi pembuka, bukti pendukung, dan bagian yang bisa ditempatkan sebagai informasi sekunder.' },
        { title: '02 · Menata konten dan hierarki informasi', body: 'Kelompokkan poin terkait, urutkan narasi, lalu tentukan bagian yang membutuhkan diagram, grafik, gambar, atau ringkasan. Struktur dibuat jelas sebelum masuk ke gaya visual.' },
        { title: '03 · Membangun bahasa editorial', body: 'Terapkan aturan grid, tipografi, warna, arah gambar, dan visualisasi data. Template yang bisa digunakan ulang menjaga dokumen panjang tetap konsisten dan mempermudah pemeliharaan konten berulang.' },
        { title: '04 · Menyiapkan dan memeriksa format publikasi', body: 'Siapkan file cetak, digital, atau presentasi sesuai daftar penyerahan. Resolusi, font, perilaku tautan, urutan halaman, dan keterbacaan harus sesuai kanal penggunaan.' }
      ],
      relevance: 'Studi kasus ini relevan bagi organisasi yang perlu menyampaikan informasi bisnis, finansial, teknis, investasi, keberlanjutan, atau produk secara jelas dan profesional.'
    }
  },
  '3D Visualization': {
    en: {
      context: 'A 3D project translates an object, space, or mechanism into a visual that helps people understand qualities they cannot easily inspect in a flat image or physical visit. Modelling, materials, lighting, camera, and interaction must serve the intended viewing purpose.',
      objective: [
        'Communicate form, proportion, material, and spatial relationships clearly.',
        'Control light and camera framing so viewers can read the important features.',
        'Choose still, motion, or interactive output based on how the audience needs to explore the subject.',
        'Deliver the visual assets and technical packages listed in the project scope.'
      ],
      diagnosis: [
        { title: 'Identify what the viewer needs to understand', body: 'The brief may require an audience to imagine a future space, inspect a product, or understand a complex machine. The visual approach should focus on the geometry, movement, scale, or material information that answers that need.' },
        { title: 'Translate references into a consistent 3D scene', body: 'Modelling and surface treatment need to stay coherent with the intended level of realism and the information available. Camera and lighting decisions should reveal the subject rather than hide important details.' },
        { title: 'Balance visual fidelity with the delivery format', body: 'A high-resolution still, animation, WebGL view, and AR experience place different demands on scene detail and performance. The output should be designed for its final use, not only for the render workstation.' }
      ],
      decisions: [
        { title: 'Establish geometry and scale first', body: 'Proportion and silhouette are the foundation of believable visualisation. Detail and surface treatment cannot compensate for a model that does not communicate the intended form.' },
        { title: 'Use materials and light to explain the subject', body: 'Reflection, roughness, shadow, and light direction affect how viewers perceive material and depth. These choices should help identify the important surfaces and spatial relationships.' },
        { title: 'Choose a camera strategy around the story', body: 'A hero view, technical close-up, walkthrough, or interactive orbit answers a different question. Camera direction and output type should therefore follow the purpose of the asset.' }
      ],
      process: [
        { title: '01 · Review the subject and visual requirement', body: 'Identify the features that need to be shown, the available reference material, and the intended audience. This sets the scope for modelling detail and prevents effort being spent on elements that do not support the objective.' },
        { title: '02 · Build the model and scene structure', body: 'Construct the geometry and organise the scene around the intended views or animation. Reusable materials, naming, and a logical scene hierarchy make revisions easier.' },
        { title: '03 · Refine materials, lighting, and camera', body: 'Tune surface response, light, perspective, composition, and depth so the subject reads clearly. If the output is interactive, visual quality must also be balanced with runtime performance.' },
        { title: '04 · Render, optimise, and package the output', body: 'Prepare the final stills, motion outputs, interactive assets, or source package listed in the scope. File dimensions, formats, loading behaviour, and intended placement determine the final export requirements.' }
      ],
      relevance: 'This case is relevant when teams need to present a space before it is built, explain industrial equipment, showcase a product, or create a richer digital product experience.'
    },
    id: {
      context: 'Proyek 3D menerjemahkan objek, ruang, atau mekanisme menjadi visual yang membantu audiens memahami sesuatu yang sulit diperiksa hanya melalui gambar datar atau kunjungan langsung. Modeling, material, pencahayaan, kamera, dan interaksi harus mendukung tujuan visualnya.',
      objective: [
        'Menjelaskan bentuk, proporsi, material, dan hubungan ruang secara jelas.',
        'Mengatur cahaya dan framing agar fitur penting mudah dibaca.',
        'Memilih output gambar diam, motion, atau interaktif berdasarkan cara audiens perlu menjelajahi objek.',
        'Menyerahkan aset visual dan paket teknis yang tercantum dalam ruang lingkup.'
      ],
      diagnosis: [
        { title: 'Menentukan hal yang perlu dipahami audiens', body: 'Brief dapat mengharuskan audiens membayangkan ruang yang belum dibangun, memeriksa produk, atau memahami mesin yang kompleks. Pendekatan visual perlu fokus pada geometri, gerak, skala, atau material yang menjawab kebutuhan tersebut.' },
        { title: 'Menerjemahkan referensi menjadi scene 3D yang konsisten', body: 'Model dan perlakuan permukaan perlu sesuai tingkat realisme yang dibutuhkan serta informasi yang tersedia. Keputusan kamera dan cahaya harus memperjelas subjek, bukan menyembunyikan detail penting.' },
        { title: 'Menyeimbangkan fidelitas visual dan format penyerahan', body: 'Gambar resolusi tinggi, animasi, tampilan WebGL, dan pengalaman AR memiliki kebutuhan detail serta performa yang berbeda. Output perlu dirancang untuk penggunaan akhirnya, bukan hanya untuk workstation render.' }
      ],
      decisions: [
        { title: 'Menetapkan geometri dan skala terlebih dahulu', body: 'Proporsi dan siluet adalah dasar visualisasi yang meyakinkan. Detail dan material tidak dapat menutupi model yang gagal mengomunikasikan bentuk utama.' },
        { title: 'Memakai material dan cahaya untuk menjelaskan objek', body: 'Refleksi, roughness, bayangan, dan arah cahaya memengaruhi persepsi material serta kedalaman. Keputusan ini harus membantu audiens mengenali permukaan dan hubungan ruang yang penting.' },
        { title: 'Memilih pendekatan kamera sesuai cerita', body: 'Hero view, close-up teknis, walkthrough, dan orbit interaktif menjawab kebutuhan yang berbeda. Arah kamera dan jenis output perlu mengikuti tujuan aset.' }
      ],
      process: [
        { title: '01 · Meninjau objek dan kebutuhan visual', body: 'Tentukan fitur yang harus terlihat, referensi yang tersedia, serta audiens yang dituju. Ini menetapkan tingkat detail modeling dan mencegah pekerjaan berlebihan pada elemen yang tidak membantu tujuan.' },
        { title: '02 · Membangun model dan struktur scene', body: 'Susun geometri dan organisasi scene berdasarkan sudut pandang atau animasi yang diperlukan. Material yang dapat digunakan ulang, penamaan, dan struktur scene yang rapi memudahkan revisi.' },
        { title: '03 · Menyempurnakan material, cahaya, dan kamera', body: 'Atur respons permukaan, pencahayaan, perspektif, komposisi, dan kedalaman agar subjek terbaca dengan jelas. Untuk output interaktif, kualitas visual juga harus seimbang dengan performa saat dijalankan.' },
        { title: '04 · Render, optimasi, dan penyerahan', body: 'Siapkan gambar akhir, video, aset interaktif, atau paket sumber yang termasuk dalam ruang lingkup. Dimensi, format file, perilaku loading, dan penempatan akhir menentukan kebutuhan ekspor.' }
      ],
      relevance: 'Studi kasus ini relevan saat tim perlu mempresentasikan ruang sebelum dibangun, menjelaskan peralatan industri, menampilkan produk, atau membuat pengalaman produk digital yang lebih kaya.'
    }
  },
  'Company Profile Website': {
    en: {
      context: 'A corporate website has to translate an organisation and its services into a digital structure that different audiences can understand and act on. The work involves information architecture, content hierarchy, visual credibility, responsive behaviour, and a maintainable delivery system.',
      objective: [
        'Help visitors understand what the organisation does and why it is relevant.',
        'Make important service, project, capability, and contact information easy to find.',
        'Preserve readability and navigation across desktop and mobile screens.',
        'Deliver the site and any CMS or portal functionality explicitly included in the recorded scope.'
      ],
      diagnosis: [
        { title: 'Clarify the business story', body: 'A corporate site should not force visitors to assemble the organisation’s offer from unrelated pages. Information hierarchy needs to establish context, capabilities, proof, and the next useful action.' },
        { title: 'Reduce navigation and content friction', body: 'Visitors arrive with different questions. Clear labels, grouped information, page patterns, and intentional cross-links help audiences find the relevant answer without repeatedly returning to the menu.' },
        { title: 'Make trust information easy to verify', body: 'Project records, certifications, milestones, services, locations, and contact routes should be presented in a structure that can be maintained. This matters especially when a site serves procurement, partners, or enterprise visitors.' }
      ],
      decisions: [
        { title: 'Organise content around visitor intent', body: 'The information architecture should follow the questions a potential client needs answered. The hierarchy should make services and capabilities understandable before asking visitors to contact the organisation.' },
        { title: 'Use a repeatable page system', body: 'Reusable sections and components keep the site consistent while allowing different service lines or project pages to carry their own relevant content.' },
        { title: 'Treat publishing and maintenance as part of the scope', body: 'A live website needs a manageable way to update content, images, and project information. Any CMS, portal, or administration deliverable listed in the project should support that ongoing responsibility.' }
      ],
      process: [
        { title: '01 · Organise the sitemap and user paths', body: 'Group pages by the questions visitors are likely to ask, then define the path from overview to detail and contact. This establishes a structure before visual design and development begin.' },
        { title: '02 · Build the content and page hierarchy', body: 'Set the role of headlines, summaries, proof points, capability details, and calls to action. This keeps the site focused on useful information instead of filling the page with undifferentiated copy.' },
        { title: '03 · Design and implement responsive patterns', body: 'Translate the hierarchy into reusable page components and layouts that hold up on smaller screens. Navigation, media, forms, and content blocks should adapt to the available space without losing meaning.' },
        { title: '04 · Prepare publishing, contact, and handoff paths', body: 'Check that the included pages and functions connect to the intended next action, and organise editable content or source assets as required by the scope. This supports future updates rather than a one-time launch only.' }
      ],
      relevance: 'This case is relevant to organisations that need a clearer corporate presence, more structured service information, stronger partner or procurement communication, or a maintainable digital catalogue of their work.'
    },
    id: {
      context: 'Website perusahaan perlu menerjemahkan organisasi dan layanannya menjadi struktur digital yang mudah dipahami dan digunakan oleh berbagai audiens. Pekerjaan mencakup arsitektur informasi, hierarki konten, kredibilitas visual, perilaku responsif, dan sistem yang dapat dipelihara.',
      objective: [
        'Membantu pengunjung memahami layanan organisasi dan alasan layanan tersebut relevan.',
        'Mempermudah pencarian informasi layanan, proyek, kemampuan, dan kontak.',
        'Menjaga keterbacaan dan navigasi di desktop maupun ponsel.',
        'Menyerahkan website serta fungsi CMS atau portal yang memang tercantum dalam ruang lingkup.'
      ],
      diagnosis: [
        { title: 'Memperjelas cerita bisnis', body: 'Website perusahaan seharusnya tidak membuat pengunjung menyusun sendiri penawaran organisasi dari halaman yang tidak saling terhubung. Hierarki perlu menunjukkan konteks, kemampuan, bukti, dan tindakan berikutnya.' },
        { title: 'Mengurangi hambatan navigasi dan konten', body: 'Pengunjung datang dengan pertanyaan yang berbeda. Label yang jelas, pengelompokan informasi, pola halaman, dan tautan kontekstual membantu mereka menemukan jawaban tanpa terus kembali ke menu.' },
        { title: 'Membuat informasi kredibilitas mudah ditinjau', body: 'Portofolio, sertifikasi, milestone, layanan, lokasi, dan jalur kontak perlu ditempatkan dalam struktur yang dapat dipelihara. Ini penting untuk pengunjung dari procurement, mitra, atau perusahaan.' }
      ],
      decisions: [
        { title: 'Menata konten berdasarkan tujuan pengunjung', body: 'Arsitektur informasi perlu mengikuti pertanyaan yang ingin dijawab calon klien. Layanan dan kemampuan harus dipahami sebelum pengunjung diminta menghubungi organisasi.' },
        { title: 'Menggunakan sistem halaman yang konsisten', body: 'Bagian dan komponen yang dapat digunakan ulang menjaga tampilan tetap konsisten, sementara setiap layanan atau proyek masih dapat memiliki konten yang sesuai.' },
        { title: 'Memasukkan pengelolaan konten ke dalam ruang lingkup', body: 'Website aktif membutuhkan cara yang mudah untuk memperbarui konten, gambar, dan informasi proyek. CMS, portal, atau modul administrasi yang tercantum perlu mendukung tanggung jawab pemeliharaan tersebut.' }
      ],
      process: [
        { title: '01 · Menata sitemap dan jalur pengguna', body: 'Kelompokkan halaman berdasarkan pertanyaan pengunjung, lalu tentukan alur dari gambaran umum menuju detail dan kontak. Struktur ini menjadi dasar sebelum desain visual dan pengembangan.' },
        { title: '02 · Menyusun konten dan hierarki halaman', body: 'Tentukan fungsi judul, ringkasan, bukti, detail kemampuan, dan ajakan bertindak. Ini menjaga website berisi informasi yang berguna, bukan sekadar memenuhi halaman dengan teks yang bobotnya sama.' },
        { title: '03 · Mendesain dan mengimplementasikan pola responsif', body: 'Terjemahkan hierarki menjadi komponen halaman dan layout yang bekerja pada layar kecil. Navigasi, media, formulir, dan blok konten perlu menyesuaikan ruang tanpa kehilangan makna.' },
        { title: '04 · Menyiapkan publikasi, kontak, dan handoff', body: 'Periksa hubungan halaman dan fungsi dengan tindakan yang dituju, lalu rapikan konten yang dapat diedit atau aset sumber sesuai ruang lingkup. Ini mendukung pembaruan setelah peluncuran, bukan hanya kebutuhan hari pertama.' }
      ],
      relevance: 'Studi kasus ini relevan bagi organisasi yang membutuhkan kehadiran korporat yang lebih jelas, informasi layanan yang terstruktur, komunikasi mitra atau procurement yang lebih kuat, atau katalog digital yang mudah dipelihara.'
    }
  },
  'E-Commerce Website': {
    en: {
      context: 'An e-commerce experience must connect product discovery to confident checkout and reliable order handling. Product information, availability, shipping, payment, account behaviour, and post-purchase updates need to form one continuous customer journey.',
      objective: [
        'Help customers identify the right product or bundle with less uncertainty.',
        'Keep cart, checkout, payment, and order information coherent through the purchase.',
        'Connect the storefront to the payment, fulfilment, subscription, or shipping functions named in the project.',
        'Create a maintainable store experience that can support updates to products and campaigns.'
      ],
      diagnosis: [
        { title: 'Identify where purchase confidence breaks down', body: 'The challenge may occur during product choice, price or shipping calculation, payment, stock availability, or repeat ordering. The solution needs to address the specific point stated in the project record rather than assume the entire funnel has the same problem.' },
        { title: 'Reduce gaps between storefront and operations', body: 'The visible shopping experience depends on accurate product data, inventory, payment status, shipping options, and order updates. Integrations need to reduce manual steps and inconsistent customer information.' },
        { title: 'Make special commerce logic understandable', body: 'Subscriptions, product diagnostics, custom configuration, international shipping, or premium checkout rules need to be easy to understand before customers commit to a purchase.' }
      ],
      decisions: [
        { title: 'Build the buying journey around customer intent', body: 'Navigation, search, product detail, bundles, cart, and checkout should help people decide and complete the purchase without unnecessary detours.' },
        { title: 'Connect the systems behind the storefront', body: 'Payment, stock, courier, recurring billing, and notification functions should communicate a consistent order state. The specific integrations listed in the scope indicate which operational dependencies matter for this project.' },
        { title: 'Account for exceptions as well as the happy path', body: 'Unavailable stock, failed payments, changed delivery details, subscription changes, and order updates need predictable behaviour where they apply. Clear states reduce confusion when an expected step does not complete.' }
      ],
      process: [
        { title: '01 · Map product discovery and purchase decisions', body: 'Translate the recorded challenge into the shopping steps customers need to complete. Identify the product information, comparison points, and reassurance needed before the customer adds an item or commits to a bundle.' },
        { title: '02 · Structure catalogue, cart, and checkout', body: 'Make product details, options, pricing, delivery information, and checkout steps easy to review. The sequence should reveal costs and choices before the user reaches final confirmation.' },
        { title: '03 · Connect commerce and operational services', body: 'Implement the payment, inventory, shipping, subscription, or notification functions named in the project scope. These links should keep the customer-facing order state aligned with the underlying operation.' },
        { title: '04 · Verify purchase states and prepare ongoing management', body: 'Review the states that affect a real order, including validation, confirmation, and failures where they are in scope. Prepare the listed CMS or administration tools so product and campaign information can be maintained.' }
      ],
      relevance: 'This case is relevant to stores facing checkout friction, catalogue complexity, repeat-purchase requirements, shipping complexity, or a need to connect customer experience with operations.'
    },
    id: {
      context: 'Pengalaman e-commerce perlu menghubungkan pencarian produk dengan checkout yang meyakinkan dan pengelolaan pesanan yang andal. Informasi produk, ketersediaan, ongkir, pembayaran, akun, dan pembaruan pesanan harus membentuk satu perjalanan pelanggan yang utuh.',
      objective: [
        'Membantu pelanggan memilih produk atau paket yang tepat dengan lebih yakin.',
        'Menjaga konsistensi keranjang, checkout, pembayaran, dan informasi pesanan.',
        'Menghubungkan storefront dengan fungsi pembayaran, pemenuhan pesanan, langganan, atau pengiriman yang tercantum pada proyek.',
        'Membuat pengalaman toko yang dapat dipelihara saat produk dan kampanye berubah.'
      ],
      diagnosis: [
        { title: 'Menemukan titik hilangnya keyakinan untuk membeli', body: 'Hambatan bisa muncul saat memilih produk, menghitung harga atau ongkir, membayar, memeriksa stok, atau memesan ulang. Solusi perlu menjawab titik yang disebut dalam catatan proyek, bukan menganggap seluruh funnel memiliki masalah yang sama.' },
        { title: 'Mengurangi jarak antara storefront dan operasional', body: 'Pengalaman belanja bergantung pada data produk, stok, status pembayaran, pilihan pengiriman, dan pembaruan pesanan yang akurat. Integrasi perlu mengurangi pekerjaan manual dan informasi pelanggan yang tidak konsisten.' },
        { title: 'Memperjelas logika belanja khusus', body: 'Langganan, kuis pemilihan produk, konfigurasi produk, pengiriman internasional, atau aturan checkout premium harus mudah dipahami sebelum pelanggan menyelesaikan pembelian.' }
      ],
      decisions: [
        { title: 'Membangun alur pembelian sesuai kebutuhan pelanggan', body: 'Navigasi, pencarian, detail produk, bundling, keranjang, dan checkout perlu membantu pelanggan mengambil keputusan serta menyelesaikan pembelian tanpa langkah yang tidak perlu.' },
        { title: 'Menghubungkan sistem di belakang storefront', body: 'Pembayaran, stok, kurir, billing berulang, dan notifikasi harus menghasilkan status pesanan yang konsisten. Integrasi yang tercantum menunjukkan ketergantungan operasional yang perlu ditangani dalam proyek.' },
        { title: 'Memikirkan kondisi pengecualian, bukan hanya alur ideal', body: 'Stok habis, pembayaran gagal, perubahan alamat, perubahan langganan, dan pembaruan pesanan perlu memiliki perilaku yang dapat diprediksi jika termasuk ruang lingkup. Status yang jelas mengurangi kebingungan saat proses tidak berjalan sesuai harapan.' }
      ],
      process: [
        { title: '01 · Memetakan pencarian produk dan keputusan pembelian', body: 'Terjemahkan tantangan proyek menjadi langkah belanja yang harus diselesaikan pelanggan. Tentukan informasi produk, bahan perbandingan, dan kepastian yang dibutuhkan sebelum menambahkan produk atau memilih paket.' },
        { title: '02 · Menata katalog, keranjang, dan checkout', body: 'Buat detail produk, pilihan, harga, informasi pengiriman, dan tahap checkout mudah ditinjau. Biaya dan pilihan perlu terlihat sebelum pengguna mengonfirmasi pesanan.' },
        { title: '03 · Menghubungkan layanan commerce dan operasional', body: 'Implementasikan fungsi pembayaran, inventori, pengiriman, langganan, atau notifikasi yang tercatat pada ruang lingkup. Hubungan ini perlu menjaga status pesanan yang terlihat oleh pelanggan selaras dengan sistem operasional.' },
        { title: '04 · Memeriksa status pembelian dan pengelolaan toko', body: 'Tinjau status yang memengaruhi pesanan nyata, termasuk validasi, konfirmasi, dan kegagalan jika termasuk cakupan. Siapkan CMS atau alat administrasi yang tercantum agar informasi produk dan kampanye mudah dikelola.' }
      ],
      relevance: 'Studi kasus ini relevan bagi toko yang menghadapi hambatan checkout, katalog kompleks, kebutuhan pembelian berulang, kerumitan pengiriman, atau kebutuhan menghubungkan pengalaman pelanggan dengan operasi.'
    }
  },
  'Web Application': {
    en: {
      context: 'A web application needs to turn business rules into a reliable workflow. Its value depends on the connection between user roles, data states, automation, integrations, error handling, and the screens people use to make operational decisions.',
      objective: [
        'Represent the key business process as a clear sequence of actions and states.',
        'Give each role the appropriate view and permissions for its responsibilities.',
        'Connect the interfaces to the data, APIs, and automation explicitly included in scope.',
        'Make the application understandable to operate and maintain, not just technically functional.'
      ],
      diagnosis: [
        { title: 'Map the operational handoffs', body: 'The recorded challenge points to work that is delayed, repetitive, difficult to track, or spread across tools. The application needs to make ownership, status, and the next action explicit at the point where work changes hands.' },
        { title: 'Treat data state as part of the interface', body: 'Users need to know whether information is current, pending, rejected, reconciled, or incomplete. Status labels and system feedback are meaningful only when tied to clear business rules and API behaviour.' },
        { title: 'Design integration and exception paths', body: 'External services and automation can fail, return incomplete data, or respond later than expected. A dependable workflow needs clear validation, retries or recovery where appropriate, and a way for users to understand what happened.' }
      ],
      decisions: [
        { title: 'Model the workflow before adding screens', body: 'Roles, inputs, transitions, and completion conditions determine the application structure. Starting from the workflow avoids a dashboard that looks organised but does not resolve the real operational handoff.' },
        { title: 'Keep permission and data rules explicit', body: 'The interface should expose the actions a role needs without making sensitive or irrelevant controls available to everyone. Server-side authorisation remains essential wherever the application changes protected data.' },
        { title: 'Give operators feedback they can act on', body: 'Validation, loading, success, failure, and reconciliation states need to communicate what the system did and what the operator should do next. This is especially important for financial, healthcare, and real-time workflows.' }
      ],
      process: [
        { title: '01 · Define the workflow and business rules', body: 'Translate the challenge into actors, inputs, state transitions, and outcomes. Decide which records need to be created, reviewed, approved, updated, or reconciled and where each responsibility belongs.' },
        { title: '02 · Design the information and interaction model', body: 'Structure navigation, forms, tables, status indicators, and details around the way people perform the work. The interface should surface important exceptions and next actions without hiding them in unrelated screens.' },
        { title: '03 · Implement the application and integrations', body: 'Connect the front end to the underlying data services, APIs, event streams, or automated functions included in the record. The workflow depends on predictable response states and a consistent contract between systems.' },
        { title: '04 · Validate operational states and hand over', body: 'Review the main journey as well as validation, permissions, empty data, delayed responses, and failure states relevant to the scope. Organise the included source, documentation, and administration tools for ongoing maintenance.' }
      ],
      relevance: 'This case is relevant to teams replacing spreadsheets or disconnected tools with a role-based application, automated workflow, operational dashboard, or system that connects multiple services.'
    },
    id: {
      context: 'Aplikasi web perlu menerjemahkan aturan bisnis menjadi alur kerja yang dapat diandalkan. Nilainya ditentukan oleh hubungan antara peran pengguna, status data, otomatisasi, integrasi, penanganan kesalahan, dan layar yang dipakai untuk mengambil keputusan operasional.',
      objective: [
        'Menggambarkan proses bisnis utama menjadi urutan tindakan dan status yang jelas.',
        'Memberi setiap peran tampilan dan hak akses sesuai tanggung jawabnya.',
        'Menghubungkan antarmuka dengan data, API, dan otomatisasi yang memang termasuk ruang lingkup.',
        'Membuat aplikasi mudah dioperasikan dan dipelihara, bukan hanya berfungsi secara teknis.'
      ],
      diagnosis: [
        { title: 'Memetakan perpindahan pekerjaan antarperan', body: 'Tantangan yang tercatat mengarah pada pekerjaan yang lambat, berulang, sulit dilacak, atau tersebar di beberapa alat. Aplikasi perlu memperjelas pemilik pekerjaan, status, dan tindakan berikutnya saat tanggung jawab berpindah.' },
        { title: 'Menjadikan status data bagian dari antarmuka', body: 'Pengguna perlu mengetahui apakah informasi terbaru, tertunda, ditolak, direkonsiliasi, atau belum lengkap. Label status dan feedback sistem baru berguna jika terkait dengan aturan bisnis dan perilaku API yang jelas.' },
        { title: 'Merancang integrasi dan alur pengecualian', body: 'Layanan eksternal dan otomatisasi bisa gagal, mengembalikan data tidak lengkap, atau merespons terlambat. Alur yang andal membutuhkan validasi, retry atau pemulihan jika sesuai, dan informasi yang membantu pengguna memahami kejadian.' }
      ],
      decisions: [
        { title: 'Memodelkan alur kerja sebelum menambah layar', body: 'Peran, input, transisi, dan kondisi selesai menentukan struktur aplikasi. Memulai dari alur kerja mencegah dashboard yang terlihat rapi tetapi tidak menyelesaikan perpindahan pekerjaan yang sebenarnya.' },
        { title: 'Memperjelas aturan akses dan data', body: 'Antarmuka perlu menampilkan tindakan yang dibutuhkan sebuah peran tanpa membuka kontrol sensitif atau tidak relevan kepada semua pengguna. Otorisasi sisi server tetap penting untuk perubahan data yang dilindungi.' },
        { title: 'Memberi feedback yang bisa ditindaklanjuti', body: 'Status validasi, loading, berhasil, gagal, dan rekonsiliasi perlu menjelaskan apa yang dilakukan sistem serta langkah berikutnya. Ini penting khususnya untuk alur finansial, kesehatan, dan real-time.' }
      ],
      process: [
        { title: '01 · Menentukan alur kerja dan aturan bisnis', body: 'Terjemahkan tantangan menjadi aktor, input, perubahan status, dan hasil. Tentukan data yang perlu dibuat, ditinjau, disetujui, diperbarui, atau direkonsiliasi dan siapa yang bertanggung jawab.' },
        { title: '02 · Mendesain model informasi dan interaksi', body: 'Susun navigasi, formulir, tabel, indikator status, dan halaman detail sesuai cara orang menjalankan pekerjaan. Pengecualian dan tindakan berikutnya perlu terlihat tanpa tersembunyi di layar yang tidak terkait.' },
        { title: '03 · Mengimplementasikan aplikasi dan integrasi', body: 'Hubungkan frontend dengan layanan data, API, event stream, atau fungsi otomatis yang tercantum pada proyek. Alur kerja memerlukan respons yang dapat diprediksi dan kontrak antar sistem yang konsisten.' },
        { title: '04 · Memvalidasi status operasional dan handoff', body: 'Tinjau perjalanan utama serta validasi, hak akses, data kosong, respons lambat, dan status kegagalan yang relevan dengan ruang lingkup. Rapikan source, dokumentasi, dan alat administrasi yang termasuk dalam penyerahan.' }
      ],
      relevance: 'Studi kasus ini relevan bagi tim yang ingin mengganti spreadsheet atau alat terpisah dengan aplikasi berbasis peran, alur kerja otomatis, dashboard operasional, atau sistem yang menghubungkan beberapa layanan.'
    }
  },
  'ERP / CRM System': {
    en: {
      context: 'ERP and CRM work affects several teams at once, so the hard part is aligning records, statuses, permissions, and handoffs across the operation. Automation is valuable only when the underlying workflow and data rules are explicit enough to trust.',
      objective: [
        'Create a shared view of the records and operational state that teams need to act on.',
        'Reduce manual re-entry and avoid conflicting versions of the same business record.',
        'Make ownership, approval, stock, sales, finance, or compliance states visible where relevant.',
        'Provide clear permission boundaries and audit-friendly process behaviour appropriate to the scope.'
      ],
      diagnosis: [
        { title: 'Find where the process loses continuity', body: 'Manual records, disconnected systems, and inconsistent status updates make it difficult to determine who owns the next action or which record is authoritative. The project challenge identifies the specific operational break this system is intended to address.' },
        { title: 'Make the data model match the business process', body: 'Customers, leads, units, inventory, orders, payroll, and finance entries have relationships and lifecycle states. Those relationships need to be represented consistently so a change in one area does not silently contradict another.' },
        { title: 'Automate repeatable rules without hiding exceptions', body: 'Automation can reduce routine effort, but approvals, mismatches, failed integrations, and exceptional cases still need clear handling. The system should make the rule visible and make exceptions recoverable.' }
      ],
      decisions: [
        { title: 'Define the source of truth for each record', body: 'Before automating handoffs, clarify where the authoritative customer, stock, transaction, or employee information resides. This limits duplicate entry and makes reconciliation possible.' },
        { title: 'Make roles and approvals part of the workflow', body: 'Permissions and approval states should reflect the responsibilities recorded for the process. The interface then communicates not only what a user can do, but why a record is waiting or who needs to act.' },
        { title: 'Connect automation to operational visibility', body: 'A background process is difficult to trust if people cannot see what it changed. Status history, exception signals, and reporting make it easier for operators to monitor the process and intervene when necessary.' }
      ],
      process: [
        { title: '01 · Map entities, roles, and handoffs', body: 'Identify the main records, who creates or approves them, and how their status changes. This exposes duplicated entry, missing ownership, and inconsistent transitions before automation is built.' },
        { title: '02 · Define rules, permissions, and reporting needs', body: 'Turn the operational requirements into explicit validation rules, role boundaries, approval steps, and reporting views. This creates a shared definition of correct behaviour across teams.' },
        { title: '03 · Implement modules and system connections', body: 'Build the modules and integrations named in the delivery scope, keeping the flow between records coherent. Data exchange and automation should preserve the relevant identity, status, and audit context.' },
        { title: '04 · Review exceptions and operational handoff', body: 'Review the main business path alongside duplicate records, missing data, rejected approvals, failed synchronisation, and other exceptions applicable to the scope. The handoff should leave the client with a clear way to operate and maintain the process.' }
      ],
      relevance: 'This case is relevant to organisations managing multiple branches, warehouses, sales teams, approvals, recurring transactions, finance or compliance requirements, or processes that have outgrown spreadsheets.'
    },
    id: {
      context: 'Pekerjaan ERP dan CRM melibatkan beberapa tim sekaligus, sehingga tantangannya adalah menyelaraskan data, status, hak akses, dan perpindahan pekerjaan di seluruh operasi. Otomatisasi baru bermanfaat jika alur kerja dan aturan datanya cukup jelas untuk dipercaya.',
      objective: [
        'Membuat tampilan bersama atas data dan status operasional yang perlu ditindaklanjuti tim.',
        'Mengurangi input ulang manual dan mencegah versi data bisnis yang saling bertentangan.',
        'Memperjelas pemilik proses, status persetujuan, stok, penjualan, keuangan, atau kepatuhan sesuai kebutuhan.',
        'Menyediakan batas akses dan perilaku proses yang mendukung audit sesuai ruang lingkup.'
      ],
      diagnosis: [
        { title: 'Menemukan bagian proses yang kehilangan kesinambungan', body: 'Catatan manual, sistem yang terpisah, dan pembaruan status yang tidak konsisten membuat pemilik tindakan berikutnya atau data utama sulit ditentukan. Tantangan proyek menunjukkan titik operasional yang ingin diperbaiki.' },
        { title: 'Menyelaraskan model data dengan proses bisnis', body: 'Pelanggan, prospek, unit, inventori, pesanan, payroll, dan transaksi keuangan memiliki hubungan serta siklus status. Hubungan itu perlu konsisten agar perubahan satu bagian tidak bertentangan dengan bagian lain.' },
        { title: 'Mengotomatisasi aturan rutin tanpa menyembunyikan pengecualian', body: 'Otomatisasi dapat mengurangi pekerjaan berulang, tetapi persetujuan, data tidak cocok, integrasi gagal, dan kasus khusus tetap perlu ditangani dengan jelas. Sistem perlu memperlihatkan aturan dan menyediakan cara pemulihan.' }
      ],
      decisions: [
        { title: 'Menentukan sumber data utama', body: 'Sebelum perpindahan pekerjaan diotomatisasi, perlu ditetapkan sistem yang menjadi acuan untuk data pelanggan, stok, transaksi, atau karyawan. Ini mengurangi input ganda dan memudahkan rekonsiliasi.' },
        { title: 'Menjadikan peran dan persetujuan bagian dari alur', body: 'Hak akses dan status persetujuan harus mengikuti tanggung jawab proses yang tercatat. Antarmuka dapat menjelaskan tindakan yang boleh dilakukan, alasan data tertahan, serta pihak yang perlu bertindak.' },
        { title: 'Menghubungkan otomatisasi dengan visibilitas operasional', body: 'Proses latar belakang sulit dipercaya jika orang tidak melihat perubahan yang terjadi. Riwayat status, sinyal pengecualian, dan pelaporan membantu operator memantau proses serta mengambil tindakan bila diperlukan.' }
      ],
      process: [
        { title: '01 · Memetakan data, peran, dan perpindahan proses', body: 'Identifikasi data utama, pihak yang membuat atau menyetujui, serta perubahan statusnya. Langkah ini membantu menemukan input ganda, pemilik proses yang tidak jelas, dan transisi yang tidak konsisten sebelum otomatisasi dibuat.' },
        { title: '02 · Menentukan aturan, hak akses, dan kebutuhan laporan', body: 'Terjemahkan kebutuhan operasional menjadi validasi, batas peran, tahapan approval, dan tampilan laporan yang eksplisit. Hasilnya menjadi acuan bersama tentang perilaku sistem yang benar.' },
        { title: '03 · Mengimplementasikan modul dan koneksi sistem', body: 'Bangun modul serta integrasi yang disebut dalam ruang lingkup dengan menjaga hubungan antar data tetap konsisten. Pertukaran data dan otomatisasi perlu mempertahankan identitas, status, serta konteks audit yang relevan.' },
        { title: '04 · Meninjau pengecualian dan serah-terima operasional', body: 'Tinjau alur bisnis utama bersama kasus data ganda, data yang kurang, approval ditolak, sinkronisasi gagal, dan pengecualian lain yang relevan. Handoff harus memberi cara yang jelas bagi klien untuk menjalankan dan memelihara proses.' }
      ],
      relevance: 'Studi kasus ini relevan bagi organisasi yang mengelola banyak cabang, gudang, tim sales, persetujuan, transaksi rutin, kebutuhan finansial atau kepatuhan, atau proses yang sudah terlalu kompleks untuk spreadsheet.'
    }
  },
  'IT Support & Infrastructure': {
    en: {
      context: 'Infrastructure work is judged by the reliability and recoverability of the services that depend on it. The solution needs to account for network and compute capacity, deployment behaviour, data protection, monitoring, and the operational responsibility after a change is made.',
      objective: [
        'Address the availability, latency, capacity, or deployment issue identified in the project record.',
        'Make recovery and failure behaviour explicit rather than relying on manual intervention alone.',
        'Improve visibility through monitoring, alerts, and operational ownership where included in scope.',
        'Deliver architecture, automation, security controls, and support arrangements that match the stated requirements.'
      ],
      diagnosis: [
        { title: 'Identify the operational failure mode', body: 'The challenge describes the condition that affects service reliability, such as load spikes, packet loss, manual release risk, data transfer delay, or insufficient recovery behaviour. The architecture should target that failure mode directly.' },
        { title: 'Understand dependencies and failure boundaries', body: 'Services depend on networks, compute, storage, configuration, databases, and external providers. A resilient design needs to identify which dependencies can become bottlenecks and what happens when one of them degrades.' },
        { title: 'Make operations observable and repeatable', body: 'A system is difficult to operate safely when deployments, incidents, or recovery steps depend on undocumented manual work. Monitoring, automation, runbooks, and clear ownership help make the operation repeatable.' }
      ],
      decisions: [
        { title: 'Design around the failure mode, not only peak performance', body: 'Capacity is only one part of reliability. Recovery objectives, isolation, health checks, deployment strategy, and data durability need to match the risk described in the brief.' },
        { title: 'Automate repeatable operations with guardrails', body: 'Infrastructure-as-code and CI/CD can reduce configuration drift and release errors when they include controlled changes, review, and rollback behaviour. Automation should make operations safer, not merely faster.' },
        { title: 'Pair delivery with monitoring and ownership', body: 'Metrics, logs, alerts, and support responsibility help the client know whether the environment is healthy and what to do when conditions change. They turn architecture into an operational service.' }
      ],
      process: [
        { title: '01 · Assess the current bottleneck and dependencies', body: 'Start from the incident or constraint documented in the project. Map the relevant traffic, infrastructure components, data paths, release steps, and recovery dependencies that influence the outcome.' },
        { title: '02 · Design the target architecture and controls', body: 'Translate the requirement into capacity, routing, segmentation, backup, security, or deployment decisions according to the listed solution. Each choice should map to a risk in the original challenge.' },
        { title: '03 · Implement migration or automation safely', body: 'Build and configure the included infrastructure and delivery automation while accounting for change order, validation, and rollback where relevant. The implementation plan should protect the continuity of the services involved.' },
        { title: '04 · Instrument, document, and support the service', body: 'Set up the monitoring, alerting, infrastructure definitions, recovery references, or SLA elements explicitly listed in the handover. These artefacts support repeatable operations and make ongoing responsibility easier to manage.' }
      ],
      relevance: 'This case is relevant when a service needs better availability, lower network delay, safer release operations, scalable capacity, more reliable backups, or clearer managed-support responsibilities.'
    },
    id: {
      context: 'Pekerjaan infrastruktur dinilai dari keandalan dan kemampuan pemulihan layanan yang bergantung padanya. Solusi perlu memperhitungkan kapasitas jaringan dan komputasi, proses deployment, perlindungan data, monitoring, serta tanggung jawab operasional setelah perubahan dilakukan.',
      objective: [
        'Menangani masalah availability, latency, kapasitas, atau proses deployment yang dicatat dalam proyek.',
        'Memperjelas pemulihan dan perilaku saat gagal, bukan hanya mengandalkan intervensi manual.',
        'Meningkatkan visibilitas melalui monitoring, alert, dan kepemilikan operasional sesuai ruang lingkup.',
        'Menyerahkan arsitektur, otomatisasi, kontrol keamanan, dan dukungan sesuai kebutuhan yang tercatat.'
      ],
      diagnosis: [
        { title: 'Menentukan pola kegagalan operasional', body: 'Tantangan menjelaskan kondisi yang mengganggu keandalan layanan, misalnya lonjakan beban, packet loss, risiko rilis manual, keterlambatan transfer data, atau kemampuan pemulihan yang terbatas. Arsitektur harus menargetkan pola kegagalan tersebut secara langsung.' },
        { title: 'Memahami dependensi dan batas kegagalan', body: 'Layanan bergantung pada jaringan, komputasi, penyimpanan, konfigurasi, database, dan penyedia eksternal. Desain yang tangguh perlu mengidentifikasi dependensi yang berpotensi menjadi bottleneck serta perilaku sistem saat salah satunya menurun.' },
        { title: 'Membuat operasi dapat diamati dan diulang', body: 'Sistem sulit dioperasikan dengan aman jika deployment, penanganan insiden, atau pemulihan bergantung pada langkah manual yang tidak terdokumentasi. Monitoring, otomatisasi, runbook, dan pemilik tanggung jawab membuat operasi lebih konsisten.' }
      ],
      decisions: [
        { title: 'Merancang sesuai pola kegagalan, bukan hanya performa puncak', body: 'Kapasitas hanyalah satu bagian dari keandalan. Sasaran pemulihan, isolasi, pemeriksaan kesehatan, strategi deployment, dan ketahanan data harus sesuai dengan risiko dalam brief.' },
        { title: 'Mengotomatisasi operasi berulang dengan pengaman', body: 'Infrastructure-as-code dan CI/CD dapat mengurangi perbedaan konfigurasi serta kesalahan rilis jika disertai kontrol perubahan, review, dan mekanisme rollback. Otomatisasi harus membuat operasi lebih aman, bukan sekadar cepat.' },
        { title: 'Menggabungkan delivery dengan monitoring dan pemilik layanan', body: 'Metrik, log, alert, dan tanggung jawab dukungan membantu klien mengetahui kondisi lingkungan serta tindakan saat keadaan berubah. Elemen ini mengubah rancangan teknis menjadi layanan operasional.' }
      ],
      process: [
        { title: '01 · Menilai bottleneck dan dependensi saat ini', body: 'Mulai dari insiden atau batasan yang tercatat. Petakan lalu lintas, komponen infrastruktur, jalur data, tahapan rilis, dan dependensi pemulihan yang memengaruhi hasil.' },
        { title: '02 · Mendesain arsitektur target dan kontrol', body: 'Terjemahkan kebutuhan menjadi keputusan kapasitas, routing, segmentasi, backup, keamanan, atau deployment sesuai solusi yang tercatat. Setiap keputusan harus menjawab risiko dalam tantangan awal.' },
        { title: '03 · Mengimplementasikan migrasi atau otomatisasi dengan aman', body: 'Bangun dan konfigurasi infrastruktur serta otomatisasi delivery yang termasuk ruang lingkup dengan memperhitungkan urutan perubahan, validasi, dan rollback jika relevan. Rencana implementasi perlu menjaga kesinambungan layanan.' },
        { title: '04 · Menambahkan observabilitas, dokumentasi, dan dukungan', body: 'Siapkan monitoring, alert, definisi infrastruktur, referensi pemulihan, atau elemen SLA yang secara eksplisit tercantum pada penyerahan. Artefak ini membantu operasi berulang dan memperjelas tanggung jawab berkelanjutan.' }
      ],
      relevance: 'Studi kasus ini relevan ketika layanan membutuhkan availability yang lebih baik, latensi jaringan yang lebih rendah, proses rilis lebih aman, kapasitas yang dapat berkembang, backup yang andal, atau tanggung jawab managed support yang lebih jelas.'
    }
  }
};

const cleanValues = (values: unknown): string[] =>
  Array.isArray(values)
    ? values.filter((value): value is string => typeof value === 'string' && value.trim().length > 0).map((value) => value.trim())
    : [];

const localText = (item: ProjectItem, field: 'desc' | 'challenge' | 'solution' | 'execution' | 'outcome', language: string): string => {
  const value = item as ProjectItem & Record<string, unknown>;
  const primary = value[field + (language === 'id' ? 'Id' : '')];
  const secondary = value[field + (language === 'id' ? '' : 'Id')];
  const primaryText = typeof primary === 'string' ? primary.trim() : '';
  const secondaryText = typeof secondary === 'string' ? secondary.trim() : '';
  return primaryText || secondaryText;
};

const readableList = (values: string[], language: string): string => {
  if (values.length < 2) return values[0] || '';
  if (values.length === 2) return values[0] + (language === 'id' ? ' dan ' : ' and ') + values[1];
  return values.slice(0, -1).join(', ') + (language === 'id' ? ', dan ' : ', and ') + values[values.length - 1];
};

const explainDeliverable = (value: string, language: string): string => {
  const v = value.toLowerCase();
  const id = language === 'id';

  if (/60s main tvc|main tvc|hero commercial|hero film|brand film master/.test(v)) return id
    ? 'Ini adalah master utama yang membawa alur cerita, pengenalan brand atau produk, dan pesan kampanye dalam versi paling lengkap pada ruang lingkup. Versi ini menjadi acuan editorial untuk memastikan potongan yang lebih pendek tetap mempertahankan ide dan tone yang sama.'
    : 'This is the main master carrying the story, brand or product introduction, and campaign message in the fullest version within the scope. It becomes the editorial reference for shorter cuts so they retain the same idea and tone.';
  if (/15s social|15-second social|social ad cut|social ads cut|vertical ad|9:16 reel|short-form cut|short social/.test(v)) return id
    ? 'Versi pendek ini perlu menyampaikan inti pesan dengan cepat pada format layar dan perilaku menonton yang dituju. Pembuka, ritme, framing, dan penutup harus tetap bekerja tanpa menganggap audiens sudah melihat master utama.'
    : 'This shorter version needs to communicate the core message quickly in the intended screen format and viewing context. Its opening, pacing, framing, and close must work even when the audience has not seen the main master.';
  if (/behind.the.scenes|bts reel|production reel|making.of/.test(v)) return id
    ? 'Aset ini memperlihatkan proses produksi sebagai materi pendukung yang memberi konteks pada hasil akhir. Pilihan adegan perlu menunjukkan proses secara jelas dan tetap disunting agar layak dipublikasikan di kanal yang dituju.'
    : 'This asset presents the production process as supporting content that gives context to the final work. Scene selection needs to show the process clearly while remaining edited for publication on the intended channel.';
  if (/4k dcp|digital cinema package|cinema master/.test(v)) return id
    ? 'Paket ini ditujukan untuk pemutaran bioskop atau alur distribusi sinema, bukan hanya unggahan web biasa. Resolusi, rasio gambar, audio, frame rate, dan spesifikasi penyerahan perlu sesuai dengan persyaratan pemutaran yang disepakati.'
    : 'This package is intended for cinema playback or a cinema-distribution workflow, not only a standard web upload. Resolution, aspect ratio, audio, frame rate, and delivery specifications must match the agreed playback requirements.';
  if (/storyboard|shot list|shooting script/.test(v)) return id
    ? 'Dokumen ini menyusun urutan adegan, tujuan visual, dan kebutuhan pengambilan gambar sebelum produksi berjalan. Fungsinya membantu menyamakan pemahaman tentang apa yang perlu direkam serta bagaimana tiap adegan mendukung pesan utama.'
    : 'This document organises scene order, visual intent, and capture requirements before production begins. It aligns the team on what needs to be recorded and how each scene supports the main message.';
  if (/soundtrack|orchestral score|custom score|sound design|audio mix/.test(v)) return id
    ? 'Hasil audio perlu disusun mengikuti ritme cerita dan transisi visual. Penyerahan ini mencakup peran musik atau suara dalam membangun suasana, menjaga kejelasan dialog bila ada, dan mendukung konsistensi pada versi akhir.'
    : 'The audio output needs to follow story pacing and visual transitions. It defines how music or sound establishes atmosphere, preserves dialogue clarity where present, and supports consistency in the final versions.';
  if (/colour grade|color grade|color grading|davinci resolve/.test(v)) return id
    ? 'Tahap finishing ini menyatukan exposure, kontras, skin tone, dan arah warna antarscene agar film terasa konsisten. Hasilnya perlu tetap menjaga detail penting, bukan mengejar gaya visual sampai informasi pada gambar hilang.'
    : 'This finishing stage unifies exposure, contrast, skin tones, and colour direction across scenes. The result should preserve important detail rather than pursuing a look that obscures information in the image.';
  if (/mobile design system|design system|component library|design token|brandbook|brand manual|brand guideline|style guide/.test(v)) return id
    ? 'Acuan ini mendokumentasikan aturan visual dan komponen yang harus dipakai berulang. Selain menjaga konsistensi, sistem tersebut membantu tim meninjau perubahan, memperluas layar atau media, dan mengurangi interpretasi berbeda saat implementasi.'
    : 'This reference documents visual rules and components intended for reuse. Beyond consistency, it helps teams review changes, extend screens or media, and reduce divergent interpretation during implementation.';
  if (/user flow|journey map|flow map|siteplan|workflow|process map|bi-fast.*qris|booking flow|checkout flow/.test(v)) return id
    ? 'Peta alur memperlihatkan langkah, keputusan, status, dan titik perpindahan dari satu tahap ke tahap berikutnya. Ini membantu tim menilai apakah tugas dapat diselesaikan secara logis serta menemukan kebutuhan validasi dan penanganan kondisi pengecualian.'
    : 'The flow map shows steps, decisions, states, and transitions from one stage to the next. It helps the team assess whether the task can be completed logically and identify validation and exception-handling needs.';
  if (/prototype|interactive spec|interaction spec|high.fidelity prototype/.test(v)) return id
    ? 'Prototipe membuat struktur dan perilaku interaksi dapat ditinjau sebelum keputusan masuk ke implementasi penuh. Klien dapat memberi masukan pada urutan aksi dan keadaan antarmuka berdasarkan pengalaman yang lebih konkret daripada gambar statis.'
    : 'The prototype makes interaction structure and behaviour reviewable before decisions move into full implementation. The client can comment on action sequence and interface states through a more concrete experience than static images.';
  if (/mobile app|mobile application|driver app|telemedicine app|trading terminal/.test(v)) return id
    ? 'Output aplikasi ini menggabungkan navigasi, informasi, dan tindakan yang dibutuhkan pengguna pada perangkat mobile. Detail yang penting bukan hanya tampilan tiap layar, tetapi kesinambungan alur, perilaku status, dan keterbacaan pada ukuran perangkat yang dituju.'
    : 'This application output brings together the navigation, information, and actions users need on mobile devices. The important detail is not only each screen’s appearance, but journey continuity, state behaviour, and legibility at the intended device size.';
  if (/dashboard|admin panel|merchant terminal|analytics studio|reporting workspace/.test(v)) return id
    ? 'Dashboard menyatukan data dan tindakan operasional ke dalam satu permukaan kerja. Informasi penting perlu dapat dipindai, dibandingkan, dan ditelusuri ke detail sehingga pengguna tidak hanya melihat angka tanpa memahami status atau tindak lanjutnya.'
    : 'The dashboard brings operational information and actions into one working surface. Key information needs to be scannable, comparable, and traceable to detail so users do not see numbers without understanding their state or next action.';
  if (/rest api|graphql api|websocket|payment integration|payment gateway|shipping api|courier api|webhook|reconciliation integration/.test(v)) return id
    ? 'Integrasi menghubungkan aplikasi dengan layanan atau data yang berada di luar antarmuka utama. Ruang lingkupnya perlu mencakup bentuk data, status berhasil/gagal, validasi, dan perilaku saat respons terlambat atau tidak tersedia.'
    : 'The integration connects the application with services or data outside the main interface. Its scope needs to account for data shape, success and failure states, validation, and behaviour when a response is delayed or unavailable.';
  if (/headless.*storefront|e-commerce|ecommerce|online store|subscription store|product catalogue|product catalog|checkout/.test(v)) return id
    ? 'Output commerce ini menghubungkan penemuan produk dengan keputusan pembelian dan langkah order berikutnya. Informasi produk, pilihan, harga, stok, pembayaran, serta status pesanan perlu disajikan sebagai satu alur yang konsisten.'
    : 'This commerce output connects product discovery with purchase decisions and the next order steps. Product information, options, pricing, stock, payment, and order state need to work as one consistent journey.';
  if (/corporate website|company profile website|corporate portal|investor portal|service website|website/.test(v)) return id
    ? 'Website menyediakan struktur publik untuk menjelaskan organisasi, layanan, bukti kemampuan, dan jalur tindak lanjut. Nilainya bergantung pada kejelasan arsitektur informasi, perilaku responsif, performa, dan kemudahan pembaruan konten sesuai ruang lingkup.'
    : 'The website provides a public structure for explaining the organisation, services, proof of capability, and next steps. Its value depends on clear information architecture, responsive behaviour, performance, and maintainable content updates within the scope.';
  if (/kubernetes|cloud|infrastructure|server|network|terraform|gitops|cicd|ci\/cd|backup|disaster recovery|sla|monitoring|security|routing|autoscaling|runbook|architecture diagram/.test(v)) return id
    ? 'Keluaran ini membantu menjelaskan atau mengoperasikan konfigurasi infrastruktur yang dimaksud. Detail pentingnya adalah batas tanggung jawab, dependensi, monitoring, perubahan konfigurasi, dan prosedur pemulihan yang relevan bagi tim yang akan mengelola layanan.'
    : 'This output helps explain or operate the intended infrastructure configuration. Important details include ownership boundaries, dependencies, monitoring, configuration changes, and recovery procedures relevant to the team managing the service.';
  if (/report|whitepaper|pitch deck|slide|presentation|flipbook|pdf|infographic|executive summary|lookbook/.test(v)) return id
    ? 'Dokumen ini menyusun informasi ke dalam urutan yang membantu pembaca memahami konteks, bukti, dan pesan utama. Hierarki editorial, label, grafik, serta struktur halaman perlu sesuai dengan situasi membaca dan keputusan yang ingin didukung.'
    : 'This document organises information into a sequence that helps readers understand context, evidence, and the main message. Editorial hierarchy, labels, charts, and page structure need to fit the reading context and the decision the document is meant to support.';
  if (/3d|render|webgl|ar |augmented reality|virtual experience|viewer|model/.test(v)) return id
    ? 'Aset ini membantu audiens memahami bentuk, ruang, material, atau perilaku objek. Sudut pandang, tingkat detail, pencahayaan, dan format akhir harus dipilih sesuai informasi yang perlu terlihat dan cara audiens akan mengakses visualisasi.'
    : 'This asset helps the audience understand form, space, material, or object behaviour. Camera views, level of detail, lighting, and output format need to match the information that must be visible and how the audience will access the visualisation.';
  if (/packaging|label|cup|apparel|collateral|stationery|signage|environmental graphic|poster|print/.test(v)) return id
    ? 'Aplikasi ini menunjukkan bagaimana identitas bekerja pada media nyata, termasuk batas ukuran, bahan, keterbacaan, dan kebutuhan produksi yang relevan. Keluaran harus tetap konsisten dengan sistem utama saat dipakai pada konteks fisik yang berbeda.'
    : 'This application demonstrates how the identity works on a real medium, including size, material, readability, and relevant production constraints. It needs to stay consistent with the core system across different physical contexts.';
  if (/animation|lottie|motion|stinger|lower third|scoreboard|overlay/.test(v)) return id
    ? 'Aset gerak menerjemahkan pesan atau identitas ke dalam urutan visual yang sesuai durasi dan format tayang. Timing, transisi, ukuran, serta tingkat keterbacaan perlu selaras agar motion mendukung pesan dan tidak mengganggu informasi utama.'
    : 'The motion asset translates a message or identity into a visual sequence suited to its duration and display format. Timing, transitions, scale, and legibility need to align so motion supports the message rather than obscuring key information.';
  if (/logo|monogram|identity|emblem|typography|typeface/.test(v)) return id
    ? 'Elemen identitas ini menjadi bagian yang mudah dikenali dari sistem brand. Bentuk, proporsi, tipografi, dan aturan penggunaan perlu tetap konsisten agar identitas bisa diterapkan lintas ukuran dan media.'
    : 'This identity element becomes a recognisable part of the brand system. Form, proportion, typography, and usage rules need to stay consistent across sizes and media.';
  if (/source file|source code|asset library|vector asset|template|snippet/.test(v)) return id
    ? 'File sumber memberi tim bahan untuk meninjau, memelihara, atau mengembangkan hasil setelah penyerahan. Struktur file, penamaan, dan kelengkapan dependensi sama pentingnya dengan output yang terlihat oleh pengguna.'
    : 'Source files give the team material to inspect, maintain, or extend the work after handoff. File structure, naming, and dependency completeness matter alongside the user-facing output.';
  if (/data|chart|heatmap|visuali[sz]ation|analytics|metric|financial/.test(v)) return id
    ? 'Keluaran ini membuat informasi penting lebih mudah dibandingkan dan digunakan untuk memahami kondisi atau mengambil keputusan. Konteks, satuan, label, dan sumber data perlu jelas supaya visualisasi tidak menimbulkan kesimpulan yang keliru.'
    : 'This output makes important information easier to compare and use when understanding a situation or making a decision. Context, units, labels, and data source need to be clear so the visualisation does not lead to a misleading conclusion.';
  return id
    ? 'Keluaran ini merupakan bagian konkret dari ruang lingkup proyek. Fungsinya perlu dinilai bersama tantangan awal, komponen solusi lain, serta kebutuhan penggunaan akhir yang tercatat.'
    : 'This is a concrete part of the project scope. Its role should be assessed alongside the original challenge, other solution components, and the recorded final use case.';
};

const explainSolutionComponent = (component: string, language: string): string => {
  const value = component.toLowerCase();
  const id = language === 'id';
  if (/storyboard|storyboard|script|concept|creative direction|sequence/.test(value)) return id
    ? 'Komponen ini menerjemahkan tujuan dan pesan proyek menjadi urutan yang bisa dievaluasi sebelum produksi penuh. Fungsinya adalah menyamakan arah cerita, menentukan informasi yang harus terlihat, dan mengurangi keputusan penting yang baru dibuat pada tahap akhir.'
    : 'This element translates the project goal and message into a sequence that can be reviewed before full production. It aligns the story direction, defines what must be visible, and reduces the need to make major decisions at the final stage.';
  if (/aerial|drone|cinematography|camera|russian arm|chase|high-speed|phantom|arri|sony fx|gimbal|lens|capture/.test(value)) return id
    ? 'Pilihan pengambilan gambar ini mendukung cara subjek, gerakan, skala, atau lokasi harus terlihat. Nilainya bergantung pada kecocokan teknik dengan adegan, kesinambungan visual, dan kebutuhan komposisi yang telah ditetapkan.'
    : 'This capture choice supports how the subject, movement, scale, or location needs to be shown. Its value depends on the technique matching the scene, maintaining visual continuity, and meeting the intended composition.';
  if (/orchestral|scoring|soundtrack|sound design|audio|lavalier|acoustic|music/.test(value)) return id
    ? 'Lapisan audio membantu membentuk suasana dan ritme sekaligus mendukung informasi yang disampaikan gambar. Musik, dialog, efek, dan transisi perlu saling mendukung agar tidak bersaing dengan pesan utama.'
    : 'The audio layer helps shape atmosphere and rhythm while supporting the information carried by the picture. Music, dialogue, effects, and transitions need to work together rather than compete with the main message.';
  if (/color grading|davinci|colour|grading|color grade/.test(value)) return id
    ? 'Tahap finishing warna menyatukan tampilan antarscene dan mengarahkan persepsi terhadap suasana, material, serta subjek. Ini membantu hasil akhir terasa sengaja dirancang, bukan sekadar kumpulan footage yang berbeda kondisi.'
    : 'Colour finishing unifies the look across scenes and guides how the audience reads mood, materials, and subjects. It helps the final film feel intentionally directed rather than like footage captured under unrelated conditions.';
  if (/biometric|onboarding|user flow|journey|quick-transfer|transfer|qris|checkout flow|triage|booking|prescription|high contrast|touch zone|offline|barcode|node-graph|inspector panel|debugging indicator|heatmap|shortcut/.test(value)) return id
    ? 'Komponen ini menjawab hambatan pada alur pengguna dengan membuat tindakan, informasi, atau status yang relevan lebih jelas. Nilainya perlu dilihat dari hubungan antara kebutuhan pengguna, perilaku antarmuka, dan langkah berikutnya yang harus dilakukan.'
    : 'This element addresses friction in the user journey by making the relevant action, information, or state clearer. Its value should be assessed through the connection between user needs, interface behaviour, and the next action the user must take.';
  if (/wcag|accessible|accessibility|contrast|large touch|font|typography|legibility|readability/.test(value)) return id
    ? 'Fokus keterbacaan ini membantu informasi penting tetap dapat dikenali pada kondisi penggunaan yang relevan. Kontras, ukuran, jarak, dan konsistensi perlu diterapkan sebagai aturan sistem, bukan penyesuaian terpisah pada satu layar.'
    : 'This readability focus helps important information remain recognisable in the intended use conditions. Contrast, sizing, spacing, and consistency need to operate as system rules rather than isolated adjustments to one screen.';
  if (/design system|component library|design token|modular|reusable|system/.test(value)) return id
    ? 'Sistem dan komponen yang dapat digunakan ulang mengurangi perbedaan implementasi saat halaman atau fitur bertambah. Aturan bersama juga memudahkan tim meninjau perubahan tanpa harus mendesain ulang setiap elemen yang sejenis.'
    : 'Reusable systems and components reduce implementation drift as pages or features expand. Shared rules also help teams review changes without redesigning every similar element.';
  if (/logo|monogram|identity|canting|typography|palette|brand|gold foil|packaging|signage|brandbook|geometric/.test(value)) return id
    ? 'Elemen identitas ini memberi bentuk konkret pada karakter brand dan perlu bekerja pada media yang benar-benar digunakan. Sistemnya harus menjaga pengenalan, keterbacaan, dan konsistensi ketika diterapkan pada ukuran atau material berbeda.'
    : 'This identity element gives concrete form to the brand character and needs to work on the media where it will actually be used. The system must preserve recognition, readability, and consistency across different sizes or materials.';
  if (/animation|kinetic|morph|lottie|vector|character|storyline|motion|transition|3d parcel|billboard|overlay|lower third|scoreboard/.test(value)) return id
    ? 'Gerak dan aset visual ini menerjemahkan pesan menjadi urutan yang dapat ditangkap dalam waktu tayang terbatas. Komposisi, tempo, dan transisi perlu menuntun perhatian serta tetap terbaca pada format output yang dipakai.'
    : 'This motion and visual asset turns the message into a sequence viewers can absorb within the available viewing time. Composition, timing, and transitions should direct attention and remain legible in the target output format.';
  if (/render|3d|webgl|unreal|ar |augmented reality|material|lighting|photorealistic|modeling|modelling|shader/.test(value)) return id
    ? 'Komponen visualisasi ini membantu memperlihatkan bentuk, material, kedalaman, atau perilaku objek. Model, pencahayaan, sudut pandang, dan tingkat detail perlu mengikuti tujuan visual serta kemampuan format akhirnya.'
    : 'This visualisation element helps communicate form, material, depth, or object behaviour. Modelling, lighting, camera angle, and level of detail should follow the visual purpose and capabilities of the final format.';
  if (/api|integration|websocket|realtime|real-time|sync|synchron|webhook|midtrans|stripe|payment|qr code|qris|courier|shipping|notification|whatsapp/.test(value)) return id
    ? 'Integrasi ini menghubungkan sistem atau langkah yang sebelumnya harus dikelola terpisah. Detail pentingnya adalah konsistensi status, validasi data, penanganan respons gagal, dan kejelasan informasi yang diterima pengguna.'
    : 'This integration connects systems or steps that would otherwise need separate handling. The important details are state consistency, data validation, failure handling, and clarity of the information returned to users.';
  if (/next\.?js|headless|storefront|e-commerce|commerce|subscription|quiz|bundle|inventory|catalog|catalogue|cart|checkout/.test(value)) return id
    ? 'Pilihan ini mengatur hubungan antara pengalaman belanja di sisi pelanggan dan proses di belakangnya. Katalog, pilihan produk, keranjang, pembayaran, inventori, dan notifikasi harus memperlihatkan status yang saling sesuai.'
    : 'This choice shapes the relationship between the customer-facing shopping experience and the processes behind it. Catalogue, product options, cart, payment, inventory, and notifications need to present consistent states.';
  if (/dashboard|analytics|data visual|heatmap|financial|report|data|chart|metric|visualizer|visualiser|infographic/.test(value)) return id
    ? 'Komponen ini membantu mengubah data atau informasi padat menjadi struktur yang dapat dipindai dan dibandingkan. Label, hierarki, konteks, dan pembaruan data perlu cukup jelas agar pembaca tidak hanya melihat angka tanpa memahami maknanya.'
    : 'This element turns data or dense information into a structure that can be scanned and compared. Labels, hierarchy, context, and data updates need to be clear enough that readers do not see numbers without understanding their meaning.';
  if (/kubernetes|cloud|infrastructure|server|network|terraform|gitops|cicd|ci\/cd|backup|disaster recovery|sla|monitoring|security|routing|autoscaling|redis|cache|failover|anycast|latency|packet|proxy|edge/.test(value)) return id
    ? 'Komponen infrastruktur ini diarahkan pada pola risiko yang tercatat dalam brief, seperti kapasitas, latensi, konsistensi deployment, atau kemampuan pulih saat terjadi gangguan. Konfigurasi akhir perlu dinilai bersama monitoring, batas kegagalan, dan prosedur operasionalnya.'
    : 'This infrastructure element targets the risk pattern described in the brief, such as capacity, latency, deployment consistency, or recovery during disruption. The final configuration needs to be assessed alongside monitoring, failure boundaries, and operational procedures.';
  if (/automation|automated|engine|algorithm|scheduler|forecast|reconciliation|tax|payroll|inventory|approval|permission|role-based|workflow|crdt|wasm|webassembly|gpu|canvas/.test(value)) return id
    ? 'Logika ini mengubah aturan kerja menjadi perilaku sistem yang lebih konsisten. Validasi input, status proses, penanganan pengecualian, dan jejak perubahan tetap penting agar otomatisasi dapat dipercaya.'
    : 'This logic turns an operational rule into more consistent system behaviour. Input validation, process states, exception handling, and change history remain important so the automation can be trusted.';
  if (/content|cms|portal|website|web application|application|admin panel|gateway|mobile app|interface|platform/.test(value)) return id
    ? 'Bagian ini menyediakan titik akses untuk informasi atau tindakan yang dibutuhkan pengguna. Struktur navigasi, status, respons layar, serta cara pengelolaan konten perlu mendukung proses yang dijelaskan dalam proyek.'
    : 'This part provides the access point for the information or actions users need. Navigation structure, states, responsive behaviour, and content management should support the workflow described in the project.';
  return id
    ? 'Komponen ini merupakan bagian dari solusi yang tercatat. Perannya perlu dibaca bersama tantangan awal, deliverable lain, dan kebutuhan penggunaan akhir; data publik belum merinci konfigurasi yang lebih spesifik.'
    : 'This component is part of the recorded solution. Its role should be read alongside the original challenge, the other deliverables, and the final use case; the public record does not specify a more granular configuration.';
};

const cleanSolutionComponentLabel = (source: string): string => {
  const value = source
    .trim()
    .replace(/^(?:and|dan)\s+/i, '')
    .replace(/^(?:engineered|designed|created|built|developed|implemented|crafted|used|delivered|deployed|architected|integrated|exported|produced|established|rendered|shot|configured|optimised|optimized|introduced|combined|translated|launched|migrated|automated|connected|programmed|structured|leveraged|executed|animated|modelled|modeled|converted|refined|synchronized|synchronised|tuned|applied|assembled|generated|menerapkan|membangun|merancang|mengembangkan|membuat|menggunakan|mengintegrasikan|menyiapkan|menyusun|mendesain|menerjemahkan|menghasilkan|menambahkan|mengoptimalkan|mengotomatisasi|menghubungkan|memproduksi|mengekspor|menyatukan|mengkonsolidasikan|memperbaiki|menggabungkan|menyediakan|menciptakan|mengatur|menghasilkan|menampilkan)\s+/i, '')
    .replace(/^(?:a|an|the)\s+/i, '')
    .trim();
  return value ? value.charAt(0).toLocaleUpperCase() + value.slice(1) : '';
};

const solutionComponentHeading = (component: string): string => {
  const maxLength = 76;
  if (component.length <= maxLength) return component;
  return component.slice(0, maxLength - 1).trimEnd() + '…';
};

const splitSolutionComponents = (solution: string): string[] => {
  const value = solution.trim().replace(/^[^:]{3,100}:\s*/, '').replace(/[.;]\s*$/, '');
  const parts = value
    .split(/,\s*|\s+(?:and|dan)\s+/i)
    .map(cleanSolutionComponentLabel)
    .filter(Boolean);
  return Array.from(new Set(parts)).slice(0, 6);
};

const executionFraming = (item: ProjectItem, challenge: string, language: string): string => {
  const id = language === 'id';
  const service = item.service;
  const framing: Partial<Record<ProjectItem['service'], { en: string; id: string }>> = {
    'UI/UX Design': {
      en: 'The recorded challenge is translated into the key user task, the point where confusion or failure occurs, and the states the interface must make clear. This keeps the work tied to user behaviour instead of treating the brief as a request for attractive screens alone.',
      id: 'Tantangan yang tercatat diterjemahkan menjadi tugas utama pengguna, titik terjadinya kebingungan atau kegagalan, serta status yang harus diperjelas oleh antarmuka. Dengan begitu, pengerjaan tetap berangkat dari perilaku pengguna dan bukan hanya permintaan membuat layar yang menarik.'
    },
    'Video Production': {
      en: 'The recorded challenge becomes the creative constraint for the film: what the audience should feel or understand, which visual details must carry that message, and how every production element should support the same tone. The intention is to make the shoot and edit serve one coherent story.',
      id: 'Tantangan yang tercatat menjadi batas kreatif film: kesan atau pesan yang perlu diterima audiens, detail visual yang harus mendukung pesan, dan bagaimana setiap elemen produksi menjaga tone yang sama. Tujuannya adalah agar proses pengambilan gambar dan editing mendukung satu cerita yang utuh.'
    },
    '2D Animation': {
      en: 'The original problem is converted into a message sequence: what viewers need to understand first, what needs a visual example, and which parts need emphasis or time to be read. This becomes the basis for deciding what each animated scene must explain.',
      id: 'Masalah awal diubah menjadi urutan pesan: hal yang perlu dipahami lebih dahulu, bagian yang membutuhkan contoh visual, serta informasi yang perlu ditekankan atau diberi waktu untuk dibaca. Ini menjadi dasar untuk menentukan fungsi setiap adegan animasi.'
    },
    'Branding & Identity': {
      en: 'The challenge is translated into brand attributes and practical constraints for recognition across the applications in scope. This establishes the criteria for judging whether the identity concept works beyond a single logo presentation.',
      id: 'Tantangan diterjemahkan menjadi karakter brand dan batas penerapan agar identitas tetap dikenali pada berbagai media dalam ruang lingkup. Ini menjadi acuan untuk menilai apakah konsep identitas bekerja lebih luas daripada sekadar presentasi logo.'
    },
    'Motion & Graphic Design': {
      en: 'The challenge is translated into the audience, viewing duration, primary message, and display constraints. Those factors determine what should appear first, how movement guides attention, and which information must remain legible.',
      id: 'Tantangan diterjemahkan menjadi kebutuhan audiens, durasi melihat, pesan utama, dan batas media tayang. Faktor tersebut menentukan informasi yang harus terlihat lebih dahulu, cara gerak mengarahkan perhatian, dan detail yang wajib tetap terbaca.'
    },
    'Creative Design': {
      en: 'The brief is translated into the reader’s main question, the evidence needed to answer it, and the order in which information should be discovered. That hierarchy guides page composition and prevents visual styling from obscuring the content.',
      id: 'Brief diterjemahkan menjadi pertanyaan utama pembaca, bukti yang dibutuhkan untuk menjawabnya, dan urutan penemuan informasi. Hierarki tersebut menjadi acuan komposisi halaman agar gaya visual tidak menutupi isi.'
    },
    '3D Visualization': {
      en: 'The challenge defines what the viewer must understand from the visual: form, space, material, movement, or product detail. That requirement sets the priorities for modelling, camera, materials, lighting, and final output.',
      id: 'Tantangan menentukan hal yang perlu dipahami audiens melalui visual: bentuk, ruang, material, gerak, atau detail produk. Kebutuhan itu menetapkan prioritas modeling, kamera, material, pencahayaan, dan output akhir.'
    },
    'Company Profile Website': {
      en: 'The challenge is translated into the information visitors need first, the routes they must take to reach relevant detail, and the proof or contact action that should follow. This makes page architecture answer a communication need rather than simply fill a sitemap.',
      id: 'Tantangan diterjemahkan menjadi informasi yang perlu ditemukan pengunjung lebih dahulu, jalur menuju detail yang relevan, dan bukti atau tindakan kontak yang harus tersedia sesudahnya. Dengan begitu, arsitektur halaman menjawab kebutuhan komunikasi dan bukan sekadar mengisi sitemap.'
    },
    'E-Commerce Website': {
      en: 'The challenge is mapped to the shopping decision or operational handoff that causes friction. The design and implementation priorities follow that exact point, while product, cart, payment, delivery, and status states are kept coherent around it.',
      id: 'Tantangan dipetakan ke keputusan belanja atau perpindahan proses operasional yang menimbulkan hambatan. Prioritas desain dan implementasi mengikuti titik tersebut, sambil menjaga konsistensi produk, keranjang, pembayaran, pengiriman, dan status pesanan.'
    },
    'Web Application': {
      en: 'The project challenge is converted into actors, records, actions, state changes, and completion conditions. This defines what the application has to make visible and which workflow rules need to be represented in the interface and integrations.',
      id: 'Tantangan proyek diubah menjadi aktor, data, tindakan, perubahan status, dan kondisi selesai. Ini menentukan hal yang perlu diperlihatkan aplikasi serta aturan alur yang harus diterapkan pada antarmuka dan integrasi.'
    },
    'ERP / CRM System': {
      en: 'The recorded issue is mapped across the people, records, approvals, and operational handoffs involved. This makes it possible to connect the proposed modules to a business process instead of describing them as a list of unrelated features.',
      id: 'Masalah yang tercatat dipetakan ke orang, data, approval, dan perpindahan proses yang terlibat. Ini menghubungkan modul yang diusulkan dengan proses bisnis, bukan menjelaskannya sebagai daftar fitur yang terpisah.'
    },
    'IT Support & Infrastructure': {
      en: 'The recorded issue is treated as a failure or capacity scenario to design for. Dependencies, constraints, recovery expectations, and operational visibility need to be considered together so that a technical change addresses the service risk, not only one component.',
      id: 'Masalah yang tercatat diperlakukan sebagai skenario kegagalan atau kapasitas yang harus diantisipasi. Dependensi, batasan, ekspektasi pemulihan, dan visibilitas operasional perlu dipertimbangkan bersama agar perubahan teknis menjawab risiko layanan, bukan hanya satu komponen.'
    }
  };
  const specific = framing[service]?.[id ? 'id' : 'en'] || '';
  const challengeLead = challenge
    ? (id ? 'Tantangan proyek yang menjadi acuan: ' : 'The project challenge guiding this stage: ') + challenge + ' '
    : '';
  return challengeLead + specific;
};

const explainExecutionComponent = (component: string, language: string): string => {
  const value = component.toLowerCase();
  const id = language === 'id';
  if (/storyboard|script|creative direction|concept/.test(value)) return id
    ? 'Komponen ini berada di tahap penerjemahan brief ke rencana yang bisa dikerjakan. Urutan adegan, informasi yang harus muncul, pergerakan, dan kebutuhan footage ditetapkan sebagai panduan untuk pengambilan gambar dan penyusunan edit, sehingga keputusan kreatif tidak dibuat terpisah pada tiap tahap.'
    : 'This component translates the brief into an executable plan. Scene order, required information, movement, and footage coverage are established as a guide for capture and editing, so creative decisions do not have to be reinvented at every stage.';
  if (/aerial|drone|cinematography|camera|russian arm|chase|phantom|arri|sony fx|gimbal|lens|capture/.test(value)) return id
    ? 'Komponen pengambilan gambar ini harus diterjemahkan menjadi shot yang memiliki fungsi jelas dalam cerita. Framing, gerak, fokus, eksposur, kesinambungan, dan kebutuhan footage pendukung perlu dipertimbangkan agar hasilnya dapat disusun menjadi master serta variasi format yang dibutuhkan.'
    : 'This capture component needs to translate into shots with a clear role in the story. Framing, movement, focus, exposure, continuity, and supporting coverage need to be considered so the material can form the required master and format variations.';
  if (/orchestral|scoring|soundtrack|sound design|audio|lavalier|acoustic|music/.test(value)) return id
    ? 'Komponen audio perlu mengikuti perubahan suasana dan tempo cerita, bukan hanya menjadi lapisan tambahan. Penempatan musik, transisi, dialog, dan efek perlu diseimbangkan supaya mendukung gambar dan tetap sesuai untuk versi final yang diserahkan.'
    : 'The audio component needs to follow changes in story mood and pacing rather than act as a decorative layer. Music placement, transitions, dialogue, and effects must be balanced to support the picture and remain suitable for the final delivery versions.';
  if (/color grading|davinci|colour|grading|color grade/.test(value)) return id
    ? 'Pada tahap finishing, shot yang berbeda perlu disatukan dalam arah warna dan kontras yang konsisten. Perbedaan pencahayaan, skin tone, material, dan suasana ditinjau agar gambar mendukung tone premium yang diminta tanpa menghilangkan detail penting.'
    : 'At finishing, footage from different shots needs to be unified under a consistent colour and contrast direction. Exposure differences, skin tones, materials, and mood are reviewed so the image supports the requested premium tone without losing important detail.';
  if (/biometric|onboarding|user flow|journey|quick-transfer|transfer|qris|checkout flow|triage|booking|prescription|high contrast|touch zone|offline|barcode|node-graph|inspector panel|debugging indicator|heatmap|shortcut/.test(value)) return id
    ? 'Komponen ini perlu ditempatkan pada urutan interaksi yang tepat. Masukan pengguna, validasi, konfirmasi, status berhasil atau gagal, dan langkah berikutnya harus saling terhubung supaya penyelesaian tugas tidak bergantung pada tebakan pengguna.'
    : 'This component needs to sit in the right place in the interaction flow. User input, validation, confirmation, success or failure status, and the next action should connect so completing the task does not depend on guesswork.';
  if (/wcag|accessible|accessibility|contrast|large touch|font|typography|legibility|readability/.test(value)) return id
    ? 'Penerapan perlu konsisten pada seluruh status dan ukuran yang relevan, bukan hanya pada tampilan utama. Kontras, ukuran teks, area sentuh, jarak, dan perilaku responsif ditinjau berdasarkan kondisi penggunaan yang ditargetkan.'
    : 'Implementation needs to remain consistent across relevant states and screen sizes, not only in the primary view. Contrast, type size, touch targets, spacing, and responsive behaviour are reviewed against the intended use conditions.';
  if (/design system|component library|design token|modular|reusable|system/.test(value)) return id
    ? 'Aturan dan komponen yang berulang dikonsolidasikan agar pola sejenis memiliki perilaku dan tampilan yang sama. Sistem ini juga memberi tim acuan saat menambah halaman atau memperbarui elemen tanpa membuat ulang semuanya.'
    : 'Repeated rules and components are consolidated so similar patterns behave and look consistently. The system also gives the team a reference for adding pages or updating elements without rebuilding everything.';
  if (/logo|monogram|identity|canting|typography|palette|brand|gold foil|packaging|signage|brandbook|geometric/.test(value)) return id
    ? 'Elemen ini diuji sebagai bagian dari identitas yang lebih luas: bentuk, keterbacaan, warna, ukuran, dan penerapannya pada media terkait harus tetap selaras. Hasilnya harus bisa dipakai dalam konteks sebenarnya, bukan hanya pada satu mockup.'
    : 'This element is considered as part of a broader identity system: form, legibility, colour, scale, and application across related media need to remain aligned. It must work in its real context, not only in one mockup.';
  if (/animation|kinetic|morph|lottie|vector|character|storyline|motion|transition|3d parcel|billboard|overlay|lower third|scoreboard/.test(value)) return id
    ? 'Urutan gerak disusun berdasarkan prioritas pesan: pembuka, informasi utama, transisi, dan penutup. Timing dan komposisi perlu sesuai dengan durasi serta bentuk layar yang dituju agar pesan tetap terbaca.'
    : 'The motion sequence is structured around message priority: opening, primary information, transition, and close. Timing and composition need to fit the intended duration and display so the message remains legible.';
  if (/render|3d|webgl|unreal|ar |augmented reality|material|lighting|photorealistic|modeling|modelling|shader/.test(value)) return id
    ? 'Komponen ini perlu diterjemahkan menjadi pengaturan scene, tingkat detail, material, pencahayaan, dan sudut pandang yang sesuai. Setiap keputusan visual ditinjau berdasarkan informasi yang harus terlihat serta format final yang akan digunakan.'
    : 'This component needs to be translated into scene setup, level of detail, materials, lighting, and camera views. Each visual decision is reviewed against the information that must be visible and the final format in which it will be used.';
  if (/api|integration|websocket|realtime|real-time|sync|synchron|webhook|midtrans|stripe|payment|qr code|qris|courier|shipping|notification|whatsapp/.test(value)) return id
    ? 'Integrasi ini perlu mendefinisikan data yang dikirim dan diterima, kondisi berhasil, validasi, serta penanganan saat layanan tidak memberikan respons sesuai harapan. Status yang ditampilkan ke pengguna perlu tetap selaras dengan kondisi sistem.'
    : 'This integration needs to define the data exchanged, success conditions, validation, and handling when a service does not respond as expected. The state shown to the user must remain aligned with the system state.';
  if (/next\.?js|headless|storefront|e-commerce|commerce|subscription|quiz|bundle|inventory|catalog|catalogue|cart|checkout/.test(value)) return id
    ? 'Komponen ini menghubungkan pilihan pelanggan dengan harga, stok, keranjang, pembayaran, atau proses order yang terkait. Hubungan antartahap perlu diperiksa agar pelanggan memahami pilihannya dan status pesanan tetap konsisten.'
    : 'This component links customer choices to relevant pricing, stock, cart, payment, or order processes. The relationship between stages needs to be checked so customers understand their choices and the order state stays consistent.';
  if (/dashboard|analytics|data visual|heatmap|financial|report|data|chart|metric|visualizer|visualiser|infographic/.test(value)) return id
    ? 'Informasi perlu diolah menjadi hierarki yang menunjukkan kondisi utama, perbandingan, dan detail pendukung. Label, satuan, konteks, dan pembaruan data perlu jelas supaya tampilan membantu keputusan, bukan hanya menambah grafik.'
    : 'Information needs to be organised into a hierarchy that shows the key state, comparisons, and supporting detail. Labels, units, context, and data updates need to be clear so the interface supports decisions instead of merely adding charts.';
  if (/kubernetes|cloud|infrastructure|server|network|terraform|gitops|cicd|ci\/cd|backup|disaster recovery|sla|monitoring|security|routing|autoscaling|redis|cache|failover|anycast|latency|packet|proxy|edge/.test(value)) return id
    ? 'Komponen infrastruktur perlu diterapkan terhadap dependensi dan skenario gangguan yang relevan. Konfigurasi, monitoring, kontrol akses, mekanisme pemulihan, dan cara perubahan dilakukan harus konsisten dengan tujuan keandalan yang tercatat.'
    : 'The infrastructure component needs to be implemented against the relevant dependencies and failure scenarios. Configuration, monitoring, access controls, recovery behaviour, and change procedures should align with the recorded reliability objective.';
  if (/automation|automated|engine|algorithm|scheduler|forecast|reconciliation|tax|payroll|inventory|approval|permission|role-based|workflow|crdt|wasm|webassembly|gpu|canvas/.test(value)) return id
    ? 'Aturan proses diterjemahkan menjadi kondisi input, pemicu, perubahan status, dan hasil yang dapat diperiksa. Kondisi pengecualian perlu dipikirkan agar otomatisasi tetap dapat diawasi ketika data atau proses tidak sesuai pola normal.'
    : 'The process rule is translated into inputs, triggers, state changes, and inspectable outputs. Exception conditions need to be considered so automation remains governable when data or a workflow does not follow the normal path.';
  return id
    ? explainSolutionComponent(component, language) + ' Tahap implementasi juga perlu memastikan komponen ini terhubung dengan deliverable lain, bukan diserahkan sebagai bagian yang berdiri sendiri.'
    : explainSolutionComponent(component, language) + ' Implementation also needs to ensure that this component works with the other deliverables rather than being handed over as an isolated piece.';
};

const buildProjectExecution = (
  item: ProjectItem,
  challenge: string,
  deliverables: string[],
  technologies: string[],
  language: string,
  playbook: LocalizedPlaybook
): CaseStudyNarrativeLine[] => {
  const id = language === 'id';
  const opening = executionFraming(item, challenge, language);
  const outputsSummary = deliverables.length
    ? (id ? 'Output yang dicatat untuk proyek ini: ' : 'The outputs recorded for this project are: ') + readableList(deliverables, language) + '.'
    : (id ? 'Daftar output belum tersedia dalam catatan proyek publik.' : 'A deliverables list is not available in the public project record.');
  const technologySummary = technologies.length
    ? (id ? ' Perangkat dan teknologi yang tercatat untuk mendukung pekerjaan ini: ' : ' Tools and technologies recorded for this work: ') + readableList(technologies, language) + '.'
    : (id ? ' Perangkat teknis spesifik belum dicatat secara publik.' : 'Specific production tools are not recorded publicly.');
  const processSteps = playbook.process.map((step, index) => {
    const titleWithoutNumber = step.title.replace(/^\d+\s*·\s*/, '');
    const number = String(index + 2).padStart(2, '0');
    return {
      title: number + ' · ' + titleWithoutNumber,
      body: step.body,
    };
  });
  const finalTitleNumber = String(processSteps.length + 2).padStart(2, '0');
  const finalReview = id
    ? 'Sebelum penyerahan, hasil ditinjau terhadap tujuan awal, konsistensi antar-output, kebutuhan format, kelengkapan file, dan kesiapan penggunaan. Catatan publik tidak memuat tanggal review atau daftar persetujuan per tahap, sehingga detail tersebut perlu mengikuti dokumentasi proyek yang disetujui.'
    : 'Before handover, the work is reviewed against the original objective, consistency across outputs, format requirements, file completeness, and readiness for use. The public record does not include review dates or stage-by-stage approvals, so those details should follow the approved project documentation.';
  return [
    {
      title: id ? '01 · Mengubah brief menjadi rencana kerja' : '01 · Translate the brief into a working plan',
      body: opening + (id
        ? ' Fokus berikutnya adalah menerjemahkan kebutuhan tersebut menjadi urutan kerja, titik review, dan kriteria penerimaan yang bisa diperiksa. Tahapan ini menjaga keputusan produksi atau implementasi tetap berhubungan dengan masalah yang ingin diselesaikan.'
        : ' The next step is to translate that need into a sequence of work, review points, and inspectable acceptance criteria. This keeps production or implementation decisions connected to the problem the project is meant to solve.')
    },
    ...processSteps,
    {
      title: finalTitleNumber + (id ? ' · Quality check dan serah terima' : ' · Quality check and handover'),
      body: finalReview + ' ' + outputsSummary + technologySummary,
    },
  ];
};

const explainTechnology = (technology: string, language: string): string => {
  const t = technology.toLowerCase();
  const id = language === 'id';
  if (/figma|figjam/.test(t)) return id ? 'Mendukung penyusunan layout, komponen, prototipe, dan komunikasi rancangan antartim.' : 'Supports layouts, components, prototypes, and design communication between teams.';
  if (/react|vue|next\.?js|laravel|typescript|javascript|html|css|tailwind|bootstrap/.test(t)) return id ? 'Menjadi bagian dari lapisan antarmuka atau aplikasi yang dirancang untuk interaksi, struktur halaman, dan perilaku digital.' : 'Forms part of the application or interface layer responsible for interaction, page structure, and digital behaviour.';
  if (/api|websocket|graphql|rest|midtrans|stripe|qris|payment|rajaongkir|whatsapp/.test(t)) return id ? 'Menangani pertukaran data atau koneksi ke layanan eksternal yang tercantum pada kebutuhan proyek.' : 'Handles data exchange or connectivity with an external service named in the project scope.';
  if (/kubernetes|docker|terraform|cloud|aws|gcp|google cloud|redis|argocd|gitlab|cloudflare|linux|nginx|server/.test(t)) return id ? 'Berperan pada deployment, kapasitas, infrastruktur, otomatisasi operasional, atau ketahanan layanan.' : 'Supports deployment, capacity, infrastructure, operational automation, or service resilience.';
  if (/after effects|premiere|davinci|blender|cinema 4d|unreal|lumion|sketchup|maya|phantom|arri|sony|drone/.test(t)) return id ? 'Mendukung proses produksi visual, penyusunan adegan, pengolahan gambar, animasi, atau finishing sesuai kebutuhan output.' : 'Supports visual production, scene creation, image processing, animation, or finishing for the required output.';
  if (/lottie|json|webgl|wasm|webassembly|canvas|crdt|nodecg|gpu/.test(t)) return id ? 'Berhubungan dengan format aset interaktif, rendering, animasi, atau perilaku real-time yang disebut dalam ruang lingkup.' : 'Relates to the interactive asset format, rendering, animation, or real-time behaviour named in the scope.';
  if (/photoshop|illustrator|lightroom|indesign|adobe/.test(t)) return id ? 'Mendukung produksi, pengolahan, tata letak, dan penyiapan aset visual.' : 'Supports the creation, editing, layout, and preparation of visual assets.';
  return id
    ? 'Tercatat sebagai alat atau teknologi dalam proyek; rincian pemakaian teknisnya perlu mengikuti dokumentasi implementasi yang disetujui.'
    : 'Listed as a tool or technology for this project; its exact technical use should follow the approved implementation record.';
};

const explainMetricSignals = (metrics: Array<{ label: string; value: string }>, language: string): string => {
  const id = language === 'id';
  const labels = metrics.map((metric) => String(metric.label || '').toLowerCase());
  const groups: string[] = [];
  if (labels.some((label) => /view|reach|impression|visitor|visit|watch time|readership|download|citation|media mention|concurrent|volume|transaction value|players hosted|audience|user base|outlets|sites served|users managed/.test(label))) {
    groups.push(id
      ? 'indikator jangkauan atau skala penggunaan, yang menunjukkan berapa banyak orang, transaksi, atau aktivitas yang tercatat'
      : 'reach or usage-scale indicators, showing how many people, transactions, or activities are recorded');
  }
  if (labels.some((label) => /engagement|completion|recall|rating|satisfaction|retention|share|subscriber|repeat|trust|delight|readership|brand trust|customer lifetime value|watch time/.test(label))) {
    groups.push(id
      ? 'indikator respons, pengalaman, atau keberlanjutan penggunaan, yang menggambarkan bagaimana audiens atau pengguna berinteraksi'
      : 'response, experience, or continued-use indicators, showing how audiences or users interact');
  }
  if (labels.some((label) => /conversion|pre.order|sales|inquir|rfq|lead|booking|funding|revenue|aov|cac|roas|roi|sold|export|income|savings|cost|pipe|term sheet|footfall|orders/.test(label))) {
    groups.push(id
      ? 'indikator komersial, yang berkaitan dengan inquiry, transaksi, penjualan, biaya, atau nilai bisnis'
      : 'commercial indicators, relating to inquiries, transactions, sales, cost, or business value');
  }
  if (labels.some((label) => /latency|load speed|page speed|uptime|fps|error|accuracy|time|rto|mttr|downtime|execution speed|turnaround|wait time|response|requests|tps|spoillage|spoilage|packet loss|fraud|reliability|recovery|deployment|audit score|compliance/.test(label))) {
    groups.push(id
      ? 'indikator operasional atau teknis, yang menunjukkan performa, keandalan, waktu proses, atau tingkat kesalahan'
      : 'operational or technical indicators, showing performance, reliability, processing time, or error levels');
  }
  const distinctGroups = Array.from(new Set(groups));
  if (distinctGroups.length === 0) {
    return id
      ? 'Indikator di bawah mengukur beberapa sisi hasil proyek. Masing-masing perlu dibaca sesuai definisinya, bukan digabungkan menjadi satu klaim keberhasilan.'
      : 'The indicators below measure different aspects of the project. Each should be read according to its definition rather than combined into a single success claim.';
  }
  return id
    ? 'Indikator yang tercantum mencakup ' + readableList(distinctGroups, language) + '. Masing-masing menjawab pertanyaan yang berbeda, sehingga angka jangkauan tidak otomatis berarti konversi, dan indikator teknis tidak otomatis membuktikan pertumbuhan bisnis.'
    : 'The listed indicators cover ' + readableList(distinctGroups, language) + '. Each answers a different question, so reach does not automatically mean conversion, and a technical indicator does not automatically prove business growth.';
};

const normalizeNarrativeComparison = (value: string): string => value
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const isRedundantNarrative = (candidate: string, sources: string[]): boolean => {
  const normalized = normalizeNarrativeComparison(candidate);
  if (!normalized) return true;
  return sources.some((source) => {
    const comparison = normalizeNarrativeComparison(source);
    if (!comparison) return false;
    if (normalized === comparison) return true;
    // CMS records sometimes copy a project description into execution/outcome.
    // Ignore only near-identical long strings, preserving distinct details.
    const shorter = Math.min(normalized.length, comparison.length);
    const longer = Math.max(normalized.length, comparison.length);
    return shorter >= 80 && longer > 0 && shorter / longer >= 0.84 &&
      (normalized.includes(comparison) || comparison.includes(normalized));
  });
};

const expandChallengeNarrative = (item: ProjectItem, challenge: string, language: string): string => {
  const id = language === 'id';
  const framing: Record<ProjectItem['service'], { en: string; id: string }> = {
    'UI/UX Design': {
      en: 'This challenge needs to be examined across the full task journey: entry, decisions, information hierarchy, validation, feedback, and recovery when something goes wrong. Improving a single screen would not be enough if the surrounding steps still leave people uncertain about what to do next.',
      id: 'Tantangan ini perlu ditinjau sepanjang alur tugas: titik masuk, keputusan, hierarki informasi, validasi, feedback, dan pemulihan saat terjadi kesalahan. Memperbaiki satu layar saja tidak cukup jika langkah di sekitarnya masih membuat pengguna ragu tentang tindakan berikutnya.'
    },
    'Video Production': {
      en: 'The production challenge is to make the intended brand impression hold together from the first idea to the final cut. Concept, shot coverage, camera movement, sound, pacing, colour treatment, and channel-specific edits have to reinforce the same message instead of feeling like separate production choices.',
      id: 'Tantangan produksi adalah menjaga kesan brand tetap utuh dari ide pertama sampai versi final. Konsep, cakupan shot, gerak kamera, suara, tempo, warna, dan editing untuk tiap kanal perlu memperkuat pesan yang sama, bukan terasa seperti keputusan produksi yang terpisah.'
    },
    '2D Animation': {
      en: 'The problem is not simply how to animate the subject, but how to help the audience understand and retain the message. Information order, visual metaphor, on-screen wording, timing, and transitions need to work together so movement clarifies the topic rather than adding more noise.',
      id: 'Masalahnya bukan sekadar bagaimana menganimasikan materi, tetapi bagaimana membantu audiens memahami dan mengingat pesan. Urutan informasi, metafora visual, teks di layar, timing, dan transisi perlu bekerja bersama agar gerakan memperjelas materi, bukan menambah gangguan.'
    },
    'Branding & Identity': {
      en: 'The identity has to do more than look distinctive in a single presentation. It needs recognisable rules that remain legible and coherent when applied across the real touchpoints, formats, sizes, and production conditions included in the scope.',
      id: 'Identitas brand harus lebih dari sekadar terlihat berbeda pada satu presentasi. Sistemnya perlu memiliki aturan yang mudah dikenali, tetap terbaca, dan konsisten saat diterapkan ke berbagai media, format, ukuran, dan kondisi produksi dalam ruang lingkup.'
    },
    'Motion & Graphic Design': {
      en: 'The core challenge is to make the message understandable within the time and space available to the audience. Hierarchy, timing, scale, contrast, motion, and format adaptations have to prioritise the information that matters instead of competing for attention.',
      id: 'Tantangan utamanya adalah membuat pesan dipahami dalam waktu dan ruang yang tersedia bagi audiens. Hierarki, timing, ukuran, kontras, gerak, dan adaptasi format perlu memprioritaskan informasi terpenting, bukan saling berebut perhatian.'
    },
    'Creative Design': {
      en: 'The content must help its reader find the right information, understand its significance, and move through the material without losing the main argument. Editorial order, typography, chart or image treatment, and page composition therefore need to support comprehension as well as appearance.',
      id: 'Konten perlu membantu pembaca menemukan informasi yang tepat, memahami maknanya, dan mengikuti materi tanpa kehilangan inti pembahasan. Urutan editorial, tipografi, pengolahan grafik atau gambar, dan komposisi halaman harus mendukung pemahaman sekaligus tampilan.'
    },
    '3D Visualization': {
      en: 'The visual needs to communicate the right spatial, material, or product information from the viewer’s intended perspective. Modelling detail, lighting, camera position, motion, and output format must be chosen around what the audience needs to evaluate, rather than detail for its own sake.',
      id: 'Visual perlu menyampaikan informasi ruang, material, atau produk dari sudut pandang yang dibutuhkan audiens. Detail model, pencahayaan, posisi kamera, gerakan, dan format output harus dipilih sesuai hal yang perlu dinilai audiens, bukan menambah detail tanpa tujuan.'
    },
    'Company Profile Website': {
      en: 'The challenge is to turn a company’s capabilities and credibility into information that visitors can find and understand quickly. Page hierarchy, proof points, service detail, mobile behaviour, and the route to contact have to form one coherent path rather than a collection of disconnected pages.',
      id: 'Tantangannya adalah menerjemahkan kemampuan dan kredibilitas perusahaan menjadi informasi yang mudah ditemukan dan dipahami. Hierarki halaman, bukti kemampuan, detail layanan, perilaku mobile, dan jalur kontak perlu menjadi satu alur yang utuh, bukan halaman-halaman yang terpisah.'
    },
    'E-Commerce Website': {
      en: 'The shopping journey depends on a connected chain: discovering a product, understanding its options, confirming price and availability, completing payment, and knowing what happens to the order. Friction at any hand-off can weaken confidence, so the solution must treat the experience and its operational states together.',
      id: 'Alur belanja bergantung pada rangkaian yang saling terhubung: menemukan produk, memahami pilihan, memastikan harga dan stok, menyelesaikan pembayaran, lalu mengetahui status pesanan. Hambatan pada satu tahap dapat mengurangi kepercayaan, sehingga pengalaman belanja dan status operasional perlu dipikirkan bersama.'
    },
    'Web Application': {
      en: 'The challenge needs to be translated into users, records, permissions, actions, state changes, exceptions, and completion conditions. Without that model, a feature list may look complete while the actual workflow remains unclear or difficult to operate.',
      id: 'Tantangan perlu diterjemahkan menjadi pengguna, data, hak akses, tindakan, perubahan status, kondisi pengecualian, dan syarat penyelesaian. Tanpa model tersebut, daftar fitur bisa terlihat lengkap sementara alur kerja sebenarnya tetap tidak jelas atau sulit dijalankan.'
    },
    'ERP / CRM System': {
      en: 'The issue crosses operational hand-offs between people, records, approvals, and reporting. A useful solution has to make ownership and status visible, reduce ambiguity between teams, and preserve a consistent record as work moves through the process.',
      id: 'Masalah melibatkan perpindahan pekerjaan antara orang, data, approval, dan pelaporan. Solusi yang berguna harus memperjelas pemilik dan status pekerjaan, mengurangi ketidakjelasan antartim, serta menjaga catatan tetap konsisten saat proses berjalan.'
    },
    'IT Support & Infrastructure': {
      en: 'Infrastructure work needs to address the failure or capacity scenario behind the brief, not only change one component. Dependencies, monitoring, access, recovery, deployment, and day-to-day ownership all affect whether the service can operate reliably after delivery.',
      id: 'Pekerjaan infrastruktur perlu menjawab skenario gangguan atau kapasitas di balik brief, bukan sekadar mengubah satu komponen. Dependensi, monitoring, akses, pemulihan, deployment, dan tanggung jawab operasional memengaruhi keandalan layanan setelah penyerahan.'
    }
  };
  const additionalContext = framing[item.service][id ? 'id' : 'en'];
  return challenge ? challenge + ' ' + additionalContext : (id
    ? 'Tantangan spesifik belum dicatat pada data publik proyek ini. Uraian tambahan berikut menjelaskan aspek yang perlu diperiksa berdasarkan jenis layanan, bukan klaim bahwa setiap masalah tersebut benar-benar terjadi pada proyek.'
    : 'A project-specific challenge has not been recorded in the public project data. The additional explanation below identifies aspects to assess for this service type; it is not a claim that every issue occurred in this engagement.') + ' ' + additionalContext;
};

const expandSolutionNarrative = (
  item: ProjectItem,
  solution: string,
  language: string,
): string => {
  const id = language === 'id';
  const components = splitSolutionComponents(solution);
  const componentList = components.length
    ? readableList(components, language)
    : (id ? 'komponen solusi yang tercatat' : 'the recorded solution components');
  const framing: Record<ProjectItem['service'], { en: string; id: string }> = {
    'UI/UX Design': {
      en: 'The intent is to connect the key task flow, interface states, and reusable patterns so the experience is understandable for users and specific enough for implementation. The listed elements should be reviewed as one journey, including what users see before and after the main action.',
      id: 'Tujuannya adalah menghubungkan alur tugas utama, status antarmuka, dan pola yang dapat digunakan ulang agar pengalaman mudah dipahami dan cukup jelas untuk diimplementasikan. Elemen yang tercatat perlu ditinjau sebagai satu alur, termasuk kondisi sebelum dan sesudah tindakan utama.'
    },
    'Video Production': {
      en: 'These elements form a production chain: creative direction establishes what the film should communicate, capture choices translate that direction into usable footage, and post-production brings image, sound, and pacing together. Final versions then need to fit the delivery formats and intended viewing contexts.',
      id: 'Elemen-elemen tersebut membentuk rangkaian produksi: arah kreatif menetapkan pesan film, pilihan pengambilan gambar menerjemahkannya menjadi footage, lalu pascaproduksi menyatukan gambar, suara, dan tempo. Versi final kemudian harus sesuai dengan format penyerahan dan konteks tayang.'
    },
    '2D Animation': {
      en: 'The listed elements need to work as one explanatory sequence. The script or storyboard sets the order of ideas, the visual language makes those ideas concrete, animation controls emphasis and timing, and finishing keeps the final message legible in the target format.',
      id: 'Elemen yang tercatat perlu bekerja sebagai satu rangkaian penjelasan. Naskah atau storyboard menyusun urutan ide, bahasa visual membuat ide lebih konkret, animasi mengatur penekanan dan timing, lalu finishing menjaga pesan tetap terbaca pada format tujuan.'
    },
    'Branding & Identity': {
      en: 'The solution needs to connect the core identity with clear usage rules and real applications. This allows the brand to remain recognisable beyond the hero asset and gives teams a common reference for future materials.',
      id: 'Solusi perlu menghubungkan identitas utama dengan aturan penggunaan dan penerapan nyata. Hal ini membantu brand tetap dikenali di luar aset utama dan memberi tim acuan yang sama untuk materi berikutnya.'
    },
    'Motion & Graphic Design': {
      en: 'The approach should align message hierarchy, motion or graphic treatment, and adaptations to each placement. A master composition can establish the visual logic, while each output must preserve the most important information at its actual viewing size and duration.',
      id: 'Pendekatan perlu menyelaraskan hierarki pesan, pengolahan motion atau grafis, dan adaptasi untuk tiap penempatan. Komposisi utama menetapkan logika visual, sementara setiap output harus menjaga informasi terpenting pada ukuran dan durasi tayang sebenarnya.'
    },
    'Creative Design': {
      en: 'The solution links editorial structure and visual treatment: content order establishes the argument, typography and layout make it scannable, and charts or supporting imagery clarify the evidence where included. The final output should be easy to navigate as well as visually consistent.',
      id: 'Solusi menghubungkan struktur editorial dan pengolahan visual: urutan konten membangun pembahasan, tipografi dan tata letak membuatnya mudah dipindai, sedangkan grafik atau gambar pendukung memperjelas bukti bila tersedia. Output akhir perlu mudah dinavigasi sekaligus konsisten secara visual.'
    },
    '3D Visualization': {
      en: 'The approach ties modelling, materials, lighting, camera direction, and final rendering to the information the audience needs to understand. This keeps technical detail in service of a clear view of the product or space and the intended presentation format.',
      id: 'Pendekatan menghubungkan modeling, material, pencahayaan, arah kamera, dan rendering akhir dengan informasi yang perlu dipahami audiens. Dengan begitu, detail teknis mendukung pemahaman produk atau ruang serta format presentasi yang dituju.'
    },
    'Company Profile Website': {
      en: 'The solution needs to align information architecture, page content, proof of capability, responsive behaviour, and inquiry routes. These parts should help a visitor move from understanding the organisation to finding a relevant service and taking the next step.',
      id: 'Solusi perlu menyelaraskan arsitektur informasi, konten halaman, bukti kemampuan, perilaku responsif, dan jalur inquiry. Semua bagian harus membantu pengunjung beralih dari memahami perusahaan menuju layanan yang relevan dan tindakan berikutnya.'
    },
    'E-Commerce Website': {
      en: 'The solution connects discovery, product information, checkout, payment, and order status instead of treating them as separate screens. The exact implementation should preserve data and status consistency at each hand-off and make recovery paths understandable when a step cannot be completed.',
      id: 'Solusi menghubungkan penemuan produk, informasi produk, checkout, pembayaran, dan status pesanan, bukan memperlakukannya sebagai layar terpisah. Implementasi perlu menjaga konsistensi data dan status pada tiap perpindahan serta menjelaskan langkah pemulihan ketika sebuah tahap gagal.'
    },
    'Web Application': {
      en: 'The solution ties the interface and technical workflow together: the actions shown to each role must match the underlying rules, while validation, status, integrations, and exception paths should be clear enough to test and operate.',
      id: 'Solusi menyatukan antarmuka dan alur teknis: tindakan yang terlihat untuk setiap peran harus sesuai dengan aturan sistem, sementara validasi, status, integrasi, dan kondisi pengecualian harus cukup jelas untuk diuji dan dijalankan.'
    },
    'ERP / CRM System': {
      en: 'The modules should share a consistent model of records, permissions, approvals, ownership, and reporting. This is what connects individual functions into an operational system instead of leaving teams to reconcile disconnected tools or statuses.',
      id: 'Modul perlu memakai model data, hak akses, approval, kepemilikan, dan pelaporan yang konsisten. Inilah yang menghubungkan fungsi satu per satu menjadi sistem operasional, bukan membiarkan tim menyelaraskan alat atau status yang terpisah.'
    },
    'IT Support & Infrastructure': {
      en: 'The solution needs to join configuration changes with monitoring, security boundaries, rollout controls, and recovery procedures. That makes the delivery reviewable as an operational capability rather than only a technical change.',
      id: 'Solusi perlu menghubungkan perubahan konfigurasi dengan monitoring, batas keamanan, kontrol rollout, dan prosedur pemulihan. Dengan begitu, hasilnya dapat ditinjau sebagai kemampuan operasional, bukan hanya perubahan teknis.'
    }
  };
  const expanded = framing[item.service][id ? 'id' : 'en'];
  const actualSolution = solution || (id ? 'Solusi spesifik belum dicatat pada data publik proyek ini.' : 'A project-specific solution has not been recorded in the public project data.');
  return actualSolution + ' ' + (id ? 'Komponen solusi yang tercatat meliputi ' : 'The recorded solution components include ') + componentList + '. ' + expanded;
};

const describeImpactMetric = (
  metric: { label: string; value: string },
  item: ProjectItem,
  language: string,
): CaseStudyNarrativeLine => {
  const label = metric.label.toLocaleLowerCase();
  const id = language === 'id';
  let body: string;
  if (/view|reach|impression|visitor|visit|watch time|download|audience|outlet|concurrent|volume/.test(label)) {
    body = id
      ? 'Indikator ini menggambarkan jangkauan atau skala aktivitas yang tercatat. Angka tersebut membantu menilai seberapa luas output digunakan atau dilihat, tetapi tidak otomatis membuktikan kualitas perhatian, pemahaman, atau konversi.'
      : 'This is a recorded reach or activity-scale indicator. It helps describe how widely an output was seen or used, but does not by itself prove attention quality, comprehension, or conversion.';
  } else if (/conversion|pre.order|sales|inquir|lead|booking|revenue|funding|sold|export|orders|transaction|pipeline|aov|roas|roi/.test(label)) {
    body = id
      ? 'Indikator ini berkaitan dengan respons komersial, seperti permintaan, pemesanan, atau transaksi. Untuk mengaitkannya secara akurat dengan pekerjaan ini, perlu diketahui baseline, periode kampanye, sumber analytics, dan metode atribusi.'
      : 'This is a commercial-response indicator, such as demand, bookings, or transactions. Attributing it accurately to this work requires the baseline, campaign period, analytics source, and attribution method.';
  } else if (/recall|rating|satisfaction|retention|share|subscriber|trust|engagement|completion/.test(label)) {
    body = id
      ? 'Indikator ini berkaitan dengan respons audiens atau keberlanjutan penggunaan. Definisi pengukuran, ukuran sampel, sumber feedback, dan periode evaluasi diperlukan untuk menilai seberapa kuat angka ini mendukung kesimpulan.'
      : 'This indicator relates to audience response or continued use. Its measurement definition, sample size, feedback source, and evaluation period are needed to determine how strongly it supports a conclusion.';
  } else if (/latency|speed|time|error|uptime|availability|fps|accuracy|recovery|deployment|response|downtime|loss|reliability|execution/.test(label)) {
    body = id
      ? 'Indikator ini berkaitan dengan performa atau operasi. Interpretasi yang dapat dipercaya memerlukan definisi pengujian, kondisi beban, baseline, dan periode pengamatan agar angka tidak dibaca di luar konteksnya.'
      : 'This is an operational or performance indicator. A reliable interpretation needs the test definition, workload conditions, baseline, and observation period so the value is not read out of context.';
  } else {
    body = id
      ? 'Indikator ini merupakan salah satu sinyal hasil yang dicatat pada data portofolio. Maknanya perlu dikaitkan dengan definisi pengukuran, konteks proyek, sumber data, dan periode evaluasi.'
      : 'This is one outcome signal recorded in the portfolio data. Its meaning should be linked to the measurement definition, project context, data source, and evaluation period.';
  }
  const serviceContext = {
    en: `For this ${item.service.toLowerCase()} engagement, the figure is most useful when read alongside the project challenge and the outputs delivered; it should not be treated as proof of causation on its own.`,
    id: `Untuk proyek ${item.service.toLowerCase()} ini, angka tersebut paling berguna jika dibaca bersama tantangan awal dan hasil kerja yang diserahkan; angka ini sendiri belum membuktikan hubungan sebab-akibat.`
  };
  return {
    title: `${metric.value} · ${metric.label}`,
    body: body + ' ' + serviceContext[id ? 'id' : 'en']
  };
};

export function buildCaseStudyNarrative(item: ProjectItem, language: string): CaseStudyNarrative {
  const lang = language === 'id' ? 'id' : 'en';
  const service = typeof item?.service === 'string' && Object.prototype.hasOwnProperty.call(servicePlaybooks, item.service)
    ? item.service
    : 'Web Application';
  const safeItem: ProjectItem = {
    ...item,
    service,
    deliverables: cleanValues(item?.deliverables),
    technologies: cleanValues(item?.technologies),
    impact: Array.isArray(item?.impact)
      ? item.impact.filter((entry) => Boolean(entry && String(entry.label || '').trim() && String(entry.value || '').trim()))
      : [],
  };
  const playbook = servicePlaybooks[service][lang];
  const description = localText(safeItem, 'desc', lang);
  const challenge = localText(safeItem, 'challenge', lang);
  const solution = localText(safeItem, 'solution', lang);
  const rawExecution = localText(safeItem, 'execution', lang);
  const rawOutcome = localText(safeItem, 'outcome', lang);
  const execution = isRedundantNarrative(rawExecution, [description, challenge, solution]) ? '' : rawExecution;
  const outcome = isRedundantNarrative(rawOutcome, [description, challenge, solution]) ? '' : rawOutcome;
  const deliverables = safeItem.deliverables;
  const technologies = safeItem.technologies;
  const metrics = safeItem.impact;
  const contextDetails: CaseStudyNarrativeLine[] = [
    {
      title: lang === 'id' ? 'Kebutuhan yang tercatat' : 'The documented need',
      body: challenge || (lang === 'id' ? 'Tantangan spesifik belum diisi pada data proyek.' : 'A project-specific challenge has not been added to the project record.')
    },
    {
      title: lang === 'id' ? 'Ruang lingkup yang terlihat' : 'The visible scope',
      body: (deliverables.length
        ? (lang === 'id' ? 'Keluaran yang dicatat mencakup ' : 'The recorded outputs include ') + readableList(deliverables, lang) + '.'
        : (lang === 'id' ? 'Daftar keluaran proyek belum diisi.' : 'The project record does not include a deliverables list.')) +
        (technologies.length
          ? (lang === 'id' ? ' Perangkat yang disebut dalam catatan proyek: ' : ' Tools recorded for this project: ') + readableList(technologies, lang) + '.'
          : '')
    }
  ];

  const diagnosis = playbook.diagnosis.map((line) => ({
    title: line.title,
    body: line.body
  }));

  const specificSolutionParts = splitSolutionComponents(solution);
  const specificDecisions = specificSolutionParts.map((component) => ({
    title: solutionComponentHeading(component),
    body: explainSolutionComponent(component, lang)
  }));
  const decisions = specificDecisions.length >= 2
    ? specificDecisions
    : [...specificDecisions, ...playbook.decisions].slice(0, 3);

  const process = buildProjectExecution(safeItem, challenge, deliverables, technologies, lang, playbook);

  const describedDeliverables = deliverables.map((title) => ({ title, body: explainDeliverable(title, lang) }));
  const describedTechnologies = technologies.map((title) => ({ title, body: explainTechnology(title, lang) }));

  const serviceImpactContext: Record<ProjectItem['service'], { en: string; id: string }> = {
    'UI/UX Design': { en: 'For product design, the most useful impact signals usually concern task completion, reduced user uncertainty, consistency across journeys, and the amount of implementation rework avoided.', id: 'Dalam desain produk, indikator dampak yang paling relevan biasanya berkaitan dengan keberhasilan menyelesaikan tugas, berkurangnya kebingungan pengguna, konsistensi alur, dan berkurangnya pengerjaan ulang saat implementasi.' },
    'Video Production': { en: 'For video production, the practical impact is assessed through message clarity, audience response, readiness across placements, and whether the delivered versions serve their intended campaign roles.', id: 'Dalam produksi video, dampak praktis dinilai dari kejelasan pesan, respons audiens, kesiapan untuk berbagai penempatan, dan kesesuaian versi yang diserahkan dengan kebutuhan kampanye.' },
    '2D Animation': { en: 'For animation, useful impact signals include comprehension of the subject, consistency across episodes or product states, and how well assets can be reused in their intended channels.', id: 'Dalam animasi, indikator yang relevan mencakup pemahaman terhadap materi, konsistensi antar-episode atau status produk, serta kemampuan aset untuk digunakan ulang di kanal yang dituju.' },
    'Branding & Identity': { en: 'For identity work, impact is best assessed through consistency across touchpoints, correct use by teams and suppliers, audience recognition, and the brand’s ability to extend into new applications.', id: 'Dalam pekerjaan identitas, dampak paling tepat dinilai melalui konsistensi antar-media, penggunaan yang benar oleh tim dan vendor, pengenalan audiens, serta kemampuan brand diterapkan ke media baru.' },
    'Motion & Graphic Design': { en: 'For campaign and motion work, the relevant signals are message legibility in the actual viewing environment, consistency across formats, playback reliability, and audience response where measurement is available.', id: 'Dalam desain kampanye dan motion, indikator yang relevan adalah keterbacaan pesan pada lingkungan tayang sebenarnya, konsistensi antarformat, keandalan playback, dan respons audiens jika datanya tersedia.' },
    'Creative Design': { en: 'For editorial and communication design, useful impact signals include reader comprehension, ease of locating important information, consistency across publication formats, and usefulness in the decision context.', id: 'Dalam desain editorial dan komunikasi, indikator yang relevan mencakup pemahaman pembaca, kemudahan menemukan informasi penting, konsistensi antarformat publikasi, dan manfaatnya dalam konteks pengambilan keputusan.' },
    '3D Visualization': { en: 'For 3D work, impact can be evaluated through clarity of spatial or product understanding, usefulness in review and presentation, and technical suitability for the final viewing format.', id: 'Dalam pekerjaan 3D, dampak dapat dievaluasi dari kejelasan pemahaman ruang atau produk, kegunaan saat peninjauan dan presentasi, serta kecocokan teknis dengan format visual akhir.' },
    'Company Profile Website': { en: 'For corporate websites, the relevant signals include how easily visitors find capabilities, move to the right page, understand the organisation, and reach a useful contact or inquiry path.', id: 'Untuk website perusahaan, indikator yang relevan mencakup kemudahan pengunjung menemukan kemampuan, berpindah ke halaman yang tepat, memahami organisasi, dan mencapai jalur kontak atau inquiry yang sesuai.' },
    'E-Commerce Website': { en: 'For e-commerce, meaningful impact is tied to product discovery, purchase completion, payment and fulfilment reliability, repeat ordering, and the effort required to manage products and campaigns.', id: 'Untuk e-commerce, dampak berkaitan dengan pencarian produk, penyelesaian pembelian, keandalan pembayaran dan pemenuhan pesanan, pembelian berulang, serta usaha untuk mengelola produk dan kampanye.' },
    'Web Application': { en: 'For applications, the relevant impact signals include workflow completion, data accuracy, operator visibility, turnaround time, and the reliability of integrated services.', id: 'Untuk aplikasi, indikator yang relevan mencakup penyelesaian alur kerja, akurasi data, visibilitas operator, waktu penyelesaian, dan keandalan layanan yang terintegrasi.' },
    'ERP / CRM System': { en: 'For ERP and CRM, useful impact signals include fewer duplicate entries, clearer ownership and status, better reconciliation, and more reliable execution across teams or locations.', id: 'Untuk ERP dan CRM, indikator yang relevan mencakup berkurangnya input ganda, kejelasan pemilik dan status pekerjaan, rekonsiliasi yang lebih baik, serta konsistensi proses antartim atau lokasi.' },
    'IT Support & Infrastructure': { en: 'For infrastructure, outcomes should be assessed through availability, latency, recovery behaviour, release reliability, security posture, and the support coverage actually delivered.', id: 'Untuk infrastruktur, hasil perlu dinilai melalui availability, latency, perilaku pemulihan, keandalan rilis, kondisi keamanan, dan cakupan dukungan yang benar-benar diberikan.' }
  };
  const metricInterpretation = explainMetricSignals(metrics, lang);
  const impact = outcome || (metrics.length
    ? (lang === 'id'
      ? metricInterpretation + ' ' + serviceImpactContext[safeItem.service].id + ' Untuk memastikan seberapa besar perubahan terkait dengan pekerjaan ini, angka tersebut tetap perlu dibaca bersama nilai awal, periode pengukuran, sumber data, dan metode atribusi.'
      : metricInterpretation + ' ' + serviceImpactContext[safeItem.service].en + ' To establish how much change is attributable to this work, the figures still need a baseline, measurement period, data source, and attribution method.')
    : (lang === 'id'
      ? 'Catatan publik belum memuat hasil terukur. Karena itu, dampak di bawah ini dijelaskan sebagai manfaat yang dituju oleh ruang lingkup dan bukan sebagai klaim peningkatan yang sudah terverifikasi.'
      : 'The public record does not yet include measured results. Accordingly, the impact below is described as the value the scope is designed to support, not as a verified improvement claim.'));

  const evidenceNote = metrics.length
    ? (lang === 'id'
      ? 'Angka yang ditampilkan mengikuti catatan portofolio yang tersedia. Data publik ini belum mencantumkan nilai awal, periode pengukuran, sumber analitik, atau metode penghitungan; konfirmasikan detail tersebut sebelum angka dipakai sebagai bukti performa atau klaim komersial.'
      : 'Displayed figures follow the available portfolio record. The public data does not specify baseline values, measurement windows, analytics sources, or calculation methods; confirm those details before using the numbers as performance evidence or a commercial claim.')
    : (lang === 'id'
      ? 'Data publik belum menyediakan metrik kuantitatif yang dapat dibandingkan. Dampak perlu dilengkapi dengan baseline, periode pengukuran, sumber data, dan persetujuan publikasi sebelum dinyatakan sebagai hasil terukur.'
      : 'The public record does not provide comparable quantitative metrics. Any measured outcome should be supported by a baseline, measurement window, data source, and publication approval before being stated as a verified result.');

  const relevance = playbook.relevance;
  const context = (description ? description + ' ' : '') + playbook.context;
  const expandedChallenge = expandChallengeNarrative(safeItem, challenge, lang);
  const expandedSolution = expandSolutionNarrative(safeItem, solution, lang);
  const impactDetails = metrics.map((metric) => describeImpactMetric(metric, safeItem, lang));
  const impactFallback = lang === 'id'
    ? 'Dampak yang dapat dibahas secara bertanggung jawab adalah bagaimana keluaran ini dirancang untuk menjawab masalah awal: ' + (challenge || 'tantangan yang dicatat pada brief') + '. Nilai bisnis yang benar-benar tercapai perlu dibedakan dari manfaat yang diharapkan dan didukung dengan data evaluasi.'
    : 'The responsible impact narrative is how these outputs are designed to address the original problem: ' + (challenge || 'the challenge recorded in the brief') + '. Achieved business value should be distinguished from intended benefits and supported by evaluation data.';

  return {
    context,
    contextDetails,
    challenge: expandedChallenge,
    diagnosis,
    objectives: playbook.objective,
    solution: expandedSolution,
    solutionLogic: decisions,
    process: execution ? [{ title: lang === 'id' ? 'Catatan eksekusi proyek' : 'Recorded project execution', body: execution }, ...process] : process,
    deliverables: describedDeliverables,
    technologies: describedTechnologies,
    impact: outcome ? outcome : metrics.length ? impact : impactFallback,
    impactDetails,
    evidenceNote,
    relevance
  };
}
