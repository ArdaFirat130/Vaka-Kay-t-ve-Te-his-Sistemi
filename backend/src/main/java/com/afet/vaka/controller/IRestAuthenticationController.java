package com.afet.vaka.controller;

import com.afet.vaka.dto.AuthRequest;
import com.afet.vaka.dto.AuthResponse;
import com.afet.vaka.dto.SendOtpRequest;
import com.afet.vaka.dto.TokenRefreshRequest;
import com.afet.vaka.dto.VerifyOtpRequest;
import jakarta.servlet.http.HttpServletRequest;

public interface IRestAuthenticationController {
    public RootEntity<AuthResponse> authenticate(AuthRequest input, HttpServletRequest request);
    public RootEntity<AuthResponse> refreshToken(TokenRefreshRequest request);
    public RootEntity<Void> sendOtp(SendOtpRequest request);
    public RootEntity<String> verifyOtp(VerifyOtpRequest request);
    public RootEntity<String> forgotPassword(java.util.Map<String, String> request);
    public RootEntity<String> resetPassword(java.util.Map<String, String> request);
}
