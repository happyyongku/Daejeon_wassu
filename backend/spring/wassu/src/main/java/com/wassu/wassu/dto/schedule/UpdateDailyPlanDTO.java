package com.wassu.wassu.dto.schedule;

import lombok.Getter;

import java.util.List;

@Getter
public class UpdateDailyPlanDTO {

    private Long planId;
    private List<String> updatedOrder; // 변경된 관광지 id 순서

}
