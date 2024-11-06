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
import org.apache.catalina.authenticator.BasicAuthenticator;
import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.message.BasicHeader;
import org.apache.http.ssl.SSLContextBuilder;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

import javax.net.ssl.SSLContext;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Base64;

@Configuration
@EnableElasticsearchRepositories(
        basePackageClasses = {
                ArticleRepository.class,
                ArticleImageRepository.class,
                ArticleTagRepository.class,
        }
)
public class ElasticsearchConfig {

//    @Value("${elasticsearch.url}")
//    private String elastichUrl;
    @Value("${server.domain}")
    private String serverDomain;

    @Value("${elasticsearch.endpoint}")
    private String elasticEndpoint;

    @Value("${elasticsearch.username}")
    private String username;

    @Value("${elasticsearch.password}")
    private String password ;

//    @PostConstruct
//    public void logCredentials() {
//        System.out.println("Username: " + username + "-----------------------");
//        System.out.println("Password: " + password + "-----------------------");
//    }

    @Primary
    @Bean
    public ElasticsearchClient elasticsearchClient() {
        System.out.println("Creating elasticsearch client --------------------------");
        String base64Credentials = Base64.getEncoder().encodeToString((username + ":" + password).getBytes(StandardCharsets.UTF_8));
        System.out.println("base64Credentials: " + base64Credentials + "-----------------------------");
        RestClientBuilder builder = RestClient.builder(
                new HttpHost(serverDomain, 443, "https")
        )
                .setPathPrefix(elasticEndpoint)
                .setHttpClientConfigCallback(httpClientBuilder -> {
                    try {
                        SSLContext sslContext = SSLContextBuilder.create()
                                .loadTrustMaterial((chain, authType) -> true).build(); // 모든 인증서 신뢰
                        httpClientBuilder.setSSLContext(sslContext)
                                .setSSLHostnameVerifier(NoopHostnameVerifier.INSTANCE);
                        BasicCredentialsProvider credentialsProvider = new BasicCredentialsProvider();
                        credentialsProvider.setCredentials(
                                AuthScope.ANY, new UsernamePasswordCredentials(username, password)
                        );
                        httpClientBuilder.setDefaultCredentialsProvider(credentialsProvider);
                        return httpClientBuilder;
                    } catch (Exception e) {
                        throw new RuntimeException("Error while creating Elasticsearch client", e);
                    }
        })
                .setDefaultHeaders(new BasicHeader[]{
                        new BasicHeader("Authorization", "Basic " + Base64.getEncoder().encodeToString(
                                (username + ":" + password).getBytes(StandardCharsets.UTF_8))
                        )
                });
        RestClient restclient = builder.build();
        RestClientTransport transport = new RestClientTransport(restclient, new JacksonJsonpMapper());
        return new ElasticsearchClient(transport);
    }

}
