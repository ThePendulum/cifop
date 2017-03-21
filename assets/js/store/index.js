'use strict';

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import game from './game';
import chat from './chat';

export default new Vuex.Store({
    modules: {
        game,
        chat
    }
});
