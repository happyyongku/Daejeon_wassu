package com.wassu.wassu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.Setting;

import java.util.UUID;

@Data
@Document(indexName = "articletag")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setting(settingPath = "/nori_settings.json")
public class ArticleTagEntity {
    @Id
    private String id = UUID.randomUUID().toString();

    @Field(type = FieldType.Keyword)
    private String tag;

    @Field(type = FieldType.Text)
    private String articleId;

    @PrePersist
    private void prePersist() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
    }
}
//@Getter
//@Setter
//@Builder
//@AllArgsConstructor
//@NoArgsConstructor
//@Entity
//public class ArticleTagEntity {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(nullable = false, length=10)
//    private String tag;
//
//    @ManyToOne
//    @JoinColumn(name="article_id", nullable=false)
//    private ArticleEntity articleId;
//}
