'use strict';

var util = require('util');

var note = require('note-log');
var shortid = require('shortid');
var pick = require('object.pick');

var Game = {};

Game.games = new Map();

Game.create = function () {
    var game = {
        id: shortid.generate(),
        players: new Set()
    };

    Game.games.set(game.id, game);

    note('game', 0, 'Game \'' + game.id + '\' created');

    return Promise.resolve(game.id);
};

Game.delete = function (gameId) {
    Game.games.delete(gameId);
    note('game', 0, 'Game \'' + gameId + '\' deleted');
};

Game.join = function (gameId, player) {
    var game = Game.games.get(gameId);

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

        note('game', 0, '\'' + player.nick + '\' (\'' + player.id + '\') joined \'' + game.id + '\'');
    } else if (!game) {
        player.transmit('message', {
            type: 'error',
            text: 'Room does not exist',
            date: new Date()
        });
    }
};

Game.quit = function (gameId, player) {
    var game = Game.games.get(gameId);

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

        note('game', 0, '\'' + player.nick + '\' (\'' + player.id + '\') left \'' + game.id + '\'');

        // e.g. allow last user to refresh page without deleting the game
        setTimeout(function () {
            if (game.players.size === 0) {
                Game.delete(game.id);
            }
        }, 5000);
    }
};

Game.broadcast = function (gameId, namespace, data) {
    if (Game.games.has(gameId)) {
        Game.games.get(gameId).players.forEach(function (player) {
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