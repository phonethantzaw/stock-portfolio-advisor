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
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Log
public class ChatHistoryService {


    @Autowired
    private ChatHistoryRepository chatHistoryRepository;


    public void saveChatHistory(String message, String role) {
        String userId = JwtUtils.getUsernameFromJwt();
        log.info("Saving chat history for user: " + userId + "role: " + role + "message: " + message);

        byte[] compressedMessage = CompressionUtil.compress(message);
        log.info("Compressed message: " + Arrays.toString(compressedMessage));

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
        log.info("Retrieving chat history for user: " + userId);

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
                chatHistory.getUserId(),
                decompressedMessage,
                chatHistory.getRole(),
                formattedTimestamp
        );
    }


}
