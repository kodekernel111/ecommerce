package com.kodekernel.ecommerce.controller;

import com.kodekernel.ecommerce.dto.OrderDTO.*;
import com.kodekernel.ecommerce.model.OrderStatus;
import com.kodekernel.ecommerce.service.OrderService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/seller/orders")
@RequiredArgsConstructor

public class OrderController {
    
    private final OrderService service;

    // 1. LIST ALL ORDERS (SUMMARY)
    @GetMapping
    public List<OrderSummaryDTO> getAllOrders() {
        return service.getAllOrders();
    }

    // 2. GET ORDER DETAILS
    @GetMapping("/{orderId}")
    public OrderDetailDTO getOrderDetails(@PathVariable String orderId) {
        return service.getOrderDetail(orderId);
    }

    // 3. UPDATE ORDER STATUS
    @PatchMapping("/{orderId}/status")
    public String updateOrderStatus(
            @PathVariable String orderId,
            @RequestBody StatusRequest req
    ) {
        service.updateOrderStatus(orderId, OrderStatus.valueOf(req.status()));
        return "Order status updated to " + req.status();
    }

    public record StatusRequest(String status) {}
}
