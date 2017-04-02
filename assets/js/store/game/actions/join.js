'use strict';

import socket from '../../../socket.js';

export default function(context, gameId) {
    context.commit('game', gameId);
    socket.transmit('join', gameId);
};
