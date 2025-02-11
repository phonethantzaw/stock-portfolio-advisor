package com.bryanphone.stockadvisor.service;

import com.bryanphone.stockadvisor.model.OrderType;
import com.bryanphone.stockadvisor.model.StockHoldingDetails;
import com.bryanphone.stockadvisor.model.StockOrder;
import com.bryanphone.stockadvisor.repository.StockOrderRepository;
import dev.langchain4j.agent.tool.Tool;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StockOrderService {

    Logger log = LoggerFactory.getLogger(StockOrderService.class);

    private final StockOrderRepository stockOrderRepository;

    public StockOrderService(StockOrderRepository stockOrderRepository) {
        this.stockOrderRepository = stockOrderRepository;
    }

    @Tool
    public StockOrder createOrder(StockOrder order) {
        log.info("Creating order: {}", order);
        StockOrder newOrder = new StockOrder(
                null,
                "user123",
                order.symbol(),
                order.quantity(),
                order.price(),
                order.orderType(),
                LocalDateTime.now()
        );
        return stockOrderRepository.save(newOrder);
    }

    @Tool
    public List<StockOrder> getAllOrders() {
        log.info("Fetching all orders");
        return stockOrderRepository.findAll();
    }

    @Tool
    public List<StockHoldingDetails> getStockHoldingDetails() {
        log.info("Fetching stock holding details");
        return stockOrderRepository.findAll().stream()
                .collect(Collectors.groupingBy(StockOrder::symbol, Collectors.summingInt(order ->
                        order.orderType() == OrderType.BUY ? order.quantity() : -order.quantity())))
                .entrySet().stream()
                .map(entry -> new StockHoldingDetails(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }
}
