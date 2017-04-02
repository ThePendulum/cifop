'use strict';

module.exports = function (Game) {
    var quit = function quit(data, player) {
        Game.quit(player);
    };

    return function (events) {
        events.on('join', function (gameId, ws, req) {
            Game.join(gameId, ws);
        });

        events.on('settings', function (settings, player) {
            Game.settings(player.gameId, settings, player);
        });

        events.on('leave', quit);
        events.on('close', quit);
    };
};