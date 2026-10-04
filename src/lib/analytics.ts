const CONSENT_STORAGE_KEY = 'kapitech_cookie_consent';
const ATTRIBUTION_STORAGE_KEY = 'kapitech_attribution_v1';
const ANONYMOUS_ID_STORAGE_KEY = 'kapitech_anonymous_id_v1';

type AnalyticsParams = Record<string, string | number | boolean | undefined>;

export interface AttributionContext {
  anonymousId?: string;
  firstTouch?: Record<string, string>;
  lastTouch?: Record<string, string>;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let initialized = false;
let routeListenerInstalled = false;
let interactionListenerInstalled = false;
let lastTrackedPath = '';

function readStoredJson<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : null;
  } catch {
    return null;
  }
}

function writeStoredJson(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Analytics must never block the public experience.
  }
}

function getAnonymousId(): string | undefined {
  if (typeof window === 'undefined') return undefined;

  try {
    const existing = window.localStorage.getItem(ANONYMOUS_ID_STORAGE_KEY);
    if (existing) return existing;

    const generated = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : 'anon_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);

    window.localStorage.setItem(ANONYMOUS_ID_STORAGE_KEY, generated);
    return generated;
  } catch {
    return undefined;
  }
}

function getMarketingSnapshot(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  const url = new URL(window.location.href);
  const params = url.searchParams;
  const snapshot: Record<string, string> = {
    landing_path: url.pathname + url.search,
    language: document.documentElement.lang || 'en',
  };

  const capture = (key: string, queryKey = key) => {
    const value = params.get(queryKey)?.trim();
    if (value) snapshot[key] = value;
  };

  capture('utm_source');
  capture('utm_medium');
  capture('utm_campaign');
  capture('utm_content');
  capture('utm_term');
  capture('gclid');
  capture('fbclid');
  capture('li_fat_id');

  const referrer = document.referrer?.trim() || '';
  if (referrer) {
    try {
      snapshot.referrer_host = new URL(referrer).hostname;
    } catch {
      // Ignore malformed referrers.
    }
  }

  return snapshot;
}

function updateAttributionStorage(): AttributionContext {
  const current = getMarketingSnapshot();

  if (getConsentChoice() !== 'accepted') {
    return {
      firstTouch: current,
      lastTouch: current,
    };
  }

  const existing = readStoredJson<AttributionContext>(ATTRIBUTION_STORAGE_KEY) || {};
  const hasMarketingSignal = Object.keys(current).some((key) =>
    key.startsWith('utm_') || ['gclid', 'fbclid', 'li_fat_id'].includes(key)
  );

  const next: AttributionContext = {
    anonymousId: existing.anonymousId || getAnonymousId(),
    firstTouch: existing.firstTouch || current,
    lastTouch: hasMarketingSignal || !existing.lastTouch ? current : existing.lastTouch,
  };

  writeStoredJson(ATTRIBUTION_STORAGE_KEY, next);
  return next;
}

export function getAttributionContext(): AttributionContext {
  return updateAttributionStorage();
}

function getConsentChoice(): 'accepted' | 'necessary' | null {
  if (typeof window === 'undefined') return null;

  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === 'accepted' || value === 'necessary' ? value : null;
  } catch {
    return null;
  }
}

function getGaMeasurementId(): string {
  return String(import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim();
}

function getGtmId(): string {
  return String(import.meta.env.VITE_GTM_ID || '').trim();
}

function ensureGoogleAnalytics(): boolean {
  const measurementId = getGaMeasurementId();
  if (!measurementId || typeof window === 'undefined') return false;

  if (!document.querySelector('script[data-kapitech-analytics="ga4"]')) {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    script.dataset.kapitechAnalytics = 'ga4';
    document.head.appendChild(script);
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function (...args: unknown[]) {
    window.dataLayer?.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: false });

  return true;
}

function ensureGoogleTagManager(): boolean {
  const gtmId = getGtmId();
  if (!gtmId || typeof window === 'undefined') return false;
  if (document.querySelector('script[data-kapitech-analytics="gtm"]')) return true;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(gtmId);
  script.dataset.kapitechAnalytics = 'gtm';
  document.head.appendChild(script);

  return true;
}

function analyticsReady(): boolean {
  return initialized && getConsentChoice() === 'accepted';
}

export function trackEvent(name: string, params: AnalyticsParams = {}): void {
  if (!analyticsReady() || typeof window === 'undefined') return;

  const payload = {
    ...params,
    language: document.documentElement.lang || undefined,
  };

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, payload);
  } else if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: name, ...payload });
  }
}

