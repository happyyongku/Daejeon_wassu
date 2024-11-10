package com.wassu.wassu.entity.touristspot;

import com.wassu.wassu.entity.VisitedSpotEntity;
import com.wassu.wassu.entity.review.ReviewEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Builder
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class TouristSpotEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String elasticId; // 검색용 엘라스틱 문서랑 매치될 id

    @Column(nullable = false, length = 50, unique = true)
    private String spotName;

    @Column(nullable = false)
    private String spotAddress;

    private Float rating;

    private Integer userRatingsTotal;

    private String spotDescription;

    private int favoritesCount;

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
