package com.wassu.wassu.service;


import com.wassu.wassu.dto.article.ArticleCreateDTO;
import com.wassu.wassu.entity.ArticleEntity;
import com.wassu.wassu.entity.ArticleImageEntity;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.ArticleImageRepository;
import com.wassu.wassu.repository.ArticleRepository;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;


import com.wassu.wassu.util.S3Util;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.swing.text.html.Option;
import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class ArticleService {

    private final UserRepository userRepository;
    private final ArticleRepository articleRepository;
    private final ArticleImageRepository articleImageRepository;
    private final S3Util s3Util;
    
    // 포스트 생성
    @Transactional(rollbackFor = Exception.class)
    public Boolean createArticle(String userEmail, ArticleCreateDTO articleCreateDTO, MultipartFile imageFile) {

        Optional<UserEntity> user = userRepository.findByEmail(userEmail);

        if (user.isPresent()) {
            try {
                ArticleEntity articleEntity = new ArticleEntity();
                articleEntity.setUser(user.get());
                articleEntity.setTitle(articleCreateDTO.getTitle());
                articleEntity.setContent(articleCreateDTO.getContent());
                articleRepository.save(articleEntity);

                //이미지 처리
                if (imageFile != null && !imageFile.isEmpty()) {
                    log.info("Image File Exists");
                    String fileName = s3Util.uploadFile(imageFile, "article");
                    if (fileName == null) {
                        log.error("Image Uploading Failed");
                        throw new RuntimeException("Image Uploading Failed");
                    }
                    ArticleImageEntity articleImageEntity = new ArticleImageEntity();
                    articleImageEntity.setFileName(fileName);
                    articleImageEntity.setArticle(articleEntity);
                    articleImageRepository.save(articleImageEntity);
                    log.info("Image File Saved");
                } else {
                    log.info("Image File Empty ------------ ");
                }
            } catch (Exception e) {
                log.error("Error creating article: ", e);
                return false;
            }
            log.info("Successfully created article");
            return true;

        } else {
            log.error("User not found while creating article");
            return false;
        }
    }
    
    // 게시글 수정
    public Boolean updateArticle(
            ArticleEntity articleEntity,
            ArticleCreateDTO articleCreateDTO,
            MultipartFile file,
            Long articleId
    ) {
        try {
            articleEntity.setTitle(articleCreateDTO.getTitle());
            articleEntity.setContent(articleCreateDTO.getContent());
            log.info("Updating article");
            if (file != null && !file.isEmpty()) {
                log.info("Updating article with image");
                Optional<ArticleImageEntity> optionalArticleImage = articleImageRepository.findByArticleId(articleId);
                if (optionalArticleImage.isPresent()) {
                    ArticleImageEntity articleImageEntity = optionalArticleImage.get();
                    Boolean isDeleted = s3Util.deleteFile(articleImageEntity.getFileName());
                    if (isDeleted) {
                        articleImageRepository.delete(articleImageEntity);
                        log.info("Deleted article image from S3 and DB");
                    } else {
                        log.error("Failed to delete existing image from S3");
                        return false;
                    }

                }

                String fileName = s3Util.uploadFile(file, "article");
                ArticleImageEntity newArticleImage = new ArticleImageEntity();
                newArticleImage.setFileName(fileName);
                newArticleImage.setArticle(articleEntity);
                articleImageRepository.save(newArticleImage);
                log.info("Image File Saved");
            }

            articleRepository.save(articleEntity);
            log.info("Successfully updated article");
            return true;
        } catch (Exception e) {
            log.error("Error updating article: ", e);
            return false;
        }
    }

    // 게시글 및 유저 매칭 확인
    public void checkArticleAndUser(String userEmail, Long articleId) {
        Optional<ArticleEntity> optionalArticle = articleRepository.findById(articleId);
        if (optionalArticle.isPresent()) {
            ArticleEntity articleEntity = optionalArticle.get();
            if (articleEntity.getUser().getEmail().equals(userEmail)) {
                log.info("User has authorization to control this article");
            } else {
                log.error("User not authorized to control this article");
                throw new CustomException(CustomErrorCode.USER_NOT_AUTHORIZED_CONTROL_ARTICLE);
            }
        } else {
            log.error("Article not found");
            throw new CustomException(CustomErrorCode.ARTICLE_NOT_FOUND);
        }
    }
    
    // 게시글 삭제
    public void deleteArticle(Long articleId) {
        Optional<ArticleEntity> optionalArticle = articleRepository.findById(articleId);
        if (optionalArticle.isPresent()) {
            Optional<ArticleImageEntity> optionalArticleImage = articleImageRepository.findByArticleId(articleId);
            if (optionalArticleImage.isPresent()) {
                s3Util.deleteFile(optionalArticleImage.get().getFileName());
            }
            articleRepository.delete(optionalArticle.get());
            log.info("Successfully deleted article");
        }else {
            log.error("Article not found");
            throw new CustomException(CustomErrorCode.ARTICLE_NOT_FOUND);
        }
    }
    
}

