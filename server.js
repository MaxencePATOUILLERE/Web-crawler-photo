const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('static'));  // Serve static files from the 'static' directory

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/showData.html');
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});

// TODO : link database to the result of crawling
// TODO : add input to chang the site to crawl
