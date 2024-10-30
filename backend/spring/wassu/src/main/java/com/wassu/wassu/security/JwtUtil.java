package com.wassu.wassu.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.Security;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.security.Key;

@Component
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    private final Key key;

    private final Long accessTokenExpiration;
    private final Long refreshTokenExpiration;
    private final String algorithm;

    public JwtUtil(
            @Value("${JWT_SECRET}") String secretKey,
            @Value("${JWT_ACCESS_EXPIRATION}") Long accessTokenExpiration,
            @Value("${JWT_REFRESH_EXPIRATION}") Long refreshTokenExpiration,
            @Value("${JWT_ALGORITHM}") String algorithm) {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.accessTokenExpiration = accessTokenExpiration;
        this.refreshTokenExpiration = refreshTokenExpiration;
        this.algorithm = algorithm;
    }

    public Map<String, String> generateTokens(String email) {
        long now = System.currentTimeMillis();

        String accessToken = Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + accessTokenExpiration))
                .signWith(key, getSignatureAlgorithm())
                .compact();
        String refreshToken = Jwts.builder()
                .setExpiration(new Date(now + refreshTokenExpiration))
                .signWith(key, getSignatureAlgorithm())
                .compact();

        Map<String, String> tokens = new HashMap<>();
        tokens.put("access_token", accessToken);
        tokens.put("refresh_token", refreshToken);
        return tokens;
    }

    public String extractUserEmail(String token) {
        logger.info("Extracting user email from JWT: {}", parseClaims(token).getSubject());
        return parseClaims(token).getSubject();
    }

    public Boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            logger.info("Invalid JWT: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.info("Expired JWT: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.info("Unsupported JWT: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.info("JWT claims string is empty.");
        }
        return false;
    }

    public String refreshToken(String token, String email) {
        if (validateToken(token)) {
            long now = System.currentTimeMillis();
            return Jwts.builder()
                    .setSubject(email)
                    .setIssuedAt(new Date(now))
                    .setExpiration(new Date(now + accessTokenExpiration))
                    .signWith(key, getSignatureAlgorithm())
                    .compact();
        } else {
            logger.error("Invalid Refresh Token");
            throw new IllegalArgumentException("Invalid Refresh Token");
        }
    }
    //-------------------------------------------------------------------------------

    private SignatureAlgorithm getSignatureAlgorithm() {
        try {
            return SignatureAlgorithm.valueOf(this.algorithm);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid JWT algorithm");
        }
    }

    private Claims parseClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            logger.error("Expired JWT token");
            return e.getClaims();
        }
    }
}