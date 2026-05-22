package com.afet.vaka.service.impl;

import com.afet.vaka.dto.DtoFacility;
import com.afet.vaka.dto.DtoFacilityIU;
import com.afet.vaka.model.Facility;
import com.afet.vaka.repository.FacilityRepository;
import com.afet.vaka.service.IFacilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FacilityServiceImpl implements IFacilityService {

    @Autowired
    private FacilityRepository facilityRepository;

    @Override
    @Transactional
    public DtoFacility createFacility(DtoFacilityIU input) {
        Facility facility = Facility.builder()
                .name(input.getName())
                .type(input.getType())
                .address(input.getAddress())
                .coordinates(input.getCoordinates())
                .contactInfo(input.getContactInfo())
                .build();

        Facility saved = facilityRepository.save(facility);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public DtoFacility updateFacility(UUID id, DtoFacilityIU input) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tesis bulunamadı"));

        facility.setName(input.getName());
        facility.setType(input.getType());
        facility.setAddress(input.getAddress());
        facility.setCoordinates(input.getCoordinates());
        facility.setContactInfo(input.getContactInfo());

        return mapToDto(facilityRepository.save(facility));
    }

    @Override
    public DtoFacility getFacilityById(UUID id) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tesis bulunamadı"));
        return mapToDto(facility);
    }

    @Override
    public List<DtoFacility> getAllFacilities() {
        return facilityRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private DtoFacility mapToDto(Facility facility) {
        return DtoFacility.builder()
                .id(facility.getId())
                .name(facility.getName())
                .type(facility.getType())
                .address(facility.getAddress())
                .coordinates(facility.getCoordinates())
                .contactInfo(facility.getContactInfo())
                .createdAt(facility.getCreatedAt())
                .build();
    }
}
