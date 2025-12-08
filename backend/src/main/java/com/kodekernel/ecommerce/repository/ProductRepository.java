package com.kodekernel.ecommerce.repository;

import com.kodekernel.ecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> findBySellerId(UUID sellerId);

    List<Product> findBySellerIdAndQuantityLessThan(UUID sellerId, int quantity);
}
