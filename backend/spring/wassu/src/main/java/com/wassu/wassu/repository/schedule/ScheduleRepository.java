package com.wassu.wassu.repository.schedule;

import com.wassu.wassu.entity.schedule.ScheduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ScheduleRepository extends JpaRepository<ScheduleEntity, Long> {

    @Query("select se from ScheduleEntity se " +
            "join fetch se.dailyPlans dp " +
            "join fetch dp.planOrders po " +
            "join fetch po.touristSpot ts " +
            "where se.id=:id")
    Optional<ScheduleEntity> findByIdWithJoin(Long id);

}
