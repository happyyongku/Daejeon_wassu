package com.wassu.wassu.service.marble;

import com.wassu.wassu.dto.marble.SseDTO;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.entity.marble.MarbleRoomEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.test.TestRoom;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class SseService {

    private final Map<Long, Map<String, SseEmitter>> emitters = new ConcurrentHashMap<>();
    private final Map<Long, TestRoom> testRepository = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(10);

    public SseEmitter createEmitter(String email, Long roomId) {
        SseEmitter emitter = new SseEmitter(300_000L);

        // roomId에 해당하는 사용자 맵 가져오기, 없으면 새로 생성
        emitters.computeIfAbsent(roomId, k -> new ConcurrentHashMap<>())
                .put(email, emitter);

        // 연결 종료 시 맵에서 emitter 제거
        emitter.onCompletion(() -> removeEmitter(roomId, email));
        emitter.onTimeout(() -> removeEmitter(roomId, email));
        emitter.onError(e -> removeEmitter(roomId, email));

        // 스케줄러를 사용하여 주기적으로 핑 전송
        scheduler.scheduleAtFixedRate(() -> {
            try {
                emitter.send(SseEmitter.event().name("ping").data("keep-alive"));
                log.info("emitter sent ping: {} {}", roomId, email);
            } catch (IOException e) {
                removeEmitter(roomId, email);
                throw new RuntimeException(e); // 스케줄러 종료를 위해 예외 발생
            }
        }, 0, 30, TimeUnit.SECONDS);

        return emitter;
    }

    public SseEmitter getEmitter(Long roomId, String email) {
        return emitters.get(roomId).get(email);
    }

    public void sendEmitter(UserEntity user, MarbleRoomEntity room, int dice1, int dice2) {
        SseEmitter emitter = getEmitter(room.getId(), user.getEmail());
        SseDTO sseDTO = null;
        if (user.equals(room.getCreator())) {
            sseDTO = SseDTO.builder()
                    .yourPosition(room.getCreatorPosition())
                    .yourVerified(room.isCreatorVerified())
                    .yourReroll(room.getCreatorReroll())
                    .yourPass(room.getCreatorPass())
                    .opponentPosition(room.getCreatorPosition())
                    .opponentVerified(room.isGuestVerified())
                    .opponentReroll(room.getGuestReroll())
                    .opponentPass(room.getGuestPass())
                    .dice1(dice1)
                    .dice2(dice2)
                    .build();
        } else {
            sseDTO = SseDTO.builder()
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
            emitter.send(sseDTO);
        } catch (IOException e) {
            throw new CustomException(CustomErrorCode.SSE_CONNECTION_ERROR);
        }
    }

    public void sendEmitter(UserEntity user, MarbleRoomEntity room) {
        SseEmitter emitter = getEmitter(room.getId(), user.getEmail());
        SseDTO sseDTO = null;
        if (user.equals(room.getCreator())) {
            sseDTO = SseDTO.builder()
                    .yourPosition(room.getCreatorPosition())
                    .yourVerified(room.isCreatorVerified())
                    .yourReroll(room.getCreatorReroll())
                    .yourPass(room.getCreatorPass())
                    .opponentPosition(room.getCreatorPosition())
                    .opponentVerified(room.isGuestVerified())
                    .opponentReroll(room.getGuestReroll())
                    .opponentPass(room.getGuestPass())
                    .build();
        } else {
            sseDTO = SseDTO.builder()
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
            emitter.send(sseDTO);
        } catch (IOException e) {
            throw new CustomException(CustomErrorCode.SSE_CONNECTION_ERROR);
        }
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

    public SseEmitter testEmitter(String email, Long roomId) {
        TestRoom existRoom = testRepository.get(roomId);
        if (existRoom == null) {
            TestRoom newRoom = new TestRoom();
            newRoom.setUser1Email(email);
            testRepository.put(roomId, newRoom);
        } else {
            existRoom.setUser2Email(email);
        }
        return createEmitter(email, roomId);
    }

    public void testSend(String email, Long roomId) {
        Random random = new Random();
        int randomNumber1 = random.nextInt(100);
        int randomNumber2 = random.nextInt(100);
        Map<String, SseEmitter> roomEmitters = emitters.get(roomId);
        TestRoom testRoom = testRepository.get(roomId);
        testRoom.setUser1Data(randomNumber1);
        testRoom.setUser2Data(randomNumber2);
        if (roomEmitters != null) {
            for (Map.Entry<String, SseEmitter> entry : roomEmitters.entrySet()) {
                String userEmail = entry.getKey();
                SseEmitter emitter = entry.getValue();
                try {
                    emitter.send(SseEmitter.event().name("room-data").data(testRoom));
                } catch (IOException e) {
                    emitter.completeWithError(e);
                }
            }
        } else {
            log.info("mapping roomId:emitter not found");
        }
    }

}
