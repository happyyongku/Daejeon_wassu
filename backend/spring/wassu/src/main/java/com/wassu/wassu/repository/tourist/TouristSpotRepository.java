package com.wassu.wassu.repository.tourist;

import com.wassu.wassu.entity.TouristSpotEntity;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TouristSpotRepository  extends ElasticsearchRepository<TouristSpotEntity, String> {
    Optional<TouristSpotEntity> findByTouristId(Long touristId);
}
