package com.example.server.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table(name = "app_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    // Stored as "USER" or "ADMIN" text in DB; columnDefinition gives existing rows a default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "varchar(50) default 'USER'")
    private Role role = Role.USER;

    private String username;
    private String password;

    public User() {}

    public User(String password) {
        this.password = password;
    }

    // TODO: Backend random username generator.
//    public String getRandomUsername() {
//
//        return "";
//    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    // NOTE: Only used for changing password not on Forget password.
    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
