show databases;

use portfolio_db;

show tables;

create table user (
	id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    name VARCHAR(30) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    verified BOOLEAN DEFAULT TRUE,
    created_at DATETIME NOT NULL
);

CREATE TABLE portfolio (
	id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    
    CONSTRAINT fk_portfolio_user
		FOREIGN KEY (user_id)
        REFERENCES user(id)
        ON DELETE CASCADE
);

CREATE TABLE holdings (
	id INT AUTO_INCREMENT PRIMARY KEY,
    portfolio_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity DECIMAL(12,4) NOT NULL,
    purchase_price DECIMAL(12,2) NOT NULL,
    purchase_date DATE NOT NULL,
    
    constraint fk_holdings_portfolio
		FOREIGN KEY (portfolio_id)
        REFERENCES portfolio(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_user_email ON user(email);
CREATE INDEX idx_portfolio_userid ON portfolio(user_id);
CREATE INDEX idx_holdings_portfolioid ON holdings(portfolio_id);

DESC user;
DESC portfolio;
DESC holdings;

SELECT * FROM user;
SELECT * FROM portfolio;
SELECT * FROM holdings;

ALTER TABLE holdings
ADD type VARCHAR(50) NOT NULL;