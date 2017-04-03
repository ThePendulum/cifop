<template>
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
