// import modules
const queries = require("../db/queries");
const jwt = require("jsonwebtoken");
const moment = require("moment");

// JWT config constants
const privateKey = "mperetti-DelilahResto";
const expTime = {expiresIn: '5h'};

// manage sign in information, add new user to users table, send product list, send user's session token
const signHandler = async (userName, fullName, email, pass, address, phone) => {
    console.log("Entro en handler sign");
    const actualTime = moment().format("YYYY-MM-DD HH:mm:ss");
    console.log("Datetime de creacion de usuario: " + actualTime);
    const newId = await queries.insertQuery("users",["user_name","email","pass","phone","full_name","address","created","admin","active"],[userName,email,pass,phone,fullName,address,actualTime,false,true]);
    const products = await queries.selectQuery("products",["*"],["active"],[true]);
    if(newId && products){
        console.log("Rta query sign: " + newId);
        console.log(products);
        const tokenData = {user_id:newId, admin: false};
        const token = jwt.sign(tokenData, privateKey, expTime);
        console.log("Token: " + token);
        const signData = {products: products, token: token};
        return signData;
    } else {
        throw new Error("Sign in error");
    }
}

// manage login information, send products list and user's favorites and user's session token
const loginHandler = async (userId) => {
    console.log("Entro en login handler: ");
    // get list of all active products
    const products = await queries.selectQuery("products",["*"],["active"],[true]);
    // get user's favs
    const favorites = await queries.selectFavorites(userId);
    // get user admin status
    const isAdmin = await queries.selectQuery("users", ["admin"],["user_id"],[userId]);
    // get user's available payment data
    const paymentId = await queries.selectQuery("payment_data",["payment_data_id"],["user_id"],[userId]);
    // generate object with logged user info and create token
    const tokenInfo = {user_id: userId, admin: Boolean(isAdmin[0].admin)};
    console.log(tokenInfo);
    const token = jwt.sign(tokenInfo, privateKey, expTime);
    // build login data object
    let loginData = {products: products, favorites: favorites, paymentId: paymentId, token: token};

    console.log("Login data:");
    console.log(loginData);

    return loginData;
}

// manage get all users information
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

// manage delete user logic
const deleteUserHandler = async (userId) => {
    console.log("Entro en users handler");
    // update active field to false
    const response = await queries.updateQuery("users", ["active"],[false],["user_id"],[userId]);
    if(response){
        console.log("Users deleted:");
        console.log(response);
        return `User with user_id: ${userId} deleted succesfully`;
    } else{
        throw new Error("Delete user error");
    }
}

// manage get self user information
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

// manage information to update user's data, check if user name or email are already taken
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

// manage get all orders information
const ordersHandler = async (orderId) => {
    console.log("Entro en orders handler");
    const ordersList = await queries.selectOrders(orderId);
    if(ordersList.length > 0){
        console.log("Order list:");
        let ordersArray = arrangeOrderObject(ordersList, true);
        return ordersArray;
    } else{
        throw new Error("No orders found");
    }
}

// manage information to get user's active orders (state != "entregado" or "cancelado")
const activeOrdersHandler = async (userId) => {
    console.log("Entro en active orders handler");
    const ordersList = await queries.selectActiveOrders(userId);
    if(ordersList.length > 0){
        console.log("Order list:");
        console.log(ordersList);
        let activeOrdersArr = arrangeOrderObject(ordersList, false);
        return activeOrdersArr;
    } else{
        throw new Error("No orders found");
    }
}

// manage information to update a user's order
const updateOrderHandler = async (orderId, state) => {
    console.log("Entro en update order handler");
    const orderExists = await queries.selectQuery("orders", ["state","user_id"],["order_id"],[orderId]);
    if(orderId && state){
        if(orderExists.length > 0){
            const response = await queries.updateQuery("orders",["state"],[state],["order_id"],[orderId]);
            // const updatedOrder = await queries.selectQuery("orders", ["*"],["order_id"],[orderId]);
            // const userId = orderExists[0].user_id;
            const updatedOrder = await queries.selectOrders(orderId);
            let updatedOrderObj = arrangeOrderObject(updatedOrder, false);
            console.log("Updated order:");
            console.log(updatedOrderObj);
            return updatedOrderObj;
        } else{
            throw new Error("Order not found");
        }
    } else{
        throw new Error("Order ID and order state are mandatory");
    }
}

