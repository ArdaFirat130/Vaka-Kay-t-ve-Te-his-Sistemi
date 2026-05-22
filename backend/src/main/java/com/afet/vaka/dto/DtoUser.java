package com.afet.vaka.dto;

import com.afet.vaka.model.enums.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
public class DtoUser {
    private UUID id;
    private String email;
    private Role role;
    private DtoFacility facility;
}
