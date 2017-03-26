'use strict';

const uuid = require('uuid');
const namegen = require('./namegen/namegen.js');

module.exports = function(id = uuid()) {
    return {
        id,
        nick: namegen()
    };
};
