package com.kodekernel.ecommerce.controller;

import com.kodekernel.ecommerce.dto.ReviewDTO;
import com.kodekernel.ecommerce.entity.User;
import com.kodekernel.ecommerce.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // Added import for Authentication
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/products/{productId}/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(
            @PathVariable UUID productId,
            @RequestParam("rating") Integer rating,
            @RequestParam("comment") String comment,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        return ResponseEntity
                .ok(reviewService.createReview(productId, user.getName(), user.getId(), rating, comment, images));
    }

    @GetMapping
    public ResponseEntity<List<ReviewDTO>> getReviews(@PathVariable UUID productId) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId));
    }
}
