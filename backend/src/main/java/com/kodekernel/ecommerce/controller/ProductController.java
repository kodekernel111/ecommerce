package com.kodekernel.ecommerce.controller;

import com.kodekernel.ecommerce.dto.ProductDTO;
import com.kodekernel.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
    public ResponseEntity<java.util.List<ProductDTO>> getTopDeals(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(productService.getTopDeals(category));
    }

    @GetMapping
    public ResponseEntity<Page<ProductDTO>> browseProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(defaultValue = "newest") String sort) {
        return ResponseEntity.ok(productService.browseProducts(page, size, search, category, minPrice, maxPrice,
                minRating, inStock, sort));
    }

    @GetMapping("/featured")
    public ResponseEntity<java.util.List<ProductDTO>> getFeatured() {
        return ResponseEntity.ok(productService.getFeaturedProducts());
    }
}
