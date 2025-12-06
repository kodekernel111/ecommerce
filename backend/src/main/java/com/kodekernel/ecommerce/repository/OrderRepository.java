package com.kodekernel.ecommerce.repository;

import com.kodekernel.ecommerce.model.Order;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    @Query("""
        SELECT o FROM Order o
        JOIN FETCH o.customer
        JOIN FETCH o.shippingAddress
        WHERE o.id = :orderId
    """)
    Optional<Order> fetchOrderDetail(UUID orderId);

    List<Order> findAllByOrderByOrderDateDesc();
}
