'use strict';

import socket from '../../../socket.js';

export default function(context) {
    context.commit('clearChat');
    context.commit('clearPlayers');

    socket.transmit('leave');
};
