import api from './axios';
import type { PersonalInfo, ApiResponse } from '@app-types/index';

interface PersonalInfoResponse {
  personalInfo: PersonalInfo;
}

export const personalInfoService = {
  // Get personal info for a profile
  getPersonalInfo: async (profileId: number): Promise<PersonalInfo> => {
    const response = await api.get<ApiResponse<PersonalInfoResponse>>(`/api/profiles/${profileId}/personal`);
    return response.data.data.personalInfo;
  },

  // Update personal info
  updatePersonalInfo: async (profileId: number, data: Partial<PersonalInfo>): Promise<PersonalInfo> => {
    const response = await api.put<ApiResponse<PersonalInfoResponse>>(`/api/profiles/${profileId}/personal`, data);
    return response.data.data.personalInfo;
  },
};
