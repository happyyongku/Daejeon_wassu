package com.wassu.wassu.exception;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;


@Slf4j
@Getter
public enum CustomErrorCode {
    USER_NOT_FOUND(HttpStatus.BAD_REQUEST, "User Not Found"),
    USER_NOT_AUTHORIZED_CONTROL_ARTICLE(HttpStatus.FORBIDDEN, "User Not Authorized To Control Article"),
    ARTICLE_NOT_FOUND(HttpStatus.NOT_FOUND, "Article Not Found"),
    FAILED_TO_UPDATE_ARTICLE(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Update Article"),
    FAILED_TO_CREATE_ARTICLE(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Create Article"),
    FAILED_TO_DELETE_ARTICLE(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Delete Article"),
    IMAGE_UPLOADING_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "Image Uploading Falied"),
    USER_NOT_FOUND_WHILE_CREATING_ARTICLE(HttpStatus.BAD_REQUEST, "User Not Found While Creating Article"),
    FAILED_TO_CREATE_TAG(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Create Tag"),
    FAILED_TO_UPDATE_TAG(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Update Tag"),;

    private final HttpStatus status;
    private final String message;


    CustomErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }
}


