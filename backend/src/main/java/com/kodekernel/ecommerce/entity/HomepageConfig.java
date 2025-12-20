package com.kodekernel.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import lombok.ToString;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "homepage_configs")
public class HomepageConfig {

    @Id
    @GeneratedValue
    private UUID id;

    // Hero Section (Multiple Slides)
    @OneToMany(mappedBy = "homepageConfig", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<HeroBannerSlide> heroSlides = new ArrayList<>();

    // Section Visibility
    private boolean showTrending;
    private boolean showBestsellers;
    private boolean showTopDeals;
    private boolean showNewArrivals;
    private boolean showFeatured;

    // Featured Products Sections (Multiple)
    @OneToMany(mappedBy = "homepageConfig", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    @Builder.Default
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<FeaturedSection> featuredSections = new ArrayList<>();
}
