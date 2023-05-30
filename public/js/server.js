const express = require('express');
const app = express();
const http = require('http').createServer(app);
const port = 3000;
const { resetTable, insertUrls } = require('./database');
const { crawlPage } = require('./crawler');
const removeDuplicateUrls = require('./filter_url');
const path = require('path');
const uuid = require('uuid');

const responses = {}; // Ajoutez cette ligne pour définir la variable responses

app.use(express.static('crawling_responce'));

app.get('/response/:id', (req, res) => {
    const id = req.params.id;
    if (responses[id]) {
        res.sendFile(path.resolve(__dirname, '..', 'template', 'showData.html'));
    } else {
        res.status(404).send('Not found');
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

app.get('/crawl', async (req, res) => {
    const url = req.query.url;
    if (url) {
        try {
            await resetTable();
            const urls = await crawlPage(url);
            const uniqueUrls = removeDuplicateUrls(urls);
            await insertUrls(uniqueUrls);
            responses[uuid.v4()] = true;
            res.redirect('/');
        } catch (error) {
            console.error('Une erreur s\'est produite lors de la récupération des URLs des images :', error);
            res.status(500).send('Erreur lors de la récupération des URLs des images');
        }
    } else {
        res.status(400).send('URL is required');
    }
});

http.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
