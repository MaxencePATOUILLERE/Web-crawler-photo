const puppeteer = require('puppeteer');
const fs = require('fs');
const removeDuplicateUrls = require('./filter_url.js');
let urls = [];
let crawledUrls = [];

async function crawl(page, url) {
    if (crawledUrls.includes(url)) {
        return;
    }

    crawledUrls.push(url);

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

async function crawlPage(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await crawl(page, url); // Maintenant, l'URL est un paramètre

    if (!fs.existsSync('crawling_responce')){
        fs.mkdirSync('crawling_responce');
    }
    fs.writeFileSync('crawling_responce/image_urls.txt', urls.join('\n'));
    removeDuplicateUrls('crawling_responce/image_urls.txt');
    await browser.close();
}

// Pour l'utiliser:
crawlPage('https://islanto.wordpress.com/'); // Remplacez par l'URL du site que vous souhaitez crawler
