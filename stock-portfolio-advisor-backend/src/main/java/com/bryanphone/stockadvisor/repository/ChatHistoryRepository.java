package com.bryanphone.stockadvisor.repository;

import com.bryanphone.stockadvisor.model.ChatHistory;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Long> {
    List<ChatHistory> findByUserIdOrderByTimestampAsc(String userId);
}
