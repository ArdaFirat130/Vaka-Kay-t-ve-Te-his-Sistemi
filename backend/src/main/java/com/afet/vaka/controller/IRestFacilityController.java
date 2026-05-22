package com.afet.vaka.controller;

import com.afet.vaka.dto.DtoFacility;
import com.afet.vaka.dto.DtoFacilityIU;

import java.util.UUID;

public interface IRestFacilityController {
    public RootEntity<DtoFacility> createFacility(DtoFacilityIU input);
    public RootEntity<DtoFacility> updateFacility(UUID id, DtoFacilityIU input);
    public RootEntity<DtoFacility> getFacilityById(UUID id);
    public RootEntity<java.util.List<DtoFacility>> getAllFacilities();
}
