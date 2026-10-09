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
  if (/design system|component library|design token|brandbook|brand manual|brand guideline|style guide|manual/.test(v)) return id
    ? 'Menjadi acuan bersama untuk menjaga aturan visual, komponen, dan penerapan tetap konsisten ketika aset dikembangkan atau diperbarui.'
    : 'Acts as a shared reference for visual rules, components, and consistent application as assets are extended or updated.';
  if (/user flow|journey map|flow map|siteplan|workflow|process map/.test(v)) return id
    ? 'Memetakan langkah, keputusan, dan hubungan antarbagian agar tim dapat meninjau alurnya sebelum atau saat implementasi.'
    : 'Maps steps, decisions, and relationships so the team can review the flow before or during implementation.';
  if (/prototype|interactive spec|interaction/.test(v)) return id
    ? 'Membuat perilaku dan urutan interaksi lebih mudah ditinjau daripada hanya mengandalkan gambar statis atau penjelasan lisan.'
    : 'Makes behaviour and interaction sequence easier to review than relying on static screens or verbal explanation alone.';
  if (/tvc|film|video|featurette|cutdown|cut-down|reel|broadcast cut|cinema|dcp|social ads|social video/.test(v)) return id
    ? 'Menjadi versi audiovisual untuk menyampaikan cerita dan pesan kampanye pada konteks tayang yang dituju; durasi serta framing mengikuti kebutuhan format.'
    : 'Provides the audiovisual story for the intended campaign context, with duration and framing suited to the delivery format.';
  if (/storyboard|script|episode/.test(v)) return id
    ? 'Menyusun urutan cerita atau penjelasan agar pesan, adegan, dan transisi memiliki tujuan yang jelas.'
    : 'Defines the sequence of the story or explanation so the message, scenes, and transitions each have a clear purpose.';
  if (/animation|lottie|motion|stinger|lower third|scoreboard|overlay/.test(v)) return id
    ? 'Menerjemahkan identitas atau informasi ke dalam gerak yang terarah dan dapat dipakai di kanal yang tercantum pada ruang lingkup.'
    : 'Translates identity or information into purposeful motion for the channel specified in the scope.';
  if (/logo|monogram|identity|emblem|typography|typeface/.test(v)) return id
    ? 'Membangun elemen identitas yang membantu brand mudah dikenali dan tetap konsisten dalam berbagai aplikasi.'
    : 'Builds identity elements that help the brand stay recognisable and consistent across applications.';
  if (/packaging|label|cup|apparel|collateral|stationery|signage|environmental graphic|poster|print/.test(v)) return id
    ? 'Menguji sistem visual pada media nyata, termasuk batas ukuran, bahan, keterbacaan, dan kebutuhan produksi yang relevan.'
    : 'Applies the visual system to a real medium, accounting for size, material, readability, and relevant production constraints.';
  if (/lookbook|report|whitepaper|pitch deck|slide|presentation|flipbook|pdf|infographic|executive summary/.test(v)) return id
    ? 'Menyusun informasi dalam hierarki editorial yang membantu pembaca memindai pesan utama, memahami bukti, lalu menemukan detail pendukung.'
    : 'Organises information in an editorial hierarchy that helps readers scan the main message, understand the evidence, and find supporting detail.';
  if (/3d|render|webgl|ar |augmented reality|virtual experience|viewer|model/.test(v)) return id
    ? 'Membantu audiens memahami bentuk, ruang, material, atau perilaku objek melalui visualisasi yang sesuai dengan format penyerahan.'
    : 'Helps the audience understand form, space, materials, or object behaviour through visualisation suited to the delivery format.';
  if (/website|storefront|web application|portal|dashboard|admin panel|saas|gateway|mobile app|app\b|interface|ui\b/.test(v)) return id
    ? 'Menjadi bagian dari pengalaman digital yang menghubungkan informasi, tindakan pengguna, dan kebutuhan operasional yang dijelaskan dalam proyek.'
    : 'Forms part of the digital experience connecting information, user actions, and the operational needs described in the project.';
  if (/api|integration|bridge|websocket|sync|synchronization|reconciliation|payment|qris|billing|checkout|courier/.test(v)) return id
    ? 'Menghubungkan fungsi terkait agar pertukaran data atau status tidak bergantung sepenuhnya pada perpindahan manual antaralat.'
    : 'Connects related functions so data or status exchange does not depend entirely on manual movement between tools.';
  if (/kubernetes|cloud|infrastructure|server|network|terraform|gitops|cicd|ci\/cd|backup|disaster recovery|sla|monitoring|security|routing|autoscaling/.test(v)) return id
    ? 'Mendukung keandalan, pengelolaan, pengamatan, atau pemulihan layanan sesuai kebutuhan infrastruktur yang tercatat.'
    : 'Supports service reliability, operations, observability, or recovery in line with the recorded infrastructure requirements.';
  if (/data|chart|heatmap|visuali[sz]ation|analytics|metric|financial/.test(v)) return id
    ? 'Membuat informasi penting lebih mudah dibandingkan dan digunakan untuk memahami kondisi atau mengambil keputusan.'
    : 'Makes important information easier to compare and use when understanding a situation or making a decision.';
  if (/source file|source code|asset library|vector asset|template|snippet/.test(v)) return id
    ? 'Memberi tim file dasar yang dibutuhkan untuk memelihara, mengadaptasi, atau mengembangkan hasil kerja setelah penyerahan.'
    : 'Gives the team source material to maintain, adapt, or extend the work after handoff.';
  return id
    ? 'Merupakan keluaran konkret dari ruang lingkup proyek dan menjadi referensi untuk penggunaan, publikasi, implementasi, atau pengembangan berikutnya.'
    : 'Is a tangible output from the project scope and serves as a reference for subsequent use, publication, implementation, or development.';
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

