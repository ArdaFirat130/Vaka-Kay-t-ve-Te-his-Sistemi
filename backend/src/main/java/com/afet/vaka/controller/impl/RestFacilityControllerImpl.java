package com.afet.vaka.controller.impl;

import com.afet.vaka.controller.IRestFacilityController;
import com.afet.vaka.controller.RootEntity;
import com.afet.vaka.dto.DtoFacility;
import com.afet.vaka.dto.DtoFacilityIU;
import com.afet.vaka.service.IFacilityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/facilities")
public class RestFacilityControllerImpl implements IRestFacilityController {

    @Autowired
    private IFacilityService facilityService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public RootEntity<DtoFacility> createFacility(@Valid @RequestBody DtoFacilityIU input) {
        return RootEntity.ok(facilityService.createFacility(input));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public RootEntity<DtoFacility> updateFacility(@PathVariable UUID id, @Valid @RequestBody DtoFacilityIU input) {
        return RootEntity.ok(facilityService.updateFacility(id, input));
    }

    @GetMapping("/{id}")
    @Override
    public RootEntity<DtoFacility> getFacilityById(@PathVariable UUID id) {
        return RootEntity.ok(facilityService.getFacilityById(id));
    }

    @GetMapping
    @Override
    public RootEntity<List<DtoFacility>> getAllFacilities() {
        return RootEntity.ok(facilityService.getAllFacilities());
    }
}
