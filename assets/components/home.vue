<template>
    <div class="content">
        <vue-header />

        <div class="home">
            <button v-if="!redirecting" class="button newgame" @click="createGame">New game</button>
        </div>
    </div>
</template>

<script>
    import Header from './header.vue';

    export default {
        components: {
            'vue-header': Header
        },
        data() {
            return {
                redirecting: false
            };
        },
        methods: {
            createGame(event) {
                this.redirecting = true;

                this.$store.dispatch('createGame').then(gameId => {
                    this.$router.push({
                        name: 'room',
                        params: {
                            id: gameId
                        }
                    });
                });
            }
        }
    };
</script>

<style lang="sass">
    @import '../css/theme';

    .home {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex-grow: 1;

        .copy {
            font-size: 3rem;
        }
    }

    .newgame {
        padding: 2rem;
        border-radius: 1rem;
        font-size: 2rem;
    }
</style>
