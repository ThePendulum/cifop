<template>
    <div class="game-content">
        <label>Players <input type="number" min="3" max="20" :value="maxPlayers" @input="setMaxPlayers" @wheel="shiftMaxPlayers"></label>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                maxPlayers: 6
            };
        },
        methods: {
            setMaxPlayers(event) {
                this.maxPlayers = Number(event.target.value);
            },
            shiftMaxPlayers(event) {
                this.maxPlayers = Math.min(20, Math.max(3, this.maxPlayers + (event.deltaY < 0 ? 1 : -1)));
            }
        }
    };
</script>
