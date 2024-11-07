package com.wassu.wassu.service.article;


import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.FieldValue;
import co.elastic.clients.elasticsearch._types.query_dsl.*;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.json.JsonData;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wassu.wassu.entity.ArticleEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import com.wassu.wassu.repository.article.ArticleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import co.elastic.clients.json.JsonData;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Service
@Slf4j
public class ArticleSearchServiceImpl implements ArticleSearchService {

    private final ElasticsearchClient elasticsearchClient;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final ArticleRepository articleRepository;

    @Autowired
    public ArticleSearchServiceImpl(ElasticsearchClient elasticsearchClient, ArticleRepository articleRepository) {
        this.elasticsearchClient = elasticsearchClient;
        this.articleRepository = articleRepository;
    }

    @Override
    public Page<ArticleEntity> searchByTitleAndContentWithTags(
            String searchText, List<String> tags, Pageable pageable
    ){
        try {
            log.info("Start to search article with searchText: {}, tags: {}", searchText, tags);
//            BoolQuery.Builder boolQueryBuilder = new BoolQuery.Builder();

            List<Query> mustQueries = new ArrayList<>();
            List<Query> filterQueries = new ArrayList<>();
            
            // 제목과 내용에 대해 검색 조건 추가
            if (searchText != null && !searchText.trim().isEmpty()) {
                log.info("SearchText Exists");
                Query multiMatchQuery = Query.of(
                        q -> q.multiMatch(MultiMatchQuery.of(
                                m -> m.fields(List.of("title", "content"))
                                        .query(searchText)
                                        .type(TextQueryType.BestFields)
                        ))
                );
                log.info("MultiMatchQuery: {}", multiMatchQuery);
//                boolQueryBuilder.must(multiMatchQuery);
                mustQueries.add(multiMatchQuery);
            } else {
                mustQueries.add(Query.of(q -> q.matchAll(m -> m)));
            }
            
            // 태그 조건 추가, tags.tag 형식으로 검색
            if (tags != null && !tags.isEmpty()) {
                log.info("SearchTags Exists");
                List<FieldValue> fieldValues = tags.stream()
                        .map(FieldValue::of)
                        .toList();
                if (!fieldValues.isEmpty()) {
                    Query nestedTagQuery = Query.of(
                            q -> q.nested(
                                    n -> n.path("tags")
                                            .query(
                                                    np -> np
                                                            .terms(
                                                                    TermsQuery.of(
                                                                            tq -> tq
                                                                                    .field("tags.tag")
                                                                                    .terms(TermsQueryField.of(
                                                                                            tf -> tf.value(fieldValues)
                                                                                    ))
                                                                    )
                                                            )
                                            )
                            )
                    );
                    log.info("TagsQuery: {}", nestedTagQuery);
                    filterQueries.add(nestedTagQuery);
                }
            }

            BoolQuery.Builder boolQueryBuilder = new BoolQuery.Builder()
                    .must(mustQueries)
                    .filter(filterQueries);

            Query finalQuery = Query.of(q -> q.bool(boolQueryBuilder.build()));
            log.info("finalQuery: {}", finalQuery);

            SearchRequest request = new SearchRequest.Builder()
                    .index("article")
                    .query(finalQuery)
//                    .from((int) pageable.getOffset())
                    .size(pageable.getPageSize())
                    .build();
            log.info("Request: {}", request);
            log.info("Request Index: {}", request.index());

            log.info("Elasticsearch Query Request: {}", request);

//            J response = elasticsearchClient.search(request, ArticleEntity.class);
            SearchResponse<ArticleEntity> response = elasticsearchClient.search(request, ArticleEntity.class);
//            SearchResponse<JsonData> response = elasticsearchClient.search(request, JsonData.class);

            log.info("Elasticsearch Query Response: {}", response);
            log.info("Elasticsearch Query Response2: {}", objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(response.toString()));

            log.info("Temp : {}", response.hits().hits());

            List<ArticleEntity> articles = response.hits().hits().stream()
                    .map(hit -> hit.source())
                    .toList();
//            List<Map> articles = response.hits().hits().stream()
//                    .map(hit -> hit.source().to(Map.class)) // Map 형식으로 변환
//                    .toList();

            long totalHits = response.hits().total() != null ? response.hits().total().value() : 0L;
            log.info("Total hits: {}", totalHits);
//
            return new PageImpl<>(articles, pageable, totalHits);

        } catch (Exception e) {
            log.error("Error while search: {}", e.getMessage());
            throw new CustomException(CustomErrorCode.FAILED_TO_SEARCH);
        }
    }
}
