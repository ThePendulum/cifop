<template>
    <div class="chat">
        <ul class="chat-messages" ref="chat">
            <li v-for="(message, index) in chat" class="message">
                <div v-if="message.type === 'message'">
                    <div class="message-header" v-if="chat[index - 1] ? chat[index - 1].player !== message.player : true">
                        <span class="message-nick" :class="{me: message.player === me.id}">{{nicks.get(message.player)}}</span>
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
</template>

<script>
    import Vue from 'vue';
    import {mapState} from 'vuex';
    import * as dateFns from 'date-fns';
    import MarkdownIt from 'markdown-it';

    const markdown = new MarkdownIt({
        html: false,
        linkify: true,
        breaks: false
    });

    // open linkified links in new tab, https://github.com/markdown-it/markdown-it/issues/46#issuecomment-83852242
    markdown.renderer.rules.link_open = function(tokens, idx, options, env, self) {
        tokens[idx].attrPush(['target', '_blank']);

        return self.renderToken(tokens, idx, options);
    };

    export default {
        data() {
            return {
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
                },
                me(state) {
                    return state.player;
                }
            }),
            nicks() {
                return this.players.reduce((acc, player) => {
                    acc.set(player.id, player.nick);

                    return acc;
                }, new Map());
            }
        },
        methods: {
            sendMessage(event) {
                this.$store.dispatch('sendMessage', this.message);

                this.message = null;
            },
            autocomplete(event) {
                event.preventDefault();

                const words = this.message.split(' ');

                const match = this.players.find(player => {
                    return player.nick.match(new RegExp('^' + words.slice(-1)[0], 'i'));
                });

                if(match) {
                    if(words.length === 1) {
                        this.message = match.nick + ': ';
                    } else {
                        this.message = `${words.slice(0, -1).join(' ')} ${match.nick} `;
                    }
                }
            },
            format(date, format) {
                return dateFns.format(date, format);
            },
            markdown(text) {
                return markdown.renderInline(text);
            }
        }
    };
</script>

<style lang="sass">
    @import '../../css/theme';

    .chat {
        display: flex;
        flex-direction: column;
        border-top: solid 1px $crease;
        overflow: hidden;

        .input {
            border-top: solid 1px $crease;

            &:not(:focus) {
                box-shadow: none;
            }
        }
    }

    .chat-messages {
        list-style: none;
        position: relative;
        height: 20rem;
        box-sizing: border-box;
        padding: .5rem;
        margin: 0;
        resize: vertical;
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

            &.me {
                color: $primary;
            }
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
