'use strict';

const util = require('util');
const note = require('note-log');
const pick = require('object.pick');

const Player = require('./player.js');

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

        const player = Player(req.session, events);

        req.session.playerId = player.id;
        req.session.save();

        player.transmit = function(namespace, data) {
            if(ws.readyState === 1) {
                ws.send(JSON.stringify([namespace, data]));
            }
        };

        events.emit('connect', player);
        note('hub', 0, `'${player.nick}' ('${ws.ip}', '${player.id}') connected`);

        ws.on('message', msg => {
            try {
                const [namespace, data] = JSON.parse(msg);

                events.emit(namespace, data, player);
            } catch(error) {
                note('socket', error);
            }
        });

        ws.on('close', code => {
            events.emit('close', code, player);
            note('hub', 0, `'${player.nick}' ('${ws.ip}', '${player.id}') disconnected`);
        });

        player.transmit('player', pick(player, ['id', 'nick']));

        const ping = function() {
            player.transmit('ping');

            setTimeout(ping, 5000);
        };

        ping();
    };

    return {hub, events};
};
