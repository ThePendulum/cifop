'use strict';

const note = require('note-log');
const shortid = require('shortid');

module.exports = function(Game) {
    return function() {
        const game = {
            id: shortid.generate(),
            players: new Set()
        };

        Game.games.set(game.id, game);

        note('game', 0, `Game '${game.id}' created`);

        return Promise.resolve(game.id);
    };
};
