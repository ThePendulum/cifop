'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var util = require('util');
var note = require('note-log');

var Game = require('./game');

module.exports = function (events) {
    events.on('connect', function (ws) {
        ws.throttleStack = [];
    });

    events.on('message', function (msg, ws, req) {
        ws.throttleStack = ws.throttleStack.concat(new Date().getTime()).slice(-5);

        msg.text = msg.text.slice(0, 140);

        if (ws.throttleStack.length < 5 || ws.throttleStack[4] - ws.throttleStack[0] > 10000) {
            Game.broadcast(msg.room, 'message', _extends({}, msg, {
                type: 'message',
                nick: req.session.nick,
                date: new Date()
            }));
        } else {
            ws.transmit('message', {
                type: 'error',
                text: 'Please try to be less verbose!',
                date: new Date()
            });
        }
    });
};