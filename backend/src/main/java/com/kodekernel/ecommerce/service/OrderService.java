package com.kodekernel.ecommerce.service;

import com.kodekernel.ecommerce.dto.OrderDTO.*;
import com.kodekernel.ecommerce.model.*;
import com.kodekernel.ecommerce.repository.OrderItemRepository;
import com.kodekernel.ecommerce.repository.OrderRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepo;
    private final OrderItemRepository itemRepo;

    // STATUS TRANSITIONS
    private static final Map<OrderStatus, List<OrderStatus>> allowedTransitions =
            Map.of(
                    OrderStatus.placed, List.of(OrderStatus.shipped, OrderStatus.cancelled),
                    OrderStatus.shipped, List.of(OrderStatus.delivered)
            );

    // 1. LIST ALL ORDERS (SUMMARY TABLE)
    public List<OrderSummaryDTO> getOrderSummary() {
        List<Order> orders = orderRepo.findAllByOrderByOrderDateDesc();

        List<OrderSummaryDTO> summaries = new ArrayList<>();

        for (Order o : orders) {
            int itemCount = o.getItems().size();

            summaries.add(new OrderSummaryDTO(
                    o.getId().toString(),
                    o.getCustomer().getName(),
                    o.getOrderDate().toString(),
                    itemCount,
                    o.getTotalAmount(),
                    o.getStatus().name()
            ));
        }

        return summaries;
    }

    // 2. ORDER DETAILS
    public OrderDetailDTO getOrderDetail(String orderId) {

        UUID id = UUID.fromString(orderId);

        Order order = orderRepo.fetchOrderDetail(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        List<OrderItem> items = itemRepo.findByOrderId(id);

        List<OrderItemDTO> itemDTOs = items.stream().map(oi ->
                new OrderItemDTO(
                        oi.getProduct().getId().toString(),
                        oi.getProduct().getName(),
                        oi.getQuantity(),
                        oi.getPrice(),
                        oi.getPrice().multiply(BigDecimal.valueOf(oi.getQuantity()))
                )
        ).toList();

        Address a = order.getShippingAddress();
        User u = order.getCustomer();

        return new OrderDetailDTO(
                order.getId().toString(),
                order.getOrderDate().toString(),
                order.getStatus().name(),
                order.getTotalAmount(),

                u.getName(),
                u.getEmail(),
                u.getPhone(),

                a.getFullName(),
                a.getLine1(),
                a.getLine2(),
                a.getCity(),
                a.getState(),
                a.getPincode(),
                a.getPhone(),

                itemDTOs
        );
    }

    // 3. UPDATE ORDER STATUS
    public void updateOrderStatus(String orderId, OrderStatus newStatus) {

        Order order = orderRepo.findById(UUID.fromString(orderId))
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderStatus current = order.getStatus();

        if (!allowedTransitions.getOrDefault(current, List.of()).contains(newStatus)) {
            throw new IllegalArgumentException("Invalid transition: " + current + " → " + newStatus);
        }

        order.setStatus(newStatus);
        order.setUpdatedAt(java.time.LocalDateTime.now());

        orderRepo.save(order);
    }
}