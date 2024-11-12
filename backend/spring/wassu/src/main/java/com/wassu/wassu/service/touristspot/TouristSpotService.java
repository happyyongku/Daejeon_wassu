package com.wassu.wassu.service.touristspot;

import com.wassu.wassu.dto.review.ReviewDTO;
import com.wassu.wassu.dto.review.ReviewImageDTO;
import com.wassu.wassu.dto.touristspot.TouristSpotDTO;
import com.wassu.wassu.dto.touristspot.TouristSpotFavoriteDTO;
import com.wassu.wassu.dto.touristspot.TouristSpotImageDto;
import com.wassu.wassu.dto.touristspot.TouristSpotTagDto;
import com.wassu.wassu.dto.user.UserProfileDTO;
import com.wassu.wassu.entity.touristspot.TouristSpotEntity;
import com.wassu.wassu.entity.touristspot.TouristSpotFavorites;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.entity.review.ReviewEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.repository.review.ReviewLikesRepository;
import com.wassu.wassu.repository.touristspot.TouristSpotFavoritesRepository;
import com.wassu.wassu.repository.touristspot.TouristSpotImageRepository;
import com.wassu.wassu.repository.touristspot.TouristSpotRepository;
import com.wassu.wassu.repository.touristspot.TouristSpotTagRepository;
import com.wassu.wassu.service.ReviewService;
import com.wassu.wassu.service.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class TouristSpotService {

    private final TouristSpotRepository touristSpotRepository;
    private final TouristSpotFavoritesRepository favoritesRepository;
    private final TouristSpotImageRepository imageRepository;
    private final TouristSpotTagRepository tagRepository;
    private final UserRepository userRepository;
    private final ReviewService reviewService;
    private final TouristSpotFavoritesRepository touristSpotFavoritesRepository;
    private final TouristSpotUtilService touristSpotUtilService;

    public TouristSpotDTO getTouristSpotDetails(String email, String spotId) {
        TouristSpotEntity spot = touristSpotRepository.findDetailById(spotId).orElseThrow(() -> new CustomException(CustomErrorCode.TOURIST_NOT_FOUND));
        List<TouristSpotImageDto> imageDto = imageRepository.findByTouristId(spotId).stream().map(images -> new TouristSpotImageDto(images.getId(), images.getTouristSpotImageUrl())).toList();
        List<TouristSpotTagDto> tagDto = tagRepository.findByTouristId(spotId).stream().map(tags -> new TouristSpotTagDto(tags.getId(), tags.getTag())).toList();
        List<ReviewEntity> reviews = spot.getReviews();
        boolean isFavorite = false;
        boolean isStamped = false;
        if (email != null) {
            UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));
            isFavorite = touristSpotFavoritesRepository.existsByTouristSpotIdAndUserId(spot.getId(), user.getId());
            isStamped = touristSpotUtilService.isStamped(spot.getId(), email);
        }
        List<ReviewDTO> reviewDto = reviewService.getReviewDTOS(email, reviews);
        return TouristSpotDTO.builder()
                .spotId(spot.getElasticId())
                .spotName(spot.getSpotName())
                .spotAddress(spot.getSpotAddress())
                .rating(spot.getRating())
                .favoritesCount(spot.getFavoritesCount())
                .reviewCount(reviews.size())
                .imageCount(imageDto.size())
                .phone(spot.getPhone())
                .businessHours(spot.getBusinessHours())
                .isFavorite(isFavorite)
                .isStamped(isStamped)
                .spotDescription(spot.getSpotDescription())
                .latitude(spot.getLatitude())
                .longitude(spot.getLongitude())
                .touristSpotTags(tagDto)
                .touristSpotImages(imageDto)
                .reviews(reviewDto)
                .build();
    }

    public TouristSpotFavoriteDTO touristSpotFavorite(String email, String spotId) {
        TouristSpotEntity spot = touristSpotRepository.findByElasticId(spotId).orElseThrow(() -> new CustomException(CustomErrorCode.TOURIST_NOT_FOUND));
        UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));
        // 장소 찜하기 중복 불가
        if (favoritesRepository.existsByTouristSpotIdAndUserId(spot.getId(), user.getId())) {
            throw new CustomException(CustomErrorCode.ALREADY_LIKED_TOURISTSPOT);
        }
        // 찜 추가
        TouristSpotFavorites favorites = new TouristSpotFavorites(spot, user);
        favoritesRepository.save(favorites);
        // 찜 수 +1
        int totalFavorites = spot.getFavoritesCount();
        spot.setFavoritesCount(totalFavorites + 1);

        return new TouristSpotFavoriteDTO("Spot successfully liked", totalFavorites + 1, true);
    }

    public TouristSpotFavoriteDTO touristSpotUnfavorite(String email, String spotId) {
        TouristSpotEntity spot = touristSpotRepository.findByElasticId(spotId).orElseThrow(() -> new CustomException(CustomErrorCode.TOURIST_NOT_FOUND));
        TouristSpotFavorites favorites = touristSpotFavoritesRepository.findByTouristSpotIdAndUserEmail(spot.getId(), email).orElseThrow(() -> new CustomException(CustomErrorCode.LIKE_NOT_FOUND));
        // 찜 삭제
        favoritesRepository.delete(favorites);
        // 찜 수 -1
        int totalFavorites = spot.getFavoritesCount();
        spot.setFavoritesCount(totalFavorites - 1);

        return new TouristSpotFavoriteDTO("Spot successfully unliked", totalFavorites - 1, false);
    }

}
