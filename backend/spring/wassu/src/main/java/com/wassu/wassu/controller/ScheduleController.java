package com.wassu.wassu.controller;

import com.wassu.wassu.service.schedule.ScheduleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/wassu")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    

}
