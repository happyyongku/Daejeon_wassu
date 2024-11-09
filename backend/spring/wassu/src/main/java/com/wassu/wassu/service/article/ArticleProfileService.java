package com.wassu.wassu.service.article;


import com.wassu.wassu.entity.UserEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Service
@Slf4j
@AllArgsConstructor
public class ArticleProfileService {
    private final UserRepository userRepository;

    public void matchingProfileWithArticleList(Page<Map<String, Object>> searchResponse) {
        try {
            if (searchResponse.hasContent()) {
                List<Map<String, Object>> articleList = searchResponse.getContent();
                for (Map<String, Object> article : articleList) {
                    log.info("Article User Id: {}", article.get("user").getClass());
                    Object userObject = article.get("user");
                    Long userId = null;
                    if (userObject instanceof Number) {
                        userId = ((Number) userObject).longValue();
                    }
                    Optional<UserEntity> optionalUser = userRepository.findById(Objects.requireNonNull(userId));
                    if (optionalUser.isPresent() ) {
                        UserEntity userEntity = optionalUser.get();
                        article.putAll(Map.of(
                                "nickName", userEntity.getNickname(),
                                "profileImage", userEntity.getProfileImage()
                        ));
                    } else {
                        article.putAll(Map.of(
                                "nickName", "Anonymous",
                                "profileImage", "default"
                        ));
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to matching profile with article list", e);
            throw new CustomException(CustomErrorCode.FAILED_TO_MATCHING_PROFILE_AND_ARTICLE);
        }
    }
}
