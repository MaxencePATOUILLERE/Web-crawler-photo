const puppeteer = require('puppeteer');
const fs = require('fs');

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

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await crawl(page, 'https://islanto.wordpress.com/'); // Remplacez par l'URL du site que vous souhaitez crawler

    if (!fs.existsSync('static')){
        fs.mkdirSync('static');
    }
    fs.writeFileSync('static/image_urls.txt', urls.join('\n'));

    await browser.close();
})();
