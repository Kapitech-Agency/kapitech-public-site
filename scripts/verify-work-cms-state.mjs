import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const cmsStore = await readFile(new URL('../src/lib/cmsStore.ts', import.meta.url), 'utf8');
const workPage = await readFile(new URL('../src/pages/Work.tsx', import.meta.url), 'utf8');
const testimonialSection = await readFile(new URL('../src/components/Testimonials.tsx', import.meta.url), 'utf8');

assert.match(cmsStore, /export function getCmsProjectsLoadState\(\)/, 'CMS project hydration state must be observable');
assert.match(cmsStore, /cmsProjectsLoadState = 'error'/, 'CMS API failures must be tracked separately from an empty collection');
assert.match(cmsStore, /if \(projects !== null\)/, 'A valid empty CMS collection must be treated as a successful response');
assert.match(cmsStore, /isPublished !== false/, 'Legacy CMS records without a publication flag must remain visible unless explicitly unpublished');
assert.match(workPage, /projectsLoadState === 'loading'/, 'The Work page must render a loading state before resolving CMS data');
assert.match(workPage, /projectsLoadState === 'error'/, 'The Work page must render an API error separately from an empty portfolio');
assert.match(workPage, /retryCmsProjects/, 'The Work page must expose an explicit retry action');
assert.match(workPage, /getCmsProjectsLoadState\(\)/, 'The Work page must react to the CMS request outcome');
const initialVisibleCount = workPage.match(/const \[visibleCount, setVisibleCount\] = useState<number>\((\d+)\);/);
assert.ok(Number(initialVisibleCount?.[1] ?? 0) >= 54, 'The Work page must show the full 54-item demo portfolio without requiring Load More');
assert.doesNotMatch(workPage, /if \(projectsList\.length === 0\) \{/, 'An empty CMS collection must not replace the full Work layout');
assert.match(workPage, /work-spotlight-empty-title/, 'The Work spotlight must remain visible with no published cases');
assert.match(workPage, /Case Studies/, 'The Work case-study listing must remain in the page');
assert.match(cmsStore, /item\?\.isPublished !== false/, 'Legacy testimonials must not disappear when the publication flag is absent');
assert.match(testimonialSection, /testimonials-empty-title/, 'Homepage testimonial section must remain visible without approved quotes');

console.log('[work-cms] Loading, error, empty portfolio, and homepage testimonial states are guarded.');
