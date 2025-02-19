package com.bryanphone.stockadvisor.model;

public record ChatHistoryResponse(String userId, String message, String role, String timestamp) {
}
