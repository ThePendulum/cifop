'use strict';

const util = require('util');
const note = require('note-log');

const Game = require('./game');

module.exports = function(events) {
    events.on('connect', player => {
        player.throttleStack = [];
    });

    events.on('message', (msg, player) => {
        player.throttleStack = player.throttleStack.concat(new Date().getTime()).slice(-5);

        msg.text = msg.text.slice(0, 140);

        if(player.throttleStack.length < 5 || player.throttleStack[4] - player.throttleStack[0] > 10000) {
            Game.broadcast(msg.room, 'message', {
                ...msg,
                type: 'message',
                nick: player.nick,
                date: new Date()
            });
        } else {
            player.transmit('message', {
                type: 'error',
                text: 'Please try to be less verbose!',
                date: new Date()
            });
        }
    });
};
