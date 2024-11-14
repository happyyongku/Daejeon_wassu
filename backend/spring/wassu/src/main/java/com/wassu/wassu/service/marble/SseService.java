package com.wassu.wassu.service.marble;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class SseService {

    private final Map<Long, Map<String, SseEmitter>> emitters = new ConcurrentHashMap<>();

    public SseEmitter createEmitter(String email, Long roomId) {
        SseEmitter emitter = new SseEmitter();

        // roomId에 해당하는 사용자 맵 가져오기, 없으면 새로 생성
        emitters.computeIfAbsent(roomId, k -> new ConcurrentHashMap<>())
                .put(email, emitter);

        // 연결 종료 시 맵에서 emitter 제거
        emitter.onCompletion(() -> removeEmitter(roomId, email));
        emitter.onTimeout(() -> removeEmitter(roomId, email));
        emitter.onError(e -> removeEmitter(roomId, email));
        return emitter;
    }

    public SseEmitter getEmitter(Long roomId, String email) {
        return emitters.get(roomId).get(email);
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

}
