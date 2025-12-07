package com.kodekernel.ecommerce.service;

import com.kodekernel.ecommerce.dto.OrderDTO;
import com.kodekernel.ecommerce.dto.OrderItemDTO;
import com.kodekernel.ecommerce.entity.Order;
import com.kodekernel.ecommerce.entity.OrderItem;
import com.kodekernel.ecommerce.entity.OrderStatus;
import com.kodekernel.ecommerce.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public List<OrderDTO> getOrders(UUID sellerId) {
        List<Order> orders = orderRepository.findBySellerId(sellerId);
        return orders.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public OrderDTO updateOrderStatus(UUID orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);
        return convertToDTO(updatedOrder);
    }

    private OrderDTO convertToDTO(Order order) {
        List<OrderItemDTO> itemDTOs = order.getItems().stream()
                .map(item -> new OrderItemDTO(item.getProductName(), item.getQuantity(), item.getPrice()))
                .collect(Collectors.toList());

        return new OrderDTO(
                order.getId(),
                order.getUserId(),
                order.getOrderDate(),
                itemDTOs,
                order.getTotalAmount(),
                order.getStatus());
    }
}
