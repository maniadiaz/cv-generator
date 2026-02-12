import api from './axios';
import type { Skill, ApiResponse } from '@app-types/index';

interface SkillsListResponse {
  skills: Skill[];
}

interface SkillResponse {
  skill: Skill;
}

interface CategoryResponse {
  categories: string[];
}

export interface SkillCategory {
  value: string;
  label: string;
  description: string;
  icon: string;
  examples: string[];
}

interface CategoriesDetailedResponse {
  categories: SkillCategory[];
  total: number;
}

interface StatsResponse {
  total_skills: number;
  by_category: Record<string, number>;
  by_level: Record<string, number>;
  average_level: number;
}

export interface CreateSkillData {
  name: string;
  category: string;
  proficiency_level: string; // Backend expects: 'beginner', 'intermediate', 'advanced', 'expert', 'master'
  years_of_experience?: number;
}

export const skillsService = {
  // Get all skills for a profile
  getSkills: async (profileId: number): Promise<Skill[]> => {
    const response = await api.get<ApiResponse<SkillsListResponse>>(`/api/profiles/${profileId}/skills`);
    return response.data.data.skills;
  },

  // Create new skill
  createSkill: async (profileId: number, data: CreateSkillData): Promise<Skill> => {
    // Remove years_of_experience if it's 0 or undefined
    const cleanData = { ...data };
    if (!cleanData.years_of_experience || cleanData.years_of_experience === 0) {
      delete cleanData.years_of_experience;
    }

    const response = await api.post<ApiResponse<SkillResponse>>(`/api/profiles/${profileId}/skills`, cleanData);
    return response.data.data.skill;
  },

  // Update skill
  updateSkill: async (profileId: number, id: number, data: Partial<CreateSkillData>): Promise<Skill> => {
    // Remove years_of_experience if it's 0 or undefined
    const cleanData = { ...data };
    if (!cleanData.years_of_experience || cleanData.years_of_experience === 0) {
      delete cleanData.years_of_experience;
    }

    const response = await api.put<ApiResponse<SkillResponse>>(`/api/profiles/${profileId}/skills/${id}`, cleanData);
    return response.data.data.skill;
  },

  // Delete skill
  deleteSkill: async (profileId: number, id: number): Promise<void> => {
    await api.delete(`/api/profiles/${profileId}/skills/${id}`);
  },

  // Reorder skills
  reorderSkills: async (profileId: number, orderedIds: number[]): Promise<void> => {
    await api.post(`/api/profiles/${profileId}/skills/reorder`, { ordered_ids: orderedIds });
  },

  // Get skill categories (legacy - returns only strings)
  getCategories: async (profileId: number): Promise<string[]> => {
    const response = await api.get<ApiResponse<CategoryResponse>>(`/api/profiles/${profileId}/skills/categories`);
    return response.data.data.categories;
  },

  // Get skill categories with full details (new)
  getCategoriesDetailed: async (profileId: number): Promise<SkillCategory[]> => {
    const response = await api.get<ApiResponse<CategoriesDetailedResponse>>(`/api/profiles/${profileId}/skills/categories`);
    return response.data.data.categories;
  },

  // Get skill statistics
  getStats: async (profileId: number): Promise<StatsResponse> => {
    const response = await api.get<ApiResponse<StatsResponse>>(`/api/profiles/${profileId}/skills/stats`);
    return response.data.data;
  },
};
