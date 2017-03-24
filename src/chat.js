'use strict';

const util = require('util');
const note = require('note-log');

const Game = require('./game');

module.exports = function(events) {
    events.on('connect', ws => {
        ws.throttleStack = [];
    });

    events.on('message', (msg, ws, req) => {
        ws.throttleStack = ws.throttleStack.concat(new Date().getTime()).slice(-5);

        msg.text = msg.text.slice(0, 140);

        if(ws.throttleStack.length < 5 || ws.throttleStack[4] - ws.throttleStack[0] > 10000) {
            Game.broadcast(msg.room, 'message', {
                ...msg,
                type: 'message',
                nick: req.session.nick,
                date: new Date()
            });
        } else {
            ws.transmit('message', {
                type: 'error',
                text: 'Please try to be less verbose!',
                date: new Date()
            });
        }
    });
};
