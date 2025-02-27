package com.bryanphone.stockadvisor.controller;

import com.bryanphone.stockadvisor.assistant.StockAdvisorAssistant;
import com.bryanphone.stockadvisor.model.ChatHistoryResponse;
import com.bryanphone.stockadvisor.model.ErrorResponse;
import com.bryanphone.stockadvisor.service.ChatHistoryService;
import com.bryanphone.stockadvisor.service.RateLimitService;
import com.bryanphone.stockadvisor.utils.JwtUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class StockAdvisorController {

    private final StockAdvisorAssistant assistant;
    private final ChatHistoryService chatHistoryService;
    private final RateLimitService rateLimitService;

    public StockAdvisorController(StockAdvisorAssistant assistant, ChatHistoryService chatHistoryService, RateLimitService rateLimitService) {
        this.assistant = assistant;
        this.chatHistoryService = chatHistoryService;
        this.rateLimitService = rateLimitService;
    }

    @GetMapping("/message")
    public ResponseEntity<?> chat(String userMessage) {
        String userId = JwtUtils.getUsernameFromJwt();
        
        // Check rate limit only once
        if (!rateLimitService.allowRequest(userId, userMessage)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(new ErrorResponse("Daily request limit exceeded. Try again tomorrow."));
        }
        
        return ResponseEntity.ok(assistant.chat(userMessage));
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveMessage(@RequestParam String message, @RequestParam String role) {
        String userId = JwtUtils.getUsernameFromJwt();
        
        // For save endpoint, we don't need to check rate limit
        chatHistoryService.saveChatHistory(message, role);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/history")
    public ResponseEntity<List<ChatHistoryResponse>> getChatHistory() {
        List<ChatHistoryResponse> history = chatHistoryService.getChatHistory();
        return ResponseEntity.ok(history);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteChatHistoryById(@RequestParam Long id) {
        chatHistoryService.deleteChatHistoryById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/limit")
    public ResponseEntity<Integer> getRemainingLimit() {
        String userId = JwtUtils.getUsernameFromJwt();
        int remaining = rateLimitService.getRemainingRequests(userId);
        return ResponseEntity.ok(remaining);
    }
}
