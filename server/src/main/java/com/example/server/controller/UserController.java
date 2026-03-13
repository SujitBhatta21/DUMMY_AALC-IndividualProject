package com.example.server.controller;

import com.example.server.model.LoginResponse;
import com.example.server.model.User;
import com.example.server.service.JwtService;
import com.example.server.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/accounts")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @GetMapping("/generate_username")
    public ResponseEntity<String> generateUsername() {
        return ResponseEntity.ok(userService.getRandomUsername());
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            userService.register(user);
            return ResponseEntity.ok("Registration successful.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            User found = userService.login(user.getUsername(), user.getPassword());
            // Generate token containing username + role, valid for 24h
            String token = jwtService.generateToken(found.getUsername(), found.getRole());
            return ResponseEntity.ok(new LoginResponse(token, found.getUsername(), found.getRole().name()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}