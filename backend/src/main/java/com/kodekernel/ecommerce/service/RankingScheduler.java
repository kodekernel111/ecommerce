package com.kodekernel.ecommerce.service;

import com.kodekernel.ecommerce.entity.Product;
import com.kodekernel.ecommerce.entity.ProductMetric;
import com.kodekernel.ecommerce.repository.ProductMetricRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class RankingScheduler {

    @Autowired
    private ProductMetricRepository metricRepository;

    @Scheduled(fixedRate = 900000) // Every 15 minutes
    @Transactional
    public void calculateRankings() {
        List<ProductMetric> metrics = metricRepository.findAll();

        for (ProductMetric metric : metrics) {
            Product product = metric.getProduct();
            if (product != null && Boolean.TRUE.equals(product.getActive())) {

                // 1. Discount Strength (Effective Discount)
                double sellingPrice = product.getPrice() != null ? product.getPrice() : 0.0;
                double mrp = product.getMrp() != null ? product.getMrp() : sellingPrice;
                double discount = 0.0;
                if (mrp > 0) {
                    discount = (mrp - sellingPrice) / mrp;
                }
                // Cap extreme discounts unless trusted (simplified for now)
                if (discount > 0.7)
                    discount = 0.7;

                // 2. Sales Velocity (Orders / Inventory) (Simplified using daily sales)
                // Assuming daily sales is a proxy for recent velocity
                double stock = product.getQuantity() != null ? product.getQuantity() : 0;
                double velocity = stock > 0 ? (double) metric.getDailySales() / stock : 0.0;
                metric.setSalesVelocity(velocity);

                // 3. Conversion Rate (Orders / Views)
                double conversion = metric.getTotalViews() > 0
                        ? (double) metric.getTotalSales() / metric.getTotalViews()
                        : 0.0;
                metric.setConversionRate(conversion);

                // 4. Weighted Rating (avg * log(count))
                double weightedRating = metric.getAvgRating() * Math.log10(metric.getReviewCount() + 1);
                metric.setWeightedRating(weightedRating);

                // 5. Seller Score (Placeholder logic - would fetch from SellerService)
                // For now, treat all as good sellers (1.0), penalize if stock is 0
                double sellerScore = stock > 0 ? 1.0 : 0.5;
                metric.setSellerScore(sellerScore);

                // 6. Inventory Health (Stock / Threshold)
                double inventoryScore = Math.min(1.0, stock / 50.0); // Assume 50 is healthy stock
                metric.setInventoryScore(inventoryScore);

                // 7. Trend Boost (Recent views boost)
                // Simplified: Daily views vs (Weekly views / 7)
                double avgDailyViews = metric.getWeeklyViews() / 7.0;
                double trendBoost = avgDailyViews > 0 ? metric.getDailyViews() / avgDailyViews : 1.0;
                if (trendBoost > 2.0)
                    trendBoost = 2.0; // Cap boost
                metric.setTrendBoost(trendBoost);

                // Final Score Calculation (Weighted Formula)
                // Weights: Discount(25%), Velocity(20%), Conversion(15%), Rating(15%),
                // Seller(10%), Inventory(10%), Trend(5%)
                double finalScore = (0.25 * discount * 100) + // Scale discount to 0-100 range logically
                        (0.20 * velocity * 1000) + // Velocity is usually small fraction, scaled up
                        (0.15 * conversion * 100) +
                        (0.15 * weightedRating * 5) + // Rating approx 0-25 range
                        (0.10 * sellerScore * 100) +
                        (0.10 * inventoryScore * 100) +
                        (0.05 * trendBoost * 20); // Trend around 1-2

                metric.setTopDealScore(finalScore);

                // Legacy Homepage Score (kept for compatibility)
                double legacyScore = (metric.getWeeklySales() * 5) + (metric.getWeeklyViews() * 1)
                        + (metric.getAvgRating() * 20);
                metric.setHomepageScore(legacyScore);

                metric.setLastCalculated(LocalDateTime.now());
            }
        }

        metricRepository.saveAll(metrics);
    }
}
