package com.afet.vaka.service;

import com.afet.vaka.dto.AuthRequest;
import com.afet.vaka.dto.AuthResponse;

public interface IAuthenticationService {
    
    public AuthResponse authenticate(AuthRequest input, String clientIp);
    
}
