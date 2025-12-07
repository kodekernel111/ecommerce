package com.kodekernel.ecommerce.controller;

import com.kodekernel.ecommerce.dto.InventoryResponseDTO;
import com.kodekernel.ecommerce.dto.ProductDTO;
import com.kodekernel.ecommerce.dto.OrderDTO;
import com.kodekernel.ecommerce.entity.OrderStatus;
import com.kodekernel.ecommerce.service.OrderService;
import com.kodekernel.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/seller")
@CrossOrigin(origins = "*")
public class SellerController {

    @Autowired
    private ProductService productService;

    @GetMapping("/inventory")
    public ResponseEntity<InventoryResponseDTO> getInventory(@RequestParam(required = true) UUID sellerId) {
        return ResponseEntity.ok(productService.getInventory(sellerId));
    }

    @PostMapping(value = "/list-new-product/{sellerId}", consumes = { "multipart/form-data" })
    public ResponseEntity<ProductDTO> listNewProduct(
            @PathVariable UUID sellerId,
            @RequestPart("product") ProductDTO productDTO,
            @RequestPart("image") MultipartFile image) {
        return ResponseEntity.ok(productService.listNewProduct(sellerId, productDTO, image));
    }

    @PutMapping(value = "/update-listed-product/{productId}", consumes = { "multipart/form-data" })
    public ResponseEntity<ProductDTO> updateListedProduct(
            @PathVariable UUID productId,
            @RequestPart("product") ProductDTO productDTO,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        return ResponseEntity.ok(productService.updateProduct(productId, productDTO, image));
    }

    @DeleteMapping("/delete-listed-product/{productId}")
    public ResponseEntity<Map<String, String>> deleteListedProduct(@PathVariable UUID productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.ok(Map.of("message", "Successfully Deleted"));
    }

    @Autowired
    private OrderService orderService;

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDTO>> getOrders(
            @RequestParam(required = false) UUID sellerId) {
        // Defaulting to a specific UUID if null for testing, or require it.
        // For now, let's assume it's passed or we handle null in service (which would
        // return empty list).
        if (sellerId == null) {
            // For MVP, maybe return all orders or throw error. Let's return empty or handle
            // in service.
            // But repository expects non-null. Let's make it required or use a dummy one.
            // Given previous pattern, let's require it.
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(orderService.getOrders(sellerId));
    }

    @PutMapping("/change-order-status/{orderId}")
    public ResponseEntity<OrderDTO> changeOrderStatus(@PathVariable UUID orderId,
            @RequestBody OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }
}
