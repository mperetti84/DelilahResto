const queries = require("../db/queries");
const jwt = require("jsonwebtoken");
const privateKey = "mperetti-DelilahResto";
const moment = require("moment");



const signHandler = async (userName, fullName, email, pass, address, phone) => {
    console.log("Entro en handler sign");
    // agregar fecha a created
    const actualTime = moment().format("YYYY-MM-DD HH:mm:ss");
    console.log("Datetime de creacion de usuario: " + actualTime);
    const newId = await queries.insertQuery("users",["user_name","email","pass","phone","full_name","address","created","admin","active"],[userName,email,pass,phone,fullName,address,actualTime,false,true]);
    const products = await queries.selectQuery("products",["*"],[],[]);
    if(newId && products){
        console.log("Rta query sign: " + newId);
        console.log(products);
        const tokenData = {user_id:newId, admin: false};
        const token = jwt.sign(tokenData, privateKey);
        console.log("Token: " + token);
        const signData = {products: products, token: token};
        return signData;
    } else {
        throw new Error("Sign in error");
    }
    
}

const loginHandler = async (userId) => {
    console.log("Entro en login handler: ");
    // get list of all products
    const products = await queries.selectQuery("products",["*"],[],[]);
    // get user's favs
    const favorites = await queries.selectFavorites(userId);
    // get user's active orders
    const activeOrders = await queries.selectActiveOrders(userId);
    // get user admin status
    const isAdmin = await queries.selectQuery("users", ["admin"],["user_id"],[userId]);
    // generate object with logged user info and create token
    const tokenInfo = {user_id: userId, admin: Boolean(isAdmin[0].admin)};
    console.log(tokenInfo);
    const token = jwt.sign(tokenInfo, privateKey);
    // build login data object
    let loginData = {products: products, favorites: favorites, activeOrders: activeOrders, token: token};

    console.log("Login data:");
    console.log(loginData);

    return loginData;
}

const usersHandler = async () => {
    console.log("Entro en users handler");
    // only get users that don't have admin privileges
    const userList = await queries.selectQuery("users", ["*"],["admin"],[false]);
    if(userList){
        console.log("Users list:");
        console.log(userList);
        return userList;
    } else{
        throw new Error("Get users error");
    }
}

const oneUserHandler = async (userId) => {
    console.log("Entro en users handler");
    // get user info
    const userInfo = await queries.selectQuery("users", ["user_name","full_name","email","pass","address","phone"],["user_id"],[userId]);
    if(userInfo){
        console.log("Users list:");
        console.log(userInfo);
        return userInfo;
    } else{
        throw new Error("Get user info error");
    }
}

const updateUserHandler = async (userId, userName, fullName, email, pass, address, phone) => {
    console.log("Entro en update user handler");
    // used to verify that new email is not taken by other user
    let emailExists = await queries.selectQuery("users", ["user_id"],["email"],[email]);
    let nameExists = await queries.selectQuery("users", ["user_id"],["user_name"],[userName]);
    // used to verify that user to update actually exists
    let userExists = await queries.selectQuery("users", ["user_name"],["user_id"],[userId]);
    // initiate valid flag
    let valid = false;
    if(emailExists.length > 0 || nameExists.length > 0){
        console.log("Email exists or has elements, user id: " + emailExists[0].user_id + " nuevo user id: " + userId);
        if(emailExists.length > 0){
            // if email to write exists, verify that it belongs to same user
            if(emailExists[0].user_id == userId){
                valid = true;
            } else{
                throw new Error("Email is taken");
            }
        } 
        if(nameExists.length > 0){
            // if user name to write exists, verify that it belongs to same user
            if(nameExists[0].user_id == userId){
                valid = true;
            } else{
                valid = false;
                throw new Error("User name is taken");
            }
        }
    } else{
        console.log("Email no existe, pasa a actualizar");
        valid = true;
    }
    // only proceed to update user info if email does not exists, or it belongs to same user and user id to update is in the users table 
    if(valid && userExists.length > 0){
        console.log("Entro a if de update");
        // get user modification datetime 
        let actualTime = moment().format("YYYY-MM-DD HH:mm:ss");
        // execute udpdate info
        let updateDone = await queries.updateQuery("users",["user_name","full_name","email","pass","address","phone","modified"],[userName,fullName, email, pass, address, phone, actualTime],["user_id"],[userId]);
        console.log(updateDone);
        console.log("Se actualizo usuario y busco datos actuales");
        // get user info after updating
        let updatedInfo = await queries.selectQuery("users", ["user_name","full_name","email","pass","address","phone"],["user_id"],[userId]);
        console.log(updatedInfo[0]);
        return updatedInfo[0];
    } else{
        console.log("Usuario no encontrado");
        throw new Error("User not found");
    }
} 

