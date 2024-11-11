package com.wassu.wassu.service.schedule;

import com.wassu.wassu.dto.schedule.MyScheduleDTO;
import com.wassu.wassu.dto.schedule.ScheduleProfileDTO;
import com.wassu.wassu.entity.schedule.ScheduleEntity;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.repository.schedule.DailyPlanRepository;
import com.wassu.wassu.repository.schedule.PlanOrderRepository;
import com.wassu.wassu.repository.schedule.ScheduleRepository;
import com.wassu.wassu.repository.touristspot.TouristSpotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ScheduleInfoService {

    private final ScheduleRepository scheduleRepository;
    private final DailyPlanRepository planRepository;
    private final UserRepository userRepository;
    private final TouristSpotRepository spotRepository;
    private final PlanOrderRepository planOrderRepository;

    public MyScheduleDTO findMyScheduleInfo(String email) {
        List<ScheduleEntity> schedules = scheduleRepository.findByUserEmail(email);
        MyScheduleDTO mySchedules = new MyScheduleDTO();
        List<ScheduleProfileDTO> upcomingSchedules = new ArrayList<>();
        List<ScheduleProfileDTO> pastSchedules = new ArrayList<>();

        for (ScheduleEntity schedule : schedules) {
            LocalDate startDate = schedule.getStartDate();
            LocalDate endDate = schedule.getEndDate();

            // 여행일정 상태 구분 (진행중/다가오는/지난)
            LocalDate today = LocalDate.now();

            if (endDate.isBefore(today)) { // 지난 여행
                ScheduleProfileDTO scheduleProfile = ScheduleProfileDTO.builder()
                        .scheduleId(schedule.getId())
                        .title(schedule.getTitle())
                        .startDate(startDate)
                        .endDate(endDate)
                        .thumbnail(schedule.getThumbnail())
                        .spotCount(planOrderRepository.countPlanOrders(schedule.getId())).build();
                pastSchedules.add(scheduleProfile);
            } else if (startDate.isAfter(today)) { // 다가오는 여행
                ScheduleProfileDTO scheduleProfile = ScheduleProfileDTO.builder()
                        .scheduleId(schedule.getId())
                        .title(schedule.getTitle())
                        .startDate(startDate)
                        .endDate(endDate)
                        .thumbnail(schedule.getThumbnail())
                        .spotCount(planOrderRepository.countPlanOrders(schedule.getId())).build();
                upcomingSchedules.add(scheduleProfile);
            } else { // 진행중인 여행
                ScheduleProfileDTO scheduleProfile = ScheduleProfileDTO.builder()
                        .scheduleId(schedule.getId())
                        .title(schedule.getTitle())
                        .startDate(startDate)
                        .endDate(endDate)
                        .thumbnail(schedule.getThumbnail())
                        .spotCount(planOrderRepository.countPlanOrders(schedule.getId())).build();
                mySchedules.setOnGoingSchedules(scheduleProfile);
            }
            mySchedules.setUpcomingSchedules(upcomingSchedules);
            mySchedules.setPastSchedules(pastSchedules);
        }
        return mySchedules;
    }

}
