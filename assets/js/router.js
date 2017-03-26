'use strict';

import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Home from '../components/home.vue';
import Room from '../components/room.vue';

const routes = [{
    path: '/',
    name: 'home',
    component: Home
}, {
    path: '/room/:id',
    name: 'room',
    component: Room,
    meta: {
        header: false
    }
}];

export default new VueRouter({
    mode: 'history',
    routes
});
