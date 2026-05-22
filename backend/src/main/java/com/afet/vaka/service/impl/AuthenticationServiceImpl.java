package com.afet.vaka.service.impl;

import com.afet.vaka.dto.AuthRequest;
import com.afet.vaka.dto.AuthResponse;
import com.afet.vaka.jwt.JwtUtils;
import com.afet.vaka.service.IAuthenticationService;
import com.afet.vaka.service.IRefreshTokenService;
import com.afet.vaka.model.RefreshToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.afet.vaka.service.impl.UserServiceImpl.UserDetailsImpl;

@Service
public class AuthenticationServiceImpl implements IAuthenticationService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private LoginAttemptService loginAttemptService;

    @Autowired
    private IRefreshTokenService refreshTokenService;

    @Override
    public AuthResponse authenticate(AuthRequest input, String clientIp) {
        if (loginAttemptService.isBlocked(clientIp)) {
            throw new RuntimeException("Çok fazla başarısız deneme yaptınız. Lütfen daha sonra tekrar deneyin.");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(input.getEmail(), input.getPassword()));

            String jwt = jwtUtils.generateJwtToken(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            loginAttemptService.loginSucceeded(clientIp);

            // Refresh Token oluştur/güncelle
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());

            return AuthResponse.builder()
                    .token(jwt)
                    .refreshToken(refreshToken.getToken())
                    .userId(userDetails.getId())
                    .email(userDetails.getEmail())
                    .role(userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", ""))
                    .facilityId(userDetails.getFacilityId())
                    .build();
        } catch (org.springframework.security.core.AuthenticationException e) {
            loginAttemptService.loginFailed(clientIp);
            throw new RuntimeException("E-posta veya şifre hatalı");
        }
    }
}
