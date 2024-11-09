package com.wassu.wassu.dto.article;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.wassu.wassu.entity.ArticleEntity;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class ArticleResponseDTO {
    private String id;
    private String title;
    private String content;
    private List<ArticleEntity.Tag> tags;
    private List<ArticleEntity.Image> images;
    private Integer viewCount;
    private Integer liked;
    private boolean isLiked;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}
