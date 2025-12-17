package com.kodekernel.ecommerce.controller;

import com.kodekernel.ecommerce.entity.Category;
import com.kodekernel.ecommerce.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody Map<String, Object> payload) {
        try {
            System.out.println("Received create category request: " + payload);
            String name = (String) payload.get("name");
            String parentIdStr = (String) payload.get("parentId");
            UUID parentId = parentIdStr != null && !parentIdStr.isEmpty() ? UUID.fromString(parentIdStr) : null;

            return ResponseEntity.ok(categoryService.createCategory(name, parentId));
        } catch (Exception e) {
            System.err.println("Error creating category: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
