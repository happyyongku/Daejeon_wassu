package com.wassu.wassu.repository.article;

import com.wassu.wassu.entity.ArticleImageEntity;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleImageRepository extends ElasticsearchRepository<ArticleImageEntity, String> {
//    Optional<ArticleImageEntity> findByArticleId(String articleId);
    List<ArticleImageEntity> findByArticle(String articleId);
}
