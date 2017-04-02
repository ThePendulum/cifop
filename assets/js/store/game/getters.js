'use strict';

export default {
    host(state) {
        const host = state.players.find(player => player.host);

        return host ? host.id : null;
    }
};
