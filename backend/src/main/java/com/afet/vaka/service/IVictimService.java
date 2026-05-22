package com.afet.vaka.service;

import com.afet.vaka.dto.DtoVictim;
import com.afet.vaka.dto.DtoVictimIU;
import com.afet.vaka.dto.DtoVictimIU;
import com.afet.vaka.dto.VictimSearchCriteria;
import com.afet.vaka.dto.VictimSearchResult;
import com.afet.vaka.service.impl.UserServiceImpl.UserDetailsImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface IVictimService {
    
    public DtoVictim createVictim(DtoVictimIU input, UserDetailsImpl currentUser);
    
    public DtoVictim updateVictim(UUID id, DtoVictimIU input, UserDetailsImpl currentUser);
    
    public DtoVictim getVictimById(UUID id, UserDetailsImpl currentUser);
    
    public List<DtoVictim> getVictimsByFacility(UUID facilityId, UserDetailsImpl currentUser);
    
    public Page<VictimSearchResult> searchVictims(VictimSearchCriteria criteria, Pageable pageable, String relativeId);

    public void resolveVictim(UUID id, UserDetailsImpl currentUser);
}
