package com.kodekernel.ecommerce.repository;

import com.kodekernel.ecommerce.entity.Order;
import com.kodekernel.ecommerce.entity.OrderStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.UUID;
import jakarta.persistence.criteria.JoinType;

public class OrderSpecification {

    public static Specification<Order> hasSellerId(UUID sellerId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("sellerId"), sellerId);
    }

    public static Specification<Order> search(String text) {
        return (root, query, criteriaBuilder) -> {
            if (text == null || text.isEmpty()) {
                return null;
            }
            if (query != null) {
                query.distinct(true);
            }
            String searchPattern = "%" + text.toLowerCase() + "%";
            return criteriaBuilder.or(
                    criteriaBuilder.like(
                            criteriaBuilder.lower(criteriaBuilder.function("text", String.class, root.get("id"))),
                            searchPattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.join("customer", JoinType.LEFT).get("name")),
                            searchPattern));
        };
    }

    public static Specification<Order> hasStatus(String status) {
        return (root, query, criteriaBuilder) -> {
            if (status == null || status.isEmpty() || status.equals("ALL")) {
                return null;
            }
            try {
                return criteriaBuilder.equal(root.get("status"), OrderStatus.valueOf(status));
            } catch (IllegalArgumentException e) {
                return null;
            }
        };
    }

    public static Specification<Order> createdBetween(LocalDate startDate, LocalDate endDate) {
        return (root, query, criteriaBuilder) -> {
            if (startDate == null && endDate == null) {
                return null;
            }
            if (startDate != null && endDate != null) {
                return criteriaBuilder.between(root.get("orderDate"), startDate, endDate);
            }
            if (startDate != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("orderDate"), startDate);
            }
            // endDate != null
            return criteriaBuilder.lessThanOrEqualTo(root.get("orderDate"), endDate);
        };
    }
}
