<template>
    <div class="icon">
        <div :title="label" class="svg" :class="{active}" v-html="svg"></div>
    </div>
</template>

<script>
    export default {
        props: ['icon', 'label', 'active'],
        data() {
            return {
                svg: null
            };
        },
        beforeMount() {
            this.svg = require('../img/' + this.icon + '.svg');
        }
    };
</script>

<style lang="sass">
    @import '../css/theme';

    .svg {
        fill: $text;
        display: inline-block;
        svg {
            width: 100%;
            height: 100%;
        }
    }
</style>
