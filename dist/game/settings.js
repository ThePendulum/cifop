'use strict';

var note = require('note-log');
var pick = require('object.pick');

module.exports = function (Game) {
    return function (gameId, settings) {
        var game = Game.games.get(gameId);

        if (game) {
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