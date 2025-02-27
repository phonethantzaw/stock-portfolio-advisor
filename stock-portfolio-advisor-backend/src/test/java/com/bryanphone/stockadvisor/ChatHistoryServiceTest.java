package com.bryanphone.stockadvisor;

import com.bryanphone.stockadvisor.model.ChatHistory;
import com.bryanphone.stockadvisor.model.ChatHistoryResponse;
import com.bryanphone.stockadvisor.repository.ChatHistoryRepository;
import com.bryanphone.stockadvisor.service.ChatHistoryService;
import com.bryanphone.stockadvisor.utils.CompressionUtil;
import com.bryanphone.stockadvisor.utils.JwtUtils;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ChatHistoryServiceTest {

//    @Mock
//    private ChatHistoryRepository chatHistoryRepository;
//
//    @InjectMocks
//    private ChatHistoryService chatHistoryService;
//
//    @Mock
//    private JwtUtils jwtUtils;
//
//    @Test
//    public void testSaveMessage() {
//        // Arrange
//        String userId = "12345";
//        String message = "Hello, how are you?";
//        String role = "user";
//
//        when(jwtUtils.getUsernameFromJwt()).thenReturn(userId);
//
//        // Act
//        chatHistoryService.saveChatHistory(message, role);
//
//        // Assert
//        verify(chatHistoryRepository, times(1)).save(any(ChatHistory.class));
//    }
//
//    @Test
//    public void testGetChatHistory() {
//        // Arrange
//        String userId = "12345";
//        ChatHistory chat1 = new ChatHistory();
//        chat1.setUserId(userId);
//        chat1.setMessages(CompressionUtil.compress("Hello"));
//        chat1.setRole("user");
//
//        ChatHistory chat2 = new ChatHistory();
//        chat2.setUserId(userId);
//        chat2.setMessages(CompressionUtil.compress("Hi"));
//        chat2.setRole("assistant");
//
//        List<ChatHistory> expectedChatHistory = Arrays.asList(chat1, chat2);
//
//        when(jwtUtils.getUsernameFromJwt()).thenReturn(userId);
//        when(chatHistoryRepository.findByUserIdOrderByTimestampAsc(userId)).thenReturn(expectedChatHistory);
//
//        // Act
//        List<ChatHistoryResponse> actualChatHistory = chatHistoryService.getChatHistory();
//
//        // Assert
//        assertEquals(expectedChatHistory.size(), actualChatHistory.size());
//        verify(chatHistoryRepository, times(1)).findByUserIdOrderByTimestampAsc(userId);
//    }
}