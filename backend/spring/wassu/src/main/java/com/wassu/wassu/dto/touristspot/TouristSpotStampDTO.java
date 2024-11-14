package com.wassu.wassu.dto.touristspot;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class TouristSpotStampDTO {
    private Long touristSpotId;
    private Double currentLatitude;
    private Double currentLongitude;
    private String category;
}
