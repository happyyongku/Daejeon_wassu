package com.wassu.wassu.service;

import com.wassu.wassu.dto.user.UserSignupDTO;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(UserRepository userRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public Map<String, String> authenticateAndGenerateTokens(String email, String password) {
        // 사용자 조회
        Optional<UserEntity> userEntityOptional = userRepository.findByEmail(email);
        // 사용자 인증 : 이메일, 비밀번호 일치 확인
        try {
            if (userEntityOptional.isPresent()) {
                UserEntity userEntity = userEntityOptional.get();
                if (passwordEncoder.matches(password, userEntity.getPassword())) {
                    return jwtUtil.generateTokens(email);
                }
            } else {
                logger.error("User not found");
                return null;
            }
        } catch (Exception e) {
            logger.error("Exception in AuthService: {}", e.getMessage());
            return null;
        }
        return null;
    }

    public boolean validateToken(String token) {
        return jwtUtil.validateToken(token);
    }

    public String refreshAccessToken(String token, String email) {
        return jwtUtil.refreshToken(token, email);
    }

    public UserEntity convertToUserEntity(UserSignupDTO userSignupDTO) {
        return UserEntity.builder()
                .email(userSignupDTO.getEmail())
                .password(userSignupDTO.getPassword())
                .nickname(userSignupDTO.getNickname())
                .gender(userSignupDTO.getGender())
                .birthYear(userSignupDTO.getBirthYear())
                .build();
    }

}
