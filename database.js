const { Pool } = require('pg');

const pool = new Pool({
    user: 'user',
    host: 'localhost',
    database: 'mydatabase',
    password: 'postgres',
    port: 5432,
});

async function resetTable() {
    await pool.query('DROP TABLE IF EXISTS images');
    await pool.query(`
        CREATE TABLE images (
            id SERIAL PRIMARY KEY,
            url TEXT NOT NULL
        )
    `);
}

async function insertUrl(url) {
    await pool.query('INSERT INTO images (url) VALUES ($1)', [url]);
}

module.exports = { resetTable, insertUrl };
