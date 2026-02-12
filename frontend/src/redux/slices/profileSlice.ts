import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CVProfile, ProfileState } from '@app-types/index';
import { profileService } from '@api/profileService';

const initialState: ProfileState = {
  profiles: [],
  currentProfile: null,
  loading: false,
  error: null,
  stats: null,
};

// Async thunks
export const fetchProfiles = createAsyncThunk(
  'profile/fetchProfiles',
  async (_, { rejectWithValue }) => {
    try {
      const profiles = await profileService.getProfiles();
      return profiles;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar perfiles');
    }
  }
);

export const fetchProfileById = createAsyncThunk(
  'profile/fetchProfileById',
  async (id: number, { rejectWithValue }) => {
    try {
      const profile = await profileService.getProfileById(id);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar perfil');
    }
  }
);

export const createProfile = createAsyncThunk(
  'profile/createProfile',
  async (data: { name: string; template?: string }, { rejectWithValue }) => {
    try {
      const profile = await profileService.createProfile(data);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear perfil');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async ({ id, data }: { id: number; data: { name: string } }, { rejectWithValue }) => {
    try {
      const profile = await profileService.updateProfile(id, data);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar perfil');
    }
  }
);

export const deleteProfile = createAsyncThunk(
  'profile/deleteProfile',
  async (id: number, { rejectWithValue }) => {
    try {
      await profileService.deleteProfile(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar perfil');
    }
  }
);

export const setDefaultProfile = createAsyncThunk(
  'profile/setDefaultProfile',
  async (id: number, { rejectWithValue }) => {
    try {
      const profile = await profileService.setDefault(id);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al establecer perfil por defecto');
    }
  }
);

export const duplicateProfile = createAsyncThunk(
  'profile/duplicateProfile',
  async (id: number, { rejectWithValue }) => {
    try {
      const profile = await profileService.duplicateProfile(id);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al duplicar perfil');
    }
  }
);

export const fetchCompleteProfile = createAsyncThunk(
  'profile/fetchCompleteProfile',
  async (id: number, { rejectWithValue }) => {
    try {
      const profile = await profileService.getCompleteProfile(id);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar perfil completo');
    }
  }
);

export const fetchProfileStats = createAsyncThunk(
  'profile/fetchProfileStats',
  async (_, { rejectWithValue }) => {
    try {
      const stats = await profileService.getStats();
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar estadísticas');
    }
  }
);

export const updateProfileCompletion = createAsyncThunk(
  'profile/updateProfileCompletion',
  async (id: number, { rejectWithValue }) => {
    try {
      const completion = await profileService.getCompletion(id);
      return { id, completion_percentage: completion.completion_percentage };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar completitud');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setCurrentProfile: (state, action: PayloadAction<CVProfile | null>) => {
      state.currentProfile = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateCurrentProfile: (state, action: PayloadAction<Partial<CVProfile>>) => {
      if (state.currentProfile) {
        state.currentProfile = { ...state.currentProfile, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch profiles
    builder
      .addCase(fetchProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfiles.fulfilled, (state, action: PayloadAction<CVProfile[]>) => {
        state.loading = false;
        state.profiles = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.profiles = [];
      });

    // Fetch profile by ID
    builder
      .addCase(fetchProfileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileById.fulfilled, (state, action: PayloadAction<CVProfile>) => {
        state.loading = false;
        state.currentProfile = action.payload;
      })
      .addCase(fetchProfileById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create profile
    builder
      .addCase(createProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action: PayloadAction<CVProfile>) => {
        state.loading = false;
        state.profiles.push(action.payload);
        state.currentProfile = action.payload;
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<CVProfile>) => {
        state.loading = false;
        const index = state.profiles.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.profiles[index] = action.payload;
        }
        if (state.currentProfile?.id === action.payload.id) {
          state.currentProfile = action.payload;
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete profile
    builder
      .addCase(deleteProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProfile.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.profiles = state.profiles.filter((p) => p.id !== action.payload);
        if (state.currentProfile?.id === action.payload) {
          state.currentProfile = null;
        }
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Set default profile
    builder
      .addCase(setDefaultProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDefaultProfile.fulfilled, (state, action: PayloadAction<CVProfile>) => {
        state.loading = false;
        // Update all profiles to set is_default to false except the one being set as default
        state.profiles = state.profiles.map((p) => ({
          ...p,
          is_default: p.id === action.payload.id,
        }));
        if (state.currentProfile?.id === action.payload.id) {
          state.currentProfile = action.payload;
        }
      })
      .addCase(setDefaultProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Duplicate profile
    builder
      .addCase(duplicateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(duplicateProfile.fulfilled, (state, action: PayloadAction<CVProfile>) => {
        state.loading = false;
        state.profiles.push(action.payload);
      })
      .addCase(duplicateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch complete profile
    builder
      .addCase(fetchCompleteProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompleteProfile.fulfilled, (state, action: PayloadAction<CVProfile>) => {
        state.loading = false;
        state.currentProfile = action.payload;
      })
      .addCase(fetchCompleteProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch profile stats
    builder
      .addCase(fetchProfileStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchProfileStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update profile completion (no loading state to avoid flickering)
    builder
      .addCase(updateProfileCompletion.fulfilled, (state, action) => {
        if (state.currentProfile && state.currentProfile.id === action.payload.id) {
          // Only update if the value is a valid number
          if (typeof action.payload.completion_percentage === 'number') {
            state.currentProfile.completion_percentage = action.payload.completion_percentage;
          }
        }
      });
  },
});

export const { setCurrentProfile, clearError, updateCurrentProfile } = profileSlice.actions;
export default profileSlice.reducer;
