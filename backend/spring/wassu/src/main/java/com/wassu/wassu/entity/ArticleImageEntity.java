package com.wassu.wassu.entity;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Data
@Document(indexName = "articleImage")
public class ArticleImageEntity {
    @Id
    private String id;

    @Field(type = FieldType.Text)
    private String fileName;

    @Field(type=FieldType.Text)
    private String article;
}

//@Entity
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class ArticleImageEntity {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(nullable = false)
//    private String fileName;
//
//    @ManyToOne
//    @JoinColumn(name="article_id")
//    private ArticleEntity article;
//}
