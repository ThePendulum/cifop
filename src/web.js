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
const Hub = require('./hub.js');

const createGame = require('./api/createGame.js');
const fetchPacks = require('./api/fetchPacks.js');

const store = new knexSessionStore({knex});

module.exports = function() {
    const app = express();
    const router = Router();

    const wss = expressWs(app);
    const {hub, events} = Hub(wss.getWss());

    app.use(session({
        ...config.session,
        store
    }));

    router.use('/css', express.static('public/css'));
    router.use('/js', express.static('public/js'));
    router.use('/img', express.static('public/img'));

    app.use(router);
    app.use((error, req, res, next) => {
        note('web', error);

        res.status(500).send();

        next();
    });

    router.post('/api/game', createGame);
    router.get('/api/packs', fetchPacks);

    router.ws('/socket', (ws, req) => {
        hub.connect(ws, req);
    });

    router.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    app.listen(config.web.port, () => {
        note('server', 'Web server listening on port ' + config.web.port);
    });

    return events;
};
