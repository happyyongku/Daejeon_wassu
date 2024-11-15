package com.wassu.wassu.controller;

import com.wassu.wassu.dto.marble.*;
import com.wassu.wassu.service.marble.MarbleService;
import com.wassu.wassu.service.marble.SseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@RestController
@RequestMapping("/wassu/marble")
@RequiredArgsConstructor
public class MarbleController {

    private final MarbleService marbleService;
    private final SseService sseService;

    // 마블 목록 조회
    @GetMapping
    public ResponseEntity<?> getMarbles() {
        List<MarbleDTO> result = marbleService.getMarbles();
        return ResponseEntity.ok(Map.of("data", result));
    }

    // 테마보드 선택 및 방 생성
    @PostMapping("/{marbleId}")
    public ResponseEntity<?> createMarble(@AuthenticationPrincipal String userEmail,
                                          @PathVariable Long marbleId,
                                          @RequestBody CreateRoomDTO dto) {
        InviteRoomDTO result = marbleService.createMarble(marbleId, userEmail, dto);
        return ResponseEntity.ok(result);
    }

    // SSE 연결
    @GetMapping(value = "/room/{roomId}/sync", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter connect(@AuthenticationPrincipal String userEmail, @PathVariable Long roomId) {
        return sseService.createEmitter(userEmail, roomId);
    }

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

    // 방 입장
    @PostMapping("/room/join")
    public ResponseEntity<?> joinRoom(@AuthenticationPrincipal String userEmail,
                                        @RequestBody JoinRoomDTO dto) {
        Long roomId = marbleService.joinRoom(userEmail, dto);
        if (roomId != null) {
            return ResponseEntity.ok(Map.of("roomId", roomId));
        }
        return ResponseEntity.badRequest().body(Map.of("message", "invalid inviteCode"));
    }

    // 초대코드 재생성
    @PostMapping("/room/{roomId}/code")
    public ResponseEntity<?> generateInviteCode(@PathVariable Long roomId) {
        String code = marbleService.reGenerateInviteCode(roomId);
        return ResponseEntity.ok(Map.of("inviteCode", code));
    }

    // 마블 상세조회
    @GetMapping("/room/{roomId}")
    public ResponseEntity<?> getRoomDetails(@AuthenticationPrincipal String userEmail,
                                            @PathVariable Long roomId) {
        RoomDTO result = marbleService.getRoomDetails(userEmail, roomId);
        return ResponseEntity.ok(result);
    }

    // 노드 상세정보 조회
    @GetMapping("/node/{nodeId}")
    public ResponseEntity<?> getNodeDetails(@PathVariable Long nodeId) {
        NodeDTO result = marbleService.getNodeDetails(nodeId);
        return ResponseEntity.ok(result);
    }

    // 게임 액션 (주사위 굴리기, 패스권, 리롤권)
    @PostMapping("/play/{roomId}")
    public ResponseEntity<?> rollDice(@AuthenticationPrincipal String userEmail,
                                      @PathVariable Long roomId, @RequestParam String action) {
        if ("roll-dice".equals(action)) {
            marbleService.rollDice(userEmail, roomId);
            return ResponseEntity.ok(Map.of("status", "roll-dice success"));
        } else if ("pass".equals(action)) {
            marbleService.usePass(userEmail, roomId);
            return ResponseEntity.ok(Map.of("status", "pass success"));
        } else if ("reroll".equals(action)) {
            marbleService.useReroll(userEmail, roomId);
            return ResponseEntity.ok(Map.of("status", "reroll success"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "invalid action"));
        }
    }

    // 장소 인증
    @PostMapping("/mission/{nodeId}/verify")
    public ResponseEntity<?> verifyMission(@PathVariable Long nodeId,
                                           @RequestBody MissionVerifyDTO dto) {
        boolean result = marbleService.verifyMission(nodeId, dto);
        return ResponseEntity.ok(Map.of("verified", result));
    }

}