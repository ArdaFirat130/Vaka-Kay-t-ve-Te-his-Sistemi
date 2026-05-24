package com.afet.vaka.model;

import com.afet.vaka.model.enums.*;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "victims")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Victim extends BaseEntity {

    @Column(name = "case_number", nullable = false, unique = true)
    private String caseNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facility_id", nullable = false)
    private Facility facility;

    @Column(nullable = false)
    private String province;

    @Column(nullable = false)
    private String district;

    @Column(name = "recorded_at", nullable = false)
    private LocalDateTime recordedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "sync_status", nullable = false)
    @Builder.Default
    private SyncStatus syncStatus = SyncStatus.LOCAL;

    @Column(name = "local_id")
    private UUID localId;

    @Column(name = "is_resolved", nullable = false)
    @Builder.Default
    private boolean isResolved = false;

    // --- Physical Basic ---
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(name = "age_group")
    private AgeGroup ageGroup;

    // --- Appearance ---
    @Enumerated(EnumType.STRING)
    @Column(name = "height_range")
    private HeightRange heightRange;

    @Enumerated(EnumType.STRING)
    @Column(name = "body_type")
    private BodyType bodyType;

    @Enumerated(EnumType.STRING)
    @Column(name = "skin_tone")
    private SkinTone skinTone;

    @Enumerated(EnumType.STRING)
    @Column(name = "eye_color")
    private EyeColor eyeColor;

    @Enumerated(EnumType.STRING)
    @Column(name = "hair_color")
    private HairColor hairColor;

    @Enumerated(EnumType.STRING)
    @Column(name = "hair_length")
    private HairLength hairLength;

    @Enumerated(EnumType.STRING)
    @Column(name = "hair_type")
    private HairType hairType;

    @Enumerated(EnumType.STRING)
    @Column(name = "facial_hair")
    private FacialHair facialHair;

    // --- Distinctive Features ---
    @Column(name = "has_tattoo")
    private Boolean hasTattoo;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.ARRAY)
    @Column(name = "tattoo_location", columnDefinition = "text[]")
    private List<String> tattooLocation;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.ARRAY)
    @Column(name = "tattoo_shape", columnDefinition = "text[]")
    private List<String> tattooShape;

    @Column(name = "has_scar")
    private Boolean hasScar;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.ARRAY)
    @Column(name = "scar_location", columnDefinition = "text[]")
    private List<String> scarLocation;

    @Column(name = "has_birthmark")
    private Boolean hasBirthmark;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.ARRAY)
    @Column(name = "birthmark_location", columnDefinition = "text[]")
    private List<String> birthmarkLocation;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.ARRAY)
    @Column(columnDefinition = "text[]")
    private List<String> prosthetics;

    @Enumerated(EnumType.STRING)
    @Column(name = "wears_glasses")
    private Glasses wearsGlasses;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.ARRAY)
    @Column(name = "dental_features", columnDefinition = "text[]")
    private List<String> dentalFeatures;

    // --- Accessories ---
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.ARRAY)
    @Column(columnDefinition = "text[]")
    private List<String> jewelry;

    @Enumerated(EnumType.STRING)
    @Column(name = "wears_headscarf")
    private Headscarf wearsHeadscarf;

    // --- Clothing ---
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.ARRAY)
    @Column(name = "upper_clothing_type", columnDefinition = "text[]")
    private List<String> upperClothingType;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.ARRAY)
    @Column(name = "lower_clothing_type", columnDefinition = "text[]")
    private List<String> lowerClothingType;

    // --- Health ---
    @Enumerated(EnumType.STRING)
    @Column(name = "health_status")
    private HealthStatus healthStatus;

    @Enumerated(EnumType.STRING)
    private Consciousness consciousness;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.ARRAY)
    @Column(name = "chronic_conditions", columnDefinition = "text[]")
    private List<String> chronicConditions;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.ARRAY)
    @Column(name = "spoken_languages", columnDefinition = "text[]")
    private List<String> spokenLanguages;

    // --- Photo ---
    @Column(name = "photo_url", columnDefinition = "text")
    private String photoUrl;

    @Column(name = "photo_hash")
    private String photoHash;

    // --- Audit ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;
}
