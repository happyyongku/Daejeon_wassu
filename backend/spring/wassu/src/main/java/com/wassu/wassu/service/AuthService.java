package com.wassu.wassu.service;

import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
    }

    public Map<String, String> authenticateAndGenerateTokens(String email, String password) {
        // 사용자 조회
        Optional<UserEntity> userEntityOptional = userRepository.findByEmail(email);
        // 사용자 인증 : 이메일, 비밀번호 일치 확인
        if (userEntityOptional.isEmpty() || !userEntityOptional.get().getPassword().equals(password)) {
            logger.error("Invalid email or password");
            throw new IllegalArgumentException("Invalid email or password");
        }
        return jwtUtil.generateToken(email);
    }

    public boolean validateToken(String token) {
        return jwtUtil.validateToken(token);
    }

    public String refreshAccessToken(String token, String email) {
        return jwtUtil.refreshToken(token, email);
    }
}
