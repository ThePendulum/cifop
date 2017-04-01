'use strict';

import socket from '../../../socket.js';

export default function(context, settings) {
    context.commit('settings', settings);
    socket.transmit('settings', settings);
};
