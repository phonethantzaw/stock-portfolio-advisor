package com.bryanphone.stockadvisor.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class BeanConfig {

    private @Value("${frontend.url}") String frontendUrl;

    private static final Logger logger = LoggerFactory.getLogger(BeanConfig.class);

    @Bean
    public AuditorAware<String> auditorAware() {
        return new ApplicationAuditAware();
    }



    @Bean
    public CorsFilter corsFilter() {
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        final CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        logger.info("CorsFilter frontendUrl: {}", frontendUrl);
        // Allow both the configured frontend URL and the specific domain
        config.addAllowedOrigin(frontendUrl);
        
//        // Also add the configured frontend URL if it's different
//        if (frontendUrl != null && !frontendUrl.isEmpty() &&
//            !frontendUrl.equals("https://stockadvisor.phonethantzaw.cloud")) {
//            config.addAllowedOrigin(frontendUrl);
//        }


        
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
