package com.wassu.wassu.controller;

import co.elastic.clients.elasticsearch.watcher.Schedule;
import com.wassu.wassu.dto.schedule.CreateScheduleDTO;
import com.wassu.wassu.dto.schedule.ScheduleDTO;
import com.wassu.wassu.dto.schedule.UpdateScheduleDTO;
import com.wassu.wassu.service.schedule.ScheduleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/wassu/courses")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    @PostMapping
    public ResponseEntity<?> createSchedule(@AuthenticationPrincipal String userEmail,
                                            @RequestBody CreateScheduleDTO dto) {
        scheduleService.createSchedule(userEmail, dto);
        return ResponseEntity.ok("Schedule created");
    }

    @PutMapping("/{coursesId}")
    public ResponseEntity<?> updateSchedule(@AuthenticationPrincipal String userEmail,
                                            @PathVariable Long coursesId,
                                            @RequestBody UpdateScheduleDTO dto) {
        scheduleService.updateSchedule(userEmail, coursesId, dto);
        return ResponseEntity.ok("Schedule updated");
    }

}
