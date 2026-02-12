import api from './axios';
import type { ApiResponse, ColorScheme, ColorSchemeCategory } from '@app-types/index';

interface ColorSchemesResponse {
  schemes: ColorScheme[];
  count: number;
}

interface ColorSchemesByCategoryResponse {
  categories: Record<ColorSchemeCategory, ColorScheme[]>;
  categoryCount: number;
}

interface ColorSchemeResponse {
  scheme: ColorScheme;
}

interface CategorySchemesResponse {
  category: ColorSchemeCategory;
  schemes: ColorScheme[];
  count: number;
}

export const colorSchemeService = {
  // Get all available color schemes
  getColorSchemes: async (): Promise<ColorScheme[]> => {
    const response = await api.get<ApiResponse<ColorSchemesResponse>>('/api/color-schemes');
    return response.data.data.schemes;
  },

  // Get color schemes grouped by category
  getSchemesByCategory: async (): Promise<Record<ColorSchemeCategory, ColorScheme[]>> => {
    const response = await api.get<ApiResponse<ColorSchemesByCategoryResponse>>(
      '/api/color-schemes/categories'
    );
    return response.data.data.categories;
  },

  // Get a specific color scheme by ID
  getColorScheme: async (schemeId: string): Promise<ColorScheme> => {
    const response = await api.get<ApiResponse<ColorSchemeResponse>>(
      `/api/color-schemes/${schemeId}`
    );
    return response.data.data.scheme;
  },

  // Get color schemes for a specific category
  getCategorySchemes: async (category: ColorSchemeCategory): Promise<ColorScheme[]> => {
    const response = await api.get<ApiResponse<CategorySchemesResponse>>(
      `/api/color-schemes/category/${category}`
    );
    return response.data.data.schemes;
  },
};
