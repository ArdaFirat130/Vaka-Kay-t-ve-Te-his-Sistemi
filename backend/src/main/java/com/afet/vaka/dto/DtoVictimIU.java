package com.afet.vaka.dto;

import com.afet.vaka.model.enums.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class DtoVictimIU {

    @NotBlank(message = "İl alanı zorunludur")
    private String province;

    @NotBlank(message = "İlçe alanı zorunludur")
    private String district;

    private UUID localId; 
    
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
    private String photoHash;
}
