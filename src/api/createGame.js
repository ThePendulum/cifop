'use strict';

const Game = require('../game');

module.exports = function(req, res) {
    return Game.create().then(gameId => {
        res.send(gameId);
    });
};
