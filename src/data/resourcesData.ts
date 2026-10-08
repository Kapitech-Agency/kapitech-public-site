export type ResourceItem = {
  slug: string;
  title: string;
  type: string;
  summary: string;
  intro: string;
  sections: Array<{ title: string; paragraphs: string[] }>;
};

export const resources: ResourceItem[] = [
  {
    slug: 'website-launch-checklist',
    title: 'Website Launch Checklist',
    type: 'Checklist',
    summary: 'A practical pre-launch review for teams preparing a corporate, marketing, or product website.',
    intro: 'Use this checklist to review the parts of a website that are easy to miss immediately before launch. It is written for business, design, marketing, and engineering teams that need one shared release baseline.',
    sections: [
      { title: 'Content and messaging', paragraphs: ['Confirm the value proposition is clear in the first viewport and matches the service or product being offered.', 'Review every headline, CTA, contact detail, legal link, language variant, image caption, and metadata field for consistency.', 'Remove placeholder copy, stale claims, duplicated sections, and internal notes that should never be public.'] },
      { title: 'Forms and conversion paths', paragraphs: ['Submit every public form from desktop and mobile and confirm that validation, loading, success, and failure states are understandable.', 'Verify that every primary CTA reaches a working destination and that high-intent visitors have a clear path to contact, consultation, or inquiry.'] },
      { title: 'Technical release checks', paragraphs: ['Test the production build on current Chromium, Safari, and Firefox environments where possible.', 'Verify canonical URLs, robots directives, sitemap generation, social metadata, structured data, and 404 handling.', 'Confirm that analytics and optional tracking only initialise according to the site consent model.'] },
      { title: 'Accessibility and performance', paragraphs: ['Check keyboard navigation, visible focus, dialog focus trapping, semantic headings, useful alternative text, contrast, reduced-motion behaviour, and mobile tap targets.', 'Review image sizes, lazy-loading behaviour, font loading, layout shifts, and the amount of JavaScript executed before the page becomes usable.'] }
    ]
  },
  {
    slug: 'mvp-discovery-checklist',
    title: 'MVP Discovery Checklist',
    type: 'Product',
    summary: 'A structured starting point for founders and teams defining an MVP before design and engineering begin.',
    intro: 'The purpose of discovery is not to document everything a future product might become. The purpose is to create enough clarity to make a sensible first release decision.',
    sections: [
      { title: 'Problem definition', paragraphs: ['State the user problem in observable terms and identify who experiences it most frequently.', 'Document the current workaround, why it is insufficient, and what evidence suggests the problem matters.'] },
      { title: 'User and workflow', paragraphs: ['Identify the primary user, the trigger that starts the journey, the critical decision points, and the minimum successful outcome.', 'Separate must-have workflow steps from convenience features that can remain outside the first release.'] },
      { title: 'Scope and validation', paragraphs: ['Define what the MVP will prove, what evidence will count as success, and what assumptions remain uncertain.', 'Map dependencies such as integrations, authentication, payments, data sources, compliance requirements, and operational support.'] },
      { title: 'Delivery readiness', paragraphs: ['Create an agreed backlog, delivery milestone structure, acceptance criteria, ownership model, and review cadence before production work begins.'] }
    ]
  },
  {
    slug: 'ux-audit-checklist',
    title: 'UX Audit Checklist',
    type: 'UX',
    summary: 'A focused heuristic review framework for finding usability friction across important product journeys.',
    intro: 'This framework helps teams inspect an interface systematically before deciding which improvements deserve design or engineering investment.',
    sections: [
      { title: 'Navigation and information architecture', paragraphs: ['Check whether users can understand where they are, what the next action is, and how to recover when they reach the wrong place.', 'Review naming, grouping, hierarchy, search, filtering, breadcrumbs, and the consistency of navigation patterns.'] },
      { title: 'Interaction quality', paragraphs: ['Inspect form states, loading behaviour, empty states, error recovery, confirmation patterns, modal behaviour, and keyboard interactions.', 'Look for controls that are technically clickable but visually or semantically ambiguous.'] },
      { title: 'Content and accessibility', paragraphs: ['Check heading hierarchy, label clarity, readable line length, contrast, focus states, touch targets, motion, and alternative text.', 'Review whether critical information depends on colour alone or on interactions that are difficult to discover.'] },
      { title: 'Business friction', paragraphs: ['Identify where users abandon a key journey, encounter unnecessary steps, or lack confidence about what happens after submitting an action.'] }
    ]
  },
  {
    slug: 'digital-project-brief-template',
    title: 'Digital Project Brief Template',
    type: 'Template',
    summary: 'A concise project-brief structure to help teams prepare a useful first conversation with a digital agency.',
    intro: 'A strong project brief gives a delivery team context without pretending that every requirement is already known. Keep the information practical and state uncertainty where it exists.',
    sections: [
      { title: 'Business context', paragraphs: ['Describe the organisation, the business objective, why the project matters now, and the outcome the business needs.'] },
      { title: 'Users and scope', paragraphs: ['Describe the primary audience, the core workflow, the products or pages involved, and anything that is explicitly out of scope.'] },
      { title: 'Requirements and constraints', paragraphs: ['List known integrations, technical requirements, platforms, data considerations, content ownership, compliance constraints, deadlines, and operational dependencies.'] },
      { title: 'Success and next steps', paragraphs: ['State how the team will know the project is working and identify the decision makers, review process, target milestone, and preferred next step.'] }
    ]
  },
  {
    slug: 'corporate-website-rfp-guide',
    title: 'Corporate Website RFP Guide',
    type: 'Guide',
    summary: 'A buyer-side guide for comparing website partners without turning the RFP into a list of technology buzzwords.',
    intro: 'A useful RFP gives agencies enough context to propose the right solution while preserving room for professional judgement. Focus on outcomes, constraints, responsibilities, and acceptance criteria.',
    sections: [
      { title: 'What to include', paragraphs: ['Explain the current business problem, the audiences involved, the current website limitations, required content, integrations, expected traffic patterns, and internal ownership.'] },
      { title: 'How to compare proposals', paragraphs: ['Compare understanding of the problem, proposed information architecture, delivery process, QA approach, governance, post-launch support, relevant case studies, and clarity of assumptions.'] },
      { title: 'Questions worth asking', paragraphs: ['Ask who will actually work on the account, how scope changes are handled, how QA is performed, how accessibility is addressed, how technical decisions are documented, and what happens after launch.'] },
      { title: 'Commercial clarity', paragraphs: ['Request a clear description of what is included, what is excluded, milestone structure, payment assumptions, dependencies, and ongoing support options.'] }
    ]
  }
];
