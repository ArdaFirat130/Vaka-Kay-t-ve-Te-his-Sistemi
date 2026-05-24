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
import com.afet.vaka.repository.UserRepository;
import com.afet.vaka.repository.PasswordResetTokenRepository;
import com.afet.vaka.model.PasswordResetToken;
import com.afet.vaka.model.User;
import com.afet.vaka.service.IEmailService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.UUID;

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

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private IEmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

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

    @Override
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı."));

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .isUsed(false)
                .build();

        passwordResetTokenRepository.save(resetToken);
        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Geçersiz veya süresi dolmuş bağlantı."));

        if (resetToken.isUsed()) {
            throw new RuntimeException("Bu bağlantı daha önce kullanılmış.");
        }

        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Bu bağlantının süresi dolmuş.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }
}
