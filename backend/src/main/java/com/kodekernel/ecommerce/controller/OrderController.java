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

    private final OrderService orderService;

    @GetMapping
    public List<OrderSummaryDTO> listOrders() {
        return orderService.getOrderSummary();
    }

    @GetMapping("/{orderId}")
    public OrderDetailDTO getDetails(@PathVariable String orderId) {
        return orderService.getOrderDetail(orderId);
    }

    @PatchMapping("/{orderId}/status")
    public String updateStatus(@PathVariable String orderId, @RequestBody StatusRequest req) {
        orderService.updateOrderStatus(orderId, OrderStatus.valueOf(req.status()));
        return "Updated to " + req.status();
    }

    public record StatusRequest(String status) {}
}
