package com.wassu.wassu.controller;

import com.wassu.wassu.dto.user.UserProfileDTO;
import com.wassu.wassu.service.UserService;
import com.wassu.wassu.security.JwtUtil;
import com.wassu.wassu.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/wassu/user")
@Slf4j
public class UserController {
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Autowired
    public UserController(UserService userService, JwtUtil jwtUtil, UserRepository userRepository) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    // 사용자 정보 조회
    @GetMapping("/profile")
    public Optional<UserProfileDTO> getProfile(@RequestHeader(value="Authorization") String accessToken) {
        String token = accessToken.replace("Bearer ", "");
        String userEmail = jwtUtil.extractUserEmail(token);
        if (userRepository.findByEmail(userEmail).isPresent()) {
            return userService.findUserByEmail(userEmail);
        }
        log.info("User not found: {}", userEmail);
        return Optional.empty();
    }
}
