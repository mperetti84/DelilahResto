const express = require('express');
const middlewares = require("./services/middlewares");
const handlers = require("./services/data_handlers");

const router = express.Router();

// get all orders
router.get("/", middlewares.verifyAdmin, async (req,res) => {
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
router.get("/check/:id", middlewares.verifyAdmin , async (req,res) => {
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
router.get("/check", middlewares.verifyLogged , async (req,res) => {
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
router.put("/:orderId", middlewares.verifyAdmin, async (req,res) => {
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

router.post("/", middlewares.verifyLogged ,async (req,res) => {
    try{
        // detail: array of [{productId,quantity}]; secCode: 3 digits of security code
        let {detail, paymentId, secCode, address} = req.body;
        console.log("Entro en ruta crear orden: ");
        console.log(detail[0]);
         // response: detail, costo total, estado
        let response = await handlers.addOrderHandler(req.user_id, detail, paymentId, secCode, address);
        if(response){
            res.status(200).json(response);
        } else{
            throw new Error(response);
        }
    } catch(err){
            res.status(500).json("Sign in error: " + err.message);
    }
});

module.exports = router;