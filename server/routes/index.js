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

router.post('/insert', async (req, res, next) => {
    try {
        await db.insert(req.body)
    } catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
});

router.put('/update/:id', async (req, res, next) => {
    try {
        await db.update(req.params.id, req.body)
    } catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
});

module.exports = router;