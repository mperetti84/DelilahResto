const {jwt,privateKey} = require("./data_handlers");
const queries = require("../db/queries");

// When user tries to log in, check if combination user/pass/active is valid
const verifyLogin = async (req,res,next) => {
    try{
        const {userName, pass} = req.body;
        if(userName && pass){
            const userData = await queries.selectQuery("users", ["user_id"], ["user_name","pass","active"], [userName, pass, true]);
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
        res.status(400).json(err.message);
    }
}

// Check if required sign-in fields exist and insert new user into users table
const verifySign = async (req, res, next) => {
    try{
        const {userName, fullName, email, pass, address, phone} = req.body;
        if(userName && fullName && email && pass && address && phone){
            const userExist = await queries.userExistQuery(userName,email);
            if(userExist){
                throw new Error("User already exists");
            } else{
                next();
            }
        } else{
            throw new Error("Sign in field/s missing");
        }
    } catch(err) {
        res.status(400).json(err.message);
    }
}

// Check that user is logged and has admin access. 
const verifyAdmin = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    
    try{
        const userData = jwt.verify(token, privateKey);
        if (userData.admin){
            req.user_data = userData;
            next();
        } else {
            throw new Error("User does not have admin access");
        }
    } catch(err) {
        // identify if enters catch due to expired token
        if(err.message.search("expired") === true){
            res.status(400).json("Session expired, please log in again.");
        } else{
            res.status(400).json("User does not have admin access: " + err.message);
        }
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
        // identify if enters catch due to expired token
        if(err.message.search("expired")){
            res.status(400).json("Session expired, please log in again.");
        } else{
            res.status(400).json("You must log in to access this endpoint");
        }
    }
}

module.exports = {
    verifyLogin, 
    verifySign, 
    verifyAdmin, 
    verifyLogged
};