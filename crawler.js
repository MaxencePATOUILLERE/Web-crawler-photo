const puppeteer = require('puppeteer');
const fs = require('fs');
const removeDuplicateUrls = require('./filter_url.js');
let urls = [];
let crawledUrls = [];
let pageCount = 0;

module.exports = function(io) {
    return async function crawlPage(url) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await crawl(page, url);

        if (!fs.existsSync('crawling_responce')){
            fs.mkdirSync('crawling_responce');
        }
        await fs.writeFileSync('crawling_responce/image_urls.txt', urls.join('\n'));
        await removeDuplicateUrls('crawling_responce/image_urls.txt');
        await browser.close();

        io.emit('finished'); // Emit the "finished" event

        pageCount = 0;
        urls = [];
        crawledUrls = [];
    }

    async function crawl(page, url) {
        if (pageCount >= 40) {
            return;
        }

        if (!crawledUrls.includes(url)) {
            crawledUrls.push(url);
            pageCount++;
            io.emit('progress', { value: pageCount / 40 });  // Send the progress to the client
        } else {
            return;
        }

        console.log(`Crawling ${url}`);

        await page.goto(url, { waitUntil: 'networkidle0' });

        const pageUrls = await page.evaluate(() =>
            Array.from(document.images, e => e.src)
        );

        urls = urls.concat(pageUrls);

        const links = await page.evaluate(() =>
            Array.from(document.querySelectorAll('a'), e => e.href)
        );

        for (const link of links) {
            if (link.startsWith(url)) {
                await crawl(page, link);
            }
        }
    }
}
