const puppeteer = require('puppeteer');

async function crawl(url) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    let urls = [];
    let crawledUrls = [];

    const recursiveCrawl = async (page, url) => {
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
                await recursiveCrawl(page, link);
            }
        }
    };

    await recursiveCrawl(page, url);
    await browser.close();
    return urls;
}

module.exports = { crawl };
