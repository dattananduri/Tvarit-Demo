package com.datta.tvaritfinal.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtils {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${tvarit.jwt.secret:}")
    private String jwtSecret;

    @Value("${tvarit.jwt.expiration-ms:86400000}")
    private long jwtExpirationMs;

    private SecretKey cachedSigningKey;

    private synchronized SecretKey getSigningKey() {
        if (cachedSigningKey != null) {
            return cachedSigningKey;
        }
        if (jwtSecret != null && !jwtSecret.isBlank()) {
            byte[] keyBytes = Decoders.BASE64.decode(ensureBase64(jwtSecret));
            cachedSigningKey = Keys.hmacShaKeyFor(keyBytes);
        } else {
            // Generate secure dynamic 256-bit key if no environment secret is configured
            cachedSigningKey = Jwts.SIG.HS256.key().build();
        }
        return cachedSigningKey;
    }

    private String ensureBase64(String secret) {
        // If string is hex or plain ASCII, ensure it is at least 32 bytes and valid base64
        if (secret.length() < 32) {
            secret = String.format("%-32s", secret).replace(' ', '0');
        }
        try {
            Decoders.BASE64.decode(secret);
            return secret;
        } catch (Exception e) {
            return java.util.Base64.getEncoder().encodeToString(secret.getBytes());
        }
    }

    public String generateToken(String email, String role, Long userId, String name) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("userId", userId);
        claims.put("name", name);

        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    public Claims getClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String getEmailFromToken(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    public String getRoleFromToken(String token) {
        Object role = getClaimsFromToken(token).get("role");
        return role != null ? role.toString() : null;
    }

    public Long getUserIdFromToken(String token) {
        Object userId = getClaimsFromToken(token).get("userId");
        if (userId instanceof Number) {
            return ((Number) userId).longValue();
        } else if (userId != null) {
            return Long.parseLong(userId.toString());
        }
        return null;
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        }
        return false;
    }
}