export function buildCaseStudyNarrative(item: ProjectItem, language: string): CaseStudyNarrative {
  const lang = language === 'id' ? 'id' : 'en';
  const playbook = servicePlaybooks[item.service]?.[lang] || servicePlaybooks['Web Application'][lang];
  const description = localText(item, 'desc', lang);
  const challenge = localText(item, 'challenge', lang);
  const solution = localText(item, 'solution', lang);
  const execution = localText(item, 'execution', lang);
  const outcome = localText(item, 'outcome', lang);
  const deliverables = cleanValues(item.deliverables);
  const technologies = cleanValues(item.technologies);
  const metrics = Array.isArray(item.impact)
    ? item.impact.filter((entry) => entry && String(entry.label || '').trim() && String(entry.value || '').trim())
    : [];
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

  const decisions = playbook.decisions.map((line, index) => ({
    title: line.title,
    body: index === 0 && solution
      ? (lang === 'id' ? 'Solusi yang tercatat adalah ' : 'The recorded solution is ') + solution + ' ' + line.body
      : line.body
  }));

  const process = playbook.process.map((line, index) => ({
    title: line.title,
    body: index === 0 && challenge
      ? (lang === 'id' ? 'Titik awal tahapan ini adalah tantangan proyek: ' : 'This stage starts from the project challenge: ') + challenge + ' ' + line.body
      : index === playbook.process.length - 1 && deliverables.length
        ? line.body + (lang === 'id' ? ' Hasil akhir yang dicatat pada proyek ini mencakup ' : ' The outputs recorded for this project include ') + readableList(deliverables, lang) + '.'
        : line.body
  }));

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
  const impact = outcome || (metrics.length
    ? (lang === 'id'
      ? 'Data proyek mencantumkan indikator hasil pada kartu di bawah. ' + serviceImpactContext[item.service].id + ' Angka tersebut perlu dibaca bersama nilai awal, periode pengukuran, sumber data, dan metode atribusi agar dampaknya dapat ditafsirkan secara tepat.'
      : 'The project record lists outcome indicators in the cards below. ' + serviceImpactContext[item.service].en + ' Those figures need to be read alongside the baseline, measurement period, data source, and attribution method to interpret the impact accurately.')
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
  const solutionIntro = solution
    ? solution
    : (lang === 'id' ? 'Solusi spesifik belum diisi pada catatan publik.' : 'A project-specific solution has not been added to the public record yet.');

  const context = (description ? description + ' ' : '') + playbook.context;
  const impactFallback = lang === 'id'
    ? 'Dampak yang dapat dibahas secara bertanggung jawab adalah bagaimana keluaran ini dirancang untuk menjawab masalah awal: ' + (challenge || 'tantangan yang dicatat pada brief') + '. Nilai bisnis yang benar-benar tercapai perlu dibedakan dari manfaat yang diharapkan dan didukung dengan data evaluasi.'
    : 'The responsible impact narrative is how these outputs are designed to address the original problem: ' + (challenge || 'the challenge recorded in the brief') + '. Achieved business value should be distinguished from intended benefits and supported by evaluation data.';

  return {
    context,
    contextDetails,
    challenge: challenge || (lang === 'id' ? 'Tantangan spesifik belum diisi pada data proyek.' : 'A project-specific challenge has not been added to the project record.'),
    diagnosis,
    objectives: playbook.objective,
    solution: solutionIntro,
    solutionLogic: decisions,
    process: execution ? [{ title: lang === 'id' ? 'Catatan eksekusi proyek' : 'Recorded project execution', body: execution }, ...process] : process,
    deliverables: describedDeliverables,
    technologies: describedTechnologies,
    impact: outcome ? outcome : metrics.length ? impact : impactFallback,
    evidenceNote,
    relevance
  };
}
