package com.wassu.wassu.controller;

import com.wassu.wassu.dto.article.ArticleCreateDTO;
import com.wassu.wassu.entity.ArticleImageEntity;
import com.wassu.wassu.repository.ArticleImageRepository;
import com.wassu.wassu.repository.ArticleRepository;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.security.JwtUtil;
import com.wassu.wassu.service.ArticleService;
import com.wassu.wassu.util.S3Util;
import com.wassu.wassu.util.UtilTool;
import com.wassu.wassu.entity.ArticleEntity;

import lombok.AllArgsConstructor;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/wassu/posts")
@AllArgsConstructor
@Slf4j
public class ArticleController {

    private final UtilTool utilTool;
    private final ArticleService articleService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final ArticleRepository articleRepository;
    private final ArticleImageRepository articleImageRepository;
    private final S3Util s3Util;

    @GetMapping(value = "/test")
    public ResponseEntity<?> putTest() {
        return ResponseEntity.ok(utilTool.createResponse("status", "test success"));
    }

    // 포스팅 작성
    @PostMapping(value="/", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createArticle(
        @RequestHeader(value="Authorization") String accessToken,
        @RequestPart("articleCreateDTO") ArticleCreateDTO articleCreateDTO,
        @RequestPart(value = "file", required = false) List<MultipartFile> files
    ){
        log.info("Requested DTO: {}", articleCreateDTO);
        String token = accessToken.replace("Bearer ", "");
        String userEmail = jwtUtil.extractUserEmail(token);
        try {
            if (userRepository.findByEmail(userEmail).isPresent()){
                articleService.createArticle(userEmail, articleCreateDTO, files);
                return ResponseEntity.ok(utilTool.createResponse("status","success"));
            } else {
                log.error("User doesn't exist");
                return ResponseEntity.status(404).body(utilTool.createResponse("status","failed"));
            }
        } catch (Exception e) {
            log.error("Error while creating article: ", e);
        }
        return ResponseEntity.status(404).body(utilTool.createResponse("status","User Not Found"));
    }
    
    // 포스팅 수정
    @PutMapping(value = "/{articleId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateArticle(
            @RequestHeader(value = "Authorization") String accessToken,
            @PathVariable Long articleId,
            @RequestPart("articleCreateDTO") ArticleCreateDTO articleCreateDTO,
            @RequestPart(value="file") MultipartFile file
    ){
        String token = accessToken.replace("Bearer ", "");
        log.info("Requested Article update");
        String userEmail = jwtUtil.extractUserEmail(token);
        try {
            Optional<ArticleEntity> optionalArticle = articleRepository.findById(articleId);
            if (optionalArticle.isPresent()){
                ArticleEntity articleEntity = optionalArticle.get();
                if (!articleEntity.getUser().getEmail().equals(userEmail)){
                    log.error("User Not Authorized to update article");
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(utilTool.createResponse("status","User Not Authorized to update article"));
                }
                Boolean isUpdated = articleService.updateArticle(articleEntity, articleCreateDTO,file, articleId);
                if (isUpdated){
                    log.info("Successfully updated article");
                    return ResponseEntity.ok(utilTool.createResponse("status","success"));
                } else {
                    log.error("Failed to update article");
                    return ResponseEntity.status(404).body(utilTool.createResponse("status","Failed to update article"));
                }
            } else {
                log.warn("Article with id {} not found", articleId);
                return ResponseEntity.status(404).body(utilTool.createResponse("status","Article Not Found"));
            }
        } catch (Exception e) {
            log.error("Error while updating article: ", e);
        }
        return ResponseEntity.ok(utilTool.createResponse("status","success"));
    }

    // 포스팅 삭제
    @DeleteMapping(value="/{articleId}")
    public ResponseEntity<?> deleteArticle(
            @RequestHeader(value = "Authorization") String accessToken,
            @PathVariable Long articleId
    ) {
        log.info("Requested delete article");
        String token = accessToken.replace("Bearer ", "");
        String userEmail = jwtUtil.extractUserEmail(token);
        articleService.checkArticleAndUser(userEmail, articleId);
        articleService.deleteArticle(articleId);
        return ResponseEntity.ok(utilTool.createResponse("status","success"));
    }
}
