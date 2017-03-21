'use strict';

import socket from '../../../socket.js';

export default function(context, message) {
    socket.transmit('message', message);
};
