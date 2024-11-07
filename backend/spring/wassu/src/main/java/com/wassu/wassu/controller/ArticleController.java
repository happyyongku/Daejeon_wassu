package com.wassu.wassu.controller;

import com.wassu.wassu.dto.article.ArticleDTO;
import com.wassu.wassu.dto.article.ArticleResponseDTO;
import com.wassu.wassu.dto.article.ArticleSearchRequestDTO;
import com.wassu.wassu.entity.UserEntity;
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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    @GetMapping(value = "/test")
    public ResponseEntity<?> putTest() {
        return ResponseEntity.ok(utilTool.createResponse("status", "test success"));
    }

    // 포스팅 작성
    @PostMapping(value="/", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createArticle(
        @RequestHeader(value="Authorization") String accessToken,
        @RequestPart("articleCreateDTO") ArticleDTO articleDTO,
        @RequestPart(value = "file", required = false) List<MultipartFile> files
    ){
        log.info("Requested DTO: {}", articleDTO);
        String token = accessToken.replace("Bearer ", "");
        String userEmail = jwtUtil.extractUserEmail(token);
        articleCreateService.createArticle(userEmail, articleDTO, files);

        return ResponseEntity.ok(utilTool.createResponse("status", "success"));
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
    public ResponseEntity<Page<ArticleResponseDTO>> searchArticle(
            @RequestBody ArticleSearchRequestDTO requestDTO,
            Pageable pageable
    ){
        try {
            Page<ArticleEntity> articles = articleSearchServiceImpl.searchByTitleAndContentWithTags(
                    requestDTO.getSearchText(), requestDTO.getTags(), pageable
            );

            Page<ArticleResponseDTO> dtoPage = articles.map(article -> new ArticleResponseDTO(
                    article.getId(),
                    article.getTitle(),
                    article.getContent(),
                    article.getTags()
                            .stream()
                            .map(ArticleEntity.Tag::getTag)
                            .toList()
            ));
            System.out.println("Search Completed --------------------------");
            log.info("Search Completed");
            return ResponseEntity.ok(dtoPage);
        } catch (Exception e) {
            log.error("IOException while search article: ", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
