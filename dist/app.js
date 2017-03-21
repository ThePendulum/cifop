'use strict';

var socket = require('./web.js')();
require('./game.js').listen(socket);