import api from './axios';
import type { Language, ApiResponse } from '@app-types/index';

interface LanguagesListResponse {
  languages: Language[];
}

interface LanguageResponse {
  language: Language;
}

export interface CreateLanguageData {
  name: string;
  proficiency_level: string; // Backend expects: 'basic', 'intermediate', 'advanced', 'fluent', 'native'
  certification_name?: string;
  certification_score?: string;
}

export const languagesService = {
  // Get all languages for a profile
  getLanguages: async (profileId: number): Promise<Language[]> => {
    const response = await api.get<ApiResponse<LanguagesListResponse>>(`/api/profiles/${profileId}/languages`);
    return response.data.data.languages;
  },

  // Create new language
  createLanguage: async (profileId: number, data: CreateLanguageData): Promise<Language> => {
    // Remove optional fields if empty
    const cleanData = { ...data };
    if (!cleanData.certification_name) delete cleanData.certification_name;
    if (!cleanData.certification_score) delete cleanData.certification_score;

    const response = await api.post<ApiResponse<LanguageResponse>>(`/api/profiles/${profileId}/languages`, cleanData);
    return response.data.data.language;
  },

  // Update language
  updateLanguage: async (profileId: number, id: number, data: Partial<CreateLanguageData>): Promise<Language> => {
    // Remove optional fields if empty
    const cleanData = { ...data };
    if (!cleanData.certification_name) delete cleanData.certification_name;
    if (!cleanData.certification_score) delete cleanData.certification_score;

    const response = await api.put<ApiResponse<LanguageResponse>>(`/api/profiles/${profileId}/languages/${id}`, cleanData);
    return response.data.data.language;
  },

  // Delete language
  deleteLanguage: async (profileId: number, id: number): Promise<void> => {
    await api.delete(`/api/profiles/${profileId}/languages/${id}`);
  },

  // Reorder languages
  reorderLanguages: async (profileId: number, orderedIds: number[]): Promise<void> => {
    await api.post(`/api/profiles/${profileId}/languages/reorder`, { ordered_ids: orderedIds });
  },
};
