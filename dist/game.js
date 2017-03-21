'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var util = require('util');

var note = require('note-log');
var shortid = require('shortid');
var pick = require('object.pick');

var games = new Map();
var Game = {};

Game.create = function () {
    var game = {
        id: shortid.generate(),
        players: new Set()
    };

    games.set(game.id, game);

    return Promise.resolve(game.id);
};

Game.join = function (gameId, player) {
    var game = games.get(gameId);

    if (game && !game.players.has(player)) {
        game.players.add(player);

        Game.broadcast(gameId, 'players', Array.from(game.players).map(function (player) {
            return pick(player, ['id', 'nick']);
        }));

        Game.broadcast(gameId, 'message', {
            type: 'status',
            text: player.nick + ' has joined the game',
            date: new Date()
        }, null);
    } else if (!game) {
        player.transmit('message', {
            type: 'error',
            text: 'Room does not exist',
            date: new Date()
        });
    }
};

Game.quit = function (gameId, player) {
    var game = games.get(gameId);

    if (game) {
        game.players.delete(player);

        Game.broadcast(gameId, 'players', Array.from(game.players).map(function (player) {
            return pick(player, ['id', 'nick']);
        }));

        Game.broadcast(gameId, 'message', {
            type: 'status',
            text: player.nick + ' has left the game',
            date: new Date()
        }, null);

        if (game.players.size === 0) {
            games.delete(game.id);
        }
    }
};

Game.broadcast = function (gameId, namespace, data) {
    if (games.has(gameId)) {
        games.get(gameId).players.forEach(function (player) {
            player.transmit(namespace, data);
        });
    }
};

Game.listen = function (socket) {
    socket.listen('join', function (gameId, ws, req) {
        Game.join(gameId, ws);

        req.session.gameId = gameId;
        req.session.save();
    });

    socket.listen('message', function (msg, ws, req) {
        Game.broadcast(msg.room, 'message', _extends({}, msg, {
            type: 'message',
            nick: req.session.nick,
            date: new Date()
        }));
    });

    socket.listen('leave', function (data, ws, req) {
        Game.quit(req.session.gameId, ws);

        req.session.gameId = null;
        req.session.save();
    });

    socket.close(function (code, ws, req) {
        Game.quit(req.session.gameId, ws);
    });
};

module.exports = Game;