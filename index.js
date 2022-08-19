'use strict';

const fs = require('fs');
const { existsSync, readFileSync } = require('node:fs');

// Goals:
// 1. Make a request to almanac.com/weather
// 2. a. Print out the the data for one location
//    b. Nashville, TN (zip code 37214) - June 19, 2003

const axios = require('axios');
const cheerio = require('cheerio');

function getDataForCategory(category, weatherHistoryResultsTable) {
  const res = weatherHistoryResultsTable
    .find(`h3:contains("${category}")`)
    .parent()
    .siblings()
    .children();

  const value = res.find('.value').text();
  const unit = res.find('.units').text();

  return { value, unit };
}

const relevantFields = [
  'Minimum Temperature',
  'Mean Temperature',
  'Maximum Temperature',
  'Mean Sea Level Pressure',
  'Mean Dew Point',
  'Total Precipitation',
  'Snow Depth',
  'Mean Wind Speed',
  'Maximum Sustained Wind Speed',
  'Maximum Wind Gust',
];

(async function () {
  const zipCode = process.argv[2];

  //yyyy-mm-dd
  const date = process.argv[3];

  // if the file exists for this zipCode and day
  // read the contents of that file and print it.
  // stop the program

  const fileName = `${zipCode}-${date}.json`;

  //CHECK TO SEE IF FILE EXIST

  if (existsSync(`./static/${fileName}`)) {
    console.log('This file exists. Here is the information:');

    const contents = readFileSync(`./static/${fileName}`).toString();
    console.log(JSON.parse(contents));
    return;
  }

  const { data } = await axios.get(
    `https://www.almanac.com/weather/history/zipcode/${zipCode}/${date}`,
  );
  const $ = cheerio.load(data);
  const table = $('.weatherhistory_results');

  const weatherData = {};

  for (let field of relevantFields) {
    const data = getDataForCategory(field, table);
    weatherData[field] = data;
  }
  const dataToWrite = JSON.stringify(weatherData);

  fs.writeFileSync(`./static/${fileName}`, dataToWrite);
  console.log('Finished Running');
  console.log(weatherData);

  //SAVE THIS DATA SOMEWHERE
})();
