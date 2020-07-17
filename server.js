const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json({
    limit: '50mb',
    extended: true
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

app.listen(3000, () => {
    console.log('http://localhost:3000')
});
app.use(express.static(__dirname + '/www'));

const api = require('./service/app');
app.use(api);