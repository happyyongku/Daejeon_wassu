package com.wassu.wassu.dto.user;

import lombok.*;

@Getter
@Setter
@Builder
public class UserAuthDTO {
    private String email;
    private String password;
}
