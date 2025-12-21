package com.kodekernel.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuggestionDTO {
    private String text;
    private String type; // "PRODUCT", "CATEGORY", "BRAND"
    private String id; // Optional, for direct navigation
}
