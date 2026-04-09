package com.backend.EcommerceApp.security;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class JwtFilter implements Filter {
	
	 @Autowired
	   private JwtUtil jwtUtil;

	    @Override
	    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
	            throws IOException, ServletException {

	        HttpServletRequest req = (HttpServletRequest) request;

	        String header = req.getHeader("Authorization");

	        if (header != null && header.startsWith("Bearer ")) {

	            String token = header.substring(7);

	            try {
	                String username = jwtUtil.extractUsername(token);
	                String role = jwtUtil.extractRole(token);

	                String finalRole = role.startsWith("ROLE_") ? role : "ROLE_" + role;

	                UsernamePasswordAuthenticationToken auth =
	                        new UsernamePasswordAuthenticationToken(
	                                username,
	                                null,
	                                List.of(new SimpleGrantedAuthority(finalRole))
	                        );

	                SecurityContextHolder.getContext().setAuthentication(auth);

	            } catch (Exception e) {
	                System.out.println("Invalid JWT Token");
	            }
	        }

	        chain.doFilter(request, response);
	    }


}
