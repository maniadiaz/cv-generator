// User Types
export interface User {
  id: number;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  is_active: boolean;
  is_verified: boolean;
  is_premium: boolean;
  last_login: string;
  login_attempts: number;
  locked_until: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Profile Types
export interface PersonalInfo {
  id?: number;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  professional_title?: string;
  summary?: string;
}

export interface Experience {
  id: number;
  project_title: string;
  position: string;
  company: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  achievements?: string;
  technologies?: string;
  is_visible?: boolean;
  display_order?: number;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  gpa?: string;
  description?: string;
  is_visible?: boolean;
  display_order?: number;
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';

export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency_level: SkillLevel;
  years_of_experience?: number;
  is_visible?: boolean;
  display_order?: number;
}

export type LanguageLevel = 'basic' | 'intermediate' | 'advanced' | 'fluent' | 'native';

export interface Language {
  id: number;
  name: string;
  proficiency_level: LanguageLevel;
  certification_name?: string;
  certification_score?: string;
  is_visible?: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Certificate {
  id: number;
  name: string;
  issuing_organization: string;
  issue_date: string;
  expiration_date?: string;
  credential_id?: string;
  credential_url?: string;
  is_visible?: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
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

export interface SocialNetwork {
  id: number;
  platform: SocialPlatform;
  url: string;
  username?: string;
  is_visible?: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

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

export interface ValidationWarning {
  section: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export interface ValidationResult {
  isValid: boolean;
  completeness: number;
  hasPersonalInfo: boolean;
  warnings: ValidationWarning[];
}

// Color Scheme Types
export type ColorSchemeCategory = 'classic' | 'corporate' | 'modern' | 'creative';

export interface ColorSchemeColors {
  primary: string;
  text: string;
  accent: string;
  headerBg: string;
  headerText: string;
}

export interface ColorSchemePreview {
  primary: string;
  secondary: string;
  accent: string;
}

export interface ColorScheme {
  id: string;
  name: string;
  description: string;
  category: ColorSchemeCategory;
  colors: ColorSchemeColors;
  preview: ColorSchemePreview;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
  current: boolean;
  url?: string;
  github?: string;
}

export interface CVProfile {
  id: number;
  user_id: number;
  name: string;
  slug: string;
  template: string;
  color_scheme?: string;
  is_default: boolean;
  completion_percentage: number;
  download_count: number;
  last_exported_at: string | null;
  created_at: string;
  updated_at: string;
  personalInfo?: PersonalInfo;
  experience?: Experience[];
  education?: Education[];
  skills?: Skill[];
  languages?: Language[];
  certificates?: Certificate[];
  socialNetworks?: SocialNetwork[];
  projects?: Project[];
}

export interface ProfileState {
  profiles: CVProfile[];
  currentProfile: CVProfile | null;
  loading: boolean;
  error: string | null;
  stats: {
    total: number;
    default_profile_id: number | null;
    most_downloaded: CVProfile | null;
  } | null;
}

// Theme Types
export type ThemeMode = 'light' | 'dark';

export interface ThemeState {
  mode: ThemeMode;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// App Types
export interface AppState {
  loading: boolean;
  error: string | null;
  language: 'es' | 'en';
}
