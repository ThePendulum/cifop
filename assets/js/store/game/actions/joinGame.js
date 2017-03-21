'use strict';

import socket from '../../../socket.js';

export default function(context, gameId) {
    socket.transmit('join', gameId);
};
