package com.afet.vaka.model;

import com.afet.vaka.model.enums.FacilityType;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;

import java.util.Map;

@Entity
@Table(name = "facilities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Facility extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FacilityType type;

    private String address;

    @Column(columnDefinition = "jsonb")
    @Type(JsonType.class)
    private Map<String, Object> coordinates;

    @Column(name = "contact_info", columnDefinition = "jsonb")
    @Type(JsonType.class)
    private Map<String, Object> contactInfo;
}
