CREATE TABLE IF NOT EXISTS stock_orders (
                                            id SERIAL PRIMARY KEY,
                                            user_id VARCHAR(255) NOT NULL,
                                            symbol VARCHAR(255) NOT NULL,
                                            quantity INT NOT NULL,
                                            price NUMERIC(19,2) NOT NULL,
                                            order_type VARCHAR(10) NOT NULL CHECK (order_type IN ('BUY', 'SELL')),
                                            created_at TIMESTAMP NOT NULL
);


INSERT INTO stock_orders (user_id, symbol, quantity, price, order_type, created_at) VALUES
                                                                                        ('user123', 'AAPL', 10, 145.50, 'BUY', NOW()),
                                                                                        ('user123', 'AAPL', 5, 143.75, 'SELL', NOW());





