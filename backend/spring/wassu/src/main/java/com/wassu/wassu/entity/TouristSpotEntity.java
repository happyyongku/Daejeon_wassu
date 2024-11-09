package com.wassu.wassu.entity;

import com.wassu.wassu.entity.review.ReviewEntity;
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

    private int favoritesCount;

    private String spotDescription;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @OneToMany(mappedBy = "touristSpot", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VisitedSpotEntity> visitedSpots;

    @OneToMany(mappedBy = "touristSpot", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TouristSpotTagEntity> touristSpotTags;

    @OneToMany(mappedBy = "touristSpot", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TouristSpotImageEntity> touristSpotImages;

    @OneToMany(mappedBy = "touristSpot", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReviewEntity> reviews;

}
