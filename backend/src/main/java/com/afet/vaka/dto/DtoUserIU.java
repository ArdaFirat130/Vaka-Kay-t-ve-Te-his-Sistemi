package com.afet.vaka.dto;

import com.afet.vaka.model.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class DtoUserIU {

    @NotBlank(message = "E-posta zorunludur")
    @Email(message = "Geçerli bir e-posta giriniz")
    private String email;

    @NotBlank(message = "Şifre zorunludur")
    private String password;

    @NotNull(message = "Rol zorunludur")
    private Role role;

    private UUID facilityId;
}
