package com.wassu.wassu.repository.schedule;

import com.wassu.wassu.entity.schedule.PlanOrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlanOrderRepository extends JpaRepository<PlanOrderEntity, Long> {

    List<PlanOrderEntity> findByPlanId(Long planId);

    void deleteByDailyPlanId(Long planId);

}
