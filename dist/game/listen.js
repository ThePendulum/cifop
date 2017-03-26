'use strict';

module.exports = function (Game) {
    var leave = function leave(data, player) {
        Game.quit(player);
    };

    return function (events) {
        events.on('join', function (gameId, ws, req) {
            Game.join(gameId, ws);
        });

        events.on('leave', leave);
        events.on('close', leave);
    };
};