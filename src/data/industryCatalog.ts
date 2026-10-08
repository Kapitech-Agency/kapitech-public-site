export type IndustryCatalogItem = {
  slug: string;
  label: string;
  shortLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  keywords: string[];
  needs: string[];
  capabilities: string[];
  solutionTypes: string[];
  principles: Array<{
    title: string;
    description: string;
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
};

export const industryCatalog: IndustryCatalogItem[] = [
  {
    slug: 'fintech',
    label: 'FinTech & Financial Services',
    shortLabel: 'FinTech',
    eyebrow: 'FinTech & Financial Services',
    title: 'Digital products for finance that make complexity easier to understand.',
    description: 'Kapitech helps financial teams turn dense information, critical workflows, and high-trust interactions into clearer digital experiences across web, product, and business systems.',
    keywords: ['fintech', 'finansial', 'payment', 'bank', 'capital', 'wealth', 'venture', 'sekuritas', 'pasar modal', 'financial advisory'],
    needs: ['Banking & financial platforms', 'Payment and transaction experiences', 'Trading, wealth, and reporting interfaces', 'Enterprise financial workflows'],
    capabilities: ['Product UX/UI', 'Web applications', 'Corporate & product websites', 'ERP / CRM & internal systems', 'Brand and visual systems'],
    solutionTypes: ['Banking and finance portals', 'Payment and merchant dashboards', 'Trading and investment interfaces', 'Financial reporting and operational systems'],
    principles: [
      { title: 'Trust is part of the interface', description: 'Financial products need clear hierarchy, predictable actions, visible system states, and language that reduces uncertainty at important decision points.' },
      { title: 'Complex data needs usable structure', description: 'Dashboards and financial workflows are organised around the tasks users need to complete, not simply around the amount of information available.' },
      { title: 'Design must connect to the system', description: 'When a product touches permissions, integrations, workflows, or operational teams, we carry the context through the product and engineering layer.' },
      { title: 'Scalability starts early', description: 'Reusable components, clear interaction patterns, and practical content structures make it easier to extend financial products without redesigning everything.' },
    ],
    faq: [
      { question: 'Can Kapitech work on a financial product that already exists?', answer: 'Yes. We can start from an existing website, dashboard, application, or internal system and work from an audit, redesign, product improvement, or targeted feature scope.' },
      { question: 'What kind of financial products can Kapitech support?', answer: 'Our relevant work spans financial interfaces, dashboards, payment-related experiences, corporate platforms, and enterprise systems. The exact scope is defined around the product and workflow rather than a fixed industry package.' },
      { question: 'Can design and development be handled together?', answer: 'Yes. Depending on the engagement, Kapitech can cover product design, website development, custom web applications, integrations, and technical delivery as one coordinated scope.' },
      { question: 'How do you approach sensitive or complex financial workflows?', answer: 'We start by mapping the users, roles, data density, business rules, and critical workflow states so the interface is designed around real operational needs.' },
    ],
  },
  {
    slug: 'healthcare',
    label: 'Healthcare & HealthTech',
    shortLabel: 'Healthcare',
    eyebrow: 'Healthcare & HealthTech',
    title: 'Clearer digital healthcare experiences for patients, teams, and operators.',
    description: 'Kapitech brings product design, web development, and system thinking together for healthcare experiences where accessibility, trust, and workflow clarity matter.',
    keywords: ['healthcare', 'healthtech', 'rumah sakit', 'medtech', 'medis', 'farmasi', 'medical'],
    needs: ['Patient and public-facing experiences', 'Clinical and operational workflows', 'Healthcare portals and applications', 'Medical and information-heavy interfaces'],
    capabilities: ['UX/UI and product design', 'Web applications', 'Corporate and healthcare websites', 'Workflow systems', 'Technical infrastructure'],
    solutionTypes: ['Healthcare web platforms', 'Patient-facing digital experiences', 'Operational dashboards', 'Medical information workflows'],
    principles: [
      { title: 'Clarity matters at every step', description: 'Healthcare users often arrive with a specific task and limited attention, so information hierarchy and feedback need to be direct.' },
      { title: 'Different roles need different experiences', description: 'Patients, clinicians, administrators, and support teams do not use a system in the same way. We design around the workflow of each role.' },
      { title: 'Accessibility is not an afterthought', description: 'Readable layouts, clear states, predictable interactions, and responsive behaviour are part of the core experience.' },
      { title: 'Operational reality shapes the product', description: 'The best interface still needs to work with the teams, systems, and processes behind it. We consider those dependencies during delivery.' },
    ],
    faq: [
      { question: 'Can Kapitech support healthcare applications and internal systems?', answer: 'Yes. Our capability includes product UX/UI, websites, web applications, workflow systems, and technical delivery for complex organisations.' },
      { question: 'How do you handle complex healthcare workflows?', answer: 'We map roles, tasks, information density, system states, and operational dependencies first, then use those findings to shape the interface and delivery scope.' },
      { question: 'Can you redesign an existing healthcare product?', answer: 'Yes. A redesign can start with a practical UX/UI audit, prioritised improvements, and a staged redesign rather than replacing everything at once.' },
      { question: 'Do you only work on patient-facing products?', answer: 'No. We can work on public-facing experiences, internal tools, operational portals, and other digital products depending on the problem.' },
    ],
  },
  {
    slug: 'saas',
    label: 'AI, SaaS & Digital Products',
    shortLabel: 'AI & SaaS',
    eyebrow: 'AI, SaaS & Digital Products',
    title: 'Digital products that make complex workflows feel easier to use.',
    description: 'Kapitech helps product teams shape interfaces, websites, MVPs, and web applications around real user workflows instead of feature lists.',
    keywords: ['ai', 'saas', 'productivity', 'hrtech', 'agritech', 'edtech', 'creative saas', 'digital product'],
    needs: ['MVP and new product experiences', 'SaaS dashboards and platforms', 'AI product interfaces', 'Multi-role workflows and internal tools'],
    capabilities: ['Product UX/UI', 'MVP design and development', 'Web applications', 'Design systems', 'Web and conversion experiences'],
    solutionTypes: ['SaaS platforms', 'AI-assisted products', 'MVPs and product prototypes', 'Internal workflow applications'],
    principles: [
      { title: 'Start with the core workflow', description: 'Products become easier to use when the primary task is clear and the interface is organised around the outcome users need.' },
      { title: 'Complexity should be progressive', description: 'Advanced functionality does not need to appear all at once. We use hierarchy and progressive disclosure to keep interfaces understandable.' },
      { title: 'Design and engineering stay connected', description: 'A strong product concept needs a delivery path. We connect UX decisions with implementation constraints early.' },
      { title: 'Systems should support growth', description: 'Reusable patterns and deliberate product structure make new features easier to add without creating a fragmented experience.' },
    ],
    faq: [
      { question: 'Can Kapitech help from idea to MVP?', answer: 'Yes. Depending on the project, we can support discovery, product UX/UI, prototyping, frontend and backend-connected development, and production delivery.' },
      { question: 'Do you work on existing SaaS products?', answer: 'Yes. We can audit, redesign, extend, or improve an existing product, including selected workflows rather than requiring a full redesign.' },
      { question: 'Can Kapitech design AI interfaces?', answer: 'Yes. We can design AI-enabled workflows, dashboards, assistants, and product interfaces with emphasis on clarity, control, and understandable system feedback.' },
      { question: 'How do you keep a growing SaaS product consistent?', answer: 'We establish reusable components, interaction patterns, and design rules that can be maintained as the product expands.' },
    ],
  },
  {
    slug: 'commerce',
    label: 'Commerce & Consumer',
    shortLabel: 'Commerce',
    eyebrow: 'Commerce & Consumer',
    title: 'Digital commerce experiences that connect brand, discovery, and conversion.',
    description: 'Kapitech combines brand, UI/UX, content, website, and e-commerce capabilities for consumer businesses that need the experience and the commercial journey to work together.',
    keywords: ['e-commerce', 'ecommerce', 'retail', 'beauty', 'skincare', 'f&b', 'coffee', 'fashion', 'luxury goods', 'haute joaillerie'],
    needs: ['E-commerce and product discovery', 'Consumer websites', 'Brand and visual systems', 'Campaign and content experiences'],
    capabilities: ['Brand identity', 'UI/UX design', 'E-commerce development', 'Creative and motion', 'Website development'],
    solutionTypes: ['E-commerce storefronts', 'Consumer websites', 'Brand and campaign systems', 'Digital product experiences'],
    principles: [
      { title: 'Brand and product should feel connected', description: 'The visual language should strengthen the product experience rather than sit separately from it.' },
      { title: 'Reduce friction in the buying journey', description: 'Navigation, product discovery, information hierarchy, trust signals, and conversion paths need to work together.' },
      { title: 'Content is part of usability', description: 'Product information, imagery, campaign content, and interface hierarchy all contribute to whether users understand the offer.' },
      { title: 'Build for iteration', description: 'Consumer experiences change often, so the visual and technical system should make updates manageable.' },
    ],
    faq: [
      { question: 'Can Kapitech build an e-commerce website as well as design it?', answer: 'Yes. Kapitech can support UX/UI, storefront design, and e-commerce implementation depending on the project requirements.' },
      { question: 'Can you improve an existing online store?', answer: 'Yes. We can audit the current experience and focus on navigation, product discovery, conversion paths, visual consistency, or technical improvements.' },
      { question: 'Do you also handle brand work?', answer: 'Yes. Brand identity, visual direction, graphic design, motion, and digital experience can be combined when the project requires a connected system.' },
      { question: 'How do you balance premium visuals with usability?', answer: 'We treat visual direction, hierarchy, content, interaction, and responsive behaviour as one experience rather than optimising aesthetics alone.' },
    ],
  },
  {
    slug: 'industrial',
    label: 'Industrial & Infrastructure',
    shortLabel: 'Industrial',
    eyebrow: 'Industrial & Infrastructure',
    title: 'Digital systems for organisations where operations, reliability, and scale matter.',
    description: 'Kapitech works across corporate websites, enterprise workflows, ERP/CRM interfaces, cloud environments, and operational systems where digital work has to support real teams.',
    keywords: ['manufaktur', 'konstruksi', 'infrastruktur', 'energi', 'solar', 'otomasi', 'robotika', 'cloud infrastructure', 'devops', 'telekomunikasi', 'erp'],
    needs: ['Enterprise websites and portals', 'ERP and CRM workflows', 'Operational dashboards', 'Cloud and technical infrastructure'],
    capabilities: ['Web development', 'Web applications', 'ERP / CRM systems', 'UX/UI for enterprise products', 'IT support & infrastructure'],
    solutionTypes: ['Enterprise portals', 'Operational systems', 'ERP / CRM platforms', 'Cloud and infrastructure delivery'],
    principles: [
      { title: 'Design for the people who run the operation', description: 'Internal systems need to support real tasks, roles, permissions, and information needs rather than only looking polished.' },
      { title: 'Complexity needs hierarchy', description: 'Enterprise products can expose a lot of information without forcing users to process everything at the same time.' },
      { title: 'Technical delivery is part of the experience', description: 'Hosting, integrations, deployment, reliability, and maintainability matter when a product becomes part of daily operations.' },
      { title: 'Enterprise change needs structure', description: 'Clear components, documentation, and delivery boundaries make larger systems easier to evolve.' },
    ],
    faq: [
      { question: 'Can Kapitech work on internal enterprise systems?', answer: 'Yes. Our capabilities include web applications, ERP/CRM systems, operational dashboards, and infrastructure-related delivery.' },
      { question: 'Do you design enterprise interfaces as well?', answer: 'Yes. We can design enterprise UX/UI around workflows, roles, information density, and maintainable component structures.' },
      { question: 'Can you support infrastructure and deployment?', answer: 'Yes. Depending on the engagement, Kapitech can support technical infrastructure, deployment, monitoring, and operational concerns.' },
      { question: 'How do you approach complex legacy systems?', answer: 'We prefer staged improvement where possible: understand the current workflow, identify high-impact friction, and improve the system without disrupting important operations unnecessarily.' },
    ],
  },
  {
    slug: 'mobility',
    label: 'Mobility & Logistics',
    shortLabel: 'Mobility',
    eyebrow: 'Mobility & Logistics',
    title: 'Digital experiences built around movement, operations, and fast decisions.',
    description: 'Kapitech helps mobility and logistics teams improve the digital workflows behind fleets, transportation, logistics, shipping, and operational delivery.',
    keywords: ['logistics', 'logistik', 'transportasi', 'pelayaran', 'ekspedisi', 'otomotif', 'fleet', 'smart city'],
    needs: ['Fleet and driver experiences', 'Logistics portals', 'Operational applications', 'Shipment and workflow visibility'],
    capabilities: ['Product UX/UI', 'Web applications', 'Corporate and operational websites', 'Workflow systems', 'Infrastructure'],
    solutionTypes: ['Fleet applications', 'Logistics portals', 'Operational dashboards', 'Mobility digital experiences'],
    principles: [
      { title: 'Design for speed and focus', description: 'Operational users often need the right information quickly, so important actions and states should be obvious.' },
      { title: 'Support multiple roles', description: 'Drivers, operators, managers, partners, and customers may interact with different parts of the same system.' },
      { title: 'Make status visible', description: 'Tracking, workflow progress, exceptions, and next actions should be easy to understand.' },
      { title: 'Connect the front end to operations', description: 'The user experience needs to reflect what the underlying system can actually support.' },
    ],
    faq: [
      { question: 'Can Kapitech design logistics and fleet applications?', answer: 'Yes. Product UX/UI, web applications, operational portals, and workflow systems are part of our capabilities.' },
      { question: 'Can you work on both customer and internal experiences?', answer: 'Yes. We can cover public-facing websites or portals alongside operational interfaces when a project requires both.' },
      { question: 'Do you handle complex workflows?', answer: 'Yes. We map roles, states, handoffs, exceptions, and critical actions before shaping the interface and delivery scope.' },
      { question: 'Can technical infrastructure be included?', answer: 'Yes, when the engagement requires infrastructure, deployment, monitoring, or technical support alongside the product or website work.' },
    ],
  },
  {
    slug: 'hospitality',
    label: 'Hospitality, Property & Lifestyle',
    shortLabel: 'Hospitality',
    eyebrow: 'Hospitality, Property & Lifestyle',
    title: 'Digital experiences for brands where presentation, trust, and aspiration shape the decision.',
    description: 'Kapitech combines brand, content, website, UI/UX, 3D, and interactive experiences for hospitality, property, architecture, wellness, and lifestyle businesses.',
    keywords: ['hospitality', 'luxury wedding', 'wellness', 'real estate', 'properti', 'arsitektur', 'villa'],
    needs: ['Premium websites and digital presence', 'Property and architectural presentation', 'Brand identity', 'Immersive visual experiences'],
    capabilities: ['Brand identity', 'Website design and development', '3D visualisation', 'Creative design', 'Interactive experiences'],
    solutionTypes: ['Hospitality websites', 'Property digital showcases', 'Luxury brand systems', '3D and interactive experiences'],
    principles: [
      { title: 'Presentation shapes perception', description: 'For premium businesses, visual quality and information structure both contribute to confidence and perceived value.' },
      { title: 'Show the experience, not only the service', description: 'Imagery, motion, 3D, and content hierarchy can help users understand what makes a place, property, or brand distinctive.' },
      { title: 'Keep the journey simple', description: 'High-end presentation should still lead users clearly toward enquiry, booking, exploration, or another intended action.' },
      { title: 'Design across touchpoints', description: 'Brand identity, website, campaign assets, and digital experiences work better when they share one coherent system.' },
    ],
    faq: [
      { question: 'Can Kapitech create premium or luxury websites?', answer: 'Yes. We combine brand, visual design, UI/UX, content, motion, and development depending on the experience required.' },
      { question: 'Do you offer 3D and interactive experiences?', answer: 'Yes. 3D visualisation and interactive web experiences are part of our capabilities where they add useful value to the project.' },
      { question: 'Can you help with property and architecture presentation?', answer: 'Yes. Relevant capabilities include 3D visualisation, digital showcases, websites, and supporting visual content.' },
      { question: 'Can the website and brand be developed together?', answer: 'Yes. We can connect brand identity work with the digital experience so the website and other touchpoints feel consistent.' },
    ],
  },
  {
    slug: 'media',
    label: 'Media, Gaming & Culture',
    shortLabel: 'Media & Gaming',
    eyebrow: 'Media, Gaming & Culture',
    title: 'Creative digital experiences built to communicate, engage, and stand out.',
    description: 'Kapitech brings motion, creative design, interactive experiences, websites, and product thinking together for media, gaming, tourism, and culture-led brands.',
    keywords: ['gaming', 'live streaming', 'tvc', 'tourism', 'pariwisata', 'kebudayaan', 'advertising', 'motion'],
    needs: ['Campaign and motion systems', 'Interactive websites', 'Gaming and live content experiences', 'Culture and tourism storytelling'],
    capabilities: ['Motion & graphic design', 'Video production', 'Interactive websites', '3D visualisation', 'Creative design'],
    solutionTypes: ['Campaign experiences', 'Interactive websites', 'Gaming and live content systems', 'Motion-led brand experiences'],
    principles: [
      { title: 'Attention must still have direction', description: 'Strong creative should make the message easier to understand, not simply create more movement.' },
      { title: 'Create systems, not one-off assets', description: 'Reusable visual and motion patterns make campaigns and content easier to scale across channels.' },
      { title: 'Experience should match the audience', description: 'Gaming, tourism, and cultural audiences respond to different levels of interactivity, tone, and pacing.' },
      { title: 'Technology should serve the idea', description: 'Motion, 3D, or interactive technology is most useful when it supports the story, product, or communication goal.' },
    ],
    faq: [
      { question: 'Can Kapitech support campaigns as well as websites?', answer: 'Yes. We can combine creative design, motion, video, branding, and website or digital product delivery depending on the project.' },
      { question: 'Do you work on interactive and 3D experiences?', answer: 'Yes. We provide 3D visualisation and interactive web experiences where they add meaningful value.' },
      { question: 'Can gaming and live-content projects include technical work?', answer: 'Yes. Depending on scope, technical product or infrastructure work can be part of the engagement.' },
      { question: 'How do you keep highly visual work usable?', answer: 'We use hierarchy, interaction clarity, responsive behaviour, and purposeful motion so the experience remains understandable as well as visually strong.' },
    ],
  },
];

export const industryCatalogBySlug = (slug: string): IndustryCatalogItem | undefined =>
  industryCatalog.find((item) => item.slug === slug);

export const industryCatalogMatches = (item: IndustryCatalogItem, industry: string): boolean => {
  const value = industry.toLowerCase();
  return item.keywords.some((keyword) => value.includes(keyword));
};
