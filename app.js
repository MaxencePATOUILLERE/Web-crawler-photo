const { resetTable, insertUrl } = require('./database');
const { crawl } = require('./crawler');

(async () => {
    await resetTable();

    const urls = await crawl('https://islanto.wordpress.com/');

    for (const url of urls) {
        await insertUrl(url);
    }
})();
