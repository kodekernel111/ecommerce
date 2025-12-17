package com.kodekernel.ecommerce.repository;

import com.kodekernel.ecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID>,
        org.springframework.data.jpa.repository.JpaSpecificationExecutor<Product> {
    List<Product> findBySellerId(UUID sellerId);

    org.springframework.data.domain.Page<Product> findBySellerId(UUID sellerId,
            org.springframework.data.domain.Pageable pageable);

    List<Product> findBySellerIdAndQuantityLessThan(UUID sellerId, int quantity);
}
