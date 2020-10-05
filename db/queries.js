const { response } = require("express");
const mysql = require("../db/mysql_connection")

// single insert query
const insertQuery = async (table, fields, values) => {
    let fieldsString = "";
    let valuesString = "";
    if (fields.length === values.length){
        fields.forEach(element => {
            fieldsString = fieldsString + `${element},`;
        });
        values.forEach(element => {
            if(typeof(element) === 'boolean'){
                valuesString = valuesString + `${element},`;
            }
            else {
                valuesString = valuesString + `"${element}",`;
            }
        });
        fieldsString = fieldsString.slice(0,-1);
        valuesString = valuesString.slice(0,-1);
    } else {
        return "";
    }
    const query = await mysql.query(`INSERT INTO ${table} (${fieldsString}) VALUES (${valuesString})`)
    console.log("insert query: " + query);
    return query;
}

//update fields of table with values where conditions equal conditionvalues
const updateQuery = async (table, fields, values, condition, conditionValue) => {
    let setString = "";
    // const whereString = "";
    if (fields.length === values.length && condition.length === conditionValue.length){
        for (let i = 0; i < fields.length; i++) {
            setString = setString + `${fields[i]} = "${values[i]}", `;
        }
        // for (let i = 0; i < condition.length; i++) {
        //     whereString = whereString + `${condition[i]} = ${conditionValue}, `;
        // }
        setString   = setString.slice(0,-2);
        // whereString = whereString.slice(0,-2);
    } else {
        throw new Error("Fields or condition number do not match");
    }
    const query = await mysql.query(`UPDATE ${table} SET ${setString} WHERE ${condition} = ${conditionValue}`);
    console.log("update query: " + query);
    return query;
}

//delete
const deleteQuery = async (table, fields, values) => {
    let fieldsString = "";
    fields.forEach(element => {
        fieldsString = fieldsString + element;
    });
    let valuesString = "";
    values.forEach(element => {
        valuesString = valuesString + element;
    });
    const query = await mysql.query(`INSERT INTO ${table} (${fieldsString}) VALUES (${valuesString})`);
    console.log("delete query: " + query);
    return query;
}

//select
const selectQuery = async (table, fields, columns, values) => {
    let fieldsString = "";
    fields.forEach(element => {
        fieldsString = fieldsString + element + ",";
    });
    fieldsString = fieldsString.slice(0,-1);
    let whereString = "";
    if (columns.length === values.length && columns.length > 0){
        whereString = "WHERE ";
        for (let i = 0; i < columns.length; i++) {
            if (typeof(values[i]) === 'boolean'){
                whereString = whereString + `${columns[i]} = ${values[i]} AND `;
            } else {
                whereString = whereString + `${columns[i]} = "${values[i]}" AND `;
            }        
        }
        whereString = whereString.slice(0,-5);
    } 
    let queryString = `SELECT ${fieldsString} FROM ${table} ${whereString}`;
    console.log("Select query string: " + queryString);

    const response = await mysql.query(queryString);
    console.log("Rta en .then de query: ");
    console.log(response);

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
    where users.user_id = ${userId}`;
    console.log("Select favorites query string: " + queryString);

    const response = await mysql.query(queryString);
    console.log("Rta en .then de query select favorites: ");
    console.log(response);

    return response;
}

//select user's active orders from junction table "order_products_map"
const selectActiveOrders = async (userId) => {
    let queryString = 
    `SELECT o.order_id,p.title, p.price, op.quantity,o.address,o.total_cost,o.state
    FROM orders o
    INNER JOIN order_products_map op ON op.order_id = o.order_id
    INNER JOIN products p ON p.product_id = op.product_id
    where o.user_id = ${userId} and o.state <> "cancelado" and o.state <> "entregado"`;

    console.log("Select active orders query string: " + queryString);

    const response = await mysql.query(queryString);
    console.log("Rta en .then de query select active orders: ");
    console.log(response);

    return response;
}

//select orders from junction table "order_products_map", if userId is null return all orders, else return only that user's orders
const selectOrders = async (userId) => {
    console.log("Entro en query select orders, user id: " + userId);
    let queryString = 
    `SELECT o.*,u.user_name,p.title, p.price, op.quantity
    FROM orders o
    INNER JOIN order_products_map op ON op.order_id = o.order_id
    INNER JOIN products p ON p.product_id = op.product_id
    INNER JOIN users u ON u.user_id = o.user_id`;
    if(userId){
        queryString = queryString + ` where o.user_id = ${userId}`;
    }
    console.log("Select active orders query string: " + queryString);

    const response = await mysql.query(queryString);
    console.log("Rta en .then de query select active orders: ");
    console.log(response);

    return response;
}

//If user exists returns true, if it does not returns false
const userExistQuery = async (userName, email) => {
    let queryString = `SELECT user_id FROM users WHERE user_name = "${userName}" OR email = "${email}"`;
    console.log("User exists query string: " + queryString);

    const response = await mysql.query(queryString);
    console.log("Rta de user exists query: ");
    console.log(response);
    if (response.length === 0){
        return false;
    } else{
        return true;
    }
}


module.exports = {insertQuery, updateQuery, deleteQuery, selectQuery, selectFavorites, selectActiveOrders, userExistQuery, selectOrders};