'use strict';

var uuid = require('uuid');
var namegen = require('./namegen/namegen.js');

var Game = require('./game');

module.exports = function () {
    var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : uuid();
    var events = arguments[1];

    var player = {
        id: id,
        nick: namegen()
    };

    var changeNick = function changeNick(newNick) {
        player.nick = newNick;
    };

    events.on('nick', changeNick);
    events.once('close', function () {
        events.removeListener('nick', changeNick);
    });

    return player;
};