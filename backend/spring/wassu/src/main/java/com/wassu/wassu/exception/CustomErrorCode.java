package com.wassu.wassu.exception;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;


@Slf4j
@Getter
public enum CustomErrorCode {
    USER_NOT_FOUND(HttpStatus.BAD_REQUEST, "User Not Found"),
    USER_NOT_FOUND_WHILE_CREATING_ARTICLE(HttpStatus.BAD_REQUEST, "User Not Found While Creating Article"),
    ALREADY_LIKED_REVIEW(HttpStatus.BAD_REQUEST, "Already Liked Review"),
    ALREADY_LIKED_ARTICLE(HttpStatus.BAD_REQUEST, "Already Liked Article"),

    USER_NOT_AUTHORIZED_CONTROL_ARTICLE(HttpStatus.FORBIDDEN, "User Not Authorized To Control Article"),
    USER_NOT_AUTHORIZED_CONTROL_REVIEW(HttpStatus.FORBIDDEN, "User Not Authorized To Control Review"),

    ARTICLE_NOT_FOUND(HttpStatus.NOT_FOUND, "Article Not Found"),
    REVIEW_NOT_FOUND(HttpStatus.NOT_FOUND, "Review Not Found"),
    REVIEW_IMAGE_NOT_FOUND(HttpStatus.NOT_FOUND, "Review Image Not Found"),
    LIKE_NOT_FOUND(HttpStatus.NOT_FOUND, "Like Not Found"),
    TOURIST_NOT_FOUND(HttpStatus.NOT_FOUND, "TouristSpot Not Found"),

    FAILED_TO_UPDATE_ARTICLE(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Update Article"),
    FAILED_TO_CREATE_ARTICLE(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Create Article"),
    FAILED_TO_DELETE_ARTICLE(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Delete Article"),
    IMAGE_UPLOADING_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "Image Uploading Failed"),
    FAILED_TO_CREATE_TAG(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Create Tag"),
    FAILED_TO_UPDATE_TAG(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Update Tag"),
    FAILED_TO_UPDATE_IMAGE(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Update Image"),
    FAILED_TO_DELETE_TAG(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Delete Tag"),
    FAILED_TO_DELETE_IMAGE(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Delete Image"),
    FAILED_TO_SEND_EMAIL(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Send Email"),
    FAILED_TO_UPLOAD_S3(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Upload S3"),
    IMAGEFILE_IS_NULL(HttpStatus.INTERNAL_SERVER_ERROR, "Image File Is Null"),
    FAILED_TO_SEARCH(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Search"),
    FAILED_TO_SEARCH_BY_TAG(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Search By Tag"),
    ERROR_WHILE_SEARCH_ARTICLE(HttpStatus.INTERNAL_SERVER_ERROR, "Error While Search Article"),
    ERROR_WHILE_READ_ARTICLE(HttpStatus.INTERNAL_SERVER_ERROR, "Error While Read Article"),
    FAILED_TO_UPDATE_PROFILE(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Update Profile"),
    FAILED_TO_UPDATE_PROFILE_IMAGE(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Update Profile Image"),;

    private final HttpStatus status;
    private final String message;


    CustomErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }
}


