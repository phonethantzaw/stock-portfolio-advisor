package com.bryanphone.stockadvisor.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class StockAPIConfig {


    private @Value("${stock.api.url}") String apiUrl;

    private @Value("${stock.api.key}") String apiKey;


    @Bean
    public RestClient restClient() {
        return RestClient.builder()
                .baseUrl(apiUrl)
                .build();
    }


    public String getApiKey() {
        return apiKey;
    }
}
