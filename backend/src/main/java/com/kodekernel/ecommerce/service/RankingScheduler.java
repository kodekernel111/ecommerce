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

    @Scheduled(fixedRate = 900000)
    @Transactional
    public void calculateRankings() {
        List<ProductMetric> metrics = metricRepository.findAll();

        for (ProductMetric metric : metrics) {
            Product product = metric.getProduct();
            if (product != null) {
                double score = 0;

                score += metric.getWeeklySales() * 5;
                score += metric.getWeeklyViews() * 1;
                score += metric.getAvgRating() * 20;

                if (product.getDiscount() != null) {
                    score += product.getDiscount() * 2;
                }

                metric.setHomepageScore(score);
                metric.setLastCalculated(LocalDateTime.now());
            }
        }

        metricRepository.saveAll(metrics);
    }
}
