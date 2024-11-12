package com.wassu.wassu.controller;

import com.wassu.wassu.dto.review.ReviewCreateDTO;
import com.wassu.wassu.dto.review.ReviewDTO;
import com.wassu.wassu.dto.review.ReviewUpdateDTO;
import com.wassu.wassu.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/wassu")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping(value = "/tourist/{spotId}/review", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createReview(@AuthenticationPrincipal String userEmail,
                                          @PathVariable String spotId,
                                          @RequestPart(name = "image", required = false) List<MultipartFile> images,
                                          @RequestPart(name = "review") ReviewCreateDTO createDTO) {
        reviewService.createReview(userEmail, spotId, images, createDTO);
        return ResponseEntity.ok("review created");
    }

    @PutMapping(value = "/review/{reviewId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateReview(@AuthenticationPrincipal String userEmail,
                                          @PathVariable Long reviewId,
                                          @RequestPart(name = "image", required = false) List<MultipartFile> images,
                                          @RequestPart(name = "review") ReviewUpdateDTO updateDTO) {
        reviewService.updateReview(userEmail, images, updateDTO, reviewId);
        return ResponseEntity.ok("review updated");
    }

    @GetMapping("/review/{reviewId}")
    public ResponseEntity<?> getReview(@AuthenticationPrincipal String userEmail,
                                       @PathVariable Long reviewId) {
        ReviewDTO result = reviewService.findReviewById(userEmail, reviewId);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/review/{reviewId}")
    public ResponseEntity<?> deleteReview(@AuthenticationPrincipal String userEmail,
                                          @PathVariable Long reviewId) {
        reviewService.deleteReview(userEmail, reviewId);
        return ResponseEntity.ok("review deleted");
    }

    @PostMapping("/review/{reviewId}/likes")
    public ResponseEntity<?> likesReview(@AuthenticationPrincipal String userEmail,
                                         @PathVariable Long reviewId) {
        reviewService.likesReview(userEmail, reviewId);
        return ResponseEntity.ok("review liked");
    }

    @DeleteMapping("/review/{reviewId}/likes")
    public ResponseEntity<?> unlikesReview(@AuthenticationPrincipal String userEmail,
                                           @PathVariable Long reviewId) {
        reviewService.unlikesReview(userEmail, reviewId);
        return ResponseEntity.ok("review unliked");
    }

}
