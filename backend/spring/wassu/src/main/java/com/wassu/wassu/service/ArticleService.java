package com.wassu.wassu.service;


import com.wassu.wassu.dto.article.ArticleCreateDTO;
import com.wassu.wassu.entity.ArticleEntity;
import com.wassu.wassu.entity.ArticleImageEntity;
import com.wassu.wassu.entity.ArticleTagEntity;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.ArticleImageRepository;
import com.wassu.wassu.repository.ArticleRepository;
import com.wassu.wassu.repository.ArticleTagRepository;
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
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class ArticleService {

    private final UserRepository userRepository;
    private final ArticleRepository articleRepository;
    private final ArticleImageRepository articleImageRepository;
    private final ArticleTagRepository articleTagRepository;
    private final S3Util s3Util;
    
    // 포스트 생성
    @Transactional(rollbackFor = Exception.class)
    public void createArticle(String userEmail, ArticleCreateDTO articleCreateDTO, List<MultipartFile> imageFiles) {

        Optional<UserEntity> user = userRepository.findByEmail(userEmail);

        if (user.isPresent()) {
            try {
                ArticleEntity articleEntity = new ArticleEntity();
                articleEntity.setUser(user.get());
                articleEntity.setTitle(articleCreateDTO.getTitle());
                articleEntity.setContent(articleCreateDTO.getContent());
                articleRepository.save(articleEntity);

                //이미지 처리
                createAndUploadImage(imageFiles, articleEntity);
                // 태그 처리
                List<String> tagList = articleCreateDTO.getTags() != null ? articleCreateDTO.getTags() : List.of();
                if (!tagList.isEmpty()) {
                    createArticleTag(tagList, articleEntity);

                }
            } catch (Exception e) {
                log.error("Error creating article: ", e);
                throw new CustomException(CustomErrorCode.FAILED_TO_CREATE_ARTICLE);
            }
            log.info("Successfully created article");

        } else {
            log.error("User not found while creating article");
            throw new CustomException(CustomErrorCode.USER_NOT_FOUND_WHILE_CREATING_ARTICLE);
        }
    }
    
    // 게시글 수정
    public Boolean updateArticle(
            ArticleEntity articleEntity,
            ArticleCreateDTO articleCreateDTO,
            List<MultipartFile> files
    ) {
        try {
            articleEntity.setTitle(articleCreateDTO.getTitle());
            articleEntity.setContent(articleCreateDTO.getContent());
            log.info("Updating article");
            updateArticleImage(articleEntity, files);
            List<String> tagList = articleCreateDTO.getTags() != null ? articleCreateDTO.getTags() : List.of();
            if (!tagList.isEmpty()) {
                log.info("Start to update article's tag");
                updateArticleTags(tagList, articleEntity);
            } else {
                log.info("Empty tag list ------------ ");
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

    // Tag 저장
    private void createArticleTag(List<String> tags, ArticleEntity articleEntity) {
        try {
            for (String tag : tags) {
                ArticleTagEntity articleTagEntity = new ArticleTagEntity();
                articleTagEntity.setArticleId(articleEntity);
                articleTagEntity.setTag(tag);
                articleTagRepository.save(articleTagEntity);
            }
        } catch (Exception e) {
            log.error("Error creating article tag: ", e);
            throw new CustomException(CustomErrorCode.FAILED_TO_CREATE_ARTICLE);
        }
    }

    // Tag 수정
    private void updateArticleTags(List<String> newTags, ArticleEntity articleEntity) {
        // 기존 태그 목록 가져오기
        try {
            List<ArticleTagEntity> existingTags = articleTagRepository.findByArticleId(articleEntity);
            // 기존 태그명 리스트
            List<String> existingTagNames = existingTags.stream()
                    .map(ArticleTagEntity::getTag)
                    .toList();

            // 삭제할 태그 식별 및 삭제
            existingTags.stream()
                    .filter(tagEntity -> !newTags.contains(tagEntity.getTag()))
                    .forEach(tagEntity -> {
                        articleTagRepository.delete(tagEntity);
                        log.info("Deleted tag: " + tagEntity.getTag());
                    });

            newTags.stream()
                    .filter(newTag -> !existingTagNames.contains(newTag))
                    .forEach(newTag -> {
                        ArticleTagEntity newTagEntity = new ArticleTagEntity();
                        newTagEntity.setArticleId(articleEntity);
                        newTagEntity.setTag(newTag);
                        articleTagRepository.save(newTagEntity);
                        log.info("Added new tag: " + newTagEntity.getTag());
                    });
        } catch (Exception e) {
            log.error("Error updating article tags: ", e);
            throw new CustomException(CustomErrorCode.FAILED_TO_UPDATE_TAG);
        }
    }

    //이미지 파일 업로드
    private void createAndUploadImage(List<MultipartFile> imageFileList, ArticleEntity articleEntity) {
        if (imageFileList != null && !imageFileList.isEmpty()) {
            try {
                for (MultipartFile imageFile : imageFileList) {
                    String fileName = s3Util.uploadFile(imageFile, "article");
                    if (fileName == null) {
                        log.error("Image Uploading Failed");
                        throw new CustomException(CustomErrorCode.IMAGE_UPLOADING_FAILED);
                    }
                    ArticleImageEntity articleImageEntity = new ArticleImageEntity();
                    articleImageEntity.setFileName(fileName);
                    articleImageEntity.setArticle(articleEntity);
                    articleImageRepository.save(articleImageEntity);
                    log.info("Image File Saved");
                }
            } catch (Exception e) {
                log.error("Error uploading image: ", e);
                throw new CustomException(CustomErrorCode.IMAGE_UPLOADING_FAILED);
            }
        } else {
            log.error("Empty image list ------------ ");
        }
    }

    // 이미지 파일 수정
    private void updateArticleImage(
            ArticleEntity articleEntity,
            List<MultipartFile> imageFiles
        ) {
        try {
            if (imageFiles != null && !imageFiles.isEmpty()) {
                List<ArticleImageEntity> existingImages = articleImageRepository.findByArticle(articleEntity);
                List<String> newImageFiles = imageFiles.stream()
                        .filter(imageFile -> !imageFile.isEmpty())
                        .map(imageFile -> {
                            String fileName = s3Util.uploadFile(imageFile, "article");
                            return fileName;
                        })
                        .toList();
                existingImages.stream()
                        .filter(existingImage -> !newImageFiles.contains(existingImage.getFileName()))
                        .forEach(existingImage -> {
                            s3Util.deleteFile(existingImage.getFileName());
                            articleImageRepository.delete(existingImage);
                            log.info("Deleted image file: " + existingImage.getFileName());
                        });

                for (String fileName : newImageFiles) {
                    if (existingImages.stream().noneMatch(
                            existingImage -> existingImage.getFileName().equals(fileName))
                    ) {
                        ArticleImageEntity newImageEntity = new ArticleImageEntity();
                        newImageEntity.setFileName(fileName);
                        newImageEntity.setArticle(articleEntity);
                        articleImageRepository.save(newImageEntity);
                        log.info("Added new image file: " + fileName);
                    }
                }
            } else {
                log.error("Empty image list ------------ ");
            }
        } catch (Exception e) {
            log.error("Error updating article image: ", e);
            throw new CustomException(CustomErrorCode.FAILED_TO_UPDATE_ARTICLE);
        }
    }
    
}

