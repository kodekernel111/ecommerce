package com.kodekernel.ecommerce.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
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
    private Boolean active = true;
    private UUID sellerId;

    private String image1;
    private String image2;
    private String image3;
    private String image4;
    private String image5;

    @jakarta.persistence.ElementCollection
    private java.util.List<String> tags;

    private String brand;
    private String sku;
    private String returnPolicy;
    private String warranty;

    @jakarta.persistence.ElementCollection
    @jakarta.persistence.CollectionTable(name = "product_specifications", joinColumns = @jakarta.persistence.JoinColumn(name = "product_id"))
    @jakarta.persistence.MapKeyColumn(name = "spec_key")
    @jakarta.persistence.Column(name = "spec_value")
    private java.util.Map<String, String> specifications;

    private java.time.LocalDateTime createdAt;

    @jakarta.persistence.PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = java.time.LocalDateTime.now();
        }
    }
}
