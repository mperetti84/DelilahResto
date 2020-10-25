const express = require('express');
const middlewares = require("../services/middlewares");
const handlers = require("../services/data_handlers");

const router = express.Router();

// get every users info
router.get("/", middlewares.verifyAdmin, async (req,res) => {
    try{
        let response = await handlers.usersHandler();
        if(response){
            res.status(200).json(response);
        } else{
            throw new Error(response);
        } 
    } catch(err){
            res.status(400).json("Get users error: " + err.message);
    }
});

// get self user info
router.get("/check", middlewares.verifyLogged, async (req,res) => {
    try{
        let response = await handlers.oneUserHandler(req.user_id);
        if(response){
            res.status(200).json(response);
        } else{
            throw new Error(response);
        }
    } catch(err){
        res.status(400).json("Get self user error: " + err.message);
    }
});

// get a certain user info
router.get("/check/:id", middlewares.verifyAdmin, async (req,res) => {
    try{
        let userId = req.params.id;
        let response = await handlers.oneUserHandler(userId);
        if(response){
            res.status(200).json(response);
        } else{
            throw new Error(response);
        }
    } catch(err){
        res.status(400).json("Get user error: " + err.message);
    }
});

// modify certain user info
router.put("/modify/:id", middlewares.verifyAdmin, async (req,res) => {
    try{
        let userId = req.params.id;
        let {userName, fullName, email, pass, address, phone} = req.body;
        let response = await handlers.updateUserHandler(userId, userName, fullName, email, pass, address, phone); 
        if(response){
            res.status(200).json(response);
        } else{
            throw new Error(response);
        }
    } catch(err){
        res.status(400).json("Update user info error: " + err.message);
    }
});

// modify self user info
router.put("/modify", middlewares.verifyLogged, async (req,res) => {
    try{
        let {userName, fullName, email, pass, address, phone} = req.body;
        let response = await handlers.updateUserHandler(req.user_id, userName, fullName, email, pass, address, phone); 
        if(response){
            res.status(200).json(response);
        } else{
            throw new Error(response);
        }
    } catch(err){
        res.status(400).json("Update self user info error: " + err.message);
    }
});

// sign in endpoint
router.post("/sign",middlewares.verifySign, async (req,res) => {
    try{
        let {userName, fullName, email, pass, address, phone} = req.body;
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
router.post("/login", middlewares.verifyLogin, async (req,res) => {
    try{
        let loginData = await handlers.loginHandler(req.user_id);
        if(loginData){
            res.status(200).json(loginData);
        } else{
            throw new Error("Login error occured");
        }
    } catch(err) {
        res.status(400).json("Login error: " + err.message)
    }
});

// add new payment method endpoint (agregar a tabla orders FK faltante ID metodo de pago)
router.post("/addPaymentMethod", middlewares.verifyLogged, async (req,res) => {
    try{
        let {cardType,cardNumber,secCode,expDate} = req.body;
        let response = await handlers.addPaymentInfo(req.user_id,cardType,cardNumber,secCode,expDate);
        res.status(200).json(response);
    } catch(err){
        res.status(400).json("Add payment info error: " + err.message);
    }
});

// delete user endpoint: does not delete from table, only changes active field to "false"
router.put("/delete/:id", middlewares.verifyAdmin, async (req,res) => {
    try{
        let userId = req.params.id;
        let response = await handlers.deleteUserHandler(userId);
        if(response){
            res.status(200).json(response);
        } else{
            throw new Error(response);
        }
    } catch(err){
            res.status(500).json("Delete user error: " + err.message);
    }
});

module.exports = router;