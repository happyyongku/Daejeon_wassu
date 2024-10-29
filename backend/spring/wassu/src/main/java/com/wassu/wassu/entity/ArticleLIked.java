package com.wassu.wassu.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name='article_liked')
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArticleLiked {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long likeId;

    @ManyToOne
    @JoinColumn(name="user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name="article_id", nullable = false)
    private Article article;

}