'use strict';

export default function(context) {
    return fetch(window.location.origin + '/api/packs', {
        method: 'GET',
        credentials: 'same-origin'
    }).then(res => res.json()).then(packs => {
        context.commit('setAvailablePacks', packs);

        return packs;
    }).catch(error => {
        console.log(error);
    });
};
