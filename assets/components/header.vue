<template>
    <div class="header">
        <router-link :to="{name: 'home'}" class="logo"><vue-svg icon="logo" label="Cards in Favor of Profanity" /></router-link>

        <h1 v-if="room" class="header-room">{{room}}</h1>

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
                    return state.game.nick;
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
        justify-content: space-between;
        box-sizing: border-box;
        padding: .5rem 1rem;
        border-bottom: solid 1px $shadow;
    }

    .header-room {
        display: inline-block;
        margin: 0;
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
