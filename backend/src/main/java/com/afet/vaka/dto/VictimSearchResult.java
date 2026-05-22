package com.afet.vaka.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VictimSearchResult {
    private DtoVictim victim;
    private Double matchScore; // Percentage of criteria matched (e.g., 85.5)
    private Integer matchedCriteriaCount;
    private Integer totalProvidedCriteriaCount;
}
