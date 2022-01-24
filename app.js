const express = require('express');
const app = express();

const scrapper = require('./src/scraper');

app.listen('3000', () => console.log('Scraper running'));

scrapper.load();