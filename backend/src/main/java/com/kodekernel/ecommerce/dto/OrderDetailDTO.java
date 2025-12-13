package com.kodekernel.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailDTO {
    private String orderId;
    private String orderDate;
    private String status;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String shippingMethod;
    private String notes;

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