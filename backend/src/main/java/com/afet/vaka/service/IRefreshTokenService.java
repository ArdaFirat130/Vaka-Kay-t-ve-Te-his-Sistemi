package com.afet.vaka.service;

import com.afet.vaka.model.RefreshToken;

import java.util.Optional;
import java.util.UUID;

public interface IRefreshTokenService {
    Optional<RefreshToken> findByToken(String token);
    RefreshToken createRefreshToken(UUID userId);
    RefreshToken verifyExpiration(RefreshToken token);
    int deleteByUserId(UUID userId);
}
