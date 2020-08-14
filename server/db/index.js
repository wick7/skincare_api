const mysql = require('mysql');
require('dotenv').config()


const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

let skincareDB = {};

//GET 
//http://localhost:3000/api/120
skincareDB.one = (id) => {

    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM purchased WHERE id = ?', [id], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        });
    });
};

//GET 
//http://localhost:3000/api?search=mas&page=3
skincareDB.all = (search, page) => {

    let firstPage = 0
    let countStatement = ''
    if (search === "null" || !search) {
        page = page - 1
        search = ''
        countStatement = 'SELECT COUNT(*) FROM purchased;'
    } else {
        firstPage = page + 0
        page = parseInt(firstPage) - 10
        countStatement = 'SELECT COUNT(*) FROM purchased WHERE MATCH(product_name, brand, notes) AGAINST (' + "\"" + search + "*\"" + ' IN BOOLEAN MODE)'
    }
    let againstStatement = 'SELECT * FROM purchased WHERE MATCH(product_name, brand, notes) AGAINST (' + "\"" + search + "*\"" + ' IN BOOLEAN MODE) ORDER BY id LIMIT ' + page + ',' + 10;
    let withOutAgainstStatement = 'SELECT * FROM purchased ORDER BY id LIMIT ' + page + ',' + 10;

    console.log(againstStatement)

    return new Promise((resolve, reject) => {
        pool.query(search ? againstStatement : withOutAgainstStatement, [], (err, results) => {
            if (err) {
                return reject(err)
            }
            pool.query(countStatement, [], (err, count) => {
                if (err) {
                    return reject(err)
                }
                return resolve({ count: count[0]['COUNT(*)'], results })
            })
        });
    })
};

//POST
//http://localhost:3000/api/insert
//body 
// {
//     "category": 10,
//     "product_name": "Misssss Crehnghamerscc",
//     "date_purchased": "2020-07-05",
//     "date_opened": null,
//     "date_finished": null,
//     "brand": "Some Guy",
//     "oz_size": 1,
//     "quantity": 1,
//     "price_paid": 5,
//     "price_per_oz": 5,
//     "repurchase": 1,
//     "notes": null
// }

skincareDB.insert = (body) => {

    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO purchased(category,product_name,date_purchased,date_opened,date_finished,brand,oz_size,quantity,price_paid,price_per_oz,repurchase,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);', [body.category, body.product_name, body.date_purchased, body.date_opened, body.date_finished, body.brand, body.oz_size, body.quantity, body.price_paid, body.price_per_oz, body.repurchase, body.notes], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve({ sucessMessage: 'Successfully added entry!' })
        });
    });
};

//PUT
//http://localhost:3000/api/update/140
// {
//     "category": 10,
//     "product_name": "Misssss Crehnghamerscc",
//     "date_purchased": "2020-07-05",
//     "date_opened": null,
//     "date_finished": null,
//     "brand": "Some Guy",
//     "oz_size": 1,
//     "quantity": 1,
//     "price_paid": 5,
//     "price_per_oz": 5,
//     "repurchase": 1,
//     "notes": null
// }
skincareDB.update = (id, body) => {
    let companyId = parseInt(id)
    return new Promise((resolve, reject) => {
        pool.query('UPDATE purchased SET category=?, product_name=?, date_purchased=?, date_opened=?, date_finished=?, brand=?, oz_size=?, quantity=?, price_paid=?, price_per_oz=?, repurchase=?, notes=? WHERE id=?;', [body.category, body.product_name, body.date_purchased, body.date_opened, body.date_finished, body.brand, body.oz_size, body.quantity, body.price_paid, body.price_per_oz, body.repurchase, body.notes, companyId], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results, { sucessMessage: 'Successfully updated entry!' })
        });
    });
};

module.exports = skincareDB;