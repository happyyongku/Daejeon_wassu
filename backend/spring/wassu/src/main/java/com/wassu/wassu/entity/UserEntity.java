package com.wassu.wassu.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;

@Entity
@Data
@Table(name="user")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

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

    @OneToMany(mappedBy="user")
    private List<Article> articles;

    @OneToMany(mappedBy = "user")
    private List<ArticleLiked> articleLikes;

    @OneToMany(mappedBy = "user")
    private List<ClearedMarble> clearedMarbles;

    @OneToMany(mappedBy = "user")
    private List<VisitedSpot> visitedSpots;

    @OneToMany(mappedBy = "user")
    private List<ArticleRead> articleReads;

    public User(String email, String password, String gender, Integer birthYear, String nickname) {}

}