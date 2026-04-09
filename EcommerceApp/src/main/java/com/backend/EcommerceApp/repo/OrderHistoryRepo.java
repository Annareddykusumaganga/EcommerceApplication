package com.backend.EcommerceApp.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.EcommerceApp.entity.OrderHistory;

public interface OrderHistoryRepo extends JpaRepository<OrderHistory, Long> {
	 List<OrderHistory> findByUserIdOrderByOrderedAtDesc(Long userId);

}
