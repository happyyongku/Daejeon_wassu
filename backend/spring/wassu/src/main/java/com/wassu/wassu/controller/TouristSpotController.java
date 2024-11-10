package com.wassu.wassu.controller;

import com.wassu.wassu.dto.touristspot.TouristSpotDTO;
import com.wassu.wassu.dto.touristspot.TouristSpotFavoriteDTO;
import com.wassu.wassu.service.touristspot.TouristSpotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wassu/tourist")
@RequiredArgsConstructor
public class TouristSpotController {

    private final TouristSpotService touristSpotService;

    // 관광지 상세조회
    @GetMapping("/details/{spotId}")
    public ResponseEntity<?> getTouristSpotDetails(@AuthenticationPrincipal UserDetails userDetails,
                                                   @PathVariable Long spotId) {
        String userEmail = null;
        if (userDetails != null) {
            userEmail = userDetails.getUsername();
        }
        TouristSpotDTO result = touristSpotService.getTouristSpotDetails(userEmail, spotId);
        return ResponseEntity.ok(result);
    }

    // 찜하기
    @PostMapping("/{spotId}/favorite")
    public ResponseEntity<?> touristSpotFavorite(@AuthenticationPrincipal UserDetails userDetails,
                                                 @PathVariable Long spotId) {
        String userEmail = userDetails.getUsername();
        TouristSpotFavoriteDTO result = touristSpotService.touristSpotFavorite(userEmail, spotId);
        return ResponseEntity.ok(result);
    }

    // 찜취소
    @DeleteMapping("/{spotId}/favorite")
    public ResponseEntity<?> touristSpotUnFavorite(@AuthenticationPrincipal UserDetails userDetails,
                                                   @PathVariable Long spotId) {
        String userEmail = userDetails.getUsername();
        TouristSpotFavoriteDTO result = touristSpotService.touristSpotUnfavorite(userEmail, spotId);
        return ResponseEntity.ok(result);
    }

}
