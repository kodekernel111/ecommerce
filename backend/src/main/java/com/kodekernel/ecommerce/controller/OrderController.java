package com.kodekernel.ecommerce.controller;

import com.kodekernel.ecommerce.dto.CreateOrderRequestDTO;
import com.kodekernel.ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.kodekernel.ecommerce.dto.OrderSummaryDTO;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<UUID> createOrder(@RequestBody CreateOrderRequestDTO request,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        UUID orderId = orderService.createOrder(request, userDetails.getUsername());
        return ResponseEntity.ok(orderId);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderSummaryDTO>> getUserOrders(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        List<OrderSummaryDTO> orders = orderService.getUserOrders(userDetails.getUsername());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<com.kodekernel.ecommerce.dto.OrderDetailDTO> getOrderDetails(@PathVariable String orderId,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(orderService.getOrderDetailForUser(orderId, userDetails.getUsername()));
    }
}
