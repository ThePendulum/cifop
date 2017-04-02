'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var util = require('util');
var note = require('note-log');
var pick = require('object.pick');

var Player = require('./player.js');

module.exports = function (wss) {
    var hub = {};
    var EventEmitter = require('events');
    var events = new EventEmitter();

    hub.broadcast = function (namespace, data) {
        wss.clients.forEach(function (client) {
            if (client.readyState === 1) {
                client.send(JSON.stringify([namespace, data]));
            }
        });
    };

    hub.connect = function (ws, req) {
        ws.ip = ws.upgradeReq.headers['x-forwarded-for'] || ws.upgradeReq.connection.remoteAddress;

        var player = Player(req.session, events);

        req.session.playerId = player.id;
        req.session.save();

        player.transmit = function (namespace, data) {
            if (ws.readyState === 1) {
                ws.send(JSON.stringify([namespace, data]));
            }
        };

        events.emit('connect', player);
        note('hub', 0, '\'' + player.nick + '\' (\'' + ws.ip + '\', \'' + player.id + '\') connected');

        ws.on('message', function (msg) {
            try {
                var _JSON$parse = JSON.parse(msg),
                    _JSON$parse2 = _slicedToArray(_JSON$parse, 2),
                    namespace = _JSON$parse2[0],
                    data = _JSON$parse2[1];

                events.emit(namespace, data, player);
            } catch (error) {
                note('socket', error);
            }
        });

        ws.on('close', function (code) {
            events.emit('close', code, player);
            note('hub', 0, '\'' + player.nick + '\' (\'' + ws.ip + '\', \'' + player.id + '\') disconnected');
        });

        player.transmit('player', pick(player, ['id', 'nick']));

        var ping = function ping() {
            player.transmit('ping');

            setTimeout(ping, 5000);
        };

        ping();
    };

    return { hub: hub, events: events };
};