package com.afet.vaka.service;

import com.afet.vaka.dto.AuthRequest;
import com.afet.vaka.dto.AuthResponse;

public interface IAuthenticationService {
    
    AuthResponse authenticate(AuthRequest input, String clientIp);
    void forgotPassword(String email);
    void resetPassword(String token, String newPassword);
    
}
