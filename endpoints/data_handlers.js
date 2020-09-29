const queries = require("../db/queries");
const jwt = require("jsonwebtoken");
const privateKey = "mperetti-DelilahResto";


const signHandler = async (userName, fullName, email, pass, address, phone) => {
    console.log("Entro en handler sign");
    // agregar admin false, active true, fecha a created
    const response = await queries.insertQuery("users",["user_name","email","pass","phone","full_name","address","admin","active"],[userName,email,pass,phone,fullName,address,false,true]);
    const products = await queries.selectQuery("products",["*"],[],[]);
    if(response && products){
        console.log("Rta query sign: " + response);
        console.log(products);
        const token = jwt.sign(response, privateKey);
        console.log("Token: " + token);
        const signData = {products: products, token: token};
        return signData;
    } else {
        throw new Error("Sign in error");
    }
    
}

const loginHandler = async (userId) => {
    const products = await queries.selectQuery("products",["*"]);
    const favorites = await queries.selectFavorites(userId);
    const activeOrders = await queries.selectActiveOrders(userId);
    const token = jwt.sign(userId, privateKey);
    let loginData = {products: products, favorites: favorites, activeOrders: activeOrders, token: token};

    console.log("Login data:");
    console.log(loginData);

    return loginData;
}

module.exports = {signHandler, loginHandler, jwt, privateKey};