package com.wassu.wassu.entity.schedule;

import com.wassu.wassu.entity.touristspot.TouristSpotEntity;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
public class DailyPlanEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "schedule_entity_id")
    private ScheduleEntity schedule;

    @OneToMany(mappedBy = "dailyPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TouristSpotEntity> touristSpots = new ArrayList<>();

}
