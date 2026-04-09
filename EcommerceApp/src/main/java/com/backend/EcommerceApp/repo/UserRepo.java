package com.backend.EcommerceApp.repo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.EcommerceApp.entity.User;

public interface UserRepo extends JpaRepository<User, Long> {
	 User findByUsername(String username);
	    //Optional<User> findByUsernameAndPassword(String username, String password);
	    boolean existsByUsername(String username);
	    Page<User> findByRole(String role, Pageable pageable);
	    
	    User findByEmail(String email);
}
