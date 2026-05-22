package com.afet.vaka.service;

import com.afet.vaka.dto.DtoFacility;
import com.afet.vaka.dto.DtoFacilityIU;

import java.util.List;
import java.util.UUID;

public interface IFacilityService {
    
    public DtoFacility createFacility(DtoFacilityIU input);
    
    public DtoFacility updateFacility(UUID id, DtoFacilityIU input);
    
    public DtoFacility getFacilityById(UUID id);
    
    public List<DtoFacility> getAllFacilities();
    
}
