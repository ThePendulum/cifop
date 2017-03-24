'use strict';

var Game = require('../game');

module.exports = function (req, res) {
    Game.create().then(function (gameId) {
        res.send(gameId);
    });
};