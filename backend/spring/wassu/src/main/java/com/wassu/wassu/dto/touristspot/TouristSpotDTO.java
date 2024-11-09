package com.wassu.wassu.dto.touristspot;

import com.wassu.wassu.dto.review.ReviewDTO;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
public class TouristSpotDTO {

    private Long id;
    private String spotName;
    private String spotAddress;
    private Float rating;
    private Integer userRatingsTotal;
    private int favoritesCount;
    private String spotDescription;
    private Double latitude;
    private Double longitude;
    private List<TouristSpotTagDto> touristSpotTags;
    private List<TouristSpotImageDto> touristSpotImages;
    private List<ReviewDTO> reviews;

}
