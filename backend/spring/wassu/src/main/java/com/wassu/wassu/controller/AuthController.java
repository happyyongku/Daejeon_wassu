package com.wassu.wassu.controller;

import com.wassu.wassu.service.AuthService;
import com.wassu.wassu.service.UserService;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.dto.user.UserAuthDTO;

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

    @Autowired
    public AuthController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }
    
    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<?> joinUser(@RequestBody UserEntity userEntity) {
        try {
            UserEntity savedUser = userService.createUser(userEntity);
            logger.info("Recieved signup request: {}", userEntity.getEmail());
            return ResponseEntity.ok(createSuccessResponse("status", "success"));
        } catch (IllegalStateException e) {
            logger.error("Failed to signup (email already exist): {}", e.getMessage());
            return ResponseEntity.status(409).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Failed to signup : {}", e.getMessage());
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserAuthDTO userAuthDTO) {
        // 로그인 처리
        Map<String, String> tokens = authService.authenticateAndGenerateTokens(userAuthDTO.getEmail(), userAuthDTO.getPassword());
        return ResponseEntity.ok(tokens);
    }


    private Map<String, String> createSuccessResponse(String key, String value) {
        Map<String, String> response = new HashMap<>();
        response.put(key, value);
        return response;
    }
}
