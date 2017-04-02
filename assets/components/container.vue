<template>
    <div class="container">
        <router-view />
    </div>
</template>

<script>
    import Header from './header.vue';
    import RoomHeader from './room/header.vue';

    export default {
        components: {
            'vue-header': Header,
            'vue-room-header': RoomHeader
        },
        computed: {
            header() {
                return this.$route.meta.header;
            }
        }
    };
</script>

<style lang="sass">
    .container {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .content {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        overflow-y: auto;
    }
</style>
