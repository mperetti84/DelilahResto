const express = require("express");
const bodyParser = require("body-parser");


const db = require("./db/mysql_connection")
const middlewares = require("./rutas/middlewares"); // 

const {verifySign} = require("./rutas/middlewares");
const handlers = require("./rutas/data_handlers");

// Revisar express.router

const app = express();

app.use(bodyParser.json());

db.init()
.then(async () => {
	// forma 1
    console.log('DB connected');
    
    // START SERVER
    app.listen(3000,() => {
        console.log("Servidor iniciado");
    });

}).catch((err) => {
	console.log('Error al conectar a la db', err);
});


app.use(bodyParser.json());

app.get("/users", middlewares.verifyAdmin, (req,res) => {
    
});

app.get("/users/:id", (req,res) => {

});

app.put("/users/:id", (req,res) => {

});

app.post("/users/sign", verifySign, async (req,res) => {
    try{
        const {userName, fullName, email, pass, address, phone} = req.body;
        console.log("Entro en ruta sign");
        const signData = await handlers.signHandler(userName, fullName, email, pass, address, phone);
        if(signData){
            res.status(200).json(signData);
        } else{
            throw new Error("Sign in error occured");
        }
    } catch(err){
            res.status(500).json("Sign in error: " + err.message);
    }
});

app.post("/users/login", middlewares.verifyLogin, async (req,res) => {
    try{
        console.log("user_id post middleware: " + req.user_id);
        const loginData = await handlers.loginHandler(req.user_id);
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

app.get("/orders", (req,res) => {

});

app.get("/orders/:id", (req,res) => {

});

app.put("/orders/:id", (req,res) => {

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

