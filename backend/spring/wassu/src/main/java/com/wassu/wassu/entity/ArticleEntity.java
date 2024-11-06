package com.wassu.wassu.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.elasticsearch.annotations.*;

@Data
@Document(indexName = "article")
@AllArgsConstructor
@NoArgsConstructor
@Setting(settingPath = "/nori_settings.json")
public class ArticleEntity {
    @Id
    private String id = UUID.randomUUID().toString();

    @Field(type=FieldType.Long)
    private Long user;

    @Field(type= FieldType.Text, analyzer = "nori_analyzer")
    private String title;

    @Field(type= FieldType.Text, analyzer = "nori_analyzer")
    private String content;

    @Field(type = FieldType.Integer)
    private Integer viewCount = 0;

    @Field(type = FieldType.Integer)
    private Integer liked = 0;

    @Field(type = FieldType.Date, format = DateFormat.date_hour_minute_second)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Field(type = FieldType.Date, format = DateFormat.date_hour_minute_second)
    private LocalDateTime updatedAt = LocalDateTime.now();

//    @PrePersist
//    public void prePersist() {
//        if (id == null) {
//            id = UUID.randomUUID().toString();
//        }
//        if (viewCount == null) {
//            viewCount = 0;
//        }
//        if (liked == null) {
//            liked = 0;
//        }
//        if (createdAt == null) {
//            createdAt = LocalDateTime.now();
//        }
//    }
}


//@Entity
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class ArticleEntity {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(nullable = false, length = 50)
//    private String title;
//
//    @Column(nullable = false, length = 200)
//    private String content;
//
//    @Column(columnDefinition = "integer default 0")
//    private Integer view_count;
//
//    @Column(columnDefinition = "integer default 0")
//    private Integer liked;
//
//    private LocalDateTime createdAt;
//
//    private LocalDateTime updatedAt;
//
//    @PrePersist
//    public void prePersist() {
//        if (view_count == null) {
//            view_count = 0;
//        }
//        if (liked == null) {
//            liked = 0;
//        }
//        if (createdAt == null) {
//            createdAt = LocalDateTime.now();
//        }
//        if (updatedAt == null) {
//            updatedAt = LocalDateTime.now();
//        }
//    }
//
//    @ManyToOne
//    @JoinColumn(name="user_entity_id", nullable = false)
//    private UserEntity user;
//
//    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<ArticleReadEntity> articleReads;
//
//    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<ArticleLikedEntity> articleLikes;
//
//    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List <ArticleImageEntity> articleImages;
//}
