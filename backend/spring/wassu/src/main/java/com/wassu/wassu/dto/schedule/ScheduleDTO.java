package com.wassu.wassu.dto.schedule;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@AllArgsConstructor
public class ScheduleDTO {

    private Long scheduleId;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<DailyPlanDTO> plans;

}
