'use strict';

module.exports = function(Game) {
    return function(gameId, namespace, data) {
        if(Game.games.has(gameId)) {
            Game.games.get(gameId).players.forEach(player => {
                player.transmit(namespace, data);
            });
        }
    };
};
