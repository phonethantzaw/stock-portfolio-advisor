package com.bryanphone.stockadvisor.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

//@Configuration
public class WebConfig {
//    implements
//} WebMvcConfigurer {


//    private static final Logger logger = LoggerFactory.getLogger(WebConfig.class);
//
//    @Value("${frontend.url}")
//    private String frontendUrl;
//
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**")
//                .allowedOrigins("https://stockadvisor.phonethantzaw.cloud")
//                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
//                .allowedHeaders("*")
//                .allowCredentials(true)
//                .maxAge(3600);
//
//        logger.info("CORS configured {}", frontendUrl);
//
//        // Also add the configured frontend URL if it's different
//        if (frontendUrl != null && !frontendUrl.isEmpty() &&
//            !frontendUrl.equals("https://stockadvisor.phonethantzaw.cloud")) {
//            registry.addMapping("/**")
//                    .allowedOrigins(frontendUrl)
//                    .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
//                    .allowedHeaders("*")
//                    .allowCredentials(true)
//                    .maxAge(3600);
//        }
//    }
}
