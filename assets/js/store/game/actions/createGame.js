'use strict';

export default function(context) {
    return fetch(window.location.origin + '/api/game', {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin'
    }).then(res => res.text()).catch(error => {
        console.log(error);
    });
};
