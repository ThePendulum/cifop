'use strict';

const note = require('note-log');
const pick = require('object.pick');

module.exports = function(Game) {
    return function(gameId, player) {
        const game = Game.games.get(gameId);

        if(game) {
            if(game.players.has(player.id)) {
                player.transmit('message', {
                    type: 'error',
                    text: 'Already in game',
                    date: new Date()
                });
            } else {
                player.gameId = gameId;
                game.players.set(player.id, player);

                Game.broadcast(gameId, 'players', Array.from(game.players).map(player => pick(player, ['id', 'nick'])));

                Game.broadcast(gameId, 'message', {
                    type: 'status',
                    text: player.nick + ' has joined the game',
                    date: new Date()
                }, null);

                note('game', 0, `'${player.nick}' ('${player.id}') joined '${game.id}'`);
            }
        } else {
            player.transmit('message', {
                type: 'error',
                text: 'Room does not exist',
                date: new Date()
            });
        }
    };
};
