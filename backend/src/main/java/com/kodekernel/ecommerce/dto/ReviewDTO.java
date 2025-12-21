package com.kodekernel.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDTO {
    private UUID id;
    private UUID productId;
    private String userName;
    private UUID userId;
    private Integer rating;
    private String comment;
    private List<String> images;
    private String createdAt; // Sending as String for easy formatting
}
