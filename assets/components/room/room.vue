<template>
    <div class="content">
        <vue-header />

        <div class="room">
            <div class="sidebar">
                <ul class="players">
                    <li v-for="player in players" class="player" :class="{host: player.host}">{{player.nick}}</li>
                </ul>

                <vue-chat />
            </div>

            <div class="game">
                <vue-settings v-if="view === 'config'" />
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {mapState} from 'vuex';

    import Svg from '../svg.vue';
    import Header from './header.vue';
    import Chat from './chat.vue';
    import Settings from './settings.vue';

    export default {
        components: {
            'vue-svg': Svg,
            'vue-header': Header,
            'vue-chat': Chat,
            'vue-settings': Settings
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
        mounted() {
            this.$store.dispatch('joinGame', this.id);
        },
        destroyed() {
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
