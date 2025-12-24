package com.kodekernel.ecommerce.repository;

import com.kodekernel.ecommerce.entity.Product;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.UUID;

public class ProductSpecification {

    public static Specification<Product> hasSellerId(UUID sellerId) {
        return (root, query, cb) -> cb.equal(root.get("sellerId"), sellerId);
    }

    public static Specification<Product> containsText(String text) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(text))
                return null;
            String likePattern = "%" + text.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("name")), likePattern),
                    cb.like(cb.lower(root.get("description")), likePattern),
                    cb.like(cb.lower(root.get("brand")), likePattern),
                    cb.like(cb.lower(root.get("sku")), likePattern),
                    cb.like(cb.lower(root.get("category")), likePattern),
                    cb.like(cb.lower(root.get("subCategory")), likePattern),
                    cb.like(cb.lower(root.get("tertiaryCategory")), likePattern));
        };
    }

    public static Specification<Product> hasCategory(String category) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(category))
                return null;
            String likePattern = "%" + category.toLowerCase() + "%";
            return cb.or(
                    cb.equal(root.get("category"), category),
                    cb.equal(root.get("subCategory"), category),
                    cb.equal(root.get("tertiaryCategory"), category),
                    cb.like(cb.lower(root.get("name")), likePattern),
                    cb.like(cb.lower(root.get("brand")), likePattern));
        };
    }

    public static Specification<Product> priceBetween(Double min, Double max) {
        return (root, query, cb) -> {
            if (min == null && max == null)
                return null;
            if (min != null && max != null)
                return cb.between(root.get("price"), min, max);
            if (min != null)
                return cb.greaterThanOrEqualTo(root.get("price"), min);
            return cb.lessThanOrEqualTo(root.get("price"), max);
        };
    }

    public static Specification<Product> isLowStock(boolean lowStock) {
        return (root, query, cb) -> {
            if (!lowStock)
                return null;
            return cb.and(
                    cb.lessThan(root.get("quantity"), 10),
                    cb.greaterThan(root.get("quantity"), 0));
        };
    }

    public static Specification<Product> isOutOfStock(boolean outOfStock) {
        return (root, query, cb) -> {
            if (!outOfStock)
                return null;
            return cb.equal(root.get("quantity"), 0);
        };
    }

    public static Specification<Product> isActive(Boolean active) {
        return (root, query, cb) -> {
            if (active == null)
                return null;
            if (active) {
                // Treat NULL as active for legacy data
                return cb.or(cb.equal(root.get("active"), true), cb.isNull(root.get("active")));
            }
            return cb.equal(root.get("active"), false);
        };
    }

    public static Specification<Product> createdBetween(LocalDateTime startDate,
            LocalDateTime endDate) {
        return (root, query, cb) -> {
            if (startDate == null && endDate == null)
                return null;
            if (startDate != null && endDate != null)
                return cb.between(root.get("createdAt"), startDate, endDate);
            if (startDate != null)
                return cb.greaterThanOrEqualTo(root.get("createdAt"), startDate);
            return cb.lessThanOrEqualTo(root.get("createdAt"), endDate);
        };
    }

    public static Specification<Product> hasMinRating(Double rating) {
        return (root, query, cb) -> {
            if (rating == null || rating <= 0)
                return null;
            return cb.greaterThanOrEqualTo(root.get("averageRating"), rating);
        };
    }

    public static Specification<Product> isInStock(Boolean inStock) {
        return (root, query, cb) -> {
            if (inStock == null || !inStock)
                return null;
            return cb.greaterThan(root.get("quantity"), 0);
        };
    }
}
