package com.kodekernel.ecommerce.repository;

import com.kodekernel.ecommerce.dto.OrderDTO.*;
import com.kodekernel.ecommerce.model.OrderStatus;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
@RequiredArgsConstructor
public class OrderRepository {
    
    private final NamedParameterJdbcTemplate jdbc;

    // 1. FETCH ALL ORDERS FOR SELLER DASHBOARD
    public List<OrderSummaryDTO> findAllOrders() {
        String sql = """
            SELECT 
                o.id AS order_id,
                u.name AS customer,
                o.order_date AS date,
                (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) AS items,
                o.total_amount AS total,
                o.status
            FROM orders o
            JOIN users u ON u.id = o.customer_id
            ORDER BY o.order_date DESC
        """;

        return jdbc.query(sql, (rs, rowNum) -> new OrderSummaryDTO(
                rs.getString("order_id"),
                rs.getString("customer"),
                rs.getString("date"),
                rs.getInt("items"),
                rs.getBigDecimal("total"),
                rs.getString("status")
        ));
    }

    // 2. FETCH FULL ORDER DETAILS FOR A SPECIFIC ORDER
    public OrderDetailDTO findOrderDetail(String orderId) {

        String sql = """
            SELECT 
                o.id AS order_id,
                o.order_date,
                o.status,
                o.total_amount,
                
                u.name AS customer_name,
                u.email AS customer_email,
                u.phone AS customer_phone,

                a.full_name,
                a.line1,
                a.line2,
                a.city,
                a.state,
                a.pincode,
                a.phone AS address_phone

            FROM orders o
            JOIN users u ON u.id = o.customer_id
            JOIN addresses a ON a.id = o.address_id
            WHERE o.id = :orderId
        """;

        Map<String, Object> params = Map.of("orderId", orderId);

        OrderDetailDTO[] container = new OrderDetailDTO[1];

        jdbc.query(sql, params, rs -> {
            container[0] = new OrderDetailDTO(
                    rs.getString("order_id"),
                    rs.getString("order_date"),
                    rs.getString("status"),
                    rs.getBigDecimal("total_amount"),

                    rs.getString("customer_name"),
                    rs.getString("customer_email"),
                    rs.getString("customer_phone"),

                    rs.getString("full_name"),
                    rs.getString("line1"),
                    rs.getString("line2"),
                    rs.getString("city"),
                    rs.getString("state"),
                    rs.getString("pincode"),
                    rs.getString("address_phone"),

                    findOrderItems(orderId)
            );
        });

        return container[0];
    }

    // 3. FETCH ORDER ITEMS
    public List<OrderItemDTO> findOrderItems(String orderId) {

        String sql = """
            SELECT 
                oi.product_id,
                p.name,
                oi.quantity,
                oi.price,
                (oi.quantity * oi.price) AS total
            FROM order_items oi
            JOIN products p ON p.id = oi.product_id
            WHERE oi.order_id = :orderId
        """;

        return jdbc.query(sql, Map.of("orderId", orderId),
                (rs, rowNum) -> new OrderItemDTO(
                        rs.getString("product_id"),
                        rs.getString("name"),
                        rs.getInt("quantity"),
                        rs.getBigDecimal("price"),
                        rs.getBigDecimal("total")
                ));
    }

    // 4. UPDATE ORDER STATUS
    public int updateStatus(String orderId, OrderStatus newStatus) {
        String sql = """
            UPDATE orders
            SET status = :newStatus, updated_at = NOW()
            WHERE id = :orderId
        """;

        return jdbc.update(sql, Map.of(
                "newStatus", newStatus.name(),
                "orderId", orderId
        ));
    }

    // Get current status before updating
    public OrderStatus getStatus(String orderId) {
        String sql = "SELECT status FROM orders WHERE id = :orderId";

        String status = jdbc.queryForObject(sql, Map.of("orderId", orderId), String.class);

        return OrderStatus.valueOf(status);
    }
}
