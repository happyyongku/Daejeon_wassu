package com.wassu.wassu.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.indices.CreateIndexRequest;
import co.elastic.clients.elasticsearch.indices.IndexSettings;
import co.elastic.clients.json.JsonData;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wassu.wassu.repository.ArticleRepository;
import com.wassu.wassu.repository.ArticleImageRepository;
import com.wassu.wassu.repository.ArticleTagRepository;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableElasticsearchRepositories(
        basePackageClasses = {
                ArticleRepository.class,
                ArticleImageRepository.class,
                ArticleTagRepository.class,
        }
)
public class ElasticsearchConfig {

    @Value("${ELASTIC_HOST}")
    private String elasticHost;

    @Value("${ELASTIC_PORT}")
    private Integer elasticPort;

    @Bean
    public ElasticsearchClient elasticsearchClient() {
        RestClient restClient = RestClient.builder(
                new HttpHost(elasticHost, elasticPort))
                .build();
        RestClientTransport transport = new RestClientTransport(
                restClient, new JacksonJsonpMapper()
        );
        return new ElasticsearchClient(transport);
    }

    @PostConstruct
    public void createIndexWithNoriAnalyzer() throws IOException {
        ElasticsearchClient client = elasticsearchClient();

        ClassPathResource resource = new ClassPathResource("nori_settings.json");
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> indexSettingsMap = mapper.readValue(resource.getInputStream(), Map.class);

        CreateIndexRequest request = CreateIndexRequest.of(
                builder -> builder.index("article")
                        .settings(IndexSettings.of(s -> s.withJson((InputStream) mapper.convertValue(indexSettingsMap.get("settings"), Map.class))))
                        .mappings(m -> m.withJson((InputStream) mapper.convertValue(indexSettingsMap.get("mappings"), Map.class)))

        );

        client.indices().create(request);

    }

}
