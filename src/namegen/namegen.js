'use strict';

const adjectives = require('./adjectives.js');
const animals = require('./animals.js');

module.exports = function() {
    return adjectives[Math.round(Math.random() * (adjectives.length - 1))] + ' ' + animals[Math.round(Math.random() * (animals.length - 1))];
};
