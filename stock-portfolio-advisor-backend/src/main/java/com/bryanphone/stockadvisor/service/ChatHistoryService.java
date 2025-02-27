package com.bryanphone.stockadvisor.service;

import com.bryanphone.stockadvisor.model.ChatHistory;
import com.bryanphone.stockadvisor.model.ChatHistoryResponse;
import com.bryanphone.stockadvisor.repository.ChatHistoryRepository;
import com.bryanphone.stockadvisor.utils.CompressionUtil;
import com.bryanphone.stockadvisor.utils.JwtUtils;
import jakarta.transaction.Transactional;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Log
public class ChatHistoryService {


    @Autowired
    private ChatHistoryRepository chatHistoryRepository;


    public void saveChatHistory(String message, String role) {
        String userId = JwtUtils.getUsernameFromJwt();
        byte[] compressedMessage = CompressionUtil.compress(message);
        // Create and save the ChatHistory entity
        ChatHistory chatHistory = new ChatHistory();
        chatHistory.setUserId(userId);
        chatHistory.setMessages(compressedMessage); // Set compressed data
        chatHistory.setRole(role);

        chatHistoryRepository.save(chatHistory);

    }


    @Transactional
    public List<ChatHistoryResponse> getChatHistory() {
        String userId = JwtUtils.getUsernameFromJwt();
        List<ChatHistory> chList = chatHistoryRepository.findByUserIdOrderByTimestampAsc(userId);

        return chList.stream()
                .map(this::mapToChatHistoryResponse)
                .collect(Collectors.toList());
    }

    private ChatHistoryResponse mapToChatHistoryResponse(ChatHistory chatHistory) {
        String decompressedMessage = CompressionUtil.decompress(chatHistory.getMessages());

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String formattedTimestamp = chatHistory.getTimestamp().format(formatter);

        return new ChatHistoryResponse(
                chatHistory.getId(),
                chatHistory.getUserId(),
                decompressedMessage,
                chatHistory.getRole(),
                formattedTimestamp
        );
    }

    public void deleteChatHistoryById(Long id) {
        chatHistoryRepository.deleteById(id);
    }


}
