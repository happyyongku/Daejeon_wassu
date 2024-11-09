package com.wassu.wassu.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.Setting;

import java.util.ArrayList;
import java.util.List;

@Data
@Document(indexName = "tourist_spot")
@AllArgsConstructor
@NoArgsConstructor
@Setting(settingPath = "/nori_settings.json")
@JsonIgnoreProperties(ignoreUnknown = true)
public class TouristSpotEntity {
    @Id
    private String id;

    @Field(type= FieldType.Text, analyzer = "nori_analyzer")
    private String spotName;

    @Field(type= FieldType.Text, analyzer = "nori_analyzer")
    private String spotAddress;

    @Field(type = FieldType.Float)
    private Float rating = 0.0F;

    @Field(type = FieldType.Integer)
    private Integer userRatingsTotal = 0;

    @Field(type = FieldType.Text)
    private String spotDescription = null;

    @Field(type = FieldType.Double)
    private Double latitude;

    @Field(type = FieldType.Double)
    private Double longitude;

    @Field(type = FieldType.Nested)
    private List<Tag> tags = new ArrayList<>();

    @Field(type = FieldType.Nested)
    private List<Image> images = new ArrayList<>();

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Tag {
        @Field(type=FieldType.Keyword)
        private String tag;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Image {
        @Field(type=FieldType.Text)
        private String image;
    }

}
