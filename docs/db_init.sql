-- Paso 1: eliminar BD existente
DROP DATABASE IF EXISTS delilah_resto_db;

-- Paso 2: crear base de datos 
CREATE DATABASE delilah_resto_db;

-- Paso 3: creacion de tablas
USE delilah_resto_db;

CREATE TABLE users
(
    user_id int AUTO_INCREMENT NOT NULL,
    user_name varchar(50) NOT NULL,
    full_name varchar(50) NOT NULL,
    email varchar(50) NOT NULL,
    pass varchar(10) NOT NULL,
    address varchar(50) NOT NULL,
    phone varchar(15) NOT NULL,
    created datetime NOT NULL,
    modified datetime,
    admin boolean NOT NULL,
    active boolean NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE payment_data
(
    payment_data_id int AUTO_INCREMENT NOT NULL,
    user_id int NOT NULL,
    card_type enum("credit", "debit") NOT NULL,
    card_number int NOT NULL,
    sec_code int NOT NULL,
    exp_date datetime NOT NULL,
    PRIMARY KEY (payment_data_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE orders
(
    order_id int AUTO_INCREMENT NOT NULL,
    user_id int NOT NULL,
    payment_data_id int,
    state enum('nuevo', 'confirmado', 'preparando', 'enviando', 'cancelado', 'entregado') NOT NULL,
    address varchar(50) NOT NULL,
    created datetime NOT NULL,
    payment_type enum('cash', 'credit', 'debit') NOT NULL,
    total_cost int NOT NULL,
    active boolean NOT NULL,
    PRIMARY KEY (order_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id),
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
    modified datetime,
    active boolean NOT NULL,
    PRIMARY KEY (product_id)
);

CREATE TABLE favorites_map
(
    favorite_id int AUTO_INCREMENT NOT NULL,
    user_id int NOT NULL,
    product_id int NOT NULL,
    PRIMARY KEY (favorite_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (product_id) REFERENCES products (product_id)
);

CREATE TABLE order_products_map
(
    order_id int NOT NULL,
    product_id int NOT NULL,
    quantity int NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (order_id),
    FOREIGN KEY (product_id) REFERENCES products (product_id)
);

-- Paso 4: Insertar datos de usuarios en tabla users
INSERT INTO `products` (`title`,`detail`,`price`,`photo`,`created`,`modified`,`active`) VALUES ("POLLO A LA PARMESANA","Donec dignissim magna a tortor. Nunc commodo auctor velit. Aliquam","248","Sociis LLP","2020-09-03 20:14:13",NULL,"1");
INSERT INTO `products` (`title`,`detail`,`price`,`photo`,`created`,`modified`,`active`) VALUES ("MASALA DOSA","ac urna. Ut tincidunt vehicula risus. Nulla eget metus eu","234","Lorem Ac LLP","2021-07-05 18:42:24",NULL,"1");
INSERT INTO `products` (`title`,`detail`,`price`,`photo`,`created`,`modified`,`active`) VALUES ("PAELLA DE MARISCOS","Integer in magna. Phasellus dolor elit, pellentesque a, facilisis non,","253","Tristique Associates","2020-04-17 00:14:41",NULL,"1");
INSERT INTO `products` (`title`,`detail`,`price`,`photo`,`created`,`modified`,`active`) VALUES ("SOM TAM","erat volutpat. Nulla dignissim. Maecenas ornare egestas ligula. Nullam feugiat","200","Integer Tincidunt Industries","2020-04-08 00:36:15",NULL,"1");
INSERT INTO `products` (`title`,`detail`,`price`,`photo`,`created`,`modified`,`active`) VALUES ("ARROZ CON POLLO","erat, eget tincidunt dui augue eu tellus. Phasellus elit pede,","275","Feugiat Nec Diam LLP","2020-07-29 21:08:18",NULL,"1");
INSERT INTO `products` (`title`,`detail`,`price`,`photo`,`created`,`modified`,`active`) VALUES ("POUTINE","Cras eget nisi dictum augue malesuada malesuada. Integer id magna","290","Vel Limited","2020-09-05 21:19:08",NULL,"1");
INSERT INTO `products` (`title`,`detail`,`price`,`photo`,`created`,`modified`,`active`) VALUES ("TACOS","ultricies adipiscing, enim mi tempor lorem, eget mollis lectus pede","227","Convallis Est Corp.","2020-10-29 21:00:47",NULL,"1");
INSERT INTO `products` (`title`,`detail`,`price`,`photo`,`created`,`modified`,`active`) VALUES ("TOFU APESTOSO","Mauris magna. Duis dignissim tempor arcu. Vestibulum ut eros non","283","At Libero Corporation","2020-02-07 12:33:36",NULL,"1");
INSERT INTO `products` (`title`,`detail`,`price`,`photo`,`created`,`modified`,`active`) VALUES ("CANGREJO PICANTE","Suspendisse sed dolor. Fusce mi lorem, vehicula et, rutrum eu,","274","Ullamcorper PC","2021-02-10 07:09:18",NULL,"1");
INSERT INTO `products` (`title`,`detail`,`price`,`photo`,`created`,`modified`,`active`) VALUES ("PESCADO CON PAPAS","Phasellus libero mauris, aliquam eu, accumsan sed, facilisis vitae, orci.","287","Cum Sociis Natoque Incorporated","2021-02-04 11:09:40",NULL,"1");

-- Paso 5: Insertar datos de productos en tabla products
INSERT INTO `users` (`user_name`,`full_name`,`email`,`pass`,`address`,`phone`,`created`,`modified`,`admin`,`active`) VALUES ("Sybill","Elliot Vargas","est.tempor@Nullamscelerisque.edu",4989,"960-4162 Laoreet Rd.","0800 358733","2021-05-02 02:43:04",NULL,"0","1");
INSERT INTO `users` (`user_name`,`full_name`,`email`,`pass`,`address`,`phone`,`created`,`modified`,`admin`,`active`) VALUES ("Kyla","Yazmin Morales","dapibus.rutrum@vehiculaPellentesque.net",9074,"919-8972 Rhoncus Ave","(01696) 249832","2020-05-19 03:21:34",NULL,"1","1");
INSERT INTO `users` (`user_name`,`full_name`,`email`,`pass`,`address`,`phone`,`created`,`modified`,`admin`,`active`) VALUES ("Valentine","Paloma Ortiz","Cras.dictum.ultricies@Curabitursedtortor.com",7908,"P.O. Box 303, 2241 A, Street","(021) 0484 5522","2021-07-11 15:43:34",NULL,"0","1");
INSERT INTO `users` (`user_name`,`full_name`,`email`,`pass`,`address`,`phone`,`created`,`modified`,`admin`,`active`) VALUES ("Kirestin","Alén Carvajal","et@sitametlorem.org",5082,"6914 Ipsum Av.","0388 695 8545","2020-02-07 20:18:45",NULL,"1","1");
INSERT INTO `users` (`user_name`,`full_name`,`email`,`pass`,`address`,`phone`,`created`,`modified`,`admin`,`active`) VALUES ("Tucker","Selene Bustos","adipiscing@mollisduiin.org",1210,"P.O. Box 177, 926 Interdum Avenue","(01455) 01558","2021-05-25 17:13:26",NULL,"0","1");
INSERT INTO `users` (`user_name`,`full_name`,`email`,`pass`,`address`,`phone`,`created`,`modified`,`admin`,`active`) VALUES ("Nerea","Tarek Cárdenas","lorem.eget.mollis@Aenean.edu",1402,"Ap #906-1552 Consectetuer Rd.","0800 595 8369","2020-02-06 14:42:40",NULL,"1","1");
INSERT INTO `users` (`user_name`,`full_name`,`email`,`pass`,`address`,`phone`,`created`,`modified`,`admin`,`active`) VALUES ("Tanisha","Estefano Navarro","rhoncus.id@perinceptos.co.uk",1757,"P.O. Box 404, 6208 Sem Road","0803 711 1680","2020-05-05 10:12:02",NULL,"0","1");
INSERT INTO `users` (`user_name`,`full_name`,`email`,`pass`,`address`,`phone`,`created`,`modified`,`admin`,`active`) VALUES ("Amery","Antony Moreno","sem.Pellentesque@consequatpurus.net",1966,"Ap #196-690 Aliquet Ave","(0131) 885 1785","2021-10-12 10:03:08",NULL,"0","1");
INSERT INTO `users` (`user_name`,`full_name`,`email`,`pass`,`address`,`phone`,`created`,`modified`,`admin`,`active`) VALUES ("Trevor","Cathalina Vega","lorem.eu.metus@cursus.org",4912,"138-6053 Sed, Rd.","07624 470064","2021-10-11 16:51:39",NULL,"1","1");
INSERT INTO `users` (`user_name`,`full_name`,`email`,`pass`,`address`,`phone`,`created`,`modified`,`admin`,`active`) VALUES ("Adrienne","Emilie Sepúlveda","rutrum@Maecenas.com",1009,"3393 Lorem Av.","(016977) 7715","2020-02-18 12:20:42",NULL,"0","1");
INSERT INTO `users` (`user_name`,`full_name`,`email`,`pass`,`address`,`phone`,`created`,`modified`,`admin`,`active`) VALUES ("Nero","Esmeralda Romero","Phasellus.ornare@pretium.net",1299,"Ap #152-1171 Bibendum. St.","076 2275 9576","2021-06-23 10:51:52",NULL,"0","1");
INSERT INTO `users` (`user_name`,`full_name`,`email`,`pass`,`address`,`phone`,`created`,`modified`,`admin`,`active`) VALUES ("Kylee","Logan Sáez","amet.risus.Donec@ametconsectetuer.net",3932,"224-8739 Aliquet Street","07624 425991","2020-08-01 18:05:37",NULL,"0","1");
INSERT INTO `users` (`user_name`,`full_name`,`email`,`pass`,`address`,`phone`,`created`,`modified`,`admin`,`active`) VALUES ("Harper","Fernando González","lorem.ac@nasceturridiculusmus.co.uk",8889,"4060 Aliquet, Ave","(0151) 004 2475","2021-08-11 11:33:46",NULL,"0","1");




