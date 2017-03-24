'use strict';

const Game = require('../game');

module.exports = function(req, res) {
    Game.create().then(gameId => {
        res.send(gameId);
    });
};
