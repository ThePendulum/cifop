'use strict';

var uuid = require('uuid');
var namegen = require('./namegen/namegen.js');

module.exports = function () {
    var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : uuid();

    return {
        id: id,
        nick: namegen()
    };
};