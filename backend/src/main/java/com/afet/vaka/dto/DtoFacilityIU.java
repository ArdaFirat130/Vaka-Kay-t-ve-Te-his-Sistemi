package com.afet.vaka.dto;

import com.afet.vaka.model.enums.FacilityType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class DtoFacilityIU {

    @NotBlank(message = "Tesis adı boş bırakılamaz")
    private String name;

    @NotNull(message = "Tesis tipi boş bırakılamaz")
    private FacilityType type;

    private String address;
    private Map<String, Object> coordinates;
    private Map<String, Object> contactInfo;
}
