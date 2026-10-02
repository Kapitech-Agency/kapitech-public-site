const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function readCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const prefix = `${name}=`;
  const part = document.cookie.split('; ').find((item) => item.startsWith(prefix));
  return part ? decodeURIComponent(part.slice(prefix.length)) : '';
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);

  try {
    const method = String(options.method || 'GET').toUpperCase();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (MUTATING_METHODS.has(method)) {
      const csrfToken = readCookie('kapi_csrf');
      if (csrfToken) headers['X-CSRF-Token'] = csrfToken;
    }

    const url = endpoint.startsWith('/') ? endpoint : `/api/${endpoint}`;
    const res = await fetch(url, {
      ...options,
      method,
      headers,
      credentials: 'same-origin',
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
