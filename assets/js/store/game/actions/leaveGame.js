'use strict';

import socket from '../../../socket.js';

export default function(context) {
    socket.transmit('leave');
};
