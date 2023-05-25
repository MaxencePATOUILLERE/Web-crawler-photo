const express = require('express');
const { resetTable, insertUrls} = require('./database');
const {crawl} = require("./crawler");

const app = express();
const port = 3000;


app.use(express.static('static'));

app.get('/', async (req, res) => {
    try {
        const urls = await crawl("https://islanto.wordpress.com/");
        await insertUrls(urls)
        res.send(urls)
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des URLs des images :', error);
        res.status(500).send('Erreur lors de la récupération des URLs des images');
    }
});

app.listen(port, async () => {
    try {
        await resetTable();

    } catch (e) {
        console.log(e)
    }
    console.log(`Serveur Express en écoute à l'adresse http://localhost:${port}`);
});
