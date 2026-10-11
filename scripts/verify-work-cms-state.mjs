import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const cmsStore = await readFile(new URL('../src/lib/cmsStore.ts', import.meta.url), 'utf8');
const workPage = await readFile(new URL('../src/pages/Work.tsx', import.meta.url), 'utf8');

assert.match(cmsStore, /export function getCmsProjectsLoadState\(\)/, 'CMS project hydration state must be observable');
assert.match(cmsStore, /cmsProjectsLoadState = 'error'/, 'CMS API failures must be tracked separately from an empty collection');
assert.match(cmsStore, /if \(projects !== null\)/, 'A valid empty CMS collection must be treated as a successful response');
assert.match(workPage, /projectsLoadState === 'loading'/, 'The Work page must render a loading state before resolving CMS data');
assert.match(workPage, /projectsLoadState === 'error'/, 'The Work page must render an API error separately from an empty portfolio');
assert.match(workPage, /retryCmsProjects/, 'The Work page must expose an explicit retry action');
assert.match(workPage, /getCmsProjectsLoadState\(\)/, 'The Work page must react to the CMS request outcome');

console.log('[work-cms] Loading, empty, and failed-CMS states are guarded.');
