'use strict';

const util = require('util');

const note = require('note-log');
const uuid = require('uuid');

const namegen = require('./namegen/namegen.js');

module.exports = function(wss) {
    const hub = {};
    const EventEmitter = require('events');
    const events = new EventEmitter();

    hub.broadcast = function(namespace, data) {
        wss.clients.forEach(client => {
            if(client.readyState === 1) {
                client.send(JSON.stringify([namespace, data]));
            }
        });
    };

    hub.connect = function(ws, req) {
        ws.ip = ws.upgradeReq.headers['x-forwarded-for'] || ws.upgradeReq.connection.remoteAddress;
        ws.id = uuid();

        ws.nick = req.session.nick = namegen();
        req.session.save();

        note('hub', 0, `'${ws.nick}' ('${ws.ip}', '${ws.id}') connected`);

        ws.transmit = function(namespace, data) {
            if(ws.readyState === 1) {
                ws.send(JSON.stringify([namespace, data]));
            }
        };

        events.emit('connect', ws);

        ws.on('message', msg => {
            try {
                const [namespace, data] = JSON.parse(msg);

                events.emit(namespace, data, ws, req);
            } catch(error) {
                note('socket', error);
            }
        });

        ws.on('close', code => {
            events.emit('close', code, ws, req);

            note('hub', 0, `'${ws.ip}' disconnected`);
        });

        const ping = function() {
            ws.transmit('ping');

            setTimeout(ping, 5000);
        };

        ping();
    };

    return {hub, events};
};
