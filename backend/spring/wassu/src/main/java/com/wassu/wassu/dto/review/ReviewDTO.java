package com.wassu.wassu.dto.review;

import com.wassu.wassu.dto.user.UserProfileDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
@AllArgsConstructor
public class ReviewDTO {

    private Long reviewId;
    private String content;
    private UserProfileDTO profile;
    private List<ReviewImageDTO> reviewImages;
    private LocalDateTime createdAt;

}
