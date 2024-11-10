package com.wassu.wassu.dto.schedule;

import lombok.Getter;

import java.util.List;

@Getter
public class UpdateScheduleDTO {

    private List<UpdateDailyPlanDTO> dailyPlans;

}
