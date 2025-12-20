package com.kodekernel.ecommerce.controller;

import com.kodekernel.ecommerce.dto.ProductDTO;
import com.kodekernel.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/{productId}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable UUID productId) {
        return ResponseEntity.ok(productService.getProduct(productId));
    }

    @PostMapping("/{productId}/view")
    public ResponseEntity<Void> incrementView(@PathVariable UUID productId) {
        productService.incrementViewCount(productId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/trending")
    public ResponseEntity<java.util.List<ProductDTO>> getTrending() {
        return ResponseEntity.ok(productService.getTrendingProducts());
    }

    @GetMapping("/best-sellers")
    public ResponseEntity<java.util.List<ProductDTO>> getBestSellers() {
        return ResponseEntity.ok(productService.getBestSellers());
    }

    @GetMapping("/top-deals")
    public ResponseEntity<java.util.List<ProductDTO>> getTopDeals() {
        return ResponseEntity.ok(productService.getTopDeals());
    }

    @GetMapping("/featured")
    public ResponseEntity<java.util.List<ProductDTO>> getFeatured() {
        return ResponseEntity.ok(productService.getFeaturedProducts());
    }
}
