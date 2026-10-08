import { api } from './apiClient';
import { getAttributionContext, trackEvent, type AttributionContext } from './analytics';

export interface ContactSubmission {
  id: string;
  fullName: string;
  email: string;
  company?: string;
  phone?: string;
  services?: string[];
  budget?: string;
  message: string;
  status?: 'new' | 'in-review' | 'contacted' | 'closed';
  source?: string;
  type?: 'inquiry' | 'career' | 'vendor' | 'newsletter';
  positionTitle?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  specialty?: string;
  rateCard?: string;
  experienceYears?: string;
  tools?: string;
  availability?: string;
  location?: string;
  industry?: string;
  ndaRequested?: boolean;
  briefUrl?: string;
  createdAt?: string;
  userAgent?: string;
  priority?: 'urgent' | 'high' | 'normal' | 'low';
  tags?: string[];
  attribution?: AttributionContext;
}

function createSubmissionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `web_${crypto.randomUUID()}`;
  }
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(18);
    crypto.getRandomValues(bytes);
    return `web_${Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')}`;
  }
  return `web_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
}

function shouldRetryLeadSubmission(result: { success: boolean; status?: number }): boolean {
  return !result.success && (result.status === undefined || Boolean(result.status && result.status >= 500));
}

function wait(delayMs: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, delayMs));
}

export const submitToInbox = async (
  data: Omit<ContactSubmission, 'id' | 'createdAt' | 'status' | 'attribution'>
): Promise<{ success: boolean; id: string }> => {
  const attribution = getAttributionContext();
  const submissionId = createSubmissionId();
  const enrichedData = { ...data, attribution, submissionId };

  const formName = data.type === 'career'
    ? 'careers_form'
    : data.type === 'newsletter'
      ? 'newsletter_form'
      : 'contact_form';

  trackEvent(data.type === 'newsletter' ? 'newsletter_submit' : 'contact_submit', {
    form_name: formName,
    service_count: data.services?.length || 0,
  });

  let result = await api.leads.submit(enrichedData);
  for (let attempt = 0; attempt < 2 && shouldRetryLeadSubmission(result); attempt += 1) {
    await wait(attempt === 0 ? 900 : 2200);
    result = await api.leads.submit(enrichedData);
  }

  const id = (result.data as { id?: string } | undefined)?.id;
  if (!result.success || !id) {
    trackEvent(data.type === 'newsletter' ? 'newsletter_error' : 'contact_error', {
      form_name: formName,
      error_type: 'api_rejection',
    });
    throw new Error(result.error || 'Lead submission failed.');
  }

  trackEvent(data.type === 'newsletter' ? 'newsletter_success' : 'contact_success', {
    form_name: formName,
  });

  return { success: true, id };
};