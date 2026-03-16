package com.example.server.config;

import com.example.server.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.example.server.service.JwtService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public SecurityConfig(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())        // picks up the WebMvcConfigurer CORS bean from CorsConfig
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // no server session — token IS the session
            .authorizeHttpRequests(auth -> auth
                // Spring Security 7 requires HttpMethod enum, not plain strings
                .requestMatchers(HttpMethod.POST, "/api/accounts/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/accounts/register").permitAll()
                .requestMatchers(HttpMethod.GET,  "/api/accounts/generate_username").permitAll()
                .requestMatchers(HttpMethod.GET,  "/api/accounts/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST,  "/api/accounts/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/accounts/admin/**").hasRole("ADMIN")  // Only admin can ask admin apiFetch.
                .anyRequest().authenticated()       // everything else needs a valid token
            )
            // Run the filter BEFORE Spring's own auth filter so the token is validated first
            .addFilterBefore(new JwtAuthFilter(jwtService, userRepository), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}