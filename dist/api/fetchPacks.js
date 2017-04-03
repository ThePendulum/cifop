'use strict';

var knex = require('../knex.js');
var Game = require('../game');

module.exports = function (req, res) {
    return knex('packs');
};