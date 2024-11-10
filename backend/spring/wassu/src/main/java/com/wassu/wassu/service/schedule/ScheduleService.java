package com.wassu.wassu.service.schedule;

import com.wassu.wassu.dto.schedule.CreateDailyPlanDTO;
import com.wassu.wassu.dto.schedule.CreateScheduleDTO;
import com.wassu.wassu.dto.schedule.UpdateDailyPlanDTO;
import com.wassu.wassu.dto.schedule.UpdateScheduleDTO;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.entity.schedule.DailyPlanEntity;
import com.wassu.wassu.entity.schedule.PlanOrderEntity;
import com.wassu.wassu.entity.schedule.ScheduleEntity;
import com.wassu.wassu.entity.touristspot.TouristSpotEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.repository.schedule.DailyPlanRepository;
import com.wassu.wassu.repository.schedule.PlanOrderRepository;
import com.wassu.wassu.repository.schedule.ScheduleRepository;
import com.wassu.wassu.repository.touristspot.TouristSpotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final DailyPlanRepository planRepository;
    private final UserRepository userRepository;
    private final TouristSpotRepository spotRepository;
    private final PlanOrderRepository planOrderRepository;

    public void createSchedule(String email, CreateScheduleDTO dto) {
        UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));
        // 새 일정 생성
        ScheduleEntity schedule = new ScheduleEntity(dto.getStartDate(), dto.getEndDate(), user);
        ScheduleEntity savedSchedule = scheduleRepository.save(schedule);
        // 일일 계획 생성 후 일정에 추가
        List<CreateDailyPlanDTO> dailyPlans = dto.getDailyPlans();
        for (CreateDailyPlanDTO dailyPlan : dailyPlans) {
            // 일일 계획 생성
            DailyPlanEntity plan = new DailyPlanEntity(dailyPlan.getDate(), savedSchedule);
            DailyPlanEntity savedPlan = planRepository.save(plan);
            // 해당일 관광지 목록 추출 및 순서 지정
            List<Long> spotIds = dailyPlan.getSpotIds();
            generatePlanOrders(spotIds, savedPlan);
        }
    }

    public void updateSchedule(String email, Long coursesId, UpdateScheduleDTO dto) {
        UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));
        ScheduleEntity schedule = scheduleRepository.findById(coursesId).orElseThrow(() -> new CustomException(CustomErrorCode.SCHEDULE_NOT_FOUND));
        // 본인 아니면 수정 불가
        if (!schedule.getUser().equals(user)) {
            throw new CustomException(CustomErrorCode.PERMISSION_DENIED);
        }
        List<UpdateDailyPlanDTO> dailyPlans = dto.getDailyPlans();
        for (UpdateDailyPlanDTO dailyPlan : dailyPlans) {
            DailyPlanEntity plan = planRepository.findById(dailyPlan.getPlanId()).orElseThrow(() -> new CustomException(CustomErrorCode.PLAN_NOT_FOUND));
            // 기존 관광지 연결 제거
            planOrderRepository.deleteByDailyPlanId(plan.getId());
            generatePlanOrders(dailyPlan.getUpdatedOrder(), plan);
        }
    }

    private void generatePlanOrders(List<Long> spotIds, DailyPlanEntity savedPlan) {
        List<TouristSpotEntity> spotList = new ArrayList<>();
        for (Long spotId : spotIds) {
            TouristSpotEntity spot = spotRepository.findById(spotId).orElseThrow(() -> new CustomException(CustomErrorCode.TOURIST_NOT_FOUND));
            spotList.add(spot);
        }
        // 일일 계획에 관광지 추가
        int order = 0; // 관광지 순서
        for (TouristSpotEntity touristSpot : spotList) {
            PlanOrderEntity planOrder = new PlanOrderEntity(order, savedPlan, touristSpot);
            planOrderRepository.save(planOrder);
            order++;
        }
    }

}
