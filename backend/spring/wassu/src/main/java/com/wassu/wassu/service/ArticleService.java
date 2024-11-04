package com.wassu.wassu.service;


import com.wassu.wassu.dto.article.ArticleCreateDTO;
import com.wassu.wassu.entity.ArticleEntity;
import com.wassu.wassu.entity.ArticleImageEntity;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.repository.ArticleImageRepository;
import com.wassu.wassu.repository.ArticleRepository;
import com.wassu.wassu.repository.UserRepository;

import com.wassu.wassu.util.S3Util;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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
    @Transactional
    public Boolean createArticle(String userEmail, ArticleCreateDTO articleCreateDTO) {
        Optional<UserEntity> user = userRepository.findByEmail(userEmail);
        if (user.isPresent()) {
            try {
                ArticleEntity articleEntity = new ArticleEntity();
                articleEntity.setUser(user.get());
                articleEntity.setTitle(articleCreateDTO.getTitle());
                articleEntity.setContent(articleCreateDTO.getContent());
                articleRepository.save(articleEntity);
                //이미지 처리
                MultipartFile imageFile = articleCreateDTO.getImage();

                if (imageFile != null && !imageFile.isEmpty()) {
                    log.info("Image File Exists");
                    String fileName = s3Util.uploadFile(imageFile);
                    if (fileName.equals("Failed")) {
                        log.error("Image Uploading Failed");
                        throw new RuntimeException("Image Uploading Failed");
                    }
                    ArticleImageEntity articleImageEntity = new ArticleImageEntity();
                    articleImageEntity.setFileName(fileName);
                    articleImageEntity.setArticle(articleEntity);
                    articleImageRepository.save(articleImageEntity);
                    log.info("Image File Saved");
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
}
