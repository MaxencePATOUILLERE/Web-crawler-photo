const express = require('express');
const { Pool } = require('pg');
const { resetTable, insertUrl } = require('./database');

const app = express();
const port = 3000;

const pool = new Pool({
    user: 'user',
    host: 'localhost',
    database: 'mydatabase',
    password: 'postgres',
    port: 5432,
});

app.use(express.static('static'));

app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT url FROM images');
        const urls = result.rows.map(row => row.url);
        res.send(urls);
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des URLs des images :', error);
        res.status(500).send('Erreur lors de la récupération des URLs des images');
    }
});

app.listen(port, () => {
    console.log(`Serveur Express en écoute à l'adresse http://localhost:${port}`);
});
