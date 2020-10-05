const express = require("express");
const bodyParser = require("body-parser");

const db = require("./db/mysql_connection")
const middlewares = require("./endpoints/middlewares"); // 

const handlers = require("./endpoints/data_handlers");

// Revisar express.router

const app = express();

app.use(bodyParser.json());

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

// get every users info
app.get("/users", middlewares.verifyAdmin, async (req,res) => {
    try{
        let response = await handlers.usersHandler();
        if(response){
            console.log("Entro en ruta users, lista users: ");
            console.log(response);
            res.status(200).json(response);
        } else{
            throw new Error(response);
        } 
    } catch(err){
            res.status(400).json("Get users error: " + err.message);
    }
});

// get self user info
app.get("/users/check", middlewares.verifyLogged, async (req,res) => {
    try{
        console.log("Entro en get self user info");
        let response = await handlers.oneUserHandler(req.user_id);
        if(response){
            console.log(response);
            res.status(200).json(response);
        } else{
            throw new Error(response);
        }
    } catch(err){
        res.status(400).json("Get self user error: " + err.message);
    }
});

// get a certain user info
app.get("/users/check/:id", middlewares.verifyAdmin, async (req,res) => {
    try{
        let userId = req.params.id;
        console.log("Entro en get self user info");
        let response = await handlers.oneUserHandler(userId);
        if(response){
            console.log(response);
            res.status(200).json(response);
        } else{
            throw new Error(response);
        }
    } catch(err){
        res.status(400).json("Get user error: " + err.message);
    }
});

// modify certain user info
app.put("/users/modify/:id", middlewares.verifyAdmin, async (req,res) => {
    try{
        console.log("Entro en ruta update info (admin): ");
        let userId = req.params.id;
        console.log("User id a cambiar: " + userId);
        let {userName, fullName, email, pass, address, phone} = req.body;
        let response = await handlers.updateUserHandler(userId, userName, fullName, email, pass, address, phone); 
        if(response){
            console.log(response);
            res.status(200).json(response);
        } else{
            throw new Error(response);
        }
    } catch(err){
        res.status(400).json("Update user info error: " + err.message);
    }
});

// modify self user info
app.put("/users/modify", middlewares.verifyLogged, async (req,res) => {
    try{
        console.log("Entro en ruta update self user");
        let {userName, fullName, email, pass, address, phone} = req.body;
        let response = await handlers.updateUserHandler(req.user_id, userName, fullName, email, pass, address, phone); 
        if(response){
            console.log(response);
            res.status(200).json(response);
        } else{
            throw new Error(response);
        }
    } catch(err){
        res.status(400).json("Update self user info error: " + err.message);
    }
});

// sign in endpoint
app.post("/users/sign",middlewares.verifySign, async (req,res) => {
    try{
        let {userName, fullName, email, pass, address, phone} = req.body;
        console.log("Entro en ruta sign");
        let response = await handlers.signHandler(userName, fullName, email, pass, address, phone);
        if(response){
            res.status(200).json(response);
        } else{
            throw new Error(response);
        }
    } catch(err){
            res.status(500).json("Sign in error: " + err.message);
    }
});

// login endpoint
app.post("/users/login", middlewares.verifyLogin, async (req,res) => {
    try{
        console.log("user_id post middleware: " + req.user_id);
        let loginData = await handlers.loginHandler(req.user_id);
        if(loginData){
            console.log("Login response: " + loginData);
            res.status(200).json(loginData);
        } else{
            throw new Error("Login error occured");
        }
    } catch(err) {
        console.log("Login error: " + err);
        res.status(400).json("Login error: " + err.message)
    }
});

// get all orders
app.get("/orders", middlewares.verifyAdmin, async (req,res) => {
    try{
        let response = await handlers.ordersHandler();
        if(response){
            console.log("Entro en ruta orders, lista orders: ");
            console.log(response);
            res.status(200).json(response);
        } else{
            throw new Error(response);
        } 
    } catch(err){
            res.status(400).json("Get orders error: " + err.message);
    }
});

// get certain user's order by user id
app.get("/orders/check/:id", middlewares.verifyAdmin , async (req,res) => {
    try{
        let userId = req.params.id;
        let response = await handlers.ordersHandler(userId);
        if(response){
            console.log("Entro en ruta orders, lista orders: ");
            console.log(response);
            res.status(200).json(response);
        } else{
            throw new Error(response);
        } 
    } catch(err){
            res.status(400).json("Get orders error: " + err.message);
    }
});

// get self active orders
app.get("/orders/check/", middlewares.verifyLogged , async (req,res) => {
    try{
        let userId = req.user_id;
        let response = await handlers.activeOrdersHandler(userId);
        if(response){
            console.log("Entro en ruta orders, lista orders: ");
            console.log(response);
            res.status(200).json(response);
        } else{
            throw new Error(response);
        } 
    } catch(err){
            res.status(400).json("Get orders error: " + err.message);
    }
});

// modify certain user's order by order id
app.put("/orders/:orderId", middlewares.verifyAdmin, async (req,res) => {
    try{
        console.log("Entro en ruta update order (admin): ");
        let orderId = req.params.orderId;
        console.log("Order id a cambiar: " + orderId);
        let {state} = req.body;
        let response = await handlers.updateOrderHandler(orderId, state); 
        if(response){
            console.log(response);
            res.status(200).json(response);
        } else{
            throw new Error(response);
        }
    } catch(err){
        res.status(400).json("Update order info error: " + err.message);
    }
});

app.post("/orders/add", (req,res) => {

});

app.get("/products", (req,res) => {

});

app.post("/products/add", (req,res) => {

});

app.get("/products/id", (req,res) => {

});

app.put("/products/id", (req,res) => {

});

