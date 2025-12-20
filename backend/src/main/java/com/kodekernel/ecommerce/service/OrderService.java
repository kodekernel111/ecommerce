package com.kodekernel.ecommerce.service;

import com.kodekernel.ecommerce.dto.OrderDetailDTO;
import com.kodekernel.ecommerce.dto.OrderItemDTO;
import com.kodekernel.ecommerce.dto.OrderSummaryDTO;
import com.kodekernel.ecommerce.entity.*;

import com.kodekernel.ecommerce.repository.OrderItemRepository;
import com.kodekernel.ecommerce.repository.OrderRepository;
import com.kodekernel.ecommerce.repository.AddressRepository;
import com.kodekernel.ecommerce.repository.ProductRepository;
import com.kodekernel.ecommerce.repository.UserRepository;
import com.kodekernel.ecommerce.repository.OrderSpecification;
import com.kodekernel.ecommerce.dto.OrderListResponseDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private OrderItemRepository itemRepo;

    @Autowired
    private AddressRepository addressRepo;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ProductService productService;

    // STATUS TRANSITIONS
    private static final Map<OrderStatus, List<OrderStatus>> allowedTransitions = Map.of(
            OrderStatus.PENDING, List.of(OrderStatus.PROCESSING, OrderStatus.CANCELLED),
            OrderStatus.PROCESSING, List.of(OrderStatus.SHIPPED, OrderStatus.CANCELLED),
            OrderStatus.SHIPPED, List.of(OrderStatus.DELIVERED, OrderStatus.CANCELLED));

    // 1. LIST ALL ORDERS (SUMMARY TABLE)
    public OrderListResponseDTO getOrderSummary(UUID sellerId, int page, int size,
            String status, String search, String startDate, String endDate) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC,
                        "orderDate"));

        Specification<Order> spec = OrderSpecification
                .hasSellerId(sellerId);

        if (status != null && !status.isEmpty()) {
            spec = spec.and(OrderSpecification.hasStatus(status));
        }

        if (search != null && !search.isEmpty()) {
            spec = spec.and(OrderSpecification.search(search));
        }

        if ((startDate != null && !startDate.isEmpty()) || (endDate != null && !endDate.isEmpty())) {
            LocalDate start = null;
            LocalDate end = null;
            try {
                if (startDate != null && !startDate.isEmpty())
                    start = LocalDate.parse(startDate);
                if (endDate != null && !endDate.isEmpty())
                    end = LocalDate.parse(endDate);
            } catch (Exception e) {
                // Ignore parsing errors
            }
            spec = spec.and(OrderSpecification.createdBetween(start, end));
        }

        Page<Order> ordersPage = orderRepo.findAll(spec, pageable);

        List<OrderSummaryDTO> summaries = new ArrayList<>();

        for (Order o : ordersPage.getContent()) {
            int itemCount = o.getItems().size();

            String itemsSummary = "";
            String image = null;
            if (!o.getItems().isEmpty()) {
                OrderItem firstItem = o.getItems().get(0);
                itemsSummary = firstItem.getQuantity() + "x " + firstItem.getProduct().getName();
                if (itemCount > 1) {
                    itemsSummary += " + " + (itemCount - 1) + " others";
                }
                // Get primary image
                Product p = firstItem.getProduct();
                image = p.getImage1() != null ? p.getImage1() : p.getImage();
            }

            summaries.add(new OrderSummaryDTO(
                    o.getId().toString(),
                    o.getCustomer().getName(),
                    o.getOrderDate().toString(),
                    itemCount,
                    o.getTotalAmount(),
                    o.getStatus().name(),
                    itemsSummary,
                    image));
        }

        return new OrderListResponseDTO(summaries, ordersPage.getTotalPages(),
                ordersPage.getTotalElements());
    }

    // 2. ORDER DETAILS
    public OrderDetailDTO getOrderDetail(String orderId) {

        UUID id = UUID.fromString(orderId);

        Order order = orderRepo.fetchOrderDetail(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        List<OrderItem> items = itemRepo.findByOrderId(id);

        List<OrderItemDTO> itemDTOs = items.stream().map(oi -> new OrderItemDTO(
                oi.getProduct().getId(),
                oi.getProduct().getName(),
                oi.getQuantity(),
                oi.getPrice(),
                oi.getPrice().multiply(BigDecimal.valueOf(oi.getQuantity())),
                oi.getProduct().getImage())).toList();

        Address a = order.getShippingAddress();
        User u = order.getCustomer();

        return new OrderDetailDTO(
                order.getId().toString(),
                order.getOrderDate().toString(),
                order.getStatus().name(),
                order.getTotalAmount(),
                order.getPaymentMethod(),
                order.getShippingMethod(),
                order.getNotes(),

                u.getName(),
                u.getUsername(),
                u.getPhone(),

                a.getFullName(),
                a.getLine1(),
                a.getLine2(),
                a.getCity(),
                a.getState(),
                a.getPincode(),
                a.getPhone(),

                itemDTOs);
    }

    // 3. UPDATE ORDER STATUS
    public void updateOrderStatus(@NonNull String orderId, OrderStatus newStatus) {

        Order order = orderRepo.findById(UUID.fromString(orderId))
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderStatus current = order.getStatus();

        if (!allowedTransitions.getOrDefault(current, List.of()).contains(newStatus)) {
            throw new IllegalArgumentException("Invalid transition: " + current + " → " + newStatus);
        }

        order.setStatus(newStatus);

        orderRepo.save(order);
    }

    public void createDummyOrders(UUID sellerId) {
        // 1. Get Seller's Products
        List<Product> products = productRepo.findBySellerId(sellerId);
        if (products.isEmpty()) {
            throw new RuntimeException("Seller has no products to create orders for");
        }

        // 2. Get or Create a Dummy Customer
        User customer = userRepo.findByUsernameOrEmail("dummy_customer", "dummy@example.com")
                .orElseGet(() -> {
                    User u = new User();
                    u.setName("Dummy Customer");
                    u.setUsername("dummy_customer");
                    u.setEmail("dummy@example.com");
                    u.setPassword("password"); // Dummy password
                    u.setRole(Role.USER);
                    return userRepo.save(u);
                });

        // 3. Create 5 Dummy Orders
        for (int i = 0; i < 5; i++) {
            Order order = new Order();
            order.setCustomer(customer);
            order.setCustomer(customer);
            order.setSellerId(sellerId);
            order.setOrderDate(LocalDate.now().minusDays((long) (Math.random() * 10)));
            order.setStatus(OrderStatus.values()[(int) (Math.random() * OrderStatus.values().length)]);
            order.setPaymentMethod("Credit Card");
            order.setShippingMethod("Standard Shipping");
            order.setNotes("Please leave at the front door.");

            // Create Dummy Address
            Address address = new Address();
            address.setFullName("Dummy Customer " + i);
            address.setLine1("123 Dummy St");
            address.setCity("Dummy City");
            address.setState("Dummy State");
            address.setPincode("123456");
            address.setPhone("555-010" + i);
            address = addressRepo.save(address);
            order.setShippingAddress(address);

            // Add Random Items
            List<OrderItem> items = new ArrayList<>();
            BigDecimal total = BigDecimal.ZERO;
            int itemCount = (int) (Math.random() * 3) + 1; // 1 to 3 items

            // Save order first to get ID (if needed by items, but items need order)
            // We need to save order to get ID, then save items with order reference
            order = orderRepo.save(order);

            for (int j = 0; j < itemCount; j++) {
                Product p = products.get((int) (Math.random() * products.size()));
                OrderItem item = new OrderItem();
                item.setOrder(order);
                item.setProduct(p);
                item.setQuantity((int) (Math.random() * 2) + 1);
                item.setPrice(BigDecimal.valueOf(p.getPrice()));

                total = total.add(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
                items.add(item);
            }

            itemRepo.saveAll(items);
            productService.updateSalesMetrics(items);

            order.setTotalAmount(total);
            order.setItems(items);
            orderRepo.save(order);
        }
    }
}
