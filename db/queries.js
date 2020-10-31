const mysql = require("../db/mysql_connection")

// single insert query
const insertQuery = async (table, fields, values) => {
    let fieldsString = "";
    let valuesString = "";
    // if fields length and values length match then build string for query
    if (fields.length === values.length){
        fields.forEach(element => {
            fieldsString = fieldsString + `${element},`;
        });
        values.forEach(element => {
            // if value is boolean do not add ""
            if(typeof(element) === 'boolean' || !isNaN(element)){
                valuesString = valuesString + `${element},`;
            } else {
                valuesString = valuesString + `"${element}",`;
            }
        });
        // remove "," at the end of strings
        fieldsString = fieldsString.slice(0,-1);
        valuesString = valuesString.slice(0,-1);
    } else {
        return "";
    }

    let queryString = `INSERT INTO ${table} (${fieldsString}) VALUES (${valuesString})`;
    const response = await mysql.query(queryString);
    return response;
}

//update fields of table with values where conditions equal conditionvalues
const updateQuery = async (table, fields, values, condition, conditionValue) => {
    let setString = "";
    // if fields length and values length match then build string for query
    if (fields.length === values.length && condition.length === conditionValue.length){
        for (let i = 0; i < fields.length; i++) {
            // if value is boolean do not add ""
            if(typeof(values[i]) === 'boolean' || !isNaN(values[i])){
                setString = setString + `${fields[i]} = ${values[i]}, `;
            } else{
                setString = setString + `${fields[i]} = "${values[i]}", `;
            }
        }
        // remove ", " at the end of string
        setString   = setString.slice(0,-2);
    } else {
        throw new Error("Fields or condition number do not match");
    }

    let queryString = `UPDATE ${table} SET ${setString} WHERE ${condition} = ${conditionValue}`;
    const response = await mysql.query(queryString);
    return response;
}

//select
const selectQuery = async (table, fields, columns, values) => {
    let fieldsString = "";
    fields.forEach(element => {
        fieldsString = fieldsString + element + ",";
    });
    fieldsString = fieldsString.slice(0,-1);
    let whereString = "";
    // if column is greater than 0 and matches with values length then build query string
    if (columns.length === values.length && columns.length > 0){
        whereString = "WHERE ";
        for (let i = 0; i < columns.length; i++) {
            // if value is boolean or a number do not add "" 
            if (typeof(values[i]) === 'boolean' || !isNaN(values[i])){
                whereString = whereString + `${columns[i]} = ${values[i]} AND `;
            } else {
                whereString = whereString + `${columns[i]} = "${values[i]}" AND `;
            }        
        }
        // remove " AND " at the end of string
        whereString = whereString.slice(0,-5);
    } 

    let queryString = `SELECT ${fieldsString} FROM ${table} ${whereString}`;
    const response = await mysql.query(queryString);
    return response;
}

//select users's favorite products
const selectFavorites = async (userId) => {
    // select certain product columns according to user_id and product_id from Junction table "favorites_map"
    let queryString = 
        `SELECT products.product_id, products.title, products.detail, products.price, products.photo
        FROM favorites_map
        INNER JOIN products ON products.product_id = favorites_map.product_id
        INNER JOIN users ON users.user_id = favorites_map.user_id
        WHERE users.user_id = ${userId}`;

    const response = await mysql.query(queryString);
    return response;
}

//select user's active orders from junction table "order_products_map" and order them from lower to higher order_id
const selectActiveOrders = async (userId) => {
    let queryString = 
        `SELECT o.order_id, p.photo, p.title, p.price, op.quantity, o.total_cost, o.state, 
        o.payment_type, o.address, u.full_name, u.user_name, u.email, u.phone
        FROM orders o
        INNER JOIN order_products_map op ON op.order_id = o.order_id
        INNER JOIN products p ON p.product_id = op.product_id
        INNER JOIN users u ON u.user_id = o.user_id  
        WHERE o.user_id = ${userId} and o.state <> "cancelado" and o.state <> "entregado" and o.active = true
        ORDER BY o.order_id ASC`;

    const response = await mysql.query(queryString);
    return response;
}

// select orders from junction table "order_products_map", 
// if orderId is null return all orders, else return only that specific order
const selectOrders = async (orderId) => {
    let queryString = 
        `SELECT o.order_id, p.photo, p.title, p.price, op.quantity, o.total_cost, o.state, 
        o.payment_type, o.address, u.full_name, u.user_name, u.email, u.phone
        FROM orders o
        INNER JOIN order_products_map op ON op.order_id = o.order_id
        INNER JOIN products p ON p.product_id = op.product_id
        INNER JOIN users u ON u.user_id = o.user_id
        WHERE o.active = true`;

    if(orderId){
        queryString = queryString + ` AND o.order_id = ${orderId}`;
    }

    queryString = queryString + ` ORDER BY o.order_id ASC`;
    const response = await mysql.query(queryString);
    return response;
}

//If user exists returns true, if it does not returns false
const userExistQuery = async (userName, email) => {
    let queryString = `SELECT user_id FROM users WHERE user_name = "${userName}" OR email = "${email}"`;

    const response = await mysql.query(queryString);
    if (response.length === 0){
        return false;
    } else{
        return true;
    }
}

module.exports = {
    insertQuery, 
    updateQuery, 
    selectQuery, 
    selectFavorites, 
    selectActiveOrders, 
    userExistQuery, 
    selectOrders
};