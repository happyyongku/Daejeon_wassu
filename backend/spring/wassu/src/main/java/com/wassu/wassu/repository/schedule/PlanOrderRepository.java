package com.wassu.wassu.repository.schedule;

import com.wassu.wassu.entity.schedule.PlanOrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface PlanOrderRepository extends JpaRepository<PlanOrderEntity, Long> {

    @Modifying
    @Query("delete from PlanOrderEntity po where po.dailyPlan.id=:planId")
    void deleteByPlanId(Long planId);

}
