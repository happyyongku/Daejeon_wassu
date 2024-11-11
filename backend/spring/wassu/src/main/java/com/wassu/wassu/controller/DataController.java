package com.wassu.wassu.controller;

import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.service.data.DataService;
import com.wassu.wassu.util.UtilTool;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@AllArgsConstructor
@RequestMapping("/wassu/data-uploading-elastic")
@Slf4j
public class DataController {

    private final UtilTool utilTool;
    private DataService dataService;

    @PostMapping("/csv")
    public ResponseEntity<?> uploadCSV(
            @RequestParam("file") MultipartFile file
    ) {
        try {
            dataService.uploadCSV(file);
            return ResponseEntity.ok(utilTool.createResponse("status", "success"));
        } catch(Exception e) {
            log.error("Error while uploading csv file: ", e);
            throw new CustomException(CustomErrorCode.ERROR_WHILE_READ_ARTICLE);
        }
    }

}
