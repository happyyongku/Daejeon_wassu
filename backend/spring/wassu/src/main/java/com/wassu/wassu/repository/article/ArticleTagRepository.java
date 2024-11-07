package com.wassu.wassu.repository.article;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;
import com.wassu.wassu.entity.ArticleTagEntity;

import java.util.List;

@Repository
public interface ArticleTagRepository extends ElasticsearchRepository<ArticleTagEntity, String> {
    List<ArticleTagEntity> findByArticleId(String articleId);
}
