package com.kodekernel.ecommerce.repository;

import com.kodekernel.ecommerce.entity.ProductMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductMetricRepository extends JpaRepository<ProductMetric, Long> {
    Optional<ProductMetric> findByProductId(UUID productId);
}
