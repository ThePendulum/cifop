'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var util = require('util');
var note = require('note-log');

var Game = require('./game');

module.exports = function (events) {
    events.on('connect', function (player) {
        player.throttleStack = [];
    });

    events.on('message', function (msg, player) {
        player.throttleStack = player.throttleStack.concat(new Date().getTime()).slice(-5);

        msg.text = msg.text.slice(0, 140);

        if (player.throttleStack.length < 5 || player.throttleStack[4] - player.throttleStack[0] > 10000) {
            Game.broadcast(msg.room, 'message', _extends({}, msg, {
                type: 'message',
                nick: player.nick,
                date: new Date()
            }));
        } else {
            player.transmit('message', {
                type: 'error',
                text: 'Please try to be less verbose!',
                date: new Date()
            });
        }
    });
};