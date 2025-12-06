package com.kodekernel.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

public class OrderDTO {

    // ORDER SUMMARY DTO
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderSummaryDTO {
        private String orderId;
        private String customer;
        private String date;
        private Integer items;
        private BigDecimal total;
        private String status;
    }

    // ORDER ITEM DTO
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemDTO {
        private String productId;
        private String name;
        private Integer quantity;
        private BigDecimal price;
        private BigDecimal total;
    }

    // ORDER DETAIL DTO
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderDetailDTO {
        private String orderId;
        private String orderDate;
        private String status;
        private BigDecimal totalAmount;

        private String customerName;
        private String customerEmail;
        private String customerPhone;

        private String fullName;
        private String line1;
        private String line2;
        private String city;
        private String state;
        private String pincode;
        private String phone;

        private List<OrderItemDTO> items;
    }
}