const ordersHandler = async (userId) => {
    console.log("Entro en orders handler");
    const ordersList = await queries.selectOrders(userId);
    if(ordersList.length > 0){
        console.log("Order list:");
        console.log(ordersList);
        return ordersList;
    } else{
        throw new Error("No orders found");
    }
}

const activeOrdersHandler = async (userId) => {
    console.log("Entro en active orders handler");
    const ordersList = await queries.selectActiveOrders(userId);
    if(ordersList.length > 0){
        console.log("Order list:");
        console.log(ordersList);
        return ordersList;
    } else{
        throw new Error("No orders found");
    }
}

const updateOrderHandler = async (orderId, state) => {
    console.log("Entro en update order handler");
    const orderExists = await queries.selectQuery("orders", ["state"],["order_id"],[orderId]);
    if(orderId && state){
        if(orderExists){
            const response = await queries.updateQuery("orders",["state"],[state],["order_id"],[orderId]);
            const updatedOrder = await queries.selectQuery("orders", ["*"],["order_id"],[orderId]);
            console.log("Updated order:");
            console.log(updatedOrder);
            return updatedOrder;
        } else{
            throw new Error("Order not found");
        }
    } else{
        throw new Error("Order ID and order state are mandatory");
    }
}

// manage place new order logic.
const addOrderHandler = async (userId, detail, paymentId, secCode, address) => {
    // comparar secCode con codigo de tabla de payment methods, si es ok seguir
    console.log("Entro en add order handler");
    // get security code of card
    const tableSecCode = await queries.selectQuery("payment_data",["sec_code"],["payment_data_id"],[paymentId]);
    console.log(detail);
    if(tableSecCode[0].sec_code == secCode){
        // obtener costos de productos de detail y calcular costo total de orden
        let totalCost = 0;
        let productCost;
        console.log(detail.length);
        for (const element of detail){
            productCost = await queries.selectQuery("products",["price"],["product_id"],[element.productId]);
            totalCost = totalCost + (productCost[0].price * element.quantity);
            console.log("Precio producto: " + productCost[0].price + ", cantidad: " + element.quantity + ", precio total acumulado: " + totalCost);
        }
        // insertar orden en table orders, agregar estado nuevo, costo total y fecha de creacion
        const actualTime = moment().format("YYYY-MM-DD HH:mm:ss");
        const orderId = await queries.insertQuery("orders",["user_id","state","address","total_cost","created","payment_data_id"],[userId,"nuevo",address,totalCost,actualTime,paymentId]);
        // insertar order id, product id y cantidad en tabla order_products_map
        for (const element of detail){
            let response = await queries.insertQuery("order_products_map",["order_id","product_id","quantity"],[orderId,element.productId,element.quantity]);
        }
        const placedOrder = await queries.selectOrders(userId,orderId); // ****** ORGANIZAR EN UN UNICO OBJETO, METER DETALLES EN UN ARRAY "DETAIL" COMO PIDEN LAS IMAGENES
        return placedOrder;
        // devolver detail, costo total y estado
    } else{
        throw new Error("Wrong security code");
    }
    
}

const addPaymentInfo = async (userId,cardType,cardNumber,secCode,expDate) => {
    const paymentId = await queries.insertQuery("payment_data",["user_id","card_type","card_number","sec_code","exp_date"],[userId,cardType,cardNumber,secCode,expDate]);
    if (paymentId){
        const newPaymentInfo = await queries.selectQuery("payment_data",["card_type","exp_date"],["payment_data_id"],[paymentId]);
        return newPaymentInfo[0];
    } else{
        throw new Error("Add new payment info error");
    } 
}



module.exports = {signHandler, loginHandler, usersHandler, oneUserHandler, updateUserHandler, ordersHandler, activeOrdersHandler, updateOrderHandler, addOrderHandler, addPaymentInfo, jwt, privateKey};