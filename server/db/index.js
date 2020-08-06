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

module.exports = skincareDB;