package com.afet.vaka.repository;

import com.afet.vaka.dto.VictimSearchCriteria;
import com.afet.vaka.model.Victim;
import com.afet.vaka.model.enums.AgeGroup;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.stream.Collectors;

@Repository
public class VictimRepositoryImpl implements VictimRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Page<Object[]> searchAndScoreVictims(VictimSearchCriteria criteria, Pageable pageable) {
        StringBuilder selectSql = new StringBuilder("SELECT v.id, (0.0 ");
        StringBuilder whereSql = new StringBuilder(" WHERE 1=1 AND v.is_resolved = false ");
        Map<String, Object> whereParams = new HashMap<>();
        Map<String, Object> selectParams = new HashMap<>();

        // 1. Strict Filters
        if (criteria.getProvince() != null && !criteria.getProvince().isEmpty()) {
            whereSql.append(" AND v.province = :province");
            whereParams.put("province", criteria.getProvince());
        }

        if (criteria.getDistrict() != null && !criteria.getDistrict().isEmpty()) {
            whereSql.append(" AND v.district = :district");
            whereParams.put("district", criteria.getDistrict());
        }

        if (criteria.getGender() != null) {
            whereSql.append(" AND v.gender = :gender");
            whereParams.put("gender", criteria.getGender().name());
        }

        // 2. Fuzzy Scoring
        int totalPossibleScore = 0;

        if (criteria.getAgeGroup() != null) {
            totalPossibleScore += 10;
            selectSql.append(" + CASE WHEN v.age_group = :ageGroup THEN 10.0 ");
            List<String> neighbors = getAgeGroupNeighbors(criteria.getAgeGroup());
            if (neighbors.size() == 1) {
                selectSql.append(" WHEN v.age_group = :agNeighbor1 THEN 5.0 ");
                selectParams.put("agNeighbor1", neighbors.get(0));
            } else if (neighbors.size() >= 2) {
                selectSql.append(" WHEN v.age_group IN (:agNeighbor1, :agNeighbor2) THEN 5.0 ");
                selectParams.put("agNeighbor1", neighbors.get(0));
                selectParams.put("agNeighbor2", neighbors.get(1));
            }
            selectSql.append(" ELSE 0.0 END ");
            selectParams.put("ageGroup", criteria.getAgeGroup().name());
        }

        if (criteria.getHeightRange() != null) {
            totalPossibleScore += 10;
            selectSql.append(" + CASE WHEN v.height_range = :heightRange THEN 10.0 ELSE 0.0 END ");
            selectParams.put("heightRange", criteria.getHeightRange().name());
        }

        if (criteria.getBodyType() != null) {
            totalPossibleScore += 10;
            selectSql.append(" + CASE WHEN v.body_type = :bodyType THEN 10.0 ELSE 0.0 END ");
            selectParams.put("bodyType", criteria.getBodyType().name());
        }

        if (criteria.getSkinTone() != null) {
            totalPossibleScore += 10;
            selectSql.append(" + CASE WHEN v.skin_tone = :skinTone THEN 10.0 ELSE 0.0 END ");
            selectParams.put("skinTone", criteria.getSkinTone().name());
        }

        if (criteria.getHairColor() != null) {
            totalPossibleScore += 10;
            selectSql.append(" + CASE WHEN v.hair_color = :hairColor THEN 10.0 ELSE 0.0 END ");
            selectParams.put("hairColor", criteria.getHairColor().name());
        }
        
        if (criteria.getEyeColor() != null) {
            totalPossibleScore += 10;
            selectSql.append(" + CASE WHEN v.eye_color = :eyeColor THEN 10.0 ELSE 0.0 END ");
            selectParams.put("eyeColor", criteria.getEyeColor().name());
        }

        // Arrays (Upper Clothing)
        if (criteria.getUpperClothingType() != null && !criteria.getUpperClothingType().isEmpty()) {
            totalPossibleScore += 10;
            selectSql.append(" + CASE WHEN v.upper_clothing_type && CAST(:upperClothing AS text[]) THEN 10.0 ELSE 0.0 END ");
            selectParams.put("upperClothing", "{" + criteria.getUpperClothingType().stream().map(Enum::name).collect(Collectors.joining(",")) + "}");
        }

        // Arrays (Lower Clothing)
        if (criteria.getLowerClothingType() != null && !criteria.getLowerClothingType().isEmpty()) {
            totalPossibleScore += 10;
            selectSql.append(" + CASE WHEN v.lower_clothing_type && CAST(:lowerClothing AS text[]) THEN 10.0 ELSE 0.0 END ");
            selectParams.put("lowerClothing", "{" + criteria.getLowerClothingType().stream().map(Enum::name).collect(Collectors.joining(",")) + "}");
        }

