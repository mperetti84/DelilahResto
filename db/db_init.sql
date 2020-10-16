CREATE TABLE users
(
    user_id int AUTO_INCREMENT NOT NULL,
    user_name varchar(50) NOT NULL,
    full_name varchar(50) NOT NULL,
    email varchar(50) NOT NULL,
    pass varchar(10) NOT NULL,
    address varchar(50) NOT NULL,
    phone int NOT NULL,
    created datetime NOT NULL,
    modified datetime NOT NULL,
    admin boolean NOT NULL,
    active boolean NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE orders
(
    order_id int AUTO_INCREMENT NOT NULL,
    user_id int NOT NULL,
    payment_data_id int NOT NULL,
    state enum('nuevo', 'confirmado', 'preparando', 'enviando', 'cancelado', 'entregado') NOT NULL,
    address varchar(50) NOT NULL,
    created datetime NOT NULL,
    total_cost int NOT NULL,
    PRIMARY KEY (order_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
    FOREIGN KEY (payment_data_id) REFERENCES payment_data (payment_data_id)
);

CREATE TABLE products
(
    product_id int NOT NULL AUTO_INCREMENT,
    title varchar(50) NOT NULL,
    detail varchar(100) NOT NULL,
    price int NOT NULL,
    photo varchar(50),
    created datetime NOT NULL,
    modified datetime NOT NULL,
    PRIMARY KEY (product_id)
);

CREATE TABLE payment_data
(
    payment_data_id int AUTO_INCREMENT NOT NULL,
    user_id int NOT NULL,
    card_type enum("credit", "debit") NOT NULL,
    card_number int NOT NULL,
    exp_date datetime NOT NULL,
    PRIMARY KEY (payment_data_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE favorites_map
(
    user_id int NOT NULL,
    product_id int NOT NULL,
    CONSTRAINT PK_favorites PRIMARY KEY
    (
        user_id,
        product_id
    ),
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (product_id) REFERENCES products (product_id)
);

CREATE TABLE order_products_map
(
    order_id int NOT NULL,
    product_id int NOT NULL,
    quantity int NOT NULL,
    CONSTRAINT PK_OrderProduct PRIMARY KEY
    (
        order_id,
        product_id
    ),
    FOREIGN KEY (order_id) REFERENCES orders (order_id),
    FOREIGN KEY (product_id) REFERENCES products (product_id)
);






