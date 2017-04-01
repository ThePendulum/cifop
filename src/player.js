'use strict';

const uuid = require('uuid');
const namegen = require('./namegen/namegen.js');

const Game = require('./game');

module.exports = function(id = uuid(), events) {
    const player = {
        id,
        nick: namegen()
    };

    const changeNick = function(newNick) {
        player.nick = newNick;
    };

    events.on('nick', changeNick);
    events.once('close', () => {
        events.removeListener('nick', changeNick);
    });

    return player;
};
