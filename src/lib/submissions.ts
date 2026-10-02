import { api } from './apiClient';

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
  specialty?: string;
  rateCard?: string;
  experienceYears?: string;
  tools?: string;
  createdAt?: string;
  userAgent?: string;
  priority?: 'urgent' | 'high' | 'normal' | 'low';
  tags?: string[];
}

export const submitToInbox = async (
  data: Omit<ContactSubmission, 'id' | 'createdAt' | 'status'>
): Promise<{ success: boolean; id: string }> => {
  const result = await api.leads.submit(data);
  const id = (result.data as { id?: string } | undefined)?.id;

  if (!result.success || !id) {
    throw new Error(result.error || 'Lead submission failed.');
  }

  return { success: true, id };
};
