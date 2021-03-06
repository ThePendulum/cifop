'use strict';

var note = require('note-log');
var shortid = require('shortid');

module.exports = function (Game) {
    return function () {
        var game = {
            id: shortid.generate(),
            players: new Set(),
            settings: {
                players: 8,
                score: 8
            },
            host: null
        };

        Game.games.set(game.id, game);

        note('game', 0, 'Game \'' + game.id + '\' created');

        return Promise.resolve(game.id);
    };
};