'use strict';

var knex = require('../knex.js');

module.exports = function () {
    return knex('packs');
};