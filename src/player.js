'use strict';

const uuid = require('uuid');
const namegen = require('./namegen/namegen.js');

const Game = require('./game');

module.exports = function(session, events) {
    const player = {
        id: session.id || uuid(),
        nick: namegen(),
        games: session.games || [],
        gameId: null
    };

    player.join = function(gameId) {
        player.games = session.games = player.games.concat(gameId);
        player.gameId = gameId;

        session.save();
    };

    player.quit = function() {
        player.games = session.games = player.games.filter(gameId => gameId !== player.gameId);
        player.gameId = null;

        session.save();
    };

    player.changeNick = function(newNick) {
        player.nick = newNick;
    };

    events.on('nick', player.changeNick);

    events.once('close', () => {
        events.removeListener('nick', player.changeNick);
    });

    return player;
};
