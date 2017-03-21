<template>
    <div class="content-inner room">
        <div class="game">Cards</div>

        <div class="sidebar">
            <ul class="players">
                <li v-for="player in players" class="player">{{player.nick}}</li>
            </ul>

            <div class="chat">
                <ul class="chat-messages" ref="chat">
                    <li v-for="(message, index) in chat" class="message">
                        <div v-if="message.type === 'message'">
                            <div class="message-header" v-if="chat[index - 1] ? chat[index - 1].nick !== message.nick : true">
                                <span class="message-nick">{{message.nick}}</span>
                                <span class="message-date">{{format(message.date, 'HH:mm')}}</span>
                            </div>

                            {{message.text}}
                        </div>

                        <div v-if="message.type === 'status'">
                            <div class="message-header">
                                <span class="message-status">{{message.text}}</span>
                                <span class="message-date">{{format(message.date, 'HH:mm')}}</span>
                            </div>
                        </div>

                        <div v-if="message.type === 'error'">
                            <div class="message-header">
                                <span class="message-error">{{message.text}}</span>
                                <span class="message-date">{{format(message.date, 'HH:mm')}}</span>
                            </div>
                        </div>
                    </li>
                </ul>

                <input type="text" v-model="message" placeholder="Chat" class="input" @keypress.enter="sendMessage" @keydown.tab="autocomplete">
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {mapState} from 'vuex';
    import * as dateFns from 'date-fns';

    export default {
        data() {
            return {
                id: this.$route.params.id,
                message: null
            };
        },
        computed: {
            ...mapState({
                chat(state) {
                    if(this.$refs.chat) {
                        Vue.nextTick(() => {
                            this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight;
                        });
                    }

                    return state.chat.messages;
                },
                players(state) {
                    return state.game.players;
                }
            })
        },
        methods: {
            sendMessage(event) {
                this.$store.dispatch('sendMessage', {
                    room: this.id,
                    text: this.message
                });

                this.message = null;
            },
            autocomplete(event) {
                event.preventDefault();
                console.log(event.target.value);
            },
            format(date, format) {
                return dateFns.format(date, format);
            }
        },
        mounted() {
            this.$store.dispatch('joinGame', this.id);
        },
        destroyed() {
            this.$store.commit('clearChat');
            this.$store.commit('clearPlayers');

            this.$store.dispatch('leaveGame');
        }
    };
</script>

<style lang="sass">
    @import '../css/theme';

    .room {
        display: flex;
        flex-grow: 1;
    }

    .game {
        flex-grow: 1;
    }

    .sidebar {
        display: flex;
        flex-direction: column;
        border-left: solid 1px $shadow;
    }

    .players {
        flex-grow: 1;
        list-style: none;
        padding: .5rem;
        margin: 0;
        line-height: 1.5;
    }

    .chat {
        display: flex;
        flex-direction: column;
        width: 20rem;
        height: 20rem;
        border-top: solid 1px $shadow;

        .input {
            border-top: solid 1px $shadow;

            &:not(:focus) {
                box-shadow: none;
            }
        }
    }

    .chat-messages {
        flex-grow: 1;
        list-style: none;
        box-sizing: border-box;
        padding: .5rem;
        margin: 0;
        line-height: 1.5;
        overflow-y: auto;

        .message-header {
            display: flex;
            justify-content: space-between;
        }

        .message-date {
            color: $grey;
        }

        .message-nick {
            font-weight: bold;
        }

        .message-status {
            color: $secondary;
        }

        .message-error {
            color: $error;
            font-weight: bold;
        }
    }
</style>
