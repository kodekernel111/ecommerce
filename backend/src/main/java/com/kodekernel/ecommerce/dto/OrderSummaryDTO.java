package com.kodekernel.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderSummaryDTO {
    private String orderId;
    private String customer;
    private String date;
    private Integer items;
    private BigDecimal total;
    private String status;
}