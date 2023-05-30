FROM node:14

# Installation des dépendances système nécessaires pour Chrome
RUN apt-get update && apt-get install -y wget gnupg

# Téléchargement et installation de Chrome
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list
RUN apt-get update && apt-get install -y google-chrome-stable

WORKDIR /app

COPY package*.json ./

RUN apt-get update && apt-get install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2 && npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
