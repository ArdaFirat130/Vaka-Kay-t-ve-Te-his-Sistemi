package com.afet.vaka.dto;

import com.afet.vaka.model.enums.Relationship;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendOtpRequest {

    @NotBlank(message = "T.C. Kimlik numarası boş olamaz")
    private String nationalId;

    @NotBlank(message = "Telefon numarası boş olamaz")
    private String phoneNumber;

    @NotBlank(message = "Ad ve Soyad boş olamaz")
    private String fullName;

    @NotNull(message = "Yakınlık derecesi belirtilmelidir")
    private Relationship relationship;
}
