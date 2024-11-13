package com.wassu.wassu.service.marble;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class SseService {

    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter createEmitter(Long marbleId) {
        SseEmitter emitter = new SseEmitter();
        emitters.put(marbleId, emitter);
        emitter.onCompletion(() -> emitters.remove(marbleId));
        emitter.onTimeout(() -> emitters.remove(marbleId));
        return emitter;
    }

    public void sendPiecePosition(String roomCode, int position, int[] diceValues) {
        SseEmitter emitter = emitters.get(roomCode);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name("positionUpdate")
                        .data(Map.of("position", position, "dice", diceValues)));
            } catch (IOException e) {
                emitters.remove(roomCode);
            }
        }
    }

}
