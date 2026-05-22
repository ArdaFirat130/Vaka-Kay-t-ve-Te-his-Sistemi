package com.afet.vaka.dto;

import com.afet.vaka.model.enums.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VictimSearchCriteria {
    // Location
    private String province;
    private String district;

    // Physical Basic
    private Gender gender;
    private AgeGroup ageGroup;

    // Appearance
    private HeightRange heightRange;
    private BodyType bodyType;
    private SkinTone skinTone;
    private HairColor hairColor;
    private EyeColor eyeColor;
    private HairLength hairLength;
    private HairType hairType;
    private FacialHair facialHair;

    // Distinctive Features
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

    // Health & Communication
    private HealthStatus healthStatus;
    private List<ChronicCondition> chronicConditions;
    private List<SpokenLanguage> spokenLanguages;
}
