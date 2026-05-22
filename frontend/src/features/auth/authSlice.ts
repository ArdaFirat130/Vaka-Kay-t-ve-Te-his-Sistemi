import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService, type LoginPayload, type RelativeOtpPayload, type RelativeVerifyPayload } from './services/authService';

// Basic JWT Decode logic (Not 100% secure for validation, but enough to extract claims on frontend)
const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  role: string | null;
  email: string | null;
  facilityId: string | null;
  isLoading: boolean;
  error: string | null;
  otpSent: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  role: null,
  email: null,
  facilityId: null,
  isLoading: false,
  error: null,
  otpSent: false,
};

// Initialize state from token if exists
if (initialState.token) {
  const decoded = decodeToken(initialState.token);
  if (decoded) {
    initialState.role = decoded.role || (decoded.type === 'RELATIVE' ? 'ROLE_RELATIVE' : 'ROLE_PERSONNEL');
    initialState.email = decoded.sub;
    // Real implementation should extract roles/facilityId from token properly
  }
}

export const loginPersonnel = createAsyncThunk(
  'auth/loginPersonnel',
  async (payload: LoginPayload, thunkAPI) => {
    try {
      return await authService.loginPersonnel(payload);
    } catch (error: any) {
      const apiError = error.response?.data?.errors;
      let message = 'Giriş başarısız';
      
      if (Array.isArray(apiError)) {
         message = apiError[0]?.message || message;
      } else if (apiError?.message) {
         message = apiError.message;
      } else if (error.message) {
         message = error.message;
      }
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (payload: RelativeOtpPayload, thunkAPI) => {
    try {
      return await authService.sendRelativeOtp(payload);
    } catch (error: any) {
      const apiError = error.response?.data?.errors;
      let message = 'OTP gönderilemedi';
      
      if (Array.isArray(apiError)) {
         message = apiError[0]?.message || message;
      } else if (apiError?.message) {
         message = apiError.message;
      } else if (error.message) {
         message = error.message;
      }
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (payload: RelativeVerifyPayload, thunkAPI) => {
    try {
      return await authService.verifyRelativeOtp(payload);
    } catch (error: any) {
      const apiError = error.response?.data?.errors;
      let message = 'OTP doğrulanamadı';
      
      if (Array.isArray(apiError)) {
         message = apiError[0]?.message || message;
      } else if (apiError?.message) {
         message = apiError.message;
      } else if (error.message) {
         message = error.message;
      }
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;
      state.email = null;
      state.facilityId = null;
      state.otpSent = false;
    },
    resetError: (state) => {
      state.error = null;
    },
    resetOtpState: (state) => {
      state.otpSent = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Personnel Login
    builder.addCase(loginPersonnel.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginPersonnel.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      
      const decoded = decodeToken(action.payload.token);
      if(decoded) state.role = decoded.role || 'ROLE_PERSONNEL';
    });
    builder.addCase(loginPersonnel.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Send OTP
    builder.addCase(sendOtp.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(sendOtp.fulfilled, (state) => {
      state.isLoading = false;
      state.otpSent = true;
    });
    builder.addCase(sendOtp.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Verify OTP
    builder.addCase(verifyOtp.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(verifyOtp.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      state.role = 'ROLE_RELATIVE';
    });
    builder.addCase(verifyOtp.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { logout, resetError, resetOtpState } = authSlice.actions;
export default authSlice.reducer;
