const puppeteer = require('puppeteer-core');
const removeDuplicateUrls = require('./filter_url.js');
const { resetTable, insertUrls } = require('./database');

let urls = [];
let crawledUrls = [];
let pageCount = 0;

async function crawlPage(url) {
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/google-chrome-stable',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await crawl(page, url);

    await browser.close();
    pageCount = 0;
    urls = [];
    crawledUrls = [];

    const uniqueUrls = removeDuplicateUrls(urls);
    await insertUrls(uniqueUrls);

    return true;
}

async function crawl(page, url) {
    if (pageCount >= 40) {
        return;
    }

    if (!crawledUrls.includes(url)) {
        crawledUrls.push(url);
        pageCount++;
    } else {
        return;
    }

    console.log(`Crawling ${url}`);
    await page.goto(url, { waitUntil: 'networkidle0' });

    const pageUrls = await page.evaluate(() =>
        Array.from(document.images, (e) => e.src)
    );
    urls = urls.concat(pageUrls);

    const links = await page.evaluate(() =>
        Array.from(document.querySelectorAll('a'), (e) => e.href)
    );

    for (const link of links) {
        if (link.startsWith(url)) {
            await crawl(page, link);
        }
    }
}

module.exports = {
    crawlPage
};
