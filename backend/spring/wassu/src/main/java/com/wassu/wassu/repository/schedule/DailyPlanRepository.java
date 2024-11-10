package com.wassu.wassu.repository.schedule;

import com.wassu.wassu.entity.schedule.DailyPlanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface DailyPlanRepository extends JpaRepository<DailyPlanEntity, Long> {

    @Query("select dp from DailyPlanEntity dp " +
            "join fetch dp.schedule s " +
            "join fetch s.user u " +
            "where dp.id=:planId")
    Optional<DailyPlanEntity> findByIdWithJoin(Long planId);

}
