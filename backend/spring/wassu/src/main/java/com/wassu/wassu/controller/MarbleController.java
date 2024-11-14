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
    @GetMapping(value = "/{roomId}/sync", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public ResponseEntity<?> connect(@PathVariable Long roomId) {
        SseEmitter emitter = sseService.createEmitter(roomId);// 클라이언트 연결을 위한 Emitter 생성
        return ResponseEntity.ok(emitter);
    }

    @GetMapping("/test/{roomId}")
    public ResponseEntity<?> test(@PathVariable Long roomId) {
        sseService.emitterTest(roomId);
        return ResponseEntity.ok().build();
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
    public ResponseEntity<?> getRoomDetails(@PathVariable Long roomId) {
        RoomDTO result = marbleService.getRoomDetails(roomId);
        return ResponseEntity.ok(result);
    }

    // 노드 상세정보 조회
    @GetMapping("/node/{nodeId}")
    public ResponseEntity<?> getNodeDetails(@PathVariable Long nodeId) {
        NodeDTO result = marbleService.getNodeDetails(nodeId);
        return ResponseEntity.ok(result);
    }

    // 주사위 굴리기
    @PostMapping("/{roomId}/roll-dice")
    public ResponseEntity<?> rollDice(@PathVariable Long roomId, @RequestBody int currentPosition) {
        int[] diceValues = marbleService.rollDice();
        int newPosition = currentPosition + diceValues[0] + diceValues[1];
        sseService.sendPiecePosition(roomId, newPosition, diceValues);
        return ResponseEntity.ok().build();
    }

    // 장소 인증
    @PostMapping("/mission/{nodeId}/verify")
    public ResponseEntity<?> verifyMission(@PathVariable Long nodeId,
                                           @RequestBody MissionVerifyDTO dto) {
        boolean result = marbleService.verifyMission(nodeId, dto);
        return ResponseEntity.ok(Map.of("verified", result));
    }

    // 데이터 변경 이벤트가 발생할 때마다 모든 연결된 Emitter에 데이터 전송
//    @EventListener
//    public void handleDataChangeEvent() {
//        // 여기에 전달할 마블 데이터 객체 만들어서 인자로 받고
//        // ApplicationEventPublisher 로 변경 발생때마다 객체 publish 하면 됨
//    }
}