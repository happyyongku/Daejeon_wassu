package com.wassu.wassu.service.marble;

import com.wassu.wassu.dto.marble.CreateRoomDTO;
import com.wassu.wassu.dto.marble.InviteRoomDTO;
import com.wassu.wassu.dto.marble.JoinRoomDTO;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.entity.marble.MarbleEntity;
import com.wassu.wassu.entity.marble.MarbleRoomEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.repository.marble.MarbleRepository;
import com.wassu.wassu.repository.marble.MarbleRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class MarbleService {

    private final UserRepository userRepository;
    private final MarbleRepository marbleRepository;
    private final MarbleRoomRepository roomRepository;

    public int[] rollDice() {
        int dice1 = (int) (Math.random() * 6) + 1;
        int dice2 = (int) (Math.random() * 6);
        return new int[]{dice1, dice2};
    }

    public InviteRoomDTO createMarble(Long marbleId, String email, CreateRoomDTO dto) {
        UserEntity creator = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));
        MarbleEntity marble = marbleRepository.findById(marbleId).orElseThrow(() -> new CustomException(CustomErrorCode.MARBLE_NOT_FOUND));
        MarbleRoomEntity room = MarbleRoomEntity.builder()
                .single(dto.isSingle())
                .marble(marble)
                .creator(creator)
                .build();
        if (!dto.isSingle()) { // 같이도슈면 초대코드 생성
            room.setSingle(true);
            room.setInviteCode(generateInviteCode());
        }
        MarbleRoomEntity savedRoom = roomRepository.save(room);
        return new InviteRoomDTO(savedRoom.getId(), savedRoom.getInviteCode());
    }

    public void joinRoom(String email, JoinRoomDTO dto) {

    }

    private String generateInviteCode() {
        return new SecureRandom()
                .ints(6, 0, 62)
                .mapToObj("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"::charAt)
                .collect(StringBuilder::new, StringBuilder::append, StringBuilder::append)
                .toString();
    }

}
