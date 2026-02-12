import api from './axios';
import type { CVProfile, ApiResponse } from '@app-types/index';

interface ProfilesResponse {
  profiles: CVProfile[];
}

interface ProfileResponse {
  profile: CVProfile;
}

export const profileService = {
  // Get all profiles for current user
  getProfiles: async (): Promise<CVProfile[]> => {
    const response = await api.get<ApiResponse<ProfilesResponse>>('/api/profiles');
    return response.data.data.profiles;
  },

  // Get single profile by ID
  getProfileById: async (id: number): Promise<CVProfile> => {
    const response = await api.get<ApiResponse<ProfileResponse>>(`/api/profiles/${id}`);
    return response.data.data.profile;
  },

  // Create new profile
  createProfile: async (data: { name: string; template?: string }): Promise<CVProfile> => {
    const response = await api.post<ApiResponse<ProfileResponse>>('/api/profiles', data);
    return response.data.data.profile;
  },

  // Update existing profile
  updateProfile: async (id: number, data: Partial<{ name: string; template: string; color_scheme: string }>): Promise<CVProfile> => {
    const response = await api.put<ApiResponse<ProfileResponse>>(`/api/profiles/${id}`, data);
    return response.data.data.profile;
  },

  // Delete profile
  deleteProfile: async (id: number): Promise<void> => {
    await api.delete(`/api/profiles/${id}`);
  },

  // Set profile as default
  setDefault: async (id: number): Promise<CVProfile> => {
    const response = await api.patch<ApiResponse<ProfileResponse>>(`/api/profiles/${id}/set-default`);
    return response.data.data.profile;
  },

  // Duplicate profile
  duplicateProfile: async (id: number): Promise<CVProfile> => {
    const response = await api.post<ApiResponse<ProfileResponse>>(`/api/profiles/${id}/duplicate`);
    return response.data.data.profile;
  },

  // Get complete profile with all sections
  getCompleteProfile: async (id: number): Promise<CVProfile> => {
    const response = await api.get<ApiResponse<ProfileResponse>>(`/api/profiles/${id}/complete`);
    return response.data.data.profile;
  },

  // Get profile completion percentage
  getCompletion: async (id: number): Promise<{ completion_percentage: number; missing_sections: string[] }> => {
    const response = await api.get<ApiResponse<{ completion_percentage: number; missing_sections: string[] }>>(`/api/profiles/${id}/completion`);
    return response.data.data;
  },

  // Get profile stats
  getStats: async (): Promise<{ total: number; default_profile_id: number | null; most_downloaded: CVProfile | null }> => {
    const response = await api.get<ApiResponse<{ total: number; default_profile_id: number | null; most_downloaded: CVProfile | null }>>('/api/profiles/stats');
    return response.data.data;
  },

  // Export profile to PDF
  exportToPDF: async (id: number): Promise<Blob> => {
    const response = await api.get(`/api/profiles/${id}/pdf/export-pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Preview PDF
  previewPDF: async (id: number): Promise<Blob> => {
    const response = await api.get(`/api/profiles/${id}/pdf/preview-pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Validate profile for PDF export
  validateForExport: async (id: number): Promise<{ is_valid: boolean; warnings: string[] }> => {
    const response = await api.get<ApiResponse<{ is_valid: boolean; warnings: string[] }>>(`/api/profiles/${id}/pdf/validate`);
    return response.data.data;
  },
};