// manage place new order logic.
const addOrderHandler = async (userId, detail, paymentType, paymentId, secCode, address) => {
    // comparar secCode con codigo de tabla de payment methods, si es ok seguir
    console.log("Entro en add order handler");
    // initiate valid flag as false
    let valid = false;
    // if payment method is cash then validate order
    if(paymentType === "cash"){
        valid = true;
    } else{
        if((paymentType === "credit" || paymentType === "debit") && secCode != "" && paymentId != ""){
            // if payment type is not cash then get security code of card
            const payTableData = await queries.selectQuery("payment_data",["sec_code","user_id"],["payment_data_id"],[paymentId]);
            if(payTableData.length > 0){
                if(payTableData[0].user_id == userId){
                    if(payTableData[0].sec_code == secCode){
                        valid = true;
                    } else{
                        throw new Error("Wrong security code");
                    }
                } else{
                    throw new Error("Wrong paymanet data");
                }
            } else{
                throw new Error("Wrong paymanet data id");
            }
        } else{
            throw new Error(`Fields paymentType, paymentId and secCode are mandatory if payment type is not cash`);
        }
    }
    if(valid){
        // obtener costos de productos de detail y calcular costo total de orden
        let totalCost = 0;
        let productCost;
        let favExists;
        console.log(detail.length);
        // go through products in detail, calculate total cost of the order and add products as user's favorites
        for (const element of detail){
            productCost = await queries.selectQuery("products",["price"],["product_id"],[element.productId]);
            totalCost = totalCost + (productCost[0].price * element.quantity);
            console.log("Precio producto: " + productCost[0].price + ", cantidad: " + element.quantity + ", precio total acumulado: " + totalCost);
            favExists = await queries.selectQuery("favorites_map",["favorite_id"],["user_id","product_id"],[userId,element.productId]);
            if(favExists.length === 0){
                let addFavorite = await queries.insertQuery("favorites_map",["user_id","product_id"],[userId,element.productId]);
            }
        }
        // insertar orden en table orders, agregar estado nuevo, costo total y fecha de creacion
        const actualTime = moment().format("YYYY-MM-DD HH:mm:ss");
        const orderId = await queries.insertQuery("orders",["user_id","state","address","total_cost","created","payment_type"],[userId,"nuevo",address,totalCost,actualTime,paymentType]);
        // insertar order id, product id y cantidad en tabla order_products_map
        for (const element of detail){
            let response = await queries.insertQuery("order_products_map",["order_id","product_id","quantity"],[orderId,element.productId,element.quantity]);
        }
        const placedOrder = await queries.selectOrders(orderId);
        let placedOrderObj = arrangeOrderObject(placedOrder, false);
        return placedOrderObj;
    }
}

// manage information to add new payment data
const addPaymentInfo = async (userId,cardType,cardNumber,secCode,expDate) => {
    const paymentId = await queries.insertQuery("payment_data",["user_id","card_type","card_number","sec_code","exp_date"],[userId,cardType,cardNumber,secCode,expDate]);
    if (paymentId){
        const newPaymentInfo = await queries.selectQuery("payment_data",["card_type","exp_date"],["payment_data_id"],[paymentId]);
        return newPaymentInfo[0];
    } else{
        throw new Error("Add new payment info error");
    } 
}


// manage get all products information
const productsHandler = async (productId) => {
    console.log("Entro en get products handler");
    let products;
    // only get active products 
    if(productId){
        console.log("Entro en get product: " + productId);
        products = await queries.selectQuery("products",["product_id","title","detail","price","photo"],["active","product_id"],[true, productId]);
    } else{
        products = await queries.selectQuery("products",["product_id","title","detail","price","photo"],["active"],[true]);
    }
       
    if(products.length > 0){
        console.log("Products list:");
        console.log(products);
        return products;
    } else{
        throw new Error("Get products error");
    }
}

// manage add new product logic
const addProductHandler = async (title, detail, price, photo) => {
    console.log("Entro en get products handler");
    if(title && detail && price && photo){
        const actualTime = moment().format("YYYY-MM-DD HH:mm:ss");
        const productId = await queries.insertQuery("products",["title", "detail", "price", "photo", "created","active"],[title, detail, price, photo, actualTime, true]);
        let newProduct = await queries.selectQuery("products",["product_id","title", "detail", "price", "photo"],["product_id"],[productId]);
        return newProduct[0];
    } else{
        throw new Error("Madatory information missing")
    }
}

// manage update product information
const updateProductHandler = async (title, detail, price, photo, productId) => {
    console.log("Entro en update product handler");
    if(title && detail && price && photo){
        const actualTime = moment().format("YYYY-MM-DD HH:mm:ss");
        const response = await queries.updateQuery("products",["title", "detail", "price", "photo", "modified"],[title, detail, price, photo, actualTime],["product_id"],[productId]);
        let newProduct = await queries.selectQuery("products",["product_id","title", "detail", "price", "photo"],["product_id"],[productId]);
        console.log("Rta update product");
        console.log(newProduct[0]);
        return newProduct[0];
    } else{
        throw new Error("Madatory information missing")
    }
}

