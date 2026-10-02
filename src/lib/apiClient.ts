const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

const configuredApiBase = String(import.meta.env.VITE_AMS_API_BASE_URL || '').trim();
const defaultApiBase = import.meta.env.PROD ? 'https://ams.kapitech.id/api' : '/api';
const API_BASE_URL = (configuredApiBase || defaultApiBase).replace(/\/+$/, '');

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

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);

  try {
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

    const res = await fetch(targetUrl, {
      ...options,
      method,
      headers,
      credentials: isCrossOrigin ? 'omit' : 'same-origin',
      signal: options.signal || controller.signal
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        data: json as T,
        error: json.error || `HTTP ${res.status}: ${res.statusText}`
      };
    }

    return { success: true, data: json };
  } catch (err: any) {
    return {
      success: false,
      error: err?.name === 'AbortError' ? 'Request timed out. Please try again.' : (err?.message || 'Network request failed')
    };
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function uploadPublicResume(file: File): Promise<{ success: boolean; data?: { documentId: string; resumeUrl: string; filename: string; mimeType: string; sizeBytes: number }; error?: string }> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 30000);

  try {
    const targetUrl = `${resolveApiUrl('/api/leads/resume-upload')}?filename=${encodeURIComponent(file.name)}`;
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': file.type || 'application/octet-stream'
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

export const api = {
  leads: {
    submit: (lead: unknown) =>
      apiRequest('/api/leads/submit', {
        method: 'POST',
        body: JSON.stringify(lead)
      })
  },
  cms: {
    getPublicSettings: () => apiRequest('/api/cms/public-settings'),
    getServices: () => apiRequest('/api/cms/services'),
    getProjects: () => apiRequest('/api/cms/projects'),
    getTestimonials: () => apiRequest('/api/cms/testimonials')
  }
};
