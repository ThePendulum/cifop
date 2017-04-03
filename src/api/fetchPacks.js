'use strict';

const knex = require('../knex.js');
const Game = require('../game');

module.exports = function(req, res) {
    return knex('packs');
};
