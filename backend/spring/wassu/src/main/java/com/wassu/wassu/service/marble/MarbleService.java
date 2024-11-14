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
import com.wassu.wassu.service.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.ArrayList;
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

    private final UserService userService;
    private final SseService sseService;

    private static final double EARTH_RADIUS = 6371000;

    public List<MarbleDTO> getMarbles() {
        return marbleRepository.findAll().stream()
                .map(marble -> new MarbleDTO(marble.getId(), marble.getMarbleName())).toList();
    }

    public InviteRoomDTO createMarble(Long marbleId, String email, CreateRoomDTO dto) {
        UserEntity creator = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));
        MarbleEntity marble = marbleRepository.findById(marbleId).orElseThrow(() -> new CustomException(CustomErrorCode.MARBLE_NOT_FOUND));
        MarbleRoomEntity room = MarbleRoomEntity.builder()
                .marble(marble)
                .creator(creator)
                .build();
        String code = null;
        if (!dto.isSingle()) { // 같이도슈면 초대코드 생성
            code = generateInviteCode();
            room.setSingle(false);
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
        return new NodeDTO(nodeId, spot.getId(), spot.getSpotName(), thumbnailUrl, node.getNodeOrder());
    }

    public RoomDTO getRoomDetails(Long roomId) {
        if (roomRepository.isSingleRoom(roomId)) {
            MarbleRoomEntity room = roomRepository.findSingleRoomDetails(roomId).orElseThrow(() -> new CustomException(CustomErrorCode.ROOM_NOT_FOUND));
            return createRoomDTO(roomId, room);
        } else {
            MarbleRoomEntity room = roomRepository.findMultiRoomDetails(roomId).orElseThrow(() -> new CustomException(CustomErrorCode.ROOM_NOT_FOUND));
            RoomDTO roomDTO = createRoomDTO(roomId, room);
            roomDTO.setGuest(userService.convertToDTO(room.getGuest()));
            return roomDTO;
        }
    }

    public void rollDice(String email, Long roomId) {
        MarbleRoomEntity room = roomRepository.findById(roomId).orElseThrow(() -> new CustomException(CustomErrorCode.ROOM_NOT_FOUND));

        int dice1 = (int) (Math.random() * 6) + 1;
        int dice2 = (int) (Math.random() * 6);

        if (isCreator(email, room)) {
            if (!room.isCreatorVerified()) { // 장소인증 안했으면 주사위굴리기 불가
                throw new CustomException(CustomErrorCode.MISSION_NOT_VERIFIED);
            }
            room.setCreatorPosition(room.getCreatorPosition() + dice1 + dice2);
            // emitter 로 roomData + diceNumber send
        } else {
            if (!room.isGuestVerified()) { // 장소인증 안했으면 주사위굴리기 불가
                throw new CustomException(CustomErrorCode.MISSION_NOT_VERIFIED);
            }
            room.setGuestPosition(room.getGuestPosition() + dice1 + dice2);
            // emitter 로 roomData + diceNumber send
        }
    }

    public void usePass(String email, Long roomId) {
        MarbleRoomEntity room = roomRepository.findById(roomId).orElseThrow(() -> new CustomException(CustomErrorCode.ROOM_NOT_FOUND));
        // 해당 사용자 장소인증 처리 + 패스권 차감
        if (isCreator(email, room)) {
            room.setCreatorVerified(true);
            room.setCreatorPass(room.getCreatorPass() - 1);
            // emitter 로 roomData send
        } else {
            room.setGuestVerified(true);
            room.setGuestPass(room.getGuestPass() - 1);
            // emitter 로 roomData send
        }
    }

    public void useReroll(String email, Long roomId) {
        MarbleRoomEntity room = roomRepository.findById(roomId).orElseThrow(() -> new CustomException(CustomErrorCode.ROOM_NOT_FOUND));
        int dice1 = (int) (Math.random() * 6) + 1;
        int dice2 = (int) (Math.random() * 6);

        // 해당 사용자 주사위 다시 굴리기 + 리롤권 차감
        if (isCreator(email, room)) {
            if (!room.isCreatorVerified()) { // 장소인증 안했으면 주사위굴리기 불가
                throw new CustomException(CustomErrorCode.MISSION_NOT_VERIFIED);
            }
            room.setCreatorPosition(room.getCreatorPosition() + dice1 + dice2);
            room.setCreatorReroll(room.getCreatorReroll() - 1);
            // emitter 로 roomData + diceNumber send
        } else {
            if (!room.isGuestVerified()) { // 장소인증 안했으면 주사위굴리기 불가
                throw new CustomException(CustomErrorCode.MISSION_NOT_VERIFIED);
            }
            room.setGuestPosition(room.getGuestPosition() + dice1 + dice2);
            room.setGuestReroll(room.getGuestReroll() - 1);
            // emitter 로 roomData + diceNumber send
        }
    }

    public boolean verifyMission(Long nodeId, MissionVerifyDTO dto) {
        NodeEntity node = nodeRepository.findByIdWithSpot(nodeId).orElseThrow(() -> new CustomException(CustomErrorCode.NODE_NOT_FOUND));
        TouristSpotEntity spot = node.getTouristSpot();
        Double longitude = spot.getLongitude();
        Double latitude = spot.getLatitude();
        return isMissionVerified(latitude, longitude, dto.getLatitude(), dto.getLongitude());
    }

    private RoomDTO createRoomDTO(Long roomId, MarbleRoomEntity room) {
        MarbleEntity marble = room.getMarble();
        List<NodeEntity> nodes = marble.getNodes();
        List<NodeDTO> nodeDTOs = new ArrayList<>();
        for (NodeEntity node : nodes) {
            TouristSpotEntity spot = node.getTouristSpot();
            TouristSpotImageEntity thumbnail = spot.getTouristSpotImages().get(0);
            NodeDTO nodeDTO = new NodeDTO(node.getId(), spot.getId(), spot.getSpotName(), thumbnail.getTouristSpotImageUrl(), node.getNodeOrder());
            nodeDTOs.add(nodeDTO);
        }
        return RoomDTO.builder()
                .roomId(roomId)
                .marbleId(marble.getId())
                .marbleName(marble.getMarbleName())
                .single(room.isSingle())
                .nodes(nodeDTOs)
                .creator(userService.convertToDTO(room.getCreator())).build();
    }

    private boolean isCreator(String email, MarbleRoomEntity room) {
        UserEntity guest = room.getGuest();
        UserEntity creator = room.getCreator();
        if (email.equals(creator.getEmail())) {
            return true;
        } else if (email.equals(guest.getEmail())) {
            return false;
        } else {
            throw new CustomException(CustomErrorCode.USER_NOT_FOUND);
        }
    }

    private String generateInviteCode() {
        return new SecureRandom()
                .ints(6, 0, 62)
                .mapToObj("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"::charAt)
                .collect(StringBuilder::new, StringBuilder::append, StringBuilder::append)
                .toString();
    }

    private boolean isMissionVerified(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distance = EARTH_RADIUS * c;

        return distance <= 100;
    }

}
