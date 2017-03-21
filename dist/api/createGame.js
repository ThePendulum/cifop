'use strict';

var game = require('../game.js');

module.exports = function (req, res) {
    game.create().then(function (gameId) {
        res.send(gameId);
    });
};