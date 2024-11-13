package com.wassu.wassu.service.data;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import com.wassu.wassu.config.AmazonS3Config;
import com.wassu.wassu.entity.ElasticTouristSpotEntity;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@AllArgsConstructor
public class DataService {

    private ElasticsearchClient elasticsearchClient;

    private final AmazonS3Config amazonS3Config;

    public void uploadCSV(MultipartFile file) throws IOException {
        try (
                BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
                CSVParser csvParser = CSVFormat.DEFAULT.builder()
                        .setHeader()
                        .setSkipHeaderRecord(true)
                        .build()
                        .parse(reader)
                ){
            List<ElasticTouristSpotEntity> spots = new ArrayList<>();

            for (CSVRecord record : csvParser) {
                ElasticTouristSpotEntity spot = new ElasticTouristSpotEntity();

                String latitudeStr = record.get("latitude").trim();
                String longitudeStr = record.get("longitude").trim();

                spot.setId(UUID.randomUUID().toString());
                spot.setSpotName(record.get("spot_name"));
                spot.setSpotAddress(record.get("spot_address"));
                spot.setSpotDescription(record.get("spot_description"));

                spot.setLatitude(latitudeStr.isEmpty() ? null : Double.parseDouble(latitudeStr));
                spot.setLongitude(longitudeStr.isEmpty() ? null : Double.parseDouble(longitudeStr));
                spot.setPhoneNumber(record.get("phone"));
                spot.setBusinessHour(record.get("business_hours"));
                spot.setLiked(0);
                spot.setStamp(0);

                String categoryValue = record.get("tag").trim();
                List<ElasticTouristSpotEntity.Category> categories = new ArrayList<>();
                for (String category: categoryValue.split("; ")) {
                    categories.add(new ElasticTouristSpotEntity.Category(category.trim()));
                }
                spot.setCategories(categories);

                List<ElasticTouristSpotEntity.Image> images = new ArrayList<>();
                String imageCountStr = record.get("image_count").trim();
                int imageCount = imageCountStr.isEmpty() ? 0 : Integer.parseInt(record.get("image_count"));
                String spotName = record.get("spot_name").trim().replaceAll("[^a-zA-Z0-9가-힣()\\s]", "_");

                for (int i = 1; i <= imageCount; i++) {
                    String fileName = String.format("tourist_spot_image/%s_(%d).jpg", spotName, i);
                    images.add(new ElasticTouristSpotEntity.Image(String.format(
                            "https://%s.s3.%s.amazonaws.com/%s",
                            amazonS3Config.getBucket(),
                            amazonS3Config.getRegion(),
                            fileName
                    )));
                }
                spot.setImages(images);
                spots.add(spot);
            }

            for (ElasticTouristSpotEntity spot : spots) {
                elasticsearchClient.index(i -> i
                        .index("elastic_tourist_spot")
                        .id(spot.getId())
                        .document(spot)
                );
            }

        } catch(Exception e) {
            log.error("Tourist spot upload failed");
            throw e;
        }
    }
}