export function trackPageView(pathname = window.location.pathname): void {
  if (!analyticsReady()) return;
  const normalizedPath = pathname || '/';
  if (normalizedPath === lastTrackedPath) return;
  lastTrackedPath = normalizedPath;

  const attribution = getAttributionContext();
  const pageType = normalizedPath === '/'
    ? 'home'
    : normalizedPath.startsWith('/services/')
      ? 'service_detail'
      : normalizedPath === '/services'
        ? 'services_index'
        : normalizedPath === '/work'
          ? 'work'
          : normalizedPath === '/contact'
            ? 'contact'
            : normalizedPath === '/careers'
              ? 'careers'
              : normalizedPath === '/about'
                ? 'about'
                : 'other';

  trackEvent('page_view', {
    page_path: normalizedPath,
    page_type: pageType,
    landing_path: attribution.lastTouch?.landing_path,
  });
}

function installRouteTracking(): void {
  if (routeListenerInstalled || typeof window === 'undefined') return;
  routeListenerInstalled = true;

  window.addEventListener('popstate', () => trackPageView(window.location.pathname));

  const history = window.history;
  const originalPushState = history.pushState.bind(history);
  const originalReplaceState = history.replaceState.bind(history);

  history.pushState = function (...args) {
    const result = originalPushState(...args);
    window.dispatchEvent(new Event('kapitech_route_change'));
    return result;
  };

  history.replaceState = function (...args) {
    const result = originalReplaceState(...args);
    window.dispatchEvent(new Event('kapitech_route_change'));
    return result;
  };

  window.addEventListener('kapitech_route_change', () => {
    window.requestAnimationFrame(() => trackPageView(window.location.pathname));
  });
}

function installInteractionTracking(): void {
  if (interactionListenerInstalled || typeof document === 'undefined') return;
  interactionListenerInstalled = true;

  document.addEventListener('click', (event) => {
    const element = (event.target as Element | null)?.closest?.('a,button,[data-analytics-event]');
    if (!element) return;

    const customEvent = element.getAttribute('data-analytics-event');
    const label = element.getAttribute('aria-label')
      || element.textContent?.replace(/\s+/g, ' ').trim().slice(0, 100)
      || 'unnamed';

    if (customEvent) {
      trackEvent(customEvent, {
        cta_label: label,
        page_path: window.location.pathname,
      });
      return;
    }

    if (element instanceof HTMLAnchorElement) {
      const href = element.href;

      if (href.startsWith('mailto:')) {
        trackEvent('email_click', {
          destination: href.replace(/^mailto:/, '').split('?')[0],
          page_path: window.location.pathname,
        });
        return;
      }

      if (href.includes('wa.me/')) {
        trackEvent('whatsapp_click', { page_path: window.location.pathname });
        return;
      }

      if (href.startsWith('tel:')) {
        trackEvent('phone_click', { page_path: window.location.pathname });
        return;
      }

      try {
        const targetUrl = new URL(href, window.location.href);
        if (targetUrl.origin === window.location.origin && targetUrl.pathname === '/contact') {
          trackEvent('cta_click', {
            cta_label: label,
            cta_location: window.location.pathname,
            cta_target: targetUrl.pathname,
          });
        }
      } catch {
        // Ignore malformed links.
      }
    }
  });
}

export function initAnalytics(): void {
  if (typeof window === 'undefined') return;

  updateAttributionStorage();
  installRouteTracking();
  installInteractionTracking();

  const start = () => {
    if (getConsentChoice() !== 'accepted') {
      initialized = false;
      return;
    }

    updateAttributionStorage();
    initialized = ensureGoogleAnalytics() || ensureGoogleTagManager();
    if (initialized) trackPageView(window.location.pathname);
  };

  start();
  window.addEventListener('kapitech_consent_changed', start);
}
