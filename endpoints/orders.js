const express = require('express');
const middlewares = require("../services/middlewares");
const handlers = require("../services/data_handlers");

const router = express.Router();

// get all orders
router.get("/", middlewares.verifyAdmin, async (req,res) => {
    try{
        let response = await handlers.ordersHandler();
        if(response){
            res.status(200).json(response);
        } else{
            throw new Error(response);
        } 
    } catch(err){
            res.status(400).json("Get orders error: " + err.message);
    }
});

// get certain user's order by order id
router.get("/check/:orderId", middlewares.verifyAdmin , async (req,res) => {
    try{
        let orderId = req.params.orderId;
        let response = await handlers.ordersHandler(orderId);
        if(response){
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
        let orderId = req.params.orderId;
        let {state} = req.body;
        let response = await handlers.updateOrderHandler(orderId, state); 
        if(response){
            res.status(200).json(response);
        } else{
            throw new Error(response);
        }
    } catch(err){
        res.status(400).json("Update order info error: " + err.message);
    }
});

// delete certain user's order by order id
router.put("/delete/:orderId", middlewares.verifyAdmin, async (req,res) => {
    try{
        let orderId = req.params.orderId;
        let response = await handlers.deleteOrderHandler(orderId); 
        if(response){
            res.status(200).json(response);
        } else{
            throw new Error(response);
        }
    } catch(err){
        res.status(400).json("Delete order error: " + err.message);
    }
});

// place new order
router.post("/", middlewares.verifyLogged ,async (req,res) => {
    try{
        // detail: array of [{productId,quantity}]; secCode: 3 digits of security code
        let {detail, paymentType, paymentId, secCode, address} = req.body;
         // response: detail, costo total, estado
        let response = await handlers.addOrderHandler(req.user_id, detail, paymentType, paymentId, secCode, address);
        if(response){
            res.status(200).json(response);
        } else{
            throw new Error(response);
        }
    } catch(err){
            res.status(500).json("Place order error: " + err.message);
    }
});

module.exports = router;