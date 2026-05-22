package com.afet.vaka.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AcceptInvitationRequest {
    @NotBlank(message = "Token boş olamaz")
    private String token;

    @NotBlank(message = "Şifre boş olamaz")
    private String password;
}
