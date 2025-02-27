package com.bryanphone.stockadvisor.model;

public record ChatHistoryResponse(Long id,String userId, String message, String role, String timestamp) {
}
