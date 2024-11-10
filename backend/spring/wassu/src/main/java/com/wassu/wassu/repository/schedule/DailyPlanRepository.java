package com.wassu.wassu.repository.schedule;

import com.wassu.wassu.entity.schedule.DailyPlanEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DailyPlanRepository extends JpaRepository<DailyPlanEntity, Long> {
}
