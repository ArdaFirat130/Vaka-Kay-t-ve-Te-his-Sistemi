package com.afet.vaka.dto;

import com.afet.vaka.model.enums.FacilityType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Getter
@Setter
@Builder
public class DtoFacility {
    private UUID id;
    private String name;
    private FacilityType type;
    private String address;
    private Map<String, Object> coordinates;
    private Map<String, Object> contactInfo;
    private LocalDateTime createdAt;
}
