package com.wassu.wassu.dto.article;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class ArticleDTO {
    private String title;
    private String content;
    private List<String> tags;
}
