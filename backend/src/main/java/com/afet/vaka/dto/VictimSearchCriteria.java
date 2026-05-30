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

    public int countProvidedFields() {
        int count = 0;
        if (province != null && !province.isEmpty()) count++;
        if (district != null && !district.isEmpty()) count++;
        if (gender != null) count++;
        if (ageGroup != null) count++;
        if (heightRange != null) count++;
        if (bodyType != null) count++;
        if (skinTone != null) count++;
        if (hairColor != null) count++;
        if (eyeColor != null) count++;
        if (hairLength != null) count++;
        if (hairType != null) count++;
        if (facialHair != null) count++;
        
        if (hasTattoo != null && hasTattoo) {
            count++;
            if (tattooLocation != null && !tattooLocation.isEmpty()) count++;
            if (tattooShape != null && !tattooShape.isEmpty()) count++;
        }
        if (hasScar != null && hasScar) {
            count++;
            if (scarLocation != null && !scarLocation.isEmpty()) count++;
        }
        if (hasBirthmark != null && hasBirthmark) {
            count++;
            if (birthmarkLocation != null && !birthmarkLocation.isEmpty()) count++;
        }
        if (prosthetics != null && !prosthetics.isEmpty()) count++;
        if (wearsGlasses != null) count++;
        if (dentalFeatures != null && !dentalFeatures.isEmpty()) count++;
        if (jewelry != null && !jewelry.isEmpty()) count++;
        if (wearsHeadscarf != null) count++;
        if (upperClothingType != null && !upperClothingType.isEmpty()) count++;
        if (lowerClothingType != null && !lowerClothingType.isEmpty()) count++;
        if (spokenLanguages != null && !spokenLanguages.isEmpty()) count++;
        return count;
    }

    public int countStrictFields() {
        int count = 0;
        if (province != null && !province.isEmpty()) count++;
        if (district != null && !district.isEmpty()) count++;
        if (gender != null) count++;
        return count;
    }
}
