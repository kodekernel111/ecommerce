package com.kodekernel.ecommerce.controller;

import com.kodekernel.ecommerce.entity.HomepageConfig;
import com.kodekernel.ecommerce.repository.HomepageConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
public class PublicController {

    private final HomepageConfigRepository homepageConfigRepository;

    @GetMapping("/homepage-config")
    public ResponseEntity<HomepageConfig> getHomepageConfig() {
        List<HomepageConfig> configs = homepageConfigRepository.findAll();
        if (configs.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        // Assuming single seller/config for now, or take the first one
        return ResponseEntity.ok(configs.get(0));
    }
}
