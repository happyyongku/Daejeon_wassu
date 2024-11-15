package com.wassu.wassu.test;

import com.wassu.wassu.service.marble.SseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;

@RestController
@RequestMapping("/wassu/tourist")
@RequiredArgsConstructor
public class TestController {

    private final SseService sseService;

    // sse 테스트
    @GetMapping(value = "/test/{roomId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter test(@AuthenticationPrincipal String userEmail, @PathVariable Long roomId) {
        return sseService.testEmitter(userEmail, roomId);
    }
    // sse 전송 테스트
    @GetMapping("/send/{roomId}")
    public ResponseEntity<?> send(@AuthenticationPrincipal String userEmail, @PathVariable Long roomId) {
        sseService.testSend(userEmail, roomId);
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

}
