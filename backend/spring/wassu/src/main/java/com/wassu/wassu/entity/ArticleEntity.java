package com.wassu.wassu.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArticleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String title;

    @Column(nullable = false, length = 200)
    private String content;

    @Column(columnDefinition = "integer default 0")
    private Integer view_count;

    @Column(columnDefinition = "integer default 0")
    private Integer liked;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name="user_entity_id", nullable = false)
    private UserEntity user;

    @OneToMany(mappedBy = "article")
    private List<ArticleReadEntity> articleReads;

    @OneToMany(mappedBy = "article")
    private List<ArticleLikedEntity> articleLikes;

    @OneToMany(mappedBy = "article")
    private List <ArticleImageEntity> articleImages;
}
