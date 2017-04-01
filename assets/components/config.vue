<template>
    <div class="game-content">
        <label>Players <input type="number" min="3" max="20" :value="players" @input="set('players', $event)" @wheel="shift('players', $event)"></label>
        <label>Score <input type="number" min="2" max="20" :value="score" @input="set('score', $event)" @wheel="shift('score', $event)"></label>
    </div>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        computed: {
            ...mapState({
                players: state => state.game.settings.players,
                score: state => state.game.settings.score
            })
        },
        methods: {
            set(target, event) {
                this.$store.dispatch('settings', {
                    [target]: Number(event.target.value)
                });
            },
            shift(target, event) {
                this.$store.dispatch('settings', {
                    [target]: Math.min(20, Math.max(3, this[target] + (event.deltaY < 0 ? 1 : -1)))
                });
            }
        }
    };
</script>
