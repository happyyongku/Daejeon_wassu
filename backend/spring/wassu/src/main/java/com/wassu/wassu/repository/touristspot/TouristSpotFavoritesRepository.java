package com.wassu.wassu.repository.touristspot;

import com.wassu.wassu.entity.touristspot.TouristSpotFavorites;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TouristSpotFavoritesRepository extends JpaRepository<TouristSpotFavorites, Long> {

    boolean existsByTouristSpotIdAndUserEmail(Long spotId, String userEmail);

    Optional<TouristSpotFavorites> findByTouristSpotIdAndUserEmail(Long touristSpotId, String userEmail);

}
