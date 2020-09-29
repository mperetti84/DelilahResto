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

//update
const updateQuery = async (table, fields, values, condition, conditionValue) => {
    let setString = "";
    // const whereString = "";
    if (fields.length === values.length && condition.length === conditionValue.length){
        for (let i = 0; i < fields.length; i++) {
            setString = setString + `${fields[i]} = ${values[i]}, `;
        }
        // for (let i = 0; i < condition.length; i++) {
        //     whereString = whereString + `${condition[i]} = ${conditionValue}, `;
        // }
        setString   = setString.slice(0,-2);
        // whereString = whereString.slice(0,-2);
    } else {
        return "";
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

//select from junction table
const selectFavorites = async (table, fields, values) => {
    let fieldsString = "";
    fields.forEach(element => {
        fieldsString = fieldsString + element;
    });
    let valuesString = "";
    values.forEach(element => {
        valuesString = valuesString + element;
    });
    const query = await mysql.query(`INSERT INTO ${table} (${fieldsString}) VALUES (${valuesString})`);
    console.log("select from junction query: " + query);
    return query;
}

//select from junction table
const selectActiveOrders = async (userId) => {
    let queryString = `SELECT * FROM orders WHERE user_id = ${userId} AND state <> "cancelado" AND state <> "entregado"`;
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


module.exports = {insertQuery, updateQuery, deleteQuery, selectQuery, selectFavorites, selectActiveOrders, userExistQuery};