package com.wassu.wassu.repository;

import com.wassu.wassu.entity.ArticleEntity;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ArticleRepository extends ElasticsearchRepository<ArticleEntity, String> {
    Optional<ArticleEntity> findById(String id);
}
