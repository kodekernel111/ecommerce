package com.kodekernel.ecommerce.repository;

import com.kodekernel.ecommerce.entity.HomepageConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface HomepageConfigRepository extends JpaRepository<HomepageConfig, UUID> {
}
