'use strict';

module.exports = function (Game) {
    return function (socket) {
        socket.listen('join', function (gameId, ws, req) {
            Game.join(gameId, ws);

            req.session.gameId = gameId;
            req.session.save();
        });

        socket.listen('leave', function (data, ws, req) {
            Game.quit(req.session.gameId, ws);

            req.session.gameId = null;
            req.session.save();
        });

        socket.close(function (code, ws, req) {
            Game.quit(req.session.gameId, ws);
        });
    };
};