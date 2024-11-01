package com.wassu.wassu.dto.user;

import lombok.*;

@Getter
@Setter
@Builder
public class UserSignupDTO {
    private String email;
    private String password;
    private String nickname;
    private String gender;
    private Integer birthYear;
    private String level;
    private Integer exp;
    private String profileImage;
}
