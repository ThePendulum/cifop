'use strict';

export default {
    addMessage(state, message) {
        state.messages.push(message);
    },
    clearChat(state) {
        state.messages = [];
    }
};
