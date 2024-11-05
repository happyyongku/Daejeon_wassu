package com.wassu.wassu.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ArticleTagEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length=10)
    private String tag;

    @ManyToOne
    @JoinColumn(name="article_id", nullable=false)
    private ArticleEntity articleId;
}
