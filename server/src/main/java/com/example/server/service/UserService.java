package com.example.server.service;

import com.example.server.model.User;
import com.example.server.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class UserService {
    public final UserRepository userRepository;

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


    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

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

    public User register(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already taken.");
        }
        return userRepository.save(user);
    }

    public User login(String username, String password) {
        User user = userRepository.findByUsernameAndPassword(username, password);
        if (user == null) {
            throw new IllegalArgumentException("Invalid username or password.");
        }
        return user;
    }
}
