package com.kodekernel.ecommerce.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class CreateOrderItemDTO {
    private UUID productId;
    private int quantity;
}
