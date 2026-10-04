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
  createdAt?: string;
  userAgent?: string;
  priority?: 'urgent' | 'high' | 'normal' | 'low';
  tags?: string[];
  attribution?: AttributionContext;
}

export const submitToInbox = async (
  data: Omit<ContactSubmission, 'id' | 'createdAt' | 'status' | 'attribution'>
): Promise<{ success: boolean; id: string }> => {
  const attribution = getAttributionContext();
  const enrichedData = { ...data, attribution };

  trackEvent('contact_submit', {
    form_name: data.type === 'career' ? 'careers_form' : 'contact_form',
    service_count: data.services?.length || 0,
  });

  const result = await api.leads.submit(enrichedData);
  const id = (result.data as { id?: string } | undefined)?.id;

  if (!result.success || !id) {
    trackEvent('contact_error', {
      form_name: data.type === 'career' ? 'careers_form' : 'contact_form',
      error_type: 'api_rejection',
    });
    throw new Error(result.error || 'Lead submission failed.');
  }

  trackEvent('contact_success', {
    form_name: data.type === 'career' ? 'careers_form' : 'contact_form',
    lead_id: id,
  });

  return { success: true, id };
};
