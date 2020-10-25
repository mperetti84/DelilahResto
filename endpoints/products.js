const express = require('express');
const middlewares = require("../services/middlewares");
const handlers = require("../services/data_handlers");

const router = express.Router();

// get products list
router.get("/", async (req,res) => {
    try{
        let response = await handlers.productsHandler();
        if(response){
            res.status(200).json(response);
        } else{
            throw new Error(response);
        } 
    } catch(err){
            res.status(400).json("Get products error: " + err.message);
    }
});

// get one product information
router.get("/:id", async (req,res) => {
    try{
        let productId = req.params.id;
        let response = await handlers.productsHandler(productId);
        if(response){
            res.status(200).json(response);
        } else{
            throw new Error(response);
        } 
    } catch(err){
            res.status(400).json("Get product info error: " + err.message);
    }
});

// from this point on verify that an Admin is calling this endpoint
router.use(middlewares.verifyAdmin);

// create new product
router.post("/", async (req,res) => {
    try{
        let {title, detail, price, photo} = req.body;
        let response = await handlers.addProductHandler(title, detail, price, photo);
        if(response){
            res.status(200).json(response);
        } else{
            throw new Error(response);
        } 
    } catch(err){
            res.status(400).json("Add new product error: " + err.message);
    }
});

// modify certain product information
router.put("/:id", async (req,res) => {
    try{
        let {title, detail, price, photo} = req.body;
        let productId = req.params.id;
        let response = await handlers.updateProductHandler(title, detail, price, photo, productId);
        if(response){
            res.status(200).json(response);
        } else{
            throw new Error(response);
        } 
    } catch(err){
            res.status(400).json("Update product information error: " + err.message);
    }
});

// delete product endpoint: does not delete from table, only changes active field to "false"
router.put("/delete/:id", async (req,res) => {
    try{
        let productId = req.params.id;
        let response = await handlers.deleteProductHandler(productId);
        if(response){
            res.status(200).json(response);
        } else{
            throw new Error(response);
        }
    } catch(err){
            res.status(500).json("Delete product error: " + err.message);
    }
});

module.exports = router;