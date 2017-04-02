'use strict';

import pick from 'object.pick';

export default {
    nick(state, nick) {
        state.nick = nick;
    },
    game(state, game) {
        state.game = game;
    },
    setPlayers(state, players) {
        state.players = players;
    },
    removePlayer(state, playerId) {
        state.players = state.players.filter(player => player.id !== playerId);
    },
    clearPlayers(state) {
        state.players = [];
    },
    settings(state, settings) {
        Object.assign(state.settings, pick(settings, Object.keys(state.settings)));
    }
};
