require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const time = require('./services/time');
const weather = require('./services/weather');
const cook = require('./services/cook');
const wiki = require('./services/wiki');

const recast = require('./src/recast');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.origins([`${process.env.ORIGINS}`]);

app.use(bodyParser.json());

app.post('/time', time.getTime);
app.post('/wiki-person', wiki.getWikiSummary);
app.post('/weather', weather.getWeather);
app.post('/vegfood', cook.getVegFood);

app.post('/errors', (req, res) => {
    console.log(req.body);
    res.sendStatus(200);
});

io.on('connection', function (socket) {
    let dialogCreated = false;
    socket.emit('reply', { reply: [{ type: 'text', content: 'Bonjour, je suis Nestor. Que puis-je faire pour vous ?' }] });

    socket.on('request', function (data) {
        recast.dialog(socket.id, data.text, socket);
        dialogCreated = true;
    });

    socket.on('disconnect', function () {
        if (dialogCreated) recast.deleteConversation(socket.id);
    });
});

app.get('*', function (req, res) {
    if (process.env.REDIRECT_404_URL) {
        res.redirect(process.env.REDIRECT_404_URL);
    }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`App start on port ${PORT}`));