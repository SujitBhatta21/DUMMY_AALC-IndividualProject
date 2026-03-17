package com.example.server.service;

import com.example.server.model.User;
import com.example.server.repository.ReportRepository;
import com.example.server.repository.UserRepository;
import com.example.server.repository.UserShardProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;

@Service
public class UserService {
    @Autowired
    public final UserRepository userRepository;

    private final UserShardProgressRepository userShardProgressRepository;
    private final ReportRepository reportRepository;
    private final PasswordEncoder passwordEncoder;

    String[] adjectives = {
            "Blazing", "Cosmic", "Shadow", "Neon", "Turbo",
            "Frozen", "Hyper", "Stealth", "Golden", "Mystic",
            "Epic", "Savage", "Lunar", "Storm", "Cyber",
            "Flash", "Barbarian", "Tenacious", "Cheeky"
    };

    String[] nouns = {
            "Panda", "Phoenix", "Ninja", "Dragon", "Wolf",
            "Viper", "Falcon", "Tiger", "Shark", "Fox",
            "Knight", "Comet", "Blaze", "Titan", "Raven"
    };

    public UserService(UserRepository userRepository, UserShardProgressRepository userShardProgressRepository, ReportRepository reportRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userShardProgressRepository = userShardProgressRepository;
        this.reportRepository = reportRepository;
        this.passwordEncoder = passwordEncoder;
    }


    /*
    * STATS FOR ADMIN METHODS (Refactored/Moved to StatsService which is controlled by AdminController)
    */

    public String getRandomUsername() {
        Random random = new Random();
        String random_adj = adjectives[random.nextInt(adjectives.length)];
        String random_noun = nouns[random.nextInt(nouns.length)];
        Number random_number = random.nextInt(100, 1000);

        // IF name already in dataset then reroll.
        String username = random_adj + random_noun + random_number;
        while (userRepository.existsByUsername(username)) {
            username = getRandomUsername();
        }
        return username;
    }

    public void validatePassword(String password) {
        if (password == null || password.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters.");
        }
        if (password.length() >= 16) {
            throw new IllegalArgumentException("Password must not exceed 16 characters.");
        }
        if (!password.matches(".*[A-Z].*")) {
            throw new IllegalArgumentException("Password must contain at least one uppercase letter");
        }
        if (!password.matches(".*[0-9].*")) {
            throw new IllegalArgumentException("Password must contain at least one number");
        }
    }

    public User register(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already taken.");
        }
        validatePassword(user.getPassword());
        user.setPassword(passwordEncoder.encode(user.getPassword())); // Hashing using encoder.
        System.out.println("REGISTERED SUCCESSFULLY");
        return userRepository.save(user);
    }

    // Method to call when user clicks on Login button.
    public User login(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password.");
        }
        System.out.println("LOGIN SUCCESS");
        return user;
    }


    // Method to get all the users from repository.
    public List<User> getUser() {
        return userRepository.findAll();
    }


    public void changePassword(Integer userId, String newPassword) {
        User user = userRepository.findById(userId.longValue())
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        validatePassword(newPassword);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }


    // Method to delete user from repository.
    // Child rows (shard progress, reports) must be deleted first to satisfy FK constraints.
    @Transactional
    public void deleteUser(User user) {
        userShardProgressRepository.deleteByUserUserId(user.getUserId());
        reportRepository.deleteByUserUserId(user.getUserId());
        userRepository.delete(user);
    }

    @Transactional
    public void deleteUserById(Integer userId) {
        User user = userRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        deleteUser(user);
    }
}
