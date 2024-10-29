package com.wassu.wassu.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TouristSpotEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50, unique = true)
    private String spotName;

    @Column(nullable = false)
    private String spotAddress;

    private Float rating;

    private Integer userRatingsTotal;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @OneToMany(mappedBy = "touristSpot")
    private List<VisitedSpotEntity> visitedSpots;

    @OneToMany(mappedBy = "touristSpot")
    private List<TouristSpotTagEntity> touristSpotTags;

    @OneToMany(mappedBy = "touristSpot")
    private List<TouristSpotImageEntity> touristSpotImages;

}
