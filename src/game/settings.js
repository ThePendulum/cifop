'use strict';

const note = require('note-log');
const pick = require('object.pick');

module.exports = function(Game) {
    return function(gameId, settings, player) {
        const game = Game.games.get(gameId);

        if(!game) {
            player.transmit('message', {
                type: 'error',
                text: 'Game does not exist',
                date: new Date()
            });
        } else if(game.host !== player.id) {
            player.transmit('message', {
                type: 'error',
                text: 'You\'re not the host',
                date: new Date()
            });
        } else {
            Object.assign(game.settings, pick(settings, Object.keys(game.settings)));

            Game.broadcast(gameId, 'settings', game.settings);
        }
    };
};
