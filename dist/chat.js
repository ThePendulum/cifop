'use strict';

var util = require('util');
var note = require('note-log');

var Game = require('./game');

module.exports = function (events) {
    events.on('connect', function (player) {
        player.throttleStack = [];
    });

    events.on('message', function (msg, player) {
        var game = Game.games.get(player.gameId);

        if (game && game.players.has(player) && msg) {
            player.throttleStack = player.throttleStack.concat(new Date().getTime()).slice(-5);

            var text = msg.trim().slice(0, 140);

            if (text && player.throttleStack.length < 5 || player.throttleStack[4] - player.throttleStack[0] > 10000) {
                Game.broadcast(game.id, 'message', {
                    text: text,
                    type: 'message',
                    player: player.id,
                    date: new Date()
                });
            } else {
                player.transmit('message', {
                    type: 'error',
                    text: 'Please try to be less verbose!',
                    date: new Date()
                });
            }
        }
    });
};