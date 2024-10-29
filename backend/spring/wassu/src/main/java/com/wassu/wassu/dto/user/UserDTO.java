package com.wassu.wassu.dto.user;

import lombok.*;

@Getter
@Setter
@Builder
public class UserDTO {
    private Long id;
    private String email;
    private String nickname;
    private String gender;
    private Integer birthYear;
    private String level;
    private Integer exp;
}
