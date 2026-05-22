package com.afet.vaka.service;

import com.afet.vaka.dto.DtoFacilityStats;
import java.util.UUID;

public interface IStatisticsService {
    DtoFacilityStats getFacilityStatistics(UUID facilityId);
}
