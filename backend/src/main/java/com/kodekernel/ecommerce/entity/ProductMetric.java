package com.kodekernel.ecommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "product_metrics")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private long dailyViews = 0;
    private long weeklyViews = 0;
    private long totalViews = 0;

    private long dailySales = 0;
    private long weeklySales = 0;
    private long totalSales = 0;

    private long addToCartCount = 0;
    private long wishlistCount = 0;

    private double avgRating = 0.0;
    private long reviewCount = 0;

    private double homepageScore = 0.0;

    // Advanced Scoring Fields
    private Double salesVelocity = 0.0;
    private Double conversionRate = 0.0;
    private Double weightedRating = 0.0;
    private Double inventoryScore = 0.0;
    private Double sellerScore = 1.0; // Default to good score
    private Double trendBoost = 0.0;
    private Double topDealScore = 0.0;

    private LocalDateTime lastCalculated;

    @PrePersist
    protected void onCreate() {
        lastCalculated = LocalDateTime.now();
    }
}
