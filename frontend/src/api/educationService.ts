import api from './axios';
import type { Education, ApiResponse } from '@app-types/index';

interface EducationListResponse {
  educations: Education[];
}

interface EducationResponse {
  education: Education;
}

export interface CreateEducationData {
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  gpa?: string;
  description?: string;
}

export const educationService = {
  // Get all education entries for a profile
  getEducation: async (profileId: number): Promise<Education[]> => {
    const response = await api.get<ApiResponse<EducationListResponse>>(`/api/profiles/${profileId}/education`);
    return response.data.data.educations;
  },

  // Create new education entry
  createEducation: async (profileId: number, data: CreateEducationData): Promise<Education> => {
    const response = await api.post<ApiResponse<EducationResponse>>(`/api/profiles/${profileId}/education`, data);
    return response.data.data.education;
  },

  // Update education entry
  updateEducation: async (profileId: number, id: number, data: Partial<CreateEducationData>): Promise<Education> => {
    const response = await api.put<ApiResponse<EducationResponse>>(`/api/profiles/${profileId}/education/${id}`, data);
    return response.data.data.education;
  },

  // Delete education entry
  deleteEducation: async (profileId: number, id: number): Promise<void> => {
    await api.delete(`/api/profiles/${profileId}/education/${id}`);
  },

  // Reorder education entries
  reorderEducation: async (profileId: number, orderedIds: number[]): Promise<void> => {
    await api.post(`/api/profiles/${profileId}/education/reorder`, { ordered_ids: orderedIds });
  },
};
