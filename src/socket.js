'use strict';

const util = require('util');

const note = require('note-log');
const uuid = require('uuid');

const namegen = require('./namegen/namegen.js');

module.exports = function(wss) {
    const socket = {};

    const listeners = new Map();
    const init = new Set();
    const close = new Set();

    socket.broadcast = function(namespace, data) {
        wss.clients.forEach(client => {
            if(client.readyState === 1) {
                client.send(JSON.stringify([namespace, data]));
            }
        });
    };

    socket.listen = function(namespace, handler, broadcast, bounce) {
        const proxyHandler = function(data, ws, req) {
            handler(data, ws, req);

            if(broadcast === true) {
                socket.broadcast(namespace, data);
            }
        };

        if(listeners.has(namespace)) {
            listeners.get(namespace).add(proxyHandler);
        } else {
            listeners.set(namespace, new Set([proxyHandler]));
        }
    };

    socket.init = function(handler) {
        init.add(handler);
    };

    socket.close = function(handler) {
        close.add(handler);
    };

    socket.connect = function(ws, req) {
        ws.id = uuid();

        ws.nick = req.session.nick = namegen();
        req.session.save();

        ws.transmit = function(namespace, data) {
            if(ws.readyState === 1) {
                ws.send(JSON.stringify([namespace, data]));
            }
        };

        ws.on('message', msg => {
            try {
                const [namespace, data] = JSON.parse(msg);

                if(listeners.has(namespace)) {
                    listeners.get(namespace).forEach(listener => listener(data, ws, req));
                }
            } catch(error) {
                note('socket', error);
            }
        });

        ws.on('close', code => {
            close.forEach(handler => handler(code, ws, req));
        });

        init.forEach(handler => handler(ws));

        const ping = function() {
            ws.transmit('ping');

            setTimeout(ping, 5000);
        };

        ping();
    };

    socket.init(ws => {
        ws.transmit('nick', ws.nick);
    });

    return socket;
};
