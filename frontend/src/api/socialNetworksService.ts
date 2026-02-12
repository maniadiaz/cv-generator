import api from './axios';
import type { SocialNetwork, ApiResponse } from '@app-types/index';

interface SocialNetworksListResponse {
  socialNetworks: SocialNetwork[];
}

interface SocialNetworkResponse {
  socialNetwork: SocialNetwork;
}

export type SocialPlatform =
  | 'linkedin'
  | 'github'
  | 'gitlab'
  | 'twitter'
  | 'portfolio'
  | 'stackoverflow'
  | 'medium'
  | 'youtube'
  | 'behance'
  | 'dribbble'
  | 'other';

export interface CreateSocialNetworkData {
  platform: SocialPlatform;
  url: string;
  username?: string;
  is_visible?: boolean;
}

export const socialNetworksService = {
  // Get all social networks for a profile
  getSocialNetworks: async (profileId: number): Promise<SocialNetwork[]> => {
    const response = await api.get<ApiResponse<SocialNetworksListResponse>>(`/api/profiles/${profileId}/social-networks`);
    return response.data.data.socialNetworks;
  },

  // Create new social network
  createSocialNetwork: async (profileId: number, data: CreateSocialNetworkData): Promise<SocialNetwork> => {
    // Remove username if empty
    const cleanData = { ...data };
    if (!cleanData.username) delete cleanData.username;

    console.log('Sending social network to API:', cleanData);
    const response = await api.post<ApiResponse<SocialNetworkResponse>>(`/api/profiles/${profileId}/social-networks`, cleanData);
    return response.data.data.socialNetwork;
  },

  // Update social network
  updateSocialNetwork: async (profileId: number, id: number, data: Partial<CreateSocialNetworkData>): Promise<SocialNetwork> => {
    // Remove username if empty
    const cleanData = { ...data };
    if (!cleanData.username) delete cleanData.username;

    console.log('Sending social network update to API:', cleanData);
    const response = await api.put<ApiResponse<SocialNetworkResponse>>(`/api/profiles/${profileId}/social-networks/${id}`, cleanData);
    return response.data.data.socialNetwork;
  },

  // Delete social network
  deleteSocialNetwork: async (profileId: number, id: number): Promise<void> => {
    await api.delete(`/api/profiles/${profileId}/social-networks/${id}`);
  },

  // Reorder social networks
  reorderSocialNetworks: async (profileId: number, orderedIds: number[]): Promise<void> => {
    await api.post(`/api/profiles/${profileId}/social-networks/reorder`, { ordered_ids: orderedIds });
  },
};
