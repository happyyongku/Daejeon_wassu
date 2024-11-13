package com.wassu.wassu.dto.touristspot;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TouristSpotStampDTO {
    private Long touristSpotId;
    private Double currentLongitude;
    private Double currentLatitude;
}
