package com.wassu.wassu.service;

import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.dto.user.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Optional;

import lombok.*;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 회원가입
    public UserEntity createUser(UserEntity userEntity) {
        if (userRepository.findByEmail(userEntity.getEmail()).isPresent()) {
            logger.error("Email already exists");
            throw new IllegalStateException("Email already exists");
        }
        return userRepository.save(userEntity);
    }
    
    // id 기반 유저 조회
    public Optional<UserDTO> findUserById(Long id) {
        Optional<UserEntity> userEntity = userRepository.findById(id);
        return userEntity.map(this::convertToDTO);
    }
    
    // email 기반 유저 조히
    public Optional<UserDTO> findUserByEmail(String email) {
        Optional<UserEntity> userEntity = userRepository.findByEmail(email);
        return userEntity.map(this::convertToDTO);
    }
    
    // 회원 수정
    public UserEntity updateUser(Long id, UserEntity updateUser) {
        UserEntity existingUser = userRepository.findById(id).orElseThrow(() ->
                new IllegalArgumentException("해당 유저를 찾을 수 없습니다."));
        existingUser.setEmail(updateUser.getEmail());
        existingUser.setNickname(updateUser.getNickname());
        existingUser.setBirthYear(updateUser.getBirthYear());
        existingUser.setGender(updateUser.getGender());

        return userRepository.save(existingUser);
    }
    
    // 회원 삭제
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("해당 유저를 찾을 수 없습니다.");
        }
        userRepository.deleteById(id);
    }

    private UserDTO convertToDTO(UserEntity userEntity) {
        return UserDTO.builder()
                .id(userEntity.getId())
                .email(userEntity.getEmail())
                .nickname(userEntity.getNickname())
                .birthYear(userEntity.getBirthYear())
                .gender(userEntity.getGender())
                .build();
    }
}