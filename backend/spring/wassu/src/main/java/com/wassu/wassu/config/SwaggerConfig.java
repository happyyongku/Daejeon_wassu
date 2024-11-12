package com.wassu.wassu.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Value("${server.domain}")
    private String serverDomain;

    @Bean
    public OpenAPI customOpenAPI() {
        Server server = new Server();
        server.setUrl(serverDomain);
        server.setDescription("Daebbang server");

        return new OpenAPI()
                .addServersItem(server);
    }
}
