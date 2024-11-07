package com.wassu.wassu.dto.article;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ArticleResponseDTO {
    private String id;
    private String title;
    private String content;
    private List<String> tags;

    public ArticleResponseDTO (String id, String title, String content, List<String> tags) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.tags = tags;
    }
}
