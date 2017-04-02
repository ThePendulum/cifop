'use strict';

var note = require('note-log');
var pick = require('object.pick');

module.exports = function (Game) {
    return function (gameId, player) {
        var game = Game.games.get(gameId);

        if (game) {
            if (player.games.includes(game.id)) {
                player.transmit('message', {
                    type: 'error',
                    text: 'Already in game',
                    date: new Date()
                });
            } else {
                player.join(gameId);
                game.players.add(player);

                if (!game.host) {
                    game.host = player.id;
                }

                Game.broadcast(gameId, 'players', Array.from(game.players).map(function (player) {
                    player.host = player.id === game.host;

                    return pick(player, ['id', 'nick', 'host']);
                }));

                Game.broadcast(gameId, 'settings', game.settings);

                Game.broadcast(gameId, 'message', {
                    type: 'status',
                    text: player.nick + ' has joined the game',
                    date: new Date()
                }, null);

                note('game', 0, '\'' + player.nick + '\' (\'' + player.id + '\') joined \'' + game.id + '\'');
            }
        } else {
            player.transmit('message', {
                type: 'error',
                text: 'Game does not exist',
                date: new Date()
            });
        }
    };
};