'use strict';

const events = require('./web.js')();
require('./game').listen(events);
require('./chat.js')(events);