// manage delete product logic, does not delete from table but set active field as false
const deleteProductHandler = async (productId) => {
    console.log("Entro en delete product handler");
    // update active field to false
    const response = await queries.updateQuery("products", ["active"],[false],["product_id"],[productId]);
    if(response){
        console.log("Product deleted:");
        console.log(response);
        return `Product with product_id: ${productId} deleted succesfully`;
    } else{
        throw new Error("Delete product error");
    }
}

// Function that arranges orders information from query response into an array of objects with the correct Order format
// if isAsdmin is true return all the info in the query response, if it is false return only the basic info for users
const arrangeOrderObject = (ordersQueryArr, isAdmin) => {
    let ordersArray = [];
    let orderListObj = {}; 
    let currentId = ordersQueryArr[0].order_id; 
    let prevOrderListObj = {}; 
    let detailArray = []; 
    let detailObj = {}; 

    ordersQueryArr.forEach((element, idx, arr) =>{
        console.log("Corrida foreach: " + idx + " de: " + arr.length);
        // on each run build each order object
        orderListObj.orderId = element.order_id;
        orderListObj.state = element.state;
        orderListObj.totalCost = element.total_cost;
        orderListObj.paymentType = element.payment_type;
        orderListObj.address = element.address;
        // build an object with the detail of each product
        detailObj = {
            title: element.title,
            photo: element.photo,
            price: element.price,
            quantity: element.quantity
        };
        // add user info to order object if response is targeted to an Admin
        if(isAdmin){
            orderListObj.fullName = element.full_name;
            orderListObj.userName = element.user_name;
            orderListObj.email = element.email;
            orderListObj.phone = element.phone;
        }
        if(element.order_id === currentId){
            console.log("Guarda detail en array con mismo id: " + currentId);
            // insert product of order with the same order id into detail array (array with data of products in the order)
            detailArray.push(detailObj);
            // assign copy of array to object to avoid passing array by reference
            orderListObj.detail = [...detailArray];
            if(idx === arr.length - 1){
                // if this is the last run, insert object into orders array
                console.log("Guarda orden en array por ser ultimo elemento: " + idx);
                console.log(orderListObj);
                ordersArray.push(Object.assign({},orderListObj));
            } else{
                // copy object to an auxiliary object that will be used in the next run if necessary
                console.log("Asigna nuevo obj a anterior: ");
                prevOrderListObj = Object.assign({},orderListObj);
            }
        } else{
            console.log("Guarda orden en array por tener diferente id: Anterior: " + currentId + " nuevo: " + element.order_id);
            console.log(prevOrderListObj);
            // if new element order_id does not match with previous order_id, insert previous object into orders array
            ordersArray.push(Object.assign({},prevOrderListObj));
            // reset detail array to start pushing next order's details
            detailArray.length = 0;

            console.log("Guarda detail en array con diferente id");
            detailArray.push(detailObj);
            orderListObj.detail = [...detailArray];
            // if this is the last run, insert object into orders array
            if(idx === arr.length - 1){
                console.log("Guarda orden en array por ser ultimo elemento: " + idx);
                console.log(orderListObj);
                ordersArray.push(Object.assign({},orderListObj));
            }

            console.log("Asigna nuevo obj a anterior: ");
            // copy object to an auxiliary object that will be used in the next run if necessary
            prevOrderListObj = Object.assign({},orderListObj);
            // define new element's order_id as current id to allow comparition in next run
            currentId = element.order_id;
        }
        console.log("Arr index: " + idx + " de: " + arr.length + " current id: " + currentId);
        console.log("Nuevo objeto orden: ");
        console.log(orderListObj);
        console.log("Viejo objeto orden: ");
        console.log(prevOrderListObj);
        // everytime a new order_id is detected insert a copy of arranged order object into orders array

    });
    console.log(ordersArray);
    return ordersArray;
}


module.exports = {
    signHandler, 
    loginHandler, 
    usersHandler, 
    oneUserHandler, 
    updateUserHandler, 
    deleteUserHandler,
    ordersHandler, 
    activeOrdersHandler, 
    updateOrderHandler, 
    addOrderHandler, 
    addPaymentInfo, 
    productsHandler,
    addProductHandler,
    updateProductHandler,
    deleteProductHandler,
    jwt, 
    privateKey
};