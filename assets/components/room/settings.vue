<template>
    <div class="game-content settings">
        <label class="settings-setting">Players <input type="number" min="3" max="20" :value="players" class="input" :disabled="!host" @input="set('players', $event)" @wheel="shift('players', $event)"></label>
        <label class="settings-setting">Score <input type="number" min="2" max="20" :value="score" class="input" :disabled="!host" @input="set('score', $event)" @wheel="shift('score', $event)"></label>

        <ul>
            <li v-for="pack in packs">{{pack.name}}</li>
        </ul>

        <button class="button" @click="startGame">Start game</button>
    </div>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        computed: {
            ...mapState({
                players: state => state.game.settings.players,
                score: state => state.game.settings.score,
                packs: state => state.packs.available
            }),
            host() {
                return this.$store.getters.host=== this.$store.state.player.id;
            }
        },
        methods: {
            set(target, event) {
                if(this.host) {
                    this.$store.dispatch('settings', {
                        [target]: Number(event.target.value)
                    });
                }
            },
            shift(target, event) {
                if(this.host) {
                    this.$store.dispatch('settings', {
                        // increase or decrease value based on scroll direction
                        [target]: Math.min(20, Math.max(3, this[target] + (event.deltaY < 0 ? 1 : -1)))
                    });
                }
            },
            startGame(event) {
                console.log(event);
            }
        },
        mounted() {
            this.$store.dispatch('fetchPacks');
        }
    };
</script>

<style lang="sass">
    @import '../../css/theme';

    .settings-setting {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>
