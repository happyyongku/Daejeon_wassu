package com.wassu.wassu.controller;


import com.wassu.wassu.service.PostService;
import com.wassu.wassu.tool.UtilTool;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/wassu/posts")
@AllArgsConstructor
@Slf4j
public class PostController {

    private final UtilTool utilTool;
    private final PostService postService;

    @PostMapping("/")
    public ResponseEntity<?> createArticle(@RequestHeader(value = "Authorization") String accessToken, ){

    }

}
