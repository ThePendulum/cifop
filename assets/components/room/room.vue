<template>
    <div class="content">
        <vue-header />

        <div class="room">
            <div class="sidebar">
                <ul class="players">
                    <li v-for="player in players" class="player" :class="{host: player.host}">{{player.nick}}</li>
                </ul>

                <div class="chat">
                    <ul class="chat-messages" ref="chat">
                        <li v-for="(message, index) in chat" class="message">
                            <div v-if="message.type === 'message'">
                                <div class="message-header" v-if="chat[index - 1] ? chat[index - 1].nick !== message.nick : true">
                                    <span class="message-nick">{{message.nick}}</span>
                                    <span class="message-date">{{format(message.date, 'HH:mm')}}</span>
                                </div>

                                <span v-html="markdown(message.text)" class="message-text"></span>
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

                    <input type="text" v-model="message" maxlength="140" placeholder="Chat" class="input" @keypress.enter="sendMessage" @keydown.tab="autocomplete">
                </div>
            </div>

            <div class="game">
                <vue-config v-if="view === 'config'" />
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {mapState} from 'vuex';
    import * as dateFns from 'date-fns';

    import Header from './header.vue';
    import Svg from '../svg.vue';
    import Config from './config.vue';

    import MarkdownIt from 'markdown-it';
    const markdown = new MarkdownIt({
        html: false,
        linkify: true,
        breaks: false
    });

    export default {
        components: {
            'vue-header': Header,
            'vue-svg': Svg,
            'vue-config': Config
        },
        data() {
            return {
                id: this.$route.params.id,
                message: null,
                view: 'config'
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
                this.$store.dispatch('sendMessage', this.message);

                this.message = null;
            },
            autocomplete(event) {
                event.preventDefault();
                console.log(event.target.value);
            },
            format(date, format) {
                return dateFns.format(date, format);
            },
            markdown(text) {
                return markdown.renderInline(text);
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
    @import '../../css/theme';

    .room {
        display: flex;
        flex-grow: 1;
    }

    .game {
        flex-grow: 1;
    }

    .game-content {
        padding: .5rem;
    }

    .sidebar {
        display: flex;
        flex-direction: column;
        width: 20rem;
        box-sizing: border-box;
        border-right: solid 1px $crease;
    }

    .players {
        flex-grow: 1;
        list-style: none;
        padding: .5rem;
        margin: 0;
        line-height: 1.5;
        overflow-y: auto;
    }

    .player {
        &.host {
            font-weight: bold;
        }
    }

    .chat {
        display: flex;
        flex-direction: column;
        height: 20rem;
        border-top: solid 1px $crease;

        .input {
            border-top: solid 1px $crease;

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
        overflow-y: auto;

        .message {
            padding: .25rem 0;
        }

        .message-header {
            display: flex;
            justify-content: space-between;
            margin: 0 0 .25rem;
        }

        .message-text {
            word-wrap: break-word;
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
