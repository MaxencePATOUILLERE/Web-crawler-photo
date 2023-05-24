const fs = require('fs');

function removeDuplicateUrls(filename) {
    // Lire le contenu du fichier
    const content = fs.readFileSync(filename, 'utf-8');

    // Séparer les lignes en utilisant le saut de ligne comme séparateur
    const lines = content.split('\n');

    // Utiliser un ensemble pour stocker les URLs uniques
    const uniqueUrls = new Set();

    // Parcourir chaque ligne
    for (let line of lines) {
        // Supprimer les espaces en début et fin de ligne
        line = line.trim();

        // Vérifier si la ligne est une URL valide
        if (isUrl(line)) {
            // Ajouter l'URL à l'ensemble des URLs uniques
            uniqueUrls.add(line);
        }
    }

    // Créer un nouveau fichier pour stocker les URLs uniques
    const outputFilename = 'crawling_responce/unique_urls.txt';

    // Écrire les URLs uniques dans le nouveau fichier
    fs.writeFileSync(outputFilename, [...uniqueUrls].join('\n'));

    console.log(`Les URLs uniques ont été écrites dans le fichier ${outputFilename}`);
}

// Fonction utilitaire pour vérifier si une chaîne est une URL valide
function isUrl(str) {
    // Cette fonction utilise une expression régulière simple pour vérifier si la chaîne est une URL
    const urlRegex = /^(https?:\/\/)?[\w.-]+\.[a-zA-Z]{2,}(\/.*)?$/;
    return urlRegex.test(str);
}
module.exports = removeDuplicateUrls;
// Appel de la fonction avec le nom du fichier en argument
removeDuplicateUrls('crawling_responce/image_urls.txt');
