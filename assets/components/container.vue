<template>
    <div class="container">
        <vue-header v-if="header" />

        <div class="content">
            <router-view />
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
                header: this.$route.meta.header !== false
            };
        },
        watch: {
            '$route': function(to, from) {
                this.header = to.meta.header !== false;
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
        flex-direction: column;
        flex-grow: 1;
        overflow-y: auto;
    }
</style>
