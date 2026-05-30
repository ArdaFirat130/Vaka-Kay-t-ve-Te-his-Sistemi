package com.afet.vaka.controller.impl;

import com.afet.vaka.controller.IRestAuthenticationController;
import com.afet.vaka.controller.RootEntity;
import com.afet.vaka.dto.AuthRequest;
import com.afet.vaka.dto.AuthResponse;
import com.afet.vaka.dto.SendOtpRequest;
import com.afet.vaka.dto.TokenRefreshRequest;
import com.afet.vaka.dto.VerifyOtpRequest;
import com.afet.vaka.exception.BaseException;
import com.afet.vaka.exception.ErrorMessage;
import com.afet.vaka.exception.MessageType;
import com.afet.vaka.jwt.JwtUtils;
import com.afet.vaka.model.RefreshToken;
import com.afet.vaka.service.IAuthenticationService;
import com.afet.vaka.service.IOtpService;
import com.afet.vaka.service.IRefreshTokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/auth")
public class RestAuthenticationControllerImpl implements IRestAuthenticationController {

    @Autowired
    private IAuthenticationService authenticationService;

    @Autowired
    private IRefreshTokenService refreshTokenService;

    @Autowired
    private IOtpService otpService;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    @Override
    public RootEntity<AuthResponse> authenticate(@Valid @RequestBody AuthRequest input, HttpServletRequest request) {
        String clientIp = request.getRemoteAddr();
        AuthResponse response = authenticationService.authenticate(input, clientIp);
        return RootEntity.ok(response);
    }

    @PostMapping("/refresh-token")
    @Override
    public RootEntity<AuthResponse> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        // 1. Veritabanında token'ı ara
        java.util.Optional<RefreshToken> tokenOptional = refreshTokenService.findByToken(requestRefreshToken);

        // 2. Eğer token bulunamazsa hata fırlat
        if (!tokenOptional.isPresent()) {
            throw new BaseException(new ErrorMessage(MessageType.UNAUTHORIZED, "Refresh token geçersiz veya bulunamadı!"));
        }

        // 3. Token'ı al ve süresini kontrol et
        RefreshToken refreshToken = tokenOptional.get();
        RefreshToken validToken = refreshTokenService.verifyExpiration(refreshToken);

        // 4. Token kime aitse o kullanıcıyı al
        com.afet.vaka.model.User user = validToken.getUser();

        // 5. Yeni bir Access Token üret
        String token = jwtUtils.generateTokenFromUsername(user.getEmail());

        // 6. Yanıtı hazırla
        AuthResponse response = AuthResponse.builder()
                .token(token)
                .refreshToken(requestRefreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .facilityId(user.getFacility() != null ? user.getFacility().getId() : null)
                .build();

        return RootEntity.ok(response);
    }

    @PostMapping("/relative/send-otp")
    @Override
    public RootEntity<Void> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        otpService.sendOtp(request);
        return RootEntity.ok(null);
    }

    @PostMapping("/relative/verify-otp")
    @Override
    public RootEntity<String> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        String token = otpService.verifyOtp(request);
        return RootEntity.ok(token);
    }

    @PostMapping("/forgot-password")
    @Override
    public RootEntity<String> forgotPassword(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        authenticationService.forgotPassword(email);
        return RootEntity.ok("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
    }

    @PostMapping("/reset-password")
    @Override
    public RootEntity<String> resetPassword(@RequestBody java.util.Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");
        authenticationService.resetPassword(token, newPassword);
        return RootEntity.ok("Şifreniz başarıyla sıfırlandı.");
    }
}
