const express = require('express');
const app = express();
const port = 3000;
const crawlPage = require('./crawler.js');

app.use(express.static('crawling_responce'));  // Serve crawling_responce files from the 'crawling_responce' directory

app.get('/', (req, res) => {
    if (req.query.url) {
        const url = req.query.url;  // Récupère la valeur du paramètre 'url' dans la requête
        crawlPage(url);
        res.sendFile(__dirname + '/home.html');
    } else {
        res.sendFile(__dirname + '/home.html');
    }
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});


