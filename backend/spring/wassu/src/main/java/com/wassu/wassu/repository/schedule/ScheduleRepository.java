package com.wassu.wassu.repository.schedule;

import com.wassu.wassu.entity.schedule.ScheduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleRepository extends JpaRepository<ScheduleEntity, Long> {
}
