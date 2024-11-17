package com.wassu.wassu.service.marble;

import com.wassu.wassu.dto.marble.SseDTO;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.entity.marble.MarbleRoomEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.repository.marble.MarbleRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.*;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class SseService {

    private final MarbleRoomRepository roomRepository;
    private final UserRepository userRepository;
    private final Map<Long, Map<String, SseEmitter>> emitters = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(10);

    public SseEmitter createEmitter(String email, Long roomId) {
        UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));
        MarbleRoomEntity room = roomRepository.findById(roomId).orElseThrow(() -> new CustomException(CustomErrorCode.ROOM_NOT_FOUND));
        SseEmitter emitter = new SseEmitter(300_000L);
        SecurityContext context = SecurityContextHolder.getContext();

        // roomId에 해당하는 사용자 맵 가져오기, 없으면 새로 생성
        emitters.computeIfAbsent(roomId, k -> new ConcurrentHashMap<>())
                .put(email, emitter);

        // 연결 종료 시 맵에서 emitter 제거
        emitter.onCompletion(() -> removeEmitter(roomId, email));
        emitter.onTimeout(() -> removeEmitter(roomId, email));
        emitter.onError(e -> removeEmitter(roomId, email));

        // 비동기로 초기 데이터 전송
        CompletableFuture.runAsync(() -> {
            sendEmitter(user, room);
            sendUserInfo(user, room);
        });
        // 스케줄러를 사용하여 주기적으로 핑 전송
        schedulePing(email, roomId, context, emitter);
        return emitter;
    }

    public SseEmitter getEmitter(Long roomId, String email) {
        return emitters.get(roomId).get(email);
    }

    public void sendEmitter(UserEntity user, MarbleRoomEntity room, int dice1, int dice2) {
        SseEmitter emitter = getEmitter(room.getId(), user.getEmail());
        SseDTO sseDTO;
        if (user.equals(room.getCreator())) {
            sseDTO = SseDTO.builder()
                    .ready(room.isReady())
                    .yourPosition(room.getCreatorPosition())
                    .yourVerified(room.isCreatorVerified())
                    .yourReroll(room.getCreatorReroll())
                    .yourPass(room.getCreatorPass())
                    .opponentPosition(room.getGuestPosition())
                    .opponentVerified(room.isGuestVerified())
                    .opponentReroll(room.getGuestReroll())
                    .opponentPass(room.getGuestPass())
                    .dice1(dice1)
                    .dice2(dice2)
                    .build();
        } else {
            sseDTO = SseDTO.builder()
                    .ready(room.isReady())
                    .yourPosition(room.getGuestPosition())
                    .yourVerified(room.isGuestVerified())
                    .yourReroll(room.getGuestReroll())
                    .yourPass(room.getGuestPass())
                    .opponentPosition(room.getCreatorPosition())
                    .opponentVerified(room.isCreatorVerified())
                    .opponentReroll(room.getCreatorReroll())
                    .opponentPass(room.getCreatorPass())
                    .dice1(dice1)
                    .dice2(dice2)
                    .build();
        }
        try {
            emitter.send(SseEmitter.event().name("message").data(sseDTO));
        } catch (IOException e) {
            throw new CustomException(CustomErrorCode.SSE_CONNECTION_ERROR);
        }
    }

    public void sendEmitter(UserEntity user, MarbleRoomEntity room) {
        SseEmitter emitter = getEmitter(room.getId(), user.getEmail());
        SseDTO sseDTO;
        if (user.equals(room.getCreator())) {
            sseDTO = SseDTO.builder()
                    .ready(room.isReady())
                    .yourPosition(room.getCreatorPosition())
                    .yourVerified(room.isCreatorVerified())
                    .yourReroll(room.getCreatorReroll())
                    .yourPass(room.getCreatorPass())
                    .opponentPosition(room.getGuestPosition())
                    .opponentVerified(room.isGuestVerified())
                    .opponentReroll(room.getGuestReroll())
                    .opponentPass(room.getGuestPass())
                    .build();
        } else {
            sseDTO = SseDTO.builder()
                    .ready(room.isReady())
                    .yourPosition(room.getGuestPosition())
                    .yourVerified(room.isGuestVerified())
                    .yourReroll(room.getGuestReroll())
                    .yourPass(room.getGuestPass())
                    .opponentPosition(room.getCreatorPosition())
                    .opponentVerified(room.isCreatorVerified())
                    .opponentReroll(room.getCreatorReroll())
                    .opponentPass(room.getCreatorPass())
                    .build();
        }
        try {
            emitter.send(SseEmitter.event().name("message").data(sseDTO));
        } catch (IOException e) {
            throw new CustomException(CustomErrorCode.SSE_CONNECTION_ERROR);
        }
    }

    private void sendUserInfo(UserEntity user, MarbleRoomEntity room) {
        SseEmitter emitter = getEmitter(room.getId(), user.getEmail());
        UserEntity creator = room.getCreator();
        Map<String, String> userInfo = getUserInfo(user, room, creator);
        try {
            emitter.send(SseEmitter.event().name("userInfo").data(userInfo));
        } catch (IOException e) {
            throw new CustomException(CustomErrorCode.SSE_CONNECTION_ERROR);
        }
    }

    private static Map<String, String> getUserInfo(UserEntity user, MarbleRoomEntity room, UserEntity creator) {
        Map<String, String> userInfo = new HashMap<>();
        UserEntity guest = room.getGuest();
        if (guest != null) {
            if (user.equals(creator)) {
                userInfo.put("you", creator.getEmail());
                userInfo.put("opponent", guest.getEmail());
            } else {
                userInfo.put("you", guest.getEmail());
                userInfo.put("opponent", creator.getEmail());
            }
        } else {
            userInfo.put("you", creator.getEmail());
        }
        return userInfo;
    }

    private void removeEmitter(Long roomId, String email) {
        Map<String, SseEmitter> userEmitters = emitters.get(roomId);
        if (userEmitters != null) {
            userEmitters.remove(email);

            // roomId에 해당하는 사용자 목록이 비었으면 roomId도 제거
            if (userEmitters.isEmpty()) {
                emitters.remove(roomId);
            }
        }
    }

    private void schedulePing(String email, Long roomId, SecurityContext context, SseEmitter emitter) {
        scheduler.scheduleAtFixedRate(() -> {
            try {
                SecurityContextHolder.setContext(context);
                emitter.send(SseEmitter.event().name("message").data("keep-alive"));
                log.info("emitter sent ping: {} {}", roomId, email);
            } catch (IOException e) {
                removeEmitter(roomId, email);
                throw new RuntimeException(e); // 스케줄러 종료를 위해 예외 발생
            }
        }, 0, 30, TimeUnit.SECONDS);
    }

}
