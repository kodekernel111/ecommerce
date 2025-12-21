package com.kodekernel.ecommerce.repository;

import com.kodekernel.ecommerce.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findByProductIdOrderByCreatedAtDesc(UUID productId);

    java.util.Optional<Review> findByProductIdAndUserId(UUID productId, UUID userId);
}
