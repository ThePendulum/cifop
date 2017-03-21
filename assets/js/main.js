'use strict';

import 'normalize.css';
import '../css/style.scss';

import 'babel-polyfill';

import Vue from 'vue';

import router from './router.js';
import store from './store';

import Container from '../components/container.vue';

new Vue({
    el: '#container',
    router,
    store,
    render(createElement) {
        return createElement(Container);
    }
});
