import api from './axios';
import type { ApiResponse } from '@app-types/index';

export type TemplateName = 'harvard_classic' | 'harvard_modern';

export interface Template {
  name: TemplateName;
  displayName: string;
  category: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  features: string[];
  previewImage: string;
}

export interface ValidationResult {
  isValid: boolean;
  completeness: number;
  hasPersonalInfo: boolean;
  warnings: Array<{
    section: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

interface TemplatesListResponse {
  templates: Template[];
}

interface PreviewHtmlResponse {
  html: string;
}

interface ValidationResponse {
  validation: ValidationResult;
}

export const templatesService = {
  // Get all available templates
  getTemplates: async (): Promise<Template[]> => {
    const response = await api.get<ApiResponse<TemplatesListResponse>>('/api/templates');
    return response.data.data.templates;
  },

  // Change profile template
  changeTemplate: async (profileId: number, templateName: TemplateName): Promise<void> => {
    const payload = { template: templateName };
    await api.patch(`/api/profiles/${profileId}/template`, payload);
  },

  // Get HTML preview
  getPreviewHtml: async (profileId: number): Promise<string> => {
    const response = await api.get<ApiResponse<PreviewHtmlResponse>>(
      `/api/profiles/${profileId}/preview-html`
    );
    return response.data.data.html;
  },

  // Validate profile for PDF export
  validateProfile: async (profileId: number): Promise<ValidationResult> => {
    const response = await api.get<ApiResponse<ValidationResponse>>(
      `/api/profiles/${profileId}/pdf/validate`
    );
    return response.data.data.validation;
  },

  // Export PDF (download)
  exportPDF: async (profileId: number): Promise<Blob> => {
    const response = await api.get(`/api/profiles/${profileId}/pdf/export-pdf`, {
      responseType: 'blob',
    });

    // Si es un blob, devolverlo directamente
    if (response.data instanceof Blob) {
      return response.data;
    }

    // Fallback: Si la respuesta es un objeto JSON con números como keys (backend antiguo)
    if (response.data && typeof response.data === 'object' && '0' in response.data) {
      const bytesArray = Object.values(response.data) as number[];
      const uint8Array = new Uint8Array(bytesArray);
      const blob = new Blob([uint8Array], { type: 'application/pdf' });
      return blob;
    }

    throw new Error('Invalid PDF response format');
  },

  // Preview PDF (inline)
  previewPDF: async (profileId: number): Promise<Blob> => {
    const response = await api.get(`/api/profiles/${profileId}/pdf/preview-pdf`, {
      responseType: 'blob',
    });

    // Si es un blob, devolverlo directamente
    if (response.data instanceof Blob) {
      return response.data;
    }

    // Fallback: Si la respuesta es un objeto JSON con números como keys (backend antiguo)
    if (response.data && typeof response.data === 'object' && '0' in response.data) {
      const bytesArray = Object.values(response.data) as number[];
      const uint8Array = new Uint8Array(bytesArray);
      const blob = new Blob([uint8Array], { type: 'application/pdf' });
      return blob;
    }

    throw new Error('Invalid PDF response format');
  },
};
