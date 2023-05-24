const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 3000;
const crawlPage = require('./crawler.js')(io);

app.use(express.static('crawling_responce'));

app.get('/', (req, res) => {
    if (req.query.url) {
        const url = req.query.url;
        crawlPage(url);
        res.sendFile(__dirname + '/home.html');
    } else {
        res.sendFile(__dirname + '/home.html');
    }
});

http.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
