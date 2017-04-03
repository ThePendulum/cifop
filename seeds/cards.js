'use strict';

const util = require('util');
const packs = require('./packs.json');

exports.seed = function(knex, Promise) {
    return Promise.try(() => {
        return knex.schema.createTableIfNotExists('packs', table => {
            table.increments(),
            table.string('name').unique()
        });
    }).then(() => {
        return knex.schema.createTableIfNotExists('cards', table => {
            table.increments(),
            table.text('text'),
            table.integer('pack').notNullable(),
            table.string('type'),
            table.integer('pick')
        });
    }).then(() => {
        return Promise.all(packs.map(pack => {
            return Promise.try(() => {
                return knex('packs').insert({
                    name: pack.name
                }).returning('id');
            }).then(packIds => {
                const packId = packIds[0];

                const black = pack.black.map(card => {
                    card.pack = packId;
                    card.type = 'black';

                    return card;
                });

                const white = pack.white.map(card => {
                    card.pack = packId;
                    card.type = 'white';

                    return card;
                });

                return knex('cards').insert(black.concat(white));
            });
        }));
    });
};
