package com.kodekernel.ecommerce.service;

import com.kodekernel.ecommerce.dto.AddressDTO;
import com.kodekernel.ecommerce.dto.OrderDTO;
import com.kodekernel.ecommerce.dto.OrderDetailDTO;
import com.kodekernel.ecommerce.dto.OrderItemDTO;
import com.kodekernel.ecommerce.dto.OrderSummaryDTO;
import com.kodekernel.ecommerce.entity.*;

import com.kodekernel.ecommerce.repository.OrderItemRepository;
import com.kodekernel.ecommerce.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private OrderItemRepository itemRepo;

    // STATUS TRANSITIONS
    private static final Map<OrderStatus, List<OrderStatus>> allowedTransitions = java.util.Map.of(
            OrderStatus.PENDING, List.of(OrderStatus.SHIPPED, OrderStatus.CANCELLED),
            OrderStatus.SHIPPED, List.of(OrderStatus.DELIVERED));

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
                    o.getStatus().name()));
        }

        return summaries;
    }

    // 2. ORDER DETAILS
    public OrderDetailDTO getOrderDetail(String orderId) {

        UUID id = UUID.fromString(orderId);

        Order order = orderRepo.fetchOrderDetail(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        List<OrderItem> items = itemRepo.findByOrderId(id);

        List<OrderItemDTO> itemDTOs = items.stream().map(oi -> new OrderItemDTO(
                oi.getProduct().getId(),
                oi.getProduct().getName(),
                oi.getQuantity(),
                oi.getPrice(),
                oi.getPrice().multiply(BigDecimal.valueOf(oi.getQuantity())))).toList();

        Address a = order.getShippingAddress();
        User u = order.getCustomer();

        return new OrderDetailDTO(
                order.getId().toString(),
                order.getOrderDate().toString(),
                order.getStatus().name(),
                order.getTotalAmount(),

                u.getName(),
                u.getUsername(),
                u.getPhone(),

                a.getFullName(),
                a.getLine1(),
                a.getLine2(),
                a.getCity(),
                a.getState(),
                a.getPincode(),
                a.getPhone(),

                itemDTOs);
    }

    // 3. UPDATE ORDER STATUS
    public void updateOrderStatus(@NonNull String orderId, OrderStatus newStatus) {

        Order order = orderRepo.findById(UUID.fromString(orderId))
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderStatus current = order.getStatus();

        if (!allowedTransitions.getOrDefault(current, List.of()).contains(newStatus)) {
            throw new IllegalArgumentException("Invalid transition: " + current + " → " + newStatus);
        }

        order.setStatus(newStatus);

        orderRepo.save(order);
    }

    // public List<OrderDTO> getOrders(UUID sellerId) {
    // List<Order> orders = orderRepository.findBySellerId(sellerId);
    // return orders.stream().map(this::convertToDTO).collect(Collectors.toList());
    // }

    // public OrderDTO updateOrderStatus(UUID orderId, OrderStatus status) {
    // Order order = orderRepository.findById(orderId)
    // .orElseThrow(() -> new RuntimeException("Order not found"));
    // order.setStatus(status);
    // Order updatedOrder = orderRepository.save(order);
    // return convertToDTO(updatedOrder);
    // }

    // private OrderDTO convertToDTO(Order order) {
    // List<OrderItemDTO> itemDTOs = order.getItems().stream()
    // .map(item -> new OrderItemDTO(
    // item.getProduct().getId(),
    // item.getProduct().getName(),
    // item.getQuantity(),
    // item.getPrice()))
    // .collect(Collectors.toList());

    // AddressDTO addressDTO = null;
    // if (order.getShippingAddress() != null) {
    // addressDTO = convertToAddressDTO(order.getShippingAddress());
    // }

    // return new OrderDTO(
    // order.getId(),
    // order.getCustomer() != null ? order.getCustomer().getId() : null,
    // order.getOrderDate(),
    // itemDTOs,
    // order.getTotalAmount(),
    // order.getStatus(),
    // addressDTO);
    // }

    // private AddressDTO convertToAddressDTO(Address address) {
    // return new AddressDTO(
    // address.getId(),
    // address.getFullName(),
    // address.getPhone(),
    // address.getLine1(),
    // address.getLine2(),
    // address.getCity(),
    // address.getState(),
    // address.getPincode());
    // }
}
