const {PrismaClient} = require("@prisma/client");

const prisma = new PrismaClient();


async function resetTable() {
    await prisma.image.deleteMany({})
}

async function insertUrls(urls) {
    await resetTable();
    for (const url of urls) {
        await prisma.image.create({
            data: {url}
        })
    }
}

module.exports = { resetTable, insertUrls };
