'use strict';

export default {
    nick(state, nick) {
        state.nick = nick;
    },
    setPlayers(state, players) {
        state.players = players;
    },
    removePlayer(state, playerId) {
        state.players = state.players.filter(player => player.id !== playerId);
    },
    clearPlayers(state) {
        state.players = [];
    }
};
