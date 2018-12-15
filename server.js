"use strict";
// Uncomment this line out for local development. Must be commented for Heroku.
// require('dotenv').config();

const PORT = process.env.PORT || 5000;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require('path');
const generatePassword = require('password-generator');


app.use(bodyParser.urlencoded({
  extended: true
}));

const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Put all API endpoints under '/api'
app.get('/api/passwords', (req, res) => {
  const count = 5;

  // Generate some passwords
  const passwords = Array.from(Array(count).keys()).map(i =>
    generatePassword(12, false)
  )

  // Return them as json
  res.json(passwords);

  console.log(`Sent ${count} passwords`);
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.listen(PORT);

console.log(`Server listening on ${PORT}`);
