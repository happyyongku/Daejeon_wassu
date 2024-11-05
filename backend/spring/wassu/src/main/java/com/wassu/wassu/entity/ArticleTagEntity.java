package com.wassu.wassu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Data
@Document(indexName = "articleTag")
public class ArticleTagEntity {
    @Id
    private String id;

    @Field(type = FieldType.Keyword)
    private String tag;

    @Field(type = FieldType.Text)
    private String articleId;
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
