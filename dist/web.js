'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var path = require('path');
var util = require('util');

var note = require('note-log');
var config = require('config');
var uuid = require('uuid');

var express = require('express');
var Router = require('express-promise-router');

var knex = require('./knex.js');
var session = require('express-session');
var knexSessionStore = require('connect-session-knex')(session);

var expressWs = require('express-ws');
var Socket = require('./socket.js');

var createGame = require('./api/createGame.js');

var store = new knexSessionStore({ knex: knex });

module.exports = function () {
    var app = express();
    var router = Router();

    var wss = expressWs(app);
    var socket = Socket(wss.getWss());

    app.use(session(_extends({}, config.session, {
        store: store
    })));

    router.use('/css', express.static('public/css'));
    router.use('/js', express.static('public/js'));
    router.use('/img', express.static('public/img'));

    app.use(router);

    router.post('/api/game', createGame);

    router.ws('/socket', function (ws, req) {
        socket.connect(ws, req);
    });

    router.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    app.listen(config.web.port, function () {
        note('server', 'Web server listening on port ' + config.web.port);
    });

    return socket;
};