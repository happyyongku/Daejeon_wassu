package com.wassu.wassu.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
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

    @Field(type = FieldType.Text, analyzer = "nori_analyzer")
    private List<String> tags = new ArrayList<>();

    @Field(type = FieldType.Text)
    private List<String> images = new ArrayList<>();

    @Field(type = FieldType.Integer)
    private Integer viewCount = 0;

    @Field(type = FieldType.Integer)
    private Integer liked = 0;

    @Field(type = FieldType.Date, format = DateFormat.date_hour_minute_second)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Field(type = FieldType.Date, format = DateFormat.date_hour_minute_second)
    private LocalDateTime updatedAt = LocalDateTime.now();

}


