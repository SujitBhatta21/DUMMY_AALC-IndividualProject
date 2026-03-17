/*
  This is the brain for my JWT. 
  It does three things: generate a token on login, extract the username from a token, and validate a token hasn't expired or been tampered/touched with.  
  The secret key signs the token so only the server can produce valid ones.
*/

package com.example.server.service;

import com.example.server.model.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    // Token lives for 24 hours — after that the user must log in again
    private static final long EXPIRATION_MS = 86_400_000; 

    // Rebuilds the signing key from the base64 secret in application.properties
    private SecretKey getSigningKey() {
        byte[] keyBytes = Base64.getDecoder().decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Called on successful login — embeds username + role into the token payload
    public String generateToken(String username, Role role) {
        return Jwts.builder()
                .subject(username)
                .claim("role", role.name())   // stored in token so we can check role without a DB call
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(getSigningKey())
                .compact();
    }

    // Pulls the username out of a valid token (used in JwtAuthFilter)
    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    // Pulls the role out of a valid token (used in JwtAuthFilter to set authorities)
    public String extractRole(String token) {
        return parseClaims(token).get("role", String.class);
    }

    // Returns false if the signature is wrong, token is expired.
    public boolean isTokenValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}