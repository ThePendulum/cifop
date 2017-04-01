'use strict';

const note = require('note-log');
const shortid = require('shortid');

module.exports = function(Game) {
    return function() {
        const game = {
            id: shortid.generate(),
            players: new Set(),
            settings: {
                players: 8,
                score: 8
            }
        };

        Game.games.set(game.id, game);

        note('game', 0, `Game '${game.id}' created`);

        return Promise.resolve(game.id);
    };
};
