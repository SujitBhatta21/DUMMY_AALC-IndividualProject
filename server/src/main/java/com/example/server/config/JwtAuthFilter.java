package com.example.server.config;

import com.example.server.model.User;
import com.example.server.repository.UserRepository;
import com.example.server.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.io.IOException;
import java.time.Instant;
import java.util.List;

// OncePerRequestFilter guarantees this runs exactly once per request (not twice for forwards/includes)
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthFilter(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // If no Bearer token present, skip
        // - Spring Security handles the rejection downstream
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7); // strip "Bearer " prefix

        if (jwtService.isTokenValid(token)) {
            String username = jwtService.extractUsername(token);
            String role = jwtService.extractRole(token); // e.g. "ADMIN" or "USER"
            // hasRole("ADMIN") checks for authority "ROLE_ADMIN", so we must prefix it
            var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(username, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(auth);

            // Stamping last_active_at on every authenticated request
            // JwtAuthFilter does db write to save user every authenticated req could add some Timeout or
            // delay if this causes problem.
            User user = userRepository.findByUsername(username);
            if (user != null) {
                user.setLastActiveAt(Instant.now());
                userRepository.save(user);
            }
        }

        filterChain.doFilter(request, response);
    }
}