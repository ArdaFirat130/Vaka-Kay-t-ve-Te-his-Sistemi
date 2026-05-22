import api from '../../../services/api';

export interface LoginPayload {
  email: string;
  password?: string; // Optional if using DTO but required for personnel
}

export interface RelativeOtpPayload {
  nationalId: string;
  phoneNumber: string;
  fullName: string;
  relationship: string;
}

export interface RelativeVerifyPayload {
  nationalId: string;
  phoneNumber: string;
  otpCode: string;
}

export interface AuthResponse {
  token: string;
}

const loginPersonnel = async (payload: LoginPayload) => {
  const response = await api.post('/auth/login', payload);
  // Backend wraps in RootEntity: { payload: { token: '...' }, status: 200, ... }
  return response.data.payload as AuthResponse;
};

const sendRelativeOtp = async (payload: RelativeOtpPayload) => {
  const response = await api.post('/auth/relative/send-otp', payload);
  return response.data; // Usually just OK message
};

const verifyRelativeOtp = async (payload: RelativeVerifyPayload) => {
  const response = await api.post('/auth/relative/verify-otp', payload);
  return { token: response.data.payload } as AuthResponse;
};

export const authService = {
  loginPersonnel,
  sendRelativeOtp,
  verifyRelativeOtp,
};
