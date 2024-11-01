package com.wassu.wassu.dto.article;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@Builder
public class ArticleCreateDTO {
    private String title;
    private String content;
    private MultipartFile image;
}
