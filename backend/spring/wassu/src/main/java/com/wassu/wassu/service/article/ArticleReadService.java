package com.wassu.wassu.service.article;


import com.wassu.wassu.dto.article.ArticleResponseDTO;
import com.wassu.wassu.entity.ArticleEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.article.ArticleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class ArticleReadService {

    private final ArticleRepository articleRepository;

    public ArticleResponseDTO searchById(String articleId) {
        try {
            Optional<ArticleEntity> optionalArticle = articleRepository.findById(articleId);;
            if (optionalArticle.isPresent()) {
                log.info("Start to Search Article");
                ArticleEntity article = optionalArticle.get();
                return new ArticleResponseDTO(
                        article.getId(),
                        article.getTitle(),
                        article.getContent(),
                        article.getTags(),
                        article.getImages(),
                        article.getViewCount(),
                        article.getLiked(),
                        article.getCreatedAt(),
                        article.getUpdatedAt()
                );
            } else {
                log.error("Article not found");
                return null;
            }
        } catch(Exception e) {
            log.error("Error occurred while searching article by id: {}", articleId, e);
            throw new CustomException(CustomErrorCode.ERROR_WHILE_READ_ARTICLE);
        }
    }
}
