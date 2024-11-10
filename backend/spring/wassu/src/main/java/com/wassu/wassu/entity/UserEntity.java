package com.wassu.wassu.entity;

import com.wassu.wassu.entity.review.ReviewEntity;
import com.wassu.wassu.entity.schedule.ScheduleEntity;
import com.wassu.wassu.entity.touristspot.TouristSpotFavorites;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String email;

    @Column(nullable = false, length = 100)
    private String password;

    @Column(nullable = false, length = 10)
    private String gender;

    @Column(nullable = false)
    private Integer birthYear;

    @Column(nullable = false, length=20)
    private String nickname;

    @Column(length = 10)
    private String level;

    private Integer exp;

    private String profileImage;


    @PrePersist
    public void prePersist(
    ) {
        if (this.level == null) {
            this.level = "초보";
        }
        if (this.exp == null) {
            this.exp = 0;
        }
        if (this.profileImage == null) {
            this.profileImage = "default";
        }
    }

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ArticleLikedEntity> articleLikes = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ClearedMarbleEntity> clearedMarbles = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VisitedSpotEntity> visitedSpots = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ArticleReadEntity> articleReads = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReviewEntity> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TouristSpotFavorites> touristSpotFavorites = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ScheduleEntity> schedules = new ArrayList<>();

    public UserEntity(String email, String password, String gender, Integer birthYear, String nickname) {}
}
