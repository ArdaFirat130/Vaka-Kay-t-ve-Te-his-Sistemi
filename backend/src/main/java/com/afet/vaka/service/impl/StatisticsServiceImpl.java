package com.afet.vaka.service.impl;

import com.afet.vaka.dto.DtoFacilityStats;
import com.afet.vaka.model.Victim;
import com.afet.vaka.repository.VictimRepository;
import com.afet.vaka.service.IStatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class StatisticsServiceImpl implements IStatisticsService {

    @Autowired
    private VictimRepository victimRepository;

    @Override
    public DtoFacilityStats getFacilityStatistics(UUID facilityId) {
        List<Victim> victims = victimRepository.findByFacilityId(facilityId);

        long totalVictims = victims.size();
        long activeVictims = victims.stream().filter(v -> !v.isResolved()).count();
        long resolvedVictims = victims.stream().filter(Victim::isResolved).count();

        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        long recentVictims = victims.stream()
                .filter(v -> v.getRecordedAt() != null && v.getRecordedAt().isAfter(sevenDaysAgo))
                .count();

        Map<String, Long> genderDistribution = victims.stream()
                .collect(Collectors.groupingBy(
                        v -> v.getGender() != null ? v.getGender().name() : "UNKNOWN",
                        Collectors.counting()
                ));

        Map<String, Long> healthStatusDistribution = victims.stream()
                .collect(Collectors.groupingBy(
                        v -> v.getHealthStatus() != null ? v.getHealthStatus().name() : "UNKNOWN",
                        Collectors.counting()
                ));

        Map<String, Long> ageGroupDistribution = victims.stream()
                .collect(Collectors.groupingBy(
                        v -> v.getAgeGroup() != null ? v.getAgeGroup().name() : "UNKNOWN",
                        Collectors.counting()
                ));

        return DtoFacilityStats.builder()
                .totalVictims(totalVictims)
                .activeVictims(activeVictims)
                .resolvedVictims(resolvedVictims)
                .recentVictimsLast7Days(recentVictims)
                .genderDistribution(genderDistribution)
                .healthStatusDistribution(healthStatusDistribution)
                .ageGroupDistribution(ageGroupDistribution)
                .build();
    }
}
