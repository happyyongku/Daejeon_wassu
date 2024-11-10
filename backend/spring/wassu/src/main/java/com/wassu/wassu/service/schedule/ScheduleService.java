package com.wassu.wassu.service.schedule;

import com.wassu.wassu.repository.schedule.DailyPlanRepository;
import com.wassu.wassu.repository.schedule.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final DailyPlanRepository planRepository;

}
