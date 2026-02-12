import api from './axios';
import type { Experience, ApiResponse } from '@app-types/index';

interface ExperienceListResponse {
  experiences: Experience[];
}

interface ExperienceResponse {
  experience: Experience;
}

export interface CreateExperienceData {
  project_title: string;
  position: string;
  company: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  achievements?: string;
  technologies?: string;
}

export const experienceService = {
  // Get all experience entries for a profile
  getExperience: async (profileId: number): Promise<Experience[]> => {
    const response = await api.get<ApiResponse<ExperienceListResponse>>(`/api/profiles/${profileId}/experience`);
    return response.data.data.experiences;
  },

  // Create new experience entry
  createExperience: async (profileId: number, data: CreateExperienceData): Promise<Experience> => {
    const response = await api.post<ApiResponse<ExperienceResponse>>(`/api/profiles/${profileId}/experience`, data);
    return response.data.data.experience;
  },

  // Update experience entry
  updateExperience: async (profileId: number, id: number, data: Partial<CreateExperienceData>): Promise<Experience> => {
    const response = await api.put<ApiResponse<ExperienceResponse>>(`/api/profiles/${profileId}/experience/${id}`, data);
    return response.data.data.experience;
  },

  // Delete experience entry
  deleteExperience: async (profileId: number, id: number): Promise<void> => {
    await api.delete(`/api/profiles/${profileId}/experience/${id}`);
  },

  // Reorder experience entries
  reorderExperience: async (profileId: number, orderedIds: number[]): Promise<void> => {
    await api.post(`/api/profiles/${profileId}/experience/reorder`, { ordered_ids: orderedIds });
  },
};
