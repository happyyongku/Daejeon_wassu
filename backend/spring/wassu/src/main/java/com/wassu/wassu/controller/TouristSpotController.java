package com.wassu.wassu.controller;

import com.wassu.wassu.dto.touristspot.TouristSpotDTO;
import com.wassu.wassu.dto.touristspot.TouristSpotFavoriteDTO;
import com.wassu.wassu.dto.touristspot.TouristSpotSearchDTO;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.security.JwtUtil;
import com.wassu.wassu.service.touristspot.TouristSpotSearchService;
import com.wassu.wassu.service.touristspot.TouristSpotService;
import com.wassu.wassu.service.touristspot.TouristSpotUtilService;
import com.wassu.wassu.util.UserUtil;
import com.wassu.wassu.util.UtilTool;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/wassu/tourist")
@RequiredArgsConstructor
@Slf4j
public class TouristSpotController {

    private final TouristSpotService touristSpotService;
    private final UtilTool utilTool;
    private final TouristSpotSearchService touristSpotSearchService;
    private final TouristSpotUtilService touristSpotUtilService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final UserUtil userUtil;

    // 관광지 상세조회
    @SecurityRequirement(name = "") // 스웨거 헤더 제외
    @GetMapping("/details/{spotId}")
    public ResponseEntity<?> getTouristSpotDetails(
            @RequestHeader(value = "Authorization", required = false) String accessToken,
            @PathVariable String spotId
    ) { // 엘라스틱 id
        log.info("controller spot id -> {}", spotId);
        String userEmail = userUtil.extractUserEmail(accessToken);
        TouristSpotDTO result = touristSpotService.getTouristSpotDetails(userEmail, spotId);
        return ResponseEntity.ok(result);
    }

    // 찜하기
    @PostMapping("/{spotId}/favorite")
    public ResponseEntity<?> touristSpotFavorite(@AuthenticationPrincipal String userEmail,
                                                 @PathVariable String spotId) { // 엘라스틱 id
        TouristSpotFavoriteDTO result = touristSpotService.touristSpotFavorite(userEmail, spotId);
        return ResponseEntity.ok(result);
    }

    // 찜취소
    @DeleteMapping("/{spotId}/favorite")
    public ResponseEntity<?> touristSpotUnFavorite(@AuthenticationPrincipal String userEmail,
                                                   @PathVariable String spotId) {
        TouristSpotFavoriteDTO result = touristSpotService.touristSpotUnfavorite(userEmail, spotId);
        return ResponseEntity.ok(result);
    }

    // 관광지 검색
    @SecurityRequirement(name = "")
    @GetMapping("/search")
    public ResponseEntity<?> touristSpotSearch(
            @RequestHeader(value = "Authorization", required = false) String accessToken,
            @RequestParam String searchText,
            Pageable pageable
    ) {
        try{
            String userEmail = userUtil.extractUserEmail(accessToken);

            log.info("Tourist Spot Search Requested -----------");
            log.info("Requested User Email In Searching Service : {}", userEmail);
            Page<Map<String, Object>> response = touristSpotSearchService.searchByText(
                    searchText, pageable
            );
            touristSpotUtilService.matchingWithSpotAndIsStamped(response, userEmail);

            System.out.println("Search Completed --------------------");
            log.info("Search Complete");
            return ResponseEntity.ok(response);

        } catch(Exception e) {
            log.error("Exception occurred while searching for tourist spot", e);
            return ResponseEntity.status(500).body(utilTool.createResponse("status","failed"));
        }
    }

    // 관광지 필터링
    @SecurityRequirement(name = "")
    @GetMapping("/filter")
    public ResponseEntity<?> touristSpotCategory(
            @RequestHeader(value = "Authorization", required = false) String accessToken,
            @RequestParam(name = "category", required = false) String category,
            Pageable pageable
    ) throws IOException {
        try {
            log.info("Filtering by Category ---------------");
            String userEmail = userUtil.extractUserEmail(accessToken);
            Page<Map<String, Object>> response = touristSpotSearchService.filteringByCategory(category, pageable);
            touristSpotUtilService.matchingWithSpotAndIsStamped(response, userEmail);
            System.out.println("Filtering by Category");
            log.info("Filtering by Category");
            return ResponseEntity.ok(response);
        } catch(Exception e) {
            log.error("Exception occurred while searching for tourist spot", e);
            return ResponseEntity.status(500).body(utilTool.createResponse("status","failed"));
        }
    }

}
