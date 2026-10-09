import type { ProjectItem } from '../data/projectsData';
import type { ServiceItemData } from '../data/servicesData';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

const configuredApiBase = String(import.meta.env.VITE_AMS_API_BASE_URL || '').trim();
const defaultApiBase = import.meta.env.PROD ? 'https://ams.kapitech.id/api' : '/api';

function normalizeApiBase(value: string): string {
  const normalized = value.trim().replace(/\/+$/, '');
  if (!normalized) return '/api';
  return /\/api$/i.test(normalized) ? normalized : `${normalized}/api`;
}

const API_BASE_URL = normalizeApiBase(configuredApiBase || defaultApiBase);

function readCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const prefix = `${name}=`;
  const part = document.cookie.split('; ').find((item) => item.startsWith(prefix));
  return part ? decodeURIComponent(part.slice(prefix.length)) : '';
}

function resolveApiUrl(endpoint: string): string {
  const normalizedEndpoint = endpoint === '/api'
    ? ''
    : endpoint.startsWith('/api/')
      ? endpoint.slice(4)
      : endpoint.startsWith('/')
        ? endpoint
        : `/${endpoint}`;

  return `${API_BASE_URL}${normalizedEndpoint}`;
}

const RETRYABLE_READ_STATUSES = new Set([408, 502, 503, 504]);
const READ_RETRY_DELAYS_MS = [700, 1800];

function sleep(delayMs: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, delayMs));
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string; status?: number }> {
  const method = String(options.method || 'GET').toUpperCase();
  const headers = new Headers(options.headers);
  const hasRequestBody = options.body !== undefined && options.body !== null;

  if (hasRequestBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const targetUrl = resolveApiUrl(endpoint);
  const targetOrigin = new URL(targetUrl, window.location.href).origin;
  const isCrossOrigin = targetOrigin !== window.location.origin;

  if (MUTATING_METHODS.has(method) && !isCrossOrigin) {
    const csrfToken = readCookie('kapi_csrf');
    if (csrfToken && !headers.has('X-CSRF-Token')) {
      headers.set('X-CSRF-Token', csrfToken);
    }
  }

  const canRetry = method === 'GET' && !options.signal;
  const maxAttempts = canRetry ? READ_RETRY_DELAYS_MS.length + 1 : 1;
  let lastError: string | undefined;
  let lastStatus: number | undefined;
  let lastData: T | undefined;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    if (attempt > 0) await sleep(READ_RETRY_DELAYS_MS[attempt - 1]);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch(targetUrl, {
        ...options,
        method,
        headers,
        credentials: isCrossOrigin ? 'omit' : 'same-origin',
        signal: options.signal || controller.signal
      });
      const json = await res.json().catch(() => ({}));
      lastStatus = res.status;
      lastData = json as T;

      if (!res.ok) {
        lastError = json.error || `HTTP ${res.status}: ${res.statusText}`;
        if (!canRetry || !RETRYABLE_READ_STATUSES.has(res.status)) {
          return { success: false, data: lastData, error: lastError, status: lastStatus };
        }
        continue;
      }

      return { success: true, data: json, status: res.status };
    } catch (err: any) {
      lastStatus = undefined;
      lastError = err?.name === 'AbortError'
        ? 'Request timed out. Please try again.'
        : (err?.message || 'Network request failed');

      if (!canRetry || err?.name === 'AbortError') {
        return { success: false, error: lastError };
      }
    } finally {
      window.clearTimeout(timeout);
    }
  }

  return {
    success: false,
    data: lastData,
    error: lastError || 'Network request failed',
    status: lastStatus
  };
}

export async function uploadPublicResume(file: File): Promise<{ success: boolean; data?: { documentId: string; resumeUrl: string; filename: string; mimeType: string; sizeBytes: number }; error?: string }> {
  const allowedTypes = new Set(['application/pdf']);
  if (file.size > 5 * 1024 * 1024) return { success: false, error: 'Resume exceeds the 5 MB upload limit.' };
  if (!/\.pdf$/i.test(file.name) || (file.type && !allowedTypes.has(file.type))) {
    return { success: false, error: 'Resume must be a valid PDF file.' };
  }
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 30000);

  try {
    const targetUrl = resolveApiUrl('/api/leads/resume-upload');
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
        'X-Resume-Filename': encodeURIComponent(file.name)
      },
      credentials: 'omit',
      body: file,
      signal: controller.signal
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        data: json,
        error: json.error || `HTTP ${res.status}: ${res.statusText}`
      };
    }

    return {
      success: true,
      data: json.data || json
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.name === 'AbortError' ? 'Resume upload timed out. Please try again.' : (err?.message || 'Resume upload failed.')
    };
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function uploadProjectBrief(file: File): Promise<{ success: boolean; data?: { documentId: string; briefUrl: string; filename: string; mimeType: string; sizeBytes: number }; error?: string }> {
  const allowedTypes = new Set(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);
  if (file.size > 10 * 1024 * 1024) return { success: false, error: 'Project brief exceeds the 10 MB upload limit.' };
  if (!/\.(pdf|doc|docx)$/i.test(file.name) || (file.type && !allowedTypes.has(file.type))) {
    return { success: false, error: 'Project brief must be a PDF, DOC, or DOCX file.' };
  }
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 30000);
  try {
    const targetUrl = resolveApiUrl('/api/leads/brief-upload');
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
        'X-Project-Brief-Filename': encodeURIComponent(file.name)
      },
      credentials: 'omit',
      body: file,
      signal: controller.signal
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { success: false, data: json, error: json.error || `HTTP ${res.status}: ${res.statusText}` };
    return { success: true, data: json.data || json };
  } catch (err: any) {
    return { success: false, error: err?.name === 'AbortError' ? 'Project brief upload timed out. Please try again.' : (err?.message || 'Project brief upload failed.') };
  } finally {
    window.clearTimeout(timeout);
  }
}

export const api = {
  leads: {
    submit: (lead: unknown) =>
      apiRequest('/api/leads/submit', {
        method: 'POST',
        body: JSON.stringify(lead)
      })
  },
  cms: {
    getPublicSettings: () => apiRequest<{
      settings?: {
        siteTitle?: string;
        siteDescription?: string;
        maintenanceMode?: boolean;
        defaultLanguage?: string;
      };
    }>('/api/cms/public-settings'),
    getServices: () => apiRequest<{ services?: ServiceItemData[] }>('/api/cms/services'),
    getProjects: () => apiRequest<{ projects?: ProjectItem[] }>('/api/cms/projects'),
    getTestimonials: () => apiRequest<{ testimonials?: import('./cmsStore').TestimonialItem[] }>('/api/cms/testimonials'),
    getInsights: (params: Record<string, string | number | boolean | undefined> = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') query.set(key, String(value));
      });
      return apiRequest<{
        success: boolean;
        insights: import('../data/insightTypes').InsightItem[];
        meta?: { total: number; page: number; pageSize: number; totalPages: number };
      }>('/api/cms/insights' + (query.toString() ? '?' + query.toString() : ''));
    },
    getInsightBySlug: (slug: string) =>
      apiRequest<{ success: boolean; insight: import('../data/insightTypes').InsightItem }>(
        '/api/cms/insights/' + encodeURIComponent(slug)
      ),
    getInsightCategories: (language?: 'id' | 'en') =>
      apiRequest<{ categories?: import('../data/insightTypes').InsightCategory[] }>(
        '/api/cms/insight-categories' + (language ? '?language=' + language : '')
      )
  }
};
