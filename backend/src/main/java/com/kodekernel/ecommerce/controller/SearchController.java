package com.kodekernel.ecommerce.controller;

import com.kodekernel.ecommerce.dto.SuggestionDTO;
import com.kodekernel.ecommerce.entity.Category;
import com.kodekernel.ecommerce.repository.CategoryRepository;
import com.kodekernel.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/public/search")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SearchController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @GetMapping("/suggestions")
    public ResponseEntity<List<SuggestionDTO>> getSuggestions(@RequestParam String query) {
        if (query == null || query.trim().length() < 2) {
            return ResponseEntity.ok(List.of());
        }

        String searchTerm = query.trim();
        List<SuggestionDTO> suggestions = new ArrayList<>();

        // 1. Categories (Max 3)
        List<Category> categories = categoryRepository.findByNameContainingIgnoreCase(searchTerm, PageRequest.of(0, 3));
        suggestions.addAll(categories.stream()
                .map(c -> SuggestionDTO.builder().text(c.getName()).type("CATEGORY").build())
                .collect(Collectors.toList()));

        // 2. SubCategories (Max 2)
        if (suggestions.size() < 5) {
            List<String> subCategories = productRepository.findSubCategorySuggestions(searchTerm, PageRequest.of(0, 2));
            suggestions.addAll(subCategories.stream()
                    .map(c -> SuggestionDTO.builder().text(c).type("CATEGORY").build())
                    .collect(Collectors.toList()));
        }

        // 3. Brands (Max 2)
        List<String> brands = productRepository.findBrandSuggestions(searchTerm, PageRequest.of(0, 2));
        suggestions.addAll(brands.stream()
                .map(b -> SuggestionDTO.builder().text(b).type("BRAND").build())
                .collect(Collectors.toList()));

        // 4. Products (Fill remaining up to 10)
        int remaining = 10 - suggestions.size();
        if (remaining > 0) {
            List<String> productNames = productRepository.findNameSuggestions(searchTerm, PageRequest.of(0, remaining));
            suggestions.addAll(productNames.stream()
                    .map(n -> SuggestionDTO.builder().text(n).type("PRODUCT").build())
                    .collect(Collectors.toList()));
        }

        return ResponseEntity.ok(suggestions);
    }
}
