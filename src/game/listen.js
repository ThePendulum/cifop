'use strict';

module.exports = function(Game) {
    return function(socket) {
        socket.listen('join', (gameId, ws, req) => {
            Game.join(gameId, ws);

            req.session.gameId = gameId;
            req.session.save();
        });

        socket.listen('leave', (data, ws, req) => {
            Game.quit(req.session.gameId, ws);

            req.session.gameId = null;
            req.session.save();
        });

        socket.close((code, ws, req) => {
            Game.quit(req.session.gameId, ws);
        });
    };
};
