package com.wassu.wassu.controller;

import com.wassu.wassu.security.JwtUtil;
import com.wassu.wassu.service.AuthService;
import com.wassu.wassu.service.UserService;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.dto.user.UserAuthDTO;
import com.wassu.wassu.dto.user.UserSignupDTO;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/wassu/auth")
public class AuthController {

    private final UserService userService;
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthController(UserService userService, AuthService authService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    private Map<String, Boolean> verificationEmails = new HashMap<>();
    
    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<?> joinUser(@RequestBody UserSignupDTO userSignupDTO) {
        try {
            String email = userSignupDTO.getEmail();
            if (!verificationEmails.getOrDefault(email, false)) {
                logger.error("Email not verified");
                return ResponseEntity.badRequest().body(createResponse("status", "Email not verified"));
            }
            UserEntity userEntity = authService.convertToUserEntity(userSignupDTO);
            userService.createUser(userEntity);
            logger.info("Recieved signup request: {}", userSignupDTO.getEmail());
            return ResponseEntity.ok(createResponse("status", "success"));
        } catch (IllegalStateException e) {
            logger.error("Failed to signup (email already exist): {}", e.getMessage());
            return ResponseEntity.status(409).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Failed to signup : {}", e.getMessage());
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
    
    //로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserAuthDTO userAuthDTO) {
        // 로그인 처리
        try {
            Map<String, String> tokens = authService.authenticateAndGenerateTokens(userAuthDTO.getEmail(), userAuthDTO.getPassword());
            if (tokens == null) {
                return ResponseEntity.status(404).body("Invalid email or password");
            }
            return ResponseEntity.ok(tokens);
        } catch (IllegalStateException e) {
            logger.error("Failed to login (email already exist): {}", e.getMessage());
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }
    
    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String refreshToken) {
        try{
            String token  = refreshToken.replace("Bearer ", "");
            authService.logout(token);
            return ResponseEntity.ok(createResponse("status", "success"));
        } catch (IllegalStateException e) {
            logger.error("Failed to logout (refresh token already exist): {}", e.getMessage());
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }

    // 리프레쉬 토큰 갱신
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestHeader("Authorization") String refreshToken){
        try {
            String token = refreshToken.replace("Bearer ", "");
            if (jwtUtil.validateToken(token)) {
                String userEmail = jwtUtil.extractUserEmail(token);
                String newAccessToken = jwtUtil.generateToken(userEmail, "access");
                return ResponseEntity.ok(createResponse("access", newAccessToken));
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Error refreshing access token: " + e);
        }
        authService.logout(refreshToken);
        return ResponseEntity.status(404).body(createResponse("status", "failed"));
    }

    // 회원탈퇴
    @DeleteMapping("/delete-account")
    private ResponseEntity<?> deleteAccount(@RequestHeader("Authorization") String accessToken) {
        try {
            String token = accessToken.replace("Bearer ", "");
            if (jwtUtil.validateToken(token)) {
                authService.deleteAccount(token);
                return ResponseEntity.ok(createResponse("status", "success"));
            }
            return ResponseEntity.status(401).body("Invalid access token");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Error deleting account: " + e);
        }
    }

    // 메일 전송
    @PostMapping("/send-verification-code")
    private ResponseEntity<?> sendVerificationCode(@RequestParam String email) {
        String response = authService.sendVerificationCode(email);
        return ResponseEntity.ok(createResponse("status", "success"));
    }

    @PostMapping("/verify-code")
    private ResponseEntity<?> verifyCode(@RequestParam String email, @RequestParam String code) {
        Boolean isVerified = authService.verifyCode(email, code);
        if (isVerified) {
            verificationEmails.put(email, true);
            authService.removeVerificationCode(email);
            return ResponseEntity.ok(createResponse("status", "success"));
        }
        return ResponseEntity.status(401).body(createResponse("status", "Invalid verification code"));
    }

    private Map<String, String> createResponse(String key, String value) {
        Map<String, String> response = new HashMap<>();
        response.put(key, value);
        return response;
    }
}
