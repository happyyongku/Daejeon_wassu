package com.wassu.wassu.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.ProfileCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.regions.Region;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@Component
public class S3Util {

    private final S3Client s3Client;
    private final String bucketName;
//
    public S3Util(
            @Value("${aws.s3.secretKey}") String secretKey,
            @Value("${aws.s3.region}") String region,
            @Value("${aws.s3.accessKeyId}") String accessKeyId,
            @Value("${aws.s3.bucket}") String bucketName
    ) {
        AwsBasicCredentials awsCreds = AwsBasicCredentials.create(accessKeyId, secretKey);
//        this.region = region;
        this.bucketName = bucketName;
        this.s3Client = S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(awsCreds))
                .build();
    }

    // 파일 고유 이름 생성 및 파일 업로드
    public String uploadFile(MultipartFile file, String folderName) {
        String fileName = folderName + "/" + UUID.randomUUID().toString() + '_' + file.getOriginalFilename();
        try {
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(fileName)
                            .build(),
                    RequestBody.fromBytes(file.getBytes())
            );
            log.info("File S3 Uploaded Successfully");
            return fileName;
        } catch (Exception e) {
            log.error("File S3 Uploaded Failed: {}", e.getMessage());
//            throw new RuntimeException("File S3 Uploaded Failed: ", e);
            return null;
        }
    }
    
    // S3 파일 삭제
    public Boolean deleteFile(String fileName) {
        try {
            if (fileName == null) {
                log.info("S3 upload file is null");
                return true;
            }
            s3Client.deleteObject(
                    DeleteObjectRequest.builder()
                            .bucket(bucketName)
                            .key(fileName)
                            .build()
            );
            log.info("File S3 Deleted Successfully");
            return true;
        } catch (Exception e) {
            log.error("File S3 Deleted Failed: {}", e.getMessage());
            return false;
        }
    }
}
