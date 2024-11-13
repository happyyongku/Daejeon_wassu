package com.wassu.wassu.controller;

import com.wassu.wassu.dto.marble.CreateRoomDTO;
import com.wassu.wassu.dto.marble.InviteRoomDTO;
import com.wassu.wassu.dto.marble.JoinRoomDTO;
import com.wassu.wassu.dto.marble.MissionVerifyDTO;
import com.wassu.wassu.service.marble.MarbleService;
import com.wassu.wassu.service.marble.SseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
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

    // 테마보드 선택 및 방 생성
    @PostMapping("/{marbleId}")
    public ResponseEntity<?> createMarble(@AuthenticationPrincipal String userEmail,
                                          @PathVariable Long marbleId,
                                          @RequestBody CreateRoomDTO dto) {
        InviteRoomDTO result = marbleService.createMarble(marbleId, userEmail, dto);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{marbleId}/sync")
    public SseEmitter connect(@PathVariable Long marbleId) {
        return sseService.createEmitter(marbleId); // 클라이언트 연결을 위한 Emitter 생성
    }

    // 방 입장
    @PostMapping("/room/join")
    public ResponseEntity<?> joinRoom(@AuthenticationPrincipal String userEmail,
                                        @RequestBody JoinRoomDTO dto) {
        marbleService.joinRoom(userEmail, dto);
    }

    @PostMapping("/{roomCode}/roll-dice")
    public ResponseEntity<?> rollDice(@PathVariable String roomCode, @RequestBody int currentPosition) {
        int[] diceValues = marbleService.rollDice();
        int newPosition = currentPosition + diceValues[0] + diceValues[1];
        sseService.sendPiecePosition(roomCode, newPosition, diceValues);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/mission/verify")
    public ResponseEntity<?> verifyMission(@RequestBody MissionVerifyDTO dto) {

    }

    // 데이터 변경 이벤트가 발생할 때마다 모든 연결된 Emitter에 데이터 전송
    @EventListener
    public void handleDataChangeEvent() {
        // 여기에 전달할 마블 데이터 객체 만들어서 인자로 받고
        // ApplicationEventPublisher 로 변경 발생때마다 객체 publish 하면 됨
    }
}