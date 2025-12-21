package com.kodekernel.ecommerce.repository;

import com.kodekernel.ecommerce.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
    List<Category> findByParentIsNull();

    boolean existsByNameAndParent(String name, Category parent);

    boolean existsByNameAndParentIsNull(String name);

    List<Category> findByNameContainingIgnoreCase(String name, org.springframework.data.domain.Pageable pageable);
}
