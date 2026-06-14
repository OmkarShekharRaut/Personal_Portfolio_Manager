CREATE DATABASE IF NOT EXISTS portfolio_db;

USE portfolio_db;

CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    name VARCHAR(30) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    verified BOOLEAN DEFAULT TRUE,
    created_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS portfolio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,

    CONSTRAINT fk_portfolio_user
        FOREIGN KEY (user_id)
        REFERENCES user(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS holdings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    portfolio_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    quantity DECIMAL(12,4) NOT NULL,
    purchase_price DECIMAL(12,2) NOT NULL,
    purchase_date DATE NOT NULL,

    CONSTRAINT fk_holdings_portfolio
        FOREIGN KEY (portfolio_id)
        REFERENCES portfolio(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_email
    ON user(email);

CREATE INDEX IF NOT EXISTS idx_portfolio_userid
    ON portfolio(user_id);

CREATE INDEX IF NOT EXISTS idx_holdings_portfolioid
    ON holdings(portfolio_id);