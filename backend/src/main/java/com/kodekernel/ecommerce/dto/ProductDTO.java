package com.kodekernel.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private UUID id;
    private String name;
    private String description;
    private Double price;
    private Double mrp;
    private Integer discount;
    private Integer quantity;
    private String category;
    private String subCategory;
    private String image;
    private Boolean active;
    private UUID sellerId;
    private java.util.List<String> tags;
    private java.util.List<String> images;
    private String brand;
    private String sku;
    private String returnPolicy;
    private String warranty;
    private java.util.Map<String, String> specifications;
}
