const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('crawling_responce'));  // Serve crawling_responce files from the 'crawling_responce' directory

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html');
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
