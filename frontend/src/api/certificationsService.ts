import api from './axios';
import type { Certificate, ApiResponse } from '@app-types/index';

interface CertificationsListResponse {
  certifications: Certificate[];
}

interface CertificationResponse {
  certification: Certificate;
}

export interface CreateCertificationData {
  name: string;
  issuing_organization: string;
  issue_date: string; // YYYY-MM-DD
  expiration_date?: string; // YYYY-MM-DD
  credential_id?: string;
  credential_url?: string;
}

export const certificationsService = {
  // Get all certifications for a profile
  getCertifications: async (profileId: number): Promise<Certificate[]> => {
    const response = await api.get<ApiResponse<CertificationsListResponse>>(`/api/profiles/${profileId}/certifications`);
    return response.data.data.certifications;
  },

  // Create new certification
  createCertification: async (profileId: number, data: CreateCertificationData): Promise<Certificate> => {
    // Remove optional fields if empty
    const cleanData = { ...data };
    if (!cleanData.expiration_date) delete cleanData.expiration_date;
    if (!cleanData.credential_id) delete cleanData.credential_id;
    if (!cleanData.credential_url) delete cleanData.credential_url;

    console.log('Sending certification to API:', cleanData);
    const response = await api.post<ApiResponse<CertificationResponse>>(`/api/profiles/${profileId}/certifications`, cleanData);
    return response.data.data.certification;
  },

  // Update certification
  updateCertification: async (profileId: number, id: number, data: Partial<CreateCertificationData>): Promise<Certificate> => {
    // Remove optional fields if empty
    const cleanData = { ...data };
    if (!cleanData.expiration_date) delete cleanData.expiration_date;
    if (!cleanData.credential_id) delete cleanData.credential_id;
    if (!cleanData.credential_url) delete cleanData.credential_url;

    console.log('Sending certification update to API:', cleanData);
    const response = await api.put<ApiResponse<CertificationResponse>>(`/api/profiles/${profileId}/certifications/${id}`, cleanData);
    return response.data.data.certification;
  },

  // Delete certification
  deleteCertification: async (profileId: number, id: number): Promise<void> => {
    await api.delete(`/api/profiles/${profileId}/certifications/${id}`);
  },

  // Reorder certifications
  reorderCertifications: async (profileId: number, orderedIds: number[]): Promise<void> => {
    await api.post(`/api/profiles/${profileId}/certifications/reorder`, { ordered_ids: orderedIds });
  },
};
