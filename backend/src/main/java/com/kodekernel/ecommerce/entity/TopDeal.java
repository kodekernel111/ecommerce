package com.kodekernel.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.EqualsAndHashCode;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "top_deals")
public class TopDeal {

    @Id
    @GeneratedValue
    private UUID id;

    private String displayTitle;
    private String imageUrl;
    private String offer;

    private UUID mainCategoryId;
    private UUID subCategoryId;
    private UUID tertiaryCategoryId;

    @Builder.Default
    private Boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "homepage_config_id")
    @JsonBackReference
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private HomepageConfig homepageConfig;
}
