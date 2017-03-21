'use strict';

const path = require('path');
const util = require('util');

const note = require('note-log');
const config = require('config');
const uuid = require('uuid');

const express = require('express');
const Router = require('express-promise-router');

const knex = require('./knex.js');
const session = require('express-session');
const knexSessionStore = require('connect-session-knex')(session);

const expressWs = require('express-ws');
const Socket = require('./socket.js');

const createGame = require('./api/createGame.js');

const store = new knexSessionStore({knex});

module.exports = function() {
    const app = express();
    const router = Router();

    const wss = expressWs(app);
    const socket = Socket(wss.getWss());

    app.use(session({
        ...config.session,
        store
    }));

    router.use('/css', express.static('public/css'));
    router.use('/js', express.static('public/js'));
    router.use('/img', express.static('public/img'));

    app.use(router);

    router.post('/api/game', createGame);

    router.ws('/socket', (ws, req) => {
        socket.connect(ws, req);
    });

    router.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    app.listen(config.web.port, () => {
        note('server', 'Web server listening on port ' + config.web.port);
    });

    return socket;
};
