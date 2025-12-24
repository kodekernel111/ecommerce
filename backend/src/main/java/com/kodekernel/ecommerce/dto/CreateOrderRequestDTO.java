package com.kodekernel.ecommerce.dto;

import lombok.Data;
import java.util.List;

@Data
public class CreateOrderRequestDTO {
    private String fullName;
    private String phone;
    private String line1;
    private String line2;
    private String city;
    private String state;
    private String pincode;

    private String paymentMethod;

    // Payment Details
    private String cardNumber;
    private String cardExpiry;
    private String cardCvc;
    private String upiId;
    private String bankName;

    private List<CreateOrderItemDTO> items;
}
