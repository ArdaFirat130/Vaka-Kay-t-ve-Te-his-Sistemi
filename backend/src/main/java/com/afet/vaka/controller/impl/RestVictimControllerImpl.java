package com.afet.vaka.controller.impl;

import com.afet.vaka.controller.IRestVictimController;
import com.afet.vaka.controller.RootEntity;
import com.afet.vaka.dto.DtoVictim;
import com.afet.vaka.dto.DtoVictimIU;
import com.afet.vaka.dto.VictimSearchCriteria;
import com.afet.vaka.dto.VictimSearchResult;
import com.afet.vaka.service.IVictimService;
import com.afet.vaka.service.impl.UserServiceImpl.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/victims")
public class RestVictimControllerImpl implements IRestVictimController {

    @Autowired
    private IVictimService victimService;

    @PostMapping
    @PreAuthorize("hasRole('PERSONNEL') or hasRole('SUPER_ADMIN') or hasRole('FACILITY_ADMIN')")
    @Override
    public RootEntity<DtoVictim> createVictim(@Valid @RequestBody DtoVictimIU input) {
        UserDetailsImpl currentUser = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return RootEntity.ok(victimService.createVictim(input, currentUser));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PERSONNEL') or hasRole('SUPER_ADMIN') or hasRole('FACILITY_ADMIN')")
    @Override
    public RootEntity<DtoVictim> updateVictim(@PathVariable UUID id, @Valid @RequestBody DtoVictimIU input) {
        UserDetailsImpl currentUser = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return RootEntity.ok(victimService.updateVictim(id, input, currentUser));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('PERSONNEL') or hasRole('SUPER_ADMIN') or hasRole('FACILITY_ADMIN')")
    @Override
    public RootEntity<DtoVictim> getVictimById(@PathVariable UUID id) {
        UserDetailsImpl currentUser = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return RootEntity.ok(victimService.getVictimById(id, currentUser));
    }

    @GetMapping("/facility/{facilityId}")
    @PreAuthorize("hasRole('PERSONNEL') or hasRole('SUPER_ADMIN') or hasRole('FACILITY_ADMIN')")
    @Override
    public RootEntity<List<DtoVictim>> getVictimsByFacility(@PathVariable UUID facilityId) {
        UserDetailsImpl currentUser = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return RootEntity.ok(victimService.getVictimsByFacility(facilityId, currentUser));
    }

    @GetMapping("/facility/my")
    @PreAuthorize("hasRole('PERSONNEL') or hasRole('SUPER_ADMIN') or hasRole('FACILITY_ADMIN')")
    public RootEntity<List<DtoVictim>> getMyFacilityVictims() {
        UserDetailsImpl currentUser = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (currentUser.getFacilityId() == null) {
            throw new RuntimeException("Kullanıcının bağlı olduğu bir tesis bulunamadı.");
        }
        return RootEntity.ok(victimService.getVictimsByFacility(currentUser.getFacilityId(), currentUser));
    }

    @PostMapping("/search")
    @PreAuthorize("hasRole('RELATIVE') or hasRole('SUPER_ADMIN')")
    @Override
    public RootEntity<Page<VictimSearchResult>> searchVictims(@RequestBody VictimSearchCriteria criteria, Pageable pageable) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String currentUserId;
        if (principal instanceof UserDetailsImpl) {
            currentUserId = ((UserDetailsImpl) principal).getId().toString();
        } else if (principal instanceof String) {
            currentUserId = (String) principal;
        } else {
            throw new RuntimeException("Geçersiz kullanıcı oturumu.");
        }
        return RootEntity.ok(victimService.searchVictims(criteria, pageable, currentUserId));
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasRole('PERSONNEL') or hasRole('SUPER_ADMIN') or hasRole('FACILITY_ADMIN')")
    @Override
    public RootEntity<Void> resolveVictim(@PathVariable UUID id) {
        UserDetailsImpl currentUser = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        victimService.resolveVictim(id, currentUser);
        return RootEntity.ok(null);
    }
}
