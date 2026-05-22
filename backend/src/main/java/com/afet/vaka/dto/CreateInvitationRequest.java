package com.afet.vaka.dto;

import com.afet.vaka.model.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateInvitationRequest {
    @NotNull(message = "E-posta adresi boş olamaz")
    @Email(message = "Geçerli bir e-posta adresi giriniz")
    private String email;

    private UUID facilityId;

    @NotNull(message = "Hedef rol boş olamaz")
    private Role targetRole;
}
