package com.afet.vaka.repository;

import com.afet.vaka.model.Victim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VictimRepository extends JpaRepository<Victim, UUID>, VictimRepositoryCustom {
    Optional<Victim> findByCaseNumber(String caseNumber);
    List<Victim> findByFacilityId(UUID facilityId);
    List<Victim> findByFacilityIdAndIsResolvedFalse(UUID facilityId);
    Optional<Victim> findByIdAndFacilityId(UUID id, UUID facilityId);
}
