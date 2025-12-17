package com.kodekernel.ecommerce.service;

import com.kodekernel.ecommerce.dto.InventoryResponseDTO;
import com.kodekernel.ecommerce.dto.ProductDTO;
import com.kodekernel.ecommerce.entity.Product;
import com.kodekernel.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public InventoryResponseDTO getInventory(UUID sellerId, int page, int size, String search, String category,
            Double minPrice, Double maxPrice, String stockStatus, String startDate, String endDate) {

        java.time.LocalDateTime start = null;
        java.time.LocalDateTime end = null;

        if (startDate != null && !startDate.isEmpty()) {
            start = java.time.LocalDate.parse(startDate).atStartOfDay();
        }
        if (endDate != null && !endDate.isEmpty()) {
            end = java.time.LocalDate.parse(endDate).atTime(java.time.LocalTime.MAX);
        }

        org.springframework.data.jpa.domain.Specification<Product> spec = org.springframework.data.jpa.domain.Specification
                .where(com.kodekernel.ecommerce.repository.ProductSpecification.hasSellerId(sellerId));

        if (search != null && !search.isEmpty()) {
            spec = spec.and(com.kodekernel.ecommerce.repository.ProductSpecification.containsText(search));
        }
        if (category != null && !category.isEmpty()) {
            spec = spec.and(com.kodekernel.ecommerce.repository.ProductSpecification.hasCategory(category));
        }
        if (minPrice != null || maxPrice != null) {
            spec = spec.and(com.kodekernel.ecommerce.repository.ProductSpecification.priceBetween(minPrice, maxPrice));
        }
        if ("low_stock".equals(stockStatus)) {
            spec = spec.and(com.kodekernel.ecommerce.repository.ProductSpecification.isLowStock(true));
        } else if ("out_of_stock".equals(stockStatus)) {
            spec = spec.and(com.kodekernel.ecommerce.repository.ProductSpecification.isOutOfStock(true));
        } else if ("in_stock".equals(stockStatus)) {
            // In stock logic can be quantity > 0 or specific threshold. For now assuming >
            // 0
            spec = spec.and((root, query, cb) -> cb.greaterThan(root.get("quantity"), 0));
        }

        if (start != null || end != null) {
            spec = spec.and(com.kodekernel.ecommerce.repository.ProductSpecification.createdBetween(start, end));
        }

        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        org.springframework.data.domain.Page<Product> productsPage = productRepository.findAll(spec, pageable);

        List<ProductDTO> productDTOs = productsPage.stream().map(this::convertToDTO).collect(Collectors.toList());

        // Calculate dynamic stats based on the same filter spec
        List<Product> filteredProducts = productRepository.findAll(spec);

        Double listingValue = filteredProducts.stream()
                .mapToDouble(p -> p.getPrice() * p.getQuantity())
                .sum();

        // For low stock, we need products that match the current filter AND have
        // quantity < 10
        // We can filter the already fetched 'filteredProducts' list instead of a new DB
        // query for efficiency
        List<ProductDTO> lowCountProductDTOs = filteredProducts.stream()
                .filter(p -> p.getQuantity() < 10)
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return new InventoryResponseDTO(productDTOs, listingValue, lowCountProductDTOs, productsPage.getTotalPages(),
                productsPage.getTotalElements());
    }

    public ProductDTO getProduct(UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return convertToDTO(product);
    }

    @Autowired
    private S3Service s3Service;

    public ProductDTO listNewProduct(UUID sellerId, ProductDTO productDTO, List<MultipartFile> images) {
        List<String> imageUrls = new java.util.ArrayList<>();
        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                if (!image.isEmpty()) {
                    imageUrls.add(s3Service.uploadFile(image));
                }
            }
        }

        productDTO.setImages(imageUrls);
        if (!imageUrls.isEmpty()) {
            productDTO.setImage(imageUrls.get(0));
        }

        // Default active status to true for new products if not specified
        if (productDTO.getActive() == null) {
            productDTO.setActive(true);
        }

        Product product = convertToEntity(productDTO);
        // Explicitly set images from the list we just created
        setProductImagesFromList(product, imageUrls);

        product.setSellerId(sellerId);
        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    public ProductDTO updateProduct(UUID productId, ProductDTO productDTO, List<MultipartFile> images) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setMrp(productDTO.getMrp());
        product.setDiscount(productDTO.getDiscount());
        product.setQuantity(productDTO.getQuantity());
        product.setCategory(productDTO.getCategory());
        product.setCategory(productDTO.getCategory());
        product.setSubCategory(productDTO.getSubCategory());
        product.setTags(productDTO.getTags());
        product.setBrand(productDTO.getBrand());
        product.setSku(productDTO.getSku());
        product.setReturnPolicy(productDTO.getReturnPolicy());
        product.setWarranty(productDTO.getWarranty());
        product.setWarranty(productDTO.getWarranty());
        product.setSpecifications(productDTO.getSpecifications());
        if (productDTO.getActive() != null) {
            product.setActive(productDTO.getActive());
        }

        List<String> finalImageUrls = new java.util.ArrayList<>();
        List<String> newUploadedUrls = new java.util.ArrayList<>();

        // 1. Upload new images if any
        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                if (!image.isEmpty()) {
                    newUploadedUrls.add(s3Service.uploadFile(image));
                }
            }
        }

        // 2. Merge existing URLs and new URLs based on DTO order
        if (productDTO.getImages() != null) {
            int newImageIndex = 0;
            for (String img : productDTO.getImages()) {
                if (img.startsWith("__NEW_IMAGE_")) {
                    if (newImageIndex < newUploadedUrls.size()) {
                        finalImageUrls.add(newUploadedUrls.get(newImageIndex++));
                    }
                } else {
                    finalImageUrls.add(img);
                }
            }
        } else {
            // Fallback if DTO images is null (shouldn't happen with new frontend)
            finalImageUrls.addAll(newUploadedUrls);
        }

        // 3. Set the final list to the product
        setProductImagesFromList(product, finalImageUrls);
        if (!finalImageUrls.isEmpty()) {
            product.setImage(finalImageUrls.get(0));
        }

        Product updatedProduct = productRepository.save(product);
        return convertToDTO(updatedProduct);
    }

    public void deleteProduct(UUID productId) {
        productRepository.deleteById(productId);
    }

    private ProductDTO convertToDTO(Product product) {
        return new ProductDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getMrp(),
                product.getDiscount(),
                product.getQuantity(),
                product.getCategory(),
                product.getSubCategory(),
                product.getImage(),
                product.getActive(),
                product.getSellerId(),
                product.getTags(),
                getProductImagesAsList(product),
                product.getBrand(),
                product.getSku(),
                product.getReturnPolicy(),
                product.getWarranty(),
                product.getSpecifications());
    }

    private Product convertToEntity(ProductDTO productDTO) {
        Product product = new Product();
        product.setId(productDTO.getId());
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setMrp(productDTO.getMrp());
        product.setDiscount(productDTO.getDiscount());
        product.setQuantity(productDTO.getQuantity());
        product.setCategory(productDTO.getCategory());
        product.setSubCategory(productDTO.getSubCategory());
        product.setImage(productDTO.getImage());
        product.setSellerId(productDTO.getSellerId());
        product.setSellerId(productDTO.getSellerId());
        product.setTags(productDTO.getTags());
        product.setBrand(productDTO.getBrand());
        product.setSku(productDTO.getSku());
        product.setReturnPolicy(productDTO.getReturnPolicy());
        product.setWarranty(productDTO.getWarranty());
        product.setWarranty(productDTO.getWarranty());
        product.setSpecifications(productDTO.getSpecifications());
        product.setActive(productDTO.getActive());
        setProductImagesFromList(product, productDTO.getImages());
        return product;
    }

    private void setProductImagesFromList(Product product, List<String> images) {
        // Reset all first
        product.setImage1(null);
        product.setImage2(null);
        product.setImage3(null);
        product.setImage4(null);
        product.setImage5(null);

        if (images == null || images.isEmpty()) {
            return;
        }

        if (images.size() > 0)
            product.setImage1(images.get(0));
        if (images.size() > 1)
            product.setImage2(images.get(1));
        if (images.size() > 2)
            product.setImage3(images.get(2));
        if (images.size() > 3)
            product.setImage4(images.get(3));
        if (images.size() > 4)
            product.setImage5(images.get(4));

        // Ensure main image is synced with image1
        if (images.size() > 0) {
            product.setImage(images.get(0));
        }
    }

    private List<String> getProductImagesAsList(Product product) {
        List<String> images = new java.util.ArrayList<>();
        if (product.getImage1() != null)
            images.add(product.getImage1());
        if (product.getImage2() != null)
            images.add(product.getImage2());
        if (product.getImage3() != null)
            images.add(product.getImage3());
        if (product.getImage4() != null)
            images.add(product.getImage4());
        if (product.getImage5() != null)
            images.add(product.getImage5());
        return images;
    }
}
