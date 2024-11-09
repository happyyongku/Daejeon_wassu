package com.wassu.wassu.controller;

import com.wassu.wassu.dto.article.ArticleDTO;
import com.wassu.wassu.dto.article.ArticleLikeDTO;
import com.wassu.wassu.dto.article.ArticleResponseDTO;
import com.wassu.wassu.dto.article.ArticleSearchRequestDTO;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.article.ArticleRepository;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.security.JwtUtil;
import com.wassu.wassu.service.article.*;
import com.wassu.wassu.util.UtilTool;
import com.wassu.wassu.entity.ArticleEntity;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/wassu/posts")
@AllArgsConstructor
@Slf4j
public class ArticleController {

    private final UtilTool utilTool;
    private final ArticleUpdateService articleUpdateService;
    private final ArticleCreateService articleCreateService;
    private final ArticleDeleteService articleDeleteService;
    private final ArticleUtilService articleUtilService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final ArticleRepository articleRepository;
    private final ArticleSearchServiceImpl articleSearchServiceImpl;
    private final ArticleCategoryFilterService articleCategoryFilterService;
    private final ArticleReadService articleReadService;
    private final ArticleLikeService articleLikeService;
    private final ArticleProfileService articleProfileService;

    @GetMapping(value = "/test")
    public ResponseEntity<?> putTest() {
        return ResponseEntity.ok(utilTool.createResponse("status", "test success"));
    }

    // 포스팅 작성
    @PostMapping(value="/", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createArticle(
        @RequestHeader(value="Authorization") String accessToken,
        @RequestPart("articleDTO") ArticleDTO articleDTO,
        @RequestPart(value = "file", required = false) List<MultipartFile> files
    ){
        log.info("Requested DTO: {}", articleDTO);
        String token = accessToken.replace("Bearer ", "");
        String userEmail = jwtUtil.extractUserEmail(token);
        String articleId = articleCreateService.createArticle(userEmail, articleDTO, files);

        return ResponseEntity.ok(utilTool.createResponse("articleId", articleId));
    }
    
    // 포스팅 수정
    @PutMapping(value = "/{articleId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateArticle(
            @RequestHeader(value = "Authorization") String accessToken,
            @PathVariable String articleId,
            @RequestPart("articleCreateDTO") ArticleDTO articleDTO,
            @RequestPart(value="file") List<MultipartFile> files
    ){
        String token = accessToken.replace("Bearer ", "");
        log.info("Requested Article update");
        String userEmail = jwtUtil.extractUserEmail(token);
        Optional<ArticleEntity> optionalArticle = articleRepository.findById(articleId);
        if (optionalArticle.isPresent()){
            ArticleEntity articleEntity = optionalArticle.get();
            Optional<UserEntity> optionalUser = userRepository.findById(articleEntity.getUser());
            if (optionalUser.isPresent() && !optionalUser.get().getEmail().equals(userEmail)){
                log.error("User Not Authorized to update article");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(utilTool.createResponse("status","User Not Authorized to update article"));
            }
            articleUpdateService.updateArticle(articleEntity, articleDTO, files);
        } else {
            log.error("Article with id {} not found", articleId);
            return ResponseEntity.status(404).body(utilTool.createResponse("status","Article Not Found"));
        }
        return ResponseEntity.ok(utilTool.createResponse("status","success"));
    }

    // 포스팅 삭제
    @DeleteMapping(value="/{articleId}")
    public ResponseEntity<?> deleteArticle(
            @RequestHeader(value = "Authorization") String accessToken,
            @PathVariable String articleId
    ) {
        log.info("Requested delete article");
        String token = accessToken.replace("Bearer ", "");
        String userEmail = jwtUtil.extractUserEmail(token);
        articleUtilService.checkArticleAndUser(userEmail, articleId);
        articleDeleteService.deleteArticle(articleId);
        return ResponseEntity.ok(utilTool.createResponse("status","success"));
    }

    // 포스팅 검색
    @PostMapping(value="/search")
    public ResponseEntity<?> searchArticleTest(
            @RequestBody ArticleSearchRequestDTO requestDTO,
            Pageable pageable
    ){
        try {
            log.info("Requested search test -----------------------------");
            Page<Map<String, Object>> response = articleSearchServiceImpl.searchByText(
                    requestDTO.getSearchText(), requestDTO.getTags(), pageable
            );
            articleProfileService.matchingProfileWithArticleList(response);

            System.out.println("Search Test Completed --------------------------");
            log.info("Search Completed");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("IOException while search article: ", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 포스팅 카테고리 별 필터링
    @GetMapping("/filter")
    public ResponseEntity<?> filterArticle(@RequestParam(required = false) String category, Pageable pageable){
        try {
            Page<Map<String, Object>> articles = articleCategoryFilterService.searchByTag(category, pageable);
            articleProfileService.matchingProfileWithArticleList(articles);
            return ResponseEntity.ok(articles);

        } catch (Exception e) {
            log.error("Error while filtering article: ", e);
            return ResponseEntity.status(500).body(utilTool.createResponse("status","error"));
        }
    }

    // 게시글 조회
    @GetMapping("/read/{articleId}")
    public ResponseEntity<?> readArticle(@AuthenticationPrincipal UserDetails userDetails,
                                         @PathVariable String articleId){
        String userEmail = null;
        if (userDetails != null) {
            userEmail = userDetails.getUsername();
        }
        try {
            ArticleResponseDTO article = articleReadService.searchById(userEmail, articleId);
            log.info("Article class: {}", article.getClass());
            if (article != null) {
                log.info("Article Read Completed");
                return ResponseEntity.ok(utilTool.createResponse("status",article));
            } else {
                return ResponseEntity.status(404).body(utilTool.createResponse("status","Article Not Found"));
            }
        } catch(Exception e){
            log.error("Error while reading article: ", e);
            throw new CustomException(CustomErrorCode.ERROR_WHILE_READ_ARTICLE);
        }
    }

    // 게시글 좋아요
    @PostMapping("/{articleId}/likes")
    public ResponseEntity<?> likeArticle(@AuthenticationPrincipal UserDetails userDetails,
                                         @PathVariable String articleId,
                                         @RequestParam String action){
        String userEmail = userDetails.getUsername();
        ArticleLikeDTO result;
        if ("like".equals(action)){
            result = articleLikeService.likeArticle(userEmail, articleId);
        } else {
            result = articleLikeService.unlikeArticle(userEmail, articleId);
        }
        return ResponseEntity.ok(result);
    }

}
