package com.wassu.wassu.service;

import com.wassu.wassu.dto.user.UserSignupDTO;
import com.wassu.wassu.entity.BlackListEntity;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.repository.BlackListRepository;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.text.MessageFormat;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    private final PasswordEncoder passwordEncoder;
    private final BlackListRepository blackListRepository;

    @Autowired
    public AuthService(UserRepository userRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder, BlackListRepository blackListRepository) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.blackListRepository = blackListRepository;
    }

    @Autowired
    private EmailService emailService;

    public Map<String, String> authenticateAndGenerateTokens(String email, String password) {
        // 사용자 조회
        Optional<UserEntity> userEntityOptional = userRepository.findByEmail(email);
        // 사용자 인증 : 이메일, 비밀번호 일치 확인
        try {
            if (userEntityOptional.isPresent()) {
                UserEntity userEntity = userEntityOptional.get();
                if (passwordEncoder.matches(password, userEntity.getPassword())) {
                    Map<String, String> tokens = new HashMap<>();
                    tokens.put("access", jwtUtil.generateToken(email, "access"));
                    tokens.put("refresh", jwtUtil.generateToken(email, "refresh"));
                    return tokens;
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

    public void deleteAccount(String token) {
        String email  = jwtUtil.extractUserEmail(token);
        Optional<UserEntity> userEntityOptional = userRepository.findByEmail(email);
        try {
            if (userEntityOptional.isPresent()) {
                UserEntity userEntity = userEntityOptional.get();
                userRepository.delete(userEntity);
                logger.info("User {} deleted", email);
            } else {
                logger.error("User not found");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found");
            }
        } catch (Exception e) {
            logger.error("Exception in Delete Account: {}", e.getMessage());
        }
    }

    private Map<String, String> verificationCodes = new HashMap<>();

    public String sendVerificationCode(String email) {
        String verificationCode = generateRandomCode(8);
        verificationCodes.put(email, verificationCode);
        logger.info("Verification code generated: {}", verificationCode);
        String title = MessageFormat.format("Verification Code: {0}", verificationCode);
        String content = MessageFormat.format("Wassu Verification Code: {1}", verificationCode);

        emailService.sendEmail(email, title, content);

        return "Verification Code sent to your email";
    }

    public void logout(String token) {
        BlackListEntity blacklistEntity = new BlackListEntity();
        blacklistEntity.setToken(token);
        blackListRepository.save(blacklistEntity);
    }

    private String generateRandomCode(int length) {
        Random random = new Random();
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < length; i++) {
            code.append(random.nextInt(10));
        }
        return code.toString();

    }

    public Boolean verifyCode(String email, String code) {
        String correctCode = verificationCodes.get(email);
        return correctCode != null && correctCode.equals(code);
    }

    public void removeVerificationCode(String email) {
        verificationCodes.remove(email);
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
