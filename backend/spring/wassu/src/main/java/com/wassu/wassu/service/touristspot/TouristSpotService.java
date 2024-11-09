package com.wassu.wassu.service.touristspot;

import com.wassu.wassu.dto.review.ReviewDTO;
import com.wassu.wassu.dto.review.ReviewImageDTO;
import com.wassu.wassu.dto.touristspot.TouristSpotDTO;
import com.wassu.wassu.dto.touristspot.TouristSpotFavoriteDTO;
import com.wassu.wassu.dto.touristspot.TouristSpotImageDto;
import com.wassu.wassu.dto.touristspot.TouristSpotTagDto;
import com.wassu.wassu.dto.user.UserProfileDTO;
import com.wassu.wassu.entity.TouristSpotEntity;
import com.wassu.wassu.entity.TouristSpotFavorites;
import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.entity.review.ReviewEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.UserRepository;
import com.wassu.wassu.repository.review.ReviewLikesRepository;
import com.wassu.wassu.repository.touristspot.TouristSpotFavoritesRepository;
import com.wassu.wassu.repository.touristspot.TouristSpotRepository;
import com.wassu.wassu.service.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class TouristSpotService {

    private final TouristSpotRepository touristSpotRepository;
    private final TouristSpotFavoritesRepository favoritesRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final TouristSpotFavoritesRepository touristSpotFavoritesRepository;
    private final ReviewLikesRepository reviewLikesRepository;

    public TouristSpotDTO getTouristSpotDetails(String email, Long spotId) {
        TouristSpotEntity spot = touristSpotRepository.findDetailById(spotId).orElseThrow(() -> new CustomException(CustomErrorCode.TOURIST_NOT_FOUND));
        List<TouristSpotTagDto> tagDto = spot.getTouristSpotTags().stream().map(tags -> new TouristSpotTagDto(tags.getId(), tags.getTag())).toList();
        List<TouristSpotImageDto> imageDto = spot.getTouristSpotImages().stream().map(images -> new TouristSpotImageDto(images.getId(), images.getTouristSpotImageUrl())).toList();
        List<ReviewEntity> reviews = spot.getReviews();
        List<ReviewDTO> reviewDto = new ArrayList<>();
        boolean isFavorite = false;
        if (email != null) {
            isFavorite = touristSpotFavoritesRepository.existsByTouristSpotIdAndUserEmail(spotId, email);
        }
        for (ReviewEntity review : reviews) {
            boolean isLiked = false;
            if (email != null) {
                isLiked = reviewLikesRepository.existsByReviewIdAndUserEmail(review.getId(), email);
            }
            UserEntity user = review.getUser();
            List<ReviewImageDTO> reviewImages = review.getImages().stream()
                    .map(image -> new ReviewImageDTO(image.getId(), image.getImageUrl())).toList();
            UserProfileDTO profile = userService.convertToDTO(user);
            ReviewDTO dto = ReviewDTO.builder()
                    .reviewId(review.getId())
                    .content(review.getContent())
                    .likeCount(review.getLikeCount())
                    .isLiked(isLiked)
                    .profile(profile)
                    .reviewImages(reviewImages)
                    .createdAt(review.getCreatedAt()).build();
            reviewDto.add(dto);
        }
        return TouristSpotDTO.builder()
                .spotName(spot.getSpotName())
                .spotAddress(spot.getSpotAddress())
                .rating(spot.getRating())
                .userRatingsTotal(spot.getUserRatingsTotal())
                .favoritesCount(spot.getFavoritesCount())
                .isFavorite(isFavorite)
                .spotDescription(spot.getSpotDescription())
                .latitude(spot.getLatitude())
                .longitude(spot.getLongitude())
                .touristSpotTags(tagDto)
                .touristSpotImages(imageDto)
                .reviews(reviewDto)
                .build();
    }

    public TouristSpotFavoriteDTO touristSpotFavorite(String email, Long spotId) {
        TouristSpotEntity spot = touristSpotRepository.findById(spotId).orElseThrow(() -> new CustomException(CustomErrorCode.TOURIST_NOT_FOUND));
        UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(CustomErrorCode.USER_NOT_FOUND));
        // 장소 찜하기 중복 불가
        if (favoritesRepository.existsByTouristSpotIdAndUserEmail(spotId, email)) {
            throw new CustomException(CustomErrorCode.ALREADY_LIKED_TOURISTSPOT);
        }
        // 찜 추가
        TouristSpotFavorites favorites = new TouristSpotFavorites(spot, user);
        favoritesRepository.save(favorites);
        // 찜 수 +1
        int totalFavorites = spot.getFavoritesCount();
        spot.setFavoritesCount(totalFavorites + 1);

        return new TouristSpotFavoriteDTO("Spot successfully liked", totalFavorites + 1);
    }

    public TouristSpotFavoriteDTO touristSpotUnfavorite(String email, Long spotId) {
        TouristSpotEntity spot = touristSpotRepository.findById(spotId).orElseThrow(() -> new CustomException(CustomErrorCode.TOURIST_NOT_FOUND));
        TouristSpotFavorites favorites = touristSpotFavoritesRepository.findByTouristSpotIdAndUserEmail(spotId, email).orElseThrow(() -> new CustomException(CustomErrorCode.LIKE_NOT_FOUND));
        // 찜 삭제
        favoritesRepository.delete(favorites);
        // 찜 수 -1
        int totalFavorites = spot.getFavoritesCount();
        spot.setFavoritesCount(totalFavorites - 1);

        return new TouristSpotFavoriteDTO("Spot successfully unliked", totalFavorites - 1);
    }

}
