package com.wassu.wassu.controller;

import co.elastic.clients.elasticsearch.watcher.Schedule;
import com.wassu.wassu.dto.schedule.*;
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

    @PutMapping("/{coursesId}/title")
    public ResponseEntity<?> updateScheduleTitle(@AuthenticationPrincipal String userEmail,
                                                 @PathVariable Long coursesId,
                                                 @RequestBody UpdateScheduleTitleDTO dto) {
        scheduleService.updateScheduleTitle(userEmail, coursesId, dto);
        return ResponseEntity.ok("Schedule Title updated");
    }

    @PostMapping("/plan/{planId}")
    public ResponseEntity<?> insertSchedule(@AuthenticationPrincipal String userEmail,
                                            @PathVariable Long planId,
                                            @RequestBody InsertDailyPlanDTO dto) {
        scheduleService.insertSchedule(userEmail, planId, dto);
        return ResponseEntity.ok("Schedule inserted");
    }

    @DeleteMapping("/plan/{planId}")
    public ResponseEntity<?> deleteSpotInPlan(@AuthenticationPrincipal String userEmail,
                                              @PathVariable Long planId,
                                              @RequestBody DeleteSpotDTO dto) {
        scheduleService.deleteSpotInPlan(userEmail, planId, dto);
        return ResponseEntity.ok("TouristSpot deleted");
    }

    @DeleteMapping("/{coursesId}")
    public ResponseEntity<?> deleteSchedule(@AuthenticationPrincipal String userEmail,
                                            @PathVariable Long coursesId) {
        scheduleService.deleteSchedule(userEmail, coursesId);
        return ResponseEntity.ok("Schedule deleted");
    }

}
