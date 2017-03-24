'use strict';

module.exports = function (Game) {
    return function (gameId, player) {
        var game = Game.games.get(gameId);

        if (game && !game.players.has(player)) {
            game.players.add(player);

            Game.broadcast(gameId, 'players', Array.from(game.players).map(function (player) {
                return pick(player, ['id', 'nick']);
            }));

            Game.broadcast(gameId, 'message', {
                type: 'status',
                text: player.nick + ' has joined the game',
                date: new Date()
            }, null);

            note('game', 0, '\'' + player.nick + '\' (\'' + player.id + '\') joined \'' + game.id + '\'');
        } else if (!game) {
            player.transmit('message', {
                type: 'error',
                text: 'Room does not exist',
                date: new Date()
            });
        }
    };
};