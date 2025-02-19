package com.bryanphone.stockadvisor.controller;

import com.bryanphone.stockadvisor.assistant.StockAdvisorAssistant;
import com.bryanphone.stockadvisor.model.ChatHistory;
import com.bryanphone.stockadvisor.model.ChatHistoryResponse;
import com.bryanphone.stockadvisor.service.ChatHistoryService;
import com.bryanphone.stockadvisor.service.StockOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class StockAdvisorController {

    private final StockAdvisorAssistant assistant;

    @Autowired
    private ChatHistoryService chatHistoryService;

    @Autowired
    private StockOrderService stockOrderService;

    public StockAdvisorController(StockAdvisorAssistant assistant) {
        this.assistant = assistant;
    }

    @GetMapping("/message")
    public String chat(String userMessage) {
        return assistant.chat(userMessage);
    }

    @PostMapping("/save")
    public ResponseEntity<Void> saveMessage(@RequestParam String message, @RequestParam String role) {
        chatHistoryService.saveChatHistory(message, role);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/history")
    public ResponseEntity<List<ChatHistoryResponse>> getChatHistory() {
        List<ChatHistoryResponse> history = chatHistoryService.getChatHistory();
        return ResponseEntity.ok(history);
    }


}
