package com.wassu.wassu.controller;


import com.wassu.wassu.dto.article.ArticleCreateDTO;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.security.JwtUtil;
import com.wassu.wassu.service.ArticleService;
import com.wassu.wassu.util.UtilTool;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/wassu/posts")
@AllArgsConstructor
@Slf4j
public class ArticleController {

    private final UtilTool utilTool;
    private final ArticleService articleService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @PostMapping("/")
    public ResponseEntity<?> createArticle(@RequestHeader(value = "Authorization") String accessToken, @RequestBody ArticleCreateDTO articleCreateDTO){
        log.info("Requested DTO: {}", articleCreateDTO);
        String token = accessToken.replace("Bearer ", "");
        String userEmail = jwtUtil.extractUserEmail(token);
        try {
            if (userRepository.findByEmail(userEmail).isPresent()){
                Boolean isCreated = articleService.createArticle(userEmail, articleCreateDTO);
                if (isCreated){
                    return ResponseEntity.ok(utilTool.createResponse("status","success"));
                }
                return ResponseEntity.status(404).body(utilTool.createResponse("status","Failed while creating article"));
            }
        } catch (Exception e) {
            log.error("Error while creating article: ", e);
        }
        return ResponseEntity.status(404).body(utilTool.createResponse("status","User Not Found"));
    }

}
