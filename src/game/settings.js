'use strict';

const note = require('note-log');
const pick = require('object.pick');

module.exports = function(Game) {
    return function(gameId, settings) {
        const game = Game.games.get(gameId);

        if(game) {
            Object.assign(game.settings, pick(settings, Object.keys(game.settings)));

            Game.broadcast(gameId, 'settings', game.settings);
        } else {
            player.transmit('message', {
                type: 'error',
                text: 'Game does not exist',
                date: new Date()
            });
        }
    };
};
