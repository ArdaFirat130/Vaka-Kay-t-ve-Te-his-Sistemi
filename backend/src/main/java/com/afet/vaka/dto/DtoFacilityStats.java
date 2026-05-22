package com.afet.vaka.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DtoFacilityStats {
    private long totalVictims;
    private long activeVictims;
    private long resolvedVictims;
    private long recentVictimsLast7Days;
    
    private Map<String, Long> genderDistribution;
    private Map<String, Long> healthStatusDistribution;
    private Map<String, Long> ageGroupDistribution;
}
