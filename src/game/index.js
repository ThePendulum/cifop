'use strict';

const util = require('util');

const note = require('note-log');
const shortid = require('shortid');
const pick = require('object.pick');

const create = require('./create.js');
const remove = require('./remove.js');
const join = require('./join.js');
const quit = require('./quit.js');
const broadcast = require('./broadcast.js');
const listen = require('./listen.js');

const Game = {};

Game.games = new Map();
Game.create = create(Game);
Game.remove = remove(Game);
Game.join = join(Game);
Game.quit = quit(Game);
Game.broadcast = broadcast(Game);
Game.listen = listen(Game);

module.exports = Game;
