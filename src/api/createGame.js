'use strict';

const game = require('../game.js');

module.exports = function(req, res) {
    game.create().then(gameId => {
        res.send(gameId);
    });
};
