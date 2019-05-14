const express = require('express');
const bodyParser = require('body-parser');
const Knex = require('knex');
const { Model } = require('objection');
require('dotenv').config();

const knexfile = require('./knexfile');

// Db Setup
const env = process.env.NODE_ENV || 'development';
const knex = Knex(knexfile[env]);
Model.knex(knex);

// App Setup
const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`App listening on port ${port}.`));