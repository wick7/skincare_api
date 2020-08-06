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

//http://localhost:3000/api?search=mas&page=3
skincareDB.all = (search, page) => {

    let firstPage = 0
    if (page === 1 && search === undefined) {
        page = 0
        search = ''
    } else {
        firstPage = page + 0
        page = parseInt(firstPage) - 10
    }
    console.log(search, page)
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM purchased WHERE MATCH(product_name, brand, notes) AGAINST (? IN BOOLEAN MODE)  ORDER BY id LIMIT ?, 10`, [search + '*', page], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        });
    });
};

//http://localhost:3000/api/insert?category=10&product_name=Miss%20Cream&date_purchased=2020-07-05&date_opened=NULL&date_finished=NULL&brand=Sephora&oz_size=1&quantity=1&price_paid=5&price_per_oz=5&repurchase=1&notes=NULL
skincareDB.insert = (category, product_name, date_purchased, date_opened, date_finished, brand, oz_size, quantity, price_paid, price_per_oz, repurchase, notes) => {
    console.log(category, product_name, date_purchased, date_opened, date_finished, brand, oz_size, quantity, price_paid, price_per_oz, repurchase, notes)
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO purchased(category,product_name,date_purchased,date_opened,date_finished,brand,oz_size,quantity,price_paid,price_per_oz,repurchase,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);', [category, product_name, date_purchased, date_opened, date_finished, brand, oz_size, quantity, price_paid, price_per_oz, repurchase, notes], (err, results) => {
            if (err) {
                return reject(err)
            }
            console.log('1 Record Added')
        });
    });
};

module.exports = skincareDB;