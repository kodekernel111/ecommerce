package com.kodekernel.ecommerce.service;

import com.kodekernel.ecommerce.dto.ReviewDTO;
import com.kodekernel.ecommerce.entity.Product;
import com.kodekernel.ecommerce.entity.Review;
import com.kodekernel.ecommerce.repository.ProductRepository;
import com.kodekernel.ecommerce.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final S3Service s3Service;

    @SuppressWarnings("null")
    public ReviewDTO createReview(UUID productId, String userName, UUID userId, Integer rating, String comment,
            List<MultipartFile> images) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Review review = reviewRepository.findByProductIdAndUserId(productId, userId)
                .orElse(new Review());

        if (review.getId() == null) {
            review.setProduct(product);
            review.setUserId(userId);
        }

        review.setUserName(userName);
        review.setRating(rating);
        review.setComment(comment);

        List<String> imageUrls = new ArrayList<>();
        // If updating, keep existing images unless new ones are provided?
        // Logic: if new images provided, append/replace?
        // Simple logic: if new images provided, add them. Existing ones valid.
        if (review.getImages() != null) {
            imageUrls.addAll(review.getImages());
        }

        if (images != null && !images.isEmpty()) {
            for (MultipartFile img : images) {
                if (!img.isEmpty()) {
                    imageUrls.add(s3Service.uploadFile(img));
                }
            }
        }
        review.setImages(imageUrls);

        Review savedReview = reviewRepository.save(review);
        return convertToDTO(savedReview);
    }

    public List<ReviewDTO> getProductReviews(UUID productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ReviewDTO convertToDTO(Review review) {
        return ReviewDTO.builder()
                .id(review.getId())
                .productId(review.getProduct().getId())
                .userName(review.getUserName())
                .userId(review.getUserId())
                .rating(review.getRating())
                .comment(review.getComment())
                .images(review.getImages())
                .createdAt(review.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")))
                .build();
    }
}
