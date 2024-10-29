package com.wassu.wassu.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name='article')
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long articleId;

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
    @JoinColumn(name="user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "article")
    private List<ArticleRead> articleReads;

    @OneToMany(mappedBy = "article")
    private List<ArticleLiked> articleLikes;

    @OneToMany(mappedBy = "article")
    private List <ArticleImage> articleImages;

}