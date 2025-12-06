package com.kodekernel.ecommerce.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import com.kodekernel.ecommerce.model.OrderItem;
import java.util.*;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {
    List<OrderItem> findByOrderId(UUID orderId);
}

