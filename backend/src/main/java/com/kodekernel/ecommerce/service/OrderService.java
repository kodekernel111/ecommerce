package com.kodekernel.ecommerce.service;

import com.kodekernel.ecommerce.dto.OrderDTO.*;
import com.kodekernel.ecommerce.model.OrderStatus;
import com.kodekernel.ecommerce.repository.OrderRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository repo;

    // Allowed transitions
    private static final Map<OrderStatus, List<OrderStatus>> allowedTransitions =
            Map.of(
                    OrderStatus.placed, List.of(OrderStatus.shipped, OrderStatus.cancelled),
                    OrderStatus.shipped, List.of(OrderStatus.delivered)
            );

    // SELLER DASHBOARD — ORDER SUMMARY TABLE
    public List<OrderSummaryDTO> getAllOrders() {
        return repo.findAllOrders();
    }

    // FULL ORDER DETAILS PAGE
    public OrderDetailDTO getOrderDetail(String orderId) {
        return repo.findOrderDetail(orderId);
    }

    // UPDATE STATUS WITH VALIDATION
    public void updateOrderStatus(String orderId, OrderStatus newStatus) {

        OrderStatus currentStatus = repo.getStatus(orderId);

        if (!allowedTransitions.getOrDefault(currentStatus, List.of()).contains(newStatus)) {
            throw new IllegalArgumentException(
                    "Invalid status transition: " + currentStatus + " → " + newStatus
            );
        }

        repo.updateStatus(orderId, newStatus);
    }
    
}
