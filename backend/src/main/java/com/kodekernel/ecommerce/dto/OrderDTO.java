package com.kodekernel.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import com.kodekernel.ecommerce.entity.OrderStatus;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private UUID id;
    private UUID userId;
    private LocalDate date;
    private List<OrderItemDTO> items;
    private Double total;
    private OrderStatus status;
}
