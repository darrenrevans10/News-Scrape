# ESPN Web-Scraper

Check it out [HERE](https://espnwebscrape.herokuapp.com/)

## Overview

A Node JS and MongoDB webapp that web-scrapes news data from ESPN. A list of all recent ESPN articles are displayed which allows users to save articles of their choosing. The users can then comment on the articles they have read as well as remove any articles they want from their saved collection.

Please check out the deployed version in Heroku here!

## Functionality
On the backend, the app uses express to serve routes and mongoose to interact with a MongoDB database.

On the frontend, the app uses handlebars for templating each article and Bootstrap as a styling framework.

And for webscraping, the app uses the request and cheerio node packages. All webscrapping code can be found in the server.js file.