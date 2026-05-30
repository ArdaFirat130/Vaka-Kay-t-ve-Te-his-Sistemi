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
    private Double matchScore;
    private Integer matchedCriteriaCount;
    private Integer totalProvidedCriteriaCount;
}
