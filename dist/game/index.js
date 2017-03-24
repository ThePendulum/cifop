'use strict';

var util = require('util');

var note = require('note-log');
var shortid = require('shortid');
var pick = require('object.pick');

var create = require('./create.js');
var remove = require('./remove.js');
var join = require('./join.js');
var quit = require('./quit.js');
var broadcast = require('./broadcast.js');
var listen = require('./listen.js');

var Game = {};

Game.games = new Map();
Game.create = create(Game);
Game.remove = remove(Game);
Game.join = join(Game);
Game.quit = quit(Game);
Game.broadcast = broadcast(Game);
Game.listen = listen(Game);

module.exports = Game;