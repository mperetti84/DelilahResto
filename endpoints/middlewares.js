const handlers = require("./data_handlers");
const queries = require("../db/queries");

// When user tries to log in, check if combination user/pass/active is valid
const verifyLogin = async (req,res,next) => {
    try{
        const {user, pass} = req.body;
        console.log("Datos en middleware verifyLogin: " + user + ", " + pass);
        if(user && pass){
            const userData = await queries.selectQuery("users", ["user_id"], ["user_name","pass","active"], [user, pass, true]);
            console.log("Rta verify login middleware: " + userData[0]);
            if (userData[0]){
                let userId = userData[0].user_id;
                req.user_id = userId;
                next();
            } else {
                throw new Error("Wrong login data");
            }
        } else{
            throw new Error("Verify endpoint keys");
        }
    } catch(err) {
        console.log("Error verify login middleware: " + err);
        res.status(400).json(err.message);
    }
}

// Check if required sign-in fields exist and insert new user into users table
const verifySign = async (req, res, next) => {
    try{
        const {userName, fullName, email, pass, address, phone} = req.body;
        console.log("Datos en middleware verifySign: " + userName + ", " + pass);
        if(userName && fullName && email && pass && address && phone){
            const userExist = await queries.userExistQuery(userName,email);
            console.log("User exists: " + userExist);
            if(userExist){
                throw new Error("User already exists");
            } else{
                next();
            }
        } else{
            throw new Error("Sign in field/s missing");
        }
    } catch(err) {
        console.log("Error verify sign in middleware: " + err);
        res.status(400).json(err.message);
    }
}

// Check that user exists and has admin access. 
const verifyAdmin = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    try{
        const userData = jwt.verify(token, privateKey);
        const isAdmin = await queries.selectQuery("users", ["admin"], ["user_id"], [userData.user_id]);
        console.log("Rta verify admin middleware: " + isAdmin[0]);
        if (isAdmin[0]){
            if (isAdmin[0].admin === true){
                next();
            } else {
                throw new Error("User does not have admin access");
            }
        } else{
            throw new Error("User does not exist");
        }
    } catch(err) {
        console.log("Error verify admin middleware: " + err);
        res.status(400).json(err.message);
    }
}

// Check that user is logged using token
const verifyLogged = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    try{
        const userData = jwt.verify(token, privateKey);
        req.user_id = userData.user_id;
        next();
    } catch(err) {
        console.log(err);
        res.status(400).json("You must log in to access this endpoint");
    }
}

module.exports = {verifyLogin, verifySign, verifyAdmin, verifyLogged};