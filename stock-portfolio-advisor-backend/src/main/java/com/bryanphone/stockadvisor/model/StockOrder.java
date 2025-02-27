package com.bryanphone.stockadvisor.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;


import java.math.BigDecimal;
import java.time.LocalDateTime;


@Entity(name = "stock_orders")
@Data
public class StockOrder{
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        @Column(name = "user_id")
        private String userId;
        private String symbol;
        private Integer quantity;
        private BigDecimal price;
        @Column(name = "order_type")
        private OrderType orderType;
        @Column(name = "created_at")
        private LocalDateTime createdAt;

        public StockOrder() {
        }

        public StockOrder(String userId, String symbol, Integer quantity, BigDecimal price, OrderType orderType) {
                this.userId = userId;
                this.symbol = symbol;
                this.quantity = quantity;
                this.price = price;
                this.orderType = orderType;
                this.createdAt = LocalDateTime.now();
        }
}


