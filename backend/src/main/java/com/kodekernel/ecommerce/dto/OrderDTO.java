package com.kodekernel.ecommerce.dto;

import java.math.BigDecimal;
import java.util.List;

public class OrderDTO {
    
    // SUMMARY ROW FOR SELLER TABLE VIEW
    public record OrderSummaryDTO(
            String orderId,
            String customer,
            String date,
            Integer items,
            BigDecimal total,
            String status
    ) {}

    // ONE ITEM INSIDE ORDER DETAILS
    public record OrderItemDTO(
            String productId,
            String name,
            Integer quantity,
            BigDecimal price,
            BigDecimal total
    ) {}

    // FULL ORDER DETAILS PAGE FOR SELLER
    public record OrderDetailDTO(
            String orderId,
            String orderDate,
            String status,
            BigDecimal totalAmount,

            // customer info
            String customerName,
            String customerEmail,
            String customerPhone,

            // shipping address
            String fullName,
            String line1,
            String line2,
            String city,
            String state,
            String pincode,
            String phone,

            List<OrderItemDTO> items
    ) {}

}
