package com.kodekernel.ecommerce.repository;

import com.kodekernel.ecommerce.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import java.util.UUID;

@Repository
public interface OrderRepository
                extends JpaRepository<Order, UUID>, JpaSpecificationExecutor<Order> {
        List<Order> findBySellerId(UUID sellerId);

        @Query("""
                            SELECT o FROM Order o
                            JOIN FETCH o.customer
                            JOIN FETCH o.shippingAddress
                            WHERE o.id = :orderId
                        """)
        Optional<Order> fetchOrderDetail(UUID orderId);

        List<Order> findAllByOrderByOrderDateDesc();

        List<Order> findBySellerIdOrderByOrderDateDesc(UUID sellerId);

        Page<Order> findBySellerId(UUID sellerId,
                        Pageable pageable);
}
