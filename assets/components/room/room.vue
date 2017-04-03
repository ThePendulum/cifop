<template>
    <div class="content">
        <vue-header />

        <div class="room">
            <div class="sidebar">
                <ul class="players">
                    <li v-for="player in players" class="player">
                        <span class="player-nick" :class="{host: player.host, me: player.id === me.id}">{{player.nick}}</span>

                        <span class="player-flags">
                            <span v-if="player.id === me.id" class="flag">me</span>
                            <span v-if="player.host" class="flag">host</span>
                        </span>
                    </li>
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
                },
                me(state) {
                    return state.player;
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
        list-style: none;
        flex-grow: 1;
        padding: .5rem;
        margin: 0;
        line-height: 1.5;
        overflow-y: auto;
    }

    .player {
        display: flex;
        justify-content: space-between;
        padding: .25rem 0;

        .flag {
            padding: .25rem;
            font-size: .75rem;
            color: $text-light;
            background: $primary;
            border-radius: 2px;
        }
    }

    .player-nick {
        &.me {
            color: $primary;
        }

        &.host {
            color: $secondary;
        }
    }
</style>
