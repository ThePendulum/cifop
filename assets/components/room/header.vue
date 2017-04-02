<template>
    <div class="header">
        <div class="header-sidebar">
            <router-link :to="{name: 'home'}" class="logo"><vue-svg icon="logo" label="Cards in Favor of Profanity" /></router-link>
            <h2 class="header-room">{{game}}</h2>
        </div>

        <div class="header-body">
            <div class="user">{{nick}}</div>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';

    import Svg from '../svg.vue';

    export default {
        components: {
            'vue-svg': Svg
        },
        computed: {
            ...mapState({
                game: state => state.game.game,
                nick: state => state.game.nick
            })
        }
    };
</script>

<style lang="sass">
    @import '../../css/theme';

    .header-sidebar {
        width: 20rem;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: .5rem 1rem;
        border-right: solid 1px $crease;
    }

    .header-room {
        display: inline-block;
        margin: 0 0 0 1rem;
    }
</style>
