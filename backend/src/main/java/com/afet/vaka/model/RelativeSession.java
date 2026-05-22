package com.afet.vaka.model;

import com.afet.vaka.model.enums.Relationship;
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

import java.time.LocalDateTime;

@Entity
@Table(name = "relative_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RelativeSession extends BaseEntity {

    @Column(name = "phone_hash", nullable = false)
    private String phoneHash;

    @Column(name = "national_id_hash", nullable = false)
    private String nationalIdHash;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Relationship relationship;

    @Column(name = "otp_code")
    private String otpCode; // BCrypt hash'li veya şifreli tutulabilir

    @Column(name = "otp_expires_at")
    private LocalDateTime otpExpiresAt;

    @Column(name = "session_expires_at")
    private LocalDateTime sessionExpiresAt;
}
