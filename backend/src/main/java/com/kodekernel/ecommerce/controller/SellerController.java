package com.kodekernel.ecommerce.controller;

import com.kodekernel.ecommerce.dto.InventoryResponseDTO;
import com.kodekernel.ecommerce.dto.ProductDTO;

import com.kodekernel.ecommerce.dto.OrderDetailDTO;
import com.kodekernel.ecommerce.dto.OrderListResponseDTO;
import com.kodekernel.ecommerce.dto.OrderSummaryDTO;
import com.kodekernel.ecommerce.entity.Coupon;
import com.kodekernel.ecommerce.entity.OrderStatus;
import com.kodekernel.ecommerce.service.CouponService;
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

    @Autowired
    private CouponService couponService;

    @Autowired
    private OrderService orderService;

    @GetMapping("/inventory")
    public ResponseEntity<InventoryResponseDTO> getInventory(
            @RequestParam(required = true) UUID sellerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String stockStatus,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return ResponseEntity.ok(
                productService.getInventory(sellerId, page, size, search, category, minPrice, maxPrice, stockStatus,
                        startDate, endDate));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable UUID productId) {
        return ResponseEntity.ok(productService.getProduct(productId));
    }

    @PostMapping(value = "/list-new-product/{sellerId}", consumes = { "multipart/form-data" })
    public ResponseEntity<ProductDTO> listNewProduct(
            @PathVariable UUID sellerId,
            @RequestPart("product") ProductDTO productDTO,
            @RequestPart("images") List<MultipartFile> images) {
        return ResponseEntity.ok(productService.listNewProduct(sellerId, productDTO, images));
    }

    @PutMapping(value = "/update-listed-product/{productId}", consumes = { "multipart/form-data" })
    public ResponseEntity<ProductDTO> updateListedProduct(
            @PathVariable UUID productId,
            @RequestPart("product") ProductDTO productDTO,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        return ResponseEntity.ok(productService.updateProduct(productId, productDTO, images));
    }

    @DeleteMapping("/delete-listed-product/{productId}")
    public ResponseEntity<Map<String, String>> deleteListedProduct(@PathVariable UUID productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.ok(Map.of("message", "Successfully Deleted"));
    }

    @PostMapping("/dummy-orders/{sellerId}")
    public ResponseEntity<Map<String, String>> createDummyOrders(@PathVariable UUID sellerId) {
        orderService.createDummyOrders(sellerId);
        return ResponseEntity.ok(Map.of("message", "Dummy orders created successfully"));
    }

    @GetMapping("/orders")
    public OrderListResponseDTO listOrders(
            @RequestParam(required = true) UUID sellerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return orderService.getOrderSummary(sellerId, page, size, status, search, startDate, endDate);
    }

    @GetMapping("/{orderId}")
    public OrderDetailDTO getDetails(@PathVariable String orderId) {
        return orderService.getOrderDetail(orderId);
    }

    @PatchMapping("/{orderId}/status")
    public String updateStatus(@PathVariable String orderId, @RequestBody String status) {
        orderService.updateOrderStatus(orderId, OrderStatus.valueOf(status));
        return "Updated to " + status;
    }

    @GetMapping("/coupons")
    public List<Coupon> listCoupons() {
        return couponService.listCoupons();
    }

    @DeleteMapping("/coupons/{code}")
    public ResponseEntity<Map<String, String>> deleteCoupon(@PathVariable String code) {
        couponService.deleteCoupon(code);
        return ResponseEntity.ok(Map.of("message", "Successfully Deleted"));
    }

    @PostMapping("/coupons/addCoupon")
    public ResponseEntity<Coupon> addCoupon(@RequestBody Coupon coupon) {
        return ResponseEntity.ok(couponService.addCoupon(coupon));
    }
}
