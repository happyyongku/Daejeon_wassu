package com.wassu.wassu.repository.article;

import com.wassu.wassu.entity.ArticleLikedEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ArticleLikedRepository extends JpaRepository<ArticleLikedEntity, Long> {

    boolean existsByArticleIdAndUserEmail(String articleId, String userEmail);

    Optional<ArticleLikedEntity> findByArticleIdAndUserEmail(String articleId, String userEmail);

}
