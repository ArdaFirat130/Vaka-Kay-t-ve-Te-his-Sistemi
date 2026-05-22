package com.afet.vaka.dto;

import com.afet.vaka.model.enums.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
public class DtoVictim {
    private UUID id;
    private String caseNumber;
    private UUID facilityId;
    private String facilityName;
    private String province;
    private String district;
    private LocalDateTime recordedAt;
    private SyncStatus syncStatus;

    // Physical
    private Gender gender;
    private AgeGroup ageGroup;
    private HeightRange heightRange;
    private BodyType bodyType;
    private SkinTone skinTone;
    private EyeColor eyeColor;
    private HairColor hairColor;
    private HairLength hairLength;
    private HairType hairType;
    private FacialHair facialHair;

    // Distinctive
    private Boolean hasTattoo;
    private List<BodyPart> tattooLocation;
    private List<TattooShape> tattooShape;
    private Boolean hasScar;
    private List<BodyPart> scarLocation;
    private Boolean hasBirthmark;
    private List<BodyPart> birthmarkLocation;
    private List<Prosthetic> prosthetics;
    private Glasses wearsGlasses;
    private List<DentalFeature> dentalFeatures;

    // Accessories & Clothing
    private List<Jewelry> jewelry;
    private Headscarf wearsHeadscarf;
    private List<ClothingType> upperClothingType;
    private List<ClothingType> lowerClothingType;

    // Health
    private HealthStatus healthStatus;
    private Consciousness consciousness;
    private List<ChronicCondition> chronicConditions;
    private List<SpokenLanguage> spokenLanguages;

    private String photoUrl;
}
