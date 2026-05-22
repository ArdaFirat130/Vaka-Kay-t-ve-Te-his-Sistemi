package com.afet.vaka.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
public class AuthResponse {
    private String token;
    private UUID userId;
    private String refreshToken;
    private String email;
    private String role;
    private UUID facilityId;
}
