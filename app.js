const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = require('./routes');

let headerMiddleware = require('./middlewares/header');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(headerMiddleware);
app.use(router);

app.get('/', function (req, res) {
    res.send('Hello Server!');
});

app.get('*', function (req, res) {
    res.status(404).send({ message: 'Not found' });
});

module.exports = app;