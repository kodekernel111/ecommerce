package com.kodekernel.ecommerce.repository;

import com.kodekernel.ecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID>,
        JpaSpecificationExecutor<Product> {
    List<Product> findBySellerId(UUID sellerId);

    Page<Product> findBySellerId(UUID sellerId,
            Pageable pageable);

    List<Product> findBySellerIdAndQuantityLessThan(UUID sellerId, int quantity);

    @Query("SELECT p FROM Product p JOIN p.productMetric pm ORDER BY pm.weeklyViews DESC")
    Page<Product> findTrendingProducts(
            Pageable pageable);

    @Query("SELECT p FROM Product p JOIN p.productMetric pm ORDER BY pm.totalSales DESC")
    Page<Product> findBestSellers(Pageable pageable);

    @Query("SELECT p FROM Product p ORDER BY p.discount DESC")
    Page<Product> findTopDeals(Pageable pageable);

    @Query("SELECT p FROM Product p JOIN p.productMetric pm ORDER BY pm.homepageScore DESC")
    Page<Product> findFeaturedProducts(
            Pageable pageable);
}
