'use strict';

module.exports = function(Game) {
    const leave = function(data, ws, req) {
        Game.quit(req.session.gameId, ws);

        req.session.gameId = null;
        req.session.save();
    };

    return function(events) {
        events.on('join', (gameId, ws, req) => {
            Game.join(gameId, ws);

            req.session.gameId = gameId;
            req.session.save();
        });

        events.on('leave', leave);
        events.on('close', leave);
    };
};
