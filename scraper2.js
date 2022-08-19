'use strict';
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { existsSync, readFileSync } = require('node:fs');

// Goals:
// 1. Make a request to wunderground.com/history
// 2. a. Print out the the data for one location
//    b. Nashville, TN (zip code 37214) - June 19, 2003

const locationCode = 'KBNA';
const url = `www.wunderground.com/history/daily/${locationCode}/date/2022-8-18`;

//CREATE FUNCTION TO GET DATA FOR WEATHER CATEGORIES
function getDataForCategory(category, weatherHistoryResultsTable) {
    const res = weatherHistoryResultsTable
      .find(`thead:contains("${ng-star-inserted}")`)
      .parent()
      .siblings()
      .children();

    const value = res.find('.td').text();
    //const unit = res.find('.units').text();

    return { value };
};

(async function () {

    const zipCode = process.argv[2];

    //yyyy-mm-dd
    const date = process.argv[3];

    const { data } = await axios.get(
        url,
        // `https://www.almanac.com/weather/history/zipcode/${zipCode}/${date}`,
      );
      const $ = cheerio.load(data);
      const table = $('.weatherhistory_results');

      const weatherData = {};
      console.log(weatherData);
      return;
});



// const trs = document.querySelectorAll('tr');

// const relevantFields = [
//     'High Temp',
//     'Low Temp',
//     'Day Average Temp',
//     'Dew Point',
//     'Max Wind Speed'
// ];

// for (const tr of trs){
//     for (const field of relevantFields){
//         if (tr.children[0]?.innerText === field){
//             console.log(field, ": ", tr.children[1].innerText)
//         }
//     }
//     console.log(tr);
// }
