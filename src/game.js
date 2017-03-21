'use strict';

const util = require('util');

const note = require('note-log');
const shortid = require('shortid');
const pick = require('object.pick');

const games = new Map();
const Game = {};

Game.create = function() {
    const game = {
        id: shortid.generate(),
        players: new Set()
    };

    games.set(game.id, game);

    return Promise.resolve(game.id);
};

Game.join = function(gameId, player) {
    const game = games.get(gameId);

    if(game && !game.players.has(player)) {
        game.players.add(player);

        Game.broadcast(gameId, 'players', Array.from(game.players).map(player => pick(player, ['id', 'nick'])));

        Game.broadcast(gameId, 'message', {
            type: 'status',
            text: player.nick + ' has joined the game',
            date: new Date()
        }, null);
    } else if(!game) {
        player.transmit('message', {
            type: 'error',
            text: 'Room does not exist',
            date: new Date()
        });
    }
};

Game.quit = function(gameId, player) {
    const game = games.get(gameId);

    if(game) {
        game.players.delete(player);

        Game.broadcast(gameId, 'players', Array.from(game.players).map(player => pick(player, ['id', 'nick'])));

        Game.broadcast(gameId, 'message', {
            type: 'status',
            text: player.nick + ' has left the game',
            date: new Date()
        }, null);

        if(game.players.size === 0) {
            games.delete(game.id);
        }
    }
};

Game.broadcast = function(gameId, namespace, data) {
    if(games.has(gameId)) {
        games.get(gameId).players.forEach(player => {
            player.transmit(namespace, data);
        });
    }
};

Game.listen = function(socket) {
    socket.listen('join', (gameId, ws, req) => {
        Game.join(gameId, ws);

        req.session.gameId = gameId;
        req.session.save();
    });

    socket.listen('message', (msg, ws, req) => {
        Game.broadcast(msg.room, 'message', {
            ...msg,
            type: 'message',
            nick: req.session.nick,
            date: new Date()
        });
    });

    socket.listen('leave', (data, ws, req) => {
        Game.quit(req.session.gameId, ws);

        req.session.gameId = null;
        req.session.save();
    });

    socket.close((code, ws, req) => {
        Game.quit(req.session.gameId, ws);
    });
};

module.exports = Game;
