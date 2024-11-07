package com.wassu.wassu.dto.article;


import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Builder
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
