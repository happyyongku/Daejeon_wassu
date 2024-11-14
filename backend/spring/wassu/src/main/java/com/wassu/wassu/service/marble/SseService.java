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

    public SseEmitter createEmitter(Long roomId) {
        SseEmitter emitter = new SseEmitter(-1L);
        emitters.put(roomId, emitter);
        emitter.onCompletion(() -> emitters.remove(roomId));
        emitter.onTimeout(() -> emitters.remove(roomId));
        return emitter;
    }

    public void emitterTest(Long roomId) {
        SseEmitter sseEmitter = emitters.get(roomId);
        try {
            sseEmitter.send("sse connect test success");
        } catch (IOException e) {
            log.info(e.getMessage());
        }
    }

    public void sendPiecePosition(Long roomId, int position, int[] diceValues) {
        SseEmitter emitter = emitters.get(roomId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name("positionUpdate")
                        .data(Map.of("position", position, "dice", diceValues)));
            } catch (IOException e) {
                emitters.remove(roomId);
            }
        }
    }

}
