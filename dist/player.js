'use strict';

var uuid = require('uuid');
var namegen = require('./namegen/namegen.js');

var Game = require('./game');

module.exports = function (session, events) {
    var player = {
        id: session.id || uuid(),
        nick: namegen(),
        games: session.games || [],
        gameId: null
    };

    player.join = function (gameId) {
        player.games = session.games = player.games.concat(gameId);
        player.gameId = gameId;

        session.save();
    };

    player.quit = function () {
        player.games = session.games = player.games.filter(function (gameId) {
            return gameId !== player.gameId;
        });
        player.gameId = null;

        session.save();
    };

    player.changeNick = function (newNick) {
        player.nick = newNick;
    };

    events.on('nick', player.changeNick);

    events.once('close', function () {
        events.removeListener('nick', player.changeNick);
    });

    return player;
};