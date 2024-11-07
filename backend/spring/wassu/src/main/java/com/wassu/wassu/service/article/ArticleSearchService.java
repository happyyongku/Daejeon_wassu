package com.wassu.wassu.service.article;


import com.wassu.wassu.entity.ArticleEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.util.List;

public interface ArticleSearchService {
    Page<ArticleEntity> searchByTitleAndContentWithTags(String searchText, List<String> tags, Pageable pageable) throws IOException;

}
