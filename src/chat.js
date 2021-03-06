'use strict';

const util = require('util');
const note = require('note-log');

const Game = require('./game');

module.exports = function(events) {
    events.on('connect', player => {
        player.throttleStack = [];
    });

    events.on('message', (msg, player) => {
        const game = Game.games.get(player.gameId);

        if(game && game.players.has(player) && msg) {
            player.throttleStack = player.throttleStack.concat(new Date().getTime()).slice(-5);

            const text = msg.trim().slice(0, 140);

            if(text && player.throttleStack.length < 5 || player.throttleStack[4] - player.throttleStack[0] > 10000) {
                Game.broadcast(game.id, 'message', {
                    text,
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
