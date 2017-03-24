'use strict';

module.exports = function(Game) {
    return function(gameId, player) {
        const game = Game.games.get(gameId);

        if(game) {
            game.players.delete(player);

            Game.broadcast(gameId, 'players', Array.from(game.players).map(player => pick(player, ['id', 'nick'])));

            Game.broadcast(gameId, 'message', {
                type: 'status',
                text: player.nick + ' has left the game',
                date: new Date()
            }, null);

            note('game', 0, `'${player.nick}' ('${player.id}') left '${game.id}'`);

            // e.g. allow last user to refresh page without deleting the game
            setTimeout(() => {
                if(game.players.size === 0) {
                    Game.delete(game.id);
                }
            }, 5000);
        }
    };
};
