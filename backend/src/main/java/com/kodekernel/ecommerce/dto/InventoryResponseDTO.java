package com.kodekernel.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryResponseDTO {
    private List<ProductDTO> listedProducts;
    private Double listingValue;
    private List<ProductDTO> lowCountProducts;
}
