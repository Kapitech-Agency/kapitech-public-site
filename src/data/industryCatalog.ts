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
  solutionTypes: Array<{
    title: string;
    description: string;
  }>;
  deliveryFocus: string[];
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
    solutionTypes: [
      { title: "Banking and finance portals", description: "Clear journeys for high-trust account, advisory, onboarding, and servicing experiences." },
solutionTypes: [
      { title: "Payment and merchant dashboards", description: "Operational views that surface transaction state, exceptions, and actions without overwhelming the user." },
solutionTypes: [
      { title: "Trading and investment interfaces", description: "Information-dense products structured around monitoring, comparison, decision-making, and confidence." },
solutionTypes: [
      { title: "Financial reporting and operational systems", description: "Role-aware workflows for reporting, approvals, reconciliation, and internal visibility." },
      { title: "Payment and merchant dashboards", description: "Operational views that surface transaction state, exceptions, and actions without overwhelming the user." },
      { title: "Trading and investment interfaces", description: "Information-dense products structured around monitoring, comparison, decision-making, and confidence." },
      { title: "Financial reporting and operational systems", description: "Role-aware workflows for reporting, approvals, reconciliation, and internal visibility." },
    ],
    deliveryFocus: [
    "Map users, permissions, decision points, and high-risk workflow states before interface work.",
    "Reduce cognitive load in data-heavy screens while keeping critical numbers and states easy to verify.",
    "Validate product decisions against real operational constraints, integrations, and reporting needs.",
    "Package the design system and implementation scope so the product can evolve without fragmenting.",
  ],
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
    solutionTypes: [
      { title: "Healthcare web platforms", description: "Patient, provider, and organisation-facing experiences built around clarity, trust, and accessible information." },
solutionTypes: [
      { title: "Patient-facing digital experiences", description: "Straightforward journeys for discovery, education, enquiry, scheduling, and service access." },
solutionTypes: [
      { title: "Operational dashboards", description: "Role-specific views for teams that need to monitor work, status, capacity, and exceptions." },
solutionTypes: [
      { title: "Medical information workflows", description: "Structured interfaces that make dense information easier to scan, understand, and act on." },
      { title: "Patient-facing digital experiences", description: "Straightforward journeys for discovery, education, enquiry, scheduling, and service access." },
      { title: "Operational dashboards", description: "Role-specific views for teams that need to monitor work, status, capacity, and exceptions." },
      { title: "Medical information workflows", description: "Structured interfaces that make dense information easier to scan, understand, and act on." },
    ],
    deliveryFocus: [
    "Start with roles, tasks, accessibility needs, and the moments where users are most likely to hesitate.",
    "Separate patient-facing clarity from operational density so each audience gets the right level of information.",
    "Design feedback and system states explicitly so users know what happened, what is pending, and what comes next.",
    "Keep rollout practical by prioritising high-impact workflows before broader platform changes.",
  ],
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
    solutionTypes: [
      { title: "SaaS platforms", description: "Scalable product experiences that connect onboarding, core workflows, settings, and growth paths." },
solutionTypes: [
      { title: "AI-assisted products", description: "Interfaces that make AI output understandable, controllable, reviewable, and useful inside real workflows." },
solutionTypes: [
      { title: "MVPs and product prototypes", description: "Focused product experiences that make the core value proposition testable before a larger build." },
solutionTypes: [
      { title: "Internal workflow applications", description: "Role-aware tools that simplify repetitive work, approvals, handoffs, and operational visibility." },
      { title: "AI-assisted products", description: "Interfaces that make AI output understandable, controllable, reviewable, and useful inside real workflows." },
      { title: "MVPs and product prototypes", description: "Focused product experiences that make the core value proposition testable before a larger build." },
      { title: "Internal workflow applications", description: "Role-aware tools that simplify repetitive work, approvals, handoffs, and operational visibility." },
    ],
    deliveryFocus: [
    "Identify the smallest workflow that proves product value before expanding feature scope.",
    "Keep advanced capabilities discoverable without letting them dominate the primary task.",
    "Make loading, empty, error, success, and AI-generated states explicit so the product feels predictable.",
    "Create reusable interaction patterns early so new features do not produce a fragmented SaaS experience.",
  ],
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
    solutionTypes: [
      { title: "E-commerce storefronts", description: "Product discovery, comparison, trust, and checkout experiences designed to reduce friction to purchase." },
solutionTypes: [
      { title: "Consumer websites", description: "Brand-led experiences that help visitors understand the offer quickly and move toward enquiry or conversion." },
solutionTypes: [
      { title: "Brand and campaign systems", description: "Reusable visual structures that keep launches, promotions, content, and landing pages coherent." },
solutionTypes: [
      { title: "Digital product experiences", description: "Connected journeys for loyalty, membership, content, service, or post-purchase experiences." },
      { title: "Consumer websites", description: "Brand-led experiences that help visitors understand the offer quickly and move toward enquiry or conversion." },
      { title: "Brand and campaign systems", description: "Reusable visual structures that keep launches, promotions, content, and landing pages coherent." },
      { title: "Digital product experiences", description: "Connected journeys for loyalty, membership, content, service, or post-purchase experiences." },
    ],
    deliveryFocus: [
    "Understand where customers hesitate, compare, abandon, or need more proof before deciding.",
    "Make product information, imagery, price, trust signals, and calls to action work as one hierarchy.",
    "Design campaign components so marketing teams can reuse and update them without rebuilding the system.",
    "Protect the brand experience across mobile, desktop, commerce, and content touchpoints.",
  ],
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
    solutionTypes: [
      { title: "Enterprise portals", description: "Structured web experiences for organisations that need clear information, services, and stakeholder access." },
solutionTypes: [
      { title: "Operational systems", description: "Interfaces built around daily work, status visibility, permissions, and repeatable operational tasks." },
solutionTypes: [
      { title: "ERP / CRM platforms", description: "Role-aware systems that make complex records, workflows, approvals, and business data easier to manage." },
solutionTypes: [
      { title: "Cloud and infrastructure delivery", description: "Technical foundations that support deployment, reliability, monitoring, and maintainable operations." },
      { title: "Operational systems", description: "Interfaces built around daily work, status visibility, permissions, and repeatable operational tasks." },
      { title: "ERP / CRM platforms", description: "Role-aware systems that make complex records, workflows, approvals, and business data easier to manage." },
      { title: "Cloud and infrastructure delivery", description: "Technical foundations that support deployment, reliability, monitoring, and maintainable operations." },
    ],
    deliveryFocus: [
    "Map the actual operating model, user roles, permissions, and handoffs before changing the interface.",
    "Prioritise the workflows that create the most operational friction or consume the most time.",
    "Design states, validation, and exception handling carefully because operational users rely on predictable feedback.",
    "Stage system improvements so the business can adopt change without disrupting critical operations.",
  ],
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
    solutionTypes: [
      { title: "Fleet applications", description: "Mobile and web workflows for drivers, operators, supervisors, and teams managing moving assets." },
solutionTypes: [
      { title: "Logistics portals", description: "Shipment, order, partner, and exception workflows that keep operational status visible." },
solutionTypes: [
      { title: "Operational dashboards", description: "Focused views for monitoring volume, movement, delays, exceptions, and next actions." },
solutionTypes: [
      { title: "Mobility digital experiences", description: "Customer or partner-facing experiences that connect planning, tracking, communication, and service." },
      { title: "Logistics portals", description: "Shipment, order, partner, and exception workflows that keep operational status visible." },
      { title: "Operational dashboards", description: "Focused views for monitoring volume, movement, delays, exceptions, and next actions." },
      { title: "Mobility digital experiences", description: "Customer or partner-facing experiences that connect planning, tracking, communication, and service." },
    ],
    deliveryFocus: [
    "Design around the moments where operators need to make fast decisions or recover from an exception.",
    "Keep status, location, ownership, and next action visible without forcing users through unnecessary screens.",
    "Support different roles without duplicating the entire system or creating conflicting sources of truth.",
    "Validate the experience against network, device, workflow, and operational constraints before scaling.",
  ],
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
    solutionTypes: [
      { title: "Hospitality websites", description: "Premium digital experiences that balance discovery, storytelling, trust, and enquiry or booking intent." },
solutionTypes: [
      { title: "Property digital showcases", description: "Immersive presentations that help users understand spaces, locations, amenities, and value." },
solutionTypes: [
      { title: "Luxury brand systems", description: "Connected identity and digital patterns that keep every high-touch brand interaction consistent." },
solutionTypes: [
      { title: "3D and interactive experiences", description: "Visual and interactive layers that help audiences experience a place, product, or concept before visiting." },
      { title: "Property digital showcases", description: "Immersive presentations that help users understand spaces, locations, amenities, and value." },
      { title: "Luxury brand systems", description: "Connected identity and digital patterns that keep every high-touch brand interaction consistent." },
      { title: "3D and interactive experiences", description: "Visual and interactive layers that help audiences experience a place, product, or concept before visiting." },
    ],
    deliveryFocus: [
    "Identify the emotional and practical information users need before they enquire, book, visit, or invest.",
    "Sequence imagery, content, motion, and proof so the visual experience supports understanding rather than distraction.",
    "Make premium presentation work on mobile too, especially around navigation, galleries, enquiry, and booking paths.",
    "Connect brand standards to reusable digital components so future campaigns do not dilute the experience.",
  ],
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
    solutionTypes: [
      { title: "Campaign experiences", description: "Digital launches and campaign surfaces designed to attract attention while keeping the message easy to follow." },
solutionTypes: [
      { title: "Interactive websites", description: "Editorial, promotional, or brand experiences that use interaction to deepen engagement rather than add noise." },
solutionTypes: [
      { title: "Gaming and live content systems", description: "Interfaces and supporting digital experiences built around high-frequency, audience-led interaction." },
solutionTypes: [
      { title: "Motion-led brand experiences", description: "Motion, graphics, and visual systems that help brands communicate consistently across channels." },
      { title: "Interactive websites", description: "Editorial, promotional, or brand experiences that use interaction to deepen engagement rather than add noise." },
      { title: "Gaming and live content systems", description: "Interfaces and supporting digital experiences built around high-frequency, audience-led interaction." },
      { title: "Motion-led brand experiences", description: "Motion, graphics, and visual systems that help brands communicate consistently across channels." },
    ],
    deliveryFocus: [
    "Define the audience action first so motion and interaction support a clear communication goal.",
    "Use pacing, hierarchy, and progressive disclosure to keep highly visual experiences understandable.",
    "Design reusable content and motion patterns so campaigns can scale beyond a single hero asset.",
    "Test the experience across devices because interaction-heavy work can fail when responsiveness is treated too late.",
  ],
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
