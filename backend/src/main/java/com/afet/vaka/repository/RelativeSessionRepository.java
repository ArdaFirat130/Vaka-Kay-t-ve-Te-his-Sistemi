package com.afet.vaka.repository;

import com.afet.vaka.model.RelativeSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RelativeSessionRepository extends JpaRepository<RelativeSession, UUID> {
    Optional<RelativeSession> findByPhoneHash(String phoneHash);
    Optional<RelativeSession> findByNationalIdHashAndPhoneHash(String nationalIdHash, String phoneHash);
}
