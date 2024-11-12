package com.wassu.wassu.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@RestController
public class SSEController {

    // 룸 코드별 SseEmitter 맵
    private final Map<String, List<SseEmitter>> roomEmitters = new ConcurrentHashMap<>();

    // 클라이언트가 SSE 연결을 설정하는 엔드포인트
    @GetMapping("wassu/marble/room/sync/{roomCode}")
    public SseEmitter connectSse(@PathVariable String roomCode) {
        SseEmitter emitter = new SseEmitter(300_000L); // 5분 타임아웃
        roomEmitters.computeIfAbsent(roomCode, key -> new ArrayList<>()).add(emitter);

        // 연결이 종료되거나 타임아웃될 때 리스트에서 Emitter 제거
        emitter.onCompletion(() -> roomEmitters.get(roomCode).remove(emitter));
        emitter.onTimeout(() -> roomEmitters.get(roomCode).remove(emitter));

        return emitter;
    }

    // 데이터 변경 이벤트가 발생할 때마다 모든 연결된 Emitter에 데이터 전송
    @EventListener
    public void handleDataChangeEvent() {
        // 여기에 전달할 마블 데이터 객체 만들어서 인자로 받고
        // ApplicationEventPublisher 로 변경 발생때마다 객체 publish 하면 됨
    }
}