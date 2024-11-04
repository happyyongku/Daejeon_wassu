package com.wassu.wassu.exception;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;


@Slf4j
@Getter
public enum CustomErrorCode {
    USER_NOT_FOUND(HttpStatus.BAD_REQUEST, "User Not Found"),
    USER_NOT_AUTHORIZED_CONTROL_ARTICLE(HttpStatus.UNAUTHORIZED, "User Not Authorized To Control Article"),
    ARTICLE_NOT_FOUND(HttpStatus.NOT_FOUND, "Article Not Found"),
    FAILED_TO_UPDATE_ARTICLE(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Update Article"),
    FAILED_TO_CREATE_ARTICLE(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Create Article"),
    FAILED_TO_DELETE_ARTICLE(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Delete Article"),;

    private final HttpStatus status;
    private final String message;


    CustomErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }
}


