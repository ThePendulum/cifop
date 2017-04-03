'use strict';

const util = require('util');
const note = require('note-log');

const fetchPacks = require('../packs/fetch.js');

module.exports = function(req, res) {
    return fetchPacks().then(packs => {
        res.send(packs);
    });
};
