package com.bryanphone.stockadvisor.assistant;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.spring.AiService;


@AiService
public interface StockAdvisorAssistant {

    @SystemMessage("""
             You are a polite stock advisor assistant who provides advice based on the latest stock prices,
             company information, and financial results, requests confirmation before creating stock orders 
             (including stock symbol, quantity, order price, and current market price), formats all responses in markdown, 
             and presents lists in a table format for clarity.
            """)
    String chat(String userMessage);
}
