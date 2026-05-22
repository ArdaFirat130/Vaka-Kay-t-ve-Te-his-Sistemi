package com.afet.vaka.service.impl;

import com.afet.vaka.dto.SendOtpRequest;
import com.afet.vaka.dto.VerifyOtpRequest;
import com.afet.vaka.exception.BaseException;
import com.afet.vaka.exception.ErrorMessage;
import com.afet.vaka.exception.MessageType;
import com.afet.vaka.jwt.JwtUtils;
import com.afet.vaka.model.RelativeSession;
import com.afet.vaka.repository.RelativeSessionRepository;
import com.afet.vaka.service.IOtpService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpServiceImpl implements IOtpService {

    private static final Logger logger = LoggerFactory.getLogger(OtpServiceImpl.class);
    private static final int OTP_EXPIRATION_MINUTES = 3;

    @Autowired
    private RelativeSessionRepository relativeSessionRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    public void sendOtp(SendOtpRequest request) {
        String phoneHash = hashData(request.getPhoneNumber());
        String nationalIdHash = hashData(request.getNationalId());

        Optional<RelativeSession> existingSession = relativeSessionRepository.findByNationalIdHashAndPhoneHash(nationalIdHash, phoneHash);
        RelativeSession session = existingSession.orElseGet(() -> RelativeSession.builder()
                .phoneHash(phoneHash)
                .nationalIdHash(nationalIdHash)
                .fullName(request.getFullName())
                .relationship(request.getRelationship())
                .build());

        String otpCode = generateOtp();
        session.setOtpCode(otpCode); // In production, consider hashing the OTP code as well
        session.setOtpExpiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRATION_MINUTES));
        
        // Simulating SMS sending
        logger.info("================================================");
        logger.info("SMS SIMULATION");
        logger.info("To: {}", request.getPhoneNumber());
        logger.info("Message: Vaka Kayit ve Teshis Sistemi giris kodunuz: {}", otpCode);
        logger.info("================================================");

        relativeSessionRepository.save(session);
    }

    @Override
    public String verifyOtp(VerifyOtpRequest request) {
        String phoneHash = hashData(request.getPhoneNumber());
        String nationalIdHash = hashData(request.getNationalId());

        RelativeSession session = relativeSessionRepository.findByNationalIdHashAndPhoneHash(nationalIdHash, phoneHash)
                .orElseThrow(() -> new BaseException(new ErrorMessage(MessageType.NO_RECORD_EXIST, "Geçerli bir OTP isteği bulunamadı.")));

        if (session.getOtpExpiresAt() == null || session.getOtpExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BaseException(new ErrorMessage(MessageType.UNAUTHORIZED, "OTP kodunun süresi dolmuş."));
        }

        if (!request.getOtpCode().equals(session.getOtpCode())) {
            throw new BaseException(new ErrorMessage(MessageType.UNAUTHORIZED, "Geçersiz OTP kodu."));
        }

        // Successfully verified, clear OTP to prevent reuse and issue JWT
        session.setOtpCode(null);
        session.setOtpExpiresAt(null);
        relativeSessionRepository.save(session);

        return jwtUtils.generateRelativeToken(session.getId().toString());
    }

    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // 6 digit OTP
        return String.valueOf(otp);
    }

    private String hashData(String data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Hash algoritması bulunamadı", e);
        }
    }
}
