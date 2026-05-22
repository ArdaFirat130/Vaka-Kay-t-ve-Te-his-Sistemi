package com.afet.vaka.model;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "search_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchLog extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "relative_session_id", nullable = false)
    private RelativeSession relativeSession;

    @Type(JsonType.class)
    @Column(name = "query_params", columnDefinition = "jsonb", nullable = false)
    private Map<String, Object> queryParams;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "matched_victim_ids", columnDefinition = "uuid[]")
    private List<UUID> matchedVictimIds;

    @Column(name = "searched_at", nullable = false)
    private LocalDateTime searchedAt;
}
