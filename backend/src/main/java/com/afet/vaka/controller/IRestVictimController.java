package com.afet.vaka.controller;

import com.afet.vaka.dto.DtoVictim;
import com.afet.vaka.dto.DtoVictimIU;
import com.afet.vaka.dto.VictimSearchCriteria;
import com.afet.vaka.dto.VictimSearchResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface IRestVictimController {
    public RootEntity<DtoVictim> createVictim(DtoVictimIU input);
    public RootEntity<DtoVictim> updateVictim(UUID id, DtoVictimIU input);
    public RootEntity<DtoVictim> getVictimById(UUID id);
    public RootEntity<java.util.List<DtoVictim>> getVictimsByFacility(UUID facilityId);
    public RootEntity<Page<VictimSearchResult>> searchVictims(VictimSearchCriteria criteria, Pageable pageable);
    public RootEntity<Void> resolveVictim(UUID id);
}
