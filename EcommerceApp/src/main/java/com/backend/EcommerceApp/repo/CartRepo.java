package com.backend.EcommerceApp.repo;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.EcommerceApp.entity.Cart;

public interface CartRepo extends JpaRepository<Cart, Long> {

	List<Cart> findByUserId(Long userId);

	Page<Cart> findByUserId(Long userId, Pageable pageable);

}
