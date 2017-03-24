'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var util = require('util');

var note = require('note-log');
var uuid = require('uuid');

var namegen = require('./namegen/namegen.js');

module.exports = function (wss) {
    var hub = {};
    var EventEmitter = require('events');
    var events = new EventEmitter();

    hub.connections = new Map();

    hub.broadcast = function (namespace, data) {
        wss.clients.forEach(function (client) {
            if (client.readyState === 1) {
                client.send(JSON.stringify([namespace, data]));
            }
        });
    };

    hub.connect = function (ws, req) {
        ws.ip = ws.upgradeReq.headers['x-forwarded-for'] || ws.upgradeReq.connection.remoteAddress;
        ws.id = uuid();

        ws.nick = req.session.nick = namegen();
        req.session.save();

        ws.transmit = function (namespace, data) {
            if (ws.readyState === 1) {
                ws.send(JSON.stringify([namespace, data]));
            }
        };

        hub.connections.set(ws.id, ws);
        events.emit('connect', ws);

        note('hub', 0, '\'' + ws.nick + '\' (\'' + ws.ip + '\', \'' + ws.id + '\') connected');

        ws.on('message', function (msg) {
            try {
                var _JSON$parse = JSON.parse(msg),
                    _JSON$parse2 = _slicedToArray(_JSON$parse, 2),
                    namespace = _JSON$parse2[0],
                    data = _JSON$parse2[1];

                events.emit(namespace, data, ws, req);
            } catch (error) {
                note('socket', error);
            }
        });

        ws.on('close', function (code) {
            hub.connections.delete(ws.id);
            events.emit('close', code, ws, req);

            note('hub', 0, '\'' + ws.ip + '\' disconnected');
        });

        var ping = function ping() {
            ws.transmit('ping');

            setTimeout(ping, 5000);
        };

        ping();
    };

    return { hub: hub, events: events };
};