        if (criteria.getHasTattoo() != null && criteria.getHasTattoo()) {
            totalPossibleScore += 5;
            selectSql.append(" + CASE WHEN v.has_tattoo = true THEN 5.0 ELSE 0.0 END ");
            
            if (criteria.getTattooLocation() != null && !criteria.getTattooLocation().isEmpty()) {
                totalPossibleScore += 10;
                selectSql.append(" + CASE WHEN v.tattoo_location && CAST(:tattooLoc AS text[]) THEN 10.0 ELSE 0.0 END ");
                selectParams.put("tattooLoc", "{" + criteria.getTattooLocation().stream().map(Enum::name).collect(Collectors.joining(",")) + "}");
            }
            if (criteria.getTattooShape() != null && !criteria.getTattooShape().isEmpty()) {
                totalPossibleScore += 10;
                selectSql.append(" + CASE WHEN v.tattoo_shape && CAST(:tattooShape AS text[]) THEN 10.0 ELSE 0.0 END ");
                selectParams.put("tattooShape", "{" + criteria.getTattooShape().stream().map(Enum::name).collect(Collectors.joining(",")) + "}");
            }
        }

        if (criteria.getHasScar() != null && criteria.getHasScar()) {
            totalPossibleScore += 5;
            selectSql.append(" + CASE WHEN v.has_scar = true THEN 5.0 ELSE 0.0 END ");
            if (criteria.getScarLocation() != null && !criteria.getScarLocation().isEmpty()) {
                totalPossibleScore += 10;
                selectSql.append(" + CASE WHEN v.scar_location && CAST(:scarLoc AS text[]) THEN 10.0 ELSE 0.0 END ");
                selectParams.put("scarLoc", "{" + criteria.getScarLocation().stream().map(Enum::name).collect(Collectors.joining(",")) + "}");
            }
        }

        if (criteria.getHasBirthmark() != null && criteria.getHasBirthmark()) {
            totalPossibleScore += 5;
            selectSql.append(" + CASE WHEN v.has_birthmark = true THEN 5.0 ELSE 0.0 END ");
            if (criteria.getBirthmarkLocation() != null && !criteria.getBirthmarkLocation().isEmpty()) {
                totalPossibleScore += 10;
                selectSql.append(" + CASE WHEN v.birthmark_location && CAST(:birthmarkLoc AS text[]) THEN 10.0 ELSE 0.0 END ");
                selectParams.put("birthmarkLoc", "{" + criteria.getBirthmarkLocation().stream().map(Enum::name).collect(Collectors.joining(",")) + "}");
            }
        }

        if (criteria.getSpokenLanguages() != null && !criteria.getSpokenLanguages().isEmpty()) {
            totalPossibleScore += 10;
            selectSql.append(" + CASE WHEN v.spoken_languages && CAST(:spokenLangs AS text[]) THEN 10.0 ELSE 0.0 END ");
            selectParams.put("spokenLangs", "{" + criteria.getSpokenLanguages().stream().map(Enum::name).collect(Collectors.joining(",")) + "}");
        }

        selectSql.append(") AS raw_score FROM afet.victims v ");
        
        String finalSql = selectSql.toString() + whereSql.toString() + " ORDER BY raw_score DESC";

        // Execute count query
        String countSql = "SELECT COUNT(v.id) FROM afet.victims v " + whereSql.toString();
        Query countQuery = entityManager.createNativeQuery(countSql);
        for (Map.Entry<String, Object> entry : whereParams.entrySet()) {
            countQuery.setParameter(entry.getKey(), entry.getValue());
        }
        long totalCount = ((Number) countQuery.getSingleResult()).longValue();

        // Execute main query
        Query query = entityManager.createNativeQuery(finalSql);
        for (Map.Entry<String, Object> entry : whereParams.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
        }
        for (Map.Entry<String, Object> entry : selectParams.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
        }
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        List<Object[]> results = query.getResultList();
        
        if (results.isEmpty()) {
            return new PageImpl<>(new ArrayList<>(), pageable, totalCount);
        }

        // Fetch Victims by IDs
        List<UUID> ids = results.stream().map(r -> (UUID) r[0]).collect(Collectors.toList());
        List<Victim> victims = entityManager.createQuery("SELECT v FROM Victim v WHERE v.id IN :ids", Victim.class)
                .setParameter("ids", ids)
                .getResultList();
        
        Map<UUID, Victim> victimMap = victims.stream().collect(Collectors.toMap(Victim::getId, v -> v));

        List<Object[]> finalContent = new ArrayList<>();
        for (Object[] row : results) {
            UUID id = (UUID) row[0];
            Double rawScore = ((Number) row[1]).doubleValue();
            Victim v = victimMap.get(id);
            if (v != null) {
                // Returning [victim, rawScore, totalPossibleScore]
                finalContent.add(new Object[]{v, rawScore, totalPossibleScore});
            }
        }

        // Maintain score sorting
        finalContent.sort((a, b) -> Double.compare((Double) b[1], (Double) a[1]));

        return new PageImpl<>(finalContent, pageable, totalCount);
    }

    private List<String> getAgeGroupNeighbors(AgeGroup target) {
        List<String> neighbors = new ArrayList<>();
        if (target == AgeGroup.UNKNOWN) return neighbors;
        
        AgeGroup[] all = AgeGroup.values();
        int targetIndex = -1;
        for (int i = 0; i < all.length; i++) {
            if (all[i] == target) {
                targetIndex = i;
                break;
            }
        }
        if (targetIndex > 0 && all[targetIndex - 1] != AgeGroup.UNKNOWN) {
            neighbors.add(all[targetIndex - 1].name());
        }
        if (targetIndex < all.length - 1 && all[targetIndex + 1] != AgeGroup.UNKNOWN) {
            neighbors.add(all[targetIndex + 1].name());
        }
        return neighbors;
    }
}
