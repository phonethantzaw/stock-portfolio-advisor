CREATE TABLE IF NOT EXISTS stock_orders (
                                            id SERIAL PRIMARY KEY,
                                            user_id VARCHAR(50) NOT NULL,
                                            symbol VARCHAR(10) NOT NULL,
                                            quantity INTEGER NOT NULL,
                                            price DECIMAL(10,2) NOT NULL,
                                            order_type VARCHAR(4) NOT NULL CHECK (order_type IN ('BUY', 'SELL')),
                                            created_at TIMESTAMP NOT NULL
);


INSERT INTO stock_orders (user_id, symbol, quantity, price, order_type, created_at) VALUES
                                                                                        ('user123', 'AAPL', 10, 145.50, 'BUY', NOW()),
                                                                                        ('user123', 'AAPL', 5, 143.75, 'SELL', NOW()),
                                                                                        ('user123', 'GOOGL', 8, 2800.25, 'BUY', NOW()),
                                                                                        ('user123', 'AMZN', 12, 3500.99, 'BUY', NOW()),
                                                                                        ('user123', 'AAPL', 3, 3490.75, 'SELL', NOW()),
                                                                                        ('user123', 'MSFT', 20, 310.10, 'BUY', NOW());





