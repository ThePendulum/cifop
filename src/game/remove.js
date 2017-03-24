'use strict';

const note = require('note-log');

module.exports = function(Game) {
    return function(gameId) {
        Game.games.delete(gameId);
        note('game', 0, `Game '${gameId}' deleted`);
    };
};
