'use strict';

const note = require('note-log');
const pick = require('object.pick');

module.exports = function(Game) {
    return function(player) {
        const game = Game.games.get(player.gameId);

        if(game) {
            player.gameId = null;
            game.players.delete(player);

            Game.broadcast(player.gameId, 'players', Array.from(game.players).map(player => pick(player, ['id', 'nick'])));

            Game.broadcast(player.gameId, 'message', {
                type: 'status',
                text: player.nick + ' has left the game',
                date: new Date()
            }, null);

            note('game', 0, `'${player.nick}' ('${player.id}') left '${game.id}'`);

            // e.g. allow last user to refresh page without deleting the game
            setTimeout(() => {
                if(game.players.size === 0) {
                    Game.remove(game.id);
                }
            }, 5000);
        }
    };
};
