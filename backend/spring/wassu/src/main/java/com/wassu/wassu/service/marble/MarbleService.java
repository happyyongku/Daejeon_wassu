package com.wassu.wassu.service.marble;

import com.wassu.wassu.dto.marble.*;
import com.wassu.wassu.dto.touristspot.TouristSpotDTO;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.entity.marble.MarbleEntity;
import com.wassu.wassu.entity.marble.MarbleRoomEntity;
import com.wassu.wassu.entity.marble.NodeEntity;
import com.wassu.wassu.entity.touristspot.TouristSpotEntity;
import com.wassu.wassu.entity.touristspot.TouristSpotImageEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.repository.marble.MarbleRepository;
import com.wassu.wassu.repository.marble.MarbleRoomRepository;
import com.wassu.wassu.repository.marble.NodeRepository;
import com.wassu.wassu.repository.marble.RedisRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class MarbleService {

    private final UserRepository userRepository;
    private final MarbleRepository marbleRepository;
    private final MarbleRoomRepository roomRepository;
    private final RedisRepository redisRepository;
    private final NodeRepository nodeRepository;

    public int[] rollDice() {
        int dice1 = (int) (Math.random() * 6) + 1;
        int dice2 = (int) (Math.random() * 6);
        return new int[]{dice1, dice2};
    }

    public List<MarbleDTO> getMarbles() {
        return marbleRepository.findAll().stream()
                .map(marble -> new MarbleDTO(marble.getId(), marble.getMarbleName())).toList();
    }

    public InviteRoomDTO createMarble(Long marbleId, String email, CreateRoomDTO dto) {
        UserEntity creator = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));
        MarbleEntity marble = marbleRepository.findById(marbleId).orElseThrow(() -> new CustomException(CustomErrorCode.MARBLE_NOT_FOUND));
        MarbleRoomEntity room = MarbleRoomEntity.builder()
                .single(dto.isSingle())
                .marble(marble)
                .creator(creator)
                .build();
        String code = null;
        if (!dto.isSingle()) { // 같이도슈면 초대코드 생성
            code = generateInviteCode();
            room.setSingle(true);
            room.setInviteCode(code);
        }
        MarbleRoomEntity savedRoom = roomRepository.save(room);
        if (code != null) {
            redisRepository.createCertification(code, savedRoom.getId());
        }
        return new InviteRoomDTO(savedRoom.getId(), savedRoom.getInviteCode());
    }

    public Long joinRoom(String email, JoinRoomDTO dto) {
        if (redisRepository.existsByInviteCode(dto.getInviteCode())) {
            Long roomId = redisRepository.getRoomId(dto.getInviteCode());
            MarbleRoomEntity room = roomRepository.findById(roomId).orElseThrow(() -> new CustomException(CustomErrorCode.ROOM_NOT_FOUND));
            UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));
            room.setGuest(user);
            return roomId;
        }
        return null;
    }

    public String reGenerateInviteCode(Long roomId) {
        String code = generateInviteCode();
        redisRepository.createCertification(code, roomId);
        return code;
    }

    public NodeDTO getNodeDetails(Long nodeId) {
        NodeEntity node = nodeRepository.findByIdWithJoin(nodeId).orElseThrow(() -> new CustomException(CustomErrorCode.NODE_NOT_FOUND));
        TouristSpotEntity spot = node.getTouristSpot();
        TouristSpotImageEntity thumbnail = spot.getTouristSpotImages().get(0);
        String thumbnailUrl = thumbnail.getTouristSpotImageUrl();
        return new NodeDTO(nodeId, spot.getId(), spot.getSpotName(), thumbnailUrl);
    }

    private String generateInviteCode() {
        return new SecureRandom()
                .ints(6, 0, 62)
                .mapToObj("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"::charAt)
                .collect(StringBuilder::new, StringBuilder::append, StringBuilder::append)
                .toString();
    }

}
