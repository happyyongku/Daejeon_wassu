package com.wassu.wassu.dto.user;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserProfileUpdateDTO {
    private String nickName;
}
