package com.wassu.wassu.repository.touristspot;

import com.wassu.wassu.entity.touristspot.TouristSpotEntity;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TouristSpotStampRepository {
    Optional<TouristSpotEntity> findById(Long id);
}
