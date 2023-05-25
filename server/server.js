const express = require('express');
const app = express();
const http = require('http').createServer(app);
const port = 3000;
const crawlPage = require('../crawler/crawler.js');
const uuid = require('uuid');
const path = require('path');

let responses = {};

app.use(express.static('crawling_responce'));

app.get('/response/:id', (req, res) => {
    const id = req.params.id;
    if (responses[id]) {
        res.sendFile(path.resolve(__dirname, '..', 'template', 'showData.html'));
    } else {
        res.status(404).send("Not found");
    }
});

app.get('/', async (req, res) => {
    if (req.query.url) {
        const url = req.query.url;
        const id = uuid.v4();
        if (await crawlPage(url) === true) {
            responses[id] = true;
            res.redirect(`/response/${id}`);
        }
    } else {
        res.sendFile(path.resolve(__dirname, '..', 'template', 'home.html'));
    }
});

http.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
