'use strict';

const knex = require('../knex.js');

module.exports = function() {
    return knex('packs');
};
