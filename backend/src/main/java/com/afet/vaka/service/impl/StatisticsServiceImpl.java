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
        long activeVictims = 0;
        long resolvedVictims = 0;
        long recentVictims = 0;

        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);

        Map<String, Long> genderDistribution = new java.util.HashMap<>();
        Map<String, Long> healthStatusDistribution = new java.util.HashMap<>();
        Map<String, Long> ageGroupDistribution = new java.util.HashMap<>();

        // Tüm listeyi tek bir döngüde dönerek bütün hesaplamaları yapıyoruz
        for (Victim v : victims) {
            // Aktif / Çözülmüş sayımı
            if (!v.isResolved()) {
                activeVictims++;
            } else {
                resolvedVictims++;
            }

            // Son 7 gün sayımı
            if (v.getRecordedAt() != null && v.getRecordedAt().isAfter(sevenDaysAgo)) {
                recentVictims++;
            }

            // Cinsiyet dağılımı
            String genderKey = v.getGender() != null ? v.getGender().name() : "UNKNOWN";
            genderDistribution.put(genderKey, genderDistribution.getOrDefault(genderKey, 0L) + 1L);

            // Sağlık durumu dağılımı
            String healthKey = v.getHealthStatus() != null ? v.getHealthStatus().name() : "UNKNOWN";
            healthStatusDistribution.put(healthKey, healthStatusDistribution.getOrDefault(healthKey, 0L) + 1L);

            // Yaş grubu dağılımı
            String ageKey = v.getAgeGroup() != null ? v.getAgeGroup().name() : "UNKNOWN";
            ageGroupDistribution.put(ageKey, ageGroupDistribution.getOrDefault(ageKey, 0L) + 1L);
        }

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
