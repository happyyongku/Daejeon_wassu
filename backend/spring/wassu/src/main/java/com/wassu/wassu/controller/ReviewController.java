package com.wassu.wassu.controller;

import com.wassu.wassu.dto.review.ReviewCreateDTO;
import com.wassu.wassu.dto.review.ReviewDTO;
import com.wassu.wassu.dto.review.ReviewUpdateDTO;
import com.wassu.wassu.service.ReviewService;
import lombok.RequiredArgsConstructor;
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

    @PostMapping("/tourist/{spotId}/review")
    public ResponseEntity<?> createReview(@AuthenticationPrincipal UserDetails userDetails,
                                          @PathVariable Long spotId,
                                          @RequestPart(name = "image", required = false) List<MultipartFile> images,
                                          @RequestPart(name = "review") ReviewCreateDTO createDTO) {
        String username = userDetails.getUsername();
        reviewService.createReview(username, spotId, images, createDTO);
        return ResponseEntity.ok("review created");
    }

    @PutMapping("/review/{reviewId}")
    public ResponseEntity<?> updateReview(@AuthenticationPrincipal UserDetails userDetails,
                                          @PathVariable Long reviewId,
                                          @RequestPart(name = "image", required = false) List<MultipartFile> images,
                                          @RequestPart(name = "review") ReviewUpdateDTO updateDTO) {
        String username = userDetails.getUsername();
        reviewService.updateReview(username, images, updateDTO, reviewId);
        return ResponseEntity.ok("review updated");
    }

    @GetMapping("/review/{reviewId}")
    public ResponseEntity<?> getReview(@AuthenticationPrincipal UserDetails userDetails,
                                       @PathVariable Long reviewId) {
        String username = userDetails.getUsername();
        ReviewDTO result = reviewService.findReviewById(username, reviewId);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/review/{reviewId}")
    public ResponseEntity<?> deleteReview(@AuthenticationPrincipal UserDetails userDetails,
                                          @PathVariable Long reviewId) {
        String username = userDetails.getUsername();
        reviewService.deleteReview(username, reviewId);
        return ResponseEntity.ok("review deleted");
    }

    @PostMapping("/review/{reviewId}/likes")
    public ResponseEntity<?> likesReview(@AuthenticationPrincipal UserDetails userDetails,
                                         @PathVariable Long reviewId) {
        String username = userDetails.getUsername();
        reviewService.likesReview(username, reviewId);
        return ResponseEntity.ok("review liked");
    }

    @DeleteMapping("/review/{reviewId}/likes")
    public ResponseEntity<?> unlikesReview(@AuthenticationPrincipal UserDetails userDetails,
                                           @PathVariable Long reviewId) {
        String username = userDetails.getUsername();
        reviewService.unlikesReview(username, reviewId);
        return ResponseEntity.ok("review unliked");
    }

}
