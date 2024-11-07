package com.wassu.wassu.service.article;


import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.FieldValue;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.MultiMatchQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.TextQueryType;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wassu.wassu.entity.ArticleEntity;
import com.wassu.wassu.exception.CustomErrorCode;
import com.wassu.wassu.exception.CustomException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.util.List;


@Service
@Slf4j
public class ArticleSearchServiceImpl implements ArticleSearchService {

    private final ElasticsearchClient elasticsearchClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public ArticleSearchServiceImpl(ElasticsearchClient elasticsearchClient) {
        this.elasticsearchClient = elasticsearchClient;
    }

    @Override
    public Page<ArticleEntity> searchByTitleAndContentWithTags(
            String searchText, List<String> tags, Pageable pageable
    )  {
        try {
            log.info("Start to search article with searchText: {}, tags: {}", searchText, tags);
            BoolQuery.Builder boolQueryBuilder = new BoolQuery.Builder();
            
            // 제목과 내용에 대해 검색 조건 추가
            if (searchText != null && !searchText.isEmpty()) {
                log.info("SearchText Exists");
                Query multiMatchQuery = Query.of(
                        q -> q.multiMatch(MultiMatchQuery.of(
                                m -> m.fields(List.of("title", "content"))
                                        .query(searchText)
                                        .type(TextQueryType.BestFields)
                        ))
                );
                log.info("MultiMatchQuery: {}", multiMatchQuery);
                boolQueryBuilder.must(multiMatchQuery);
            }
            
            // 태그 조건 추가, tags.tag 형식으로 검색
            if (tags != null && !tags.isEmpty()) {
                log.info("SearchTags Exists");
                List<FieldValue> fieldValues = tags.stream()
                        .map(FieldValue::of)
                        .toList();
                Query nestedTagQuery = Query.of(q -> q.nested(n -> n
                        .path("tags")
                        .query(tq -> tq.terms(t -> t.field("tags.tag").terms(
                                ts -> ts.value(fieldValues)
                        )))));
                log.info("TagsQuery: {}", nestedTagQuery);
                boolQueryBuilder.filter(nestedTagQuery);
            }

            Query finalQuery = Query.of(q -> q.bool(boolQueryBuilder.build()));
            log.info("finalQuery: {}", finalQuery);

            SearchRequest request = new SearchRequest.Builder()
                    .index("article")
                    .query(finalQuery)
//                    .from((int) pageable.getOffset())
                    .size(pageable.getPageSize())
                    .build();
            log.info("Request: {}", objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(request.toString()));
            log.info("Request Index: {}", request.index());

            log.info("Elasticsearch Query Request: {}", request);

//            J response = elasticsearchClient.search(request, ArticleEntity.class);
            SearchResponse<ArticleEntity> response = elasticsearchClient.search(request, ArticleEntity.class);

            log.info("Elasticsearch Query Response: {}", response);
            log.info("Elasticsearch Query Response2: {}", objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(response.toString()));

            log.info("Temp : {}", response.hits().hits());
            List<ArticleEntity> articles = response.hits().hits().stream()
                    .map(hit -> hit.source())
                    .toList();

            long totalHits = response.hits().total() != null ? response.hits().total().value() : 0L;
            log.info("Total hits: {}", totalHits);

            return new PageImpl<>(articles, pageable, totalHits);

        } catch (Exception e) {
            log.error("Error while search: {}", e.getMessage());
            throw new CustomException(CustomErrorCode.FAILED_TO_SEARCH);
        }
    }
}
