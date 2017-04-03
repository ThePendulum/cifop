'use strict';

var util = require('util');
var note = require('note-log');

var fetchPacks = require('../packs/fetch.js');

module.exports = function (req, res) {
    return fetchPacks().then(function (packs) {
        res.send(packs);
    });
};