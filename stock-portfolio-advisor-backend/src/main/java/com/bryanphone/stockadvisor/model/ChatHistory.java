package com.bryanphone.stockadvisor.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


import java.time.LocalDateTime;

@Getter
@Setter
@Entity(name = "chat_history")
public class ChatHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Lob // Use @Lob for large binary data
    @Column(name = "messages")
    private byte[] messages; // Store compressed data as byte array


    @Column(nullable = false)
    private String role; // "user" or "system"

    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    public ChatHistory() {
    }

    public ChatHistory(String userId, byte[] messages, String role) {
        this.userId = userId;
        this.messages = messages;
        this.role = role;
    }
}
