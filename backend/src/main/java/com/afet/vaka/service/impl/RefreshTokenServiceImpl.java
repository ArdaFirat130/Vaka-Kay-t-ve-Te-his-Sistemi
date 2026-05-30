package com.afet.vaka.service.impl;

import com.afet.vaka.exception.BaseException;
import com.afet.vaka.exception.ErrorMessage;
import com.afet.vaka.exception.MessageType;
import com.afet.vaka.model.RefreshToken;
import com.afet.vaka.repository.RefreshTokenRepository;
import com.afet.vaka.repository.UserRepository;
import com.afet.vaka.service.IRefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenServiceImpl implements IRefreshTokenService {

    @Value("${afet.vaka.jwtRefreshExpirationMs:604800000}") // Default: 7 days
    private Long refreshTokenDurationMs;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Override
    @Transactional
    public RefreshToken createRefreshToken(UUID userId) {
        RefreshToken refreshToken = new RefreshToken();

        Optional<com.afet.vaka.model.User> userOpt = userRepository.findById(userId);
        
        if (!userOpt.isPresent()) {
            throw new BaseException(new ErrorMessage(MessageType.NO_RECORD_EXIST, "Kullanıcı bulunamadı"));
        }
        
        refreshToken.setUser(userOpt.get());
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        refreshToken.setToken(UUID.randomUUID().toString());

        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken;
    }

    @Override
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new BaseException(new ErrorMessage(MessageType.UNAUTHORIZED, "Refresh token süresi dolmuş. Lütfen tekrar giriş yapın."));
        }
        return token;
    }

    @Override
    @Transactional
    public int deleteByUserId(UUID userId) {
        Optional<com.afet.vaka.model.User> userOpt = userRepository.findById(userId);
        
        if (!userOpt.isPresent()) {
            throw new BaseException(new ErrorMessage(MessageType.NO_RECORD_EXIST, "Kullanıcı bulunamadı"));
        }
        
        return refreshTokenRepository.deleteByUser(userOpt.get());
    }
}
