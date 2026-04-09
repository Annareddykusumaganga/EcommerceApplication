package com.backend.EcommerceApp.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.EcommerceApp.entity.Product;

public interface ProductRepo extends JpaRepository<Product, Long> {
	List<Product> findByCategory(String category);
}
