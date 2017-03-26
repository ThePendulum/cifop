'use strict';

module.exports = function(Game) {
    const leave = function(data, player) {
        Game.quit(player);
    };

    return function(events) {
        events.on('join', (gameId, ws, req) => {
            Game.join(gameId, ws);
        });

        events.on('leave', leave);
        events.on('close', leave);
    };
};
