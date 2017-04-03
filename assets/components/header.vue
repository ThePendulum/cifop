<template>
    <div class="header header-body">
        <router-link :to="{name: 'home'}" class="logo"><vue-svg icon="logo" label="Cards in Favor of Profanity" /></router-link>

        <div class="user">{{nick}}</div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';

    import Svg from './svg.vue';

    export default {
        components: {
            'vue-svg': Svg
        },
        data() {
            return {
                room: this.$route.name === 'room' ? this.$route.params.id : null
            };
        },
        computed: {
            ...mapState({
                nick(state) {
                    return state.player.nick;
                }
            })
        },
        watch: {
            '$route': function(route) {
                if(route.name === 'room') {
                    this.room = route.params.id;
                } else {
                    this.room = null;
                }
            }
        }
    };
</script>

<style lang="sass">
    @import '../css/theme';

    .header {
        display: flex;
        flex-shrink: 0;
        justify-content: space-between;
        box-sizing: border-box;
        color: $text-light;
        background: $primary;
        box-shadow: 0 0 3px $shadow;
    }

    .header-body {
        padding: .5rem 1rem;
    }

    .logo {
        display: inline-block;

        .icon {
            width: 4rem;
        }
    }

    .user {
        font-weight: bold;
    }
</style>
