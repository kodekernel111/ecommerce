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
import com.kodekernel.ecommerce.dto.CreateOrderRequestDTO;
import com.kodekernel.ecommerce.dto.CreateOrderItemDTO;

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

    public OrderDetailDTO getOrderDetailForUser(String orderId, String username) {
        UUID id = UUID.fromString(orderId);
        Order order = orderRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getCustomer().getUsername().equals(username)) {
            throw new RuntimeException("Access Denied: You cannot view this order.");
        }

        return getOrderDetail(orderId);
    }

    // 3. UPDATE ORDER STATUS
    public void updateOrderStatus(@NonNull String orderId, OrderStatus newStatus) {

        // Validating UUID format to prevent unchecked conversion warning
        UUID uuid;
        try {
            uuid = UUID.fromString(orderId);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid Order ID format");
        }

        Order order = orderRepo.findById(uuid)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderStatus current = order.getStatus();

        if (!allowedTransitions.getOrDefault(current, List.of()).contains(newStatus)) {
            throw new IllegalArgumentException("Invalid transition: " + current + " → " + newStatus);
        }

        order.setStatus(newStatus);

        orderRepo.save(order);
    }

    // 4. CREATE ORDER
    public UUID createOrder(CreateOrderRequestDTO request, String username) {
        // 1. Get User
        User user = userRepo.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Validate Payment Details & Simulate Processing
        String paymentMethod = request.getPaymentMethod();
        if (paymentMethod == null)
            throw new RuntimeException("Payment method is required");

        String transactionId = "TXN_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        switch (paymentMethod.toLowerCase()) {
            case "card":
                if (request.getCardNumber() == null || request.getCardNumber().replace(" ", "").length() < 16) {
                    throw new RuntimeException("Invalid Card Number");
                }
                if (request.getCardExpiry() == null || request.getCardCvc() == null) {
                    throw new RuntimeException("Incomplete Card Details");
                }
                break;
            case "upi":
                if (request.getUpiId() == null || !request.getUpiId().contains("@")) {
                    throw new RuntimeException("Invalid UPI ID");
                }
                break;
            case "netbanking":
                if (request.getBankName() == null || request.getBankName().isEmpty()) {
                    throw new RuntimeException("Bank Name is required for NetBanking");
                }
                break;
            case "paypal":
            case "stripe":
                // In a real app, we would verify a token from the frontend here.
                // For now, we assume the redirect flow was successful.
                break;
            default:
                throw new RuntimeException("Unsupported Payment Method: " + paymentMethod);
        }

        // 3. Create Address
        Address address = new Address();
        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setLine1(request.getLine1());
        address.setLine2(request.getLine2());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        address = addressRepo.save(address);

        // 4. Create Order Object
        Order order = new Order();
        order.setCustomer(user);
        order.setShippingAddress(address);
        order.setOrderDate(LocalDate.now());
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentMethod(paymentMethod);
        order.setPaymentStatus("COMPLETED"); // Simulated success
        order.setTransactionId(transactionId);
        order.setShippingMethod("Standard");

        order = orderRepo.save(order);

        List<OrderItem> items = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        UUID sellerId = null;

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Order must contain at least one item");
        }

        // 5. Process Items
        for (CreateOrderItemDTO itemDTO : request.getItems()) {
            Product product = productRepo.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemDTO.getProductId()));

            if (!product.getActive()) {
                throw new RuntimeException("Product is not active: " + product.getName());
            }

            if (product.getQuantity() < itemDTO.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            // Reduce Stock
            product.setQuantity(product.getQuantity() - itemDTO.getQuantity());
            productRepo.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setPrice(BigDecimal.valueOf(product.getPrice()));

            items.add(orderItem);
            totalAmount = totalAmount.add(orderItem.getPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity())));

            if (sellerId == null) {
                sellerId = product.getSellerId();
            }
        }

        itemRepo.saveAll(items);

        // Update Order with calculated totals
        order.setItems(items);
        order.setTotalAmount(totalAmount);
        order.setSellerId(sellerId);

        orderRepo.save(order);

        // Update product metrics
        productService.updateSalesMetrics(items);

        return order.getId();
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

    // 5. GET USER ORDERS (PAGINATED & FILTERED)
    public OrderListResponseDTO getUserOrdersPaged(String username, int page, int size, String status,
            String timeframe) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "orderDate"));

        Specification<Order> spec = OrderSpecification.hasCustomerUsername(username);

        if (status != null && !status.isEmpty() && !status.equals("ALL")) {
            spec = spec.and(OrderSpecification.hasStatus(status));
        }

        if (timeframe != null && !timeframe.isEmpty()) {
            LocalDate now = LocalDate.now();
            LocalDate startDate = null;
            switch (timeframe) {
                case "last30days":
                    startDate = now.minusDays(30);
                    break;
                case "last3months":
                    startDate = now.minusMonths(3);
                    break;
                case "2024":
                    // Example specific year logic
                    spec = spec.and(
                            OrderSpecification.createdBetween(LocalDate.of(2024, 1, 1), LocalDate.of(2024, 12, 31)));
                    break;
                case "2025":
                    spec = spec.and(
                            OrderSpecification.createdBetween(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 12, 31)));
                    break;
                default:
                    break;
            }
            if (startDate != null) {
                spec = spec.and(OrderSpecification.createdBetween(startDate, null));
            }
        }

        Page<Order> ordersPage = orderRepo.findAll(spec, pageable);

        List<OrderSummaryDTO> summaries = new ArrayList<>();
        for (Order o : ordersPage.getContent()) {
            List<OrderItem> items = o.getItems();
            int itemCount = items != null ? items.size() : 0;
            String itemsSummary = "No items";
            String image = null;
            String sellerName = "Unknown Seller";

            if (items != null && !items.isEmpty()) {
                OrderItem firstItem = items.get(0);
                String productName = (firstItem.getProduct() != null) ? firstItem.getProduct().getName()
                        : "Unknown Product";
                itemsSummary = firstItem.getQuantity() + "x " + productName;
                if (itemCount > 1) {
                    itemsSummary += " + " + (itemCount - 1) + " others";
                }
                Product p = firstItem.getProduct();
                if (p != null) {
                    image = p.getImage1() != null ? p.getImage1() : p.getImage();
                    if (p.getSeller() != null) {
                        sellerName = p.getSeller().getName();
                    }
                }
            }

            summaries.add(new OrderSummaryDTO(
                    o.getId() != null ? o.getId().toString() : "",
                    sellerName,
                    o.getOrderDate() != null ? o.getOrderDate().toString() : "",
                    itemCount,
                    o.getTotalAmount(),
                    o.getStatus() != null ? o.getStatus().name() : "PENDING",
                    itemsSummary,
                    image));
        }

        return new OrderListResponseDTO(summaries, ordersPage.getTotalPages(), ordersPage.getTotalElements());
    }

    // Deprecated simple list version (can be removed later or kept for other uses)
    public List<OrderSummaryDTO> getUserOrders(String username) {
        return getUserOrdersPaged(username, 0, 100, null, null).getOrders();
    }
}
