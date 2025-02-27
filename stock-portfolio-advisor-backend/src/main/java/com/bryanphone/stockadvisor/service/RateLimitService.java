package com.bryanphone.stockadvisor.service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Log
public class RateLimitService {
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Value("${rate.limit.daily}")
    private int dailyLimit;

    public Bucket resolveBucket(String userId) {
        return buckets.computeIfAbsent(userId, key -> {
            // Using greedy refill which resets all tokens at the start of each period
            Bandwidth limit = Bandwidth.classic(dailyLimit, Refill.greedy(dailyLimit, Duration.ofDays(1)));
            return Bucket.builder().addLimit(limit).build();
        });
    }

    /**
     * Checks if a request is allowed based on the rate limit.
     * This method consumes exactly 1 token from the bucket if available.
     *
     * @param userId the user ID
     * @param userMessage the user message (used for logging purposes only)
     * @return true if the request is allowed, false otherwise
     */
    public boolean allowRequest(String userId, String userMessage) {
        if (userId == null) {
            return false;
        }
        
        Bucket bucket = resolveBucket(userId);
        boolean allowed = bucket.tryConsume(1);
        
        if (!allowed) {
            log.warning("Rate limit exceeded for user: " + userId);
        }
        
        return allowed;
    }

    public Integer getRemainingRequests(String userId) {
        Bucket bucket = resolveBucket(userId);
        return (int) bucket.getAvailableTokens();
    }
}
