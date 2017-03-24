'use strict';

var events = require('./web.js')();
require('./game').listen(events);
require('./chat.js')(events);