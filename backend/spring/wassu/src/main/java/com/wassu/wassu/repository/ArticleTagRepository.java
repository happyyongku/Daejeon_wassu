package com.wassu.wassu.repository;

import com.wassu.wassu.entity.ArticleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.wassu.wassu.entity.ArticleTagEntity;
import java.util.Optional;
import java.util.List;

@Repository
public interface ArticleTagRepository extends JpaRepository<ArticleTagEntity, Long> {
    List<ArticleTagEntity> findByArticleId(ArticleEntity articleEntity);
}
