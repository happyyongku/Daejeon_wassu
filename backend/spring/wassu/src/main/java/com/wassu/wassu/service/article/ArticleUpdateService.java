package com.wassu.wassu.service.article;


import com.wassu.wassu.dto.article.ArticleDTO;
import com.wassu.wassu.entity.ArticleEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.ArticleRepository;
import com.wassu.wassu.util.S3Util;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class ArticleUpdateService {

    private final ArticleRepository articleRepository;
    private final S3Util s3Util;

    public void updateArticle(
            ArticleEntity articleEntity,
            ArticleDTO articleDTO,
            List<MultipartFile> imageFiles
    ) {
        try {
            // 기존 데이터 업데이트
            articleEntity.setTitle(articleDTO.getTitle());
            articleEntity.setContent(articleDTO.getContent());
            articleEntity.setUpdatedAt(LocalDateTime.now());
            articleEntity.setTags(articleDTO.getTags());

            //
            List<String> existingImages = articleEntity.getImages();

            existingImages.forEach(s3Util::deleteFile);

            if (imageFiles != null && !imageFiles.isEmpty()) {
                existingImages.clear();
                imageFiles.forEach(file -> existingImages.add(s3Util.uploadFile(file, "article")));
            }

            articleRepository.save(articleEntity);
            log.info("Successfully updated article");
        } catch (Exception e) {
            log.error("Failed to update article: ", e);
            throw new CustomException(CustomErrorCode.FAILED_TO_UPDATE_ARTICLE);
        }
    }
}
