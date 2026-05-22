package com.afet.vaka.service.impl;

import com.afet.vaka.dto.DtoVictim;
import com.afet.vaka.dto.DtoVictimIU;
import com.afet.vaka.model.Facility;
import com.afet.vaka.model.User;
import com.afet.vaka.model.Victim;
import com.afet.vaka.model.enums.SyncStatus;
import com.afet.vaka.repository.FacilityRepository;
import com.afet.vaka.repository.UserRepository;
import com.afet.vaka.repository.VictimRepository;
import com.afet.vaka.repository.SearchLogRepository;
import com.afet.vaka.repository.RelativeSessionRepository;
import com.afet.vaka.model.SearchLog;
import com.afet.vaka.model.RelativeSession;
import com.afet.vaka.dto.VictimSearchCriteria;
import com.afet.vaka.dto.VictimSearchResult;
import com.afet.vaka.service.IVictimService;
import com.afet.vaka.service.impl.UserServiceImpl.UserDetailsImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class VictimServiceImpl implements IVictimService {

    @Autowired
    private VictimRepository victimRepository;

    @Autowired
    private FacilityRepository facilityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SearchLogRepository searchLogRepository;

    @Autowired
    private RelativeSessionRepository relativeSessionRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    @Transactional
    public DtoVictim createVictim(DtoVictimIU input, UserDetailsImpl currentUser) {
        if (currentUser.getFacilityId() == null) {
            throw new AccessDeniedException("Herhangi bir tesise atanmadığınız için vaka giremezsiniz.");
        }

        Facility facility = facilityRepository.findById(currentUser.getFacilityId())
                .orElseThrow(() -> new RuntimeException("Tesis bulunamadı"));

        User creator = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Victim victim = Victim.builder()
                .caseNumber(generateCaseNumber())
                .facility(facility)
                .province(input.getProvince())
                .district(input.getDistrict())
                .recordedAt(LocalDateTime.now())
                .syncStatus(input.getLocalId() != null ? SyncStatus.SYNCED : SyncStatus.LOCAL)
                .localId(input.getLocalId())
                .gender(input.getGender())
                .ageGroup(input.getAgeGroup())
                .heightRange(input.getHeightRange())
                .bodyType(input.getBodyType())
                .skinTone(input.getSkinTone())
                .eyeColor(input.getEyeColor())
                .hairColor(input.getHairColor())
                .hairLength(input.getHairLength())
                .hairType(input.getHairType())
                .facialHair(input.getFacialHair())
                .hasTattoo(input.getHasTattoo())
                .tattooLocation(mapEnumsToStrings(input.getTattooLocation()))
                .tattooShape(mapEnumsToStrings(input.getTattooShape()))
                .hasScar(input.getHasScar())
                .scarLocation(mapEnumsToStrings(input.getScarLocation()))
                .hasBirthmark(input.getHasBirthmark())
                .birthmarkLocation(mapEnumsToStrings(input.getBirthmarkLocation()))
                .prosthetics(mapEnumsToStrings(input.getProsthetics()))
                .wearsGlasses(input.getWearsGlasses())
                .dentalFeatures(mapEnumsToStrings(input.getDentalFeatures()))
                .jewelry(mapEnumsToStrings(input.getJewelry()))
                .wearsHeadscarf(input.getWearsHeadscarf())
                .upperClothingType(mapEnumsToStrings(input.getUpperClothingType()))
                .lowerClothingType(mapEnumsToStrings(input.getLowerClothingType()))
                .healthStatus(input.getHealthStatus())
                .consciousness(input.getConsciousness())
                .chronicConditions(mapEnumsToStrings(input.getChronicConditions()))
                .spokenLanguages(mapEnumsToStrings(input.getSpokenLanguages()))
                .photoUrl(input.getPhotoUrl())
                .photoHash(input.getPhotoHash())
                .createdBy(creator)
                .build();

        return mapToDto(victimRepository.save(victim));
    }

    @Override
    @Transactional
    public DtoVictim updateVictim(UUID id, DtoVictimIU input, UserDetailsImpl currentUser) {
        Victim victim = victimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vaka bulunamadı"));

        checkAccess(victim, currentUser);

        victim.setProvince(input.getProvince());
        victim.setDistrict(input.getDistrict());
        victim.setGender(input.getGender());
        victim.setAgeGroup(input.getAgeGroup());
        victim.setHeightRange(input.getHeightRange());
        victim.setBodyType(input.getBodyType());
        victim.setSkinTone(input.getSkinTone());
        victim.setEyeColor(input.getEyeColor());
        victim.setHairColor(input.getHairColor());
        victim.setHairLength(input.getHairLength());
        victim.setHairType(input.getHairType());
        victim.setFacialHair(input.getFacialHair());
        victim.setHasTattoo(input.getHasTattoo());
        victim.setTattooLocation(mapEnumsToStrings(input.getTattooLocation()));
        victim.setTattooShape(mapEnumsToStrings(input.getTattooShape()));
        victim.setHasScar(input.getHasScar());
        victim.setScarLocation(mapEnumsToStrings(input.getScarLocation()));
        victim.setHasBirthmark(input.getHasBirthmark());
        victim.setBirthmarkLocation(mapEnumsToStrings(input.getBirthmarkLocation()));
        victim.setProsthetics(mapEnumsToStrings(input.getProsthetics()));
        victim.setWearsGlasses(input.getWearsGlasses());
        victim.setDentalFeatures(mapEnumsToStrings(input.getDentalFeatures()));
        victim.setJewelry(mapEnumsToStrings(input.getJewelry()));
        victim.setWearsHeadscarf(input.getWearsHeadscarf());
        victim.setUpperClothingType(mapEnumsToStrings(input.getUpperClothingType()));
        victim.setLowerClothingType(mapEnumsToStrings(input.getLowerClothingType()));
        victim.setHealthStatus(input.getHealthStatus());
        victim.setConsciousness(input.getConsciousness());
        victim.setChronicConditions(mapEnumsToStrings(input.getChronicConditions()));
        victim.setSpokenLanguages(mapEnumsToStrings(input.getSpokenLanguages()));
        victim.setPhotoUrl(input.getPhotoUrl());

        return mapToDto(victimRepository.save(victim));
    }

    @Override
    public DtoVictim getVictimById(UUID id, UserDetailsImpl currentUser) {
        Victim victim = victimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vaka bulunamadı"));
        checkAccess(victim, currentUser);
        return mapToDto(victim);
    }

    @Override
    public List<DtoVictim> getVictimsByFacility(UUID facilityId, UserDetailsImpl currentUser) {
        boolean isSuperAdmin = currentUser.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_SUPER_ADMIN"));
        if (!isSuperAdmin && !facilityId.equals(currentUser.getFacilityId())) {
            throw new AccessDeniedException("Sadece kendi tesisinize ait vakaları görebilirsiniz.");
        }

        return victimRepository.findByFacilityIdAndIsResolvedFalse(facilityId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void resolveVictim(UUID id, UserDetailsImpl currentUser) {
        Victim victim = victimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vaka bulunamadı"));
        
        checkAccess(victim, currentUser);
        
        victim.setResolved(true);
        victimRepository.save(victim);
    }

    @Override
    @Transactional
    public Page<VictimSearchResult> searchVictims(VictimSearchCriteria criteria, Pageable pageable, String relativeId) {
        Page<Object[]> scoredVictims = victimRepository.searchAndScoreVictims(criteria, pageable);

        List<VictimSearchResult> results = scoredVictims.getContent().stream().map(obj -> {
            Victim victim = (Victim) obj[0];
            Double rawScore = (Double) obj[1];
            Integer totalPossibleScore = (Integer) obj[2];
            
            Double matchPercentage = totalPossibleScore > 0 ? (rawScore / totalPossibleScore) * 100.0 : 0.0;
            
            return VictimSearchResult.builder()
                    .victim(mapToDto(victim))
                    .matchedCriteriaCount(rawScore.intValue())
                    .totalProvidedCriteriaCount(totalPossibleScore)
                    .matchScore(Math.round(matchPercentage * 100.0) / 100.0) // 2 decimal places
                    .build();
        }).collect(Collectors.toList());

        // Log the search if it's a relative session
        relativeSessionRepository.findById(UUID.fromString(relativeId)).ifPresent(session -> {
            List<UUID> matchedIds = results.stream().map(r -> r.getVictim().getId()).collect(Collectors.toList());

            SearchLog log = SearchLog.builder()
                    .relativeSession(session)
                    .queryParams(objectMapper.convertValue(criteria, new com.fasterxml.jackson.core.type.TypeReference<java.util.Map<String, Object>>() {}))
                    .matchedVictimIds(matchedIds)
                    .searchedAt(LocalDateTime.now())
                    .build();
            
            searchLogRepository.save(log);
        });

        return new PageImpl<>(results, pageable, scoredVictims.getTotalElements());
    }


    private void checkAccess(Victim victim, UserDetailsImpl currentUser) {
        boolean isSuperAdmin = currentUser.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_SUPER_ADMIN"));
        boolean isSameFacility = victim.getFacility().getId().equals(currentUser.getFacilityId());

        if (!isSuperAdmin && !isSameFacility) {
            throw new AccessDeniedException("Bu vakayı görüntüleme veya düzenleme yetkiniz yok.");
        }
    }

    private String generateCaseNumber() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss");
        return "VKA-" + LocalDateTime.now().format(formatter) + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }

    private DtoVictim mapToDto(Victim victim) {
        return DtoVictim.builder()
                .id(victim.getId())
                .caseNumber(victim.getCaseNumber())
                .facilityId(victim.getFacility().getId())
                .facilityName(victim.getFacility().getName())
                .province(victim.getProvince())
                .district(victim.getDistrict())
                .recordedAt(victim.getRecordedAt())
                .syncStatus(victim.getSyncStatus())
                .gender(victim.getGender())
                .ageGroup(victim.getAgeGroup())
                .heightRange(victim.getHeightRange())
                .bodyType(victim.getBodyType())
                .skinTone(victim.getSkinTone())
                .eyeColor(victim.getEyeColor())
                .hairColor(victim.getHairColor())
                .hairLength(victim.getHairLength())
                .hairType(victim.getHairType())
                .facialHair(victim.getFacialHair())
                .hasTattoo(victim.getHasTattoo())
                .tattooLocation(mapStringsToEnums(victim.getTattooLocation(), com.afet.vaka.model.enums.BodyPart.class))
                .tattooShape(mapStringsToEnums(victim.getTattooShape(), com.afet.vaka.model.enums.TattooShape.class))
                .hasScar(victim.getHasScar())
                .scarLocation(mapStringsToEnums(victim.getScarLocation(), com.afet.vaka.model.enums.BodyPart.class))
                .hasBirthmark(victim.getHasBirthmark())
                .birthmarkLocation(mapStringsToEnums(victim.getBirthmarkLocation(), com.afet.vaka.model.enums.BodyPart.class))
                .prosthetics(mapStringsToEnums(victim.getProsthetics(), com.afet.vaka.model.enums.Prosthetic.class))
                .wearsGlasses(victim.getWearsGlasses())
                .dentalFeatures(mapStringsToEnums(victim.getDentalFeatures(), com.afet.vaka.model.enums.DentalFeature.class))
                .jewelry(mapStringsToEnums(victim.getJewelry(), com.afet.vaka.model.enums.Jewelry.class))
                .wearsHeadscarf(victim.getWearsHeadscarf())
                .upperClothingType(mapStringsToEnums(victim.getUpperClothingType(), com.afet.vaka.model.enums.ClothingType.class))
                .lowerClothingType(mapStringsToEnums(victim.getLowerClothingType(), com.afet.vaka.model.enums.ClothingType.class))
                .healthStatus(victim.getHealthStatus())
                .consciousness(victim.getConsciousness())
                .chronicConditions(mapStringsToEnums(victim.getChronicConditions(), com.afet.vaka.model.enums.ChronicCondition.class))
                .spokenLanguages(mapStringsToEnums(victim.getSpokenLanguages(), com.afet.vaka.model.enums.SpokenLanguage.class))
                .photoUrl(victim.getPhotoUrl())
                .build();
    }
    private <E extends Enum<E>> List<String> mapEnumsToStrings(List<E> enums) {
        if (enums == null) return null;
        return enums.stream().map(Enum::name).collect(Collectors.toList());
    }

    private <E extends Enum<E>> List<E> mapStringsToEnums(List<String> strings, Class<E> enumClass) {
        if (strings == null) return null;
        return strings.stream().map(s -> Enum.valueOf(enumClass, s)).collect(Collectors.toList());
    }
}
