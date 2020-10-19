// import external modules
const express = require("express");
const bodyParser = require("body-parser");

// import local configuration module
const db = require("./db/mysql_connection");

// import endpoints
const users = require("./endpoints/users");
const orders = require("./endpoints/orders");
const products = require("./endpoints/products");


const app = express();

// initialize DB
db.init()
.then(async () => {
    console.log('DB connected');
    
    // Only if DB was started correctly, start server 
    app.listen(3000,() => {
        console.log("Servidor iniciado");
    });

}).catch((err) => {
	console.log('Error al conectar a la db', err);
});


app.use(bodyParser.json());

app.use(function(err, req, res, next) {
    // function to catch errors from body-parser due to wrong JSON syntax in request body 
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        res.status(400).send({ code: 400, message: "Bad request. Check JSON syntax" });
    } else next();
});

// use "Users" endpoints
app.use("/users", users);

// use "Orders" endpoints
app.use("/orders", orders);

// use "Products" endpoints
app.use("/products", products);






