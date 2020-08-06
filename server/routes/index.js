const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        let results = await db.all(req.query.search, req.query.page);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        let results = await db.one(req.params.id);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
});

router.post('/insert', (req, res, next) => {
    console.log(req.query.category, req.query.product_name, req.query.date_purchased, req.query.date_opened, req.query.date_finished, req.query.brand, req.query.oz_size, req.query.quantity, req.query.price_paid, req.query.price_per_oz, req.query.repurchase, req.query.notes)
    // try {
    //     let results = await db.insert(req.query.category, req.query.product_name, req.query.date_purchased, req.query.date_opened, req.query.date_finished, req.query.brand, req.query.oz_size, req.query.quantity, req.query.price_paid, req.query.price_per_oz, req.query.repurchase, req.query.notes);
    //     res.json(results);
    // } catch (e) {
    //     console.log(e);
    //     res.sendStatus(500)
    // }
});

module.exports = router;