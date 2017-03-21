<template>
    <div class="home">
        <button v-if="!redirecting" class="newgame" @click="createGame">New game</button>
    </div>
</template>

<script>
    export default {
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
        display: inline-block;
        box-sizing: border-box;
        padding: 2rem;
        border: none;
        border-radius: 1rem;
        color: $text-light;
        background: $secondary;
        box-shadow: 0 .5rem 0 0 $secondary-shadow;
        font-size: 2rem;
        font-weight: bold;
        text-decoration: none;
        text-shadow: 1px 1px 0 $secondary-light, -1px -1px 0 $secondary-shadow;
        cursor: pointer;
    }
</style>
