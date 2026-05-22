package com.afet.vaka.repository;

import com.afet.vaka.model.Victim;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.afet.vaka.dto.VictimSearchCriteria;

public interface VictimRepositoryCustom {
    /**
     * Searches victims dynamically and scores them based on provided criteria.
     * Returns a list of Objects where [0] is the Victim entity and [1] is the Double score.
     */
    Page<Object[]> searchAndScoreVictims(VictimSearchCriteria criteria, Pageable pageable);
}
