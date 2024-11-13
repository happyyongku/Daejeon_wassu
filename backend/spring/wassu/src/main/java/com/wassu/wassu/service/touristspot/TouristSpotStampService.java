package com.wassu.wassu.service.touristspot;


import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.entity.touristspot.TouristSpotEntity;
import com.wassu.wassu.entity.touristspot.TouristSpotStampEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.repository.touristspot.TouristSpotRepository;
import com.wassu.wassu.repository.touristspot.TouristSpotStampRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.DeletedObject;

import java.util.Optional;

@Service
@Slf4j
public class TouristSpotStampService {

    private static final double EARTH_RADIUS = 6378.137;
    private static final Integer SEARCH_RADIUS = 500;

    private final TouristSpotRepository touristSpotRepository;
    private final UserRepository userRepository;
    private final TouristSpotStampRepository touristSpotStampRepository;

    public TouristSpotStampService(TouristSpotRepository touristSpotRepository, UserRepository userRepository, TouristSpotStampRepository touristSpotStampRepository) {
        this.touristSpotRepository = touristSpotRepository;
        this.userRepository = userRepository;
        this.touristSpotStampRepository = touristSpotStampRepository;
    }

    public Boolean touristSpotStamp(
            Long touristSpotId,
            Double currentLatitude,
            Double currentLongitude,
            String userEmail
    ) {
        Optional<UserEntity> optionalUser = userRepository.findByEmail(userEmail);
        Optional<TouristSpotEntity> optioanlSpot = touristSpotRepository.findById(touristSpotId);
        UserEntity userEntity;
        TouristSpotEntity spotEntity;
        if (optionalUser.isPresent() && optioanlSpot.isPresent()) {
            userEntity = optionalUser.get();
            spotEntity = optioanlSpot.get();
        } else {
            log.error("User or Spot not found -- stamp");
            throw new CustomException(CustomErrorCode.USER_OR_SPOT_NOT_FOUND);
        }
        Double latitude = spotEntity.getLatitude();
        Double longitude = spotEntity.getLongitude();

        double distance = calculateDistance(latitude, longitude, currentLatitude, currentLongitude);
        if (distance <= SEARCH_RADIUS) {
            savingStamp(userEntity, spotEntity);
            return true;
        } else {
            log.error("Distance exceeded -- stamp");
            return false;
        }
    }
    
    // 좌표 기반 거리 계산
    private double calculateDistance(double lat1, double lng1, double lat2, double lng2) {

        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLng / 2) * Math.sin(dLng / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c * 1000;
    }

    private void savingStamp(UserEntity userEntity, TouristSpotEntity touristSpotEntity) {
        try {
            log.info("Start to save tourist spot: ");
            TouristSpotStampEntity touristSpotStampEntity = TouristSpotStampEntity.builder()
                    .touristSpot(touristSpotEntity)
                    .user(userEntity)
                    .build();
            touristSpotStampRepository.save(touristSpotStampEntity);
        } catch (Exception e) {
            log.error("Exception in saving stamp");
            throw new CustomException(CustomErrorCode.FAILED_TO_SAVING_STAMP);
        }


    }
}
