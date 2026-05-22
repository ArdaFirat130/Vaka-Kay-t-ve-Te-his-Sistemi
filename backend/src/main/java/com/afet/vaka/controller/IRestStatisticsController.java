package com.afet.vaka.controller;

import com.afet.vaka.dto.DtoFacilityStats;

public interface IRestStatisticsController {
    public RootEntity<DtoFacilityStats> getMyFacilityStatistics();
}
