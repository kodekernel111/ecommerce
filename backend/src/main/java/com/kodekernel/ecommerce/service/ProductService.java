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

    public InventoryResponseDTO getInventory(UUID sellerId) {
        List<Product> products = productRepository.findBySellerId(sellerId);
        List<ProductDTO> productDTOs = products.stream().map(this::convertToDTO).collect(Collectors.toList());

        Double listingValue = products.stream()
                .mapToDouble(p -> p.getPrice() * p.getQuantity())
                .sum();

        List<Product> lowCountProducts = productRepository.findBySellerIdAndQuantityLessThan(sellerId, 10);
        List<ProductDTO> lowCountProductDTOs = lowCountProducts.stream().map(this::convertToDTO)
                .collect(Collectors.toList());

        return new InventoryResponseDTO(productDTOs, listingValue, lowCountProductDTOs);
    }

    @Autowired
    private S3Service s3Service;

    public ProductDTO listNewProduct(UUID sellerId, ProductDTO productDTO, MultipartFile image) {
        String imageUrl = s3Service.uploadFile(image);
        productDTO.setImage(imageUrl);

        Product product = convertToEntity(productDTO);
        product.setSellerId(sellerId);
        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    public ProductDTO updateProduct(UUID productId, ProductDTO productDTO, MultipartFile image) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setQuantity(productDTO.getQuantity());
        product.setCategory(productDTO.getCategory());

        if (image != null && !image.isEmpty()) {
            String imageUrl = s3Service.uploadFile(image);
            product.setImage(imageUrl);
        } else if (productDTO.getImage() != null) {
            // If no new file, but DTO has image URL (e.g. client sending back existing
            // URL), use it.
            // However, typically we only update if changed.
            // If client sends null in DTO and no file, we might want to keep existing.
            // Let's assume if file is provided, it overrides. If not, we update from DTO if
            // DTO has it.
            product.setImage(productDTO.getImage());
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
                product.getQuantity(),
                product.getCategory(),
                product.getImage(),
                product.getSellerId());
    }

    private Product convertToEntity(ProductDTO productDTO) {
        Product product = new Product();
        product.setId(productDTO.getId());
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setQuantity(productDTO.getQuantity());
        product.setCategory(productDTO.getCategory());
        product.setImage(productDTO.getImage());
        product.setSellerId(productDTO.getSellerId());
        return product;
    }
}
