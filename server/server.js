const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes');

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

app.use('/api', apiRoutes)

app.listen(process.env.PORT || '3001', () => {
    console.log(`Server is running on port: ${process.env.PORT || '3001'}`);
});
