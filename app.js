const express = require('express');
const app = express();

const scrapper = require('./src/scraper');

app.listen('3000', () => console.log('Scraper running'));


//run async to use await
let runAsync = async () => {
    //let response = scrapper.load();
    let response = await scrapper.linkedIn('miami');
    console.log(response);
}

runAsync();