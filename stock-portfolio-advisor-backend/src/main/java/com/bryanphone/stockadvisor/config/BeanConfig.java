package com.bryanphone.stockadvisor.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.http.HttpHeaders;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.Collections;

@Configuration
public class BeanConfig {

    @Bean
    public AuditorAware<String> auditorAware() {
        return new ApplicationAuditAware();
    }

    private @Value("${frontend.url}") String frontendUrl;

    @Bean
    public CorsFilter corsFilter() {
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        final CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        
        // Allow both the configured frontend URL and the specific domain
        config.addAllowedOrigin("https://stockadvisor.phonethantzaw.cloud");
        
        // Also add the configured frontend URL if it's different
        if (frontendUrl != null && !frontendUrl.isEmpty() && 
            !frontendUrl.equals("https://stockadvisor.phonethantzaw.cloud")) {
            config.addAllowedOrigin(frontendUrl);
        }
        
        // Add all common headers
        config.addAllowedHeader("*");
        
        // Add all common methods including OPTIONS for preflight requests
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("PATCH");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("OPTIONS");
        
        // Set max age for preflight requests
        config.setMaxAge(3600L);
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
