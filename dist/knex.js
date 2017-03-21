'use strict';

var config = require('config');
var knex = require('knex');

module.exports = knex(config.database);