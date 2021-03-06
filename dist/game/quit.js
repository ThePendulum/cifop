'use strict';

var util = require('util');
var note = require('note-log');
var pick = require('object.pick');

module.exports = function (Game) {
    return function (player) {
        var game = Game.games.get(player.gameId);

        if (game) {
            player.quit();
            game.players.delete(player);

            if (game.host === player.id) {
                var nextPlayer = game.players.values().next().value;

                if (nextPlayer) {
                    game.host = nextPlayer.id;
                    nextPlayer.host = true;
                } else {
                    game.host = null;
                }
            }

            Game.broadcast(game.id, 'players', Array.from(game.players).map(function (player) {
                return pick(player, ['id', 'nick', 'host']);
            }));

            Game.broadcast(game.id, 'message', {
                type: 'status',
                text: player.nick + ' has left the game',
                date: new Date()
            }, null);

            note('game', 0, '\'' + player.nick + '\' (\'' + player.id + '\') left \'' + game.id + '\'');

            // e.g. allow last user to refresh page without deleting the game
            setTimeout(function () {
                if (game.players.size === 0) {
                    Game.remove(game.id);
                }
            }, 5000);
        }
    };
};