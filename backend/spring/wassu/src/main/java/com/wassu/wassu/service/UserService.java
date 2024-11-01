package com.wassu.wassu.service;

import com.wassu.wassu.dto.user.UserProfileUpdateDTO;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.dto.user.UserSignupDTO;
import com.wassu.wassu.dto.user.UserProfileDTO;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final PasswordEncoder passwordEncoder;

    // 회원가입
    public UserEntity createUser(UserEntity userEntity) {
        if (userRepository.findByEmail(userEntity.getEmail()).isPresent()) {
            logger.error("Email already exists");
            throw new IllegalStateException("Email already exists");
        }
        userEntity.setPassword(passwordEncoder.encode(userEntity.getPassword()));
        return userRepository.save(userEntity);
    }
    
    // email 기반 유저 조히
    public Optional<UserProfileDTO> findUserByEmail(String email) {
        Optional<UserEntity> userEntity = userRepository.findByEmail(email);
        return userEntity.map(this::convertToDTO);
    }
    
    // 회원 수정
    public void updateUser(String email, UserProfileUpdateDTO userProfileUpdateDTO) {
        Optional<UserEntity> userOptional = userRepository.findByEmail(email);
        logger.info("Starting Update ---------");
        if (userOptional.isPresent()) {
            UserEntity userEntity = userOptional.get();
            userEntity.setNickname(userProfileUpdateDTO.getNickName());
            userEntity.setProfileImage(userProfileUpdateDTO.getProfileImage());

            userRepository.save(userEntity);
            logger.info("User updated: " + email );
        } else {
            logger.error("User does not exist");
        }
    }

    private UserProfileDTO convertToDTO(UserEntity userEntity) {
        return UserProfileDTO.builder()
                .email(userEntity.getEmail())
                .nickname(userEntity.getNickname())
                .birthYear(userEntity.getBirthYear())
                .gender(userEntity.getGender())
                .exp(userEntity.getExp())
                .level(userEntity.getLevel())
                .build();
    }
}