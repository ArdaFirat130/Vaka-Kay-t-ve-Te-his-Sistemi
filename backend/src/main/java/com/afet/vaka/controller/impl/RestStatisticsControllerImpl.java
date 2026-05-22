package com.afet.vaka.controller.impl;

import com.afet.vaka.controller.IRestStatisticsController;
import com.afet.vaka.controller.RootEntity;
import com.afet.vaka.dto.DtoFacilityStats;
import com.afet.vaka.service.IStatisticsService;
import com.afet.vaka.service.impl.UserServiceImpl.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/statistics")
public class RestStatisticsControllerImpl implements IRestStatisticsController {

    @Autowired
    private IStatisticsService statisticsService;

    @GetMapping("/facility/my")
    @PreAuthorize("hasRole('FACILITY_ADMIN') or hasRole('SUPER_ADMIN')")
    @Override
    public RootEntity<DtoFacilityStats> getMyFacilityStatistics() {
        UserDetailsImpl currentUser = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (currentUser.getFacilityId() == null) {
            throw new RuntimeException("Kullanıcının bağlı olduğu bir tesis bulunamadı.");
        }
        return RootEntity.ok(statisticsService.getFacilityStatistics(currentUser.getFacilityId()));
    }
}
