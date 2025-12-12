package com.kodekernel.ecommerce.repository;

import com.kodekernel.ecommerce.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findBySellerId(UUID sellerId);

    @Query("""
                SELECT o FROM Order o
                JOIN FETCH o.customer
                JOIN FETCH o.shippingAddress
                WHERE o.id = :orderId
            """)
    Optional<Order> fetchOrderDetail(UUID orderId);

    List<Order> findAllByOrderByOrderDateDesc();
}
