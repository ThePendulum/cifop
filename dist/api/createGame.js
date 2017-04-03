'use strict';

var Game = require('../game');

module.exports = function (req, res) {
    return Game.create().then(function (gameId) {
        res.send(gameId);
    });
};