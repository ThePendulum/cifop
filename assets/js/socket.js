'use strict';

import store from './store';

const socket = {};
const ws = new WebSocket('ws://' + window.location.hostname + '/socket');

socket.transmit = function(namespace, data, tries = 0) {
    if(ws.readyState === 1) {
        ws.send(JSON.stringify([namespace, data]));
    } else if(tries < 3) {
        setTimeout(() => {
            socket.transmit(namespace, data, tries++)
        }, 500);
    }
};

ws.addEventListener('message', message => {
    const [namespace, data] = JSON.parse(message.data);

    const handlers = {
        message(msg) {
            store.commit('addMessage', msg);
        },
        status(msg) {
            store.commit('addMessage', msg);
        },
        nick(nick) {
            store.commit('nick', nick);
        },
        players(players) {
            store.commit('setPlayers', players);
        },
        settings(settings) {
            store.commit('settings', settings);
        }
    };

    if(handlers[namespace]) {
        handlers[namespace](data);
    }
});

export default socket;
