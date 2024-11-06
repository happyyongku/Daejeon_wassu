package com.wassu.wassu.repository;

import com.wassu.wassu.entity.ArticleEntity;
import com.wassu.wassu.entity.ArticleImageEntity;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface ArticleImageRepository extends ElasticsearchRepository<ArticleImageEntity, String> {
//    Optional<ArticleImageEntity> findByArticleId(String articleId);
    List<ArticleImageEntity> findByArticle(String articleId);
}
