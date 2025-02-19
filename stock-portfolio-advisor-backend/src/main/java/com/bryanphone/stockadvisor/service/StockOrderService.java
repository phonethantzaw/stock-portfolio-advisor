package com.bryanphone.stockadvisor.service;

import com.bryanphone.stockadvisor.model.StockOrder;
import com.bryanphone.stockadvisor.repository.StockOrderRepository;
import com.bryanphone.stockadvisor.utils.JwtUtils;
import dev.langchain4j.agent.tool.Tool;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockOrderService {

    Logger log = LoggerFactory.getLogger(StockOrderService.class);

    @Autowired
    private StockOrderRepository stockOrderRepository;

    @Tool("Creates a new stock order with the given details and saves it to the repository.")
    public StockOrder createOrder(StockOrder order) {
        String userId = JwtUtils.getUsernameFromJwt();

        log.info("Creating order: {} for user id: {} ", order, userId);
        StockOrder newOrder = new StockOrder(
                userId, order.getSymbol(),
                order.getQuantity(), order.getPrice(),
                order.getOrderType());

        return stockOrderRepository.save(newOrder);
    }


    @Tool("Fetches all stock orders for a specific userId that is currently logged in")
    public List<StockOrder> getOrdersByUser() {
        String userId = JwtUtils.getUsernameFromJwt();
        log.info("Fetching all orders for user id: {}", userId);
        return stockOrderRepository.findByUserId(userId);
    }

//    @Tool("Fetches all stock orders")
//    public List<StockOrder> getAllOrders() {
//        log.info("Fetching all orders");
//        return stockOrderRepository.findAll();
//    }

//    @Tool("Calculates and returns the net stock holdings for each symbol by aggregating BUY and SELL orders")
//    public List<StockHoldingDetails> getStockHoldingDetails() {
//
//        String userId = getUsernameFromJwt();
//
//        log.info("Fetching stock holding details, userId: {}", userId);
//
//        return stockOrderRepository.findAll().stream()
//                .filter(order -> order.getUserId().equals(userId))  // Filter orders by userId
//                .collect(Collectors.groupingBy(StockOrder::getSymbol, Collectors.summingInt(order ->
//                        order.getOrderType() == OrderType.BUY ? order.getQuantity() : -order.getQuantity())))
//                .entrySet().stream()
//                .map(entry -> new StockHoldingDetails(entry.getKey(), entry.getValue()))
//                .collect(Collectors.toList());
//
//    }

//    private String getUsernameFromJwt() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication instanceof JwtAuthenticationToken jwtAuthenticationToken) {
//            Jwt jwt = jwtAuthenticationToken.getToken();
//            return jwt.getClaimAsString("preferred_username");
//        }
//        return "";
//    }
}
