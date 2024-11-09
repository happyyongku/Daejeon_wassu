package com.wassu.wassu.service.article;


import com.wassu.wassu.dto.article.ArticleResponseDTO;
import com.wassu.wassu.entity.ArticleEntity;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.repository.article.ArticleLikedRepository;
import com.wassu.wassu.repository.article.ArticleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class ArticleReadService {

    private final ArticleRepository articleRepository;
    private final ArticleLikedRepository articleLikedRepository;
    private final UserRepository userRepository;

    public ArticleResponseDTO searchById(String email, String articleId, Boolean isMatched) {
        boolean isUserLiked = false;
        if (email != null) {
            isUserLiked = articleLikedRepository.existsByArticleIdAndUserEmail(articleId, email);
        }
        try {
            Optional<ArticleEntity> optionalArticle = articleRepository.findById(articleId);;
            if (optionalArticle.isPresent()) {
                log.info("Start to Search Article");
                ArticleEntity article = optionalArticle.get();
                Long userId = ((Number) article.getUser()).longValue();
                UserEntity user = userRepository.findById(userId).orElse(null);

                return ArticleResponseDTO.builder()
                        .id(article.getId())
                        .userId(userId)
                        .nickName(Objects.requireNonNull(user).getNickname())
                        .profileImage(Objects.requireNonNull(user).getProfileImage())
                        .title(article.getTitle())
                        .content(article.getContent())
                        .tags(article.getTags())
                        .images(article.getImages())
                        .viewCount(article.getViewCount())
                        .liked(article.getLiked())
                        .isLiked(isUserLiked)
                        .isMatched(isMatched)
                        .build();
            } else {
                log.error("Article not found");
                return null;
            }
        } catch(Exception e) {
            log.error("Error occurred while searching article by id: {}", articleId, e);
            throw new CustomException(CustomErrorCode.ERROR_WHILE_READ_ARTICLE);
        }
    }

    public Boolean isMatchWithArticleOwner(String tokenEmail, String articleId) {
        Optional<UserEntity> optionalTokenUser = userRepository.findByEmail(tokenEmail);
        if (optionalTokenUser.isPresent()) {
            Long tokenUserId = optionalTokenUser.get().getId();
            Optional<ArticleEntity> optionalArticle = articleRepository.findById(articleId);
            if (optionalArticle.isPresent()) {
                ArticleEntity article = optionalArticle.get();
                Long articleOwnerId = ((Number) article.getUser()).longValue();
                if (articleOwnerId.equals(tokenUserId)) {
                    log.info("Article owner matched");
                    return true;
                }
                else {
                    log.info("Article owner did not match");
                    return false;
                }
            } else {
                log.error("Article not found");
                return false;
            }

        } else {
            log.error("Token not found");
            return false;
        }
    }
}
