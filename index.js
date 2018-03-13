require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const time = require('./services/time');
const weather = require('./services/weather');
const cook = require('./services/cook');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Yes'));

app.post('/time', time.getTime);
app.post('/weather', weather.getWeather);
app.post('/vegfood', cook.getVegFood);

app.post('/errors', (req, res) => {
    console.log(req.body);
    res.sendStatus(200);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`App start on port ${PORT}`));