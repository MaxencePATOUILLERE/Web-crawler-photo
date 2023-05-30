function removeDuplicateUrls(urls) {
    const uniqueUrls = [...new Set(urls)];
    return uniqueUrls;
}

module.exports = removeDuplicateUrls;
